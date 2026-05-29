import type { D1Database } from '@cloudflare/workers-types'
import { Hono } from 'hono'
import { handle } from 'hono/cloudflare-pages'
import { sign, verify } from 'hono/jwt'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'

type Bindings = {
  DB: D1Database
  GOOGLE_CLIENT_ID: string
  GOOGLE_CLIENT_SECRET: string
  JWT_SECRET: string
  ADMIN_EMAILS?: string
}

type Variables = {
  user: any
}

const app = new Hono<{ Bindings: Bindings, Variables: Variables }>().basePath('/api')

// --- Middleware for Auth ---
app.use('/*', async (c, next) => {
  const path = c.req.path;
  // Public routes
  if (path.startsWith('/api/auth/login') || path.startsWith('/api/auth/callback') || path.startsWith('/api/stats')) {
    return next();
  }

  const token = getCookie(c, 'auth_token');
  if (!token) {
    if (path === '/api/auth/me') return c.json({ user: null });
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const payload = await verify(token, c.env.JWT_SECRET, 'HS256');
    c.set('user', payload);
    return next();
  } catch (e) {
    if (path === '/api/auth/me') return c.json({ user: null });
    return c.json({ error: 'Unauthorized' }, 401);
  }
});

// --- Auth Routes ---
app.get('/auth/login', (c) => {
  let origin = new URL(c.req.url).origin;
  if (origin.includes('127.0.0.1:8788')) {
    origin = 'http://localhost:3000';
  }
  const redirectUri = origin + '/api/auth/callback';
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${c.env.GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=email profile&access_type=offline&prompt=select_account`;
  return c.redirect(url);
});

app.get('/auth/callback', async (c) => {
  const code = c.req.query('code');
  if (!code) return c.json({ error: 'No code provided' }, 400);

  let origin = new URL(c.req.url).origin;
  if (origin.includes('127.0.0.1:8788')) {
    origin = 'http://localhost:3000';
  }
  const redirectUri = origin + '/api/auth/callback';
  
  try {
    // 1. Get tokens from Google
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: c.env.GOOGLE_CLIENT_ID,
        client_secret: c.env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri
      })
    });
    
    const tokenData: any = await tokenRes.json();
    if (tokenData.error) throw new Error(tokenData.error_description);

    // 2. Get user info
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });
    const userData: any = await userRes.json();

    // 3. Upsert user in D1 based on EMAIL (allows admin to pre-register users)
    const db = c.env.DB;
    const existingUser = await db.prepare('SELECT * FROM users WHERE email = ?').bind(userData.email).first();
    
    const adminEmailsStr = c.env.ADMIN_EMAILS || 'p.e.muryadi@gmail.com,arekgresikid@gmail.com,arekgresik@gmail.com';
    const adminEmails = adminEmailsStr.split(',').map((e: string) => e.trim());
    const isAdmin = adminEmails.includes(userData.email);
    let role = isAdmin ? 'owner' : 'siswa';
    let initialTier = isAdmin ? 'Titan' : 'Free';
    
    if (!existingUser) {
      await db.prepare(
        `INSERT INTO users (uid, email, displayName, photoURL, role, tier, createdAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        userData.id, userData.email, userData.name, userData.picture, role, initialTier, new Date().toISOString()
      ).run();
    } else {
      // Update uid (if pre-registered), photo, and name
      await db.prepare(
        `UPDATE users SET uid = ?, photoURL = ?, displayName = COALESCE(?, displayName) WHERE email = ?`
      ).bind(userData.id, userData.picture, userData.name, userData.email).run();
    }

    // 4. Set JWT cookie
    const jwtPayload = {
      uid: userData.id,
      email: userData.email,
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) // 7 days
    };
    const token = await sign(jwtPayload, c.env.JWT_SECRET);
    
    setCookie(c, 'auth_token', token, {
      path: '/',
      secure: true,
      httpOnly: true,
      sameSite: 'Lax',
      maxAge: 60 * 60 * 24 * 7
    });

    // 5. Redirect back to app
    return c.redirect('/');
  } catch (error: any) {
    console.error('OAuth error:', error);
    return c.json({ error: 'OAuth failed', details: error.message, stack: error.stack }, 500);
  }
});

app.get('/auth/me', async (c) => {
  const user = c.get('user');
  if (!user) return c.json({ user: null });
  
  const db = c.env.DB;
  let profile = await db.prepare('SELECT * FROM users WHERE uid = ?').bind(user.uid).first();
  
  if (profile) {
    const adminEmailsStr = c.env.ADMIN_EMAILS || 'p.e.muryadi@gmail.com,arekgresikid@gmail.com,arekgresik@gmail.com';
    const adminEmails = adminEmailsStr.split(',').map((e: string) => e.trim());
    const isAdmin = adminEmails.includes(profile.email as string);
    
    // Auto-upgrade admins to owner and Titan tier
    if (isAdmin && (profile.role !== 'owner' || profile.tier !== 'Titan')) {
      await db.prepare('UPDATE users SET role = ?, tier = ? WHERE uid = ?')
        .bind('owner', 'Titan', user.uid)
        .run();
      profile = await db.prepare('SELECT * FROM users WHERE uid = ?').bind(user.uid).first();
    }

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    if (profile.lastResetDate !== today && profile.tier === 'Free') {
      await db.prepare('UPDATE users SET tokens = 5, lastResetDate = ? WHERE uid = ?')
        .bind(today, user.uid)
        .run();
      profile = await db.prepare('SELECT * FROM users WHERE uid = ?').bind(user.uid).first();
    }

    // Check activeUntil for subscription expiration
    if (profile.activeUntil && profile.tier !== 'Free' && profile.role !== 'owner') {
      const activeUntilDate = new Date(profile.activeUntil as string);
      const now = new Date();
      if (now > activeUntilDate) {
        // Subscription expired, revert to Free
        await db.prepare('UPDATE users SET tier = ?, activeUntil = NULL WHERE uid = ?')
          .bind('Free', user.uid)
          .run();
        profile = await db.prepare('SELECT * FROM users WHERE uid = ?').bind(user.uid).first();
      }
    }
  }
  
  return c.json({ user, profile });
});

app.post('/auth/logout', (c) => {
  deleteCookie(c, 'auth_token', { path: '/' });
  return c.json({ success: true });
});

// --- Profile Routes ---
app.post('/profile', async (c) => {
  const user = c.get('user');
  const body = await c.req.json();
  const db = c.env.DB;

  // Dynamically build update query
  const keys = Object.keys(body).filter(k => ['displayName', 'nip', 'jenjang', 'tahunPelajaran', 'namaSekolah', 'kepalaSekolah', 'jenisNipKepalaSekolah', 'nipKepalaSekolah', 'jenisNipGuru', 'tokens', 'lastResetDate'].includes(k));
  
  if (keys.length === 0) return c.json({ success: true });

  const setClause = keys.map(k => `${k} = ?`).join(', ');
  const values = keys.map(k => body[k]);
  values.push(user.uid);

  await db.prepare(`UPDATE users SET ${setClause} WHERE uid = ?`).bind(...values).run();
  
  return c.json({ success: true });
});

// --- Admin Routes ---
app.get('/admin/users', async (c) => {
  const user = c.get('user');
  if (!user) return c.json({ error: 'Unauthorized' }, 401);
  
  const db = c.env.DB;
  const adminProfile = await db.prepare('SELECT role FROM users WHERE uid = ?').bind(user.uid).first();
  if (!adminProfile || (adminProfile.role !== 'owner' && adminProfile.role !== 'admin')) {
    return c.json({ error: 'Forbidden' }, 403);
  }

  const { results } = await db.prepare('SELECT uid, email, displayName, role, tier, activeUntil, createdAt FROM users ORDER BY createdAt DESC').all();
  return c.json(results);
});

app.put('/admin/users/:uid', async (c) => {
  const user = c.get('user');
  if (!user) return c.json({ error: 'Unauthorized' }, 401);
  
  const db = c.env.DB;
  const adminProfile = await db.prepare('SELECT role FROM users WHERE uid = ?').bind(user.uid).first();
  if (!adminProfile || (adminProfile.role !== 'owner' && adminProfile.role !== 'admin')) {
    return c.json({ error: 'Forbidden' }, 403);
  }

  const targetUid = c.req.param('uid');
  const body = await c.req.json();
  const { role, tier, activeUntil } = body;

  // Build dynamic update for role, tier, activeUntil
  const updates = [];
  const values = [];
  if (role !== undefined) { updates.push('role = ?'); values.push(role); }
  if (tier !== undefined) { updates.push('tier = ?'); values.push(tier); }
  if (activeUntil !== undefined) { updates.push('activeUntil = ?'); values.push(activeUntil === '' ? null : activeUntil); }

  if (updates.length > 0) {
    values.push(targetUid);
    await db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE uid = ?`).bind(...values).run();
  }

  return c.json({ success: true });
});

app.post('/admin/users', async (c) => {
  const user = c.get('user');
  if (!user) return c.json({ error: 'Unauthorized' }, 401);
  
  const db = c.env.DB;
  const adminProfile = await db.prepare('SELECT role FROM users WHERE uid = ?').bind(user.uid).first();
  if (!adminProfile || (adminProfile.role !== 'owner' && adminProfile.role !== 'admin')) {
    return c.json({ error: 'Forbidden' }, 403);
  }

  const body = await c.req.json();
  const { email, role, tier, activeUntil } = body;
  
  if (!email) return c.json({ error: 'Email is required' }, 400);

  const existing = await db.prepare('SELECT * FROM users WHERE email = ?').bind(email).first();
  if (existing) {
    return c.json({ error: 'Email already exists' }, 400);
  }

  const tempUid = 'pending-' + Date.now();
  await db.prepare(
    `INSERT INTO users (uid, email, role, tier, activeUntil, createdAt) VALUES (?, ?, ?, ?, ?, ?)`
  ).bind(
    tempUid, email, role || 'siswa', tier || 'Free', activeUntil || null, new Date().toISOString()
  ).run();

  return c.json({ success: true });
});

app.delete('/admin/users/:uid', async (c) => {
  const user = c.get('user');
  if (!user) return c.json({ error: 'Unauthorized' }, 401);
  
  const db = c.env.DB;
  const adminProfile = await db.prepare('SELECT role FROM users WHERE uid = ?').bind(user.uid).first();
  if (!adminProfile || (adminProfile.role !== 'owner' && adminProfile.role !== 'admin')) {
    return c.json({ error: 'Forbidden' }, 403);
  }

  const targetUid = c.req.param('uid');
  if (targetUid === user.uid) {
    return c.json({ error: 'Cannot delete yourself' }, 400);
  }

  await db.prepare('DELETE FROM users WHERE uid = ?').bind(targetUid).run();
  return c.json({ success: true });
});

// --- Token Routes ---
app.post('/tokens/use', async (c) => {
  const user = c.get('user');
  
  // Local bypass on the backend as well
  const origin = new URL(c.req.url).origin;
  if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
    return c.json({ success: true, tokens: 999 });
  }

  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  const db = c.env.DB;
  try {
    const profile = await db.prepare('SELECT * FROM users WHERE uid = ?').bind(user.uid).first();
    
    if (!profile) return c.json({ error: 'User not found' }, 404);
    
    // Owner and Pro tier bypass token limits
    if (profile.role === 'owner' || profile.tier !== 'Free') {
      return c.json({ success: true, tokens: profile.tokens });
    }

    if ((profile.tokens as number) <= 0) {
      return c.json({ error: 'Out of tokens' }, 403);
    }

    await db.prepare('UPDATE users SET tokens = tokens - 1, tokensUsed = tokensUsed + 1 WHERE uid = ?')
      .bind(user.uid)
      .run();
      
    return c.json({ success: true, tokens: (profile.tokens as number) - 1 });
  } catch (error) {
    console.error("D1 Error:", error);
    // Fallback if table doesn't exist
    return c.json({ success: true, tokens: 999 });
  }
});

// --- Stats Routes ---
app.get('/stats', async (c) => {
  const db = c.env.DB;
  const stats = await db.prepare('SELECT favorites FROM stats WHERE id = ?').bind('stats').first();
  return c.json({ favorites: stats?.favorites || 0 });
});

app.post('/stats/increment', async (c) => {
  const db = c.env.DB;
  await db.prepare('UPDATE stats SET favorites = favorites + 1 WHERE id = ?').bind('stats').run();
  return c.json({ success: true });
});

// --- Logs Routes ---
app.get('/logs', async (c) => {
  const db = c.env.DB;
  const { results } = await db.prepare('SELECT * FROM activity_logs ORDER BY timestamp DESC LIMIT 5').all();
  return c.json(results);
});

app.post('/logs', async (c) => {
  const body = await c.req.json();
  const db = c.env.DB;
  const now = new Date();
  
  await db.prepare(
    `INSERT INTO activity_logs (msg, status, color, time, timestamp) VALUES (?, ?, ?, ?, ?)`
  ).bind(
    body.msg, 
    body.status, 
    body.color, 
    now.toLocaleTimeString('en-US', { hour12: false }), 
    now.getTime()
  ).run();
  
  return c.json({ success: true });
});

export const onRequest = handle(app)

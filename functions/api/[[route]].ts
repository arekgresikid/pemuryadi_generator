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
  if (path.startsWith('/api/auth/login') || path.startsWith('/api/auth/callback') || path.startsWith('/api/stats') || path.startsWith('/api/settings')) {
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
  const state = crypto.randomUUID();
  setCookie(c, 'oauth_state', state, { path: '/', secure: true, httpOnly: true, maxAge: 600 });
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${c.env.GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=email profile&access_type=offline&prompt=select_account&state=${state}`;
  return c.redirect(url);
});

app.get('/auth/callback', async (c) => {
  const code = c.req.query('code');
  if (!code) return c.json({ error: 'No code provided' }, 400);

  const state = c.req.query('state');
  const savedState = getCookie(c, 'oauth_state');
  if (!state || !savedState || state !== savedState) {
    return c.json({ error: 'Invalid state parameter for CSRF protection' }, 400);
  }
  deleteCookie(c, 'oauth_state', { path: '/' });

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
      // Default to 2 tokens for Free tier, or 999999 if admin
      let initialTokens = isAdmin ? 999999 : 2;
      
      await db.prepare(
        `INSERT INTO users (uid, email, displayName, photoURL, role, tier, tokens, createdAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        userData.id, userData.email, userData.name, userData.picture, role, initialTier, initialTokens, new Date().toISOString()
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
    return c.json({ error: 'OAuth failed', details: error.message }, 500);
  }
});

app.get('/auth/me', async (c) => {
  const user = c.get('user');
  if (!user) return c.json({ user: null });
  
  const db = c.env.DB;
  let profile = await db.prepare('SELECT * FROM users WHERE uid = ?').bind(user.uid).first();
  
  if (profile) {
    const adminEmailsStr = c.env.ADMIN_EMAILS || 'p.e.muryadi@gmail.com,arekgresikid@gmail.com';
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
      await db.prepare('UPDATE users SET tokens = 2, lastResetDate = ? WHERE uid = ?')
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
  const keys = Object.keys(body).filter(k => ['displayName', 'nip', 'jenjang', 'tahunPelajaran', 'namaSekolah', 'kepalaSekolah', 'jenisNipKepalaSekolah', 'nipKepalaSekolah', 'jenisNipGuru'].includes(k));
  
  if (keys.length === 0) return c.json({ success: true });

  const setClause = keys.map(k => `${k} = ?`).join(', ');
  const values = keys.map(k => body[k]);
  values.push(user.uid);

  await db.prepare(`UPDATE users SET ${setClause} WHERE uid = ?`).bind(...values).run();
  
  return c.json({ success: true });
});

// --- Admin Routes ---
app.get('/admin/stats', async (c) => {
  const user = c.get('user');
  if (!user) return c.json({ error: 'Unauthorized' }, 401);
  
  const db = c.env.DB;
  const adminProfile = await db.prepare('SELECT role FROM users WHERE uid = ?').bind(user.uid).first();
  if (!adminProfile || ((adminProfile.role as string)?.toLowerCase() !== 'owner' && (adminProfile.role as string)?.toLowerCase() !== 'admin')) {
    return c.json({ error: 'Forbidden' }, 403);
  }

  const result = await db.prepare(`
    SELECT 
      COUNT(*) as totalUsers,
      SUM(CASE WHEN tier = 'Premium' THEN 1 ELSE 0 END) as totalPremium,
      SUM(CASE WHEN tier = 'Ultimate' THEN 1 ELSE 0 END) as totalUltimate,
      SUM(CASE WHEN tier = 'Titan' THEN 1 ELSE 0 END) as totalTitan
    FROM users
  `).first();
  
  return c.json(result);
});

app.get('/admin/logs', async (c) => {
  const user = c.get('user');
  if (!user) return c.json({ error: 'Unauthorized' }, 401);
  
  const db = c.env.DB;
  const adminProfile = await db.prepare('SELECT role FROM users WHERE uid = ?').bind(user.uid).first();
  if (!adminProfile || ((adminProfile.role as string)?.toLowerCase() !== 'owner' && (adminProfile.role as string)?.toLowerCase() !== 'admin')) {
    return c.json({ error: 'Forbidden' }, 403);
  }

  await db.prepare('CREATE TABLE IF NOT EXISTS admin_logs (id INTEGER PRIMARY KEY AUTOINCREMENT, admin_email TEXT, action TEXT, created_at TEXT)').run();
  const { results } = await db.prepare('SELECT * FROM admin_logs ORDER BY id DESC LIMIT 100').all();
  return c.json(results);
});

app.post('/admin/logs', async (c) => {
  const user = c.get('user');
  if (!user) return c.json({ error: 'Unauthorized' }, 401);
  
  const db = c.env.DB;
  const adminProfile = await db.prepare('SELECT role, email FROM users WHERE uid = ?').bind(user.uid).first();
  if (!adminProfile || ((adminProfile.role as string)?.toLowerCase() !== 'owner' && (adminProfile.role as string)?.toLowerCase() !== 'admin')) {
    return c.json({ error: 'Forbidden' }, 403);
  }

  const { action } = await c.req.json();
  if (!action) return c.json({ error: 'Action is required' }, 400);
  
  await db.prepare('CREATE TABLE IF NOT EXISTS admin_logs (id INTEGER PRIMARY KEY AUTOINCREMENT, admin_email TEXT, action TEXT, created_at TEXT)').run();
  await db.prepare('INSERT INTO admin_logs (admin_email, action, created_at) VALUES (?, ?, ?)')
    .bind(adminProfile.email, action, new Date().toISOString())
    .run();
  return c.json({ success: true });
});

app.get('/admin/users', async (c) => {
  const user = c.get('user');
  if (!user) return c.json({ error: 'Unauthorized' }, 401);
  
  const db = c.env.DB;
  const adminProfile = await db.prepare('SELECT role FROM users WHERE uid = ?').bind(user.uid).first();
  if (!adminProfile || ((adminProfile.role as string)?.toLowerCase() !== 'owner' && (adminProfile.role as string)?.toLowerCase() !== 'admin')) {
    return c.json({ error: 'Forbidden' }, 403);
  }

  try {
    const { results } = await db.prepare('SELECT * FROM users ORDER BY createdAt DESC').all();
    return c.json(results);
  } catch (e: any) {
    try {
      // Fallback if createdAt doesn't exist in production yet
      const { results } = await db.prepare('SELECT * FROM users ORDER BY uid DESC').all();
      return c.json(results);
    } catch (e2: any) {
      return c.json({ error: e2.message }, 500);
    }
  }
});

app.put('/admin/users/:uid', async (c) => {
  const user = c.get('user');
  if (!user) return c.json({ error: 'Unauthorized' }, 401);
  
  const db = c.env.DB;
  const adminProfile = await db.prepare('SELECT role FROM users WHERE uid = ?').bind(user.uid).first();
  if (!adminProfile || ((adminProfile.role as string)?.toLowerCase() !== 'owner' && (adminProfile.role as string)?.toLowerCase() !== 'admin')) {
    return c.json({ error: 'Forbidden' }, 403);
  }

  const targetUid = c.req.param('uid');
  const body = await c.req.json();
  const { role, tier, activeUntil, displayName } = body;

  // Build dynamic update for role, tier, activeUntil, displayName
  const updates = [];
  const values = [];
  if (role !== undefined) { updates.push('role = ?'); values.push(role); }
  if (tier !== undefined) { updates.push('tier = ?'); values.push(tier); }
  if (activeUntil !== undefined) { updates.push('activeUntil = ?'); values.push(activeUntil === '' ? null : activeUntil); }
  if (displayName !== undefined) { updates.push('displayName = ?'); values.push(displayName); }

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
  if (!adminProfile || ((adminProfile.role as string)?.toLowerCase() !== 'owner' && (adminProfile.role as string)?.toLowerCase() !== 'admin')) {
    return c.json({ error: 'Forbidden' }, 403);
  }

  const body = await c.req.json();
  const { email, displayName, role, tier, activeUntil } = body;
  
  if (!email) return c.json({ error: 'Email is required' }, 400);

  const existing = await db.prepare('SELECT * FROM users WHERE email = ?').bind(email).first();
  if (existing) {
    return c.json({ error: 'Email already exists' }, 400);
  }

  const tempUid = 'pending-' + Date.now();
  let initialTokens = 0;
  if (role === 'owner' || role === 'admin') initialTokens = 999999;
  else if (tier === 'Titan') initialTokens = 2500;
  else if (tier === 'Supreme' || tier === 'SUPREME') initialTokens = 1000;
  else if (tier === 'Ultimate') initialTokens = 600;
  else if (tier === 'Premium') initialTokens = 250;
  else if (tier === 'Essential') initialTokens = 85;
  else if (tier === 'Free') initialTokens = 2;
  
  await db.prepare(
    `INSERT INTO users (uid, email, displayName, role, tier, tokens, activeUntil, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    tempUid, email, displayName || null, role || 'siswa', tier || 'Free', initialTokens, activeUntil || null, new Date().toISOString()
  ).run();

  return c.json({ success: true });
});

app.delete('/admin/users/:uid', async (c) => {
  const user = c.get('user');
  if (!user) return c.json({ error: 'Unauthorized' }, 401);
  
  const db = c.env.DB;
  const adminProfile = await db.prepare('SELECT role FROM users WHERE uid = ?').bind(user.uid).first();
  if (!adminProfile || ((adminProfile.role as string)?.toLowerCase() !== 'owner' && (adminProfile.role as string)?.toLowerCase() !== 'admin')) {
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
  if (origin === 'http://localhost:3000' || origin === 'http://127.0.0.1:8788' || origin === 'http://localhost:8788') {
    return c.json({ success: true, tokens: 999 });
  }

  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  const db = c.env.DB;
  try {
    const profile = await db.prepare('SELECT * FROM users WHERE uid = ?').bind(user.uid).first();
    
    if (!profile) return c.json({ error: 'User not found' }, 404);
    
    // Privileged roles bypass token limits completely
    const role = String(profile.role || 'siswa').toLowerCase();
    const tier = String(profile.tier || 'free').toLowerCase();
    const isFree = tier === 'free';
    
    if (role === 'owner' || role === 'admin') {
      return c.json({ success: true, tokens: profile.tokens, isFree: false });
    }

    if ((profile.tokens as number) <= 0) {
      return c.json({ error: 'Out of tokens' }, 403);
    }

    await db.prepare('UPDATE users SET tokens = tokens - 1, tokensUsed = tokensUsed + 1 WHERE uid = ?')
      .bind(user.uid)
      .run();
      
    return c.json({ success: true, tokens: (profile.tokens as number) - 1, isFree: isFree });
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

// --- Image Generation Proxy ---
app.get('/generate-image', async (c) => {
  const prompt = c.req.query('prompt');
  const model = c.req.query('model') || 'nanobana';
  const seed = c.req.query('seed') || Math.floor(Math.random() * 1000000);
  
  if (!prompt) {
    return c.json({ error: 'Prompt is required' }, 400);
  }

  const encodedPrompt = encodeURIComponent(prompt);
  const apiKey = (c.env as any).POLLINATIONS_API_KEY || (c.env as any).VITE_POLLINATIONS_API_KEY || "";
  
  try {
    const imageResponse = await fetch(`https://gen.pollinations.ai/image/${encodedPrompt}?model=${model}&seed=${seed}`, {
      headers: apiKey ? {
        'Authorization': `Bearer ${apiKey}`
      } : {}
    });

    if (!imageResponse.ok) {
      return c.json({ error: 'Image generation failed', status: imageResponse.status }, imageResponse.status as any);
    }

    const arrayBuffer = await imageResponse.arrayBuffer();
    return c.body(arrayBuffer, 200, {
      'Content-Type': imageResponse.headers.get('Content-Type') || 'image/jpeg',
      'Cache-Control': 'public, max-age=31536000'
    });
  } catch (err: any) {
    return c.json({ error: 'Internal server error', details: err.message }, 500);
  }
});

// --- Text Generation Proxy ---
app.post('/chat/completions', async (c) => {
  const body = await c.req.json();
  const apiKey = (c.env as any).POLLINATIONS_API_KEY || (c.env as any).VITE_POLLINATIONS_API_KEY || "";
  
  try {
    const response = await fetch('https://gen.pollinations.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {})
      },
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
       return c.json({ error: 'AI generation failed', status: response.status }, response.status as any);
    }
    
    const data = await response.json();
    return c.json(data);
  } catch (err: any) {
    return c.json({ error: 'Internal server error', details: err.message }, 500);
  }
});

// --- OpenAI Images Proxy ---
app.post('/images/generations', async (c) => {
  const body = await c.req.json();
  const apiKey = (c.env as any).POLLINATIONS_API_KEY || (c.env as any).VITE_POLLINATIONS_API_KEY || "";
  
  try {
    const response = await fetch('https://gen.pollinations.ai/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {})
      },
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
       return c.json({ error: 'AI image generation failed', status: response.status }, response.status as any);
    }
    
    const data = await response.json();
    return c.json(data);
  } catch (err: any) {
    return c.json({ error: 'Internal server error', details: err.message }, 500);
  }
});

// --- Secret Dev Mode Proxy ---
app.post('/verify-dev-mode', async (c) => {
  const body = await c.req.json();
  const validPassword = (c.env as any).DEV_PASSWORD || 'ruangriungdev'; // Fallback for local if not set
  if (body.password === validPassword) {
    return c.json({ success: true });
  }
  return c.json({ success: false }, 401);
});

// --- Settings Routes ---
app.get('/settings/:key', async (c) => {
  try {
    const db = c.env.DB;
    await db.prepare('CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT)').run();
    const key = c.req.param('key');
    const result = await db.prepare('SELECT value FROM settings WHERE key = ?').bind(key).first();
    return c.json({ value: result ? result.value : null });
  } catch (e) {
    return c.json({ error: 'Failed to fetch setting' }, 500);
  }
});

app.post('/admin/settings', async (c) => {
  const user = c.get('user');
  if (!user) return c.json({ error: 'Unauthorized' }, 401);
  const db = c.env.DB;
  
  const profile = await db.prepare('SELECT * FROM users WHERE uid = ?').bind(user.uid).first();
  if (profile?.role !== 'owner' && profile?.role !== 'admin') {
    return c.json({ error: 'Forbidden' }, 403);
  }

  const { key, value } = await c.req.json();
  if (!key) return c.json({ error: 'Key is required' }, 400);

  try {
    await db.prepare('CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT)').run();
    await db.prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = ?')
      .bind(key, value, value)
      .run();
    return c.json({ success: true, key, value });
  } catch (e) {
    return c.json({ error: 'Failed to save setting' }, 500);
  }
});

export const onRequest = handle(app)

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

let _schemaEnsured = false;
async function ensureDbSchema(db: D1Database) {
  if (_schemaEnsured) return;
  try {
    const info = await db.prepare("PRAGMA table_info(users)").all();
    const cols = (info && (info as any).results) || [];
    const hasActiveUntil = cols.some((c: any) => c.name === 'activeUntil');
    const hasIsBanned = cols.some((c: any) => c.name === 'isBanned');
    const hasLastActive = cols.some((c: any) => c.name === 'lastActive');
    const hasSuspendedUntil = cols.some((c: any) => c.name === 'suspendedUntil');
    
    try {
      if (!hasActiveUntil) await db.prepare("ALTER TABLE users ADD COLUMN activeUntil TEXT").run();
      if (!hasIsBanned) await db.prepare("ALTER TABLE users ADD COLUMN isBanned INTEGER DEFAULT 0").run();
      if (!hasLastActive) await db.prepare("ALTER TABLE users ADD COLUMN lastActive TEXT").run();
      if (!hasSuspendedUntil) await db.prepare("ALTER TABLE users ADD COLUMN suspendedUntil TEXT").run();
      const hasLogoUrl = cols.some((c: any) => c.name === 'logoUrl');
      if (!hasLogoUrl) await db.prepare("ALTER TABLE users ADD COLUMN logoUrl TEXT").run();
      await db.prepare(`CREATE TABLE IF NOT EXISTS token_usage_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uid TEXT NOT NULL,
        action TEXT NOT NULL,
        tokens_spent INTEGER NOT NULL,
        timestamp TEXT NOT NULL
      )`).run();
    } catch (e) {
      console.error('Failed to update columns:', e);
    }
  } catch (e) {
    // If PRAGMA fails, don't block the app; log and continue
    console.error('Failed to ensure DB schema:', e);
  }
  _schemaEnsured = true;
}

// --- Middleware for Auth ---
app.use('/*', async (c, next) => {
  const path = c.req.path;
  try {
    await ensureDbSchema(c.env.DB as D1Database);
  } catch (e) {
    // ignore
  }

  // Local Development Bypass
  const url = new URL(c.req.url);
  const isLocal = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  
  if (isLocal) {
    try {
      const db = c.env.DB as D1Database;
      const existing = await db.prepare('SELECT uid FROM users WHERE uid = ?').bind('local-dev-user').first();
      if (!existing) {
        await db.prepare(
          `INSERT INTO users (uid, email, displayName, role, tier, tokens, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)`
        ).bind(
          'local-dev-user', 'local@dev.com', 'Local Developer', 'owner', 'Titan', 999999, new Date().toISOString()
        ).run();
      }
    } catch (e) {
      // ignore
    }
  }
  // Public routes
  if (path.startsWith('/api/auth/login') || path.startsWith('/api/auth/native-login') || path.startsWith('/api/auth/callback') || path.startsWith('/api/stats') || path.startsWith('/api/settings')) {
    return next();
  }

  const token = getCookie(c, 'auth_token');
  const mockLoggedOut = getCookie(c, 'mock_logged_out');
  if (!token) {
    if (isLocal && !mockLoggedOut) {
      c.set('user', { uid: 'local-dev-user', email: 'local@dev.com', role: 'owner', tier: 'Titan' });
      return next();
    }
    if (path === '/api/auth/me') return c.json({ user: null });
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const payload = await verify(token, c.env.JWT_SECRET, 'HS256');
    c.set('user', payload);
    return next();
  } catch (e) {
    if (isLocal && !mockLoggedOut) {
      c.set('user', { uid: 'local-dev-user', email: 'local@dev.com', role: 'owner', tier: 'Titan' });
      return next();
    }
    if (path === '/api/auth/me') return c.json({ user: null });
    return c.json({ error: 'Unauthorized' }, 401);
  }
});

// --- Auth Routes ---
app.post('/auth/native-login', async (c) => {
  try {
    const { idToken } = await c.req.json();
    if (!idToken) return c.json({ error: 'No idToken provided' }, 400);

    const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
    if (!verifyRes.ok) {
      return c.json({ error: 'Invalid token' }, 401);
    }
    const tokenData: any = await verifyRes.json();
    
    const db = c.env.DB;
    const existingUser = await db.prepare('SELECT * FROM users WHERE email = ?').bind(tokenData.email).first();
    
    const adminEmailsStr = c.env.ADMIN_EMAILS || 'p.e.muryadi@gmail.com,arekgresikid@gmail.com,arekgresik@gmail.com';
    const adminEmails = adminEmailsStr.split(',').map((e: string) => e.trim());
    const isAdmin = adminEmails.includes(tokenData.email);
    let role = isAdmin ? 'owner' : 'siswa';
    let initialTier = isAdmin ? 'Titan' : 'Free';
    
    if (!existingUser) {
      let initialTokens = isAdmin ? 999999 : 2;
      let activeUntilStr: string | null = null;
      
      if (!isAdmin) {
        try {
          const trialActiveRow = await db.prepare("SELECT value FROM settings WHERE id = 'promo_trial_active'").first();
          if (trialActiveRow && trialActiveRow.value === 'true') {
            const trialEmailsRow = await db.prepare("SELECT value FROM settings WHERE id = 'promo_trial_emails'").first();
            const allowedEmails = trialEmailsRow?.value ? (trialEmailsRow.value as string).toLowerCase().split(',').map(e => e.trim()).filter(e => e) : [];
            const userEmailLower = tokenData.email.toLowerCase();
            const isEligible = allowedEmails.length === 0 || allowedEmails.includes(userEmailLower);
            
            if (isEligible) {
              const trialDaysRow = await db.prepare("SELECT value FROM settings WHERE id = 'promo_trial_days'").first();
              const trialTierRow = await db.prepare("SELECT value FROM settings WHERE id = 'promo_trial_tier'").first();
              const trialTokensRow = await db.prepare("SELECT value FROM settings WHERE id = 'promo_trial_tokens'").first();
              
              const trialDays = trialDaysRow?.value ? parseInt(trialDaysRow.value as string) : 3;
              initialTier = (trialTierRow?.value as string) || 'Premium';
              initialTokens = (trialTokensRow && trialTokensRow.value) ? parseInt(trialTokensRow.value as string) : 50;
              
              const trialDate = new Date();
              trialDate.setDate(trialDate.getDate() + trialDays);
              activeUntilStr = trialDate.toISOString();
            }
          }
        } catch (e) {
          console.error("Failed to apply trial settings:", e);
        }
      }
      
      await db.prepare(
        `INSERT INTO users (uid, email, displayName, photoURL, role, tier, tokens, activeUntil, createdAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        tokenData.sub, tokenData.email, tokenData.name, tokenData.picture, role, initialTier, initialTokens, activeUntilStr, new Date().toISOString()
      ).run();
    } else {
      await db.prepare(
        `UPDATE users SET uid = ?, photoURL = ?, displayName = COALESCE(?, displayName) WHERE email = ?`
      ).bind(tokenData.sub, tokenData.picture, tokenData.name, tokenData.email).run();
    }

    const jwtPayload = {
      uid: tokenData.sub,
      email: tokenData.email,
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

    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ error: 'Native auth failed', details: error.message }, 500);
  }
});

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
      let activeUntilStr: string | null = null;
      
      if (!isAdmin) {
        try {
          const trialActiveRow = await db.prepare("SELECT value FROM settings WHERE id = 'promo_trial_active'").first();
          if (trialActiveRow && trialActiveRow.value === 'true') {
            const trialEmailsRow = await db.prepare("SELECT value FROM settings WHERE id = 'promo_trial_emails'").first();
            const allowedEmails = trialEmailsRow?.value ? (trialEmailsRow.value as string).toLowerCase().split(',').map(e => e.trim()).filter(e => e) : [];
            
            const userEmailLower = userData.email.toLowerCase();
            const isEligible = allowedEmails.length === 0 || allowedEmails.includes(userEmailLower);
            
            if (isEligible) {
              const trialDaysRow = await db.prepare("SELECT value FROM settings WHERE id = 'promo_trial_days'").first();
              const trialTierRow = await db.prepare("SELECT value FROM settings WHERE id = 'promo_trial_tier'").first();
              const trialTokensRow = await db.prepare("SELECT value FROM settings WHERE id = 'promo_trial_tokens'").first();
              
              const trialDays = trialDaysRow?.value ? parseInt(trialDaysRow.value as string) : 3;
              initialTier = (trialTierRow?.value as string) || 'Premium';
              if (trialTokensRow && trialTokensRow.value) {
                initialTokens = parseInt(trialTokensRow.value as string) || 50;
              } else {
                initialTokens = 50; // default for trial
              }
              
              const trialDate = new Date();
              trialDate.setDate(trialDate.getDate() + trialDays);
              activeUntilStr = trialDate.toISOString();
            }
          }
        } catch (e) {
          console.error("Failed to apply trial settings:", e);
        }
      }
      
      await db.prepare(
        `INSERT INTO users (uid, email, displayName, photoURL, role, tier, tokens, activeUntil, createdAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        userData.id, userData.email, userData.name, userData.picture, role, initialTier, initialTokens, activeUntilStr, new Date().toISOString()
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

    try {
      const nowIso = new Date().toISOString();
      await db.prepare('UPDATE users SET lastActive = ? WHERE uid = ?').bind(nowIso, user.uid).run();
      profile.lastActive = nowIso;
    } catch (e) { }

    let isSuspended = false;
    if (profile.suspendedUntil) {
      if (new Date() < new Date(profile.suspendedUntil as string)) {
        isSuspended = true;
      } else {
        await db.prepare('UPDATE users SET suspendedUntil = NULL WHERE uid = ?').bind(user.uid).run();
        profile.suspendedUntil = null;
      }
    }

    if (profile.isBanned === 1 || isSuspended) {
      deleteCookie(c, 'auth_token', { path: '/' });
      return c.json({ user: null, profile: null, error: 'Banned or Suspended' });
    }
  }
  
  return c.json({ user, profile });
});

app.post('/auth/logout', (c) => {
  deleteCookie(c, 'auth_token', { path: '/' });
  const url = new URL(c.req.url);
  if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
    setCookie(c, 'mock_logged_out', '1', { path: '/' });
  }
  return c.json({ success: true });
});

// --- Profile Routes ---
app.post('/profile', async (c) => {
  const user = c.get('user');
  const body = await c.req.json();
  const db = c.env.DB;

  // Dynamically build update query
  const keys = Object.keys(body).filter(k => ['displayName', 'nip', 'jenjang', 'tahunPelajaran', 'namaSekolah', 'kepalaSekolah', 'jenisNipKepalaSekolah', 'nipKepalaSekolah', 'jenisNipGuru', 'logoUrl'].includes(k));
  
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
      SUM(CASE WHEN tier = 'Essential' THEN 1 ELSE 0 END) as totalEssential,
      SUM(CASE WHEN tier = 'Premium' THEN 1 ELSE 0 END) as totalPremium,
      SUM(CASE WHEN tier = 'Ultimate' THEN 1 ELSE 0 END) as totalUltimate,
      SUM(CASE WHEN tier = 'Supreme' OR tier = 'SUPREME' THEN 1 ELSE 0 END) as totalSupreme,
      SUM(CASE WHEN tier = 'Titan' THEN 1 ELSE 0 END) as totalTitan,
      SUM(CASE WHEN tier = 'Guru Pertama' THEN 1 ELSE 0 END) as totalGuruPertama,
      SUM(CASE WHEN tier = 'Guru Muda' THEN 1 ELSE 0 END) as totalGuruMuda,
      SUM(CASE WHEN tier = 'Guru Madya' THEN 1 ELSE 0 END) as totalGuruMadya,
      SUM(CASE WHEN tier = 'Guru Utama' THEN 1 ELSE 0 END) as totalGuruUtama
    FROM users
  `).first();
  
  let growth = [];
  try {
    const growthRes = await db.prepare(`
      SELECT date(createdAt) as date, COUNT(*) as count 
      FROM users 
      WHERE createdAt IS NOT NULL AND createdAt >= date('now', '-30 days')
      GROUP BY date(createdAt)
      ORDER BY date ASC
    `).all();
    growth = growthRes.results;
  } catch (e) {
    // Graceful fallback if sqlite date functions fail
  }
  
  return c.json({ ...result, growth });
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
  await db.prepare('CREATE TABLE IF NOT EXISTS activity_logs (id INTEGER PRIMARY KEY AUTOINCREMENT, msg TEXT NOT NULL, status TEXT NOT NULL, color TEXT NOT NULL, time TEXT NOT NULL, timestamp INTEGER NOT NULL)').run();
  
  const adminLogs = await db.prepare('SELECT * FROM admin_logs ORDER BY id DESC LIMIT 50').all();
  const activityLogs = await db.prepare('SELECT * FROM activity_logs ORDER BY id DESC LIMIT 50').all();
  
  return c.json({
    adminLogs: adminLogs.results,
    activityLogs: activityLogs.results
  });
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
  const { role, tier, activeUntil, displayName, tokens, isBanned, suspendedUntil } = body;

  // Build dynamic update for role, tier, activeUntil, displayName, isBanned, suspendedUntil
  const updates = [];
  const values = [];
  if (role !== undefined) { updates.push('role = ?'); values.push(role); }
  if (tier !== undefined) { updates.push('tier = ?'); values.push(tier); }
  if (activeUntil !== undefined) { updates.push('activeUntil = ?'); values.push(activeUntil === '' ? null : activeUntil); }
  if (displayName !== undefined) { updates.push('displayName = ?'); values.push(displayName); }
  if (tokens !== undefined) { updates.push('tokens = ?'); values.push(tokens); }
  if (isBanned !== undefined) { updates.push('isBanned = ?'); values.push(isBanned ? 1 : 0); }
  if (suspendedUntil !== undefined) { updates.push('suspendedUntil = ?'); values.push(suspendedUntil === '' ? null : suspendedUntil); }

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
  const { email, displayName, role, tier, activeUntil, tokens } = body;
  
  if (!email) return c.json({ error: 'Email is required' }, 400);

  const existing = await db.prepare('SELECT * FROM users WHERE email = ?').bind(email).first();
  if (existing) {
    return c.json({ error: 'Email already exists' }, 400);
  }

  const tempUid = 'pending-' + Date.now();
  let initialTokens = 0;
  if (tokens !== undefined) initialTokens = tokens;
  else if (role === 'owner' || role === 'admin') initialTokens = 999999;
  else if (tier === 'Titan') initialTokens = 2500;
  else if (tier === 'Supreme' || tier === 'SUPREME') initialTokens = 1000;
  else if (tier === 'Ultimate') initialTokens = 600;
  else if (tier === 'Premium') initialTokens = 250;
  else if (tier === 'Essential') initialTokens = 85;
  else if (tier === 'Guru Utama') initialTokens = 1000;
  else if (tier === 'Guru Madya') initialTokens = 500;
  else if (tier === 'Guru Muda') initialTokens = 250;
  else if (tier === 'Guru Pertama') initialTokens = 80;
  else if (tier === 'Free') initialTokens = 2;
  
  await db.prepare(
    `INSERT INTO users (uid, email, displayName, role, tier, tokens, activeUntil, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    tempUid, email, displayName || null, role || 'siswa', tier || 'Free', initialTokens, activeUntil || null, new Date().toISOString()
  ).run();

  return c.json({ success: true });
});

app.post('/admin/users/bulk', async (c) => {
  const user = c.get('user');
  if (!user) return c.json({ error: 'Unauthorized' }, 401);
  
  const db = c.env.DB;
  const adminProfile = await db.prepare('SELECT role FROM users WHERE uid = ?').bind(user.uid).first();
  if (!adminProfile || ((adminProfile.role as string)?.toLowerCase() !== 'owner' && (adminProfile.role as string)?.toLowerCase() !== 'admin')) {
    return c.json({ error: 'Forbidden' }, 403);
  }

  const body = await c.req.json();
  const { action, uids, tier, role, tokens, suspendedUntil } = body;
  
  if (!uids || !Array.isArray(uids) || uids.length === 0) {
    return c.json({ error: 'No users selected' }, 400);
  }

  const placeholders = uids.map(() => '?').join(',');

  if (action === 'delete') {
    await db.prepare(`DELETE FROM users WHERE uid IN (${placeholders})`).bind(...uids).run();
  } else if (action === 'updateTier' && tier) {
    await db.prepare(`UPDATE users SET tier = ? WHERE uid IN (${placeholders})`).bind(tier, ...uids).run();
  } else if (action === 'updateRole' && role) {
    await db.prepare(`UPDATE users SET role = ? WHERE uid IN (${placeholders})`).bind(role, ...uids).run();
  } else if (action === 'suspend') {
    await db.prepare(`UPDATE users SET isBanned = 1, suspendedUntil = NULL WHERE uid IN (${placeholders})`).bind(...uids).run();
  } else if (action === 'suspendTemp' && suspendedUntil !== undefined) {
    await db.prepare(`UPDATE users SET isBanned = 0, suspendedUntil = ? WHERE uid IN (${placeholders})`).bind(suspendedUntil, ...uids).run();
  } else if (action === 'unsuspend') {
    await db.prepare(`UPDATE users SET isBanned = 0, suspendedUntil = NULL WHERE uid IN (${placeholders})`).bind(...uids).run();
  } else if (action === 'addTokens' && tokens !== undefined) {
    await db.prepare(`UPDATE users SET tokens = tokens + ? WHERE uid IN (${placeholders})`).bind(tokens, ...uids).run();
  } else {
    return c.json({ error: 'Invalid bulk action' }, 400);
  }

  return c.json({ success: true });
});

app.get('/admin/users/:uid/logs', async (c) => {
  const user = c.get('user');
  if (!user) return c.json({ error: 'Unauthorized' }, 401);
  
  const db = c.env.DB;
  const adminProfile = await db.prepare('SELECT role FROM users WHERE uid = ?').bind(user.uid).first();
  if (!adminProfile || ((adminProfile.role as string)?.toLowerCase() !== 'owner' && (adminProfile.role as string)?.toLowerCase() !== 'admin')) {
    return c.json({ error: 'Forbidden' }, 403);
  }

  const targetUid = c.req.param('uid');
  try {
    const { results } = await db.prepare('SELECT * FROM token_usage_logs WHERE uid = ? ORDER BY id DESC LIMIT 50').bind(targetUid).all();
    return c.json(results);
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

app.post('/admin/users/import', async (c) => {
  const user = c.get('user');
  if (!user) return c.json({ error: 'Unauthorized' }, 401);
  
  const db = c.env.DB;
  const adminProfile = await db.prepare('SELECT role FROM users WHERE uid = ?').bind(user.uid).first();
  if (!adminProfile || ((adminProfile.role as string)?.toLowerCase() !== 'owner' && (adminProfile.role as string)?.toLowerCase() !== 'admin')) {
    return c.json({ error: 'Forbidden' }, 403);
  }

  const body = await c.req.json();
  const { users } = body;
  
  if (!users || !Array.isArray(users) || users.length === 0) {
    return c.json({ error: 'No users provided' }, 400);
  }

  const results = { imported: 0, failed: 0, errors: [] as string[] };
  
  for (const u of users) {
    if (!u.email) {
      results.failed++;
      continue;
    }
    const existing = await db.prepare('SELECT * FROM users WHERE email = ?').bind(u.email).first();
    if (existing) {
      results.failed++;
      results.errors.push(`Duplicate: ${u.email}`);
      continue;
    }

    const role = u.role || 'siswa';
    const tier = u.tier || 'Free';
    
    const tempUid = 'import-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
    let initialTokens = 0;
    if (role === 'owner' || role === 'admin') initialTokens = 999999;
    else if (tier === 'Titan') initialTokens = 2500;
    else if (tier === 'Supreme' || tier === 'SUPREME') initialTokens = 1000;
    else if (tier === 'Ultimate') initialTokens = 600;
    else if (tier === 'Premium') initialTokens = 250;
    else if (tier === 'Essential') initialTokens = 85;
    else if (tier === 'Guru Utama') initialTokens = 1000;
    else if (tier === 'Guru Madya') initialTokens = 500;
    else if (tier === 'Guru Muda') initialTokens = 250;
    else if (tier === 'Guru Pertama') initialTokens = 80;
    else if (tier === 'Free') initialTokens = 2;

    await db.prepare(
      `INSERT INTO users (uid, email, displayName, role, tier, tokens, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      tempUid, u.email, u.displayName || null, role, tier, initialTokens, new Date().toISOString()
    ).run();
    results.imported++;
  }

  return c.json({ success: true, ...results });
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
      
    try {
      const body = await c.req.json().catch(() => ({}));
      const actionName = body.action || 'AI Generation';
      await db.prepare('INSERT INTO token_usage_logs (uid, action, tokens_spent, timestamp) VALUES (?, ?, ?, ?)')
        .bind(user.uid, actionName, 1, new Date().toISOString())
        .run();
    } catch (e) { }
      
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
    const imageResponse = await fetch(`https://gen.pollinations.ai/image/${encodedPrompt}?model=${model}&seed=${seed}&nologo=true`, {
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

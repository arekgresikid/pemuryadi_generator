DROP TABLE IF EXISTS users;
CREATE TABLE users (
  uid TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  displayName TEXT,
  photoURL TEXT,
  role TEXT DEFAULT 'guest',
  tier TEXT DEFAULT 'Free',
  tokens INTEGER DEFAULT 2,
  tokensUsed INTEGER DEFAULT 0,
  reportsGenerated INTEGER DEFAULT 0,
  lastResetDate TEXT,
  createdAt TEXT,
  
  -- Extra profile fields from QuickProfile
  nip TEXT,
  jenjang TEXT,
  tahunPelajaran TEXT,
  namaSekolah TEXT,
  kepalaSekolah TEXT,
  jenisNipKepalaSekolah TEXT,
  nipKepalaSekolah TEXT,
  nama TEXT,
  jenisNipGuru TEXT
);

DROP TABLE IF EXISTS stats;
CREATE TABLE stats (
  id TEXT PRIMARY KEY,
  favorites INTEGER DEFAULT 0
);
INSERT INTO stats (id, favorites) VALUES ('stats', 0);

DROP TABLE IF EXISTS activity_logs;
CREATE TABLE activity_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  msg TEXT NOT NULL,
  status TEXT NOT NULL,
  color TEXT NOT NULL,
  time TEXT NOT NULL,
  timestamp INTEGER NOT NULL
);

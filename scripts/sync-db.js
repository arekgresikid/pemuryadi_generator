import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  console.log('📦 Langkah 1/3: Mengekspor database dari livesite (Ini mungkin memakan waktu beberapa detik)...');
  execSync('npx wrangler d1 export pemuryadi-db --remote --output=remote_db.sql', { stdio: 'inherit' });

  console.log('\n🗑️ Langkah 2/3: Mereset database lokal lama...');
  const dbPath = path.join(__dirname, '..', '.wrangler', 'state', 'v3', 'd1');
  if (fs.existsSync(dbPath)) {
    fs.rmSync(dbPath, { recursive: true, force: true });
  }

  console.log('\n📥 Langkah 3/3: Mengimpor data baru ke database lokal...');
  execSync('npx wrangler d1 execute pemuryadi-db --local --file=remote_db.sql', { stdio: 'inherit' });

  console.log('\n🧹 Membersihkan file sementara...');
  if (fs.existsSync('remote_db.sql')) {
    fs.unlinkSync('remote_db.sql');
  }

  console.log('\n✅ Selesai! Database lokal Anda sekarang 100% sama dengan livesite.');
} catch (error) {
  if (error.message.includes('EPERM') || error.message.includes('Permission denied')) {
    console.error('\n❌ GAGAL: File database sedang dikunci oleh server lokal Anda.');
    console.error('💡 SOLUSI: Harap matikan server "npm run dev" atau "wrangler pages dev" Anda (tekan Ctrl+C di terminal), lalu jalankan ulang perintah "npm run db:sync".');
  } else {
    console.error('\n❌ Terjadi kesalahan saat sinkronisasi:', error.message);
  }
}

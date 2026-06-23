import React from 'react';
import { Terminal, Database, Play, Server, RefreshCw } from 'lucide-react';

const LocalDevGuide: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Terminal className="text-blue-600" />
            Panduan Menjalankan di Lokal
          </h1>
          <p className="text-gray-500 mt-1">
            Tutorial step-by-step untuk menjalankan aplikasi secara lokal dan sinkronisasi database.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Step 1 */}
        <section className="bg-gray-50 rounded-xl p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm">1</span>
            Menjalankan Backend (Cloudflare Pages Dev)
          </h2>
          <p className="text-gray-600 mb-4">
            Aplikasi ini menggunakan Cloudflare Pages dan D1 Database. Untuk menjalankan environment lokal yang mensimulasikan Cloudflare (termasuk fungsi API dan database), gunakan terminal pertama dan jalankan perintah berikut:
          </p>
          <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-green-400 overflow-x-auto">
            npx wrangler pages dev dist
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Biarkan terminal ini tetap berjalan. Ini akan menjalankan server backend lokal (biasanya di port 8788).
          </p>
        </section>

        {/* Step 2 */}
        <section className="bg-gray-50 rounded-xl p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm">2</span>
            Menjalankan Frontend (React/Vite)
          </h2>
          <p className="text-gray-600 mb-4">
            Buka tab terminal baru (terminal kedua) untuk menjalankan server frontend (Vite). Jalankan perintah berikut:
          </p>
          <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-green-400 overflow-x-auto">
            npm run dev
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Server frontend akan berjalan (biasanya di port 5173). Akses aplikasi melalui URL yang ditampilkan (contoh: http://localhost:5173).
          </p>
        </section>

        {/* Step 3 */}
        <section className="bg-blue-50/50 rounded-xl p-6 border border-blue-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm">3</span>
            Sinkronisasi Database Lokal dengan Livesite (Remote)
          </h2>
          <p className="text-gray-600 mb-4">
            Secara default, saat Anda menjalankan <code className="bg-gray-200 px-1 rounded text-gray-800">wrangler pages dev</code>, aplikasi akan menggunakan database D1 *lokal* (kosong atau data lama). Jika Anda ingin menarik data terbaru dari *livesite* agar database lokal sama dengan livesite, jalankan perintah ini di terminal ketiga:
          </p>
          <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-green-400 overflow-x-auto">
            npm run db:sync
          </div>
          <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded text-sm text-yellow-800">
            <p className="font-bold flex items-center gap-2 mb-1">
              <RefreshCw size={16} /> Apakah harus menyinkronkan kembali jika ada perubahan?
            </p>
            <p>
              <strong>Ya.</strong> Perubahan yang Anda buat di lokal <strong>tidak</strong> akan langsung mengubah livesite, dan perubahan pengguna di livesite <strong>tidak</strong> otomatis masuk ke lokal Anda. 
              <br/><br/>
              Jika Anda ingin lokal mendapatkan data terbaru dari livesite lagi, jalankan kembali <code className="bg-yellow-200 px-1 rounded">npm run db:sync</code>.
            </p>
          </div>
        </section>

        {/* Step 4 */}
        <section className="bg-gray-50 rounded-xl p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm">4</span>
            Login / Logout Wrangler
          </h2>
          <p className="text-gray-600 mb-4">
            Beberapa perintah Wrangler (seperti sinkronisasi atau deploy) mungkin mengharuskan Anda untuk login ke akun Cloudflare.
          </p>
          <div className="space-y-4">
            <div>
              <p className="font-semibold text-sm mb-1 text-gray-700">Untuk Login:</p>
              <div className="bg-gray-900 rounded-lg p-3 font-mono text-sm text-green-400 overflow-x-auto">
                npx wrangler login
              </div>
              <p className="text-xs text-gray-500 mt-1">Akan membuka browser untuk konfirmasi otorisasi ke Cloudflare.</p>
            </div>
            <div>
              <p className="font-semibold text-sm mb-1 text-gray-700">Untuk Logout:</p>
              <div className="bg-gray-900 rounded-lg p-3 font-mono text-sm text-green-400 overflow-x-auto">
                npx wrangler logout
              </div>
            </div>
            <div>
              <p className="font-semibold text-sm mb-1 text-gray-700">Untuk Cek Status Login:</p>
              <div className="bg-gray-900 rounded-lg p-3 font-mono text-sm text-green-400 overflow-x-auto">
                npx wrangler whoami
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default LocalDevGuide;

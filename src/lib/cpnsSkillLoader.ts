/**
 * Digen.id Dedicated CPNS SKD Skill Loader (v2.0.0)
 * Standar Resmi BKN & KemenPANRB (KepmenPANRB No. 321/2024)
 * 
 * Mengisolasi penuh logika penyusunan soal Seleksi Kompetensi Dasar (SKD):
 * 1. TWK: 5 Pilar Kebangsaan (Kognitif Objektif, Kunci 5/0, No SJT)
 * 2. TIU: 3 Domain Kemampuan (Verbal, Numerik, Figural, Kunci 5/0)
 * 3. TKP: 6 Aspek BerAKHLAK (Murni SJT, Skala Nilai 1 s.d. 5)
 * 
 * Dilengkapi Key Balancing Protocol untuk mencegah Option A Bias.
 */

export type CPNSMode = 'TWK' | 'TIU' | 'TKP' | 'FULL_SKD';

export interface CPNSSkillConfig {
  mode: CPNSMode;
  subTopik?: string;
  totalSoal: number;
}

export interface CPNSQuestionItem {
  no: string;
  subtes: 'TWK' | 'TIU' | 'TKP';
  kategori: string;
  pertanyaan: string;
  opsi: {
    A: string;
    B: string;
    C: string;
    D: string;
    E: string;
  };
  kunci: string;
  skorOpsi?: {
    A: number;
    B: number;
    C: number;
    D: number;
    E: number;
  };
  skor: string;
  pembahasan: string;
}

export function buildCPNSSystemInstruction(mode: CPNSMode): string {
  if (mode === 'TWK') {
    return `PERAN & OTORITAS:
Anda adalah Tim Pakar Penyusun Soal CAT BKN & KemenPANRB (KepmenPANRB No. 321/2024) untuk subtes Tes Wawasan Kebangsaan (TWK) Seleksi Kompetensi Dasar CPNS/PPPK.

STANDAR AMBANG BATAS: Passing Grade 65.
SISTEM SKOR: Tepat 1 opsi benar bernilai 5 poin, 4 opsi lainnya salah bernilai 0 poin.

PRINSIP SOAL TWK HOTS & MANDIRI (TANPA STIMULUS PANJANG):
1. SOAL KOGNITIF & PENALARAN OBJEKTIF KENNEGARAAN: Menguji pemahaman substantif, penalaran konstitusional, dan wawasan kebangsaan.
2. DILARANG MENGGUNAKAN FORMAT SJT PADA TWK: Dilarang memakai kata "Anda", "sikap Anda", "tindakan Anda", atau "sebagai seorang ASN apa yang Anda lakukan". Gunakan perspektif orang ketiga yang objektif.
3. RUMUSAN SOAL MANDIRI & PADAT: Jangan menyajikan wacana stimulus atau teks bacaan panjang yang bertele-tele. Rumusan konteks dan pertanyaan langsung to the point.
4. FLEKSIBILITAS MATERI RESMI:
   - DIPERBOLEHKAN menguji pengetahuan presisi mengenai tanggal peristiwa bersejarah, nama tokoh bangsa/pejuang diplomasi, dan bunyi pasal dasar UUD 1945 / peraturan perundang-undangan, diformulasikan secara akurat dan bermakna kedinasan.
   - Menguji 5 Pilar Resmi TWK:
     * Nasionalisme: Kedaulatan, identitas nasional, pergerakan kemerdekaan (BPUPKI, PPKI, Sumpah Pemuda), perjanjian diplomasi (Linggarjati, Renville, Roem-Royen, KMB), serta integritas wilayah.
     * Integritas: Nilai antikorupsi, ketentuan yuridis Tipikor, sejarah lembaga pengawas/integritas, keteladanan tokoh bangsa (Bung Hatta, Baharuddin Lopa, Agus Salim, Hoegeng Iman Santoso, Ki Hadjar Dewantara).
     * Bela Negara: 5 Nilai Dasar Bela Negara UU No. 23/2019 (Cinta Tanah Air, Sadar Berbangsa & Bernegara, Setia pada Pancasila, Rela Berkorban, Kemampuan Awal Bela Negara), landasan konstitusional Pasal 27 ayat (3) dan Pasal 30 ayat (1) UUD 1945, serta ancaman militer/non-militer/hibrida.
     * Pilar Negara:
       - Pancasila: Kedudukan sebagai dasar negara & ideologi terbuka, penalaran implementasi butir-butir Sila 1 s.d. 5 dalam kehidupan bernegara.
       - UUD NRI 1945: Bunyi pasal-pasal krusial, amandemen I-IV, struktur dan kewenangan lembaga negara (MPR, DPR, DPD, Presiden, MA, MK, KY, BPK), sistem pemerintahan, serta hierarki peraturan perundang-undangan (UU No. 12/2011 jo UU No. 13/2022).
       - NKRI & Bhinneka Tunggal Ika: Deklarasi Djuanda 1957, wawasan nusantara, integrasi nasional, dan semboyan Kitab Sutasoma.
     * Bahasa Negara: Kaidah baku EYD Edisi V / PUEBI, kalimat efektif, diksi formal kedinasan, struktur subjek-predikat, dan perbaikan ejaan.
5. PROTOKOL KESEIMBANGAN KUNCI (KEY BALANCING): Sebar kunci jawaban benar secara merata di antara opsi A, B, C, D, dan E (proporsi ~20% per opsi). Dilarang menaruh kunci selalu di opsi A!`;
  }

  if (mode === 'TIU') {
    return `PERAN & OTORITAS:
Anda adalah Tim Pakar Penyusun Soal CAT BKN & KemenPANRB (KepmenPANRB No. 321/2024) untuk subtes Tes Inteligensi Umum (TIU) SKD CPNS/PPPK.

STANDAR AMBANG BATAS: Passing Grade 80.
SISTEM SKOR: Tepat 1 opsi benar bernilai 5 poin, 4 opsi lainnya salah bernilai 0 poin.

PRINSIP SOAL TIU HOTS & MATEMATIS-LOGIS:
1. RUMUSAN TO THE POINT & MANDIRI: Informasi soal padat, terstruktur, tanpa pengantar cerita yang tidak relevan.
2. STANDAR NOTASI MATEMATIKA BERSIH:
   - Gunakan simbol matematika Unicode standar: x², y³, √, ≤, ≥, ÷, ×, ≠, π.
   - DILARANG KERAS menggunakan format kode LaTeX mentah (seperti \\frac, \\sqrt, \\times) dalam teks pertanyaan maupun opsi agar tampilan rapi dan mudah dibaca peserta.
3. KELENGKAPAN PERHITUNGAN DI PEMBAHASAN: Pembahasan wajib menyajikan langkah perhitungan aljabar/aritmetika dan penalaran logika yang tuntas, eksplisit, dan dapat diverifikasi.
4. TERSTRUKTUR PADA 3 DOMAIN RESMI:
   - Kemampuan Verbal:
     * Analogi Kata: Format standar A : B = C : D dengan hubungan asosiasi/logika yang tegas, setara, dan tidak ambigu.
     * Silogisme: Penarikan kesimpulan logis mutlak dari premis-premis (Modus Ponens, Modus Tollens, Silogisme Hipotesis, Kuantor Universal "Semua/Setiap", Kuantor Partikular "Sebagian/Beberapa").
     * Penalaran Analitis: Pengurutan posisi, jadwal kerja, penugasan tim, atau antrean berdasarkan 3–4 syarat mutlak yang konsisten tanpa celah kontradiksi.
   - Kemampuan Numerik:
     * Berhitung Cepat: Aljabar ringkas, trik pecahan/desimal/persentase, faktorisasi, dan operasi bilangan rasional.
     * Deret Angka & Pola Bilangan: Pola barisan konsisten (lompat tingkat, aritmetika bertingkat, kombinasi operasi, atau pola Fibonacci).
     * Perbandingan Kuantitatif: Menentukan relasi antara x dan y (x > y, x < y, x = y, atau hubungan tidak dapat ditentukan) dengan domain nilai yang spesifik.
     * Soal Cerita Matematika Terukur: Kecepatan/jarak/waktu (berpapasan dan menyusul), efisiensi kerja bersama (1/t = 1/t1 + 1/t2), aritmetika sosial (harga beli, untung, rugi, diskon bertingkat), perbandingan senilai & berbalik nilai, rata-rata gabungan.
   - Kemampuan Figural:
     * Analogi gambar, serialisasi perubahan pola transformasi (rotasi sudut, pencerminan, penambahan/pengurangan elemen visual), atau ketidaksamaan logis pola.
5. PROTOKOL KESEIMBANGAN KUNCI (KEY BALANCING): Kunci jawaban benar WAJIB terdistribusi acak dan seimbang antara A, B, C, D, dan E (proporsi ~20% per opsi). Dilarang menaruh semua kunci di opsi A!`;
  }

  if (mode === 'TKP') {
    return `PERAN & OTORITAS:
Anda adalah Asesor Psikologi SDM Aparatur BKN & KemenPANRB (KepmenPANRB No. 321/2024) untuk subtes Tes Karakteristik Pribadi (TKP) SKD CPNS/PPPK.

STANDAR AMBANG BATAS: Passing Grade 166.
SISTEM SKOR: Pembobotan bertingkat 1 sampai 5 poin untuk SELURUH 5 pilihan jawaban A, B, C, D, E. TIDAK ADA NILAI 0!

STANDAR RESMI 6 ASPEK CORE VALUES BERAKHLAK:
1. Pelayanan Publik: Berorientasi pada pemenuhan kebutuhan masyarakat secara ramah, tanggap, dan profesional.
2. Sosial Budaya: Kemampuan beradaptasi dan bekerja secara efektif dalam masyarakat majemuk yang terdiri atas beragam agama, suku, dan budaya.
3. Jejaring Kerja: Kemampuan membangun dan membina hubungan, kerjasama, serta kolaborasi dengan orang lain atau tim.
4. Teknologi Informasi dan Komunikasi (TIK): Pemanfaatan teknologi secara efektif untuk meningkatkan kinerja dan pelayanan.
5. Anti Radikalisme: Pengetahuan dan sikap terhadap toleransi, anti-kekerasan, serta penangkalan radikalisme.
6. Profesionalisme: Pelaksanaan tugas dan tanggung jawab sesuai dengan nilai-nilai dan kode etik instansi/pekerjaan.

PRINSIP SOAL TKP REALISTIS (ANTI-OPSI KONYOL):
1. FORMAT MURNI SITUATIONAL JUDGEMENT TEST (SJT): Skenario dilema birokrasi dan kedinasan nyata (benturan SOP vs urgensi warga, keterbatasan fasilitas, tekanan waktu/atasan/rekan).
2. SUDUT PANDANG ORANG KEDUA: Pertanyaan berfokus pada "Sikap Anda..." atau "Tindakan yang paling tepat Anda lakukan adalah...".
3. ANTI-OPSI KONYOL & KELIMA PILIHAN MASUK AKAL: Kelima opsi A, B, C, D, E wajib terlihat sama-sama beretika, logis, dan profesional. Dilarang membuat opsi yang konyol, emosional ekstrim, atau terang-terangan salah. Gradasi skor 1 s.d. 5 ditentukan oleh:
   - Skor 5: Solusi komprehensif, tuntas mengatasi akar masalah, mematuhi regulasi/SOP, proaktif, dan berintegritas tinggi.
   - Skor 4: Solusi tepat dan konstruktif, namun memerlukan koordinasi tambahan atau kurang optimal dalam aspek kecepatan/efisiensi.
   - Skor 3: Solusi normatif standar yang aman namun kurang memiliki inisiatif atau terobosan.
   - Skor 2: Tindakan pasif, sekadar menunggu arahan tanpa kontribusi mandiri, atau menyelesaikan masalah secara sepihak/sementara.
   - Skor 1: Tindakan yang paling lambat merespons, cenderung melempar tanggung jawab ke pihak lain, atau berfokus pada kenyamanan pribadi di atas kepentingan dinas/layanan.
4. PEMBOBOTAN ACAK & NON-SEKUENSIAL: Kunci dengan nilai 5 WAJIB terdistribusi secara acak di berbagai opsi A, B, C, D, E. DILARANG KERAS membuat pola berurutan A=5, B=4, C=3, D=2, E=1!
5. FIELD 'skorOpsi' WAJIB terisi lengkap berupa objek: { "A": number, "B": number, "C": number, "D": number, "E": number } dengan setiap angka 1, 2, 3, 4, 5 dipakai tepat satu kali.`;
  }

  // FULL_SKD (Paket Campuran TWK + TIU + TKP)
  return `PERAN & OTORITAS:
Anda adalah Tim Pengembang Bank Soal Seleksi Kompetensi Dasar (SKD) CAT BKN & KemenPANRB (KepmenPANRB No. 321/2024).
Anda menyusun paket latihan campuran 3 subtes, berurutan TWK lalu TIU lalu TKP, dengan proporsi mengikuti komposisi resmi 30 : 35 : 45:
1. TWK: 5 Pilar Kebangsaan (Kognitif objektif, sudut pandang orang ketiga, tanpa wacana stimulus panjang, boleh menguji tanggal/tokoh/pasal presisi). Skor Benar=5, Salah=0.
2. TIU: 3 Domain Kemampuan (Verbal, Numerik, Figural). Notasi matematika Unicode rapi tanpa kode LaTeX mentah. Skor Benar=5, Salah=0.
3. TKP: 6 Aspek BerAKHLAK (Pelayanan Publik, Sosial Budaya, Jejaring Kerja, TIK, Anti Radikalisme, Profesionalisme). Format SJT dengan kelima opsi realistis/masuk akal, bobot 1 s.d. 5 (tanpa nilai 0), wajib mengisi 'skorOpsi'.

KESEIMBANGAN KUNCI: Kunci TWK dan TIU WAJIB tersebar merata di A, B, C, D, E (~20% tiap huruf). Pada TKP, opsi bernilai 5 harus tersebar acak di berbagai huruf.`;
}

export function buildCPNSPrompt(cfg: CPNSSkillConfig): string {
  const { mode, subTopik, totalSoal } = cfg;

  const detailTopik = subTopik ? `Sub-Topik Spesifik: ${subTopik}` : 'Distribusi merata ke seluruh materi resmi';

  // Proporsi resmi 30:35:45 untuk paket campuran
  let komposisi = '';
  if (mode === 'FULL_SKD') {
    const twk = Math.max(1, Math.round((totalSoal * 30) / 110));
    const tiu = Math.max(1, Math.round((totalSoal * 35) / 110));
    const tkp = Math.max(1, totalSoal - twk - tiu);
    komposisi = `Komposisi Wajib: ${twk} soal TWK (nomor 1-${twk}), ${tiu} soal TIU (nomor ${twk + 1}-${twk + tiu}), ${tkp} soal TKP (nomor ${twk + tiu + 1}-${totalSoal}).`;
  }

  const isTKP = mode === 'TKP';
  const subtesContoh = mode === 'FULL_SKD' ? 'TWK atau TIU atau TKP (tulis salah satu persis)' : mode;
  const kunciContoh = isTKP
    ? 'A=3 | B=5 | C=2 | D=4 | E=1'
    : mode === 'FULL_SKD'
    ? 'TWK/TIU: satu huruf (misal C). TKP: rekap bobot (misal A=3 | B=5 | C=2 | D=4 | E=1)'
    : 'Satu huruf jawaban benar, misal C';
  const skorOpsiLine = isTKP
    ? '"skorOpsi": { "A": 3, "B": 5, "C": 2, "D": 4, "E": 1 },\n      '
    : mode === 'FULL_SKD'
    ? '"skorOpsi": "WAJIB untuk soal TKP: { A..E bernilai 1-5 }. Untuk TWK/TIU kosongkan/abaikan.",\n      '
    : '';

  return `PANDUAN PENYUSUNAN SOAL LATIHAN SKD (KEPMENPANRB NO. 321/2024):
Mode Subtes: ${mode === 'FULL_SKD' ? 'Campuran (TWK + TIU + TKP)' : mode}
Jumlah Soal: ${totalSoal} butir pilihan ganda (5 opsi: A, B, C, D, E)
${komposisi}
${detailTopik}

ATURAN FORMAT & KUALITAS SOAL (HOTS & MASUK AKAL):
- Setiap butir adalah soal mandiri tanpa stimulus wacana panjang yang bertele-tele. Konteks singkat ditulis langsung di "pertanyaan".
- "pertanyaan" TIDAK BOLEH memuat bocoran jawaban, rumus jadi, atau kesimpulan yang memudahkan tebakan.
- Simbol matematika pada TIU wajib menggunakan karakter Unicode bersih (misal: x², √, ≤, ≥, ÷, ×), DILARANG menggunakan kode LaTeX mentah (seperti \\frac, \\sqrt).
- TWK: Kognitif objektif, boleh memuat pertanyaan hafalan tanggal peristiwa bersejarah, nama tokoh bangsa/diplomat, atau bunyi pasal dasar UUD 1945/peraturan yang akurat. Tepat 1 opsi benar (5 poin), 4 opsi salah (0 poin).
- TIU: Logis & matematis, tepat 1 opsi benar (5 poin), 4 opsi salah (0 poin). Pembahasan wajib menyajikan langkah perhitungan tuntas.
- TKP: 6 Aspek BerAKHLAK (Pelayanan Publik, Sosial Budaya, Jejaring Kerja, TIK, Anti Radikalisme, Profesionalisme) dengan kelima opsi A-E terlihat sama-sama profesional, logis, dan masuk akal (tanpa opsi konyol). Kelima opsi berbobot 1-5 (masing-masing angka dipakai tepat satu kali) dengan bobot 5 disebar acak.
- Isi kelima opsi A-E dengan panjang dan gaya bahasa yang berimbang (hindari opsi benar dibuat paling panjang).
- "pembahasan" menjelaskan secara gamblang: dasar pasal/fakta/sejarah untuk TWK, langkah logika/hitung rinci untuk TIU, serta analisis gradasi BerAKHLAK untuk TKP.

Berikan output JSON murni:
{
  "soalList": [
    {
      "no": "1",
      "subtes": "${subtesContoh}",
      "kategori": "Nama pilar/domain/aspek resmi",
      "pertanyaan": "...",
      "opsi": { "A": "...", "B": "...", "C": "...", "D": "...", "E": "..." },
      "kunci": "${kunciContoh}",
      ${skorOpsiLine}"skor": "${isTKP ? 'Skala 1 - 5' : mode === 'FULL_SKD' ? '5 untuk TWK/TIU, Skala 1 - 5 untuk TKP' : '5'}",
      "pembahasan": "..."
    }
  ]
}`;
}


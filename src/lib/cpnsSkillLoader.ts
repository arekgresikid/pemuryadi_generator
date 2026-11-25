/**
 * Digen.id Dedicated CPNS SKD Skill Loader (v3.0.0)
 * Standar Resmi BKN & KemenPANRB (KepmenPANRB No. 321/2024) — Taraf FR CAT BKN HOTS
 *
 * Mengisolasi penuh logika penyusunan soal Seleksi Kompetensi Dasar (SKD):
 * 1. TWK: 5 Pilar Kebangsaan (Kognitif Objektif HOTS, Kunci 5/0, No SJT, Anti-Klise SD/SMP, Near-Miss Distractors)
 * 2. TIU: 3 Domain Kemampuan (Verbal, Numerik, Spasial/Figural — Anti-Trivial 1-Langkah, Kunci 5/0, Self-Verified)
 * 3. TKP: 6 Aspek BerAKHLAK (Dilema Benturan 2 Nilai, Anti-Buzzword & Homogenitas Panjang, Skala 1–5 Acak)
 *
 * Dilengkapi Key Balancing Protocol & Dukungan Prioritas Dokumen Lampiran.
 */

export type CPNSMode = 'TWK' | 'TIU' | 'TKP' | 'FULL_SKD';

export interface CPNSSkillConfig {
  mode: CPNSMode;
  subTopik?: string;
  totalSoal: number;
  hasReferenceFiles?: boolean;
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

export function buildCPNSSystemInstruction(mode: CPNSMode, hasReferenceFiles = false): string {
  const refPriorityClause = hasReferenceFiles
    ? `\n\nPRIORITAS DOKUMEN LAMPIRAN AKTIF:\nPengguna melampirkan dokumen referensi di awal prompt. Jadikan isi, fakta, materi, atau kisi-kisi pada dokumen lampiran tersebut sebagai sumber utama penyusunan soal dengan tetap mempertahankan standar kesulitan HOTS CAT BKN dan format 5 opsi A–E.`
    : '';

  if (mode === 'TWK') {
    return `PERAN & OTORITAS:
Anda adalah Tim Pakar Penyusun Soal CAT BKN & KemenPANRB (KepmenPANRB No. 321/2024) untuk subtes Tes Wawasan Kebangsaan (TWK) Seleksi Kompetensi Dasar CPNS/PPPK taraf seleksi nasional yang ketat.

STANDAR AMBANG BATAS: Passing Grade 65.
SISTEM SKOR: Tepat 1 opsi benar bernilai 5 poin, 4 opsi lainnya salah bernilai 0 poin.

PRINSIP SOAL TWK HOTS & BATAS MINIMUM KESULITAN (ANTI SOAL KLISE SD–SMP):
1. KOGNITIF OBJEKTIF & ANTI-SJT:
   - TWK adalah tes penalaran kenegaraan & kebangsaan objektif sudut pandang orang ketiga.
   - DILARANG KERAS memakai kata "Anda", "sikap Anda", "tindakan Anda", atau menanyakan respon perilaku pribadi (itu ranah TKP).
2. MANDIRI & PADAT (TANPA STIMULUS WACANA PANJANG):
   - Jangan membuat teks bacaan bertele-tele. Sajikan kasus/konteks padat 1–3 kalimat langsung di dalam pertanyaan.
3. BATAS MINIMUM KESULITAN (DIFFICULTY FLOOR — TARAF SELEKSI CPNS):
   - DILARANG KERAS membuat soal hafalan terlalu dasar/klise tingkat SD–SMP (contoh terlarang: "Kapan Sumpah Pemuda?", "Siapa proklamator Indonesia?", "Bunyi Pasal 1 ayat 1 adalah...", "Lambang Sila ke-3 adalah...").
   - DIPERBOLEHKAN menguji hafalan tanggal peristiwa bersejarah, nama tokoh bangsa/diplomat, dan bunyi pasal dasar UUD 1945/regulasi — NAMUN WAJIB pada taraf seleksi ASN yang presisi dan sering mengecoh:
     * Nasionalisme & Sejarah: perbedaan substansi perjanjian diplomasi (Linggarjati vs Renville vs Roem-Royen vs KMB), dinamika sidang BPUPKI I/II & Panitia Sembilan, Deklarasi Djuanda 13 Desember 1957, tokoh & peran spesifik pergerakan nasional.
     * Integritas: delik & konsep tindak pidana korupsi (suap vs gratifikasi vs pemerasan dalam UU Tipikor), keteladanan spesifik tokoh integritas bangsa (Baharuddin Lopa, Hoegeng Iman Santoso, Bung Hatta, Agus Salim) pada kasus konkret, sejarah & kewenangan lembaga pengawas.
     * Bela Negara: analisis wujud implementasi 5 Nilai Dasar Bela Negara (UU No. 23/2019: Cinta Tanah Air, Sadar Berbangsa & Bernegara, Setia pada Pancasila, Rela Berkorban, Kemampuan Awal Bela Negara), pembedaan ancaman militer/non-militer/hibrida, serta dasar Pasal 27 ayat (3) & Pasal 30 UUD 1945.
     * Pilar Negara (Pancasila, UUD 1945, NKRI, Bhinneka Tunggal Ika):
       - Irisan halus pengamalan butir Pancasila (misal membedakan Sila 2 vs Sila 5, atau Sila 3 vs Sila 4 dalam kasus nyata).
       - Pasal spesifik & irisan kewenangan antarlembaga negara pasca-Amandemen I–IV (misal uji materiil MA Pasal 24A vs MK Pasal 24C, mekanisme pemakzulan Pasal 7B, syarat perubahan UUD Pasal 37, hak DPR Pasal 20A, kewenangan Presiden dengan pertimbangan/persetujuan DPR Pasal 11–14, hierarki perundangan UU No. 12/2011 jo UU No. 13/2022).
     * Bahasa Negara: jebakan halus EYD Edisi V (penulisan gabungan kata/serapan baku, kapitalisasi jabatan & geografi, tanda baca) serta identifikasi cacat kalimat efektif (tanpa subjek, pleonasme, ketidakparalelan).
4. NEAR-MISS DISTRACTORS & HOMOGENITAS OPSI:
   - Keempat pengecoh WAJIB berasal dari ranah yang berdekatan/sering tertukar (misal pasal berdekatan, tokoh sezaman, sila beririsan, atau perjanjian diplomasi lain).
   - Panjang kalimat & gaya bahasa opsi A–E WAJIB seimbang (dilarang membuat kunci selalu paling panjang).
5. PROTOKOL KESEIMBANGAN KUNCI (KEY BALANCING):
   - Sebar kunci jawaban benar secara acak dan merata di antara A, B, C, D, dan E (proporsi ~20% per huruf). Dilarang menumpuk kunci di A/B!${refPriorityClause}`;
  }

  if (mode === 'TIU') {
    return `PERAN & OTORITAS:
Anda adalah Tim Pakar Penyusun Soal CAT BKN & KemenPANRB (KepmenPANRB No. 321/2024) untuk subtes Tes Inteligensi Umum (TIU) SKD CPNS/PPPK taraf seleksi ketat.

STANDAR AMBANG BATAS: Passing Grade 80.
SISTEM SKOR: Tepat 1 opsi benar bernilai 5 poin, 4 opsi lainnya salah bernilai 0 poin.

PRINSIP SOAL TIU HOTS & BATAS MINIMUM KESULITAN (ANTI SOAL RECEH 1-LANGKAH):
1. RUMUSAN PADAT, MANDIRI & NOTASI UNICODE BERSIH:
   - Padat informasi tanpa pengantar cerita yang tidak perlu.
   - WAJIB gunakan simbol Unicode bersih: x², y³, √, ≤, ≥, ÷, ×, ≠, π. DILARANG KERAS memakai kode LaTeX mentah (\\frac, \\sqrt, \\times, $).
2. LARANGAN KERAS POLA TRIVIAL / ANAK SD–SMP:
   - DILARANG deret 1 tingkat sederhana (2, 4, 6, 8 atau ×2), silogisme 1 premis datar ("Semua A adalah B, X adalah A -> X adalah B"), analogi profesi-tempat dasar ("Dokter : Rumah Sakit"), atau hitung langsung 1 operasi ("25% dari 200").
3. SYARAT MINIMUM KEDALAMAN PADA 3 DOMAIN RESMI TIU:
   - Kemampuan Verbal (HOTS):
     * Analogi Kalimat / Relasi Kompleks: Utamakan pola Analogi Kalimat Setara (mencari kalimat berstruktur hubungan logis identik seperti tren TIU BKN 2024) atau analogi 3 suku kata / hubungan kausalitas-hierarki yang ketat.
     * Silogisme Berantai: WAJIB minimal 2–3 premis yang menuntut penarikan kontraposisi (Modus Tollens), silogisme hipotesis berantai, atau kombinasi kuantor "Semua/Setiap" + "Sebagian/Ada/Sementara" dengan jebakan konversi tidak sah (illicit conversion).
     * Penalaran Analitis: WAJIB melibatkan 5–6 entitas dengan minimal 4–5 syarat kendala saling mengikat (urutan baris/meja melingkar/jadwal/ranking) yang terbukti secara logis menghasilkan TEPAT 1 jawaban unik tanpa kontradiksi.
   - Kemampuan Numerik (HOTS Multi-Tahap):
     * Berhitung Cepat & Aljabar: Manipulasi bentuk kuadrat/faktorisasi (a² − b²), pecahan bertingkat, atau persentase berantai yang menuntut strategi hitung efisien.
     * Deret Angka: WAJIB pola 2 larik selang-seling, aritmetika bertingkat ordo-2, kombinasi 2 operasi (misal ×2 − 1, ×3 + 2), Fibonacci termodifikasi, atau deret pecahan.
     * Perbandingan Kuantitatif (x vs y): Wajib menuntut analisis aljabar/pertidaksamaan atau uji kasus domain bilangan (misal bilangan negatif atau pecahan 0 < x < 1) agar tidak selesai hanya dengan melihat angka mentah.
     * Soal Cerita Multi-Tahap (minimal 2–3 operasi terangkai): Perbandingan berbalik nilai dengan proyek terhenti & penambahan pekerja, diskon bertingkat + mencari harga beli awal dari % untung/rugi, kecepatan menyusul dengan selisih jam berangkat + waktu istirahat, kerja bersama 3 pihak, rata-rata gabungan bersyarat, atau peluang/kombinatorika.
   - Kemampuan Figural / Spasial Presisi (Berbasis Teks/Unicode):
     * Karena tampilan berbasis teks tanpa kanvas gambar, susun soal figural sebagai penalaran spasial/pola matriks simbol Unicode yang 100% objektif & dapat diverifikasi (contoh: serial rotasi arah panah ↑ → ↓ ← dengan pergeseran elemen, matriks 3×3 pola simbol ▲ ● ■ ◆, atau lipatan jaring-jaring kubus berlabel huruf/angka). Hindari deskripsi gambar abstrak yang ambigu.
4. VERIFIKASI MANDIRI KETAT & PENGECOH MISKONSEPSI:
   - Periksa ulang setiap langkah perhitungan aljabar, deret, dan penalaran analitis agar 100% akurat dan konsisten antara pertanyaan, kunci, dan pembahasan.
   - Pengecoh salah wajib berasal dari kesalahan hitung nyata (salah tanda, lupa langkah terakhir, terjebak konversi silogisme salah), bukan angka acak.
5. PROTOKOL KESEIMBANGAN KUNCI (KEY BALANCING):
   - Sebar kunci jawaban secara acak dan merata di antara A, B, C, D, dan E (~20% per huruf). Dilarang menumpuk kunci di opsi A!${refPriorityClause}`;
  }

  if (mode === 'TKP') {
    return `PERAN & OTORITAS:
Anda adalah Asesor Psikologi SDM Aparatur BKN & KemenPANRB (KepmenPANRB No. 321/2024) untuk subtes Tes Karakteristik Pribadi (TKP) SKD CPNS/PPPK taraf seleksi nasional.

STANDAR AMBANG BATAS: Passing Grade 166.
SISTEM SKOR: Pembobotan bertingkat 1 sampai 5 poin untuk SELURUH 5 pilihan jawaban A, B, C, D, E. TIDAK ADA NILAI 0!

STANDAR RESMI 6 ASPEK CORE VALUES BERAKHLAK:
1. Pelayanan Publik: Berorientasi pada pemenuhan kebutuhan masyarakat secara ramah, tanggap, dan profesional.
2. Sosial Budaya: Kemampuan beradaptasi dan bekerja secara efektif dalam masyarakat majemuk yang terdiri atas beragam agama, suku, dan budaya.
3. Jejaring Kerja: Kemampuan membangun dan membina hubungan, kerjasama, serta kolaborasi dengan orang lain atau tim.
4. Teknologi Informasi dan Komunikasi (TIK): Pemanfaatan teknologi secara efektif untuk meningkatkan kinerja dan pelayanan.
5. Anti Radikalisme: Pengetahuan dan sikap terhadap toleransi, anti-kekerasan, serta penangkalan radikalisme.
6. Profesionalisme: Pelaksanaan tugas dan tanggung jawab sesuai dengan nilai-nilai dan kode etik instansi/pekerjaan.

PRINSIP SOAL TKP HOTS (DILEMA BENTURAN NILAI — ANTI BUZZWORD & ANTI OPSI KONYOL):
1. FORMAT MURNI SJT DILEMA 2 NILAI:
   - Setiap skenario WAJIB menyajikan benturan nyata antara 2 tuntutan positif/realistis birokrasi (contoh: urgensi warga vs prosedur verifikasi SOP, percepatan digitalisasi TIK vs rekan senior yang resisten, tenggat mendesak atasan vs akurasi data, kedekatan rekan kerja vs indikasi paparan intoleransi/radikalisme di grup kantor, adat lokal masyarakat vs aturan baku layanan).
   - Gunakan sudut pandang orang kedua ("Anda").
2. LARANGAN GIVEAWAY BUZZWORDS & HOMOGENITAS PANJANG OPSI:
   - DILARANG menempelkan kata kunci klise aspek secara literal ke opsi skor 5 (seperti "...dengan ramah, sigap, profesional, sesuai SOP, dan berintegritas tinggi") yang langsung membocorkan jawaban!
   - Seluruh 5 opsi A, B, C, D, E WAJIB berupa tindakan konkret operasional yang sama-sama sopan, logis, beretika, dan realistis dilakukan ASN (ANTI-OPSI KONYOL/EMOSI EKSTREM).
   - Panjang kalimat kelima opsi A–E WAJIB homogen (selisih panjang antar-opsi maksimal ±15%; dilarang membuat opsi skor 5 paling panjang sendirian).
3. RUBRIK GRADASI KETUNTASAN SKOR 1–5:
   - Skor 5: Solusi paling tuntas menyentuh akar masalah, proaktif, kolaboratif, tetap taat aturan/kewenangan, dan menjaga dampak jangka panjang.
   - Skor 4: Solusi tepat dan konstruktif, tetapi masih kurang tuntas pada salah satu sisi dilema atau belum menyentuh pencegahan sistemik.
   - Skor 3: Solusi normatif standar/aman yang mematuhi prosedur dasar namun pasif tanpa inisiatif perbaikan.
   - Skor 2: Tindakan parsial/reaktif, cenderung menyerahkan penyelesaian ke pihak lain atau hanya menenangkan permukaan.
   - Skor 1: Tindakan yang tetap sopan secara bahasa namun paling defensif, terlalu kaku menghambat layanan, atau mengutamakan kenyamanan pribadi di atas kepentingan dinas.
4. PEMBOBOTAN ACAK & NON-SEKUENSIAL:
   - Opsi bernilai 5 WAJIB tersebar acak di berbagai huruf A, B, C, D, E. DILARANG membuat urutan teratur A=5, B=4, C=3, D=2, E=1!
   - Field 'skorOpsi' WAJIB terisi lengkap: { "A": number, "B": number, "C": number, "D": number, "E": number } dengan setiap angka 1–5 dipakai tepat satu kali.${refPriorityClause}`;
  }

  // FULL_SKD (Paket Campuran TWK + TIU + TKP)
  return `PERAN & OTORITAS:
Anda adalah Tim Pengembang Bank Soal Seleksi Kompetensi Dasar (SKD) CAT BKN & KemenPANRB (KepmenPANRB No. 321/2024) taraf HOTS seleksi nasional.
Anda menyusun paket latihan campuran 3 subtes berurutan (TWK lalu TIU lalu TKP) dengan proporsi resmi 30 : 35 : 45:
1. TWK (HOTS 5 Pilar Kebangsaan): Kognitif objektif sudut pandang orang ketiga (dilarang kata "Anda"), tanpa wacana panjang. Boleh menguji tanggal/tokoh/pasal dasar namun DILARANG soal klise SD–SMP; wajib irisan konsep/pasal presisi & pengecoh berdekatan (near-miss). Skor Benar=5, Salah=0.
2. TIU (HOTS Verbal, Numerik, Spasial): DILARANG soal trivial 1 langkah (deret +2, silogisme 1 premis datar, hitung 1 operasi). Wajib deret bertingkat/2 larik, silogisme 2–3 premis (kontraposisi/kuantor campuran), analitis 5–6 entitas konsisten, numerik multi-tahap, dan notasi Unicode bersih tanpa LaTeX mentah. Verifikasi semua hitungan 100% akurat. Skor Benar=5, Salah=0.
3. TKP (HOTS 6 Aspek BerAKHLAK — Pelayanan Publik, Sosial Budaya, Jejaring Kerja, TIK, Anti Radikalisme, Profesionalisme): SJT dilema benturan 2 nilai. Kelima opsi A–E wajib sama-sama sopan/logis, bebas giveaway buzzwords, panjang homogen (±15%), bobot 1–5 acak non-sekuensial, wajib mengisi 'skorOpsi'.

KESEIMBANGAN KUNCI: Kunci TWK dan TIU WAJIB tersebar merata di A, B, C, D, E (~20% tiap huruf). Pada TKP, opsi bernilai 5 tersebar acak di berbagai huruf.${refPriorityClause}`;
}

export function buildCPNSPrompt(cfg: CPNSSkillConfig): string {
  const { mode, subTopik, totalSoal, hasReferenceFiles } = cfg;

  const detailTopik = subTopik
    ? `Sub-Topik Spesifik: ${subTopik}`
    : hasReferenceFiles
    ? 'Fokuskan materi pada dokumen lampiran pengguna sambil menjaga kesesuaian kisi-kisi resmi BKN'
    : 'Distribusi merata ke seluruh materi resmi BKN';

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

  return `PANDUAN PENYUSUNAN SOAL LATIHAN SKD TARAF CAT BKN HOTS (KEPMENPANRB NO. 321/2024):
Mode Subtes: ${mode === 'FULL_SKD' ? 'Campuran (TWK + TIU + TKP)' : mode}
Jumlah Soal: ${totalSoal} butir pilihan ganda (5 opsi: A, B, C, D, E)
${komposisi}
${detailTopik}

ATURAN MUTLAK KUALITAS & TINGKAT KESULITAN (ANTI SOAL MUDAH):
- Setiap butir adalah soal mandiri padat tanpa stimulus wacana panjang. Konteks/kasus singkat (1–3 kalimat) ditulis langsung di "pertanyaan".
- "pertanyaan" TIDAK BOLEH memuat bocoran jawaban, rumus jadi, atau petunjuk kunci.
- Simbol matematika wajib Unicode bersih (x², √, ≤, ≥, ÷, ×, ≠), DILARANG kode LaTeX mentah (\\frac, \\sqrt, $).
- TWK: Kognitif objektif (orang ketiga, dilarang kata "Anda"). Boleh menguji tanggal/tokoh/pasal dasar namun WAJIB taraf CPNS (dilarang hafalan klise SD–SMP), dengan 4 pengecoh berdekatan (near-miss). Tepat 1 opsi benar (5 poin), 4 salah (0 poin).
- TIU: WAJIB multi-langkah/berantai (deret bertingkat/2 larik, silogisme 2–3 premis kontraposisi/kuantor campuran, analitis 5–6 entitas dengan 4–5 kendala unik, numerik multi-tahap). DILARANG soal 1 langkah receh! Verifikasi semua hitungan 100% benar. Tepat 1 opsi benar (5 poin), 4 salah (0 poin).
- TKP: 6 Aspek BerAKHLAK (Pelayanan Publik, Sosial Budaya, Jejaring Kerja, TIK, Anti Radikalisme, Profesionalisme) dalam skenario dilema benturan 2 nilai. Kelima opsi A–E wajib sama-sama sopan/operasional, bebas buzzword pembocor, panjang homogen (±15%), berbobot 1–5 acak non-sekuensial.
- Sebar kunci jawaban (TWK/TIU) dan opsi bobot 5 (TKP) secara acak & merata di antara A, B, C, D, dan E.
- "pembahasan" menjelaskan tuntas: dasar pasal/sejarah/kaidah + alasan mengapa pengecoh salah untuk TWK, langkah hitung/logika formal lengkap untuk TIU, serta analisis gradasi 5 opsi BerAKHLAK untuk TKP.

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


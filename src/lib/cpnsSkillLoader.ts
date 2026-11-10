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
Anda adalah Tim Pakar Penyusun Soal CAT BKN & KemenPANRB (KepmenPANRB No. 321/2024) untuk subtes Tes Wawasan Kebangsaan (TWK) Seleksi Kompetensi Dasar CPNS.

STANDAR AMBANG BATAS: Passing Grade 65.
SISTEM SKOR: Tepat 1 opsi benar bernilai 5 poin, 4 opsi lainnya salah bernilai 0 poin.

ATURAN MUTLAK & PANTANGAN TWK:
1. TWK ADALAH TES KOGNITIF & PENALARAN OBJEKTIF, BUKAN TES KARAKTERISTIK PRIBADI (TKP) DAN BUKAN SITUATIONAL JUDGEMENT TEST (SJT)!
2. DILARANG KERAS menggunakan kata "Anda", "sikap Anda", "tindakan Anda", atau "sebagai seorang ASN apa yang Anda lakukan".
3. DILARANG menanyakan reaksi moral atau respon perilaku pribadi.
4. WAJIB menggunakan sudut pandang orang ketiga yang menguji 5 Pilar Resmi:
   - Nasionalisme: Sejarah pergerakan nasional, kedaulatan, identitas nasional, diplomasi kemerdekaan.
   - Integritas: Nilai antikorupsi, ketentuan delik Tipikor, sejarah lembaga pemberantasan korupsi, keteladanan integritas tokoh bangsa (Bung Hatta, Baharuddin Lopa, Agus Salim, Hoegeng). BUKAN menanyakan respon tindakan pribadi jika diajak korupsi!
   - Bela Negara: 5 Nilai Dasar Bela Negara UU No. 23/2019 (Cinta Tanah Air, Sadar Berbangsa & Bernegara, Setia pada Pancasila, Rela Berkorban, Kemampuan Awal Bela Negara), ancaman militer/non-militer/hibrida.
   - Pilar Negara: Pancasila (Sila 1-5 & butir pengamalan), Batang Tubuh UUD NRI 1945 Amandemen I-IV & Lembaga Negara, NKRI & Deklarasi Djuanda 1957, Bhinneka Tunggal Ika & Integrasi Sutasoma.
   - Bahasa Negara: EYD Edisi V / PUEBI, Kalimat Efektif, Diksi Baku Kedinasan, Ide Pokok Paragraf.
5. PROTOKOL KESEIMBANGAN KUNCI (KEY BALANCING): Sebar kunci jawaban benar secara merata di antara A, B, C, D, dan E (masing-masing ~20%). DILARANG menaruh semua kunci di opsi A!`;
  }

  if (mode === 'TIU') {
    return `PERAN & OTORITAS:
Anda adalah Tim Pakar Penyusun Soal CAT BKN & KemenPANRB (KepmenPANRB No. 321/2024) untuk subtes Tes Inteligensi Umum (TIU) SKD CPNS.

STANDAR AMBANG BATAS: Passing Grade 80.
SISTEM SKOR: Tepat 1 opsi benar bernilai 5 poin, 4 opsi lainnya salah bernilai 0 poin.

ATURAN MUTLAK TIU:
1. Rumusan soal to the point, padat informasi, matematis dan logis tanpa basa-basi narasi yang tidak relevan.
2. DILARANG menampilkan kesimpulan, rumus hitung, atau bocoran jawaban di dalam teks pertanyaan.
3. Terstruktur secara presisi pada 3 Domain Resmi:
   - Kemampuan Verbal: Analogi Kata (format standar A : B = C : D), Silogisme premis logis mutlak (kategoris/hipotesis dengan kuantor semua/sebagian/tidak ada), Penalaran Analitis posisi/urutan antrean/jadwal kerja.
   - Kemampuan Numerik: Berhitung Cepat pecahan/desimal/persen/aljabar, Deret Angka pola berulang/lompat/Fibonacci, Perbandingan Kuantitatif (x vs y), Soal Cerita Aritmetika Sosial (kecepatan, usia, untung rugi, kerja bersama 1/t = 1/t1 + 1/t2).
   - Kemampuan Figural: Analogi gambar, ketidaksamaan visual, serial pola transformasi gambar.
4. PROTOKOL KESEIMBANGAN KUNCI (KEY BALANCING): Kunci jawaban benar WAJIB terdistribusi acak dan seimbang antara A, B, C, D, dan E (proporsi ~20% per opsi). DILARANG menaruh semua jawaban di A!`;
  }

  if (mode === 'TKP') {
    return `PERAN & OTORITAS:
Anda adalah Asesor Psikologi SDM Aparatur BKN & KemenPANRB (KepmenPANRB No. 321/2024) untuk subtes Tes Karakteristik Pribadi (TKP) SKD CPNS.

STANDAR AMBANG BATAS: Passing Grade 166.
SISTEM SKOR: Pembobotan bertingkat 1 sampai 5 poin untuk SELURUH 5 pilihan jawaban A, B, C, D, E. TIDAK ADA NILAI 0!

ATURAN MUTLAK TKP:
1. MURNI FORMAT SITUATIONAL JUDGEMENT TEST (SJT): Skenario dilema kedinasan/pelayanan yang dihadapi pegawai ASN.
2. Pertanyaan selalu menggunakan sudut pandang orang kedua ("Anda"): "Tindakan yang paling tepat Anda lakukan adalah..." atau "Sikap Anda dalam menghadapi situasi tersebut adalah...".
3. Menguji 6 Aspek Core Values ASN BerAKHLAK:
   - Pelayanan Publik: Keramahan, empati, responsif terhadap keluhan, integritas pelayanan tanpa diskriminasi.
   - Jejaring Kerja: Kemitraan, kolaborasi tim kerja, sinergi lintas bidang.
   - Sosial Budaya: Adaptasi di lingkungan kerja majemuk multikultural, toleransi.
   - Teknologi Informasi & Komunikasi (TIK): Pemanfaatan teknologi digital untuk percepatan kinerja, antusias transformasi digital birokrasi.
   - Profesionalisme: Tanggung jawab tugas, ketuntasan kerja, disiplin, prioritas dinas di atas urusan pribadi.
   - Anti-Radikalisme: Moderasi beragama, deteksi dini bibit intoleransi, loyalitas penuh pada NKRI.
4. PEMBOBOTAN NON-SEKUENSIAL & ACAK: Sebar bobot nilai 1-5 secara alami dan acak (misal No 1: A=3, B=5, C=2, D=4, E=1; No 2: A=4, B=1, C=5, D=3, E=2). DILARANG membuat urutan teratur A=5, B=4, C=3, D=2, E=1!
5. Field 'skorOpsi' WAJIB terisi lengkap dengan integer { "A": x, "B": y, "C": z, "D": w, "E": v }.`;
  }

  // FULL_SKD (Paket Campuran TWK + TIU + TKP)
  return `PERAN & OTORITAS:
Anda adalah Tim Pengembang Bank Soal Seleksi Kompetensi Dasar (SKD) CAT BKN (KepmenPANRB No. 321/2024).
Anda menyusun paket latihan campuran 3 subtes, berurutan TWK lalu TIU lalu TKP, dengan proporsi mengikuti komposisi resmi 30 : 35 : 45:
1. TWK: 5 Pilar Kebangsaan. Kognitif objektif, sudut pandang orang ketiga, DILARANG memakai kata "Anda". Skor Benar=5, Salah=0.
2. TIU: Verbal, Numerik, Figural. Objektif logis/matematis. Skor Benar=5, Salah=0.
3. TKP: 6 Aspek BerAKHLAK, Situational Judgement Test orang kedua ("Anda"). Setiap opsi berbobot 1 s.d. 5 (tanpa nilai 0), wajib isi "skorOpsi".

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

ATURAN FORMAT:
- Setiap butir adalah soal mandiri. Konteks singkat (jika perlu) ditulis langsung di "pertanyaan".
- "pertanyaan" TIDAK BOLEH memuat jawaban, langkah penyelesaian, atau petunjuk kunci.
- Isi kelima opsi A-E dengan panjang dan gaya yang setara; jangan membuat opsi benar paling panjang.
- TWK & TIU: tepat 1 opsi benar (5 poin), 4 opsi salah (0 poin). Sebar kunci merata di A-E.
- TKP: kelima opsi berbobot 1-5 (masing-masing angka dipakai tepat satu kali), urutan bobot acak.
- "pembahasan" menjelaskan dasar jawaban: pasal/fakta untuk TWK, langkah logika/hitung untuk TIU, alasan gradasi BerAKHLAK untuk TKP.

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


# Archetype: Olimpiade Sains Bertaraf Nasional & Internasional (OSN / IMO / IPhO / IChO / IBO / IOI / SASMO / AMC / IJSO)

## 1. Filosofi & Karakteristik Kunci
Olimpiade sains dan matematika **BUKAN** ujian sekolah biasa dan **BUKAN** tes komputasi rutin.
Setiap butir soal dirancang untuk menguji **kreativitas heuristik**, **penalaran deduktif multi-langkah (*multi-step deductive reasoning*)**, **penemuan pola/invarian tersembunyi**, dan **pembuktian matematis/ilmiah yang kedap cacat logika**.

---

## 2. Empat Aturan Besi (*Iron-Clad Rules*) Soal Olimpiade

### Aturan 1: *The Anti Plug-and-Chug Mandate* (Dilarang Substitusi Rumus Instan)
- **DILARANG KERAS** menyajikan masalah yang langsung selesai dengan 1 rumus baku buku teks (misal: hanya memasukkan angka ke $v = s/t$, $F = m \cdot a$, atau rumus luas segitiga dasar).
- Setiap soal **WAJIB menuntut minimal 3 lompatan penalaran berantai**:
  1. *Eksplorasi & Representasi:* Memodelkan fenomena atau abstraksi matematis ke dalam persamaan/relasi terstruktur.
  2. *Transformasi & Penemuan Invarian:* Menemukan sifat kekal (*invariant*), prinsip simetri, kondisi batas, atau reduksi kasus.
  3. *Eksekusi & Verifikasi Solusi:* Menyelesaikan aljabar/perhitungan secara presisi dan mengeliminasi solusi semu (*extraneous solutions*).

### Aturan 2: *Authentic Competition Distractor Traps* (Pada Soal Pilihan Ganda AMC / SASMO)
- Pilihan jawaban salah **DILARANG** berupa angka acak yang tidak masuk akal.
- Setiap pengecoh **WAJIB merefleksikan perangkap jebakan kompetisi otentik**:
  - **Pengecoh A:** *Off-by-one error* (kesalahan batas hitung $N$ vs $N+1$, prinsip tiang pagar).
  - **Pengecoh B:** *Boundary / Extreme Case Error* (mengabaikan pembagian dengan nol, $x=0$, atau kasus sudut tumpul).
  - **Pengecoh C:** *Partial Solution Trap* (berhenti pada nilai $x$ padahal yang ditanyakan adalah nilai $2x+y$, atau nilai sebelum akar diambil).
  - **Pengecoh D:** *Sign / Direction Inversion* (lupa membalik tanda pertidaksamaan saat dikalikan bilangan negatif, atau arah vektor terbalik).

### Aturan 3: *Format Isian Singkat Angka Bulat / Integer (AIME / SASMO Section B Style)*
- Jika format yang dipilih adalah **Isian Singkat (Angka Bulat / Integer 0–999)**:
  - Jawaban akhir **WAJIB berupa bilangan bulat non-negatif pasti** (contoh: $42$, $128$, $750$) atau bentuk pecahan sederhana yang diformat menjadi penjumlahan pembilang + penyebut ($p+q$).
  - Pertanyaan harus dirumuskan agar tidak memicu ambiguitas pembulatan desimal, misal: *"Tentukan sisa pembagian $N$ oleh 1000"*, atau *"Jika jawaban dapat dinyatakan sebagai pecahan paling sederhana $p/q$, tentukan nilai dari $p + q$"*.

### Aturan 4: *Gold-Standard Discussion Protocol* (Standar Emas Pembahasan)
Field `"pembahasan"` **WAJIB** memuat 4 pilar analisis ilmiah:
1. **Ide Kunci (*Key Insight / Breakthrough Idea*):** Konsep utama atau trik heuristik yang membuka jalan penyelesaian (misal: *"Perhatikan bahwa ekspresi dapat difaktorkan dengan menambahkan dan mengurangkan $2x^2y^2$"* atau *"Gunakan Hukum Kekekalan Momentum Sudut terhadap pusat massa"*).
2. **Langkah Penurunan & Pembuktian Formal (*Rigorous Derivation*):** Uraian matematis/ilmiah langkah demi langkah dengan menyebutkan teorema yang digunakan (AM-GM, Cauchy-Schwarz, Menelaus, Euler, Gauss, Hess, Nernst, Michaelis-Menten, dsb.).
3. **Peringatan Jebakan (*Trap Alert*):** Ulasan mengapa salah satu opsi pengecoh paling sering menjebak peserta.
4. **Metode Cepat / Heuristik Alternatif (*Competition Shortcut*):** Sudut pandang alternatif yang elegan (jika ada).

---

## 3. Matriks Repertoar Heuristik per Sub-Domain

### A. Matematika (IMO / AMC / AIME / SASMO / OSN)
1. **Teori Bilangan (*Number Theory*):**
   - Keterbagian, FPB/KPK, Teorema Sisa Cina (*CRT*), Teorema Fermat Kecil, Teorema Wilson, fungsi $\phi$ Euler, persamaan Diophantine linier/non-linier, karakteristik digit terakhir basis $10$ dan basis $n$.
2. **Aljabar (*Algebra*):**
   - Faktorisasi non-standar (Sophie Germain, dsb.), ketaksamaan (AM-GM, Cauchy-Schwarz, Rearrangement), polinomial & Teorema Vieta berderajat $n$, sistem persamaan simetris, persamaan fungsional Cauchy.
3. **Geometri (*Geometry*):**
   - Geometri sintetis Euklides, segiempat tali busur (*cyclic quadrilateral*), Teorema Ptolemy, Teorema Menelaus & Ceva, kuasa titik (*power of a point*), garis Simson, homothety, sifat titik ortosentrum ($H$), pusat lingkaran dalam ($I$), dan pusat lingkaran luar ($O$).
4. **Kombinatorika (*Combinatorics*):**
   - Prinsip Sarang Merpati (*Pigeonhole Principle* / Dirichlet), prinsip inklusi-eksklusi, relasi rekurensi linier, paritas & pewarnaan grid (*coloring invariants*), penghitungan ganda (*double counting*), bijection & generating functions.

### B. Fisika (IPhO / APhO / USAPhO / OSN)
1. **Mekanika:**
   - Gerak menggelinding tanpa slip pada bidang miring/lengkung, osilasi harmonik terkopel (*normal modes*), mekanika benda tegar & momen inersia tensor sederhana, orbit gravitasi Newton-Kepler & gaya sentral.
2. **Termodinamika & Fluida:**
   - Proses termodinamika reversibel/ireversibel siklus non-ideal, persamaan gas Van der Waals, dinamika fluida viskos (Navier-Stokes elementer / Poiseuille), kontinuitas & persamaan Bernoulli pada aliran tak tunak.
3. **Elektrodinamika:**
   - Penerapan Hukum Gauss & Ampere pada konfigurasi kontinu, osilasi rangkaian $LCR$ teredam, induksi elektromagnetik Faraday dengan medan tak homogen, medan listrik dalam media berdielektrik.
4. **Optik & Gelombang:**
   - Difraksi Fraunhofer kisi banyak celah, efek Doppler relativistik, dispersi dan optik geometri matriks transfer sinar.
5. **Fisika Modern:**
   - Relativitas khusus (dilatasi waktu, kontraksi Lorentz, transformasi momentum-energi), kuantisasi foton & efek Compton, model atom semi-klasik.

### C. Kimia (IChO / USNCO / OSN)
1. **Kimia Fisika:**
   - Termodinamika kimia ($\Delta G^\circ, \Delta H^\circ, \Delta S^\circ$, hubungan van 't Hoff), kinetika reaksi bertahap (*steady-state approximation*), kesetimbangan elektrokimia & persamaan Nernst sel konsentrasi.
2. **Kimia Organik & Stereokimia:**
   - Mekanisme reaksi karbokation/karbanion, reaksi perisiklik/Diels-Alder, substitusi aromatik teraktivasi/terdeaktivasi, stereokimia kiralitas molekuler ($R/S$, $E/Z$, isomer konformasi sikloheksana), sintesis multi-langkah.
3. **Kimia Anorganik & Koordinasi:**
   - Teori Medan Kristal (*Crystal Field Theory*), energi stabilisasi medan kristal (CFSE), deret spektrokimia, isomerisme geometri/optik senyawa koordinasi, struktur kisi kristal (FCC, BCC, HCP) dan jari-jari ion.
4. **Kimia Analitik:**
   - Kesetimbangan simultan asam-basa poliprotik, kelarutan $K_{sp}$ dengan efek ion senama dan pembentukan kompleks, analisis volumetri & spektrofotometri Beer-Lambert.

### D. Biologi (IBO / USABO / OSN)
1. **Biologi Sel, Molekuler, & Biokimia:**
   - Mekanisme regulasi ekspresi gen prokariot & eukariot, kinetika enzim Michaelis-Menten ($V_{\max}, K_m$, kurva Lineweaver-Burk), jalur fosforilasi oksidatif & siklus Krebs dengan stoikiometri ATP akurat, teknik bioteknologi (PCR, elektroforesis gel, CRISPR, sekuensing).
2. **Genetika & Evolusi:**
   - Pautan gen (*linkage*) & rekombinasi dengan pemetaan jarak Morgan, pedigree analisis pola pewarisan non-Mendelian (epistasis, kodominan, mitokondrial), genetika populasi Hardy-Weinberg di bawah tekanan mutasi/seleksi.
3. **Anatomi & Fisiologi:**
   - Fisiologi membran & potensial aksi Hodgkin-Huxley konseptual, fisiologi nefron ginjal (sistem arus balik pelipat ganda), respon imun adaptif (seleksi klonal sel T/B), adaptasi fotosintesis $C_3/C_4/\text{CAM}$ terhadap transpirasi.
4. **Biosistematika & Ekologi:**
   - Konstruksi kladogram filogenetik berdasarkan data karakter homolog/sekuens (metode *maximum parsimony*), dinamika populasi Lotka-Volterra kompetisi dan pemangsaan.

### E. Informatika / Ilmu Komputer (IOI / OSN-Informatika)
1. **Struktur Data & Algoritma:**
   - Algoritma graf (DFS, BFS, Dijkstra, Kruskal/Prim, Topological Sort), Dynamic Programming (Knapsack, LCS, LIS, Tree DP), Divide and Conquer, Greedy algorithms dengan bukti pertukaran (*exchange argument*).
2. **Logika & Kompleksitas Komputasional:**
   - Analisis kompleksitas asimtotik $\mathcal{O}(N \log N), \mathcal{O}(2^N)$, penelusuran eksekusi kode/rekursif (*dry run tracing*), manipulasi bit (*bitwise operations*), dan teori graf planar/pohon.

### F. Sains Terpadu Jenjang SD & SMP (SASMO / AMC 8 / IJSO / OSN-SD & SMP)
- Untuk SD: Fokus pada pola bilangan kreatif, penalaran spasial bangun ruang, teka-teki logika inversi (*working backwards*), konsep ekosistem, gaya & gerak sederhana, dan astronomi dasar tata surya.
- Untuk SMP: Perpaduan Fisika (kinematika, dinamika, tekanan fluida, listrik magnet dasar) dan Biologi (sistem organ manusia, ekologi, genetika dasar) yang terintegrasi secara sains analitis.

---

## 4. Standar Notasi Matematika & Sains (LaTeX Strict)
- Seluruh rumus wajib menggunakan LaTeX matematis murni:
  - Gunakan `$\frac{a}{b}$` untuk pecahan, bukan `a/b`.
  - Gunakan `$\sqrt{x}$` untuk akar, `$\le$` atau `$\ge$` untuk pertidaksamaan.
  - Notasi himpunan: `$\mathbb{R}, \mathbb{Z}, \mathbb{N}$`.
  - Reaksi kimia: `$\text{Fe}^{3+} + \text{SCN}^- \rightleftharpoons [\text{Fe(SCN)}]^{2+}$`.

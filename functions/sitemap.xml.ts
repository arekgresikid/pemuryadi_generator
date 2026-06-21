export async function onRequest(context: any) {
  const { request } = context;
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  // Daftar komprehensif Kabupaten & Kota di Indonesia (500+ entri) untuk SEO
  const cities = [
    // Aceh
    "banda-aceh", "sabang", "lhokseumawe", "langsa", "subulussalam", "aceh-selatan", "aceh-tenggara", "aceh-timur", "aceh-tengah", "aceh-barat", "aceh-besar", "pidie", "aceh-utara", "simeulue", "aceh-singkil", "bireuen", "aceh-barat-daya", "gayo-lues", "aceh-jaya", "nagan-raya", "aceh-tamiang", "bener-meriah", "pidie-jaya",
    // Sumatera Utara
    "medan", "binjai", "pematangsiantar", "tanjungbalai", "tebingtinggi", "sibolga", "padangsidempuan", "gunungsitoli", "asahan", "batubara", "dairi", "deli-serdang", "humbang-hasundutan", "karo", "labuhanbatu", "langkat", "mandailing-natal", "nias", "padang-lawas", "pakpak-bharat", "samosir", "serdang-bedagai", "simalungun", "tapanuli-selatan", "tapanuli-tengah", "tapanuli-utara", "toba",
    // Sumatera Barat
    "padang", "bukittinggi", "payakumbuh", "solok", "sawahlunto", "padangpanjang", "pariaman", "agam", "dharmasraya", "kepulauan-mentawai", "lima-puluh-kota", "padang-pariaman", "pasaman", "pasaman-barat", "pesisir-selatan", "sijunjung", "solok-selatan", "tanah-datar",
    // Riau & Kepri
    "pekanbaru", "dumai", "bengkalis", "indragiri-hilir", "indragiri-hulu", "kampar", "kepulauan-meranti", "kuantan-singingi", "pelalawan", "rokan-hilir", "rokan-hulu", "siak", "batam", "tanjungpinang", "bintan", "karimun", "kepulauan-anambas", "lingga", "natuna",
    // Jambi
    "jambi", "sungaipenuh", "batanghari", "bungo", "kerinci", "merangin", "muaro-jambi", "sarolangun", "tanjung-jabung-barat", "tanjung-jabung-timur", "tebo",
    // Sumatera Selatan & Babel
    "palembang", "prabumulih", "lubuklinggau", "pagaralam", "banyuasin", "empat-lawang", "lahat", "muara-enim", "musi-banyuasin", "musi-rawas", "ogan-ilir", "ogan-komering-ilir", "ogan-komering-ulu", "pangkalpinang", "bangka", "belitung",
    // Bengkulu & Lampung
    "bengkulu", "bengkulu-selatan", "bengkulu-tengah", "bengkulu-utara", "kaur", "kepahiang", "lebong", "mukomuko", "rejang-lebong", "seluma", "bandar-lampung", "metro", "lampung-barat", "lampung-selatan", "lampung-tengah", "lampung-timur", "lampung-utara", "mesuji", "pesawaran", "pringsewu", "tanggamus", "tulang-bawang", "way-kanan",
    // Banten & DKI Jakarta
    "serang", "cilegon", "tangerang", "tangerang-selatan", "lebak", "pandeglang", "jakarta", "jakarta-barat", "jakarta-pusat", "jakarta-selatan", "jakarta-timur", "jakarta-utara", "kepulauan-seribu",
    // Jawa Barat
    "bandung", "banjar", "bekasi", "bogor", "cimahi", "cirebon", "depok", "sukabumi", "tasikmalaya", "ciamis", "cianjur", "garut", "indramayu", "karawang", "kuningan", "majalengka", "pangandaran", "purwakarta", "subang", "sumedang", "bandung-barat",
    // Jawa Tengah & DIY
    "semarang", "magelang", "pekalongan", "salatiga", "surakarta", "tegal", "banjarnegara", "banyumas", "batang", "blora", "boyolali", "brebes", "cilacap", "demak", "grobogan", "jepara", "karanganyar", "kebumen", "kendal", "klaten", "kudus", "pati", "pemalang", "purbalingga", "purworejo", "rembang", "sragen", "sukoharjo", "temanggung", "wonogiri", "wonosobo", "yogyakarta", "bantul", "gunungkidul", "kulon-progo", "sleman",
    // Jawa Timur
    "surabaya", "batu", "blitar", "kediri", "madiun", "malang", "mojokerto", "pasuruan", "probolinggo", "banyuwangi", "bangkalan", "bojonegoro", "bondowoso", "gresik", "jember", "jombang", "lamongan", "lumajang", "magetan", "nganjuk", "ngawi", "pacitan", "pamekasan", "ponorogo", "sampang", "sidoarjo", "situbondo", "sumenep", "trenggalek", "tuban", "tulungagung",
    // Bali & Nusa Tenggara
    "denpasar", "badung", "bangli", "buleleng", "gianyar", "jembrana", "karangasem", "klungkung", "tabanan", "mataram", "bima", "dompu", "lombok-barat", "lombok-tengah", "lombok-timur", "lombok-utara", "sumbawa", "kupang", "alor", "belu", "ende", "flores-timur", "manggarai", "ngada", "sikka", "sumba-barat", "sumba-timur",
    // Kalimantan
    "pontianak", "singkawang", "bengkayang", "kapuas-hulu", "ketapang", "kubu-raya", "landak", "melawi", "mempawah", "sambas", "sanggau", "sekadau", "sintang", "palangkaraya", "barito-selatan", "barito-timur", "barito-utara", "gunung-mas", "kapuas", "katingan", "kotawaringin-barat", "kotawaringin-timur", "banjarmasin", "banjarbaru", "balangan", "banjar", "barito-kuala", "hulu-sungai-selatan", "hulu-sungai-tengah", "hulu-sungai-utara", "kotabaru", "tabalong", "tanah-bumbu", "tanah-laut", "tapin", "samarinda", "balikpapan", "bontang", "berau", "kutai-barat", "kutai-kartanegara", "kutai-timur", "paser", "penajam-paser-utara", "tarakan", "bulungan", "malinau", "nunukan", "tana-tidung",
    // Sulawesi
    "manado", "bitung", "kotamobagu", "tomohon", "bolaang-mongondow", "minahasa", "gorontalo", "boalemo", "bone-bolango", "pohuwato", "palu", "banggai", "donggala", "morowali", "poso", "sigi", "tolitoli", "mamuju", "majene", "polewali-mandar", "makassar", "palopo", "parepare", "bantaeng", "barru", "bone", "bulukumba", "enrekang", "gowa", "jeneponto", "kepulauan-selayar", "luwu", "maros", "pangkajene", "pinrang", "sinjai", "soppeng", "takalar", "tana-toraja", "wajo", "kendari", "baubau", "bombana", "buton", "kolaka", "konawe", "muna", "wakatobi",
    // Maluku & Papua
    "ambon", "tual", "buru", "kepulauan-aru", "maluku-tengah", "maluku-tenggara", "ternate", "tidore", "halmahera", "pulau-morotai", "jayapura", "biak", "mimika", "nabire", "merauke", "asmat", "boven-digoel", "jayawijaya", "puncak-jaya", "fakfak", "kaimana", "manokwari", "sorong", "raja-ampat"
  ];

  const exampleSchools = [
    "sman-1-jakarta", "sman-8-jakarta", "smpn-1-surabaya", "sdn-1-bandung", "sman-3-malang", "smkn-1-denpasar", "man-2-yogyakarta"
  ];

  const provinces = [
    "aceh", "sumatera-utara", "sumatera-barat", "riau", "jambi", "sumatera-selatan", "bengkulu", "lampung", "kepulauan-bangka-belitung", "kepulauan-riau",
    "dki-jakarta", "jawa-barat", "jawa-tengah", "di-yogyakarta", "jawa-timur", "banten",
    "bali", "nusa-tenggara-barat", "nusa-tenggara-timur",
    "kalimantan-barat", "kalimantan-tengah", "kalimantan-selatan", "kalimantan-timur", "kalimantan-utara",
    "sulawesi-utara", "sulawesi-tengah", "sulawesi-selatan", "sulawesi-tenggara", "gorontalo", "sulawesi-barat",
    "maluku", "maluku-utara",
    "papua", "papua-barat", "papua-selatan", "papua-tengah", "papua-pegunungan", "papua-barat-daya"
  ];


  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;

  for (const city of cities) {
    xml += `
  <url>
    <loc>${baseUrl}/kota/${city}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }

  for (const prov of provinces) {
    xml += `
  <url>
    <loc>${baseUrl}/provinsi/${prov}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }

  for (const school of exampleSchools) {
    xml += `
  <url>
    <loc>${baseUrl}/sekolah/${school}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
  }

  xml += `\n</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400"
    }
  });
}

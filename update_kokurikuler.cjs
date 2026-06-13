const fs = require('fs');

let content = fs.readFileSync('src/components/ModulKokurikuler.tsx', 'utf8');

const TAKSONOMI_CONSTANTS = `
const TAKSONOMI_BLOOM = [
  'C1: Mengingat (Remembering)',
  'C2: Memahami (Understanding)',
  'C3: Menerapkan (Applying)',
  'C4: Menganalisis (Analyzing)',
  'C5: Mengevaluasi (Evaluating)',
  'C6: Menciptakan (Creating)',
  'Campuran (Sesuai Kurikulum Merdeka)'
];

const TAKSONOMI_SOLO = [
  'Pra-struktural',
  'Uni-struktural',
  'Multi-struktural',
  'Relasional',
  'Abstrak Diperluas'
];
`;

content = content.replace(/(export default function ModulKokurikuler\(\) \{)/, `${TAKSONOMI_CONSTANTS}\n$1`);

// Add formatPerangkat
content = content.replace(/const \[logoUrl, setLogoUrl\] = useLocalStorage<string \| null>\('ModulKokurikuler_logoUrl', null\);/,
  `const [logoUrl, setLogoUrl] = useLocalStorage<string | null>('ModulKokurikuler_logoUrl', null);
  const [formatPerangkat, setFormatPerangkat] = useLocalStorage<'standar'|'kemenag'>('ModulKokurikuler_formatPerangkat', 'standar');`);

// Add format toggle UI
const formatToggleUI = `
          <div className="bg-gray-100 p-1.5 rounded-xl flex items-center mb-6">
            <button
              onClick={() => setFormatPerangkat('standar')}
              className={\`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-300 \${formatPerangkat === 'standar' ? 'bg-white text-blue-700 shadow-md transform scale-[1.02]' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200'}\`}
            >
              Standar
            </button>
            <button
              onClick={() => setFormatPerangkat('kemenag')}
              className={\`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-300 \${formatPerangkat === 'kemenag' ? 'bg-blue-50 text-blue-700 shadow-md border border-blue-200 transform scale-[1.02]' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200'}\`}
            >
              Kemenag
            </button>
          </div>
`;
content = content.replace(/(<h2 className="text-xl font-bold text-gray-900">Modul Kokurikuler<\/h2>[\s\S]*?<\/div>\n\s*<\/div>)/, `$1\n${formatToggleUI}`);


// Add kerangkaTaksonomi and levelTaksonomi state
content = content.replace(/const \[tingkatanKognitif, setTingkatanKognitif\] = useState\('Campuran \(Sesuai Kurikulum Merdeka\)'\);/,
`const [kerangkaTaksonomi, setKerangkaTaksonomi] = useState('bloom');
  const [levelTaksonomi, setLevelTaksonomi] = useState('Campuran (Sesuai Kurikulum Merdeka)');`);


// Update prompt
const newPromptKognitif = `1. Taksonomi/Pendekatan Kognitif: \${kerangkaTaksonomi === 'bloom' ? 'Taksonomi Bloom' : 'Taksonomi SOLO'} pada level: \${levelTaksonomi}.
   - Seimbangkan LOTS (C1-C2) dan HOTS (C4-C6) sesuai target jika menggunakan Bloom.`;

content = content.replace(/1\. Tingkatan Kognitif \(Taksonomi Bloom\): Target utama adalah \$\{tingkatanKognitif\}\.\s*- Seimbangkan LOTS \(C1-C2\) dan HOTS \(C4-C6\) sesuai target\./, newPromptKognitif);

// Add kemenag instruction to prompt
content = content.replace(/(Berikan hasil dalam format JSON dengan struktur berikut\.)/, 
`\${formatPerangkat === 'kemenag' ? \`Konteks Kemenag & Berbasis Cinta (WAJIB DITAMBAHKAN DALAM RENCANA & KONTEN):
1. Pendekatan Kurikulum Berbasis Cinta: Integrasikan nilai-nilai kasih sayang, empati, dan kepedulian dalam setiap aktivitas pembelajaran.
2. Integrasi Nilai Islam (Kemenag): Masukkan nilai-nilai ajaran agama Islam yang relevan dengan topik, seperti kutipan Al-Qur'an, Hadis, atau teladan Nabi Muhammad SAW.
3. Nilai Spiritual: Integrasikan nilai-nilai agama dan pesan moral dalam penyampaian materi.\` : ''}
$1 PENTING: Untuk cetak yang rapi, susun konten paragraf dengan baris baru (newline ganda \\n\\n) agar tidak menumpuk. Gunakan tabel Markdown (dengan header | Kolom |) pada konten yang sesuai (misalnya Asesmen/Rubrik) agar tersusun rapi:`);

// Replace tingkatanKognitif UI
const taxonomyUI = `
              <div className="col-span-2 md:col-span-1 border border-gray-200 rounded-xl p-3 bg-white">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-3">Kerangka Taksonomi</label>
                <div className="flex gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => { setKerangkaTaksonomi('bloom'); setLevelTaksonomi('Campuran (Sesuai Kurikulum Merdeka)'); }}
                    className={\`flex-1 py-1.5 px-2 rounded-full text-xs font-semibold transition-all \${kerangkaTaksonomi === 'bloom' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'}\`}
                  >
                    Taksonomi Bloom
                  </button>
                  <button
                    type="button"
                    onClick={() => { setKerangkaTaksonomi('solo'); setLevelTaksonomi('Relasional'); }}
                    className={\`flex-1 py-1.5 px-2 rounded-full text-xs font-semibold transition-all \${kerangkaTaksonomi === 'solo' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'}\`}
                  >
                    Taksonomi SOLO
                  </button>
                </div>

                <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-3">Level Yang Digunakan</label>
                <div className="flex flex-wrap gap-2">
                  {(kerangkaTaksonomi === 'bloom' ? TAKSONOMI_BLOOM : TAKSONOMI_SOLO).map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setLevelTaksonomi(lvl)}
                      className={\`py-1 px-3 rounded-full text-xs font-medium transition-all \${levelTaksonomi === lvl ? 'bg-blue-500 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}\`}
                    >
                      {lvl.split(':')[0]}
                    </button>
                  ))}
                </div>
              </div>
`;

content = content.replace(/<div>\s*<label className="block text-sm font-medium text-gray-700 mb-2">Tingkatan Kognitif \(Taksonomi Bloom\)<\/label>[\s\S]*?<select value=\{tingkatanKognitif\}[\s\S]*?<\/select>\s*<\/div>/, taxonomyUI);

// Replace Praktik Pedagogis UI
content = content.replace(/(<option value="Bermain Peran \(Role Play\)">Bermain Peran \(Role Play\)<\/option>)/, 
`$1\n                      {formatPerangkat === 'kemenag' && <option value="Pendekatan Kurikulum Berbasis Cinta">Pendekatan Kurikulum Berbasis Cinta</option>}`);


fs.writeFileSync('src/components/ModulKokurikuler.tsx', content);

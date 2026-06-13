const fs = require('fs');

let content = fs.readFileSync('src/components/ModuleGenerator.tsx', 'utf8');

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

// Add constants
content = content.replace(/(const \[formData, setFormData\] = useLocalStorage\('ModuleGeneratorData', \{[\s\S]*?waktu: '',\s*)(model: 'pbl',[\s\S]*?tingkatanKognitif: 'Campuran \(Sesuai Kurikulum Merdeka\)',)/, 
`$1model: 'pbl', mediaStyle: 'outline', kerangkaTaksonomi: 'bloom', levelTaksonomi: 'Campuran (Sesuai Kurikulum Merdeka)',`);

// Put the constants before export default function
content = content.replace(/(export default function ModuleGenerator\(\) \{)/, `${TAKSONOMI_CONSTANTS}\n$1`);


const newPromptKognitif = `1. Taksonomi/Pendekatan Kognitif: \${formData.kerangkaTaksonomi === 'bloom' ? 'Taksonomi Bloom' : 'Taksonomi SOLO'} pada level: \${formData.levelTaksonomi}.
   - Seimbangkan LOTS (C1-C2) dan HOTS (C4-C6) sesuai target jika menggunakan Bloom.`;

content = content.replace(/1\. Tingkatan Kognitif \(Taksonomi Bloom\): Target utama adalah \$\{formData\.tingkatanKognitif\}\.\s*- Seimbangkan LOTS \(C1-C2\) dan HOTS \(C4-C6\) sesuai target\./, newPromptKognitif);

const newPromptMarkdown = `Berikan hasil dalam format JSON dengan struktur berikut. PENTING: Untuk cetak yang rapi, susun konten paragraf dengan baris baru (newline ganda \\n\\n) agar tidak menumpuk. Gunakan tabel Markdown (dengan header | Kolom |) pada konten yang sesuai (misalnya Asesmen/Rubrik) agar tersusun rapi:`;

content = content.replace(/Berikan hasil dalam format JSON dengan struktur berikut\. Gunakan sumber resmi dari Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi \(Kemendikbudristek\) atau website pendidikan yang kredibel sebagai acuan pengisian konten:/, newPromptMarkdown);


const taxonomyUI = `
              <div className="col-span-2 md:col-span-1 border border-gray-200 rounded-xl p-3 bg-white">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-3">Kerangka Taksonomi</label>
                <div className="flex gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, kerangkaTaksonomi: 'bloom', levelTaksonomi: 'Campuran (Sesuai Kurikulum Merdeka)'})}
                    className={\`flex-1 py-1.5 px-2 rounded-full text-xs font-semibold transition-all \${formData.kerangkaTaksonomi === 'bloom' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'}\`}
                  >
                    Taksonomi Bloom
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, kerangkaTaksonomi: 'solo', levelTaksonomi: 'Relasional'})}
                    className={\`flex-1 py-1.5 px-2 rounded-full text-xs font-semibold transition-all \${formData.kerangkaTaksonomi === 'solo' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'}\`}
                  >
                    Taksonomi SOLO
                  </button>
                </div>

                <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-3">Level Yang Digunakan</label>
                <div className="flex flex-wrap gap-2">
                  {(formData.kerangkaTaksonomi === 'bloom' ? TAKSONOMI_BLOOM : TAKSONOMI_SOLO).map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setFormData({...formData, levelTaksonomi: lvl})}
                      className={\`py-1 px-3 rounded-full text-xs font-medium transition-all \${formData.levelTaksonomi === lvl ? 'bg-cyan-500 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}\`}
                    >
                      {lvl.split(':')[0]}
                    </button>
                  ))}
                </div>
              </div>
`;

content = content.replace(/<div>\s*<label className="block text-sm font-medium text-gray-700 mb-2">Tingkatan Kognitif \(Taksonomi Bloom\)<\/label>[\s\S]*?<select value=\{formData\.tingkatanKognitif\}[\s\S]*?<\/select>\s*<\/div>/, taxonomyUI);

// The Model Pembelajaran selector is missing from ModuleGenerator UI? Let's check where `model: e.target.value` or similar is.
// Actually, earlier I searched for value={formData.model} and it was not found!
// If there is no Model Pembelajaran selector, I need to add it, or maybe it's in another component.
// Wait, the prompt said "Pada opsi Model Pembelajaran, tambahkan Pendekatan Kurikulum Berbasis Cinta jika Kemenag aktif".
// I will just add the selector if it's missing, or update if it exists.
// Let's add Model Pembelajaran selector below Alokasi Waktu (if it exists) or Topik/Materi.

const modelSelectorUI = `
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Model / Praktik Pedagogis</label>
                <select value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-gray-900 focus:border-cyan-500 transition-all">
                  <option value="pbl">Problem Based Learning (PBL)</option>
                  <option value="pjbl">Project Based Learning (PjBL)</option>
                  <option value="inquiry">Inquiry Learning</option>
                  <option value="discovery">Discovery Learning</option>
                  <option value="cooperative">Cooperative Learning</option>
                  {formatPerangkat === 'kemenag' && <option value="cinta">Pendekatan Kurikulum Berbasis Cinta</option>}
                </select>
              </div>
`;
// Let's insert this before Tingkatan Kognitif
content = content.replace(/(<div className="col-span-2 md:col-span-1 border border-gray-200 rounded-xl p-3 bg-white">)/, modelSelectorUI + '\n              $1');

// Update prompt to pass "Pendekatan Kurikulum Berbasis Cinta" if model === 'cinta'
content = content.replace(/const modelName = modelNames\[formData\.model\] \|\| formData\.model;/, 
`const modelName = formData.model === 'cinta' ? 'Pendekatan Kurikulum Berbasis Cinta' : (modelNames[formData.model] || formData.model);`);

fs.writeFileSync('src/components/ModuleGenerator.tsx', content);

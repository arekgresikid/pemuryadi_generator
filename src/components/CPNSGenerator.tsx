import React, { useState } from 'react';
import { Award, Sparkles, BookOpen, CheckCircle2, AlertCircle, Printer, Copy, Check } from 'lucide-react';
import ModelSelector from './ModelSelector';
import { GoogleGenAI, Type } from '../lib/genai';
import { getWatermarkHtml, createPrintWindow } from '../utils/print';
import { useAuth } from '../AuthContext';
import { CPNSMode, CPNSQuestionItem, buildCPNSSystemInstruction, buildCPNSPrompt } from '../lib/cpnsSkillLoader';

const SUB_TOPIK_MAP: Record<CPNSMode, string[]> = {
  TWK: [
    'Semua 5 Pilar TWK',
    'Nasionalisme (Identitas & Kedaulatan Bangsa)',
    'Integritas (Anti-Korupsi & Keteladanan Tokoh)',
    'Bela Negara (5 Nilai Dasar UU No. 23/2019)',
    'Pilar Negara: Pancasila (Sila 1-5 & Ideologi)',
    'Pilar Negara: UUD 1945 & Ketatanegaraan',
    'Pilar Negara: NKRI & Sejarah Kemerdekaan/Diplomasi',
    'Pilar Negara: Bhinneka Tunggal Ika & Integrasi',
    'Bahasa Negara (EYD V, Kalimat Efektif, Diksi)'
  ],
  TIU: [
    'Semua Topik TIU',
    'Verbal: Analogi Kata (A : B = C : D)',
    'Verbal: Silogisme (Penarikan Kesimpulan Logis)',
    'Verbal: Penalaran Analitis (Urutan Posisi & Antrean)',
    'Numerik: Berhitung Cepat (Aljabar & Pecahan)',
    'Numerik: Deret Angka & Pola Bilangan',
    'Numerik: Perbandingan Kuantitatif (x vs y)',
    'Numerik: Soal Cerita (Aritmetika Sosial & Kecepatan)',
    'Figural: Analogi, Ketidaksamaan & Serial Pola'
  ],
  TKP: [
    'Semua 6 Aspek TKP',
    'Pelayanan Publik (Keramahan & Kepuasan Pengguna)',
    'Jejaring Kerja (Kolaborasi & Kemitraan Tim)',
    'Sosial Budaya (Adaptasi Keberagaman Multikultural)',
    'Teknologi Informasi & Komunikasi Digital',
    'Profesionalisme (Tanggung Jawab Kedinasan & Disiplin)',
    'Anti-Radikalisme (Moderasi Beragama & Loyalitas NKRI)'
  ],
  FULL_SKD: ['Standar Lengkap CAT BKN (TWK + TIU + TKP)']
};

const OPSI_HURUF = ['A', 'B', 'C', 'D', 'E'] as const;

// Normalisasi kunci TWK/TIU menjadi satu huruf A-E (misal "B. Pasal 24C" -> "B")
const normalizeKunci = (raw: string): string => {
  const m = (raw || '').trim().toUpperCase().match(/^[A-E]/);
  return m ? m[0] : '';
};

export default function CPNSGenerator() {
  const { profile } = useAuth();
  const [selectedModel, setSelectedModel] = useState('openai');
  const [mode, setMode] = useState<CPNSMode>('TWK');
  const [subTopik, setSubTopik] = useState(SUB_TOPIK_MAP.TWK[0]);
  const [jumlahSoal, setJumlahSoal] = useState<number>(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [questions, setQuestions] = useState<CPNSQuestionItem[]>([]);

  const handleModeChange = (newMode: CPNSMode) => {
    setMode(newMode);
    setSubTopik(SUB_TOPIK_MAP[newMode][0]);
    setJumlahSoal(newMode === 'FULL_SKD' ? 30 : 10);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: '' });
      const prompt = buildCPNSPrompt({
        mode,
        subTopik: subTopik.startsWith('Semua') || mode === 'FULL_SKD' ? '' : subTopik,
        totalSoal: jumlahSoal
      });

      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          soalList: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                no: { type: Type.STRING },
                subtes: { type: Type.STRING },
                kategori: { type: Type.STRING },
                pertanyaan: { type: Type.STRING },
                opsi: {
                  type: Type.OBJECT,
                  properties: {
                    A: { type: Type.STRING }, B: { type: Type.STRING }, C: { type: Type.STRING },
                    D: { type: Type.STRING }, E: { type: Type.STRING }
                  },
                  required: ['A', 'B', 'C', 'D', 'E']
                },
                kunci: { type: Type.STRING },
                skorOpsi: {
                  type: Type.OBJECT,
                  properties: {
                    A: { type: Type.NUMBER }, B: { type: Type.NUMBER }, C: { type: Type.NUMBER },
                    D: { type: Type.NUMBER }, E: { type: Type.NUMBER }
                  }
                },
                skor: { type: Type.STRING },
                pembahasan: { type: Type.STRING }
              },
              required: ['no', 'pertanyaan', 'opsi', 'kunci', 'pembahasan']
            }
          }
        },
        required: ['soalList']
      };

      const response = await ai.models.generateContent({
        model: selectedModel,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema,
          systemInstruction: buildCPNSSystemInstruction(mode)
        }
      });

      const cleanText = (response.text || '{}').replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      let parsed: any = {};
      try {
        parsed = JSON.parse(cleanText);
      } catch {
        const match = cleanText.match(/\{[\s\S]*\}/);
        if (!match) throw new Error('Format respons AI tidak valid. Silakan coba generate ulang.');
        parsed = JSON.parse(match[0]);
      }

      if (!Array.isArray(parsed.soalList) || parsed.soalList.length === 0) {
        throw new Error('Gagal menyusun butir soal. Silakan coba generate ulang.');
      }

      const sanitized: CPNSQuestionItem[] = parsed.soalList.map((item: any, idx: number) => {
        const rawSubtes = String(item.subtes || '').toUpperCase();
        const subtes: 'TWK' | 'TIU' | 'TKP' =
          mode !== 'FULL_SKD' ? mode : (['TWK', 'TIU', 'TKP'].includes(rawSubtes) ? rawSubtes : 'TWK') as any;
        const isTKP = subtes === 'TKP';
        const skorOpsi = isTKP && item.skorOpsi ? item.skorOpsi : undefined;
        return {
          no: String(idx + 1),
          subtes,
          kategori: item.kategori || '',
          pertanyaan: item.pertanyaan || '',
          opsi: {
            A: item.opsi?.A || '', B: item.opsi?.B || '', C: item.opsi?.C || '',
            D: item.opsi?.D || '', E: item.opsi?.E || ''
          },
          kunci: isTKP
            ? (skorOpsi ? OPSI_HURUF.map(h => `${h}=${skorOpsi[h] ?? '?'}`).join(' | ') : item.kunci || '')
            : normalizeKunci(item.kunci),
          skorOpsi,
          skor: isTKP ? 'Skala 1 - 5' : '5',
          pembahasan: item.pembahasan || ''
        };
      });

      setQuestions(sanitized);
    } catch (err: any) {
      console.error('CPNS Generation Error:', err);
      setError(err?.message || 'Terjadi kesalahan saat menyusun soal.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Distribusi kunci TWK/TIU untuk verifikasi Key Balancing
  const kunciDistribusi = OPSI_HURUF.map(h => ({
    huruf: h,
    jumlah: questions.filter(q => q.subtes !== 'TKP' && q.kunci === h).length
  }));
  const adaSoalObjektif = questions.some(q => q.subtes !== 'TKP');

  const handlePrint = () => {
    const printWindow = createPrintWindow();
    const watermark = getWatermarkHtml(profile?.role);
    const body = questions.map((q, i) => `
      <div style="margin-bottom: 18px; page-break-inside: avoid;">
        <p style="margin: 0 0 6px 0; font-size: 13px; line-height: 1.5;"><strong>${i + 1}.</strong> ${q.pertanyaan}</p>
        <div style="margin-left: 18px; font-size: 12.5px; line-height: 1.6;">
          ${OPSI_HURUF.map(h => `<div>${h}. ${q.opsi[h]}</div>`).join('')}
        </div>
      </div>`).join('');
    const kunciBody = questions.map((q, i) => `
      <div style="margin-bottom: 12px; page-break-inside: avoid; font-size: 12px; line-height: 1.5;">
        <strong>${i + 1}. [${q.subtes}${q.kategori ? ' - ' + q.kategori : ''}]</strong> Kunci: ${q.kunci} | Skor: ${q.skor}<br/>
        ${q.pembahasan}
      </div>`).join('');

    printWindow.document.write(`
      <html><head><title>Soal SKD CPNS - ${mode === 'FULL_SKD' ? 'Paket Campuran' : mode}</title></head>
      <body>
        <div style="font-family: Arial, sans-serif; padding: 24px; color: #1e293b;">
          <div style="text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 20px;">
            <h2 style="margin: 0; font-size: 17px;">LATIHAN SELEKSI KOMPETENSI DASAR (SKD) CPNS</h2>
            <p style="margin: 4px 0 0 0; font-size: 12px;">Mengacu KepmenPANRB No. 321/2024 — Subtes: ${mode === 'FULL_SKD' ? 'Campuran TWK, TIU, TKP' : mode} — ${questions.length} Butir</p>
          </div>
          ${watermark}
          ${body}
          <div class="page-break"></div>
          <h3 style="font-size: 15px; border-bottom: 1px solid #94a3b8; padding-bottom: 6px;">KUNCI JAWABAN & PEMBAHASAN</h3>
          ${kunciBody}
        </div>
      </body></html>
    `);
    printWindow.document.close();
  };

  const handleCopyAll = () => {
    const text = questions.map((q, i) =>
      `${i + 1}. ${q.pertanyaan}\n${OPSI_HURUF.map(h => `${h}. ${q.opsi[h]}`).join('\n')}\n\nKunci: ${q.kunci}\nPembahasan: ${q.pembahasan}\n`
    ).join('\n---\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const subtesCards: { id: CPNSMode; label: string; desc: string; badge: string }[] = [
    { id: 'TWK', label: 'TWK', desc: 'Wawasan Kebangsaan (5 Pilar)', badge: 'Ambang 65' },
    { id: 'TIU', label: 'TIU', desc: 'Inteligensi Umum (Verbal, Numerik, Figural)', badge: 'Ambang 80' },
    { id: 'TKP', label: 'TKP', desc: 'Karakteristik Pribadi (SJT, skor 1–5)', badge: 'Ambang 166' },
    { id: 'FULL_SKD', label: 'Campuran', desc: 'Gabungan TWK + TIU + TKP', badge: 'Proporsional' }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Award size={18} className="text-blue-600" />
              <h1 className="text-xl font-bold text-slate-900">Generator Soal SKD CPNS / PPPK</h1>
            </div>
            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
              Bank soal latihan mengacu KepmenPANRB No. 321/2024. Seluruh soal pilihan ganda 5 opsi (A–E). TWK & TIU: satu jawaban benar (5 poin), salah 0. TKP: setiap opsi berbobot 1–5.
            </p>
          </div>
          <div className="w-full md:w-64">
            <ModelSelector modality="text" label="Model Teks AI" value={selectedModel} onChange={setSelectedModel} disabled={isGenerating} />
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <BookOpen size={14} className="text-blue-600" /> Subtes
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {subtesCards.map(c => (
              <button
                key={c.id}
                type="button"
                onClick={() => handleModeChange(c.id)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  mode === c.id ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-500' : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-slate-900">{c.label}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">{c.badge}</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">{c.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {mode !== 'FULL_SKD' && (
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Fokus Materi</label>
            <div className="flex flex-wrap gap-1.5">
              {SUB_TOPIK_MAP[mode].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSubTopik(t)}
                  className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
                    subTopik === t ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-4 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Jumlah Soal</label>
            <div className="flex items-center gap-2">
              {[5, 10, 15, 20, 30].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setJumlahSoal(n)}
                  className={`px-3 py-1 text-xs rounded-md border font-semibold transition-all ${
                    jumlahSoal === n ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            disabled={isGenerating}
            onClick={handleGenerate}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Menyusun soal...</>
            ) : (
              <><Sparkles size={16} /> Generate Soal</>
            )}
          </button>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" /> {error}
          </div>
        )}
      </div>

      {/* Hasil */}
      {questions.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
            <div className="text-xs text-slate-600 flex flex-wrap items-center gap-2">
              <span className="font-semibold text-slate-800">{questions.length} soal</span>
              {adaSoalObjektif && (
                <span className="flex items-center gap-1.5">
                  · Sebaran kunci:
                  {kunciDistribusi.map(d => (
                    <span key={d.huruf} className="px-1.5 py-0.5 rounded bg-slate-100 font-mono">{d.huruf}:{d.jumlah}</span>
                  ))}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={handlePrint} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5">
                <Printer size={14} /> Cetak
              </button>
              <button type="button" onClick={handleCopyAll} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5">
                {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />} {copied ? 'Tersalin' : 'Salin Semua'}
              </button>
            </div>
          </div>

          {questions.map((q, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">{idx + 1}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">{q.subtes}</span>
                  {q.kategori && <span className="text-xs text-slate-500">{q.kategori}</span>}
                </div>
                <span className="text-[11px] text-slate-500">{q.subtes === 'TKP' ? 'Bobot 1–5' : 'Benar 5 · Salah 0'}</span>
              </div>

              <p className="text-sm text-slate-900 leading-relaxed whitespace-pre-wrap">{q.pertanyaan}</p>

              <div className="space-y-2">
                {OPSI_HURUF.map(h => (
                  <div key={h} className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 text-xs flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold shrink-0">{h}</span>
                    <span className="flex-1 text-slate-800 leading-normal">{q.opsi[h]}</span>
                  </div>
                ))}
              </div>

              {/* Kunci & pembahasan disembunyikan secara default agar tidak terlihat bersama soal */}
              <details className="bg-slate-50 rounded-xl border border-slate-200 group">
                <summary className="cursor-pointer select-none px-4 py-2.5 text-xs font-semibold text-blue-700 flex items-center gap-1.5">
                  <CheckCircle2 size={14} /> Lihat Kunci & Pembahasan
                </summary>
                <div className="px-4 pb-4 pt-1 space-y-2 border-t border-slate-200">
                  <p className="text-xs font-bold text-slate-800">Kunci: {q.kunci}</p>
                  {q.subtes === 'TKP' && q.skorOpsi && (
                    <div className="flex flex-wrap gap-1.5">
                      {OPSI_HURUF.map(h => (
                        <span key={h} className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-white border border-slate-200">
                          {h} = {q.skorOpsi?.[h] ?? '-'}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{q.pembahasan}</p>
                </div>
              </details>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

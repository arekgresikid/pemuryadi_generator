import React, { useState, useEffect } from 'react';
import ModelSelector from './ModelSelector';
import { educationLevels, phaseClassMap, subjectsByLevel } from '../constants';
import { GoogleGenAI } from '../lib/genai';
import PrintSupportModal from './PrintSupportModal';
import PDFRemixUpload from './PDFRemixUpload';
import { useAuth } from '../AuthContext';
import { getWatermarkHtml, getSignatureHtml, universalPrint } from '../utils/print';
import AIAssistedInput from './AIAssistedInput';
import AIAssistedTextarea from './AIAssistedTextarea';
import {
  FileText,
  Settings,
  List,
  Palette,
  Loader2,
  Sparkles,
  Printer,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Edit3,
  Check,
  Image as ImageIcon,
} from 'lucide-react';

interface WorksheetPair {
  kiri: string;
  kanan: string;
}

interface WorksheetActivity {
  nomor: number;
  tipe: string;
  pertanyaan: string;
  opsi?: string[];
  pasangan?: WorksheetPair[];
  kunciJawaban: string;
  pembahasan: string;
}

interface WorksheetData {
  judul: string;
  subjudul: string;
  tujuanPembelajaran: string;
  petunjukBelajar: string[];
  materiRingkas: string;
  aktivitas: WorksheetActivity[];
  refleksiSiswa: string;
}

const TEMPLATE_STYLES: Record<
  string,
  {
    name: string;
    cardBg: string;
    border: string;
    headerBg: string;
    accentText: string;
    badgeBg: string;
    printAccent: string;
    printHeaderBg: string;
  }
> = {
  Minimalis: {
    name: 'Minimalis (Hemat Tinta)',
    cardBg: 'bg-white',
    border: 'border-slate-800',
    headerBg: 'bg-slate-50',
    accentText: 'text-slate-900',
    badgeBg: 'bg-slate-200 text-slate-900',
    printAccent: '#0f172a',
    printHeaderBg: '#f8fafc',
  },
  Colorful: {
    name: 'Colorful (Ceria)',
    cardBg: 'bg-white',
    border: 'border-blue-500',
    headerBg: 'bg-blue-50',
    accentText: 'text-blue-900',
    badgeBg: 'bg-blue-100 text-blue-900',
    printAccent: '#1d4ed8',
    printHeaderBg: '#eff6ff',
  },
  Playful: {
    name: 'Playful (Ramah SD)',
    cardBg: 'bg-white',
    border: 'border-amber-500',
    headerBg: 'bg-amber-50',
    accentText: 'text-amber-900',
    badgeBg: 'bg-amber-100 text-amber-900',
    printAccent: '#b45309',
    printHeaderBg: '#fffbeb',
  },
  Modern: {
    name: 'Modern (Ilmiah)',
    cardBg: 'bg-white',
    border: 'border-indigo-600',
    headerBg: 'bg-indigo-50',
    accentText: 'text-indigo-950',
    badgeBg: 'bg-indigo-100 text-indigo-900',
    printAccent: '#4338ca',
    printHeaderBg: '#eef2ff',
  },
  Vintage: {
    name: 'Vintage (Klasik)',
    cardBg: 'bg-stone-50',
    border: 'border-stone-700',
    headerBg: 'bg-stone-100',
    accentText: 'text-stone-900',
    badgeBg: 'bg-stone-200 text-stone-900',
    printAccent: '#44403c',
    printHeaderBg: '#f5f5f4',
  },
};

function buildFallbackSvgIllustration(topic: string, subject: string): string {
  const safeTopic = (topic || 'Materi Pembelajaran').replace(/[<>&"]/g, '');
  const safeSub = (subject || 'LKPD').replace(/[<>&"]/g, '');
  return `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 180">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#e0e7ff"/>
          <stop offset="100%" stop-color="#fef3c7"/>
        </linearGradient>
      </defs>
      <rect width="800" height="180" rx="16" fill="url(#g)" stroke="#4f46e5" stroke-width="2"/>
      <circle cx="95" cy="90" r="46" fill="#4f46e5" opacity="0.15"/>
      <rect x="65" y="62" width="60" height="56" rx="8" fill="#4f46e5"/>
      <path d="M78 80h34M78 92h34M78 104h22" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
      <text x="165" y="82" font-family="Arial,sans-serif" font-size="24" font-weight="bold" fill="#1e1b4b">${safeTopic.slice(0, 44)}</text>
      <text x="165" y="114" font-family="Arial,sans-serif" font-size="15" fill="#4338ca">Lembar Kerja Peserta Didik • ${safeSub}</text>
    </svg>`
  )}`;
}

export default function WorksheetGenerator() {
  const { profile } = useAuth();
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [pendingPrintMode, setPendingPrintMode] = useState<'student' | 'teacher'>('student');
  const [selectedModel, setSelectedModel] = useState<string>('openai');
  const [selectedImageModel, setSelectedImageModel] = useState<string>('nanobanana');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<{
    jenjang: string;
    fase: string;
    kelas: string;
    mapel: string;
    topik: string;
    jenisSoal: string[];
    jumlahSoal: number;
    tingkatKesulitan: string;
    kerangkaTaksonomi: string;
    tingkatanKognitif: string;
    instruksiTambahan: string;
    gayaDesain: string;
    modeIlustrasi: 'ai' | 'none';
    namaGuru: string;
    jenisNipGuru: string;
    nipGuru: string;
    namaSekolah: string;
    jenisSekolah: string;
    kepalaSekolah: string;
    jenisNipKepalaSekolah: string;
    nipKepalaSekolah: string;
    remixText: string;
  }>({
    jenjang: 'sd',
    fase: 'A',
    kelas: '1',
    mapel: 'bahasa-indonesia',
    topik: '',
    jenisSoal: ['Pilihan Ganda'],
    jumlahSoal: 5,
    tingkatKesulitan: 'Sedang (MOTS)',
    kerangkaTaksonomi: 'Bloom',
    tingkatanKognitif: 'C1 - Mengingat',
    instruksiTambahan: '',
    gayaDesain: 'Minimalis',
    modeIlustrasi: 'none',
    namaGuru: '',
    jenisNipGuru: 'NIP',
    nipGuru: '',
    namaSekolah: '',
    jenisSekolah: 'Negeri',
    kepalaSekolah: '',
    jenisNipKepalaSekolah: 'NIP',
    nipKepalaSekolah: '',
    remixText: '',
  });

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    pengaturan: true,
    detail: false,
    gaya: false,
  });

  const [worksheetData, setWorksheetData] = useState<WorksheetData | null>(null);
  const [illustrationUrl, setIllustrationUrl] = useState<string | null>(null);
  const [showTeacherKey, setShowTeacherKey] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleJenisSoalChange = (bentuk: string) => {
    let current = [...formData.jenisSoal];
    if (bentuk === 'Kombinasi') {
      current = ['Kombinasi'];
    } else {
      current = current.filter(c => c !== 'Kombinasi');
      if (current.includes(bentuk)) current = current.filter(c => c !== bentuk);
      else current.push(bentuk);
    }
    if (current.length === 0) current = ['Pilihan Ganda'];
    setFormData(prev => ({ ...prev, jenisSoal: current }));
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  useEffect(() => {
    const phases = phaseClassMap[formData.jenjang]?.phases || [];
    const firstPhase = phases[0]?.id || '';
    const classes = phaseClassMap[formData.jenjang]?.classes?.[firstPhase] || [];
    const firstClass = classes[0]?.id || '';
    const subjects = subjectsByLevel[formData.jenjang] || [];
    const firstSubject = subjects[0]?.id || '';
    setFormData(prev => ({ ...prev, fase: firstPhase, kelas: firstClass, mapel: firstSubject }));
  }, [formData.jenjang]);

  useEffect(() => {
    const classes = phaseClassMap[formData.jenjang]?.classes?.[formData.fase] || [];
    setFormData(prev => ({ ...prev, kelas: classes[0]?.id || '' }));
  }, [formData.fase, formData.jenjang]);

  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        namaGuru: profile.displayName || profile.nama || prev.namaGuru,
        nipGuru: profile.nip || prev.nipGuru,
        namaSekolah: profile.namaSekolah || prev.namaSekolah,
        kepalaSekolah: profile.kepalaSekolah || prev.kepalaSekolah,
        nipKepalaSekolah: profile.nipKepalaSekolah || prev.nipKepalaSekolah,
        jenjang: profile.jenjang?.toLowerCase() || prev.jenjang,
      }));
    }
  }, [profile]);

  const generateWorksheet = async () => {
    if (!formData.topik.trim()) {
      setError('Topik/Materi harus diisi.');
      return;
    }

    setIsGenerating(true);
    setError('');
    setWorksheetData(null);
    setIllustrationUrl(null);

    try {
      const ai = new GoogleGenAI({});
      const subjectLabel = subjectsByLevel[formData.jenjang]?.find(s => s.id === formData.mapel)?.label || formData.mapel;
      const faseLabel = phaseClassMap[formData.jenjang]?.phases?.find(p => p.id === formData.fase)?.label || formData.fase;
      const kelasLabel = phaseClassMap[formData.jenjang]?.classes?.[formData.fase]?.find(c => c.id === formData.kelas)?.label || formData.kelas;
      const jenjangLabel = educationLevels.find(l => l.id === formData.jenjang)?.label || formData.jenjang;

      if (formData.modeIlustrasi === 'ai') {
        try {
          const encodedPrompt = encodeURIComponent(
            `Clean educational worksheet banner illustration about ${formData.topik}, flat vector style, bright school friendly`
          );
          const randomSeed = Math.floor(Math.random() * 1000000);
          const imageResponse = await fetch(
            `/api/generate-image?prompt=${encodedPrompt}&model=${selectedImageModel}&seed=${randomSeed}`
          );
          if (imageResponse.ok) {
            const blob = await imageResponse.blob();
            setIllustrationUrl(URL.createObjectURL(blob));
          } else {
            setIllustrationUrl(buildFallbackSvgIllustration(formData.topik, subjectLabel));
          }
        } catch {
          setIllustrationUrl(buildFallbackSvgIllustration(formData.topik, subjectLabel));
        }
      }

      const prompt = `Susunlah Lembar Kerja Peserta Didik (LKPD) / Worksheet Kurikulum Merdeka dalam format JSON MURNI (tanpa markdown \`\`\`json, tanpa teks tambahan).

Identitas Materi:
- Jenjang: ${jenjangLabel}
- Fase / Kelas: ${faseLabel} / ${kelasLabel}
- Mata Pelajaran: ${subjectLabel}
- Topik / Materi: ${formData.topik}
- Bentuk Soal Diminta: ${formData.jenisSoal.join(', ')}
- Jumlah Aktivitas / Soal: ${formData.jumlahSoal}
- Tingkat Kesulitan: ${formData.tingkatKesulitan}
- Kerangka Kognitif (${formData.kerangkaTaksonomi}): ${formData.tingkatanKognitif} (JANGAN tampilkan kode C1/C2/dll di teks soal!)
- Instruksi Tambahan: ${formData.instruksiTambahan || 'Tidak ada'}
${formData.remixText ? `\nREFERENSI REMIX:\n${formData.remixText}\n` : ''}

Aturan Struktur JSON Wajib:
{
  "judul": "Judul LKPD Menarik & Jelas",
  "subjudul": "Subjudul singkat sesuai topik",
  "tujuanPembelajaran": "1-2 kalimat tujuan pembelajaran berpola ABCD",
  "petunjukBelajar": ["Petunjuk 1", "Petunjuk 2", "Petunjuk 3"],
  "materiRingkas": "Ringkasan materi pengantar padat dan mudah dipahami siswa (2-4 kalimat)",
  "aktivitas": [
    {
      "nomor": 1,
      "tipe": "Pilihan Ganda | Pilihan Ganda Kompleks | Benar Salah | Menjodohkan | Isian Singkat | Uraian",
      "pertanyaan": "Rumusan pertanyaan jelas dan kontekstual",
      "opsi": ["Opsi A", "Opsi B", "Opsi C", "Opsi D"],
      "pasangan": [{"kiri": "Premis 1", "kanan": "Pasangan 1"}],
      "kunciJawaban": "Kunci jawaban singkat & pasti",
      "pembahasan": "Penjelasan ringkas untuk pegangan guru"
    }
  ],
  "refleksiSiswa": "1 pertanyaan refleksi diri singkat untuk siswa setelah mengerjakan LKPD"
}

Catatan:
- Isi field "opsi" untuk tipe Pilihan Ganda / Pilihan Ganda Kompleks.
- Isi field "pasangan" (minimal 3 pasang) hanya untuk tipe Menjodohkan.
- Pastikan jumlah item pada array "aktivitas" tepat ${formData.jumlahSoal}.`;

      const response = await ai.models.generateContent({
        model: selectedModel,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const raw = (response.text || '').replace(/```(?:json)?\n?/gi, '').replace(/```/g, '').trim();
      const parsed: WorksheetData = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.aktivitas) || parsed.aktivitas.length === 0) {
        throw new Error('Struktur JSON LKPD tidak lengkap.');
      }
      setWorksheetData(parsed);
      setIsEditMode(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Terjadi kesalahan saat menghasilkan worksheet.');
    } finally {
      setIsGenerating(false);
    }
  };

  const executePrint = () => {
    if (!worksheetData) return;
    const isTeacher = pendingPrintMode === 'teacher';
    const tpl = TEMPLATE_STYLES[formData.gayaDesain] || TEMPLATE_STYLES.Minimalis;
    const subjectLabel = subjectsByLevel[formData.jenjang]?.find(s => s.id === formData.mapel)?.label || formData.mapel;
    const kelasLabel = phaseClassMap[formData.jenjang]?.classes?.[formData.fase]?.find(c => c.id === formData.kelas)?.label || formData.kelas;

    const activitiesHtml = worksheetData.aktivitas
      .map(item => {
        let extra = '';
        if (item.opsi && item.opsi.length > 0 && /pilihan ganda/i.test(item.tipe)) {
          const isComplex = /kompleks/i.test(item.tipe);
          extra = `<ul style="list-style:none;padding-left:16px;margin:6px 0 0;">
            ${item.opsi
              .map(
                (o, idx) =>
                  `<li style="margin-bottom:3px;">${isComplex ? '&#9744;' : `${String.fromCharCode(65 + idx)}.`} ${o}</li>`
              )
              .join('')}
          </ul>`;
        } else if (/benar salah/i.test(item.tipe)) {
          extra = `<div style="margin-top:6px;font-size:12px;">[ &nbsp; ] Benar &nbsp;&nbsp;&nbsp; [ &nbsp; ] Salah</div>`;
        } else if (item.pasangan && item.pasangan.length > 0 && /jodoh/i.test(item.tipe)) {
          extra = `<table style="width:100%;border-collapse:collapse;margin-top:6px;font-size:12px;">
            <tr><th style="background:${tpl.printHeaderBg};">Kolom A</th><th style="width:60px;text-align:center;background:${tpl.printHeaderBg};">Pasangan</th><th style="background:${tpl.printHeaderBg};">Kolom B</th></tr>
            ${item.pasangan
              .map(
                (p, pi) =>
                  `<tr><td>${pi + 1}. ${p.kiri}</td><td style="text-align:center;">( .... )</td><td>${String.fromCharCode(65 + pi)}. ${p.kanan}</td></tr>`
              )
              .join('')}
          </table>`;
        } else if (/isian/i.test(item.tipe)) {
          extra = `<div style="margin-top:10px;border-bottom:1px dashed #334155;height:20px;"></div>`;
        } else if (/uraian|essay/i.test(item.tipe)) {
          extra = `<div style="margin-top:8px;border:1px dashed #94a3b8;height:56px;border-radius:4px;"></div>`;
        }

        const keyBlock = isTeacher
          ? `<div style="margin-top:6px;padding:6px 10px;background:#f0fdf4;border-left:3px solid #16a34a;font-size:11.5px;">
              <strong>Kunci:</strong> ${item.kunciJawaban}<br/>
              <em>Pembahasan:</em> ${item.pembahasan}
            </div>`
          : '';

        return `
          <div style="margin-bottom:12px;page-break-inside:avoid;">
            <div style="font-size:13px;line-height:1.45;">
              <strong>${item.nomor}.</strong> ${item.pertanyaan}
              <span style="font-size:10px;color:#475569;margin-left:6px;">[${item.tipe}]</span>
            </div>
            ${extra}
            ${keyBlock}
          </div>
        `;
      })
      .join('');

    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
        <div style="border:2px solid ${tpl.printAccent};background:${tpl.printHeaderBg};border-radius:10px;padding:12px 16px;margin-bottom:12px;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;">
            <div>
              <h1 style="margin:0;font-size:18px;color:${tpl.printAccent};">${worksheetData.judul} ${isTeacher ? '(PEGANGAN GURU)' : ''}</h1>
              <p style="margin:3px 0 0;font-size:12px;color:#334155;">${worksheetData.subjudul}</p>
            </div>
            <div style="font-size:11px;text-align:right;white-space:nowrap;">
              <strong>${subjectLabel}</strong> • ${kelasLabel}
            </div>
          </div>
          ${
            !isTeacher
              ? `<table style="width:100%;border-collapse:collapse;margin-top:10px;font-size:11.5px;background:#fff;">
                  <tr>
                    <td style="width:50%;padding:5px 8px;border:1px solid #cbd5e1;">Nama Siswa: ...........................................</td>
                    <td style="width:50%;padding:5px 8px;border:1px solid #cbd5e1;">Sekolah: ${formData.namaSekolah || '...........................................'}</td>
                  </tr>
                  <tr>
                    <td style="padding:5px 8px;border:1px solid #cbd5e1;">Kelas: ${kelasLabel}</td>
                    <td style="padding:5px 8px;border:1px solid #cbd5e1;">Tanggal: ...........................................</td>
                  </tr>
                </table>`
              : ''
          }
        </div>

        ${
          illustrationUrl && formData.modeIlustrasi === 'ai'
            ? `<div style="text-align:center;margin-bottom:12px;"><img src="${illustrationUrl}" style="max-height:140px;width:auto;border-radius:8px;margin:0 auto;" /></div>`
            : ''
        }

        <div style="margin-bottom:10px;padding:8px 12px;border:1px solid #cbd5e1;border-radius:6px;font-size:12px;">
          <strong>Tujuan Pembelajaran:</strong> ${worksheetData.tujuanPembelajaran}<br/>
          <strong>Petunjuk:</strong> ${worksheetData.petunjukBelajar.join(' • ')}
        </div>

        <div style="margin-bottom:12px;padding:8px 12px;background:#f8fafc;border-left:4px solid ${tpl.printAccent};font-size:12px;line-height:1.5;">
          <strong>Ringkasan Materi:</strong> ${worksheetData.materiRingkas}
        </div>

        <div>${activitiesHtml}</div>

        ${
          !isTeacher
            ? `<div style="margin-top:14px;padding:10px;border:1px dashed #64748b;border-radius:6px;font-size:12px;page-break-inside:avoid;">
                <strong>Refleksi Siswa:</strong> ${worksheetData.refleksiSiswa}
                <div style="margin-top:18px;border-bottom:1px dotted #94a3b8;"></div>
              </div>`
            : getSignatureHtml(profile || {
                nama: formData.namaGuru,
                nip: formData.nipGuru,
                jenisNipGuru: formData.jenisNipGuru,
                kepalaSekolah: formData.kepalaSekolah,
                nipKepalaSekolah: formData.nipKepalaSekolah,
                jenisNipKepalaSekolah: formData.jenisNipKepalaSekolah,
              })
        }
        ${getWatermarkHtml(profile)}
      </div>
    `;

    universalPrint(html, `LKPD - ${worksheetData.judul}${isTeacher ? ' (Guru)' : ''}`);
  };

  const activeTpl = TEMPLATE_STYLES[formData.gayaDesain] || TEMPLATE_STYLES.Minimalis;

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex items-center gap-4 mb-2">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg">
          <FileText size={28} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-black">Mesin Generator LKPD / Worksheet</h3>
          <p className="text-gray-600 text-sm">
            Susun Lembar Kerja Peserta Didik (LKPD) Kurikulum Merdeka terstruktur, siap edit cepat, & cetak kertas Letter (Siswa & Guru).
          </p>
        </div>
      </div>

      <div className="w-full flex flex-col gap-6">
        {/* Form Panel */}
        <div className="w-full flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('pengaturan')}
              className="w-full flex items-center justify-between p-5 bg-white hover:bg-gray-50 transition-colors"
            >
              <h4 className="font-semibold text-blue-600 flex items-center gap-2">
                <Settings size={18} /> Pengaturan Worksheet
              </h4>
              {expandedSections['pengaturan'] ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
            </button>
            {expandedSections['pengaturan'] && (
              <div className="p-5 pt-0 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Jenjang</label>
                    <select value={formData.jenjang} onChange={e => setFormData({ ...formData, jenjang: e.target.value })} className="w-full bg-white border border-gray-300 rounded-xl p-3 text-black">
                      {educationLevels.map(level => (
                        <option key={level.id} value={level.id}>{level.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Fase</label>
                    <select value={formData.fase} onChange={e => setFormData({ ...formData, fase: e.target.value })} className="w-full bg-white border border-gray-300 rounded-xl p-3 text-black">
                      {phaseClassMap[formData.jenjang]?.phases?.map(p => (
                        <option key={p.id} value={p.id}>{p.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Kelas</label>
                    <select value={formData.kelas} onChange={e => setFormData({ ...formData, kelas: e.target.value })} className="w-full bg-white border border-gray-300 rounded-xl p-3 text-black">
                      {phaseClassMap[formData.jenjang]?.classes?.[formData.fase]?.map(c => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Mata Pelajaran</label>
                    <select value={formData.mapel} onChange={e => setFormData({ ...formData, mapel: e.target.value })} className="w-full bg-white border border-gray-300 rounded-xl p-3 text-black">
                      {subjectsByLevel[formData.jenjang]?.map(s => (
                        <option key={s.id} value={s.id}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Topik / Materi Pembelajaran</label>
                    <AIAssistedInput
                      type="text"
                      placeholder="Contoh: Sistem Pencernaan Manusia, Pecahan Senilai, Ekosistem"
                      value={formData.topik}
                      onChange={e => setFormData({ ...formData, topik: e.target.value })}
                      className="w-full bg-white border border-gray-300 rounded-xl p-3 text-black text-sm"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('detail')}
              className="w-full flex items-center justify-between p-5 bg-white hover:bg-gray-50 transition-colors"
            >
              <h4 className="font-semibold text-blue-600 flex items-center gap-2">
                <List size={18} /> Detail Aktivitas & Soal
              </h4>
              {expandedSections['detail'] ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
            </button>
            {expandedSections['detail'] && (
              <div className="p-5 pt-0 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bentuk/Jenis Soal</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {['Pilihan Ganda', 'Pilihan Ganda Kompleks', 'Benar Salah', 'Menjodohkan', 'Isian Singkat', 'Uraian', 'Essay', 'Kombinasi'].map(bentuk => (
                        <label key={bentuk} className="flex items-center gap-2 cursor-pointer bg-white p-2.5 rounded-xl border border-gray-300 hover:border-blue-500">
                          <input
                            type="checkbox"
                            checked={formData.jenisSoal.includes(bentuk)}
                            onChange={() => handleJenisSoalChange(bentuk)}
                            className="w-4 h-4 rounded text-blue-600"
                          />
                          <span className="text-xs text-black">{bentuk}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Jumlah Soal / Aktivitas</label>
                    <input type="number" min="1" max="20" value={formData.jumlahSoal} onChange={e => setFormData({ ...formData, jumlahSoal: parseInt(e.target.value) || 5 })} className="w-full bg-white border border-gray-300 rounded-xl p-3 text-black text-sm" />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Tingkat Kesulitan</label>
                    <select value={formData.tingkatKesulitan} onChange={e => setFormData({ ...formData, tingkatKesulitan: e.target.value })} className="w-full bg-white border border-gray-300 rounded-xl p-3 text-black">
                      <option value="Mudah (LOTS)">Mudah (LOTS)</option>
                      <option value="Sedang (MOTS)">Sedang (MOTS)</option>
                      <option value="Sulit (HOTS)">Sulit (HOTS)</option>
                      <option value="Campuran">Campuran</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Kerangka Taksonomi</label>
                    <div className="flex bg-slate-50 p-1 rounded-full border border-slate-100 mb-3">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, kerangkaTaksonomi: 'Bloom', tingkatanKognitif: 'C1 - Mengingat' })}
                        className={`flex-1 py-2 text-sm font-bold rounded-full transition-all ${formData.kerangkaTaksonomi === 'Bloom' ? 'bg-white text-indigo-900 shadow-sm border border-slate-200' : 'text-indigo-800/70'}`}
                      >
                        Taksonomi Bloom
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, kerangkaTaksonomi: 'SOLO', tingkatanKognitif: 'Pra-struktural' })}
                        className={`flex-1 py-2 text-sm font-bold rounded-full transition-all ${formData.kerangkaTaksonomi === 'SOLO' ? 'bg-white text-indigo-900 shadow-sm border border-slate-200' : 'text-indigo-800/70'}`}
                      >
                        Taksonomi SOLO
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(formData.kerangkaTaksonomi === 'Bloom'
                        ? ['C1 - Mengingat', 'C2 - Memahami', 'C3 - Menerapkan', 'C4 - Menganalisis', 'C5 - Mengevaluasi', 'C6 - Mencipta']
                        : ['Pra-struktural', 'Uni-struktural', 'Multi-struktural', 'Relasional', 'Abstrak Diperluas']
                      ).map(level => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setFormData({ ...formData, tingkatanKognitif: level })}
                          className={`px-3.5 py-1.5 text-xs font-bold rounded-full border transition-all ${formData.tingkatanKognitif === level ? 'bg-indigo-50 border-indigo-400 text-indigo-900' : 'bg-white border-slate-200 text-slate-600'}`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Instruksi Tambahan (Opsional)</label>
                    <AIAssistedTextarea rows={2} placeholder="Contoh: Kontekstual dengan lingkungan sekitar siswa..." value={formData.instruksiTambahan} onChange={e => setFormData({ ...formData, instruksiTambahan: e.target.value })} className="w-full bg-white border border-gray-300 rounded-xl p-3 text-black text-sm" />
                  </div>
                  <div className="col-span-2">
                    <PDFRemixUpload onTextExtracted={(text) => setFormData(prev => ({ ...prev, remixText: text }))} label="Remix dari PDF (Opsional)" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('gaya')}
              className="w-full flex items-center justify-between p-5 bg-white hover:bg-gray-50 transition-colors"
            >
              <h4 className="font-semibold text-blue-600 flex items-center gap-2">
                <Palette size={18} /> Gaya Desain & Mode Ilustrasi
              </h4>
              {expandedSections['gaya'] ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
            </button>
            {expandedSections['gaya'] && (
              <div className="p-5 pt-0 border-t border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Template Visual</label>
                    <select value={formData.gayaDesain} onChange={e => setFormData({ ...formData, gayaDesain: e.target.value })} className="w-full bg-white border border-gray-300 rounded-xl p-3 text-black">
                      {Object.entries(TEMPLATE_STYLES).map(([k, v]) => (
                        <option key={k} value={k}>{v.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                      <ImageIcon size={15} /> Mode Ilustrasi
                    </label>
                    <select
                      value={formData.modeIlustrasi}
                      onChange={e => setFormData({ ...formData, modeIlustrasi: e.target.value as 'ai' | 'none' })}
                      className="w-full bg-white border border-gray-300 rounded-xl p-3 text-black"
                    >
                      <option value="none">Tanpa Gambar (Hemat Tinta / Fotokopi)</option>
                      <option value="ai">Sertakan Ilustrasi Banner Edukatif</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl text-red-700 p-4 text-sm font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ModelSelector label="Model Teks" modality="text" value={selectedModel} onChange={setSelectedModel} disabled={isGenerating} />
            {formData.modeIlustrasi === 'ai' && (
              <ModelSelector label="Model Gambar" modality="image" value={selectedImageModel} onChange={setSelectedImageModel} disabled={isGenerating} />
            )}
          </div>

          <button
            type="button"
            onClick={generateWorksheet}
            disabled={isGenerating}
            className="w-full py-4 rounded-xl font-bold text-lg text-white transition-all flex items-center justify-center gap-2 shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Menyusun LKPD Terstruktur...</span>
              </>
            ) : (
              <>
                <Sparkles size={20} /> Generate Worksheet / LKPD
              </>
            )}
          </button>
        </div>

        {/* Result Panel */}
        <div className="w-full bg-white border border-gray-200 rounded-2xl p-6 min-h-[400px]">
          {worksheetData ? (
            <div className="space-y-5">
              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-200">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditMode(!isEditMode)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
                      isEditMode ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {isEditMode ? <Check size={14} /> : <Edit3 size={14} />}
                    {isEditMode ? 'Selesai Edit' : 'Edit Cepat Teks'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTeacherKey(!showTeacherKey)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
                      showTeacherKey ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {showTeacherKey ? <EyeOff size={14} /> : <Eye size={14} />}
                    {showTeacherKey ? 'Sembunyikan Kunci' : 'Lihat Kunci Guru'}
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPendingPrintMode('student');
                      setIsPrintModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow flex items-center gap-1.5"
                  >
                    <Printer size={15} /> Cetak Lembar Siswa
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPendingPrintMode('teacher');
                      setIsPrintModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold shadow flex items-center gap-1.5"
                  >
                    <Printer size={15} /> Cetak Pegangan Guru
                  </button>
                </div>
              </div>

              {/* Verified Template Preview */}
              <div className={`rounded-2xl border-2 p-6 space-y-5 ${activeTpl.cardBg} ${activeTpl.border}`}>
                <div className={`rounded-xl p-4 border ${activeTpl.headerBg} ${activeTpl.border}`}>
                  {isEditMode ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={worksheetData.judul}
                        onChange={e => setWorksheetData({ ...worksheetData, judul: e.target.value })}
                        className="w-full font-extrabold text-xl bg-white border border-gray-300 rounded-lg px-3 py-1.5"
                      />
                      <input
                        type="text"
                        value={worksheetData.subjudul}
                        onChange={e => setWorksheetData({ ...worksheetData, subjudul: e.target.value })}
                        className="w-full text-sm bg-white border border-gray-300 rounded-lg px-3 py-1"
                      />
                    </div>
                  ) : (
                    <>
                      <h2 className={`text-xl font-extrabold ${activeTpl.accentText}`}>{worksheetData.judul}</h2>
                      <p className="text-sm text-gray-700 mt-0.5">{worksheetData.subjudul}</p>
                    </>
                  )}
                  <div className="grid grid-cols-2 gap-2 mt-3 text-xs bg-white p-2.5 rounded-lg border border-gray-200 text-gray-700">
                    <div>Nama Siswa: ............................</div>
                    <div>Sekolah: {formData.namaSekolah || '............................'}</div>
                    <div>Kelas: {formData.kelas}</div>
                    <div>Tanggal: ............................</div>
                  </div>
                </div>

                {illustrationUrl && formData.modeIlustrasi === 'ai' && (
                  <div className="flex justify-center">
                    <img src={illustrationUrl} alt="Ilustrasi LKPD" className="max-h-44 rounded-xl border border-gray-200 shadow-sm" />
                  </div>
                )}

                <div className="text-xs sm:text-sm bg-slate-50 p-3.5 rounded-xl border border-gray-200 space-y-1">
                  <p><strong>Tujuan Pembelajaran:</strong> {worksheetData.tujuanPembelajaran}</p>
                  <p><strong>Petunjuk Belajar:</strong> {worksheetData.petunjukBelajar.join(' • ')}</p>
                </div>

                <div className={`p-3.5 rounded-xl border-l-4 bg-slate-50 text-sm ${activeTpl.border}`}>
                  <strong className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Ringkasan Materi</strong>
                  {isEditMode ? (
                    <textarea
                      rows={3}
                      value={worksheetData.materiRingkas}
                      onChange={e => setWorksheetData({ ...worksheetData, materiRingkas: e.target.value })}
                      className="w-full bg-white border border-gray-300 rounded-lg p-2 text-sm"
                    />
                  ) : (
                    <p className="text-gray-800 leading-relaxed">{worksheetData.materiRingkas}</p>
                  )}
                </div>

                <div className="space-y-4">
                  {worksheetData.aktivitas.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-gray-200 bg-white space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 text-sm font-medium text-gray-900">
                          <span className="font-bold mr-1.5">{item.nomor}.</span>
                          {isEditMode ? (
                            <textarea
                              rows={2}
                              value={item.pertanyaan}
                              onChange={e => {
                                const next = [...worksheetData.aktivitas];
                                next[idx] = { ...next[idx], pertanyaan: e.target.value };
                                setWorksheetData({ ...worksheetData, aktivitas: next });
                              }}
                              className="w-full mt-1 bg-slate-50 border border-gray-300 rounded-lg p-2 text-sm"
                            />
                          ) : (
                            item.pertanyaan
                          )}
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${activeTpl.badgeBg}`}>
                          {item.tipe}
                        </span>
                      </div>

                      {item.opsi && item.opsi.length > 0 && /pilihan ganda/i.test(item.tipe) && (
                        <ul className="pl-5 space-y-1 text-sm text-gray-700">
                          {item.opsi.map((op, oi) => (
                            <li key={oi}>
                              {/kompleks/i.test(item.tipe) ? '☐' : `${String.fromCharCode(65 + oi)}.`} {op}
                            </li>
                          ))}
                        </ul>
                      )}

                      {item.pasangan && item.pasangan.length > 0 && /jodoh/i.test(item.tipe) && (
                        <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-gray-200">
                          <div className="space-y-1">
                            {item.pasangan.map((p, pi) => (
                              <div key={pi}><strong>{pi + 1}.</strong> {p.kiri}</div>
                            ))}
                          </div>
                          <div className="space-y-1">
                            {item.pasangan.map((p, pi) => (
                              <div key={pi}><strong>{String.fromCharCode(65 + pi)}.</strong> {p.kanan}</div>
                            ))}
                          </div>
                        </div>
                      )}

                      {showTeacherKey && (
                        <div className="mt-2 p-2.5 rounded-lg bg-emerald-50 border-l-4 border-emerald-600 text-xs text-emerald-950">
                          <strong>Kunci:</strong> {item.kunciJawaban}
                          <div className="mt-0.5 text-emerald-800"><em>Pembahasan:</em> {item.pembahasan}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="p-3.5 rounded-xl border border-dashed border-gray-400 text-xs text-gray-700">
                  <strong>Refleksi Siswa:</strong> {worksheetData.refleksiSiswa}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-16 flex flex-col items-center justify-center">
              <FileText size={64} className="mb-4 text-gray-300" />
              <p className="text-sm">LKPD / Worksheet terstruktur akan muncul di sini</p>
            </div>
          )}
        </div>
      </div>

      <PrintSupportModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        onConfirm={executePrint}
      />
    </div>
  );
}

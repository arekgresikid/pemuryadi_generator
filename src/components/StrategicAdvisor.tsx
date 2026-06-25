import React, { useState } from 'react';
import { GoogleGenAI } from '../lib/genai';
import { BrainCircuit, Loader2, Play, Printer, ChevronUp, ChevronDown, CheckCircle2, FileText, Target, Info } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function StrategicAdvisor() {
  const [prompt, setPrompt] = useState('');
  const [responseHtml, setResponseHtml] = useState('');
  const [thinking, setThinking] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    input: true,
    result: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const strategicGoals = [
    "Meningkatkan Rapor Pendidikan Sekolah",
    "Strategi Penerimaan Peserta Didik Baru (PPDB)",
    "Manajemen Konflik Internal & SDM",
    "Optimalisasi & Transparansi Dana BOS",
    "Membangun Kemitraan Strategis DUDI",
    "Pengembangan Kurikulum Berbasis Kompetensi"
  ];

  const handleGoalClick = (goal: string) => {
    setPrompt(`Tujuan Organisasi: ${goal}\n\nBerikan saran strategis komprehensif untuk mencapai tujuan ini berdasarkan kondisi satuan pendidikan pada umumnya, serta langkah taktis yang harus diambil Kepala Sekolah.`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setThinking(true);
    setResponseHtml('');

    try {
      const finalPrompt = prompt;

      const ai = new GoogleGenAI({});
      const response = await ai.models.generateContent({
        model: 'openai',
        contents: finalPrompt,
        config: {
          systemInstruction: "Anda adalah Penasihat Strategis Senior (Strategic Advisor) untuk institusi pendidikan. Tugas utama Anda adalah memberikan arahan visioner, merumuskan kebijakan taktis, evaluasi mutu, dan pemecahan masalah institusional. WAJIB gunakan analisis '5 Why', 'Fishbone Analysis', dan 'Venn Diagram' (dalam format teks/tabel jika perlu) untuk mengidentifikasi akar masalah dari setiap kendala. Berikan rekomendasi yang berorientasi pada pencapaian tujuan organisasi. DILARANG KERAS menggunakan kata pengantar AI (seperti 'Halo', 'Tentu'), dan dilarang menggunakan kata penutup basa-basi. HANYA KELUARKAN KONTEN MARKDOWN MURNI."
        }
      });

      setResponseHtml(response.text || '');
      setExpandedSections(prev => ({ ...prev, result: true }));
    } catch (error: any) {
      setResponseHtml(`**Error:** ${error.message}`);
    } finally {
      setThinking(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto font-sans text-gray-900 h-full flex flex-col">
      <header className="mb-10 border-b border-gray-100 pb-6 shrink-0">
        <div className="flex justify-between items-baseline mb-6">
          <div>
             <div className="text-sm text-blue-600 font-semibold mb-2">Thinking Level: HIGH</div>
             <h1 className="text-3xl font-bold text-gray-900 mt-2 flex items-center gap-4">
               <BrainCircuit className="text-blue-600 hidden sm:block" size={40} />
               Penasihat Strategis (Strategic Advisor)
             </h1>
          </div>
        </div>

        {/* Informational Card */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex items-start gap-4">
          <Info className="text-blue-600 mt-1 shrink-0" size={24} />
          <div>
            <h3 className="font-bold text-gray-900 mb-2">Bantuan & Fungsi Penasihat Strategis</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              Fitur ini dirancang sebagai <strong>Mitra Berpikir Eksekutif</strong> untuk Kepala Sekolah dan Manajemen. 
              Tujuannya adalah membantu Anda merumuskan kebijakan taktis, melakukan evaluasi mutu pendidikan secara mendalam (menggunakan metode seperti <em>5 Why</em> dan <em>Fishbone Analysis</em>), 
              serta menemukan solusi atas pemecahan masalah institusional (SDM, Finansial, atau Kurikulum).
            </p>
          </div>
        </div>
      </header>

      <div className="space-y-6 flex-1 overflow-auto pb-12">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-4">
          <button 
            onClick={() => toggleSection('input')}
            className="w-full flex items-center justify-between p-6 bg-white text-gray-900 hover:bg-gray-50 border-b border-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <BrainCircuit size={20} />
              <h2 className="font-semibold text-gray-900">A. Form Permintaan & Tujuan Strategis</h2>
            </div>
            {expandedSections.input ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          
          {expandedSections.input && (
            <div className="p-6 md:p-8 space-y-6 border-t border-gray-100">
              
              {/* Quick Select Goals */}
              <div className="mb-6">
                <h3 className="text-[11px] font-bold text-gray-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Target size={14} /> Tujuan Apa Yang Ingin Dicapai Organisasi?
                </h3>
                <div className="flex flex-wrap gap-2">
                  {strategicGoals.map((goal, index) => (
                    <button
                      key={index}
                      onClick={() => handleGoalClick(goal)}
                      className="text-xs bg-gray-100 hover:bg-blue-100 hover:text-blue-700 text-gray-700 px-4 py-2 rounded-full font-medium transition-colors border border-transparent hover:border-blue-200"
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="relative no-print">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Atau ketikkan masalah spesifik / konteks evaluasi yang sedang dihadapi sekolah..."
                  className="w-full h-40 w-full bg-gray-50 border border-gray-300 rounded-xl p-4 text-gray-900 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                />
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={thinking || !prompt.trim()}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center disabled:opacity-50"
                  >
                    {thinking ? <Loader2 size={16} className="animate-spin mr-3" /> : <Play size={16} className="mr-3" />}
                    {thinking ? 'Synthesis...' : 'Execute Strategy'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-4">
          <button 
            onClick={() => toggleSection('result')}
            className="w-full flex items-center justify-between p-6 bg-white text-gray-900 hover:bg-gray-50 border-b border-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileText size={20} />
              <h2 className="font-semibold text-gray-900">B. Sintesis Advisor</h2>
            </div>
            {expandedSections.result ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          
          {expandedSections.result && (
            <div className="p-6 md:p-8 space-y-6 border-t border-gray-100 relative min-h-[300px]">
              {thinking ? (
                <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                  <Loader2 size={48} className="animate-spin text-blue-600 mb-4" />
                  <p className="font-mono text-[11px] uppercase tracking-[3px] text-gray-900 font-bold animate-pulse">
                    Synthesizing Global Strategy...
                  </p>
                  <p className="text-[10px] text-gray-500 mt-2  font-sans">Thinking at HIGH level. This might take a bit longer.</p>
                </div>
              ) : null}

              {responseHtml ? (
                <div className="prose prose-slate max-w-none prose-headings:font-sans prose-headings:text-gray-900 prose-a:text-blue-600 prose-p:font-sans prose-p:leading-[1.8] prose-p:text-sm">
                  <div className="no-print flex justify-end mb-4">
                     <button onClick={() => window.print()} className="flex items-center gap-2 bg-white text-gray-900 border border-gray-200 px-4 py-2 text-[10px] uppercase font-bold tracking-widest hover:bg-gray-900 hover:text-white transition-colors">
                        <Printer size={14} /> Cetak Dokumen
                     </button>
                  </div>
                  <div id="printArea" className="markdown-body print-area">
                    <ReactMarkdown>{responseHtml}</ReactMarkdown>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 p-12 bg-blue-50 border border-gray-100 text-center mt-4">
                   <BrainCircuit size={48} className="mb-4 opacity-50" />
                  <span className="font-sans  text-sm">Pilih tujuan atau ketik masalah untuk memulai analisis mendalam...</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

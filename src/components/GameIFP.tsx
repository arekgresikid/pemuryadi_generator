import React, { useState, useEffect, useRef } from 'react';
import ModelSelector from './ModelSelector';
import { GoogleGenAI, Type } from '../lib/genai';
import { educationLevels, phaseClassMap, subjectsByLevel } from '../constants';
import { useAuth } from '../AuthContext';
import {
  Play,
  Loader2,
  Trophy,
  Users,
  Settings,
  Maximize2,
  Minimize2,
  Download,
  RotateCcw,
  Volume2,
  VolumeX,
  Wrench,
  AlertTriangle,
  Cpu,
} from 'lucide-react';
import AIAssistedInput from './AIAssistedInput';
import { useLocalStorage } from '../hooks/useLocalStorage';
import {
  buildIfpJsonPrompt,
  isSandboxGenre,
  renderIfpEngineHtml,
  wrapSandboxWithGuard,
  IfpGamePayload,
} from '../lib/ifpGameEngines';

const ai = new GoogleGenAI({});

const GAME_TYPES = [
  { id: 'rpg', name: 'Battle Arena RPG (Engine 60fps)', desc: 'Pertarungan monster/boss berbasis giliran & soal' },
  { id: 'action', name: 'Turbo Dash Racing (Engine 60fps)', desc: 'Balapan Canvas 60fps — jawaban cepat memberi boost' },
  { id: 'adventure', name: 'Quest Expedition (Engine 60fps)', desc: 'Eksplorasi peta misi bertahap untuk kelompok/kelas' },
  { id: 'puzzle', name: 'Smart Match Puzzle (Engine 60fps)', desc: 'Mencocokkan & menyusun pasangan konsep secara sentuh' },
  { id: 'simulation', name: 'Interactive Lab Simulasi (Engine 60fps)', desc: 'Simulasi keputusan skenario dengan indikator hidup' },
  { id: 'strategy', name: 'Strategi Duel (Engine 60fps)', desc: 'Adu taktik & ketepatan menjawab antarpemain' },
  { id: 'battleroyale', name: 'Survival Expedition (Engine 60fps)', desc: 'Bertahan hingga garis akhir dengan tantangan berjenjang' },
  { id: 'sports', name: 'Arena Sprint (Engine 60fps)', desc: 'Kompetisi balap antar pemain di papan IFP' },
  { id: 'sandbox', name: 'Sandbox / Kustom Bebas (AI Codegen + Guard)', desc: 'AI menulis HTML/JS kustom penuh + pelindung error otomatis' },
];

const DIFFICULTY_LEVELS = [
  { id: 'easy', name: 'Mudah', color: 'text-emerald-700' },
  { id: 'medium', name: 'Sedang', color: 'text-amber-700' },
  { id: 'hard', name: 'Sulit', color: 'text-rose-700' },
  { id: 'expert', name: 'Ahli', color: 'text-purple-700' },
];

export default function GameIFP() {
  const { profile } = useAuth();
  const [formData, setFormData] = useLocalStorage('GameIFPData', {
    topik: '',
    jenjang: 'sd',
    fase: 'A',
    kelas: '1',
    mapel: 'bahasa-indonesia',
    jenisGame: 'rpg',
    difficulty: 'medium',
    jumlahPemain: 2,
    pemain1: 'Tim Merah',
    pemain2: 'Tim Biru',
    pemain3: 'Tim Hijau',
    pemain4: 'Tim Kuning',
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isFixingError, setIsFixingError] = useState(false);
  const [selectedModel, setSelectedModel] = useLocalStorage<string>('GameIFP_selectedModel', 'openai');
  const [gameHtml, setGameHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sandboxRuntimeError, setSandboxRuntimeError] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const playerWrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (profile?.jenjang) {
      const normalized = profile.jenjang.toLowerCase();
      if (educationLevels.some(l => l.id === normalized)) {
        setFormData(prev => ({ ...prev, jenjang: normalized }));
      }
    }
  }, [profile]);

  useEffect(() => {
    const phases = phaseClassMap[formData.jenjang]?.phases || [];
    const validFase = phases.some(p => p.id === formData.fase) ? formData.fase : (phases[0]?.id || '');
    const classes = phaseClassMap[formData.jenjang]?.classes?.[validFase] || [];
    const validKelas = classes.some(c => c.id === formData.kelas) ? formData.kelas : (classes[0]?.id || '');
    const subjects = subjectsByLevel[formData.jenjang] || [];
    const validMapel = subjects.some(s => s.id === formData.mapel) ? formData.mapel : (subjects[0]?.id || '');
    if (validFase !== formData.fase || validKelas !== formData.kelas || validMapel !== formData.mapel) {
      setFormData(prev => ({ ...prev, fase: validFase, kelas: validKelas, mapel: validMapel }));
    }
  }, [formData.jenjang, formData.fase]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isGenerating || isFixingError) {
      const startTime = Date.now();
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 43);
    } else {
      setElapsedTime(0);
    }
    return () => clearInterval(interval);
  }, [isGenerating, isFixingError]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (isGenerating || isFixingError) {
      const isSandbox = isSandboxGenre(formData.jenisGame);
      const logs = isFixingError
        ? [
            '> Mendeteksi runtime error dari sandbox iframe...',
            '> Menganalisis baris penyebab kegagalan render...',
            '> Memperbaiki sintaks & DOM binding...',
            '> Mengompilasi ulang game...',
          ]
        : isSandbox
        ? [
            '> Menginisialisasi Sandbox AI Codegen + Runtime Guard...',
            '> Merancang mekanik game kustom sesuai topik...',
            '> Menyuntikkan IFP_SDK (Audio & Error Catcher)...',
            '> Memvalidasi sintaks HTML5 & JavaScript...',
          ]
        : [
            '> Menginisialisasi Hybrid IFP Game Engine (60fps)...',
            '> Membaca parameter jenjang, fase, dan topik...',
            '> Meminta AI menyusun skenario, soal, & aset JSON...',
            '> Mengikat data ke Engine Canvas/DOM teruji...',
            '> Mempersiapkan papan skor & mode layar sentuh IFP...',
          ];

      let index = 0;
      setTerminalLines([]);
      const addLog = () => {
        if (index < logs.length) {
          setTerminalLines(prev => [...prev, logs[index]]);
          index++;
          timeout = setTimeout(addLog, Math.random() * 180 + 90);
        }
      };
      timeout = setTimeout(addLog, 150);
    } else {
      setTerminalLines([]);
    }
    return () => clearTimeout(timeout);
  }, [isGenerating, isFixingError, formData.jenisGame]);

  useEffect(() => {
    const handleMessage = (ev: MessageEvent) => {
      if (ev.data && ev.data.type === 'IFP_GAME_ERROR') {
        setSandboxRuntimeError(ev.data.message || 'Terjadi error JavaScript di dalam game.');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const getActivePlayers = () =>
    [formData.pemain1, formData.pemain2, formData.pemain3, formData.pemain4]
      .slice(0, formData.jumlahPemain)
      .map((p, i) => (p || '').trim() || `Pemain ${i + 1}`);

  const cleanCodeFence = (raw: string) =>
    raw.replace(/```(?:html|json)?\n?/gi, '').replace(/```/g, '').trim();

  const generateGame = async () => {
    if (!formData.topik.trim()) {
      setError('Silakan isi topik pembelajaran terlebih dahulu.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setSandboxRuntimeError(null);
    setGameHtml(null);

    try {
      const players = getActivePlayers();
      const jenjangLabel = educationLevels.find(l => l.id === formData.jenjang)?.label || formData.jenjang.toUpperCase();
      const mapelLabel = subjectsByLevel[formData.jenjang]?.find(s => s.id === formData.mapel)?.label || formData.mapel;
      const topikLengkap = `${formData.topik} (Mapel: ${mapelLabel}, Kelas ${formData.kelas})`;

      if (isSandboxGenre(formData.jenisGame)) {
        const prompt = `Bertindaklah sebagai developer game edukasi HTML5 senior. Buatlah game edukatif interaktif 1 file HTML lengkap (HTML + CSS + JS inline) yang ringan, bebas error sintaks, dan ramah layar sentuh IFP.

Spesifikasi:
- Topik: ${topikLengkap}
- Target Audiens: ${jenjangLabel}
- Tingkat Kesulitan: ${DIFFICULTY_LEVELS.find(d => d.id === formData.difficulty)?.name}
- Pemain (${players.length} orang): ${players.join(', ')}

Persyaratan Wajib:
1. DILARANG menggunakan URL gambar/audio eksternal yang lambat. Gambar ilustrasi/ikon WAJIB dibuat memakai inline SVG atau HTML5 Canvas.
2. Anda dapat memanggil \`window.IFP_SDK?.correct()\` dan \`window.IFP_SDK?.wrong()\` untuk efek suara.
3. Wajib ada sistem Leaderboard/Papan Skor untuk seluruh pemain dan tombol Restart.
4. Pastikan seluruh tag HTML & JS tertutup rapi tanpa error referensi variabel.
5. Output HANYA kode HTML lengkap dimulai dari <!DOCTYPE html> hingga </html>.`;

        const response = await ai.models.generateContent({
          model: selectedModel,
          contents: prompt,
          config: { temperature: 0.6 },
        });

        const htmlContent = cleanCodeFence(response.text || '');
        if (!htmlContent.toLowerCase().includes('<html')) {
          throw new Error('Output HTML dari model tidak lengkap. Silakan coba generate ulang.');
        }
        setGameHtml(wrapSandboxWithGuard(htmlContent));
      } else {
        const cfg = {
          genre: formData.jenisGame,
          topik: topikLengkap,
          jenjang: jenjangLabel,
          difficulty: formData.difficulty,
          players,
        };
        const prompt = buildIfpJsonPrompt(cfg);

        const response = await ai.models.generateContent({
          model: selectedModel,
          contents: prompt,
          config: {
            temperature: 0.6,
            responseMimeType: 'application/json',
          },
        });

        const rawJson = cleanCodeFence(response.text || '');
        const parsed: IfpGamePayload = JSON.parse(rawJson);
        if (!parsed || (!Array.isArray(parsed.soal) && !Array.isArray(parsed.simulasi) && !Array.isArray(parsed.puzzlePairs))) {
          throw new Error('Struktur konten game JSON tidak lengkap.');
        }
        const compiledHtml = renderIfpEngineHtml(parsed, cfg);
        setGameHtml(compiledHtml);
      }
    } catch (err: any) {
      console.error(err);
      setError('Terjadi kesalahan saat merakit game: ' + (err.message || 'Gagal memproses respons model.'));
    } finally {
      setIsGenerating(false);
    }
  };

  const fixSandboxError = async () => {
    if (!gameHtml || !sandboxRuntimeError) return;
    setIsFixingError(true);
    setError(null);
    try {
      const prompt = `Perbaiki bug JavaScript pada kode game HTML5 berikut.
Error yang dilaporkan browser: "${sandboxRuntimeError}"

Kembalikan HANYA kode HTML lengkap yang sudah diperbaiki dari <!DOCTYPE html> hingga </html> tanpa markdown:
${gameHtml}`;
      const response = await ai.models.generateContent({
        model: selectedModel,
        contents: prompt,
        config: { temperature: 0.2 },
      });
      const fixedHtml = cleanCodeFence(response.text || '');
      if (fixedHtml.toLowerCase().includes('<html')) {
        setSandboxRuntimeError(null);
        setGameHtml(wrapSandboxWithGuard(fixedHtml));
      } else {
        throw new Error('Perbaikan kode tidak menghasilkan HTML yang valid.');
      }
    } catch (err: any) {
      setError('Gagal memperbaiki bug otomatis: ' + err.message);
    } finally {
      setIsFixingError(false);
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    iframeRef.current?.contentWindow?.postMessage({ type: 'SET_MUTE', muted: nextMuted }, '*');
  };

  const restartGame = () => {
    setSandboxRuntimeError(null);
    if (!isSandboxGenre(formData.jenisGame)) {
      iframeRef.current?.contentWindow?.postMessage({ type: 'RESTART_GAME' }, '*');
    } else if (gameHtml) {
      const copy = gameHtml;
      setGameHtml(null);
      setTimeout(() => setGameHtml(copy), 30);
    }
  };

  const toggleFullscreen = async () => {
    if (!playerWrapperRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await playerWrapperRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.warn('Fullscreen tidak didukung browser ini:', err);
    }
  };

  const downloadOfflineHtml = () => {
    if (!gameHtml) return;
    const blob = new Blob([gameHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeName = (formData.topik || 'game-ifp').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    a.href = url;
    a.download = `IFP-${safeName}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-indigo-100">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/25 mb-4">
            <Cpu size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Game IFP Hybrid Engine</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm">
            Buat game edukatif layar sentuh 60fps untuk Interactive Flat Panel (IFP) kelas dengan engine lokal bebas error & dukungan unduh offline.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-1 space-y-5">
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl">
              <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Settings size={18} className="text-indigo-600" /> Pengaturan Game & Kurikulum
              </h3>

              <div className="space-y-3.5">
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Jenjang</label>
                    <select
                      value={formData.jenjang}
                      onChange={e => setFormData({ ...formData, jenjang: e.target.value })}
                      className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-gray-900 text-xs font-medium focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    >
                      {educationLevels.map(j => (
                        <option key={j.id} value={j.id}>{j.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Kelas</label>
                    <select
                      value={formData.kelas}
                      onChange={e => setFormData({ ...formData, kelas: e.target.value })}
                      className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-gray-900 text-xs font-medium focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    >
                      {(phaseClassMap[formData.jenjang]?.classes?.[formData.fase] || []).map(c => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Mata Pelajaran</label>
                  <select
                    value={formData.mapel}
                    onChange={e => setFormData({ ...formData, mapel: e.target.value })}
                    className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-gray-900 text-xs font-medium focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  >
                    {(subjectsByLevel[formData.jenjang] || []).map(s => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Topik Pembelajaran</label>
                  <AIAssistedInput
                    type="text"
                    placeholder="Contoh: Tata Surya, Pecahan Senilai, Ekosistem..."
                    value={formData.topik}
                    onChange={e => setFormData({ ...formData, topik: e.target.value })}
                    className="w-full bg-white border border-gray-300 rounded-xl p-3 text-gray-900 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Engine / Genre Game</label>
                  <select
                    value={formData.jenisGame}
                    onChange={e => setFormData({ ...formData, jenisGame: e.target.value })}
                    className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-gray-900 text-sm font-medium focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  >
                    {GAME_TYPES.map(g => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                  <p className="text-[11px] text-indigo-700 mt-1 font-medium">
                    {GAME_TYPES.find(g => g.id === formData.jenisGame)?.desc}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Tingkat Kesulitan</label>
                  <div className="grid grid-cols-2 gap-2">
                    {DIFFICULTY_LEVELS.map(level => (
                      <button
                        key={level.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, difficulty: level.id })}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                          formData.difficulty === level.id
                            ? 'bg-indigo-50 border-indigo-600 shadow-sm ring-1 ring-indigo-600'
                            : 'bg-white border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        <span className={level.color}>{level.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl">
              <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Users size={18} className="text-indigo-600" /> Pengaturan Pemain / Kelompok
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Jumlah Pemain (Maks 4)</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4].map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setFormData({ ...formData, jumlahPemain: num })}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all border ${
                          formData.jumlahPemain === num
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-indigo-50'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Nama Pemain / Tim</label>
                  {Array.from({ length: formData.jumlahPemain }).map((_, i) => (
                    <AIAssistedInput
                      key={i}
                      type="text"
                      placeholder={`Nama Pemain ${i + 1}`}
                      value={(formData as any)[`pemain${i + 1}`]}
                      onChange={e => setFormData({ ...formData, [`pemain${i + 1}`]: e.target.value })}
                      className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-gray-900 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  ))}
                </div>
              </div>
            </div>

            <ModelSelector label="Model AI Konten" modality="text" value={selectedModel} onChange={setSelectedModel} disabled={isGenerating || isFixingError} />

            <button
              type="button"
              onClick={generateGame}
              disabled={isGenerating || isFixingError}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold text-base shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Merakit Game IFP...
                </>
              ) : (
                <>
                  <Play size={20} />
                  Generate Game IFP
                </>
              )}
            </button>

            {error && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium">
                {error}
              </div>
            )}
          </div>

          {/* Preview & IFP Player Section */}
          <div className="lg:col-span-2">
            <div
              ref={playerWrapperRef}
              className="bg-slate-900 rounded-2xl border border-slate-700 h-full min-h-[620px] flex flex-col overflow-hidden relative shadow-xl"
            >
              {/* IFP Player Toolbar */}
              <div className="bg-slate-800 px-4 py-2.5 border-b border-slate-700 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5 mr-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  </div>
                  <div className="bg-slate-900 px-3 py-1 rounded-md text-xs text-slate-200 font-semibold flex items-center gap-1.5 border border-slate-700">
                    <Trophy size={13} className="text-amber-400" />
                    IFP EduGame Player {isSandboxGenre(formData.jenisGame) ? '(Sandbox)' : '(60fps Engine)'}
                  </div>
                </div>

                {gameHtml && !isGenerating && (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={toggleMute}
                      title={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium flex items-center gap-1 transition-colors"
                    >
                      {isMuted ? <VolumeX size={14} className="text-red-400" /> : <Volume2 size={14} className="text-emerald-400" />}
                      <span className="hidden sm:inline">{isMuted ? 'Mute' : 'Suara'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={restartGame}
                      title="Ulangi Permainan"
                      className="px-2.5 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium flex items-center gap-1 transition-colors"
                    >
                      <RotateCcw size={14} />
                      <span className="hidden sm:inline">Restart</span>
                    </button>
                    <button
                      type="button"
                      onClick={downloadOfflineHtml}
                      title="Unduh File HTML Offline untuk IFP Sekolah"
                      className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Download size={14} />
                      <span className="hidden sm:inline">Unduh Offline</span>
                    </button>
                    <button
                      type="button"
                      onClick={toggleFullscreen}
                      title="Mode Layar Penuh IFP"
                      className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-900 text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                      <span className="hidden sm:inline">{isFullscreen ? 'Keluar' : 'Layar Penuh'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Sandbox Runtime Error Guard Banner */}
              {sandboxRuntimeError && !isFixingError && (
                <div className="bg-rose-950 border-b border-rose-700 px-4 py-2.5 flex items-center justify-between gap-3 text-rose-100 text-xs">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={16} className="text-amber-400 shrink-0" />
                    <span>Error di Sandbox Game: <strong className="font-mono">{sandboxRuntimeError}</strong></span>
                  </div>
                  <button
                    type="button"
                    onClick={fixSandboxError}
                    className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold rounded-lg flex items-center gap-1.5 shrink-0"
                  >
                    <Wrench size={13} /> Perbaiki Bug Otomatis
                  </button>
                </div>
              )}

              {/* Game Container */}
              <div className="flex-1 relative bg-slate-950 flex items-center justify-center">
                {isGenerating || isFixingError ? (
                  <div className="w-full h-full bg-[#0a0a0a] text-green-400 font-mono p-6 flex flex-col justify-start text-left absolute inset-0 z-10">
                    <div className="flex justify-between items-center border-b border-green-900/50 pb-2 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-bold text-green-500">IFP HYBRID ENGINE TERMINAL</span>
                      </div>
                      <div className="text-xs text-green-400 bg-green-950/50 px-2 py-1 rounded border border-green-900/50 tabular-nums">
                        {elapsedTime} ms
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto flex flex-col">
                      <p className="text-green-300 font-bold mb-4">
                        {'>'} {isFixingError ? 'Memperbaiki skrip Sandbox...' : 'Menyiapkan Engine Game IFP...'}
                      </p>
                      <div className="space-y-1.5 text-xs sm:text-sm text-green-500/90">
                        {terminalLines.map((line, i) => (
                          <p key={i}>{line}</p>
                        ))}
                        <p className="animate-pulse">_</p>
                      </div>
                    </div>
                  </div>
                ) : gameHtml ? (
                  <iframe
                    ref={iframeRef}
                    srcDoc={gameHtml}
                    className="w-full h-full min-h-[560px] border-0 bg-slate-900"
                    title="Generated IFP Game"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"
                  />
                ) : (
                  <div className="text-center p-8">
                    <div className="w-20 h-20 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Play size={36} className="text-indigo-400 ml-1" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">Layar Game IFP Siap</h4>
                    <p className="text-slate-400 max-w-md mx-auto text-sm">
                      Pilih genre engine 60fps di sebelah kiri, isi topik & pemain, lalu klik "Generate Game IFP" untuk langsung bermain atau unduh offline.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

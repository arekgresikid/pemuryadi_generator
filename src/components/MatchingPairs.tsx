import React, { useState, useEffect } from 'react';
import ModelSelector from './ModelSelector';
import { GoogleGenAI, Type } from '../lib/genai';
import { educationLevels, phaseClassMap, subjectsByLevel } from '../constants';
import { useAuth } from '../AuthContext';
import AIAssistedInput from './AIAssistedInput';
import AIAssistedTextarea from './AIAssistedTextarea';
import { Bot, Loader2, Sparkles, Network } from 'lucide-react';
import './ZeroGStyles.css';

type PairItem = {
  id: number;
  val: string;
  refId: number;
  isMatched: boolean;
  isLeft: boolean;
};

export default function MatchingPairs() {
  const { profile } = useAuth();
  const [eduLevel, setEduLevel] = useState('sd');
  const [selectedModel, setSelectedModel] = useState<string>('openai');
  const [fase, setFase] = useState('A');
  const [kelas, setKelas] = useState('1');
  const [subject, setSubject] = useState('bahasa-indonesia');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const [title, setTitle] = useState('');
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState('');

  // Game state
  const [leftItems, setLeftItems] = useState<PairItem[]>([]);
  const [rightItems, setRightItems] = useState<PairItem[]>([]);
  const [activeLeft, setActiveLeft] = useState<number | null>(null);
  const [matchedCount, setMatchedCount] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameMessage, setGameMessage] = useState('');
  const [errorHighlight, setErrorHighlight] = useState<number | null>(null);

  useEffect(() => {
    const phases = phaseClassMap[eduLevel]?.phases || [];
    const firstPhase = phases[0]?.id || '';
    setFase(firstPhase);
    
    const subjects = subjectsByLevel[eduLevel] || [];
    setSubject(subjects[0]?.id || '');
  }, [eduLevel]);

  useEffect(() => {
    const classes = phaseClassMap[eduLevel]?.classes[fase] || [];
    setKelas(classes[0]?.id || '');
  }, [fase, eduLevel]);

  const generateWordsWithAI = async () => {
    setIsGeneratingAI(true);
    setError('');
    
    try {
      const ai = new GoogleGenAI({});
      
      const jenjangLabel = educationLevels.find(l => l.id === eduLevel)?.label || eduLevel;
      const faseLabel = phaseClassMap[eduLevel]?.phases.find(p => p.id === fase)?.label || fase;
      const kelasLabel = phaseClassMap[eduLevel]?.classes[fase]?.find(c => c.id === kelas)?.label || kelas;
      const subjectLabel = subjectsByLevel[eduLevel]?.find(s => s.id === subject)?.label || subject;

      const prompt = `Buatkan 5 pasangan kata terkait materi pelajaran untuk permainan mencocokkan (Matching Pairs).
Jenjang: ${jenjangLabel}
Fase: ${faseLabel}
Kelas: ${kelasLabel}
Mata Pelajaran: ${subjectLabel}

PENTING:
1. Kata di sisi kiri harus berbeda dengan kata di sisi kanan, tapi memiliki hubungan yang benar.
2. Berikan output HANYA dalam format JSON array of objects dengan struktur:
[
  { "word": "KATA_KIRI", "clue": "KATA_KANAN" },
  ...
]`;

      const response = await ai.models.generateContent({
        model: selectedModel,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                word: { type: Type.STRING, description: "Kata di sisi kiri" },
                clue: { type: Type.STRING, description: "Pasangan kata di sisi kanan" }
              },
              required: ["word", "clue"]
            }
          }
        }
      });

      const text = response.text;
      if (text) {
        const data = JSON.parse(text);
        if (Array.isArray(data)) {
          const formattedText = data.map((item: any) => `${item.word} - ${item.clue}`).join('\n');
          setInputText(formattedText);
          setTitle(`Matching Pairs: ${subjectLabel} Kelas ${kelasLabel}`);
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Terjadi kesalahan saat membuat kata dengan AI');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const startGame = () => {
    setError('');
    const lines = inputText.split('\\n').filter(line => line.trim() !== '');
    const pairsData = [];

    for (let i = 0; i < lines.length; i++) {
      const parts = lines[i].split('-');
      if (parts.length >= 2) {
        const word = parts[0].trim();
        const clue = parts.slice(1).join('-').trim();
        if (word && clue) {
          pairsData.push({ id: i + 1, word, clue });
        }
      }
    }

    if (pairsData.length < 2) {
      setError('Masukkan minimal 2 pasang kata dengan format KATA - PASANGANNYA');
      return;
    }

    // Limit to 6 pairs for optimal view
    const gamePairs = pairsData.slice(0, 6);

    const left = gamePairs.map(p => ({
      id: p.id,
      val: p.word,
      refId: p.id,
      isMatched: false,
      isLeft: true
    }));

    const right = gamePairs.map(p => ({
      id: p.id + 100, // ensure unique ID
      val: p.clue,
      refId: p.id, // points to left ID
      isMatched: false,
      isLeft: false
    }));
    
    // Shuffle right items
    right.sort(() => Math.random() - 0.5);

    setLeftItems(left);
    setRightItems(right);
    setActiveLeft(null);
    setMatchedCount(0);
    setGameMessage('');
    setIsGameActive(true);
  };

  const handleLeftClick = (id: number) => {
    if (leftItems.find(item => item.id === id)?.isMatched) return;
    setActiveLeft(id);
  };

  const handleRightClick = (rightId: number, refId: number) => {
    if (!activeLeft) return;
    if (rightItems.find(item => item.id === rightId)?.isMatched) return;

    if (refId === activeLeft) {
      // Matched!
      setLeftItems(prev => prev.map(item => item.id === activeLeft ? { ...item, isMatched: true } : item));
      setRightItems(prev => prev.map(item => item.id === rightId ? { ...item, isMatched: true } : item));
      
      setActiveLeft(null);
      setMatchedCount(prev => {
        const newCount = prev + 1;
        if (newCount === leftItems.length) {
          setGameMessage("✓ MATCHING COMPLETE: SYSTEM ALIGNED!");
        }
        return newCount;
      });
    } else {
      // Wrong
      setErrorHighlight(rightId);
      setTimeout(() => setErrorHighlight(null), 500);
    }
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
          <Network size={28} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Matching Pairs</h3>
          <p className="text-gray-600">Buat game mencocokkan kata dan pasangannya</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 shadow-sm">
            <h4 className="font-semibold text-green-400 mb-4 flex items-center gap-2"><Bot size={20} className="text-green-500" /> Generate Kata dengan AI</h4>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Similar selects as Crossword */}
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Jenjang</label>
                <select value={eduLevel} onChange={(e) => setEduLevel(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 outline-none">
                  {educationLevels.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
                </select>
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Fase</label>
                <select value={fase} onChange={(e) => setFase(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 outline-none">
                  {phaseClassMap[eduLevel]?.phases.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                </select>
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Kelas</label>
                <select value={kelas} onChange={(e) => setKelas(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 outline-none">
                  {phaseClassMap[eduLevel]?.classes[fase]?.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Mata Pelajaran</label>
                <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 outline-none">
                  {subjectsByLevel[eduLevel]?.map(sub => <option key={sub.id} value={sub.id}>{sub.label}</option>)}
                </select>
              </div>
            </div>
            <div className="mb-4">
              <ModelSelector modality="text" value={selectedModel} onChange={setSelectedModel} disabled={isGeneratingAI} />
            </div>
            <button onClick={generateWordsWithAI} disabled={isGeneratingAI} className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all flex items-center justify-center gap-2">
              {isGeneratingAI ? <><Loader2 size={16} className="animate-spin" /> Membuat...</> : <><Sparkles size={16} /> Buat Otomatis</>}
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Judul / Topik</label>
            <AIAssistedInput type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Contoh: Mengenal Hewan" className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Daftar Pasangan</label>
            <p className="text-xs text-gray-600 mb-2">Format: <strong>KATA - PASANGANNYA</strong> (satu per baris)</p>
            <AIAssistedTextarea value={inputText} onChange={(e) => setInputText(e.target.value)} rows={8} placeholder="Kucing - Meong&#10;Sapi - Moo" className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 font-mono text-sm outline-none custom-scrollbar" />
          </div>

          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}

          <button onClick={startGame} className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-sm">
            Generate Game
          </button>
        </div>

        <div className="bg-gray-50 border border-gray-200 shadow-sm rounded-xl p-4 min-h-[400px] flex items-center justify-center overflow-auto custom-scrollbar">
          {isGameActive ? (
            <div className="zerog-wrapper w-full h-full">
              <div className="zerog-container" style={{ borderColor: 'var(--neon-green)', borderStyle: 'solid', borderWidth: '2px', boxShadow: '0 0 30px rgba(57, 255, 20, 0.2)' }}>
                {Array.from({ length: 15 }).map((_, i) => (
                  <div key={i} className="space-dust" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 10}s`, transform: `scale(${Math.random() * 1.5})` }} />
                ))}
                
                <header>
                  <h1 style={{ background: 'linear-gradient(to right, #fff, var(--neon-green))', WebkitBackgroundClip: 'text' }}>
                    {title || "Matching Pairs"}
                  </h1>
                  <p style={{ color: 'var(--neon-green)', fontSize: '0.8rem', marginTop: '10px' }}>Pilih kata di kiri, lalu pasangannya di kanan</p>
                </header>

                <div className="game-viewport w-full">
                  <div className="pairs-container">
                    <div className="pairs-column">
                      {leftItems.map(item => (
                        <div 
                          key={item.id}
                          className={`pair-item ${activeLeft === item.id ? 'selected' : ''} ${item.isMatched ? 'matched' : ''}`}
                          onClick={() => handleLeftClick(item.id)}
                        >
                          {item.val}
                        </div>
                      ))}
                    </div>
                    <div className="pairs-column">
                      {rightItems.map(item => (
                        <div 
                          key={item.id}
                          className={`pair-item ${item.isMatched ? 'matched' : ''}`}
                          style={errorHighlight === item.id ? { borderColor: '#ff0055', boxShadow: '0 0 10px rgba(255,0,85,0.4)' } : {}}
                          onClick={() => handleRightClick(item.id, item.refId)}
                        >
                          {item.val}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="toast-feedback" style={{ color: 'var(--neon-green)' }}>
                  {gameMessage}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <div className="mb-4 opacity-50 flex justify-center text-gray-400">
                <Network size={64} />
              </div>
              <p>Preview Game akan muncul di sini</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import ModelSelector from './ModelSelector';
import { GoogleGenAI, Type } from '../lib/genai';
import { educationLevels, phaseClassMap, subjectsByLevel } from '../constants';
import { useAuth } from '../AuthContext';
import AIAssistedInput from './AIAssistedInput';
import AIAssistedTextarea from './AIAssistedTextarea';
import { Bot, Loader2, Sparkles, Wand2 } from 'lucide-react';
import './ZeroGStyles.css';

type UnscrambleItem = {
  id: number;
  word: string;
  clue: string;
  scrambled: string[];
};

export default function UnscrambleLetters() {
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
  const [words, setWords] = useState<UnscrambleItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSelection, setCurrentSelection] = useState<{char: string, origIndex: number}[]>([]);
  const [availableLetters, setAvailableLetters] = useState<{char: string, index: number, hidden: boolean}[]>([]);
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameMessage, setGameMessage] = useState('');

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

      const prompt = `Buatkan 5 kata untuk diacak (Unscramble Letters).
Jenjang: ${jenjangLabel}
Fase: ${faseLabel}
Kelas: ${kelasLabel}
Mata Pelajaran: ${subjectLabel}
Topik/Judul: ${title || 'Umum'}

PENTING:
1. Kata di sisi kiri harus satu kata tanpa spasi.
2. Petunjuk di sisi kanan adalah petunjuk untuk menebak kata tersebut.
3. Berikan output HANYA dalam format JSON array of objects dengan struktur:
[
  { "word": "KATA", "clue": "Petunjuk tebakan kata" },
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
                word: { type: Type.STRING, description: "Satu kata (tanpa spasi)" },
                clue: { type: Type.STRING, description: "Petunjuk untuk menebak kata" }
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
          const formattedText = data.map((item: any) => `${item.word.toUpperCase().replace(/[^A-Z]/g, '')} - ${item.clue}`).join('\n');
          setInputText(formattedText);
          setTitle(`Unscramble: ${subjectLabel} Kelas ${kelasLabel}`);
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
    const lines = inputText.split('\n').filter(line => line.trim() !== '');
    const parsedWords = [];

    for (let i = 0; i < lines.length; i++) {
      const parts = lines[i].split('-');
      if (parts.length >= 2) {
        const word = parts[0].trim().toUpperCase().replace(/[^A-Z]/g, '');
        const clue = parts.slice(1).join('-').trim();
        
        if (word && clue) {
          const charArray = word.split('');
          const scrambled = [...charArray].sort(() => Math.random() - 0.5);
          parsedWords.push({
            id: i,
            word,
            clue,
            scrambled
          });
        }
      }
    }

    if (parsedWords.length < 1) {
      setError('Masukkan minimal 1 kata! Format KATA - Petunjuk.');
      return;
    }

    setWords(parsedWords);
    setCurrentIndex(0);
    initLevel(parsedWords[0]);
    setIsGameActive(true);
    setGameMessage('');
  };

  const initLevel = (levelData: UnscrambleItem) => {
    setCurrentSelection([]);
    setAvailableLetters(levelData.scrambled.map((char, index) => ({ char, index, hidden: false })));
  };

  const handleLetterClick = (index: number, char: string) => {
    const currentWord = words[currentIndex].word;
    
    // Hide letter from pool
    setAvailableLetters(prev => prev.map(item => item.index === index ? { ...item, hidden: true } : item));
    
    const newSelection = [...currentSelection, { char, origIndex: index }];
    setCurrentSelection(newSelection);

    if (newSelection.length === currentWord.length) {
      const formedWord = newSelection.map(s => s.char).join('');
      if (formedWord === currentWord) {
        setGameMessage("✓ SEQUENCE CORRECT!");
        setTimeout(() => {
          if (currentIndex < words.length - 1) {
            setCurrentIndex(currentIndex + 1);
            initLevel(words[currentIndex + 1]);
            setGameMessage('');
          } else {
            setGameMessage("✓ ALL SEQUENCES DECRYPTED!");
          }
        }, 1200);
      } else {
        setGameMessage("✕ SEQUENCE FAULT: RETRY.");
        setTimeout(() => {
          initLevel(words[currentIndex]);
          setGameMessage('');
        }, 1200);
      }
    }
  };

  const resetCurrentLevel = () => {
    if (words[currentIndex]) {
      initLevel(words[currentIndex]);
      setGameMessage('');
    }
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
          <Wand2 size={28} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Unscramble Letters</h3>
          <p className="text-gray-600">Buat game susun kata berantakan</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 shadow-sm">
            <h4 className="font-semibold text-green-400 mb-4 flex items-center gap-2"><Bot size={20} className="text-green-500" /> Generate Kata dengan AI</h4>
            <div className="grid grid-cols-2 gap-4 mb-4">
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
            <AIAssistedInput type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Contoh: Astronomi" className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Daftar Kata</label>
            <p className="text-xs text-gray-600 mb-2">Format: <strong>KATA - Petunjuk</strong> (satu per baris)</p>
            <AIAssistedTextarea value={inputText} onChange={(e) => setInputText(e.target.value)} contextPrompt={`Buatkan daftar kata Unscramble Letters (Topik: ${title || 'Pendidikan'}). Format: KATA - Petunjuk. Contoh: BUKU - Kumpulan kertas berisi tulisan.`} rows={8} placeholder="GRAVITASI - Gaya tarik bumi&#10;BULAN - Satelit bumi" className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 font-mono text-sm outline-none custom-scrollbar" />
          </div>

          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}

          <button onClick={startGame} className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-sm">
            Generate Game
          </button>
        </div>

        <div className="bg-gray-50 border border-gray-200 shadow-sm rounded-xl p-4 min-h-[400px] flex items-center justify-center overflow-auto custom-scrollbar">
          {isGameActive && words.length > 0 ? (
            <div className="zerog-wrapper w-full h-full">
              <div className="zerog-container" style={{ borderColor: 'var(--neon-purple)', borderStyle: 'solid', borderWidth: '2px', boxShadow: '0 0 30px rgba(189, 0, 255, 0.2)' }}>
                {Array.from({ length: 15 }).map((_, i) => (
                  <div key={i} className="space-dust" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 10}s`, transform: `scale(${Math.random() * 1.5})` }} />
                ))}
                
                <header>
                  <h1 style={{ background: 'linear-gradient(to right, #fff, var(--neon-purple))', WebkitBackgroundClip: 'text' }}>
                    {title || "Unscramble Letters"}
                  </h1>
                  <p style={{ color: 'var(--neon-purple)', fontSize: '0.8rem', marginTop: '10px' }}>
                    Kata {currentIndex + 1} / {words.length}
                  </p>
                </header>

                <div className="game-viewport">
                  {currentIndex < words.length ? (
                    <div className="flex flex-col items-center w-full">
                      <p className="text-center mb-6 max-w-sm" style={{ color: 'var(--text-light)', opacity: 0.8 }}>
                        Clue: {words[currentIndex].clue}
                      </p>
                      
                      <div className="unscramble-slots">
                        {Array.from({ length: words[currentIndex].word.length }).map((_, i) => (
                          <span key={i} style={{ minWidth: '30px', textAlign: 'center', display: 'inline-block' }}>
                            {currentSelection[i] ? currentSelection[i].char : '_'}
                          </span>
                        ))}
                      </div>

                      <div className="scrambled-pool">
                        {availableLetters.map(item => (
                          <div 
                            key={item.index} 
                            className="letter-node"
                            style={{ visibility: item.hidden ? 'hidden' : 'visible' }}
                            onClick={() => !item.hidden && handleLetterClick(item.index, item.char)}
                          >
                            {item.char}
                          </div>
                        ))}
                      </div>

                      <button 
                        className="submit-action-btn mt-6" 
                        style={{ background: 'var(--neon-purple)', color: 'white' }} 
                        onClick={resetCurrentLevel}
                      >
                        Reset Field
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div style={{ color: 'var(--neon-purple)', fontSize: '1.5rem', fontWeight: 'bold' }}>All sequences completed!</div>
                    </div>
                  )}
                </div>

                <div className="toast-feedback" style={{ color: gameMessage.includes('FAULT') ? '#ff0055' : 'var(--neon-purple)' }}>
                  {gameMessage}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <div className="mb-4 opacity-50 flex justify-center text-gray-400">
                <Wand2 size={64} />
              </div>
              <p>Preview Game akan muncul di sini</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

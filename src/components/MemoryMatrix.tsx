import React, { useState, useEffect } from 'react';
import ModelSelector from './ModelSelector';
import { GoogleGenAI, Type } from '../lib/genai';
import { educationLevels, phaseClassMap, subjectsByLevel } from '../constants';
import { useAuth } from '../AuthContext';
import AIAssistedInput from './AIAssistedInput';
import AIAssistedTextarea from './AIAssistedTextarea';
import { Bot, Loader2, Sparkles, Gamepad2 } from 'lucide-react';
import './ZeroGStyles.css';

type Card = {
  id: number;
  word: string;
  isFlipped: boolean;
  isMatched: boolean;
};

export default function MemoryMatrix() {
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
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [matchedCount, setMatchedCount] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameMessage, setGameMessage] = useState('');
  const [currentLevel, setCurrentLevel] = useState(0);
  const [allWords, setAllWords] = useState<string[]>([]);

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

      const prompt = `Buatkan 6 pasangan kata yang sama (atau 6 kata kunci) terkait materi pelajaran untuk permainan mencocokkan memori (Memory Matrix).
Jenjang: ${jenjangLabel}
Fase: ${faseLabel}
Kelas: ${kelasLabel}
Mata Pelajaran: ${subjectLabel}
Topik/Judul: ${title || 'Umum'}

PENTING:
1. Kata harus ringkas dan jelas (maksimal 2 kata per item).
2. Petunjuk (clue) menjelaskan kata tersebut secara singkat.
3. Berikan output HANYA dalam format JSON array of objects dengan struktur:
[
  { "word": "KATA", "clue": "Petunjuk singkat" },
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
                word: { type: Type.STRING, description: "Kata kunci ringkas" },
                clue: { type: Type.STRING, description: "Petunjuk singkat" }
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
          setTitle(`Memory Matrix: ${subjectLabel} Kelas ${kelasLabel}`);
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
    const words = [];

    for (const line of lines) {
      const parts = line.split('-');
      if (parts.length >= 1) {
        const word = parts[0].trim().toUpperCase();
        if (word) {
          words.push(word);
        }
      }
    }

    if (words.length < 2) {
      setError('Masukkan minimal 2 kata!');
      return;
    }

    setAllWords(words);
    setCurrentLevel(0);
    loadLevel(words, 0);
    setIsGameActive(true);
  };

  const loadLevel = (wordList: string[], levelIndex: number) => {
    const startIndex = levelIndex * 8;
    const gameWords = wordList.slice(startIndex, startIndex + 8);
    const pairedWords = [...gameWords, ...gameWords];
    
    // Shuffle
    pairedWords.sort(() => Math.random() - 0.5);

    const initialCards = pairedWords.map((word, index) => ({
      id: index,
      word,
      isFlipped: false,
      isMatched: false
    }));

    setCards(initialCards);
    setSelectedCards([]);
    setMatchedCount(0);
    setGameMessage('');
  };

  const handleCardClick = (id: number) => {
    if (selectedCards.length >= 2) return;
    const clickedCard = cards.find(c => c.id === id);
    if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched) return;

    const newCards = cards.map(c => c.id === id ? { ...c, isFlipped: true } : c);
    setCards(newCards);
    const newSelected = [...selectedCards, id];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      const [firstId, secondId] = newSelected;
      const firstCard = newCards.find(c => c.id === firstId);
      const secondCard = newCards.find(c => c.id === secondId);

      if (firstCard?.word === secondCard?.word) {
        // Match
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            (c.id === firstId || c.id === secondId) ? { ...c, isMatched: true } : c
          ));
          setSelectedCards([]);
          setMatchedCount(prev => {
            const newCount = prev + 2;
            if (newCount === cards.length) {
              const nextLevel = currentLevel + 1;
              if (nextLevel * 8 < allWords.length) {
                setGameMessage("✓ LEVEL COMPLETE! LOADING NEXT...");
                setTimeout(() => {
                  setCurrentLevel(nextLevel);
                  loadLevel(allWords, nextLevel);
                }, 1500);
              } else {
                setGameMessage("✓ SYSTEM COMPATIBLE: EXCELLENT!");
              }
            }
            return newCount;
          });
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            (c.id === firstId || c.id === secondId) ? { ...c, isFlipped: false } : c
          ));
          setSelectedCards([]);
        }, 800);
      }
    }
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
          <Gamepad2 size={28} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Memory Matrix</h3>
          <p className="text-gray-600">Buat game melatih memori untuk siswa</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 shadow-sm">
            <h4 className="font-semibold text-green-400 mb-4 flex items-center gap-2"><Bot size={20} className="text-green-500" /> Generate Kata dengan AI</h4>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Jenjang</label>
                <select 
                  value={eduLevel}
                  onChange={(e) => setEduLevel(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                >
                  {educationLevels.map(level => (
                    <option key={level.id} value={level.id}>{level.label}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Fase</label>
                <select 
                  value={fase}
                  onChange={(e) => setFase(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                >
                  {phaseClassMap[eduLevel]?.phases.map(p => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Kelas</label>
                <select 
                  value={kelas}
                  onChange={(e) => setKelas(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                >
                  {phaseClassMap[eduLevel]?.classes[fase]?.map(c => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Mata Pelajaran</label>
                <select 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                >
                  {subjectsByLevel[eduLevel]?.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-4">
              <ModelSelector modality="text" value={selectedModel} onChange={setSelectedModel} disabled={isGeneratingAI} />
            </div>
            <button 
              onClick={generateWordsWithAI} 
              disabled={isGeneratingAI}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGeneratingAI ? (
                <><Loader2 size={16} className="animate-spin" /> Membuat Kata...</>
              ) : (
                <><Sparkles size={16} /> Buat Kata Otomatis</>
              )}
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Judul / Topik</label>
            <AIAssistedInput type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Benda Langit"
              className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Daftar Kata (Kata bagian kiri saja yang dipakai)</label>
            <p className="text-xs text-gray-600 mb-2">Format: <strong>KATA - Petunjuk</strong> (satu per baris)</p>
            <AIAssistedTextarea value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              contextPrompt={`Buatkan daftar kata untuk Memory Matrix (Topik: ${title || 'Pendidikan'}). Format: KATA - Petunjuk. Kata kiri harus ringkas.`}
              rows={8}
              placeholder="PLANET - Benda angkasa&#10;BINTANG - Benda bercahaya"
              className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-gray-900 font-mono text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors custom-scrollbar" />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button 
              onClick={startGame}
              className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-sm "
            >
              Generate Game
            </button>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 shadow-sm rounded-xl p-4 min-h-[400px] flex items-center justify-center overflow-auto custom-scrollbar">
          {isGameActive ? (
            <div className="zerog-wrapper w-full h-full">
              <div className="zerog-container" style={{ borderColor: 'var(--neon-cyan)', borderStyle: 'solid', borderWidth: '2px', boxShadow: '0 0 30px rgba(0, 240, 255, 0.2)' }}>
                {/* Space Dust */}
                {Array.from({ length: 15 }).map((_, i) => (
                  <div key={i} className="space-dust" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 10}s`, transform: `scale(${Math.random() * 1.5})` }} />
                ))}
                
                <header>
                  <h1 style={{ background: 'linear-gradient(to right, #fff, var(--neon-cyan))', WebkitBackgroundClip: 'text' }}>
                    {title || "Memory Matrix"}
                  </h1>
                  {allWords.length > 8 && (
                    <p style={{ color: 'var(--neon-cyan)', fontSize: '0.8rem', marginTop: '10px' }}>
                      Level {currentLevel + 1} / {Math.ceil(allWords.length / 8)}
                    </p>
                  )}
                </header>

                <div className="game-viewport">
                  <div className="grid-memory">
                    {cards.map(card => (
                      <div 
                        key={card.id}
                        className={`mem-card ${card.isFlipped ? 'flipped' : ''}`}
                        style={{ opacity: card.isMatched ? 0.3 : 1 }}
                        onClick={() => handleCardClick(card.id)}
                      >
                        {card.isFlipped ? card.word : '?'}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="toast-feedback" style={{ color: 'var(--neon-cyan)' }}>
                  {gameMessage}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <div className="mb-4 opacity-50 flex justify-center text-gray-400">
                <Gamepad2 size={64} />
              </div>
              <p>Preview Game akan muncul di sini</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

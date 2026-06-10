import React, { useState, useEffect } from 'react';
import ModelSelector from './ModelSelector';
import { GoogleGenAI, Type } from '../lib/genai';
import { educationLevels, phaseClassMap, subjectsByLevel } from '../constants';
import { useAuth } from '../AuthContext';
import AIAssistedInput from './AIAssistedInput';
import AIAssistedTextarea from './AIAssistedTextarea';
import { Bot, Loader2, Sparkles, PenTool } from 'lucide-react';
import './ZeroGStyles.css';

type BlankItem = {
  id: number;
  answer: string;
  sentenceBefore: string;
  sentenceAfter: string;
  userAnswer: string;
  isCorrect: boolean;
};

export default function FillBlanks() {
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
  const [questions, setQuestions] = useState<BlankItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameMessage, setGameMessage] = useState('');
  const [isError, setIsError] = useState(false);

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

      const prompt = `Buatkan 5 soal isian rumpang (Fill in the Blanks).
Jenjang: ${jenjangLabel}
Fase: ${faseLabel}
Kelas: ${kelasLabel}
Mata Pelajaran: ${subjectLabel}

PENTING:
1. "word" adalah KATA KUNCI jawaban (hanya 1 kata).
2. "clue" adalah kalimat lengkap yang mendeskripsikan kata kunci tersebut, di mana bagian kata kunci diganti dengan simbol "___" (tiga underscore).
3. Berikan output HANYA dalam format JSON array of objects dengan struktur:
[
  { "word": "JAWABAN", "clue": "Kalimat yang mengandung ___ sebagai bagian kosong." },
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
                word: { type: Type.STRING, description: "Jawaban yang benar" },
                clue: { type: Type.STRING, description: "Kalimat dengan bagian kosong disimbolkan '___'" }
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
          setTitle(`Isian Rumpang: ${subjectLabel} Kelas ${kelasLabel}`);
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Terjadi kesalahan saat membuat soal dengan AI');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const startGame = () => {
    setError('');
    const lines = inputText.split('\n').filter(line => line.trim() !== '');
    const parsedQuestions = [];

    for (let i = 0; i < lines.length; i++) {
      const parts = lines[i].split('-');
      if (parts.length >= 2) {
        const word = parts[0].trim();
        const clue = parts.slice(1).join('-').trim();
        
        // Split clue by ___
        const clueParts = clue.split('___');
        const before = clueParts[0] || '';
        const after = clueParts.length > 1 ? clueParts.slice(1).join('___') : '';

        if (word && clue) {
          parsedQuestions.push({
            id: i,
            answer: word,
            sentenceBefore: before.trim(),
            sentenceAfter: after.trim(),
            userAnswer: '',
            isCorrect: false
          });
        }
      }
    }

    if (parsedQuestions.length < 1) {
      setError('Masukkan minimal 1 kalimat rumpang! Pastikan mengandung "___" di petunjuk.');
      return;
    }

    setQuestions(parsedQuestions);
    setCurrentIndex(0);
    setGameMessage('');
    setIsError(false);
    setIsGameActive(true);
  };

  const checkAnswer = () => {
    const currentQ = questions[currentIndex];
    const ans = currentQ.userAnswer.trim().toLowerCase();
    const correctAns = currentQ.answer.toLowerCase();

    if (ans === correctAns) {
      setIsError(false);
      
      const updated = [...questions];
      updated[currentIndex].isCorrect = true;
      setQuestions(updated);

      if (currentIndex < questions.length - 1) {
        setGameMessage("✓ CORRECT! LOADING NEXT SEQUENCE...");
        setTimeout(() => {
          setCurrentIndex(prev => prev + 1);
          setGameMessage('');
        }, 1000);
      } else {
        setGameMessage("✓ SYSTEM COMPATIBLE: ALL TASKS EXCELLENT!");
      }
    } else {
      setIsError(true);
      setGameMessage("✕ PARSING REJECTED: RETRY.");
      setTimeout(() => setIsError(false), 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      checkAnswer();
    }
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
          <PenTool size={28} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Fill in the Blanks</h3>
          <p className="text-gray-600">Buat soal melengkapi kalimat rumpang</p>
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
            <AIAssistedInput type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Contoh: Hukum Newton" className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Daftar Soal</label>
            <p className="text-xs text-gray-600 mb-2">Format: <strong>JAWABAN - Kalimat dengan ___ untuk melengkapi.</strong> (satu per baris)</p>
            <AIAssistedTextarea value={inputText} onChange={(e) => setInputText(e.target.value)} rows={8} placeholder="Gaya - ___ adalah tarikan atau dorongan.&#10;Planet - Bumi adalah salah satu ___ di tata surya." className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 font-mono text-sm outline-none custom-scrollbar" />
          </div>

          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}

          <button onClick={startGame} className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-sm">
            Generate Game
          </button>
        </div>

        <div className="bg-gray-50 border border-gray-200 shadow-sm rounded-xl p-4 min-h-[400px] flex items-center justify-center overflow-auto custom-scrollbar">
          {isGameActive && questions.length > 0 ? (
            <div className="zerog-wrapper w-full h-full">
              <div className="zerog-container" style={{ borderColor: 'var(--neon-pink)', borderStyle: 'solid', borderWidth: '2px', boxShadow: '0 0 30px rgba(255, 0, 127, 0.2)' }}>
                {Array.from({ length: 15 }).map((_, i) => (
                  <div key={i} className="space-dust" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 10}s`, transform: `scale(${Math.random() * 1.5})` }} />
                ))}
                
                <header>
                  <h1 style={{ background: 'linear-gradient(to right, #fff, var(--neon-pink))', WebkitBackgroundClip: 'text' }}>
                    {title || "Fill in the Blanks"}
                  </h1>
                  <p style={{ color: 'var(--neon-pink)', fontSize: '0.8rem', marginTop: '10px' }}>
                    Soal {currentIndex + 1} / {questions.length}
                  </p>
                </header>

                <div className="game-viewport">
                  {currentIndex < questions.length ? (
                    <div className="flex flex-col items-center gap-6">
                      <div className="blank-text">
                        {questions[currentIndex].sentenceBefore}{' '}
                        <input 
                          type="text" 
                          className="blank-input-box" 
                          autoFocus
                          placeholder="..." 
                          value={questions[currentIndex].userAnswer}
                          onChange={(e) => {
                            const updated = [...questions];
                            updated[currentIndex].userAnswer = e.target.value;
                            setQuestions(updated);
                          }}
                          onKeyDown={handleKeyPress}
                        />{' '}
                        {questions[currentIndex].sentenceAfter}
                      </div>
                      <button className="submit-action-btn" onClick={checkAnswer}>
                        Verification
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="blank-text" style={{ color: 'var(--neon-pink)' }}>All sequences completed successfully!</div>
                    </div>
                  )}
                </div>

                <div className="toast-feedback" style={{ color: isError ? '#ff0055' : 'var(--neon-pink)' }}>
                  {gameMessage}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <div className="mb-4 opacity-50 flex justify-center text-gray-400">
                <PenTool size={64} />
              </div>
              <p>Preview Game akan muncul di sini</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

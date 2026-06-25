import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Users, Play, CheckCircle, BarChart3, ChevronRight, ChevronLeft, Loader2, Award, XCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface Soal {
  no: string;
  pertanyaan: string;
  opsiTambahan?: string[];
  kunci: string;
  gambarUrl?: string;
}

interface LiveQuizOrchestratorProps {
  soalList: Soal[];
}

export default function LiveQuizOrchestrator({ soalList }: LiveQuizOrchestratorProps) {
  const [status, setStatus] = useState<'setup' | 'student-join' | 'running' | 'results'>('setup');
  const [token, setToken] = useState('');
  
  // Simulated student state
  const [studentName, setStudentName] = useState('');
  const [inputToken, setInputToken] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [studentAnswers, setStudentAnswers] = useState<Record<number, string>>({});
  
  // Fake other students to make it look "live"
  const [fakeStudents, setFakeStudents] = useState<{name: string, score: number}[]>([]);

  useEffect(() => {
    // Generate random token on mount
    setToken(Math.random().toString(36).substring(2, 8).toUpperCase());
  }, []);

  const handleStartQuiz = () => {
    setStatus('student-join');
  };

  const handleStudentJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputToken !== token) {
      alert('Token tidak valid!');
      return;
    }
    if (!studentName.trim()) {
      alert('Nama tidak boleh kosong!');
      return;
    }
    setStatus('running');
  };

  const handleAnswer = (answer: string) => {
    setStudentAnswers({ ...studentAnswers, [currentQuestionIndex]: answer });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < soalList.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    // Calculate student score
    let correct = 0;
    soalList.forEach((soal, index) => {
      // Basic check, assume opsi is like "A. text" and kunci is "A" or "A. text"
      const ans = studentAnswers[index] || '';
      const ansLetter = ans.substring(0, 2).trim().replace('.', '');
      const keyLetter = soal.kunci.substring(0, 2).trim().replace('.', '');
      
      if (ansLetter === keyLetter || ans === soal.kunci) {
        correct++;
      }
    });
    
    const finalScore = Math.round((correct / soalList.length) * 100);

    // Generate fake students scores
    const fakes = [
      { name: 'Budi Santoso', score: Math.floor(Math.random() * 40) + 60 },
      { name: 'Siti Aminah', score: Math.floor(Math.random() * 30) + 70 },
      { name: 'Andi Pratama', score: Math.floor(Math.random() * 50) + 40 },
      { name: 'Rina Wijaya', score: Math.floor(Math.random() * 20) + 80 },
    ];
    
    setFakeStudents([{ name: studentName, score: finalScore }, ...fakes]);
    setStatus('results');
  };

  if (status === 'setup') {
    return (
      <div className="h-full flex flex-col p-4 animate-in fade-in duration-300">
        <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center max-w-2xl mx-auto w-full">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-6">
            <Users size={40} className="text-purple-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Mulai Live Quiz</h2>
          <p className="text-gray-500 mb-8">Posisikan layar ini (proyektor) agar terlihat oleh siswa. Mereka dapat bergabung menggunakan Token atau Scan QR Code.</p>
          
          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-8 mb-8 w-full">
            <p className="text-sm font-bold text-purple-600 mb-2 uppercase tracking-widest">KODE TOKEN JOIN</p>
            <div className="text-6xl font-black text-purple-900 tracking-widest mb-6 font-mono">{token}</div>
            
            <div className="flex justify-center mb-4 bg-white p-4 inline-block rounded-xl border border-purple-100">
               <QRCodeSVG value={`${window.location.origin}/join?token=${token}`} size={150} />
            </div>
            <p className="text-xs text-purple-600">Scan QR Code untuk bergabung (Simulasi)</p>
          </div>

          <button
            onClick={handleStartQuiz}
            className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <Play size={24} /> Buka Sesi & Simulasikan Siswa Join
          </button>
        </div>
      </div>
    );
  }

  if (status === 'student-join') {
    return (
      <div className="h-full flex flex-col p-4 animate-in fade-in duration-300">
        <div className="flex-1 flex flex-col bg-slate-900 rounded-xl shadow-xl border border-slate-800 p-0 overflow-hidden relative max-w-md mx-auto w-full text-white">
          <div className="p-8 text-center">
             <h2 className="text-2xl font-black mb-1">Wayground<span className="text-purple-400">Quiz</span></h2>
             <p className="text-slate-400 text-sm mb-8">Masukkan nama dan token dari proyektor</p>

             <form onSubmit={handleStudentJoin} className="space-y-4">
               <div>
                 <input 
                   type="text" 
                   required
                   value={studentName}
                   onChange={e => setStudentName(e.target.value)}
                   placeholder="Nama Lengkap Anda"
                   className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                 />
               </div>
               <div>
                 <input 
                   type="text" 
                   required
                   value={inputToken}
                   onChange={e => setInputToken(e.target.value.toUpperCase())}
                   placeholder="Kode Token (Contoh: A1B2C)"
                   className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 font-mono focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none uppercase"
                 />
               </div>
               <button
                  type="submit"
                  className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)]"
               >
                 Join Game
               </button>
             </form>

             <div className="mt-8 text-xs text-slate-500">
               *Ini adalah tampilan simulasi perangkat siswa. Live multi-device memerlukan backend.
             </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'running') {
    const soal = soalList[currentQuestionIndex];
    return (
      <div className="h-full flex flex-col p-4 animate-in fade-in duration-300">
        <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 p-0 overflow-hidden relative max-w-3xl mx-auto w-full">
          
          {/* Header Progress */}
          <div className="bg-purple-600 p-4 text-white flex justify-between items-center">
            <div className="font-bold">{studentName}</div>
            <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold">
              Soal {currentQuestionIndex + 1} / {soalList.length}
            </div>
          </div>

          <div className="p-6 flex-1 overflow-y-auto">
             <h3 className="text-xl font-bold text-gray-800 mb-6 leading-relaxed">
               {soal.pertanyaan}
             </h3>

             {soal.gambarUrl && (
               <div className="mb-6 bg-gray-50 p-2 rounded-xl border border-gray-100 flex justify-center">
                 <img src={soal.gambarUrl} alt="Ilustrasi" className="max-h-64 object-contain rounded" />
               </div>
             )}

             {soal.opsiTambahan && soal.opsiTambahan.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                  {soal.opsiTambahan.map((opt, i) => {
                    const optionLetter = opt.substring(0, 2).trim();
                    const isSelected = studentAnswers[currentQuestionIndex] === opt;
                    const colors = [
                      'bg-red-500 hover:bg-red-600 border-red-600',
                      'bg-blue-500 hover:bg-blue-600 border-blue-600',
                      'bg-amber-500 hover:bg-amber-600 border-amber-600',
                      'bg-emerald-500 hover:bg-emerald-600 border-emerald-600'
                    ];
                    const colorClass = colors[i % 4];

                    return (
                      <button
                        key={i}
                        onClick={() => handleAnswer(opt)}
                        className={`w-full min-h-[100px] p-6 rounded-2xl text-white font-bold text-lg text-left transition-all transform hover:scale-[1.02] border-b-4 ${colorClass} ${isSelected ? 'ring-4 ring-white ring-offset-2 ring-offset-purple-600 scale-[1.02]' : ''}`}
                      >
                        {opt}
                      </button>
                    )
                  })}
                </div>
             )}
             {(!soal.opsiTambahan || soal.opsiTambahan.length === 0) && (
                <div className="mt-8">
                  <textarea
                     value={studentAnswers[currentQuestionIndex] || ''}
                     onChange={(e) => handleAnswer(e.target.value)}
                     placeholder="Ketik jawaban Anda di sini..."
                     className="w-full min-h-[150px] p-6 rounded-2xl border-2 border-purple-200 focus:border-purple-600 focus:ring-4 focus:ring-purple-100 outline-none resize-none text-lg"
                  />
                </div>
             )}
          </div>

          <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
             <button
                onClick={() => {
                  if (currentQuestionIndex > 0) setCurrentQuestionIndex(prev => prev - 1);
                }}
                disabled={currentQuestionIndex === 0}
                className="px-6 py-3 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center gap-2"
             >
               <ChevronLeft size={20} /> Kembali
             </button>

             <div className="flex gap-2">
               <button
                  onClick={handleNextQuestion}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-bold transition-all flex items-center gap-2"
               >
                 Lewati
               </button>
               <button
                  onClick={handleNextQuestion}
                  disabled={!studentAnswers[currentQuestionIndex]}
                  className="px-8 py-3 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition-all disabled:opacity-50 flex items-center gap-2"
               >
                 {currentQuestionIndex < soalList.length - 1 ? 'Berikutnya' : 'Kumpulkan'} <ChevronRight size={20} />
               </button>
             </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'results') {
    const kkm = 75;
    
    // Sort students by score desc
    const sortedStudents = [...fakeStudents].sort((a, b) => b.score - a.score);
    
    // Calculate Tuntas vs Tidak Tuntas
    const tuntas = sortedStudents.filter(s => s.score >= kkm).length;
    const tidakTuntas = sortedStudents.length - tuntas;

    const chartData = [
      { name: 'Tuntas (≥75)', value: tuntas },
      { name: 'Tidak Tuntas (<75)', value: tidakTuntas },
    ];

    const COLORS = ['#10b981', '#ef4444']; // Emerald for pass, Red for fail

    return (
      <div className="h-full flex flex-col p-4 animate-in fade-in duration-500">
        <div className="flex-1 flex flex-col bg-slate-50 rounded-2xl shadow-sm border border-gray-200 p-6 md:p-10 overflow-y-auto max-w-5xl mx-auto w-full">
           <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-slate-800 mb-2">Analisis Capaian Siswa</h2>
              <p className="text-slate-500">Berdasarkan Kriteria Ketuntasan Minimal (KKM): <strong className="text-slate-700">{kkm}</strong></p>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Leaderboard Card */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                 <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                   <Award className="text-amber-500" /> Leaderboard Simulasi
                 </h3>
                 <div className="space-y-3">
                   {sortedStudents.map((student, i) => (
                     <div key={i} className={`flex items-center justify-between p-4 rounded-xl border ${student.name === studentName ? 'bg-purple-50 border-purple-200' : 'bg-slate-50 border-slate-100'}`}>
                       <div className="flex items-center gap-4">
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${i === 0 ? 'bg-amber-100 text-amber-600' : i === 1 ? 'bg-slate-200 text-slate-600' : i === 2 ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-400'}`}>
                           {i + 1}
                         </div>
                         <div className="font-bold text-slate-700">
                           {student.name} {student.name === studentName && <span className="text-xs bg-purple-200 text-purple-700 px-2 py-0.5 rounded-full ml-2">Anda</span>}
                         </div>
                       </div>
                       <div className="flex items-center gap-4">
                         {student.score >= kkm ? (
                           <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md flex items-center gap-1"><CheckCircle size={12}/> Tuntas</span>
                         ) : (
                           <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md flex items-center gap-1"><XCircle size={12}/> T. Tuntas</span>
                         )}
                         <div className="text-xl font-black text-slate-800 w-12 text-right">{student.score}</div>
                       </div>
                     </div>
                   ))}
                 </div>
              </div>

              {/* Chart Card */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col">
                 <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                   <BarChart3 className="text-blue-500" /> Distribusi Ketuntasan
                 </h3>
                 <p className="text-sm text-slate-500 mb-6">Grafik menunjukkan jumlah siswa yang mencapai KKM 75.</p>
                 
                 <div className="flex-1 min-h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                        <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                        <Tooltip 
                          cursor={{fill: '#f8fafc'}}
                          contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                        />
                        <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={60}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                 </div>
              </div>
           </div>

           <div className="flex justify-center mt-4">
             <button
               onClick={() => {
                 setStatus('setup');
                 setStudentAnswers({});
                 setCurrentQuestionIndex(0);
                 setStudentName('');
                 setInputToken('');
                 setToken(Math.random().toString(36).substring(2, 8).toUpperCase());
               }}
               className="px-8 py-3 bg-slate-900 hover:bg-black text-white rounded-xl font-bold transition-all shadow-md"
             >
               Selesai & Tutup Kuis
             </button>
           </div>
        </div>
      </div>
    );
  }

  return null;
}

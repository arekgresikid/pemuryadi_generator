import React, { useState, useEffect } from 'react';
import { Gamepad2, Search, Grid, Brain, Link2, FileEdit, Shuffle, Printer, Play, Sparkles, Volume2, VolumeX } from 'lucide-react';
import WordSearch from './WordSearch';
import CrosswordGenerator from './CrosswordGenerator';
import MemoryMatrix from './MemoryMatrix';
import MatchingPairs from './MatchingPairs';
import FillBlanks from './FillBlanks';
import UnscrambleLetters from './UnscrambleLetters';
import { setGameAudioMuted, isGameAudioMuted, gameAudio } from '../lib/gameAudio';

const GAME_CATALOG = [
  {
    id: 'puzzle',
    name: 'Cari Kata (Word Search)',
    desc: 'Grid huruf interaktif & lembar cetak pencarian kata otomatis.',
    icon: Search,
    color: 'from-blue-500 to-cyan-500',
    badges: ['Live Play', 'Siap Cetak', 'AI'],
  },
  {
    id: 'crossword',
    name: 'Teka-Teki Silang (TTS)',
    desc: 'Mainkan TTS langsung di layar atau cetak soal + kunci jawaban.',
    icon: Grid,
    color: 'from-indigo-500 to-purple-500',
    badges: ['Live Play', 'Siap Cetak', 'AI'],
  },
  {
    id: 'memory-matrix',
    name: 'Memory Matrix',
    desc: 'Latih daya ingat konsep materi dengan kartu bolak-balik & cetak.',
    icon: Brain,
    color: 'from-emerald-500 to-teal-500',
    badges: ['Live Play', 'Siap Cetak', 'AI'],
  },
  {
    id: 'matching-pairs',
    name: 'Matching Pairs',
    desc: 'Cocokkan istilah & definisi di layar atau cetak lembar menjodohkan.',
    icon: Link2,
    color: 'from-amber-500 to-orange-500',
    badges: ['Live Play', 'Siap Cetak', 'AI'],
  },
  {
    id: 'fill-blanks',
    name: 'Fill in the Blanks',
    desc: 'Lengkapi kalimat rumpang interaktif & cetak lembar latihan siswa.',
    icon: FileEdit,
    color: 'from-rose-500 to-pink-500',
    badges: ['Live Play', 'Siap Cetak', 'AI'],
  },
  {
    id: 'unscramble-letters',
    name: 'Unscramble Letters',
    desc: 'Susun huruf acak menjadi istilah kunci materi + lembar cetak.',
    icon: Shuffle,
    color: 'from-violet-500 to-fuchsia-500',
    badges: ['Live Play', 'Siap Cetak', 'AI'],
  },
];

export default function GamesHub() {
  const [selectedGame, setSelectedGame] = useState('puzzle');
  const [muted, setMuted] = useState(() => isGameAudioMuted());

  useEffect(() => {
    const saved = localStorage.getItem('pemuryadi_gamesTab');
    if (saved && GAME_CATALOG.some(g => g.id === saved)) {
      setSelectedGame(saved);
    }
  }, []);

  const handleSelectGame = (id: string) => {
    gameAudio.click();
    setSelectedGame(id);
    localStorage.setItem('pemuryadi_gamesTab', id);
  };

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    setGameAudioMuted(next);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 text-gray-900">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-md">
              <Gamepad2 size={24} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Games Center Dual-Mode</h1>
              <p className="text-xs sm:text-sm text-indigo-600 font-medium">
                Mainkan langsung di kelas atau cetak lembar aktivitas + kunci jawaban
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleMute}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all ${
              muted
                ? 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
                : 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
            }`}
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            <span>{muted ? 'Efek Suara: Mati' : 'Efek Suara: Aktif'}</span>
          </button>
        </div>

        {/* Visual Game Cards Hub */}
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {GAME_CATALOG.map(game => {
            const Icon = game.icon;
            const active = selectedGame === game.id;
            return (
              <button
                key={game.id}
                type="button"
                onClick={() => handleSelectGame(game.id)}
                className={`text-left p-3 rounded-2xl border transition-all flex flex-col justify-between gap-2 ${
                  active
                    ? 'bg-indigo-50/90 border-indigo-500 ring-2 ring-indigo-500/30 shadow-md -translate-y-0.5'
                    : 'bg-white border-gray-200 hover:border-indigo-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${game.color} text-white flex items-center justify-center shrink-0 shadow-sm`}>
                    <Icon size={16} />
                  </div>
                  <span className={`text-xs font-bold leading-tight ${active ? 'text-indigo-950' : 'text-gray-800'}`}>
                    {game.name}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                    <Play size={8} /> Play
                  </span>
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 text-[9px] font-bold">
                    <Printer size={8} /> Cetak
                  </span>
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 text-[9px] font-bold">
                    <Sparkles size={8} /> AI
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Game Area */}
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {selectedGame === 'puzzle' && <WordSearch />}
          {selectedGame === 'crossword' && <CrosswordGenerator />}
          {selectedGame === 'memory-matrix' && <MemoryMatrix />}
          {selectedGame === 'matching-pairs' && <MatchingPairs />}
          {selectedGame === 'fill-blanks' && <FillBlanks />}
          {selectedGame === 'unscramble-letters' && <UnscrambleLetters />}
        </div>
      </div>
    </div>
  );
}

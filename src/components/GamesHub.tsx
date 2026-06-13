import React, { useState, useEffect } from 'react';
import { Gamepad2 } from 'lucide-react';
import WordSearch from './WordSearch';
import CrosswordGenerator from './CrosswordGenerator';
import MemoryMatrix from './MemoryMatrix';
import MatchingPairs from './MatchingPairs';
import FillBlanks from './FillBlanks';
import UnscrambleLetters from './UnscrambleLetters';

export default function GamesHub() {
  const [selectedGame, setSelectedGame] = useState('puzzle');

  useEffect(() => {
    const saved = localStorage.getItem('pemuryadi_gamesTab');
    if (saved) {
      setSelectedGame(saved);
    }
  }, []);

  const handleGameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedGame(val);
    localStorage.setItem('pemuryadi_gamesTab', val);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 text-gray-900">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between shrink-0 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 border border-indigo-200 shadow-sm">
            <Gamepad2 size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-wide">Games Center</h1>
            <p className="text-sm text-indigo-500">Pusat pembuatan ragam permainan edukasi</p>
          </div>
        </div>
        
        <div className="w-full md:w-72 z-10">
          <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Pilih Jenis Game</label>
          <select 
            value={selectedGame} 
            onChange={handleGameChange}
            className="w-full p-2.5 border border-indigo-200 rounded-xl text-sm bg-indigo-50 text-indigo-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all shadow-sm font-bold"
          >
            <option value="puzzle">Puzzle Kata (Word Search)</option>
            <option value="crossword">Teka Teki Silang (Crossword)</option>
            <option value="memory-matrix">Memory Matrix</option>
            <option value="matching-pairs">Matching Pairs</option>
            <option value="fill-blanks">Fill in the Blanks</option>
            <option value="unscramble-letters">Unscramble Letters</option>
          </select>
        </div>
      </div>

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

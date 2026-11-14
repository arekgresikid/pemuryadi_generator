import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { universalPrint, getWatermarkHtml } from '../utils/print';
import { educationLevels, phaseClassMap, subjectsByLevel } from '../constants';
import { GoogleGenAI, Type } from '../lib/genai';
import ModelSelector from './ModelSelector';
import AIAssistedInput from './AIAssistedInput';
import AIAssistedTextarea from './AIAssistedTextarea';
import { gameAudio } from '../lib/gameAudio';
import { Type as TypeIcon, Puzzle, Printer, Sparkles, Loader2, Bot, Clock, Trophy, CheckCircle2 } from 'lucide-react';

type WordPlacement = {
  word: string;
  cells: [number, number][];
};

export default function WordSearch() {
  const { profile } = useAuth();
  const [eduLevel, setEduLevel] = useState('sd');
  const [fase, setFase] = useState('A');
  const [kelas, setKelas] = useState('1');
  const [subject, setSubject] = useState('bahasa-indonesia');
  const [selectedModel, setSelectedModel] = useState<string>('openai');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const [title, setTitle] = useState('');
  const [wordsText, setWordsText] = useState('');
  const [gridSize, setGridSize] = useState(15);
  const [difficulty, setDifficulty] = useState('easy');
  const [puzzleData, setPuzzleData] = useState<{
    title: string;
    grid: string[][];
    words: string[];
    placements: WordPlacement[];
    gridSize: number;
  } | null>(null);
  const [error, setError] = useState('');

  // Interactive Play State
  const [startCell, setStartCell] = useState<[number, number] | null>(null);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [foundCellKeys, setFoundCellKeys] = useState<Set<string>>(new Set());
  const [elapsedSec, setElapsedSec] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (profile?.jenjang) {
      const lvl = profile.jenjang.toLowerCase();
      if (educationLevels.some(e => e.id === lvl)) setEduLevel(lvl);
    }
  }, [profile]);

  useEffect(() => {
    const phases = phaseClassMap[eduLevel]?.phases || [];
    setFase(phases[0]?.id || '');
    const subjects = subjectsByLevel[eduLevel] || [];
    setSubject(subjects[0]?.id || '');
  }, [eduLevel]);

  useEffect(() => {
    const classes = phaseClassMap[eduLevel]?.classes?.[fase] || [];
    setKelas(classes[0]?.id || '');
  }, [fase, eduLevel]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isPlaying && puzzleData && foundWords.length < puzzleData.words.length) {
      timer = setInterval(() => setElapsedSec(s => s + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, puzzleData, foundWords.length]);

  const wordCount = wordsText.trim().split('\n').filter(w => w.trim()).length;

  const generateWordsWithAI = async () => {
    setIsGeneratingAI(true);
    setError('');
    try {
      const ai = new GoogleGenAI({});
      const subjectLabel = subjectsByLevel[eduLevel]?.find(s => s.id === subject)?.label || subject;
      const jenjangLabel = educationLevels.find(l => l.id === eduLevel)?.label || eduLevel;

      const prompt = `Buatkan 12 sampai 15 kata kunci edukatif (kata tunggal tanpa spasi, huruf A-Z saja, panjang 4-12 huruf) untuk permainan Word Search (Cari Kata) bagi siswa:
- Jenjang: ${jenjangLabel} (Kelas ${kelas})
- Mata Pelajaran: ${subjectLabel}
- Topik/Judul: ${title || 'Materi Pokok ' + subjectLabel}

Kembalikan dalam JSON: { "judul": "Judul Menarik", "words": ["KATA1", "KATA2", ...] }`;

      const response = await ai.models.generateContent({
        model: selectedModel,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              judul: { type: Type.STRING },
              words: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['judul', 'words'],
          },
        },
      });

      const data = JSON.parse(response.text || '{}');
      if (Array.isArray(data.words) && data.words.length > 0) {
        if (!title && data.judul) setTitle(data.judul);
        const cleaned = data.words
          .map((w: string) => w.toUpperCase().replace(/[^A-Z]/g, ''))
          .filter((w: string) => w.length >= 3 && w.length <= gridSize);
        setWordsText(cleaned.join('\n'));
      }
    } catch (err: any) {
      setError('Gagal menghasilkan kata dari AI: ' + err.message);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const getDirections = (diff: string) => {
    switch (diff) {
      case 'easy': return [[0, 1], [1, 0]];
      case 'medium': return [[0, 1], [1, 0], [1, 1], [-1, 1]];
      case 'hard': return [[0, 1], [1, 0], [1, 1], [-1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1]];
      default: return [[0, 1], [1, 0]];
    }
  };

  const canPlace = (grid: string[][], word: string, row: number, col: number, dir: number[], size: number) => {
    for (let i = 0; i < word.length; i++) {
      const r = row + i * dir[0];
      const c = col + i * dir[1];
      if (r < 0 || r >= size || c < 0 || c >= size) return false;
      if (grid[r][c] && grid[r][c] !== word[i]) return false;
    }
    return true;
  };

  const placeWord = (grid: string[][], word: string, directions: number[][], size: number): [number, number][] | null => {
    for (let a = 0; a < 120; a++) {
      const dir = directions[Math.floor(Math.random() * directions.length)];
      const startRow = Math.floor(Math.random() * size);
      const startCol = Math.floor(Math.random() * size);
      if (canPlace(grid, word, startRow, startCol, dir, size)) {
        const cells: [number, number][] = [];
        for (let i = 0; i < word.length; i++) {
          const r = startRow + i * dir[0];
          const c = startCol + i * dir[1];
          grid[r][c] = word[i];
          cells.push([r, c]);
        }
        return cells;
      }
    }
    return null;
  };

  const generatePuzzle = () => {
    setError('');
    const puzzleTitle = title || 'Word Search Puzzle';
    if (!wordsText.trim()) {
      setError('Masukkan kata-kata atau klik "Buat Kata Otomatis" terlebih dahulu!');
      return;
    }

    let words = wordsText
      .toUpperCase()
      .split('\n')
      .map(w => w.trim().replace(/[^A-Z]/g, ''))
      .filter(w => w.length >= 2 && w.length <= gridSize);
    words = Array.from(new Set(words)).slice(0, 40);

    const grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));
    const placedWords: string[] = [];
    const placements: WordPlacement[] = [];
    const directions = getDirections(difficulty);

    words.forEach(word => {
      const cells = placeWord(grid, word, directions, gridSize);
      if (cells) {
        placedWords.push(word);
        placements.push({ word, cells });
      }
    });

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (!grid[i][j]) grid[i][j] = letters[Math.floor(Math.random() * 26)];
      }
    }

    gameAudio.click();
    setPuzzleData({ title: puzzleTitle, grid, words: placedWords, placements, gridSize });
    setStartCell(null);
    setFoundWords([]);
    setFoundCellKeys(new Set());
    setElapsedSec(0);
    setIsPlaying(true);
  };

  const handleCellClick = (r: number, c: number) => {
    if (!puzzleData) return;
    if (!startCell) {
      gameAudio.click();
      setStartCell([r, c]);
      return;
    }

    const [sr, sc] = startCell;
    const dr = r - sr;
    const dc = c - sc;
    const steps = Math.max(Math.abs(dr), Math.abs(dc));

    const isStraight = dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc);
    if (!isStraight || steps === 0) {
      setStartCell([r, c]);
      return;
    }

    const stepR = dr === 0 ? 0 : dr / Math.abs(dr);
    const stepC = dc === 0 ? 0 : dc / Math.abs(dc);

    let selectedStr = '';
    const coords: [number, number][] = [];
    for (let i = 0; i <= steps; i++) {
      const cr = sr + i * stepR;
      const cc = sc + i * stepC;
      selectedStr += puzzleData.grid[cr][cc];
      coords.push([cr, cc]);
    }

    const reversedStr = selectedStr.split('').reverse().join('');
    const matched = puzzleData.words.find(w => (w === selectedStr || w === reversedStr) && !foundWords.includes(w));

    if (matched) {
      const nextFound = [...foundWords, matched];
      const nextKeys = new Set(foundCellKeys);
      coords.forEach(([cr, cc]) => nextKeys.add(`${cr}-${cc}`));
      setFoundWords(nextFound);
      setFoundCellKeys(nextKeys);
      setStartCell(null);
      if (nextFound.length === puzzleData.words.length) {
        gameAudio.win();
        setIsPlaying(false);
      } else {
        gameAudio.correct();
      }
    } else {
      gameAudio.wrong();
      setStartCell(null);
    }
  };

  const printPuzzle = (withKey: boolean = false) => {
    if (!puzzleData) {
      setError('Generate puzzle terlebih dahulu!');
      return;
    }

    const { title: pTitle, grid, words, placements, gridSize: gSize } = puzzleData;
    const keySet = new Set<string>();
    if (withKey) {
      placements.forEach(p => p.cells.forEach(([r, c]) => keySet.add(`${r}-${c}`)));
    }

    let gridHtml = '<table style="border-collapse:collapse;margin:16px auto;">';
    for (let i = 0; i < gSize; i++) {
      gridHtml += '<tr>';
      for (let j = 0; j < gSize; j++) {
        const isKey = keySet.has(`${i}-${j}`);
        gridHtml += `<td style="width:${gSize > 18 ? 22 : 26}px;height:${gSize > 18 ? 22 : 26}px;text-align:center;border:1px solid #334155;font-family:monospace;font-weight:bold;font-size:13px;background:${isKey ? '#bbf7d0' : '#ffffff'};color:${isKey ? '#14532d' : '#000000'};">${grid[i][j]}</td>`;
      }
      gridHtml += '</tr>';
    }
    gridHtml += '</table>';

    const html = `
      <div style="font-family:Arial,sans-serif;color:#000;">
        <div style="border-bottom:2px solid #000;padding-bottom:8px;margin-bottom:14px;display:flex;justify-content:space-between;align-items:flex-end;">
          <div>
            <h1 style="margin:0;font-size:20px;">${pTitle} ${withKey ? '(KUNCI JAWABAN)' : ''}</h1>
            <p style="margin:4px 0 0;font-size:12px;color:#334155;">Temukan ${words.length} kata tersembunyi (mendatar, menurun, atau diagonal).</p>
          </div>
          ${!withKey ? `<div style="font-size:12px;text-align:right;">Nama: .................................<br/>Kelas: ...................</div>` : ''}
        </div>
        ${gridHtml}
        <div style="margin-top:16px;padding:12px;border:1px solid #94a3b8;border-radius:8px;background:#f8fafc;">
          <h3 style="margin:0 0 8px;font-size:13px;">Daftar Kata yang Dicari:</h3>
          <p style="margin:0;font-size:12px;line-height:1.7;font-weight:600;">${words.join(' &nbsp;•&nbsp; ')}</p>
        </div>
        ${getWatermarkHtml(profile)}
      </div>
    `;

    universalPrint(html, `${pTitle}${withKey ? ' - Kunci' : ''}`);
  };

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md">
          <TypeIcon size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Word Search (Cari Kata Interaktif & Cetak)</h3>
          <p className="text-sm text-gray-600">Buat daftar kata otomatis dengan AI, mainkan langsung dengan klik huruf awal-akhir, atau cetak LKPD.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4">
          {/* AI Word Helper */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
              <Bot size={15} /> Generator Kata Otomatis
            </h4>
            <div className="grid grid-cols-3 gap-2">
              <select value={eduLevel} onChange={e => setEduLevel(e.target.value)} className="bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900">
                {educationLevels.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
              </select>
              <select value={kelas} onChange={e => setKelas(e.target.value)} className="bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900">
                {(phaseClassMap[eduLevel]?.classes?.[fase] || []).map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
              <select value={subject} onChange={e => setSubject(e.target.value)} className="bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900">
                {(subjectsByLevel[eduLevel] || []).map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
            <ModelSelector label="Model AI" modality="text" value={selectedModel} onChange={setSelectedModel} disabled={isGeneratingAI} />
            <button
              type="button"
              onClick={generateWordsWithAI}
              disabled={isGeneratingAI}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {isGeneratingAI ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
              {isGeneratingAI ? 'Menyusun Daftar Kata...' : 'Buat Kata Otomatis dari Topik'}
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Judul / Topik Puzzle</label>
            <AIAssistedInput
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm text-gray-900 focus:border-emerald-500"
              placeholder="Contoh: Sistem Tata Surya"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Daftar Kata (1 kata per baris, maks 40)</label>
            <AIAssistedTextarea
              value={wordsText}
              onChange={(e) => setWordsText(e.target.value)}
              rows={5}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm text-gray-900 font-mono focus:border-emerald-500"
              placeholder="MATAHARI&#10;MERKURIUS&#10;VENUS&#10;BUMI&#10;MARS"
            />
            <p className="text-[11px] text-gray-500 mt-1">Jumlah kata: {Math.min(wordCount, 40)}/40</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Ukuran Grid</label>
              <select value={gridSize} onChange={(e) => setGridSize(parseInt(e.target.value))} className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-sm text-gray-900">
                <option value="12">12 x 12 (SD Awal)</option>
                <option value="15">15 x 15 (Standar)</option>
                <option value="18">18 x 18</option>
                <option value="20">20 x 20</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Arah Kata</label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-sm text-gray-900">
                <option value="easy">Mudah (Mendatar/Menurun)</option>
                <option value="medium">Sedang (+Diagonal)</option>
                <option value="hard">Sulit (+Terbalik)</option>
              </select>
            </div>
          </div>

          {error && <p className="text-red-600 text-xs font-medium bg-red-50 p-2.5 rounded-lg border border-red-200">{error}</p>}

          <button
            type="button"
            onClick={generatePuzzle}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 font-bold text-white flex items-center justify-center gap-2 shadow-md"
          >
            <Puzzle size={20} /> Generate & Mainkan Puzzle
          </button>

          {puzzleData && (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => printPuzzle(false)}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Printer size={15} /> Cetak Lembar Siswa
              </button>
              <button
                type="button"
                onClick={() => printPuzzle(true)}
                className="py-2.5 px-3 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Printer size={15} /> Cetak Kunci Jawaban
              </button>
            </div>
          )}
        </div>

        <div className="lg:col-span-7 bg-slate-50 p-5 rounded-2xl border border-gray-200 min-h-[450px] flex flex-col items-center">
          {puzzleData ? (
            <>
              <div className="w-full flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-gray-200">
                <div>
                  <h3 className="text-lg font-extrabold text-gray-900">{puzzleData.title}</h3>
                  <p className="text-xs text-gray-600">Klik <strong>huruf pertama</strong> lalu klik <strong>huruf terakhir</strong> kata untuk mencoret!</p>
                </div>
                <div className="flex items-center gap-3 text-xs font-bold">
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-gray-300 flex items-center gap-1 text-gray-700">
                    <Clock size={14} className="text-indigo-600" /> {elapsedSec}s
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center gap-1 text-emerald-800">
                    <Trophy size={14} /> {foundWords.length}/{puzzleData.words.length}
                  </span>
                </div>
              </div>

              {foundWords.length === puzzleData.words.length && (
                <div className="w-full mb-4 p-3 rounded-xl bg-emerald-600 text-white text-center font-bold text-sm flex items-center justify-center gap-2 shadow">
                  <CheckCircle2 size={18} /> Hebat! Semua {puzzleData.words.length} kata ditemukan dalam {elapsedSec} detik!
                </div>
              )}

              <div
                className="grid gap-1 font-mono mx-auto select-none"
                style={{ gridTemplateColumns: `repeat(${puzzleData.gridSize}, minmax(0, ${puzzleData.gridSize > 16 ? 26 : 32}px))` }}
              >
                {puzzleData.grid.map((row, i) =>
                  row.map((cell, j) => {
                    const key = `${i}-${j}`;
                    const isStart = startCell && startCell[0] === i && startCell[1] === j;
                    const isFound = foundCellKeys.has(key);
                    return (
                      <button
                        type="button"
                        key={key}
                        onClick={() => handleCellClick(i, j)}
                        className={`flex items-center justify-center font-bold rounded-md border transition-all text-xs sm:text-sm ${
                          isStart
                            ? 'bg-amber-400 border-amber-700 text-black scale-110 shadow-md z-10'
                            : isFound
                            ? 'bg-emerald-500 border-emerald-700 text-white'
                            : 'bg-white border-gray-300 text-gray-900 hover:bg-indigo-100 hover:border-indigo-400'
                        }`}
                        style={{
                          width: puzzleData.gridSize > 16 ? 26 : 32,
                          height: puzzleData.gridSize > 16 ? 26 : 32,
                        }}
                      >
                        {cell}
                      </button>
                    );
                  })
                )}
              </div>

              <div className="mt-5 w-full p-4 bg-white rounded-xl border border-gray-200">
                <h4 className="font-bold text-xs text-gray-700 uppercase tracking-wider mb-2.5">Kata yang dicari:</h4>
                <div className="flex flex-wrap gap-2">
                  {puzzleData.words.map((w, i) => {
                    const done = foundWords.includes(w);
                    return (
                      <span
                        key={i}
                        className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                          done
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300 line-through opacity-70'
                            : 'bg-slate-100 text-gray-800 border-gray-300'
                        }`}
                      >
                        {w}
                      </span>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-400 py-20 flex flex-col items-center justify-center">
              <TypeIcon size={56} className="mb-3 opacity-40" />
              <p className="text-sm font-medium text-gray-500">Puzzle Word Search interaktif akan tampil di sini</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import ModelSelector from './ModelSelector';
import { GoogleGenAI, Type } from '../lib/genai';
import { educationLevels, phaseClassMap, subjectsByLevel } from '../constants';
import { useAuth } from '../AuthContext';
import { getWatermarkHtml } from '../utils/print';
import AIAssistedInput from './AIAssistedInput';
import AIAssistedTextarea from './AIAssistedTextarea';
import { FileText, Bot, Loader2, Sparkles, Printer } from 'lucide-react';

type WordClue = {
  word: string;
  clue: string;
};

type PlacedWord = WordClue & {
  row: number;
  col: number;
  direction: 'H' | 'V';
  number: number;
};

type GridCell = {
  char: string;
  number?: number;
};

export default function CrosswordGenerator() {
  const { profile } = useAuth();
  const [eduLevel, setEduLevel] = useState('sd');
  const [selectedModel, setSelectedModel] = React.useState<string>('openai');
  const [fase, setFase] = useState('A');
  const [kelas, setKelas] = useState('1');
  const [subject, setSubject] = useState('bahasa-indonesia');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const [title, setTitle] = useState('');
  const [inputText, setInputText] = useState('');
  const [puzzleData, setPuzzleData] = useState<{
    title: string;
    grid: (GridCell | null)[][];
    placedWords: PlacedWord[];
    minRow: number;
    maxRow: number;
    minCol: number;
    maxCol: number;
  } | null>(null);
  const [error, setError] = useState('');

  // Update fase, kelas, and subject when eduLevel changes
  useEffect(() => {
    const phases = phaseClassMap[eduLevel]?.phases || [];
    const firstPhase = phases[0]?.id || '';
    setFase(firstPhase);
    
    const subjects = subjectsByLevel[eduLevel] || [];
    setSubject(subjects[0]?.id || '');
  }, [eduLevel]);

  // Update kelas when fase changes
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

      const prompt = `Buatkan 15 pasang kata dan petunjuk (clue) untuk teka-teki silang edukatif.
Jenjang: ${jenjangLabel}
Fase: ${faseLabel}
Kelas: ${kelasLabel}
Mata Pelajaran: ${subjectLabel}
Topik/Judul: ${title || 'Umum'}

PENTING:
1. Kata (word) harus berupa satu kata tanpa spasi, hanya huruf A-Z.
2. Petunjuk (clue) harus jelas dan mendidik.
3. Berikan output HANYA dalam format JSON array of objects dengan struktur:
[
  { "word": "KATA", "clue": "Petunjuk untuk kata tersebut" },
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
                word: { type: Type.STRING, description: "Kata jawaban (tanpa spasi)" },
                clue: { type: Type.STRING, description: "Petunjuk teka-teki silang" }
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
          setTitle(`Teka Teki Silang: ${subjectLabel} Kelas ${kelasLabel}`);
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Terjadi kesalahan saat membuat kata dengan AI');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const generateCrossword = () => {
    setError('');
    const lines = inputText.split('\n').filter(line => line.trim() !== '');
    const wordsWithClues: WordClue[] = [];

    for (const line of lines) {
      const parts = line.split('-');
      if (parts.length >= 2) {
        const word = parts[0].trim().toUpperCase().replace(/[^A-Z]/g, '');
        const clue = parts.slice(1).join('-').trim();
        if (word && clue) {
          wordsWithClues.push({ word, clue });
        }
      }
    }

    if (wordsWithClues.length < 2) {
      setError('Masukkan minimal 2 kata dan petunjuk dengan format KATA - Petunjuk');
      return;
    }

    // Sort by length descending
    wordsWithClues.sort((a, b) => b.word.length - a.word.length);

    const GRID_SIZE = 100;
    const grid: (GridCell | null)[][] = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
    const placedWords: PlacedWord[] = [];

    const canPlace = (word: string, row: number, col: number, dir: 'H' | 'V') => {
      if (dir === 'H') {
        if (col < 0 || col + word.length >= GRID_SIZE) return false;
        // Check before and after
        if (col > 0 && grid[row][col - 1] !== null) return false;
        if (col + word.length < GRID_SIZE && grid[row][col + word.length] !== null) return false;

        for (let i = 0; i < word.length; i++) {
          const c = col + i;
          if (grid[row][c] !== null && grid[row][c]?.char !== word[i]) return false;
          // Check top and bottom if not intersecting
          if (grid[row][c] === null) {
            if (row > 0 && grid[row - 1][c] !== null) return false;
            if (row < GRID_SIZE - 1 && grid[row + 1][c] !== null) return false;
          }
        }
      } else {
        if (row < 0 || row + word.length >= GRID_SIZE) return false;
        // Check before and after
        if (row > 0 && grid[row - 1][col] !== null) return false;
        if (row + word.length < GRID_SIZE && grid[row + word.length][col] !== null) return false;

        for (let i = 0; i < word.length; i++) {
          const r = row + i;
          if (grid[r][col] !== null && grid[r][col]?.char !== word[i]) return false;
          // Check left and right if not intersecting
          if (grid[r][col] === null) {
            if (col > 0 && grid[r][col - 1] !== null) return false;
            if (col < GRID_SIZE - 1 && grid[r][col + 1] !== null) return false;
          }
        }
      }
      return true;
    };

    const placeWord = (wordObj: WordClue, row: number, col: number, dir: 'H' | 'V', num: number) => {
      for (let i = 0; i < wordObj.word.length; i++) {
        const r = dir === 'V' ? row + i : row;
        const c = dir === 'H' ? col + i : col;
        if (!grid[r][c]) {
          grid[r][c] = { char: wordObj.word[i] };
        }
      }
      grid[row][col]!.number = num;
      placedWords.push({ ...wordObj, row, col, direction: dir, number: num });
    };

    let wordNum = 1;
    // Place first word
    const first = wordsWithClues[0];
    const startRow = Math.floor(GRID_SIZE / 2);
    const startCol = Math.floor(GRID_SIZE / 2) - Math.floor(first.word.length / 2);
    placeWord(first, startRow, startCol, 'H', wordNum++);

    const unplaced: WordClue[] = [];

    for (let i = 1; i < wordsWithClues.length; i++) {
      const current = wordsWithClues[i];
      let bestPlacement = null;
      let maxIntersections = -1;

      for (const placed of placedWords) {
        for (let j = 0; j < current.word.length; j++) {
          const char = current.word[j];
          for (let k = 0; k < placed.word.length; k++) {
            if (placed.word[k] === char) {
              // Potential intersection
              const dir = placed.direction === 'H' ? 'V' : 'H';
              const r = placed.direction === 'H' ? placed.row - j : placed.row + k;
              const c = placed.direction === 'H' ? placed.col + k : placed.col - j;

              if (canPlace(current.word, r, c, dir)) {
                // Calculate intersections
                let intersections = 0;
                for (let l = 0; l < current.word.length; l++) {
                  const checkR = dir === 'V' ? r + l : r;
                  const checkC = dir === 'H' ? c + l : c;
                  if (grid[checkR][checkC] !== null) intersections++;
                }

                if (intersections > maxIntersections) {
                  maxIntersections = intersections;
                  bestPlacement = { r, c, dir };
                }
              }
            }
          }
        }
      }

      if (bestPlacement) {
        // Check if the starting cell already has a number
        let numToUse = wordNum;
        if (grid[bestPlacement.r][bestPlacement.c]?.number) {
          numToUse = grid[bestPlacement.r][bestPlacement.c]!.number!;
        } else {
          wordNum++;
        }
        placeWord(current, bestPlacement.r, bestPlacement.c, bestPlacement.dir, numToUse);
      } else {
        unplaced.push(current);
      }
    }

    if (placedWords.length === 0) {
      setError('Gagal membuat teka-teki silang. Coba kata-kata lain.');
      return;
    }

    // Find bounds
    let minR = GRID_SIZE, maxR = 0, minC = GRID_SIZE, maxC = 0;
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (grid[r][c] !== null) {
          if (r < minR) minR = r;
          if (r > maxR) maxR = r;
          if (c < minC) minC = c;
          if (c > maxC) maxC = c;
        }
      }
    }

    setPuzzleData({
      title: title || 'Teka Teki Silang',
      grid,
      placedWords,
      minRow: minR,
      maxRow: maxR,
      minCol: minC,
      maxCol: maxC
    });
  };

  const printPuzzle = () => {
    if (!puzzleData) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const { title, grid, placedWords, minRow, maxRow, minCol, maxCol } = puzzleData;

    let gridHtml = '<table style="border-collapse:collapse;margin:20px 0;">';
    for (let r = minRow; r <= maxRow; r++) {
      gridHtml += '<tr>';
      for (let c = minCol; c <= maxCol; c++) {
        const cell = grid[r][c];
        if (cell) {
          gridHtml += `<td style="width:30px;height:30px;border:2px solid black;position:relative;text-align:center;font-family:sans-serif;font-weight:bold;font-size:14px;">
            ${cell.number ? `<span style="position:absolute;top:2px;left:2px;font-size:10px;font-weight:normal;line-height:1;">${cell.number}</span>` : ''}
            <span style="color:transparent;">${cell.char}</span>
          </td>`;
        } else {
          gridHtml += '<td style="width:30px;height:30px;border:none;"></td>';
        }
      }
      gridHtml += '</tr>';
    }
    gridHtml += '</table>';

    // Answer Key Grid
    let answerGridHtml = '<table style="border-collapse:collapse;margin:20px 0;">';
    for (let r = minRow; r <= maxRow; r++) {
      answerGridHtml += '<tr>';
      for (let c = minCol; c <= maxCol; c++) {
        const cell = grid[r][c];
        if (cell) {
          answerGridHtml += `<td style="width:30px;height:30px;border:2px solid black;position:relative;text-align:center;font-family:sans-serif;font-weight:bold;font-size:14px;background-color:#f0f0f0;">
            ${cell.number ? `<span style="position:absolute;top:2px;left:2px;font-size:10px;font-weight:normal;line-height:1;">${cell.number}</span>` : ''}
            ${cell.char}
          </td>`;
        } else {
          answerGridHtml += '<td style="width:30px;height:30px;border:none;"></td>';
        }
      }
      answerGridHtml += '</tr>';
    }
    answerGridHtml += '</table>';

    const mendatar = placedWords.filter(w => w.direction === 'H').sort((a, b) => a.number - b.number);
    const menurun = placedWords.filter(w => w.direction === 'V').sort((a, b) => a.number - b.number);

    let cluesHtml = '<div style="display:flex;gap:40px;margin-top:20px;">';
    
    cluesHtml += '<div style="flex:1;">';
    cluesHtml += '<h3 style="border-bottom:2px solid black;padding-bottom:5px;">Mendatar</h3>';
    cluesHtml += '<ol style="list-style-type:none;padding:0;margin:0;">';
    mendatar.forEach(w => {
      cluesHtml += `<li style="margin-bottom:8px;display:flex;gap:10px;"><span style="font-weight:bold;min-width:20px;">${w.number}.</span> <span>${w.clue}</span></li>`;
    });
    cluesHtml += '</ol></div>';

    cluesHtml += '<div style="flex:1;">';
    cluesHtml += '<h3 style="border-bottom:2px solid black;padding-bottom:5px;">Menurun</h3>';
    cluesHtml += '<ol style="list-style-type:none;padding:0;margin:0;">';
    menurun.forEach(w => {
      cluesHtml += `<li style="margin-bottom:8px;display:flex;gap:10px;"><span style="font-weight:bold;min-width:20px;">${w.number}.</span> <span>${w.clue}</span></li>`;
    });
    cluesHtml += '</ol></div>';
    
    cluesHtml += '</div>';

    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]')).map(el => el.outerHTML).join('\n');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
          <title>${title}</title>
          <style>
              @page { size: A4; margin: 0; }
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #000; margin: 0; padding: 15mm; }
              .header { text-align: left; margin-bottom: 20px; background-color: #d4e157; padding: 15px; border-radius: 5px; }
              .header h1 { margin: 0 0 5px 0; font-size: 24px; }
              .header p { margin: 0; font-size: 16px; font-style: italic; }
              .page-break { page-break-before: always; }
              @media print {
                  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; padding: 15mm; }
                  .no-print { display: none; }
              }
              .watermark {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) rotate(-45deg);
                font-size: 5vw;
                color: rgba(0, 0, 0, 0.05);
                white-space: nowrap;
                pointer-events: none;
                z-index: -1;
                font-weight: bold;
                text-transform: uppercase;
              }
              .support-footer {
                margin-top: 40px;
                padding-top: 20px;
                border-top: 2px solid #eee;
                text-align: center;
                font-size: 11px;
                color: #666;
              }
              .support-links {
                margin-top: 8px;
                display: flex;
                justify-content: center;
                gap: 15px;
                font-weight: bold;
                color: #2563eb;
              }
          </style>
      
          ${styles}
          <style>
            td ul, .content-wrapper ul { list-style-type: disc !important; padding-left: 20px !important; margin-bottom: 8px !important; }
            td ol, .content-wrapper ol { list-style-type: decimal !important; padding-left: 20px !important; margin-bottom: 8px !important; }
            td p, .content-wrapper p { margin-bottom: 8px !important; }
            .html-content table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 10px; }
            .html-content th, .html-content td { border: 1px solid #cbd5e1; padding: 8px; }
            .html-content th { background-color: #f1f5f9; font-weight: bold; }
          </style></head>
      <body>
          <div class="watermark">PEMURYADI - MAJU PENDIDIKAN INDONESIA</div>
          <div class="header">
              <h1>Teka Teki Silang</h1>
              <p>${title}</p>
          </div>
          
          <div style="display:flex;flex-direction:column;align-items:center;">
            ${gridHtml}
          </div>
          
          ${cluesHtml}

          <div class="page-break"></div>

          <div class="header">
              <h1>Kunci Jawaban</h1>
              <p>${title}</p>
          </div>
          
          <div style="display:flex;flex-direction:column;align-items:center;">
            ${answerGridHtml}
          </div>
          
          ${(profile?.kepalaSekolah || profile?.nama || profile?.displayName) ? `<div style="margin-top: 40px; display: flex; justify-content: space-between; text-align: center; font-size: 12px; page-break-inside: avoid;">
              <div style="width: 45%;">
                  <p>Mengetahui,</p>
                  <p>Kepala Sekolah</p>
                  <br><br><br><br>
                  <p style="font-weight: bold; text-decoration: underline;">${profile?.kepalaSekolah || '................................'}</p>
                  <p>${profile?.jenisNipKepalaSekolah || 'NIP'}. ${profile?.nipKepalaSekolah || '................................'}</p>
              </div>
              <div style="width: 45%;">
                  <p>Dibuat pada, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  <p>Guru Pengampu</p>
                  <br><br><br><br>
                  <p style="font-weight: bold; text-decoration: underline;">${profile?.nama || profile?.displayName || '................................'}</p>
                  <p>${profile?.jenisNipGuru || 'NIP'}. ${profile?.nip || '................................'}</p>
              </div>
          </div>` : ''}
          
          <div class="support-footer">
              <p>Dokumen ini dihasilkan secara otomatis oleh <strong>Crossword Generator - Pemuryadi</strong></p>
              <p>Maju Pendidikan Indonesia @2026</p>
              <p style="margin-top: 10px; font-style: italic;">"Dukungan Anda sangat berarti bagi kami untuk terus mengembangkan platform ini secara gratis."</p>
              <div class="support-links">
                  <span>Saweria: saweria.co/pemuryadi</span>
                  <span>FB/IG/TikTok: @p.e.muryadi</span>
              </div>
          </div>
          
          ${getWatermarkHtml(profile?.role)}
          <script>
            window.onload = () => {
              setTimeout(() => {
                window.print();
              }, 500);
            };
          </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
          <FileText size={28} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Teka Teki Silang</h3>
          <p className="text-gray-600">Buat game teka teki silang edukatif</p>
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
              placeholder="Contoh: Ekosistem dan Lingkungan"
              className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Daftar Kata & Petunjuk</label>
            <p className="text-xs text-gray-600 mb-2">Format: <strong>KATA - Petunjuk</strong> (satu per baris)</p>
            <AIAssistedTextarea value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              contextPrompt={`Buatkan daftar kata dan petunjuk untuk Teka Teki Silang (Mata Pelajaran: ${subject}, Topik: ${title || 'Pendidikan'}). Format: KATA - Petunjuk. Contoh: EKOSISTEM - Hubungan timbal balik makhluk hidup.`}
              rows={10}
              placeholder="FOTOSINTESIS - Proses tumbuhan membuat makanan sendiri&#10;KARNIVORA - Hewan pemakan daging&#10;EKOSISTEM - Hubungan timbal balik antara makhluk hidup dan lingkungannya"
              className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-gray-900 font-mono text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors custom-scrollbar" />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button 
              onClick={generateCrossword}
              className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-sm "
            >
              Generate TTS
            </button>
            <button 
              onClick={printPuzzle}
              disabled={!puzzleData}
              className="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Printer size={20} /> Print PDF
            </button>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 shadow-sm rounded-xl p-4 min-h-[400px] flex items-center justify-center overflow-auto custom-scrollbar">
          {puzzleData ? (
            <div className="p-4 bg-white rounded-lg shadow-inner max-w-full overflow-auto">
              <table className="border-collapse mx-auto">
                <tbody>
                  {Array.from({ length: puzzleData.maxRow - puzzleData.minRow + 1 }).map((_, rIdx) => {
                    const r = puzzleData.minRow + rIdx;
                    return (
                      <tr key={r}>
                        {Array.from({ length: puzzleData.maxCol - puzzleData.minCol + 1 }).map((_, cIdx) => {
                          const c = puzzleData.minCol + cIdx;
                          const cell = puzzleData.grid[r][c];
                          return (
                            <td 
                              key={c} 
                              className={`w-8 h-8 md:w-10 md:h-10 ${cell ? 'border-2 border-gray-300 bg-white' : 'border-0 border-transparent'} relative text-center font-bold text-gray-900`}
                            >
                              {cell && cell.number && (
                                <span className="absolute top-0.5 left-0.5 text-[8px] md:text-[10px] font-normal leading-none text-gray-500">
                                  {cell.number}
                                </span>
                              )}
                              {cell && <span className="opacity-0 hover:opacity-100 transition-opacity cursor-help text-blue-600" title="Jawaban">{cell.char}</span>}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <p className="text-center text-xs text-gray-500 mt-4">Arahkan kursor ke kotak untuk melihat jawaban</p>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <div className="mb-4 opacity-50 flex justify-center text-gray-400">
                <FileText size={64} />
              </div>
              <p>Preview Teka Teki Silang akan muncul di sini</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

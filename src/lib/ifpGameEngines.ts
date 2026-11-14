// Hybrid IFP Game Engine Library (60fps Offline-Ready HTML5/Canvas/SVG Templates + Sandbox Guard)

export interface IfpQuestion {
  pertanyaan: string;
  opsi: string[];
  jawabanBenar: number; // index 0-3
  penjelasan?: string;
}

export interface IfpSimulationScenario {
  judul: string;
  situasi: string;
  opsi: {
    teks: string;
    dampak: number; // -20 to +25
    skor: number;
    umpanBalik: string;
  }[];
}

export interface IfpPuzzlePair {
  kiri: string;
  kanan: string;
}

export interface IfpGamePayload {
  judulGame: string;
  subjudul: string;
  temaWarna?: string; // hex e.g. #4f46e5
  namaBossAtauDunia?: string;
  parameterSimulasi?: string;
  soal: IfpQuestion[];
  simulasi?: IfpSimulationScenario[];
  puzzlePairs?: IfpPuzzlePair[];
}

export interface IfpEngineConfig {
  genre: string;
  topik: string;
  jenjang: string;
  difficulty: string;
  players: string[];
}

export function isSandboxGenre(genre: string): boolean {
  return genre === 'sandbox';
}

export function buildIfpJsonPrompt(cfg: IfpEngineConfig): string {
  const diffLabel =
    cfg.difficulty === 'easy'
      ? 'Mudah (Dasar)'
      : cfg.difficulty === 'hard'
      ? 'Sulit (HOTS / Analisis)'
      : cfg.difficulty === 'expert'
      ? 'Ahli (Kompleks & Menantang)'
      : 'Sedang (Aplikasi)';

  const totalSoal = Math.max(8, cfg.players.length * 3);

  return `Bertindaklah sebagai desainer game edukasi profesional. Buatlah konten game edukasi terstruktur dalam format JSON MURNI untuk topik "${cfg.topik}" jenjang ${cfg.jenjang} (Tingkat Kesulitan: ${diffLabel}, Genre: ${cfg.genre}).

Aturan Wajib:
1. Kembalikan HANYA JSON valid (tanpa markdown \`\`\`json, tanpa komentar, tanpa teks pengantar).
2. Semua pertanyaan, opsi, dan skenario harus akurat secara pedagogis, jelas, ramah anak ${cfg.jenjang}, dan bebas singkatan membingungkan.
3. Buat tepat ${totalSoal} item pada array "soal" (masing-masing 4 opsi jawaban A-D, dengan "jawabanBenar" berupa index integer 0, 1, 2, atau 3).
4. Jika genre adalah "simulation", isi juga array "simulasi" minimal 6 skenario keputusan beserta dampaknya (-25 sampai +25).
5. Jika genre adalah "puzzle", isi juga array "puzzlePairs" minimal 8 pasangan konsep ("kiri" dan "kanan" yang singkat & jelas, maks 4 kata per sisi).

Format JSON Wajib:
{
  "judulGame": "Judul Game Menarik",
  "subjudul": "Deskripsi singkat misi belajar",
  "temaWarna": "#4f46e5",
  "namaBossAtauDunia": "Nama Monster/Dunia/Arena sesuai topik",
  "parameterSimulasi": "Nama Indikator Utama (misal: Keseimbangan Ekosistem)",
  "soal": [
    {
      "pertanyaan": "Teks pertanyaan?",
      "opsi": ["Opsi A", "Opsi B", "Opsi C", "Opsi D"],
      "jawabanBenar": 0,
      "penjelasan": "Penjelasan singkat mengapa jawaban ini benar"
    }
  ],
  "simulasi": [
    {
      "judul": "Judul Kasus",
      "situasi": "Deskripsi kondisi nyata yang harus diputuskan pemain",
      "opsi": [
        { "teks": "Keputusan A", "dampak": 20, "skor": 100, "umpanBalik": "Dampak positif..." },
        { "teks": "Keputusan B", "dampak": -15, "skor": 20, "umpanBalik": "Dampak kurang tepat..." },
        { "teks": "Keputusan C", "dampak": 5, "skor": 60, "umpanBalik": "Dampak cukup baik..." }
      ]
    }
  ],
  "puzzlePairs": [
    { "kiri": "Istilah/Konsep 1", "kanan": "Pasangan/Definisi 1" }
  ]
}`;
}

export function wrapSandboxWithGuard(rawHtml: string): string {
  const guardScript = `
<script>
(function() {
  window.__ifpMuted = false;
  window.IFP_SDK = {
    playTone: function(freq, dur, type) {
      if (window.__ifpMuted) return;
      try {
        var Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        if (!window.__ifpCtx) window.__ifpCtx = new Ctx();
        var ctx = window.__ifpCtx;
        if (ctx.state === 'suspended') ctx.resume();
        var o = ctx.createOscillator();
        var g = ctx.createGain();
        o.type = type || 'sine';
        o.frequency.value = freq || 520;
        g.gain.setValueAtTime(0.08, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (dur || 0.15));
        o.connect(g); g.connect(ctx.destination);
        o.start(); o.stop(ctx.currentTime + (dur || 0.15));
      } catch(e) {}
    },
    correct: function() { this.playTone(660, 0.15, 'triangle'); },
    wrong: function() { this.playTone(200, 0.25, 'sawtooth'); }
  };

  window.addEventListener('error', function(ev) {
    try {
      window.parent.postMessage({
        type: 'IFP_GAME_ERROR',
        message: (ev.message || 'Runtime Error') + (ev.lineno ? ' (Line ' + ev.lineno + ')' : '')
      }, '*');
    } catch(e) {}
  });
  window.addEventListener('unhandledrejection', function(ev) {
    try {
      window.parent.postMessage({
        type: 'IFP_GAME_ERROR',
        message: 'Promise Error: ' + (ev.reason && ev.reason.message ? ev.reason.message : String(ev.reason))
      }, '*');
    } catch(e) {}
  });
  window.addEventListener('message', function(ev) {
    if (ev.data && ev.data.type === 'SET_MUTE') {
      window.__ifpMuted = !!ev.data.muted;
    }
  });
})();
</script>`;

  if (rawHtml.includes('</head>')) {
    return rawHtml.replace('</head>', guardScript + '\n</head>');
  }
  return guardScript + '\n' + rawHtml;
}

function escapeJsonForScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c').replace(/>/g, '\\u003e');
}

export function renderIfpEngineHtml(payload: IfpGamePayload, cfg: IfpEngineConfig): string {
  const genre = cfg.genre;
  const engineMode =
    genre === 'action' || genre === 'sports'
      ? 'RACING'
      : genre === 'adventure' || genre === 'battleroyale'
      ? 'ADVENTURE'
      : genre === 'puzzle'
      ? 'PUZZLE'
      : genre === 'simulation'
      ? 'SIMULATION'
      : 'RPG';

  const safeData = escapeJsonForScript({
    payload,
    players: cfg.players.length > 0 ? cfg.players : ['Pemain 1'],
    difficulty: cfg.difficulty,
    engineMode,
    topik: cfg.topik,
    jenjang: cfg.jenjang,
  });

  return `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
<title>${payload.judulGame || cfg.topik}</title>
<style>
  :root {
    --primary: ${payload.temaWarna || '#4f46e5'};
    --bg: #0f172a;
    --panel: #1e293b;
    --card: #334155;
    --text: #f8fafc;
    --muted: #94a3b8;
    --ok: #22c55e;
    --bad: #ef4444;
    --warn: #f59e0b;
  }
  * { box-sizing: border-box; user-select: none; -webkit-tap-highlight-color: transparent; }
  html, body {
    margin: 0; padding: 0; width: 100%; height: 100%;
    font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
    background: radial-gradient(circle at top, #1e1b4b, #0f172a 70%);
    color: var(--text); overflow: hidden;
  }
  .app { display: flex; flex-direction: column; height: 100%; max-width: 1120px; margin: 0 auto; padding: 14px; gap: 12px; }
  .topbar {
    display: flex; justify-content: space-between; align-items: center; gap: 12px;
    background: rgba(30,41,59,0.9); border: 1px solid rgba(255,255,255,0.12);
    border-radius: 16px; padding: 10px 16px; flex-wrap: wrap;
  }
  .title-wrap h1 { margin: 0; font-size: clamp(16px, 2.2vw, 22px); font-weight: 800; color: #fff; }
  .title-wrap p { margin: 2px 0 0; font-size: 12px; color: var(--muted); }
  .players-bar { display: flex; gap: 8px; flex-wrap: wrap; }
  .p-pill {
    padding: 6px 12px; border-radius: 12px; background: rgba(15,23,42,0.7);
    border: 2px solid transparent; font-size: 13px; font-weight: 700; display: flex; align-items: center; gap: 8px;
    transition: transform 0.2s, border-color 0.2s;
  }
  .p-pill.active { border-color: #fbbf24; background: rgba(251,191,36,0.15); transform: scale(1.04); }
  .p-score { background: rgba(255,255,255,0.12); padding: 2px 8px; border-radius: 99px; color: #fde68a; }
  .stage {
    flex: 1; background: rgba(30,41,59,0.85); border: 1px solid rgba(255,255,255,0.12);
    border-radius: 20px; padding: 16px; display: flex; flex-direction: column; gap: 14px; overflow-y: auto;
    position: relative;
  }
  .arena-visual {
    background: linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95));
    border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 12px;
    min-height: 150px; display: flex; align-items: center; justify-content: center; position: relative;
  }
  canvas { width: 100%; height: 150px; display: block; border-radius: 12px; }
  .question-box {
    background: rgba(15,23,42,0.75); border: 1px solid rgba(255,255,255,0.12);
    border-radius: 16px; padding: 16px; font-size: clamp(15px, 2vw, 19px); font-weight: 700; line-height: 1.45;
  }
  .options-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
  @media (max-width: 640px) { .options-grid { grid-template-columns: 1fr; } }
  .opt-btn {
    min-height: 58px; padding: 12px 16px; border-radius: 14px; border: 2px solid rgba(255,255,255,0.15);
    background: #1e293b; color: #fff; font-size: clamp(14px, 1.7vw, 16px); font-weight: 600;
    text-align: left; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; gap: 10px;
  }
  .opt-btn:hover:not(:disabled) { border-color: #818cf8; background: #312e81; transform: translateY(-2px); }
  .opt-btn:active:not(:disabled) { transform: scale(0.98); }
  .opt-btn.correct { background: #14532d !important; border-color: #22c55e !important; }
  .opt-btn.wrong { background: #7f1d1d !important; border-color: #ef4444 !important; }
  .badge-key {
    width: 30px; height: 30px; border-radius: 8px; background: rgba(255,255,255,0.12);
    display: inline-flex; align-items: center; justify-content: center; font-weight: 800; flex-shrink: 0;
  }
  .feedback-banner {
    padding: 12px 16px; border-radius: 12px; font-size: 14px; font-weight: 600;
    display: flex; justify-content: space-between; align-items: center; gap: 12px;
    animation: pop 0.2s ease-out;
  }
  .feedback-ok { background: rgba(34,197,94,0.18); border: 1px solid #22c55e; color: #bbf7d0; }
  .feedback-bad { background: rgba(239,68,68,0.18); border: 1px solid #ef4444; color: #fecaca; }
  .next-btn {
    padding: 10px 20px; border-radius: 10px; border: 0; background: #fbbf24; color: #0f172a;
    font-weight: 800; font-size: 14px; cursor: pointer; flex-shrink: 0;
  }
  .hp-wrap { width: 100%; display: flex; justify-content: space-between; gap: 20px; align-items: center; }
  .entity { flex: 1; text-align: center; }
  .bar-bg { height: 14px; background: #0f172a; border-radius: 99px; overflow: hidden; border: 1px solid rgba(255,255,255,0.15); margin-top: 6px; }
  .bar-fill { height: 100%; transition: width 0.35s ease; }
  .puzzle-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .puz-col { display: flex; flex-direction: column; gap: 10px; }
  .puz-card {
    min-height: 52px; padding: 12px; border-radius: 12px; border: 2px solid rgba(255,255,255,0.15);
    background: #1e293b; color: #fff; font-weight: 700; cursor: pointer; text-align: center; transition: 0.15s;
  }
  .puz-card.sel { border-color: #fbbf24; background: #422006; }
  .puz-card.done { border-color: #22c55e; background: #14532d; opacity: 0.55; cursor: default; }
  .podium { text-align: center; padding: 20px; display: flex; flex-direction: column; align-items: center; gap: 14px; }
  .leader-row {
    width: 100%; max-width: 480px; display: flex; justify-content: space-between; align-items: center;
    padding: 12px 18px; border-radius: 14px; background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.12);
    font-weight: 700; font-size: 16px;
  }
  @keyframes pop { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
</style>
</head>
<body>
<div class="app">
  <div class="topbar">
    <div class="title-wrap">
      <h1 id="g-title"></h1>
      <p id="g-sub"></p>
    </div>
    <div class="players-bar" id="players-bar"></div>
  </div>
  <div class="stage" id="stage"></div>
</div>

<script>
(function() {
  var CFG = ${safeData};
  var muted = false;
  var ctx = null;
  function playTone(freq, dur, type, delay) {
    if (muted) return;
    try {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      if (!ctx) ctx = new Ctx();
      if (ctx.state === 'suspended') ctx.resume();
      var t = ctx.currentTime + (delay || 0);
      var o = ctx.createOscillator();
      var g = ctx.createGain();
      o.type = type || 'sine';
      o.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0.09, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o.connect(g); g.connect(ctx.destination);
      o.start(t); o.stop(t + dur + 0.02);
    } catch(e) {}
  }
  var SFX = {
    click: function() { playTone(520, 0.06, 'sine', 0); },
    ok: function() { playTone(523, 0.1, 'triangle', 0); playTone(659, 0.12, 'triangle', 0.08); playTone(784, 0.18, 'triangle', 0.16); },
    bad: function() { playTone(220, 0.16, 'sawtooth', 0); playTone(165, 0.2, 'sawtooth', 0.12); },
    win: function() { [523,659,784,1046].forEach(function(n, i){ playTone(n, 0.22, 'triangle', i*0.1); }); }
  };

  window.addEventListener('message', function(ev) {
    if (!ev.data) return;
    if (ev.data.type === 'SET_MUTE') muted = !!ev.data.muted;
    if (ev.data.type === 'RESTART_GAME') initGame();
  });

  var state = {};

  function initGame() {
    var pNames = CFG.players;
    state = {
      players: pNames.map(function(n, i) { return { name: n, score: 0, pos: 0, hp: 100, color: ['#38bdf8','#f472b6','#34d399','#fbbf24'][i % 4] }; }),
      turn: 0,
      qIndex: 0,
      bossHp: 100,
      simMeter: 60,
      answered: false,
      finished: false,
      selLeft: null,
      matchedCount: 0,
      pairs: []
    };
    document.getElementById('g-title').textContent = CFG.payload.judulGame || CFG.topik;
    document.getElementById('g-sub').textContent = CFG.payload.subjudul || (CFG.jenjang + ' • ' + CFG.topik);
    renderPlayers();
    renderStage();
  }

  function renderPlayers() {
    var bar = document.getElementById('players-bar');
    bar.innerHTML = state.players.map(function(p, idx) {
      return '<div class="p-pill ' + (!state.finished && idx === state.turn ? 'active' : '') + '">' +
        '<span style="width:10px;height:10px;border-radius:50%;background:' + p.color + '"></span>' +
        '<span>' + p.name + '</span>' +
        '<span class="p-score">' + p.score + '</span>' +
      '</div>';
    }).join('');
  }

  function renderEndPodium() {
    state.finished = true;
    renderPlayers();
    SFX.win();
    var sorted = state.players.slice().sort(function(a, b) { return b.score - a.score; });
    var stage = document.getElementById('stage');
    stage.innerHTML = '<div class="podium">' +
      '<div style="font-size:48px;">🏆</div>' +
      '<h2 style="margin:0;font-size:26px;">Permainan Selesai!</h2>' +
      '<p style="margin:0;color:#94a3b8;">Papan Peringkat Akhir Kelas</p>' +
      sorted.map(function(p, i) {
        return '<div class="leader-row">' +
          '<span>' + (i === 0 ? '🥇 ' : i === 1 ? '🥈 ' : i === 2 ? '🥉 ' : (i+1)+'. ') + p.name + '</span>' +
          '<span style="color:#fbbf24;">' + p.score + ' Poin</span>' +
        '</div>';
      }).join('') +
      '<button class="next-btn" style="padding:14px 28px;font-size:16px;margin-top:8px;" onclick="window.__restartIfp()">Main Lagi 🔄</button>' +
    '</div>';
  }
  window.__restartIfp = initGame;

  function renderStage() {
    if (CFG.engineMode === 'PUZZLE' && CFG.payload.puzzlePairs && CFG.payload.puzzlePairs.length >= 4) {
      return renderPuzzleStage();
    }
    if (CFG.engineMode === 'SIMULATION' && CFG.payload.simulasi && CFG.payload.simulasi.length > 0) {
      return renderSimulationStage();
    }
    return renderQuizBasedStage();
  }

  function renderQuizBasedStage() {
    var soalList = CFG.payload.soal || [];
    if (state.qIndex >= soalList.length || (CFG.engineMode === 'RPG' && state.bossHp <= 0)) {
      return renderEndPodium();
    }
    var q = soalList[state.qIndex];
    var curPlayer = state.players[state.turn];
    var stage = document.getElementById('stage');

    var visualHtml = '';
    if (CFG.engineMode === 'RPG') {
      visualHtml = '<div class="arena-visual"><div class="hp-wrap">' +
        '<div class="entity"><div style="font-size:36px;">🛡️</div><div style="font-weight:800;">' + curPlayer.name + '</div>' +
        '<div class="bar-bg"><div class="bar-fill" style="width:' + curPlayer.hp + '%;background:#22c55e;"></div></div></div>' +
        '<div style="font-size:24px;font-weight:900;color:#fbbf24;">VS</div>' +
        '<div class="entity"><div style="font-size:36px;">👾</div><div style="font-weight:800;">' + (CFG.payload.namaBossAtauDunia || 'Penjaga Materi') + ' (' + state.bossHp + '%)</div>' +
        '<div class="bar-bg"><div class="bar-fill" style="width:' + state.bossHp + '%;background:#ef4444;"></div></div></div>' +
      '</div></div>';
    } else if (CFG.engineMode === 'RACING') {
      visualHtml = '<div class="arena-visual" style="padding:8px;"><canvas id="raceCanvas" width="900" height="140"></canvas></div>';
    } else {
      var nodes = soalList.map(function(_, idx) {
        var done = idx < state.qIndex;
        var cur = idx === state.qIndex;
        return '<div style="width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px;' +
          'background:' + (done ? '#22c55e' : cur ? '#fbbf24' : '#334155') + ';color:' + (cur ? '#0f172a' : '#fff') + ';border:2px solid rgba(255,255,255,0.2);">' +
          (done ? '✓' : (idx + 1)) + '</div>';
      }).join('');
      visualHtml = '<div class="arena-visual" style="flex-direction:column;gap:10px;">' +
        '<div style="font-size:13px;font-weight:700;color:#cbd5e1;">🗺️ Ekspedisi: ' + (CFG.payload.namaBossAtauDunia || CFG.topik) + '</div>' +
        '<div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;">' + nodes + '</div>' +
      '</div>';
    }

    var letters = ['A', 'B', 'C', 'D'];
    var optsHtml = (q.opsi || []).slice(0, 4).map(function(op, i) {
      return '<button class="opt-btn" id="opt-' + i + '" onclick="window.__pickOpt(' + i + ')">' +
        '<span class="badge-key">' + letters[i] + '</span><span>' + op + '</span></button>';
    }).join('');

    stage.innerHTML = visualHtml +
      '<div style="display:flex;justify-content:space-between;align-items:center;font-size:13px;color:#cbd5e1;">' +
        '<span>Giliran: <strong style="color:#fbbf24;">' + curPlayer.name + '</strong></span>' +
        '<span>Soal ' + (state.qIndex + 1) + ' / ' + soalList.length + '</span>' +
      '</div>' +
      '<div class="question-box">' + q.pertanyaan + '</div>' +
      '<div class="options-grid">' + optsHtml + '</div>' +
      '<div id="fb-slot"></div>';

    if (CFG.engineMode === 'RACING') drawRaceCanvas();
    state.answered = false;
  }

  function drawRaceCanvas() {
    var c = document.getElementById('raceCanvas');
    if (!c) return;
    var g = c.getContext('2d');
    var w = c.width, h = c.height;
    g.clearRect(0, 0, w, h);
    g.fillStyle = '#0f172a';
    g.fillRect(0, 0, w, h);
    // Finish line
    g.fillStyle = '#fbbf24';
    g.fillRect(w - 40, 8, 6, h - 16);
    var laneH = (h - 20) / state.players.length;
    state.players.forEach(function(p, i) {
      var y = 14 + i * laneH;
      g.strokeStyle = 'rgba(255,255,255,0.12)';
      g.beginPath(); g.moveTo(20, y + laneH/2); g.lineTo(w - 45, y + laneH/2); g.stroke();
      var maxScore = Math.max(300, (CFG.payload.soal || []).length * 40);
      var x = 24 + Math.min(1, p.score / maxScore) * (w - 90);
      g.fillStyle = p.color;
      g.beginPath(); g.arc(x, y + laneH/2, Math.min(14, laneH*0.35), 0, Math.PI*2); g.fill();
      g.fillStyle = '#fff'; g.font = 'bold 12px sans-serif';
      g.fillText(p.name, x + 18, y + laneH/2 + 4);
    });
  }

  window.__pickOpt = function(idx) {
    if (state.answered) return;
    state.answered = true;
    var q = CFG.payload.soal[state.qIndex];
    var isOk = idx === q.jawabanBenar;
    var p = state.players[state.turn];
    for (var i = 0; i < 4; i++) {
      var btn = document.getElementById('opt-' + i);
      if (!btn) continue;
      btn.disabled = true;
      if (i === q.jawabanBenar) btn.classList.add('correct');
      else if (i === idx && !isOk) btn.classList.add('wrong');
    }
    if (isOk) {
      SFX.ok();
      p.score += 100;
      state.bossHp = Math.max(0, state.bossHp - Math.ceil(100 / Math.max(1, (CFG.payload.soal || []).length)));
    } else {
      SFX.bad();
      p.hp = Math.max(15, p.hp - 15);
    }
    renderPlayers();
    if (CFG.engineMode === 'RACING') drawRaceCanvas();
    var fb = document.getElementById('fb-slot');
    fb.innerHTML = '<div class="feedback-banner ' + (isOk ? 'feedback-ok' : 'feedback-bad') + '">' +
      '<span>' + (isOk ? '✅ Benar! (+100 Poin) ' : '❌ Kurang tepat. ') + (q.penjelasan || '') + '</span>' +
      '<button class="next-btn" onclick="window.__nextTurn()">Lanjut ▶</button>' +
    '</div>';
  };

  window.__nextTurn = function() {
    SFX.click();
    state.qIndex++;
    state.turn = (state.turn + 1) % state.players.length;
    renderPlayers();
    renderStage();
  };

  function renderSimulationStage() {
    var sims = CFG.payload.simulasi || [];
    if (state.qIndex >= sims.length) return renderEndPodium();
    var sim = sims[state.qIndex];
    var p = state.players[state.turn];
    var stage = document.getElementById('stage');
    var meterColor = state.simMeter >= 65 ? '#22c55e' : state.simMeter >= 35 ? '#f59e0b' : '#ef4444';
    stage.innerHTML =
      '<div class="arena-visual" style="flex-direction:column;gap:8px;">' +
        '<div style="width:100%;display:flex;justify-content:space-between;font-weight:800;">' +
          '<span>🔬 ' + (CFG.payload.parameterSimulasi || 'Stabilitas Sistem') + '</span>' +
          '<span style="color:' + meterColor + ';">' + state.simMeter + '%</span>' +
        '</div>' +
        '<div class="bar-bg" style="width:100%;height:18px;"><div class="bar-fill" style="width:' + state.simMeter + '%;background:' + meterColor + ';"></div></div>' +
      '</div>' +
      '<div style="font-size:13px;color:#cbd5e1;">Pengambil Keputusan: <strong style="color:#fbbf24;">' + p.name + '</strong> (Skenario ' + (state.qIndex+1) + '/' + sims.length + ')</div>' +
      '<div class="question-box"><div style="font-size:14px;color:#93c5fd;margin-bottom:4px;">' + sim.judul + '</div>' + sim.situasi + '</div>' +
      '<div class="options-grid" style="grid-template-columns:1fr;">' +
        sim.opsi.map(function(o, i) {
          return '<button class="opt-btn" id="sim-' + i + '" onclick="window.__pickSim(' + i + ')">' +
            '<span class="badge-key">' + (i+1) + '</span><span>' + o.teks + '</span></button>';
        }).join('') +
      '</div><div id="fb-slot"></div>';
    state.answered = false;
  }

  window.__pickSim = function(idx) {
    if (state.answered) return;
    state.answered = true;
    var sim = CFG.payload.simulasi[state.qIndex];
    var chosen = sim.opsi[idx];
    state.simMeter = Math.max(0, Math.min(100, state.simMeter + (chosen.dampak || 0)));
    state.players[state.turn].score += (chosen.skor || 50);
    if ((chosen.dampak || 0) >= 0) SFX.ok(); else SFX.bad();
    renderPlayers();
    document.getElementById('fb-slot').innerHTML = '<div class="feedback-banner ' + ((chosen.dampak || 0) >= 0 ? 'feedback-ok' : 'feedback-bad') + '">' +
      '<span>' + chosen.umpanBalik + ' (Indikator ' + (chosen.dampak >= 0 ? '+' : '') + chosen.dampak + '%, +' + chosen.skor + ' Poin)</span>' +
      '<button class="next-btn" onclick="window.__nextTurn()">Lanjut ▶</button></div>';
  };

  function renderPuzzleStage() {
    if (state.pairs.length === 0) {
      var raw = (CFG.payload.puzzlePairs || []).slice(0, 8);
      state.pairs = raw.map(function(pr, idx) { return { id: idx, left: pr.kiri, right: pr.kanan, matched: false }; });
      state.shuffledRight = state.pairs.slice().sort(function() { return Math.random() - 0.5; });
    }
    if (state.matchedCount >= state.pairs.length) return renderEndPodium();
    var p = state.players[state.turn];
    var stage = document.getElementById('stage');
    stage.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:center;font-size:14px;">' +
        '<span>🧩 Giliran: <strong style="color:#fbbf24;">' + p.name + '</strong> — Pilih pasangan konsep yang cocok!</span>' +
        '<span>Cocok: ' + state.matchedCount + ' / ' + state.pairs.length + '</span>' +
      '</div>' +
      '<div class="puzzle-grid">' +
        '<div class="puz-col">' + state.pairs.map(function(item) {
          return '<button class="puz-card ' + (item.matched ? 'done' : state.selLeft === item.id ? 'sel' : '') + '" ' +
            (item.matched ? 'disabled' : 'onclick="window.__pickLeft(' + item.id + ')"') + '>' + item.left + '</button>';
        }).join('') + '</div>' +
        '<div class="puz-col">' + state.shuffledRight.map(function(item) {
          return '<button class="puz-card ' + (item.matched ? 'done' : '') + '" ' +
            (item.matched ? 'disabled' : 'onclick="window.__pickRight(' + item.id + ')"') + '>' + item.right + '</button>';
        }).join('') + '</div>' +
      '</div><div id="fb-slot"></div>';
  }

  window.__pickLeft = function(id) {
    SFX.click();
    state.selLeft = id;
    renderPuzzleStage();
  };
  window.__pickRight = function(id) {
    if (state.selLeft === null) return;
    if (state.selLeft === id) {
      SFX.ok();
      state.pairs.forEach(function(it) { if (it.id === id) it.matched = true; });
      state.matchedCount++;
      state.players[state.turn].score += 100;
    } else {
      SFX.bad();
    }
    state.selLeft = null;
    state.turn = (state.turn + 1) % state.players.length;
    renderPlayers();
    renderPuzzleStage();
  };

  initGame();
})();
</script>
</body>
</html>`;
}

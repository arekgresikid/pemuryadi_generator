import { universalPrint, getWatermarkHtml } from '../utils/print';

export type MiniGamePrintMode = 'memory' | 'matching' | 'fill-blanks' | 'unscramble';

function parsePairs(inputText: string): { left: string; right: string }[] {
  return inputText
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.includes('-'))
    .map(l => {
      const idx = l.indexOf('-');
      return {
        left: l.slice(0, idx).trim(),
        right: l.slice(idx + 1).trim(),
      };
    })
    .filter(p => p.left && p.right);
}

function scrambleWord(word: string): string {
  const arr = word.toUpperCase().split('');
  if (arr.length <= 1) return word.toUpperCase();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  const joined = arr.join('');
  return joined === word.toUpperCase() ? arr.reverse().join('') : joined;
}

export function printMiniGameWorksheet(
  mode: MiniGamePrintMode,
  title: string,
  inputText: string,
  profile: any,
  withKey: boolean
): boolean {
  const pairs = parsePairs(inputText);
  if (pairs.length === 0) return false;

  const docTitle = title || 'Lembar Aktivitas Permainan';
  let bodyHtml = '';

  const headerHtml = `
    <div style="border-bottom:2px solid #000;padding-bottom:8px;margin-bottom:14px;display:flex;justify-content:space-between;align-items:flex-end;">
      <div>
        <h1 style="margin:0;font-size:19px;">${docTitle} ${withKey ? '(KUNCI JAWABAN)' : ''}</h1>
        <p style="margin:3px 0 0;font-size:12px;color:#334155;">Lembar Aktivitas Belajar Interaktif</p>
      </div>
      ${
        !withKey
          ? `<div style="font-size:12px;text-align:right;line-height:1.6;">
              Nama: .........................................<br/>
              Kelas: .................... &nbsp; Tanggal: ....................
            </div>`
          : ''
      }
    </div>
  `;

  if (mode === 'matching') {
    const shuffledRight = pairs
      .map((p, idx) => ({ text: p.right, origIdx: idx }))
      .sort((a, b) => a.text.localeCompare(b.text));

    bodyHtml = `
      <p style="font-size:13px;margin-bottom:12px;"><strong>Petunjuk:</strong> Tarik garis atau tuliskan huruf pasangan yang tepat pada kolom jawaban di tengah.</p>
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <thead>
          <tr style="background:#f1f5f9;">
            <th style="width:6%;text-align:center;">No</th>
            <th style="width:38%;">Pernyataan / Istilah</th>
            <th style="width:14%;text-align:center;">Pasangan</th>
            <th style="width:42%;">Pilihan Jawaban</th>
          </tr>
        </thead>
        <tbody>
          ${pairs
            .map((p, i) => {
              const letter = String.fromCharCode(65 + i);
              const rightItem = shuffledRight[i];
              const correctLetter = String.fromCharCode(
                65 + shuffledRight.findIndex(r => r.origIdx === i)
              );
              return `
                <tr>
                  <td style="text-align:center;">${i + 1}</td>
                  <td><strong>${p.left}</strong></td>
                  <td style="text-align:center;font-weight:bold;">${withKey ? correctLetter : '( ...... )'}</td>
                  <td><strong>${letter}.</strong> ${rightItem.text}</td>
                </tr>
              `;
            })
            .join('')}
        </tbody>
      </table>
    `;
  } else if (mode === 'fill-blanks') {
    bodyHtml = `
      <p style="font-size:13px;margin-bottom:12px;"><strong>Petunjuk:</strong> Lengkapilah kalimat rumpang di bawah ini dengan jawaban yang tepat.</p>
      <div style="margin-bottom:14px;padding:10px;border:1px dashed #64748b;background:#f8fafc;font-size:12px;">
        <strong>Bank Kata:</strong> ${pairs
          .map(p => p.left)
          .sort()
          .join(' &nbsp;|&nbsp; ')}
      </div>
      <ol style="font-size:13px;line-height:2;padding-left:20px;">
        ${pairs
          .map(p => {
            const filled = p.right.replace(
              /___+/g,
              withKey
                ? `<strong style="text-decoration:underline;color:#15803d;">${p.left}</strong>`
                : '________________________'
            );
            return `<li style="margin-bottom:8px;">${filled}</li>`;
          })
          .join('')}
      </ol>
    `;
  } else if (mode === 'unscramble') {
    bodyHtml = `
      <p style="font-size:13px;margin-bottom:12px;"><strong>Petunjuk:</strong> Susunlah huruf-huruf acak berikut menjadi kata yang benar sesuai petunjuknya.</p>
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <thead>
          <tr style="background:#f1f5f9;">
            <th style="width:7%;text-align:center;">No</th>
            <th style="width:26%;">Huruf Acak</th>
            <th style="width:42%;">Petunjuk</th>
            <th style="width:25%;">Jawaban</th>
          </tr>
        </thead>
        <tbody>
          ${pairs
            .map(
              (p, i) => `
              <tr>
                <td style="text-align:center;">${i + 1}</td>
                <td style="font-family:monospace;font-weight:bold;letter-spacing:2px;">${scrambleWord(p.left)}</td>
                <td>${p.right}</td>
                <td style="font-weight:bold;color:${withKey ? '#15803d' : '#000'};">${withKey ? p.left.toUpperCase() : ''}</td>
              </tr>
            `
            )
            .join('')}
        </tbody>
      </table>
    `;
  } else {
    // memory cards cut-out & study table
    bodyHtml = `
      <p style="font-size:13px;margin-bottom:12px;"><strong>Petunjuk:</strong> ${
        withKey
          ? 'Daftar pasangan konsep Memory Matrix (Pegangan Guru).'
          : 'Gunting kartu di bawah ini untuk bermain mencocokkan pasangan konsep di meja kelompok!'
      }</p>
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;font-size:12px;">
        ${pairs
          .map(
            (p, i) => `
            <div style="border:1.5px dashed #334155;padding:10px;border-radius:6px;">
              <strong>Kartu ${i + 1}A:</strong> ${p.left}
            </div>
            <div style="border:1.5px dashed #334155;padding:10px;border-radius:6px;background:#f8fafc;">
              <strong>${withKey ? `Pasangan ${i + 1}B` : 'Kartu Pasangan'}:</strong> ${p.right}
            </div>
          `
          )
          .join('')}
      </div>
    `;
  }

  universalPrint(
    `<div style="font-family:Arial,sans-serif;color:#000;">${headerHtml}${bodyHtml}${getWatermarkHtml(profile)}</div>`,
    `${docTitle}${withKey ? ' - Kunci' : ''}`
  );
  return true;
}

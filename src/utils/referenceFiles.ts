import { extractTextFromPDF } from './pdf';

export type ReferenceFile = {
  id: string;
  name: string;
  kind: 'image' | 'text';
  /** Teks terstruktur hasil ekstraksi (PDF/Word/Excel/TXT) */
  text?: string;
  /** Base64 tanpa prefix (khusus gambar) */
  base64?: string;
  mimeType?: string;
  /** Apakah isi teks terpotong karena melebihi batas karakter */
  truncated?: boolean;
};

export const REF_MAX_FILES = 3;
export const REF_MAX_BYTES = 5 * 1024 * 1024;
export const REF_MAX_CHARS = 25000;
export const REF_ACCEPT = '.jpg,.jpeg,.png,.pdf,.docx,.xlsx,.txt';

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
    reader.onerror = () => reject(new Error('Gagal membaca file.'));
    reader.readAsDataURL(file);
  });

/**
 * Konversi HTML hasil mammoth (.docx) ke teks Markdown terstruktur agar
 * heading, daftar bernomor, dan tabel dari file Word tetap utuh.
 */
const htmlToStructuredMarkdown = (html: string): string => {
  if (typeof DOMParser === 'undefined') {
    return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const blocks: string[] = [];

  const serializeNode = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || '';
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return '';
    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();

    if (tag === 'br') return '\n';

    if (tag === 'table') {
      const rows = Array.from(el.querySelectorAll('tr'));
      const mdRows: string[] = [];
      rows.forEach((tr, rIdx) => {
        const cells = Array.from(tr.querySelectorAll('th, td')).map((c) =>
          (c.textContent || '').replace(/\s+/g, ' ').replace(/\|/g, '/').trim()
        );
        if (cells.some((c) => c.length > 0)) {
          mdRows.push(`| ${cells.join(' | ')} |`);
          if (rIdx === 0) {
            mdRows.push(`| ${cells.map(() => '---').join(' | ')} |`);
          }
        }
      });
      return mdRows.length ? `\n${mdRows.join('\n')}\n` : '';
    }

    if (tag === 'ul' || tag === 'ol') {
      const items = Array.from(el.children)
        .filter((c) => c.tagName.toLowerCase() === 'li')
        .map((li, idx) => {
          const txt = (li.textContent || '').replace(/\s+/g, ' ').trim();
          return tag === 'ol' ? `${idx + 1}. ${txt}` : `- ${txt}`;
        })
        .filter((line) => line.length > 2);
      return items.length ? `\n${items.join('\n')}\n` : '';
    }

    if (/^h[1-6]$/.test(tag)) {
      const level = Number(tag[1]);
      const txt = (el.textContent || '').replace(/\s+/g, ' ').trim();
      return txt ? `\n${'#'.repeat(level)} ${txt}\n` : '';
    }

    if (tag === 'p' || tag === 'div') {
      const inner = Array.from(el.childNodes).map(serializeNode).join('').trim();
      return inner ? `\n${inner}\n` : '';
    }

    return Array.from(el.childNodes).map(serializeNode).join('');
  };

  Array.from(doc.body.childNodes).forEach((child) => {
    const out = serializeNode(child).trim();
    if (out) blocks.push(out);
  });

  return blocks.join('\n\n').replace(/\n{3,}/g, '\n\n').trim();
};

export const processReferenceFile = async (file: File): Promise<ReferenceFile> => {
  if (file.size > REF_MAX_BYTES) throw new Error(`${file.name}: ukuran melebihi 5 MB.`);
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  if (ext === 'jpg' || ext === 'jpeg' || ext === 'png') {
    const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';
    return { id, name: file.name, kind: 'image', base64: await fileToBase64(file), mimeType };
  }
  if (ext === 'pdf') {
    const text = await extractTextFromPDF(file);
    return {
      id,
      name: file.name,
      kind: 'text',
      text: text.slice(0, REF_MAX_CHARS),
      truncated: text.length > REF_MAX_CHARS,
    };
  }
  if (ext === 'docx') {
    const mammoth: any = await import('mammoth');
    const arrayBuffer = await file.arrayBuffer();
    const convertToHtml = mammoth.convertToHtml || mammoth.default?.convertToHtml;
    const extractRawText = mammoth.extractRawText || mammoth.default?.extractRawText;
    let structured = '';
    if (typeof convertToHtml === 'function') {
      const htmlRes = await convertToHtml({ arrayBuffer });
      structured = htmlToStructuredMarkdown(String(htmlRes?.value || ''));
    }
    if (!structured && typeof extractRawText === 'function') {
      const rawRes = await extractRawText({ arrayBuffer });
      structured = String(rawRes?.value || '').trim();
    }
    if (!structured) {
      throw new Error(`${file.name}: isi dokumen Word kosong atau hanya berisi gambar.`);
    }
    return {
      id,
      name: file.name,
      kind: 'text',
      text: structured.slice(0, REF_MAX_CHARS),
      truncated: structured.length > REF_MAX_CHARS,
    };
  }
  if (ext === 'xlsx') {
    const XLSX = await import('xlsx');
    const wb = XLSX.read(await file.arrayBuffer(), { type: 'array' });
    const sheetTexts = wb.SheetNames.map((sheetName) => {
      const rows = XLSX.utils.sheet_to_json<any[]>(wb.Sheets[sheetName], { header: 1, defval: '' });
      const cleanedRows = rows
        .map((row) => {
          const cells = (Array.isArray(row) ? row : []).map((v) =>
            String(v ?? '').replace(/\s+/g, ' ').replace(/\|/g, '/').trim()
          );
          while (cells.length > 0 && cells[cells.length - 1] === '') cells.pop();
          return cells;
        })
        .filter((cells) => cells.some((c) => c.length > 0));

      if (cleanedRows.length === 0) return '';
      const maxCols = Math.max(...cleanedRows.map((r) => r.length));
      const mdLines: string[] = [];
      cleanedRows.forEach((r, idx) => {
        const padded = [...r];
        while (padded.length < maxCols) padded.push('');
        mdLines.push(`| ${padded.join(' | ')} |`);
        if (idx === 0) {
          mdLines.push(`| ${padded.map(() => '---').join(' | ')} |`);
        }
      });
      return `## Sheet: ${sheetName}\n${mdLines.join('\n')}`;
    }).filter(Boolean);

    const text = sheetTexts.join('\n\n').trim();
    if (!text) {
      throw new Error(`${file.name}: file Excel tidak memiliki data sel yang terbaca.`);
    }
    return {
      id,
      name: file.name,
      kind: 'text',
      text: text.slice(0, REF_MAX_CHARS),
      truncated: text.length > REF_MAX_CHARS,
    };
  }
  if (ext === 'txt') {
    const text = (await file.text()).trim();
    if (!text) throw new Error(`${file.name}: file teks kosong.`);
    return {
      id,
      name: file.name,
      kind: 'text',
      text: text.slice(0, REF_MAX_CHARS),
      truncated: text.length > REF_MAX_CHARS,
    };
  }
  if (ext === 'doc' || ext === 'xls') {
    throw new Error(`${file.name}: format Office lama (.${ext}) belum didukung. Simpan ulang sebagai .${ext}x atau .pdf.`);
  }
  throw new Error(`${file.name}: format tidak didukung (gunakan JPG, PNG, PDF, DOCX, XLSX, atau TXT).`);
};

/**
 * Bangun `contents` untuk AI dengan menempatkan dokumen lampiran di AWAL prompt
 * sebagai sumber otoritatif utama agar tidak tertimpa data default / template bawaan.
 */
export const buildContentsWithReferences = (prompt: string, refs: ReferenceFile[]): string | any[] => {
  if (refs.length === 0) return prompt;
  const textRefs = refs.filter((r) => r.kind === 'text' && r.text?.trim());
  const imgRefs = refs.filter((r) => r.kind === 'image' && r.base64);

  let referenceHeader = '';
  if (textRefs.length > 0 || imgRefs.length > 0) {
    referenceHeader += `=== DOKUMEN LAMPIRAN PENGGUNA (SUMBER OTORITATIF UTAMA) ===\n`;
    referenceHeader += `ATURAN PRIORITAS MUTLAK LAMPIRAN:\n`;
    referenceHeader += `1. Isi dokumen lampiran di bawah ini adalah SUMBER UTAMA materi, konsep, data, angka, istilah, dan acuan struktur.\n`;
    referenceHeader += `2. WAJIB menyusun seluruh butir/konten berdasarkan substansi dokumen lampiran ini. DILARANG mengarang topik di luar lampiran atau menimpa isi lampiran dengan data CP/kurikulum bawaan yang tidak selaras.\n`;
    referenceHeader += `3. Jika lampiran memuat tabel, daftar kompetensi, kisi-kisi, bacaan, atau pola struktur tertentu, pertahankan ketepatan substansi dan alurnya.\n`;
    textRefs.forEach((r) => {
      referenceHeader += `\n--- FILE LAMPIRAN: ${r.name}${r.truncated ? ' (dipotong pada 25.000 karakter pertama)' : ''} ---\n${r.text}\n`;
    });
    if (imgRefs.length > 0) {
      referenceHeader += `\n--- GAMBAR LAMPIRAN (${imgRefs.map((r) => r.name).join(', ')}) ---\nPeriksa secara cermat seluruh teks, tabel, diagram, dan angka yang tampak pada gambar terlampir sebagai sumber utama.\n`;
    }
    referenceHeader += `=== AKHIR DOKUMEN LAMPIRAN ===\n\n`;
  }

  const fullPrompt = `${referenceHeader}${prompt}`;
  if (imgRefs.length === 0) return fullPrompt;
  return [fullPrompt, ...imgRefs.map((r) => ({ inlineData: { mimeType: r.mimeType, data: r.base64 } }))];
};

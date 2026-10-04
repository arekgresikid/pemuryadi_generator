import { extractTextFromPDF } from './pdf';

export type ReferenceFile = {
  id: string;
  name: string;
  kind: 'image' | 'text';
  /** Teks hasil ekstraksi (PDF/Word/Excel) */
  text?: string;
  /** Base64 tanpa prefix (khusus gambar) */
  base64?: string;
  mimeType?: string;
};

export const REF_MAX_FILES = 3;
export const REF_MAX_BYTES = 5 * 1024 * 1024;
export const REF_MAX_CHARS = 15000;
export const REF_ACCEPT = '.jpg,.jpeg,.pdf,.docx,.xlsx';

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
    reader.onerror = () => reject(new Error('Gagal membaca file.'));
    reader.readAsDataURL(file);
  });

export const processReferenceFile = async (file: File): Promise<ReferenceFile> => {
  if (file.size > REF_MAX_BYTES) throw new Error(`${file.name}: ukuran melebihi 5 MB.`);
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  if (ext === 'jpg' || ext === 'jpeg') {
    return { id, name: file.name, kind: 'image', base64: await fileToBase64(file), mimeType: 'image/jpeg' };
  }
  if (ext === 'pdf') {
    const text = await extractTextFromPDF(file);
    return { id, name: file.name, kind: 'text', text: text.slice(0, REF_MAX_CHARS) };
  }
  if (ext === 'docx') {
    const mammoth: any = await import('mammoth');
    const result = await (mammoth.extractRawText || mammoth.default.extractRawText)({ arrayBuffer: await file.arrayBuffer() });
    return { id, name: file.name, kind: 'text', text: String(result.value || '').slice(0, REF_MAX_CHARS) };
  }
  if (ext === 'xlsx') {
    const XLSX = await import('xlsx');
    const wb = XLSX.read(await file.arrayBuffer(), { type: 'array' });
    const text = wb.SheetNames.map(n => `# Sheet: ${n}\n${XLSX.utils.sheet_to_csv(wb.Sheets[n])}`).join('\n\n');
    return { id, name: file.name, kind: 'text', text: text.slice(0, REF_MAX_CHARS) };
  }
  throw new Error(`${file.name}: format tidak didukung (hanya JPG, PDF, DOCX, XLSX).`);
};

/** Bangun `contents` untuk AI; kembali ke string biasa bila tidak ada referensi. */
export const buildContentsWithReferences = (prompt: string, refs: ReferenceFile[]): string | any[] => {
  if (refs.length === 0) return prompt;
  const textRefs = refs.filter(r => r.kind === 'text' && r.text?.trim());
  const imgRefs = refs.filter(r => r.kind === 'image');
  let fullPrompt = prompt;
  if (textRefs.length > 0 || imgRefs.length > 0) {
    fullPrompt += `\n\nMATERI REFERENSI DARI GURU (jadikan sumber utama materi soal, jangan keluar dari cakupan ini):\n`;
    textRefs.forEach(r => { fullPrompt += `\n--- ${r.name} ---\n${r.text}\n`; });
    if (imgRefs.length > 0) fullPrompt += `\n(Gambar terlampir: ${imgRefs.map(r => r.name).join(', ')})\n`;
  }
  if (imgRefs.length === 0) return fullPrompt;
  return [fullPrompt, ...imgRefs.map(r => ({ inlineData: { mimeType: r.mimeType, data: r.base64 } }))];
};

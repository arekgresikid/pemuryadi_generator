import * as pdfjsLib from 'pdfjs-dist';

// Gunakan worker lokal dari bundle pdfjs-dist v5 (.mjs) agar tidak 404 di CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

/**
 * Extracts structured text from a PDF file while preserving line breaks,
 * paragraph spacing, and basic tabular column separation.
 * @param file The PDF file to extract text from
 * @returns A promise that resolves to the extracted text
 */
export const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    const pages: string[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();

      type PositionedItem = { str: string; x: number; y: number; width: number };
      const rawItems: PositionedItem[] = (textContent.items as any[])
        .filter((item: any) => typeof item?.str === 'string' && item.str.length > 0)
        .map((item: any) => ({
          str: item.str,
          x: Array.isArray(item.transform) ? Number(item.transform[4] || 0) : 0,
          y: Array.isArray(item.transform) ? Number(item.transform[5] || 0) : 0,
          width: Number(item.width || 0),
        }));

      // Kelompokkan item ke dalam baris berdasarkan koordinat Y (toleransi 3pt)
      const lines: { y: number; items: PositionedItem[] }[] = [];
      for (const item of rawItems) {
        const existingLine = lines.find((line) => Math.abs(line.y - item.y) <= 3);
        if (existingLine) {
          existingLine.items.push(item);
        } else {
          lines.push({ y: item.y, items: [item] });
        }
      }

      // Urutkan baris dari atas ke bawah (Y besar ke kecil pada koordinat PDF)
      lines.sort((a, b) => b.y - a.y);

      const pageLines: string[] = [];
      for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
        const line = lines[lineIdx];
        line.items.sort((a, b) => a.x - b.x);

        let lineStr = '';
        for (let k = 0; k < line.items.length; k++) {
          const curr = line.items[k];
          if (k > 0) {
            const prev = line.items[k - 1];
            const gap = curr.x - (prev.x + prev.width);
            if (gap > 22) {
              // Jarak kolom lebar (indikasi tabel/kolom terpisah)
              lineStr += ' | ';
            } else if (gap > 1.5 && !lineStr.endsWith(' ') && !curr.str.startsWith(' ')) {
              lineStr += ' ';
            }
          }
          lineStr += curr.str;
        }

        const trimmed = lineStr.replace(/[ \t]+/g, ' ').trim();
        if (trimmed) {
          if (lineIdx > 0 && Math.abs(lines[lineIdx - 1].y - line.y) > 18) {
            pageLines.push('');
          }
          pageLines.push(trimmed);
        }
      }

      const pageText = pageLines.join('\n').trim();
      if (pageText) {
        pages.push(pdf.numPages > 1 ? `[Halaman ${i}]\n${pageText}` : pageText);
      }
    }

    const fullText = pages.join('\n\n').trim();
    if (!fullText) {
      throw new Error(
        'PDF tidak memiliki teks yang dapat diekstrak (kemungkinan hasil scan/gambar). Silakan unggah halaman sebagai gambar JPG/PNG.'
      );
    }
    return fullText;
  } catch (error: any) {
    console.error('Error extracting text from PDF:', error);
    if (error?.message && error.message.includes('PDF tidak memiliki teks')) {
      throw error;
    }
    throw new Error('Gagal membaca file PDF. Pastikan file tidak korup atau terproteksi sandi.');
  }
};

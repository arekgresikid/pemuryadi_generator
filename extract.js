import fs from 'fs';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

async function extractText() {
  console.log('Loading PDF...');
  const loadingTask = pdfjsLib.getDocument('C:\\Users\\ASUS\\.gemini\\antigravity-ide\\scratch\\panduan-kurikulum-berbasis-cinta.pdf');
  const pdf = await loadingTask.promise;
  console.log(`PDF Loaded. Total pages: ${pdf.numPages}`);
  
  let text = '';
  
  for (let i = 72; i <= 90 && i <= pdf.numPages; i++) {
    console.log(`Extracting page ${i}...`);
    try {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      let lastY = null;
      let pageText = '';
      for (const item of content.items) {
        if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
          pageText += '\n';
        }
        pageText += item.str + ' ';
        lastY = item.transform[5];
      }
      text += `\n\n--- PAGE ${i} ---\n\n` + pageText;
    } catch (err) {
      console.error(`Error on page ${i}:`, err);
    }
  }
  
  fs.writeFileSync('C:\\Users\\ASUS\\.gemini\\antigravity-ide\\scratch\\extracted_pages.txt', text);
  console.log('Extraction complete! Saved to C:\\Users\\ASUS\\.gemini\\antigravity-ide\\scratch\\extracted_pages.txt');
}

extractText().catch(console.error);

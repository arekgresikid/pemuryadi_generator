const { marked } = require('marked'); 
const text = '## Ringkasan Materi Ajar ### Tujuan Pembelajaran Pada akhir pembelajaran, peserta didik Fase A (kelas I) mampu: 1. Menjelaskan secara sederhana bahwa makhluk hidup memerlukan energi. 2. Mengidentifikasi bahwa energi dapat dihasilkan pada kondisi tanpa oksigen melalui **respirasi sel tanpa oksigen** (konsep sederhana yang disampaikan secara bertahap sesuai usia). 3. Membaca dan membuat **grafik lembap** sederhana dari data pengamatan.'; 
const repairMarkdown = (text) => { 
  if (!text) return ''; 
  return text
    .replace(/(#{1,6})\s*/g, '\n\n$1 ')
    .replace(/(\d+\.)\s*/g, '\n\n$1 ')
    .replace(/-\s+/g, '\n\n- ')
    .replace(/\n{3,}/g, '\n\n')
    .trim(); 
}; 
console.log('REPAIRED:\n' + JSON.stringify(repairMarkdown(text))); 
console.log('\nMARKED:\n' + marked.parse(repairMarkdown(text)));

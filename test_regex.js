const text = '## Ringkasan Materi Ajar ### Topik **Gelembung DNA** (Fase A). ### Gambaran Umum Pada pembelajaran Fase A. Peserta memahami: 1. **DNA** analogi **“petunjuk”**. 2. **Enzim** analogi **“pekerja”**. ### Tujuan - Menyebutkan **DNA**. - Mengaitkan.';

const repairedText = text
  .replace(/([^\n])\s(#{1,6}\s)/g, '$1\n\n$2')
  .replace(/([^\n])\s(\d+\.\s)/g, '$1\n$2')
  .replace(/([^\n])\s([\-\*]\s)/g, '$1\n$2');

console.log("Original:\n", text);
console.log("-------------------");
console.log("Repaired:\n", repairedText);

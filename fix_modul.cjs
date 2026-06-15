const fs = require('fs');
let lines = fs.readFileSync('src/components/ModulKokurikuler.tsx', 'utf-8').split('\n');

const newLines = [
  "  const printModul = () => {",
  "    if (!result) return;",
  "    universalPrint(result, `Modul Kokurikuler - ${tema}`);",
  "  };"
];

// Replace line index 330 to 343 (0-indexed) which correspond to lines 331-344 (1-indexed).
lines.splice(330, 14, ...newLines);

fs.writeFileSync('src/components/ModulKokurikuler.tsx', lines.join('\n'));
console.log("Replaced using line splicing.");

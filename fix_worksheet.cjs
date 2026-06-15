const fs = require('fs');
let code = fs.readFileSync('src/components/WorksheetGenerator.tsx', 'utf-8');

let lines = code.split('\n');
const startIdx = lines.findIndex(l => l.includes("\`, \`Worksheet - \${formData.topik}\`);"));

if (startIdx !== -1) {
  lines.splice(startIdx - 2, 10, "    universalPrint(result, `Worksheet - ${formData.topik}`);", "  };");
  fs.writeFileSync('src/components/WorksheetGenerator.tsx', lines.join('\n'));
  console.log("Replaced using line splicing in WorksheetGenerator.");
} else {
  // Wait, the error said: `, 'Worksheet - ${formData.topik}');
  const altStartIdx = lines.findIndex(l => l.includes("\`, 'Worksheet - \${formData.topik}');"));
  if (altStartIdx !== -1) {
    lines.splice(altStartIdx - 2, 10, "    universalPrint(result, `Worksheet - ${formData.topik}`);", "  };");
    fs.writeFileSync('src/components/WorksheetGenerator.tsx', lines.join('\n'));
    console.log("Replaced using line splicing (alt) in WorksheetGenerator.");
  } else {
    console.log("Could not find target string or line in Worksheet.");
  }
}

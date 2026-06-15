const fs = require('fs');
let code = fs.readFileSync('src/components/Supervision.tsx', 'utf-8');

// I will just use string replacement:
const targetStr = `    universalPrint(\`
        \${printContent}
      \`, 'Instrumen Supervisi Pembelajaran');
            };
          </script>
      </body>
      </html>
    \`);
    printWindow.document.close();
  };`;

const replacementStr = `    universalPrint(result, 'Instrumen Supervisi Pembelajaran');
  };`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, replacementStr);
  fs.writeFileSync('src/components/Supervision.tsx', code);
  console.log("Replaced using exact string replace.");
} else {
  // Try line splicing
  let lines = code.split('\n');
  const startIdx = lines.findIndex(l => l.includes("`, 'Instrumen Supervisi Pembelajaran');"));
  if (startIdx !== -1) {
    // Delete from startIdx-2 (universalPrint(`) to startIdx + 7 (printWindow.document.close();)
    // Actually replace it properly
    lines.splice(startIdx - 2, 10, "    universalPrint(result, 'Instrumen Supervisi Pembelajaran');", "  };");
    fs.writeFileSync('src/components/Supervision.tsx', lines.join('\n'));
    console.log("Replaced using line splicing.");
  } else {
    console.log("Could not find target string or line.");
  }
}

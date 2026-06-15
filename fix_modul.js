const fs = require('fs');
const { execSync } = require('child_process');

try {
    execSync('git checkout src/components/ModulKokurikuler.tsx');
} catch (e) {
    console.log("Git checkout failed, maybe no changes");
}

let content = fs.readFileSync('src/components/ModulKokurikuler.tsx', 'utf8');

const newPrintModul = `  const printModul = () => {
    if (!result) return;
    const printContent = document.getElementById('modul-kokurikuler-print')?.innerHTML || '';
    universalPrint(\`
        \${printContent}
      \`, \`Modul Kokurikuler - \${tema}\`);
  };`;

const oldMarkdown = `<div className="bg-white rounded-2xl p-8 shadow-inner overflow-auto max-h-[800px] prose prose-slate max-w-none">
              <Markdown remarkPlugins={[remarkGfm]}>{result}</Markdown>
            </div>`;
const newMarkdown = `<div id="modul-kokurikuler-print" className="bg-white rounded-2xl p-8 shadow-inner overflow-auto max-h-[800px] prose prose-slate max-w-none">
              <Markdown remarkPlugins={[remarkGfm]}>{result}</Markdown>
            </div>`;

// The syntax error is that after `setError(...)` it has `   - Seimbangkan LOTS...`
const syntaxErrorMatch = content.match(/setError\(err\.message \|\| 'Gagal menghasilkan modul\.'\);\r?\n\s+- Seimbangkan LOTS/);
if (syntaxErrorMatch) {
    console.log("Syntax error found, fixing...");
    // Let's replace everything from `setError(...)` to `3. Use format Markdown yang rapi dan profesional. Buat tabel menggunakan sintaks Markdown.\`;` with the proper finally block!
    const badRegex = /setError\(err\.message \|\| 'Gagal menghasilkan modul\.'\);[\s\S]*?3\. Use format Markdown yang rapi dan profesional\. Buat tabel menggunakan sintaks Markdown\.`;/
    content = content.replace(badRegex, "setError(err.message || 'Gagal menghasilkan modul.');");
}

content = content.replace(/const printModul = \(\) => \{[\s\S]*?universalPrint\(`[\s\S]*?\${printContent}[\s\S]*?`, 'Modul Kokurikuler - \${tema}'\);\r?\n\s*\};/, newPrintModul);
content = content.replace(oldMarkdown, newMarkdown);

fs.writeFileSync('src/components/ModulKokurikuler.tsx', content);
console.log("Fixed successfully!");

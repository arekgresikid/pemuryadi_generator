const fs = require('fs');

const file = 'src/components/ModulKokurikuler.tsx';
let content = fs.readFileSync(file, 'utf8');

// The file might contain a duplication of the generated code inside `generateModul`
// We want to make sure it looks exactly like this:
/*
      setResult(response.text || '');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Gagal menghasilkan modul.');
    } finally {
      setIsGenerating(false);
    }
  };

  const printModul = () => {
*/

// Let's first clean up any syntax error text.
const badSyntaxRegex = /setError\(err\.message \|\| 'Gagal menghasilkan modul\.'\);[\s\S]*?\} catch \(err: any\) \{/g;
const hasDuplicate = badSyntaxRegex.test(content);
if (hasDuplicate) {
    // There are TWO catches. That means there's a duplicate block between the first setError and the second catch.
    // Let's replace the first setError up to the second setError with just the finally block.
    const duplicateRegex = /setError\(err\.message \|\| 'Gagal menghasilkan modul\.'\);[\s\S]*?setError\(err\.message \|\| 'Gagal menghasilkan modul\.'\);/g;
    content = content.replace(duplicateRegex, "setError(err.message || 'Gagal menghasilkan modul.');");
}

// Next, let's inject our new `printModul`
const newPrintModul = `  const printModul = () => {
    if (!result) return;
    
    const printContent = document.getElementById('modul-kokurikuler-print')?.innerHTML || '';
    
    universalPrint(\`
        \${printContent}
      \`, \`Modul Kokurikuler - \${tema}\`);
  };`;

// replace whatever `printModul` is there.
const printModulRegex = /const printModul = \(\) => \{[\s\S]*?universalPrint\([\s\S]*?\);\r?\n\s*\};/;
content = content.replace(printModulRegex, newPrintModul);

// Finally, update the Markdown div to have the id
const oldMarkdown = `<div className="bg-white rounded-2xl p-8 shadow-inner overflow-auto max-h-[800px] prose prose-slate max-w-none">
              <Markdown remarkPlugins={[remarkGfm]}>{result}</Markdown>
            </div>`;
const newMarkdown = `<div id="modul-kokurikuler-print" className="bg-white rounded-2xl p-8 shadow-inner overflow-auto max-h-[800px] prose prose-slate max-w-none">
              <Markdown remarkPlugins={[remarkGfm]}>{result}</Markdown>
            </div>`;

content = content.replace(oldMarkdown, newMarkdown);

fs.writeFileSync(file, content);
console.log("Fixes applied.");

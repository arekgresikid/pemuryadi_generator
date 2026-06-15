const fs = require('fs');

const file = 'src/components/ModulKokurikuler.tsx';
let content = fs.readFileSync(file, 'utf8');

const matchTop = content.match(/setResult\(response\.text \|\| ''\);\r?\n\s+\} catch \(err: any\) \{/);
const matchBottom = content.match(/  return \(\r?\n\s+<div className="max-w-4xl/);

if (matchTop && matchBottom) {
    const topIndex = matchTop.index;
    const bottomIndex = matchBottom.index;
    
    const beforeStr = content.substring(0, topIndex);
    const afterStr = content.substring(bottomIndex);
    
    const replaceStr = `setResult(response.text || '');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Gagal menghasilkan modul.');
    } finally {
      setIsGenerating(false);
    }
  };

  const printModul = () => {
    if (!result) return;
    const printContent = document.getElementById('modul-kokurikuler-print')?.innerHTML || '';
    universalPrint(\\\`
        \\\${printContent}
      \\\`, \\\`Modul Kokurikuler - \\\${tema}\\\`);
  };

`;

    content = beforeStr + replaceStr + afterStr;
} else {
    console.error("Could not find the bounds to replace");
}

const oldMarkdown = `<div className="bg-white rounded-2xl p-8 shadow-inner overflow-auto max-h-[800px] prose prose-slate max-w-none">
              <Markdown remarkPlugins={[remarkGfm]}>{result}</Markdown>
            </div>`;
const newMarkdown = `<div id="modul-kokurikuler-print" className="bg-white rounded-2xl p-8 shadow-inner overflow-auto max-h-[800px] prose prose-slate max-w-none">
              <Markdown remarkPlugins={[remarkGfm]}>{result}</Markdown>
            </div>`;

content = content.replace(oldMarkdown, newMarkdown);

fs.writeFileSync(file, content);
console.log("Fixed manually!");

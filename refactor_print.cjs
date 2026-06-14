const fs = require('fs');
const path = require('path');

const dir = 'src/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  if (!content.includes('printWindow.document.write')) {
    continue;
  }

  // Add styles extraction right before printWindow.document.write
  if (!content.includes("Array.from(document.querySelectorAll('style")) {
      content = content.replace(/printWindow\.document\.write\(`/g, 
        `const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]')).map(el => el.outerHTML).join('\\n');\n    printWindow.document.write(\``);
  }

  // Inject ${styles} into the <head> of the printed document
  if (!content.includes('${styles}')) {
      content = content.replace(/<head>([\s\S]*?)<\/head>/i, (match, headContent) => {
          // Remove tailwind CDN if it's there
          let newHead = headContent.replace(/<script src="https:\/\/cdn\.tailwindcss\.com"><\/script>/g, '');
          
          // Add ${styles} and some generic neat formatting for rich text in print
          newHead = newHead + `
          \${styles}
          <style>
            td ul, .content-wrapper ul { list-style-type: disc !important; padding-left: 20px !important; margin-bottom: 8px !important; }
            td ol, .content-wrapper ol { list-style-type: decimal !important; padding-left: 20px !important; margin-bottom: 8px !important; }
            td p, .content-wrapper p { margin-bottom: 8px !important; }
            .html-content table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 10px; }
            .html-content th, .html-content td { border: 1px solid #cbd5e1; padding: 8px; }
            .html-content th { background-color: #f1f5f9; font-weight: bold; }
          </style>`;
          return `<head>${newHead}</head>`;
      });
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Refactored print styles in', file);
}

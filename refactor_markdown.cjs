const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'components');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  let hasChanges = false;

  // Add import if it doesn't exist and we're going to use it
  if (content.includes('DOMPurify.sanitize(') && !content.includes('parseMarkdown')) {
    // Replace DOMPurify.sanitize with parseMarkdown
    // Note: Some places use DOMPurify.sanitize(text, { ... }) so we need to be careful.
    // parseMarkdown handles the basic DOMPurify.sanitize(text) case perfectly.
    // If there are options, we might need manual fix, but let's replace the common one:
    // dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(xyz) }}
    
    const regex = /DOMPurify\.sanitize\(([^,{}]+)\)/g;
    
    // First check if there are matches
    if (regex.test(content)) {
      content = content.replace(regex, 'parseMarkdown($1)');
      
      // Import parseMarkdown at the top
      if (!content.includes('import { parseMarkdown }')) {
        // Find the last import
        const importMatch = content.match(/^import .*?;?\n/gm);
        if (importMatch) {
          const lastImport = importMatch[importMatch.length - 1];
          content = content.replace(lastImport, lastImport + "import { parseMarkdown } from '../utils/markdown';\n");
        } else {
          content = "import { parseMarkdown } from '../utils/markdown';\n" + content;
        }
      }
      hasChanges = true;
    }
  }

  if (hasChanges) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}

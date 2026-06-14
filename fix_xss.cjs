const fs = require('fs');
const files = [
  'src/components/DeepLearningPlan.tsx',
  'src/components/MengajarHarian.tsx',
  'src/components/ModuleGenerator.tsx',
  'src/components/WorksheetGenerator.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Add import if not exists
  if (!content.includes("import DOMPurify from 'dompurify'")) {
    content = content.replace(/import React.*?;\n/, match => match + "import DOMPurify from 'dompurify';\n");
    changed = true;
  }

  // Replace dangerouslySetInnerHTML={{ __html: X }} with DOMPurify.sanitize(X)
  const regex = /dangerouslySetInnerHTML=\{\{\s*__html:\s*(.+?)\s*\}\}/g;
  content = content.replace(regex, (match, inner) => {
    if (inner.includes('DOMPurify.sanitize')) return match;
    changed = true;
    return `dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(${inner}) }}`;
  });

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed', file);
  }
}

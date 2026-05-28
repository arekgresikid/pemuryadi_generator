const fs = require('fs');
const path = require('path');

const dir = 'src/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('gemini-3.1-pro-preview')) {
    content = content.replace(/gemini-3\.1-pro-preview/g, 'gemini-1.5-pro');
    fs.writeFileSync(filePath, content);
    console.log(`Replaced in ${file}`);
  }
}

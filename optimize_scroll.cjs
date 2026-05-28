const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;
      
      // Remove backdrop-blur-* classes
      content = content.replace(/backdrop-blur-[a-z0-9-]+/g, '');
      
      // Make semi-transparent backgrounds fully opaque for better scroll performance
      content = content.replace(/bg-slate-800\/50/g, 'bg-slate-800');
      content = content.replace(/bg-slate-900\/50/g, 'bg-slate-900');
      
      if (original !== content) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated:', fullPath);
      }
    }
  }
}

processDir('./src/components');

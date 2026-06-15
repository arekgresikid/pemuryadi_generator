const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('src');
files.forEach(f => {
  let code = fs.readFileSync(f, 'utf8');
  
  // This matches the exact block of orphaned code.
  const regex = /\s*};\s*<\/script>\s*<\/body>\s*<\/html>\s*`\);\s*printWindow\.document\.close\(\);/m;
  
  if (regex.test(code)) {
    code = code.replace(regex, '');
    fs.writeFileSync(f, code);
    console.log('Fixed orphaned code in ' + f);
  }
});

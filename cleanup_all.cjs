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
  if (code.includes('printWindow.document.close()')) {
    // We just want to remove anything from }; to printWindow.document.close();
    // Some have `); printWindow.document.close();
    // Some have printWindow.document.close(); on its own line.
    const regex = /\s*};\s*<\/script>\s*<\/body>\s*<\/html>\s*`\);\s*printWindow\.document\.close\(\);/gm;
    const regex2 = /};\s*<\/script>\s*<\/body>\s*<\/html>\s*`\);\s*printWindow\.document\.close\(\);/gm;
    const regex3 = /\s*<\/script>\s*<\/body>\s*<\/html>\s*`\);\s*printWindow\.document\.close\(\);/gm;

    if (regex.test(code)) {
      code = code.replace(regex, '');
      fs.writeFileSync(f, code);
      console.log('Fixed regex 1 in ' + f);
    } else if (regex2.test(code)) {
      code = code.replace(regex2, '');
      fs.writeFileSync(f, code);
      console.log('Fixed regex 2 in ' + f);
    } else if (regex3.test(code)) {
      code = code.replace(regex3, '');
      fs.writeFileSync(f, code);
      console.log('Fixed regex 3 in ' + f);
    } else {
       // Manual string slice for anything remaining
       const start = code.indexOf('</script>');
       const end = code.indexOf('printWindow.document.close();');
       if (start !== -1 && end !== -1 && start < end) {
           // We also need to remove the }; before </script>
           const closeBrace = code.lastIndexOf('};', start);
           if (closeBrace !== -1 && start - closeBrace < 50) {
               code = code.substring(0, closeBrace) + code.substring(end + 'printWindow.document.close();'.length);
               fs.writeFileSync(f, code);
               console.log('Fixed manual 1 in ' + f);
           } else {
               code = code.substring(0, start) + code.substring(end + 'printWindow.document.close();'.length);
               fs.writeFileSync(f, code);
               console.log('Fixed manual 2 in ' + f);
           }
       }
    }
  }
});

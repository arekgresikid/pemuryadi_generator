const fs = require('fs');
let code = fs.readFileSync('src/utils/print.ts', 'utf8');
code = code.replace(/\\`/g, '`');
code = code.replace(/\\\$/g, '$');
fs.writeFileSync('src/utils/print.ts', code);
console.log('Fixed print.ts');

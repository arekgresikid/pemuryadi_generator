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
  // First, fix the broken \/script> from previous attempt
  if (code.includes('\\/script>')) {
    code = code.split('\\/script>').join('</' + 'script>');
  }
  // Now safely replace </script> with </scr\` + \`ipt>
  if (code.includes('</script>')) {
    code = code.split('</script>').join('</scr` + `ipt>');
    fs.writeFileSync(f, code);
    console.log('Fixed ' + f);
  }
});

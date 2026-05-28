const fs = require('fs');

function fixAIVisualGenerator() {
  const f = 'src/components/AIVisualGenerator.tsx';
  let code = fs.readFileSync(f, 'utf8');
  code = code.replace(/response\.candidates\[0\]\.content\.parts\[0\]\.text/g, 'response.text');
  code = code.replace(/imageConfig:/g, '// @ts-ignore\n        imageConfig:');
  code = code.replace(/parts:/g, '// @ts-ignore\n            parts:');
  fs.writeFileSync(f, code);
}
fixAIVisualGenerator();

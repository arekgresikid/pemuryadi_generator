const fs = require('fs');
const path = require('path');

const dir = 'src/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

// Find all files with hardcoded gemini model strings
const targets = [];
for (const f of files) {
  const content = fs.readFileSync(path.join(dir, f), 'utf8');
  const match = content.match(/model: 'gemini[^']+'/);
  if (match) targets.push({ file: f, model: match[0] });
}

console.log('Files with hardcoded gemini models:');
targets.forEach(t => console.log(` - ${t.file}: ${t.model}`));

// Files to patch (add ModelSelector)
const toPatch = targets.map(t => t.file);

for (const filename of toPatch) {
  const filePath = path.join(dir, filename);
  let code = fs.readFileSync(filePath, 'utf8');
  let patched = false;

  // 1. Add ModelSelector import after first import line
  if (!code.includes("import ModelSelector")) {
    code = code.replace(
      /^(import React.*?;\r?\n)/,
      `$1import ModelSelector from './ModelSelector';\n`
    );
    patched = true;
  }

  // 2. Replace hardcoded gemini model strings in generateContent calls
  code = code.replace(/model: 'gemini[^']+'/g, `model: selectedModel`);

  // 3. Add selectedModel state if not present
  if (!code.includes('selectedModel')) {
    // Try to insert after the first useState line
    code = code.replace(
      /(const \[[^\]]+, set[^\]]+\] = (?:React\.)?useState[^;]+;\r?\n)/,
      `$1  const [selectedModel, setSelectedModel] = React.useState<string>('openai');\n`
    );
    patched = true;
  }

  // 4. Add ModelSelector UI element before the generate button
  // Pattern: button with onClick={generate or handleGenerate or similar}
  if (!code.includes('<ModelSelector')) {
    // Find the button with disabled={isGenerating} or similar generate button
    // Insert ModelSelector right before a div/button containing "Generate" or "Buat" action
    const buttonPatterns = [
      // before "flex gap-2" wrapper containing save + generate buttons
      /(<div className="flex gap-2[^"]*"[^>]*>[\s\n\r]*<button[^>]*onClick=\{save)/,
      // before standalone generate button
      /(<button[^>]*onClick=\{(?:generateModul|handleGenerate|generateAnalisis|generateSoal|generateKKTP|generatePlan|handleAnalyze|generate)[^}]*\})/,
    ];

    for (const pattern of buttonPatterns) {
      if (pattern.test(code)) {
        code = code.replace(pattern, (match) => {
          return `<div className="mb-4">\n            <ModelSelector modality="text" value={selectedModel} onChange={setSelectedModel} disabled={isGenerating} />\n          </div>\n          ${match}`;
        });
        patched = true;
        break;
      }
    }
  }

  fs.writeFileSync(filePath, code);
  console.log(`✅ Patched: ${filename}`);
}

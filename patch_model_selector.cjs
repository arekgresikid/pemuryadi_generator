const fs = require('fs');
const path = require('path');

// Components and their generate button areas (component name, pattern to find the generate button area, color for button)
const components = [
  'AnalisisHariEfektif.tsx',
  'ProgramTahunan.tsx',
  'ProgramSemester.tsx',
  'MengajarHarian.tsx',
  'KalenderPendidikan.tsx',
  'GameIFP.tsx',
  'SNP.tsx',
];

for (const filename of components) {
  const filePath = path.join('src/components', filename);
  let content = fs.readFileSync(filePath, 'utf8');

  let changed = false;

  // 1. Add ModelSelector import after first import line
  if (!content.includes("import ModelSelector")) {
    content = content.replace(
      /^(import React.*?;\r?\n)/,
      `$1import ModelSelector from './ModelSelector';\n`
    );
    changed = true;
  }

  // 2. Add selectedModel state after other useState calls
  if (!content.includes('selectedModel') && !content.includes('setSelectedModel')) {
    content = content.replace(
      /(const \[isGenerating, setIsGenerating\] = useState\(false\);)/,
      `$1\n  const [selectedModel, setSelectedModel] = React.useState<string>('openai');`
    );
    changed = true;
  }

  // 3. Replace hardcoded model name in generateContent call
  content = content.replace(
    /model: 'gemini-1\.5-pro'/g,
    `model: selectedModel`
  );

  // 4. Add ModelSelector UI before the generate button
  // Find the save button / generate button wrapper for text generators
  // Pattern: look for the flex gap-2 wrapper containing the generate button
  const modelSelectorUI = `\n              <ModelSelector modality="text" value={selectedModel} onChange={setSelectedModel} disabled={isGenerating} />\n`;

  // Insert before the flex gap-2 div containing save + generate
  if (!content.includes('<ModelSelector')) {
    // Try: before the div with "flex gap-2" that contains the generate button
    content = content.replace(
      /(<div className="flex gap-2(?:[^"]*)" ?(mt-4)?[^>]*>[\s\S]{0,300}?saveProgress)/,
      (match) => modelSelectorUI + match
    );
    changed = true;
  }

  fs.writeFileSync(filePath, content);
  console.log(`✅ Patched: ${filename}`);
}

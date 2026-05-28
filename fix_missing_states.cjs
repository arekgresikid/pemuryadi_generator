const fs = require('fs');
const path = require('path');

const dir = 'src/components';
const filesToFix = [
  'BuatSoal.tsx',
  'CrosswordGenerator.tsx',
  'DeepLearningPlan.tsx',
  'KKTP.tsx',
  'ModuleGenerator.tsx',
  'ModulKokurikuler.tsx'
];

for (const filename of filesToFix) {
  const filePath = path.join(dir, filename);
  let code = fs.readFileSync(filePath, 'utf8');

  // Fix 1: Add selectedModel state
  if (!code.includes('const [selectedModel')) {
    // Find where the component function starts, specifically the first useState
    // This is more robust: we find "const [error, setError]" or something common
    const insertAfter = /(const \[[^\]]+, set[^\]]+\] = (?:React\.)?useState<[^>]+>\([^)]*\);|const \[[^\]]+, set[^\]]+\] = (?:React\.)?useState\([^)]*\);)/;
    code = code.replace(insertAfter, (match) => {
      return `${match}\n  const [selectedModel, setSelectedModel] = React.useState<string>('openai');`;
    });
  }

  // Fix 2: CrosswordGenerator specific fix
  if (filename === 'CrosswordGenerator.tsx') {
    code = code.replace(/disabled=\{isGenerating\}/g, 'disabled={isGeneratingAI}');
  }

  fs.writeFileSync(filePath, code);
  console.log(`✅ Fixed: ${filename}`);
}

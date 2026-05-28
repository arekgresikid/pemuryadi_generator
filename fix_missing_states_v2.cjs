const fs = require('fs');
const path = require('path');

const dir = 'src/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const filename of files) {
  const filePath = path.join(dir, filename);
  let code = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Check if it uses selectedModel but doesn't define it
  if (code.includes('selectedModel') && !code.includes('const [selectedModel')) {
    // Insert after the first useState definition
    const insertAfter = /(const \[[^\]]+, set[^\]]+\] = (?:React\.)?useState<[^>]+>\([^)]*\);|const \[[^\]]+, set[^\]]+\] = (?:React\.)?useState\([^)]*\);)/;
    code = code.replace(insertAfter, (match) => {
      return `${match}\n  const [selectedModel, setSelectedModel] = React.useState<string>('openai');`;
    });
    changed = true;
  }

  // CrosswordGenerator specific fix
  if (filename === 'CrosswordGenerator.tsx' && code.includes('disabled={isGenerating}')) {
    code = code.replace(/disabled=\{isGenerating\}/g, 'disabled={isGeneratingAI}');
    changed = true;
  }

  // SnakeLadder missing ModelSelector props
  if (filename === 'SnakeLadder.tsx' && code.includes('<ModelSelector') && !code.includes('setSelectedModel')) {
    code = code.replace(/<ModelSelector[^>]*\/>/, '<ModelSelector modality="text" value={selectedModel} onChange={setSelectedModel} disabled={isGenerating} />');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, code);
    console.log(`✅ Fixed: ${filename}`);
  }
}

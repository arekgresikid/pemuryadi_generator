const fs = require('fs');
const path = require('path');

const srcDir = 'acakadut_temp/src/pages';
const destDir = 'src/pages';

const files = [
  'EvaluasiMutu.tsx',
  'LaporanKegiatan.tsx',
  'Reports.tsx',
  'StrategicAdvisor.tsx'
];

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

files.forEach(file => {
  const srcPath = path.join(srcDir, file);
  const destPath = path.join(destDir, file);
  
  if (fs.existsSync(srcPath)) {
    let content = fs.readFileSync(srcPath, 'utf8');
    
    // Replace import { GoogleGenAI } from '@google/genai'; with local import
    content = content.replace(/import\s+\{\s*GoogleGenAI\s*\}\s+from\s+['"]@google\/genai['"];?/g, "import { GoogleGenAI } from '../lib/genai';");
    
    // Replace direct fetch('/api/generate') with genAI wrapper
    // The current code has:
    /*
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gemini-2.5-flash',
          contents: conversationContents,
          systemInstruction
        })
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'API Error');
      }
      const data = await response.json();
    */
    
    const fetchRegex = /const response = await fetch\(['"]\/api\/generate['"], \{\s*method: ['"]POST['"],\s*headers: \{ ['"]Content-Type['"]: ['"]application\/json['"] \},\s*body: JSON\.stringify\(\{[\s\S]*?model: ['"][^'"]+['"],[\s\S]*?contents: conversationContents,[\s\S]*?systemInstruction[\s\S]*?\}\)\s*\}\);\s*if \(!response\.ok\) \{[\s\S]*?const errData = await response\.json\(\)\.catch\(\(\) => \(\{\}\)\);[\s\S]*?throw new Error\(errData\.error \|\| ['"]API Error['"]\);[\s\S]*?\}\s*const data = await response\.json\(\);/g;
    
    const fetchReplacement = `const genAI = new GoogleGenAI({});
      const data = await genAI.models.generateContent({
        model: 'openai',
        contents: conversationContents,
        config: { systemInstruction }
      });`;
      
    content = content.replace(fetchRegex, fetchReplacement);
    
    fs.writeFileSync(destPath, content);
    console.log(`Copied and updated ${file}`);
  } else {
    console.log(`File not found: ${srcPath}`);
  }
});

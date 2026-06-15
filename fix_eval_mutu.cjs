const fs = require('fs'); 
let content = fs.readFileSync('src/components/EvaluasiMutu.tsx', 'utf-8'); 

const fetchRegex = /const response = await fetch\('\/api\/generate', \{\s*method: 'POST',\s*headers: \{ 'Content-Type': 'application\/json' \},\s*body: JSON\.stringify\(\{\s*model: 'gemini-2\.5-flash',\s*contents: (.*?),\s*systemInstruction\s*\}\)\s*\}\);\s*if \(!response\.ok\) \{\s*const errData = await response\.json\(\)\.catch\(\(\) => \(\{\}\)\);\s*throw new Error\(errData\.error \|\| 'API Error'\);\s*\}\s*const data = await response\.json\(\);/g;

let count = 0;
content = content.replace(fetchRegex, (match, p1) => {
  count++;
  return `const ai = new GoogleGenAI({});
      const response = await ai.models.generateContent({
        model: 'openai',
        contents: ${p1},
        config: {
          systemInstruction,
          temperature: 0.2
        }
      });
      const data = { text: response.text };`;
});

if (!content.includes('import { GoogleGenAI }')) {
  content = content.replace('import React', "import { GoogleGenAI } from '../lib/genai';\nimport React");
}

fs.writeFileSync('src/components/EvaluasiMutu.tsx', content); 
console.log('Replaced successfully: ' + count);

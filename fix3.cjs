const fs = require('fs');
let code = fs.readFileSync('src/components/AIVisualGenerator.tsx', 'utf8');

// Add import { useToken } from '../api';
if (!code.includes('useToken')) {
  code = code.replace(/import \{ GoogleGenAI \}.*?;/, "import { useToken } from '../api';\nimport { GoogleGenAI } from '@google/genai';");
}

// Replace the image generation logic
const startTarget = "const apiKey = process.env.GEMINI_API_KEY;";
const endTarget = "throw new Error('Gagal menghasilkan gambar. Silakan coba lagi.');\n      }";

const targetBlock = code.substring(code.indexOf(startTarget), code.indexOf(endTarget) + endTarget.length);

const replacement = `await useToken();

      const prompt = \`Educational \${type} about \${context.subject}: \${context.topic} for \${context.level} students. High quality, clear, modern style. Vibrant colors, no text overlay.\`;
      const encodedPrompt = encodeURIComponent(prompt);
      
      const imageUrlStr = \`https://gen.pollinations.ai/image/\${encodedPrompt}?model=flux\`;
      
      const imageResponse = await fetch(imageUrlStr);
      if (!imageResponse.ok) {
        throw new Error('Gagal menghasilkan gambar. Silakan coba lagi.');
      }
      
      const blob = await imageResponse.blob();
      const objectUrl = URL.createObjectURL(blob);
      setGeneratedImage(objectUrl);`;

code = code.replace(targetBlock, replacement);

fs.writeFileSync('src/components/AIVisualGenerator.tsx', code);

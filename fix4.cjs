const fs = require('fs');
let code = fs.readFileSync('src/components/AIVisualGenerator.tsx', 'utf8');

const oldLogic = `      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error('API Key tidak ditemukan.');

      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = \`Generate a professional, high-quality educational \${type} for the following context:
      Subject: \${context.subject}
      Topic: \${context.topic}
      Level: \${context.level}
      Phase: \${context.phase}
      Class: \${context.class}
      
      Requirements:
      1. The \${type} must be visually stunning, clear, and highly educational.
      2. Use a modern, clean layout suitable for \${context.level} students.
      3. ALL TEXT within the image MUST be in correct, formal Indonesian (Bahasa Indonesia).
      4. Ensure there are NO typos or spelling errors in the Indonesian text.
      5. The content should be accurate and relevant to the topic "\${context.topic}".
      6. Use vibrant and engaging colors that match the subject matter.\`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              text: prompt,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
          },
        },
      });

      let imageUrl = null;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          imageUrl = \`data:image/png;base64,\${base64EncodeString}\`;
          break;
        }
      }

      if (imageUrl) {
        setGeneratedImage(imageUrl);
      } else {
        throw new Error('Gagal menghasilkan gambar. Silakan coba lagi.');
      }`;

const newLogic = `      await useToken(); // Consume token
      
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

if (code.includes('const apiKey = process.env.GEMINI_API_KEY;')) {
    code = code.replace(oldLogic, newLogic);
    fs.writeFileSync('src/components/AIVisualGenerator.tsx', code);
    console.log("Replaced successfully!");
} else {
    console.log("Could not find the target code to replace.");
}

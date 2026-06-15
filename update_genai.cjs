const fs = require('fs');
let code = fs.readFileSync('src/lib/genai.ts', 'utf-8');

const regex = /\/\/ Handle array of parts or string\s+if \(Array\.isArray\(contents\)\) \{\s+\/\/ Flatten Google GenAI parts format to OpenAI format\s+const openAiContent = contents\.map\(part => \{\s+if \(typeof part === 'string'\) return \{ type: "text", text: part \};\s+if \(part\.text\) return \{ type: "text", text: part\.text \};\s+\/\/ Minimal support for other types if needed, but mostly it's text\s+return \{ type: "text", text: JSON\.stringify\(part\) \};\s+\}\);\s+messages\.push\(\{ role: "user", content: openAiContent \}\);\s+\} else \{\s+messages\.push\(\{ role: "user", content: contents \}\);\s+\}/;

const replacement = `        // Handle array of parts or string
        if (Array.isArray(contents)) {
          if (contents.length > 0 && typeof contents[0] === 'object' && 'role' in contents[0]) {
            // It's a list of conversation messages: { role: string, parts: any[] }
            for (const msg of contents) {
               const openAiContent = (msg.parts || []).map((part: any) => {
                 if (typeof part === 'string') return { type: "text", text: part };
                 if (part.text) return { type: "text", text: part.text };
                 return { type: "text", text: JSON.stringify(part) };
               });
               messages.push({ role: msg.role === 'model' ? 'assistant' : 'user', content: openAiContent });
            }
          } else {
            // Flatten Google GenAI parts format to OpenAI format
            const openAiContent = contents.map(part => {
               if (typeof part === 'string') return { type: "text", text: part };
               if (part.text) return { type: "text", text: part.text };
               // Minimal support for other types if needed, but mostly it's text
               return { type: "text", text: JSON.stringify(part) };
            });
            messages.push({ role: "user", content: openAiContent });
          }
        } else {
          messages.push({ role: "user", content: contents });
        }`;

if (regex.test(code)) {
  code = code.replace(regex, replacement);
  fs.writeFileSync('src/lib/genai.ts', code);
  console.log("Replaced successfully.");
} else {
  console.log("Regex not found in genai.ts");
}

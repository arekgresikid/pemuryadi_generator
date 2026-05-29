const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/components/**/*.tsx');
let countInputs = 0;
let countTextareas = 0;

files.forEach(file => {
  // Skip the AIAssisted files themselves to avoid infinite loops
  if (file.includes('AIAssistedInput.tsx') || file.includes('AIAssistedTextarea.tsx') || file.includes('Chatbot.tsx')) return;
  
  let code = fs.readFileSync(file, 'utf8');
  let original = code;
  
  // Replace <input ... />
  // We only replace inputs that are type="text" or have no type, and are self-closing
  code = code.replace(/<input\s+([\s\S]*?)>/g, (match, props) => {
    if (props.includes('type="radio"') || props.includes('type="checkbox"') || props.includes('type="number"') || props.includes('type="file"') || props.includes('type="range"') || props.includes('type="color"')) {
      return match;
    }
    // Only process if it's not already AIAssistedInput (shouldn't happen since we just match <input)
    countInputs++;
    let cleanProps = props.replace(/\/$/, '').trim();
    return `<AIAssistedInput ${cleanProps} />`;
  });

  // Replace <textarea ... /> ... </textarea> or <textarea ... />
  code = code.replace(/<textarea\s+([\s\S]*?)>([\s\S]*?)<\/textarea>/g, (match, props, inner) => {
    countTextareas++;
    let cleanProps = props.replace(/\/$/, '').trim();
    return `<AIAssistedTextarea ${cleanProps} />`;
  });
  
  code = code.replace(/<textarea\s+([\s\S]*?)\/>/g, (match, props) => {
    countTextareas++;
    let cleanProps = props.replace(/\/$/, '').trim();
    return `<AIAssistedTextarea ${cleanProps} />`;
  });

  if (code !== original) {
    // Inject imports
    const hasImportInput = code.includes('<AIAssistedInput');
    const hasImportTextarea = code.includes('<AIAssistedTextarea');
    
    let importStmt = '';
    if (hasImportInput && !code.includes('import AIAssistedInput')) {
      importStmt += `import AIAssistedInput from './AIAssistedInput';\n`;
    }
    if (hasImportTextarea && !code.includes('import AIAssistedTextarea')) {
      importStmt += `import AIAssistedTextarea from './AIAssistedTextarea';\n`;
    }
    
    if (importStmt) {
      const lastImportIndex = code.lastIndexOf('import ');
      if (lastImportIndex !== -1) {
        const nextLine = code.indexOf('\n', lastImportIndex);
        code = code.slice(0, nextLine + 1) + importStmt + code.slice(nextLine + 1);
      } else {
        code = importStmt + '\n' + code;
      }
    }
    
    fs.writeFileSync(file, code);
  }
});

console.log('Replaced additional Inputs:', countInputs);
console.log('Replaced additional Textareas:', countTextareas);

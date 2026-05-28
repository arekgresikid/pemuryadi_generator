const fs = require('fs');

let code = fs.readFileSync('src/components/AIVisualGenerator.tsx', 'utf8');

// 1. Add React.useEffect if missing from React import
// Actually, I can just use React.useEffect directly since React is imported.

// 2. Add states
const stateTarget = "const [error, setError] = useState<string | null>(null);";
const newStates = `const [error, setError] = useState<string | null>(null);
  const [models, setModels] = useState<string[]>(['flux']);
  const [selectedModel, setSelectedModel] = useState<string>('flux');

  React.useEffect(() => {
    fetch('https://gen.pollinations.ai/image/models')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setModels(data);
        }
      })
      .catch(err => console.error("Error fetching models:", err));
  }, []);`;

code = code.replace(stateTarget, newStates);

// 3. Add model parameter in URL
const urlTarget = 'const imageUrlStr = `https://gen.pollinations.ai/image/${encodedPrompt}?model=flux`;';
const newUrlTarget = 'const imageUrlStr = `https://gen.pollinations.ai/image/${encodedPrompt}?model=${selectedModel}`;';

code = code.replace(urlTarget, newUrlTarget);

// 4. Add UI dropdown
const uiTarget = '<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">';
const newUiTarget = `<div className="mb-6 flex flex-col md:flex-row md:items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-700">
        <label className="text-sm font-semibold text-slate-300 whitespace-nowrap">Pilih Model Visual AI:</label>
        <select 
          value={selectedModel} 
          onChange={(e) => setSelectedModel(e.target.value)}
          className="bg-slate-800 text-white text-sm rounded-lg px-3 py-2 border border-slate-700 outline-none focus:border-indigo-500 w-full md:w-auto"
        >
          {models.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">`;

code = code.replace(uiTarget, newUiTarget);

fs.writeFileSync('src/components/AIVisualGenerator.tsx', code);

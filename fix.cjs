const fs = require('fs');

function fixModuleGenerator() {
  const f = 'src/components/ModuleGenerator.tsx';
  let code = fs.readFileSync(f, 'utf8');
  if (!code.includes('import { Save')) {
    code = code.replace(/import \{([^}]+)\} from 'lucide-react'/, (m, p) => `import { ${p}, Save } from 'lucide-react'`);
  }
  fs.writeFileSync(f, code);
}

function fixDeepLearningPlan() {
  const f = 'src/components/DeepLearningPlan.tsx';
  let code = fs.readFileSync(f, 'utf8');
  if (!code.includes('import { Save')) {
    code = code.replace(/import \{([^}]+)\} from 'lucide-react'/, (m, p) => `import { ${p}, Save } from 'lucide-react'`);
  }
  fs.writeFileSync(f, code);
}

function fixDailyJournal() {
  const f = 'src/components/DailyJournal.tsx';
  let code = fs.readFileSync(f, 'utf8');
  if (!code.includes('import { Save')) {
    code = code.replace(/import \{([^}]+)\} from 'lucide-react'/, (m, p) => `import { ${p}, Save } from 'lucide-react'`);
  }
  code = code.replace(/<button[^>]+onClick=\{saveProgress\}[^>]*>[\s\S]*?<\/button>/g, '');
  fs.writeFileSync(f, code);
}

function fixModulKokurikuler() {
  const f = 'src/components/ModulKokurikuler.tsx';
  let code = fs.readFileSync(f, 'utf8');
  code = code.replace(/<button[^>]+onClick=\{saveProgress\}[^>]*>[\s\S]*?<\/button>/g, '');
  fs.writeFileSync(f, code);
}

function fixSupervision() {
  const f = 'src/components/Supervision.tsx';
  let code = fs.readFileSync(f, 'utf8');
  code = code.replace(/formData\.jenisNipGuru/g, 'formData.nipGuru');
  code = code.replace(/formData\.jenisNipSupervisor/g, 'formData.nipSupervisor');
  fs.writeFileSync(f, code);
}

function fixAIVisualGenerator() {
  const f = 'src/components/AIVisualGenerator.tsx';
  let code = fs.readFileSync(f, 'utf8');
  code = code.replace(/response\.candidates\[0\]\.content\.parts\[0\]\.text/g, 'response.text');
  code = code.replace(/imageConfig:/g, '// @ts-ignore\n        imageConfig:');
  code = code.replace(/parts:/g, '// @ts-ignore\n            parts:');
  fs.writeFileSync(f, code);
}

fixModuleGenerator();
fixDeepLearningPlan();
fixDailyJournal();
fixModulKokurikuler();
fixSupervision();
fixAIVisualGenerator();

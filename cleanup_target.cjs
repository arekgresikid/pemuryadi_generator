const fs = require('fs');

const files = [
  'src/components/WorksheetGenerator.tsx',
  'src/components/Supervision.tsx',
  'src/components/SNP.tsx',
  'src/components/ProgramTahunan.tsx',
  'src/components/ProgramSemester.tsx',
  'src/components/ModulKokurikuler.tsx',
  'src/components/ModuleGenerator.tsx',
  'src/components/KalenderPendidikan.tsx',
  'src/components/InvoiceGenerator.tsx',
  'src/components/DailyJournal.tsx',
  'src/components/CrosswordGenerator.tsx',
  'src/components/AnalisisHariEfektif.tsx'
];

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  let code = fs.readFileSync(f, 'utf8');
  
  // The exact pattern of orphaned code left behind after `universalPrint(...)` was inserted.
  // Note: we use [\s\S]*? from </script> to document.close(); to be robust
  const regex = /\s*};\s*<\/script>[\s\S]*?printWindow\.document\.close\(\);/m;
  const regex2 = /\s*<\/script>[\s\S]*?printWindow\.document\.close\(\);/m;
  
  if (regex.test(code)) {
    code = code.replace(regex, '');
    fs.writeFileSync(f, code);
    console.log('Fixed orphaned code in ' + f);
  } else if (regex2.test(code)) {
    code = code.replace(regex2, '');
    fs.writeFileSync(f, code);
    console.log('Fixed orphaned code (type 2) in ' + f);
  } else {
    console.log('No orphaned code found in ' + f);
  }
});

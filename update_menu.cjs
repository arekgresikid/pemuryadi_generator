const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

const newMenu = `      { 
        id: 'mutu', 
        icon: <BookOpen size={20} />, 
        label: 'Manajemen Mutu',
        dropdown: [
          { id: 'evaluasi-mutu', icon: <Clipboard size={16} />, label: 'Evaluasi Mutu' },
          { id: 'strategic-advisor', icon: <Target size={16} />, label: 'Strategic Advisor' },
          { id: 'reports', icon: <FileText size={16} />, label: 'Laporan Umum' },
          { id: 'laporan-kegiatan', icon: <FileText size={16} />, label: 'Laporan Kegiatan' }
        ]
      },`;

if (!c.includes("id: 'mutu'")) {
  c = c.replace("{ id: 'admin'", newMenu + "\n      { id: 'admin'");
}

if (!c.includes('Target')) {
  c = c.replace('import { ', 'import { Target, ');
}

fs.writeFileSync('src/App.tsx', c);
console.log('Added to menu');

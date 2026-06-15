const fs = require('fs');

const files = [
  'src/components/Reports.tsx', 
  'src/components/StrategicAdvisor.tsx', 
  'src/components/LaporanKegiatan.tsx',
  'src/components/EvaluasiMutu.tsx'
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf-8');

  // Generic neobrutalism tailwind tokens
  content = content.replace(/bg-paper/g, 'bg-white');
  content = content.replace(/text-ink\/(\d+)/g, (match, p1) => {
    if (p1 === '50') return 'text-gray-500';
    if (p1 === '60') return 'text-gray-500';
    if (p1 === '70') return 'text-gray-600';
    if (p1 === '80') return 'text-gray-700';
    return 'text-gray-500';
  });
  content = content.replace(/border-ink\/(\d+)/g, (match, p1) => {
    if (p1 === '10') return 'border-gray-100';
    if (p1 === '20') return 'border-gray-200';
    if (p1 === '50') return 'border-gray-300';
    return 'border-gray-200';
  });
  
  content = content.replace(/text-ink/g, 'text-gray-900');
  content = content.replace(/border-ink/g, 'border-gray-200');
  content = content.replace(/bg-ink/g, 'bg-gray-900');
  
  content = content.replace(/text-accent/g, 'text-blue-600');
  content = content.replace(/bg-accent/g, 'bg-blue-600');
  content = content.replace(/border-accent/g, 'border-blue-600');
  
  content = content.replace(/bg-audit\/30/g, 'bg-blue-50');
  content = content.replace(/bg-audit\/50/g, 'bg-blue-50');
  content = content.replace(/bg-audit/g, 'bg-blue-100');

  // Specific font/style cleanups
  content = content.replace(/font-serif/g, 'font-sans');
  content = content.replace(/italic/g, ''); // be careful but usually neo used font-serif italic

  // Fix button sizes from neo brutalism to normal
  content = content.replace(/text-\[10px\] uppercase tracking-widest font-bold/g, 'text-sm font-medium');
  content = content.replace(/text-\[11px\] uppercase tracking-widest font-bold/g, 'text-sm font-medium');
  content = content.replace(/text-\[11px\] uppercase tracking-\[2px\] font-bold/g, 'text-sm font-medium');
  content = content.replace(/text-\[10px\] uppercase tracking-\[3px\] font-bold/g, 'text-sm font-medium');
  content = content.replace(/text-\[11px\] text-blue-600 uppercase tracking-\[2px\] font-bold/g, 'text-sm text-blue-600 font-semibold');
  
  content = content.replace(/text-\[13px\]/g, 'text-sm');
  content = content.replace(/text-\[14px\]/g, 'text-sm');
  content = content.replace(/text-\[15px\]/g, 'text-base');
  content = content.replace(/text-\[16px\]/g, 'text-base');
  content = content.replace(/text-\[28px\]/g, 'text-2xl font-bold text-gray-900');

  // Some remaining big classes
  content = content.replace(/bg-gray-900 text-white px-6 py-2 text-sm font-medium hover:bg-blue-600 hover:text-gray-900 transition-colors border border-gray-200/g, 'bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors');
  content = content.replace(/max-w-6xl mx-auto font-sans h-full text-gray-900 flex flex-col/g, 'p-4 md:p-8 max-w-5xl mx-auto font-sans h-full text-gray-900 flex flex-col');
  content = content.replace(/p-10 lg:px-14 lg:py-10 max-w-6xl/g, 'p-4 md:p-8 max-w-5xl');

  // If there's border-t-[8px], change to normal border
  content = content.replace(/border-t-\[8px\]/g, 'border-t-2');
  content = content.replace(/border-l-\[6px\]/g, 'border-l-4');
  content = content.replace(/border-l-\[4px\]/g, 'border-l-2');
  content = content.replace(/border-b-4/g, 'border-b-2');

  fs.writeFileSync(file, content);
});

console.log('Cleaned up neobrutalism classes');

const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const newImports = `
import EvaluasiMutu from './components/EvaluasiMutu';
import LaporanKegiatan from './components/LaporanKegiatan';
import Reports from './components/Reports';
import StrategicAdvisor from './components/StrategicAdvisor';
`;

// Add imports
if (!code.includes('import EvaluasiMutu')) {
  code = code.replace("import GamesHub from './components/GamesHub';", "import GamesHub from './components/GamesHub';" + newImports);
}

// Add routes inside the <Routes> of AppLayout
const newRoutes = `
          <Route path="evaluasi-mutu" element={<EvaluasiMutu jenjang={profile?.jenjang} jenisSekolah={profile?.jenisSekolah || ''} />} />
          <Route path="laporan-kegiatan" element={<LaporanKegiatan jenjang={profile?.jenjang} />} />
          <Route path="reports" element={<Reports />} />
          <Route path="strategic-advisor" element={<StrategicAdvisor jenjang={profile?.jenjang} />} />
`;

if (!code.includes('<Route path="evaluasi-mutu"')) {
  // Find where SNP is and insert after it
  const snpRoute = '<Route path="snp" element={<SNP />} />';
  if (code.includes(snpRoute)) {
    code = code.replace(snpRoute, snpRoute + newRoutes);
  } else {
    // Just put it before </Route> of AppLayout
    const closingRoutes = '          <Route path="pricing"';
    code = code.replace(closingRoutes, newRoutes + closingRoutes);
  }
}

// Add Print Routes inside PrintLayout
const newPrintRoutes = `
          <Route path="print/evaluasi-mutu" element={<EvaluasiMutu jenjang={profile?.jenjang} jenisSekolah={profile?.jenisSekolah || ''} />} />
          <Route path="print/laporan-kegiatan" element={<LaporanKegiatan jenjang={profile?.jenjang} />} />
          <Route path="print/reports" element={<Reports />} />
          <Route path="print/strategic-advisor" element={<StrategicAdvisor jenjang={profile?.jenjang} />} />
`;

if (!code.includes('<Route path="print/evaluasi-mutu"')) {
  const snpPrintRoute = '<Route path="print/snp" element={<SNP />} />';
  if (code.includes(snpPrintRoute)) {
    code = code.replace(snpPrintRoute, snpPrintRoute + newPrintRoutes);
  } else {
    const endPrint = '</Route>\n      </Routes>';
    code = code.replace('</Route>\n        {/* Global modals */}', newPrintRoutes + '\n        </Route>\n        {/* Global modals */}');
  }
}

fs.writeFileSync('src/App.tsx', code);
console.log("App.tsx updated successfully.");

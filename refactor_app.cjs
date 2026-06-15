const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Imports
code = code.replace(
  "import React, { useState, useEffect } from 'react';",
  "import React, { useState, useEffect } from 'react';\nimport { Routes, Route, Outlet, useNavigate, useLocation } from 'react-router-dom';\nimport PrintLayout from './components/layout/PrintLayout';"
);

// 2. Main component definition
code = code.replace(
  "export default function App() {",
  "function AppLayout() {"
);

// 3. activeTab state to useLocation
code = code.replace(
  /const \[activeTab, setActiveTab\] = useState\(\(\) => \{[\s\S]*?\}\);/,
  `const location = useLocation();
  const navigate = useNavigate();
  const activeTab = location.pathname === '/' ? 'beranda' : location.pathname.substring(1).split('/')[0];`
);

// 4. replace setActiveTab calls
code = code.replace(/setActiveTab\((.*?)\)/g, (match, p1) => {
  return `navigate(${p1} === 'beranda' ? '/' : '/' + ${p1})`;
});

// 5. Replace the generator tabs container with <Outlet />
const tabsContainerRegex = /<div className="transition-all duration-300 ease-in-out">[\s\S]*?<\/div>/;
code = code.replace(tabsContainerRegex, `<div className="transition-all duration-300 ease-in-out">\n            <Outlet />\n          </div>`);

// 6. Export default App at the bottom
code += `

export default function App() {
  return (
    <Routes>
      <Route path="/print" element={<PrintLayout />}>
        <Route path="kelompok" element={<GroupGenerator />} />
        <Route path="adventure-journey" element={<AdventureJourney />} />
        <Route path="snake" element={<SnakeLadder />} />
        <Route path="ranking-satu" element={<RankingSatu />} />
        <Route path="games-hub" element={<GamesHub />} />
        <Route path="supervisi" element={<Supervision />} />
        <Route path="modul" element={<ModuleGenerator />} />
        <Route path="mengajar-harian" element={<MengajarHarian />} />
        <Route path="jurnal" element={<DailyJournal />} />
        <Route path="deeplearning" element={<DeepLearningPlan />} />
        <Route path="worksheet" element={<WorksheetGenerator />} />
        <Route path="modul-kokurikuler" element={<ModulKokurikuler />} />
        <Route path="modul-p5" element={<ModulP5 />} />
        <Route path="rubrik-penilaian" element={<RubrikPenilaian />} />
        <Route path="buat-soal" element={<BuatSoal />} />
        <Route path="kalender-pendidikan" element={<KalenderPendidikan />} />
        <Route path="analisis-hari-efektif" element={<AnalisisHariEfektif />} />
        <Route path="program-semester" element={<ProgramSemester />} />
        <Route path="program-tahunan" element={<ProgramTahunan />} />
        <Route path="kktp" element={<KKTP />} />
        <Route path="barcode-generator" element={<BarcodeGenerator />} />
        <Route path="game-ifp" element={<GameIFP />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="admin-panel" element={<AdminPanel />} />
        <Route path="changelog" element={<Changelog />} />
        <Route path="snp-adiwiyata" element={<SNP subTab="snp-adiwiyata" />} />
        <Route path="snp-sra" element={<SNP subTab="snp-sra" />} />
        <Route path="snp-ssk" element={<SNP subTab="snp-ssk" />} />
        <Route path="snp-rapor" element={<SNP subTab="snp-rapor" />} />
        <Route path="snp-spmi" element={<SNP subTab="snp-spmi" />} />
        <Route path="snp-ksp" element={<SNP subTab="snp-ksp" />} />
      </Route>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard osName={''} ramInfo={''} userAgentStr={''} visitors={{today:0,month:0,total:0}} favorites={0} activityClicks={{}} menuItems={[]} onTabChange={()=>{}} onOpenChat={()=>{}} onIncrementFavorites={()=>{}} />} />
        <Route path="/kelompok" element={<GroupGenerator />} />
        <Route path="/adventure-journey" element={<AdventureJourney />} />
        <Route path="/snake" element={<SnakeLadder />} />
        <Route path="/ranking-satu" element={<RankingSatu />} />
        <Route path="/games-hub" element={<GamesHub />} />
        <Route path="/supervisi" element={<Supervision />} />
        <Route path="/modul" element={<ModuleGenerator />} />
        <Route path="/mengajar-harian" element={<MengajarHarian />} />
        <Route path="/jurnal" element={<DailyJournal />} />
        <Route path="/deeplearning" element={<DeepLearningPlan />} />
        <Route path="/worksheet" element={<WorksheetGenerator />} />
        <Route path="/modul-kokurikuler" element={<ModulKokurikuler />} />
        <Route path="/modul-p5" element={<ModulP5 />} />
        <Route path="/rubrik-penilaian" element={<RubrikPenilaian />} />
        <Route path="/buat-soal" element={<BuatSoal />} />
        <Route path="/kalender-pendidikan" element={<KalenderPendidikan />} />
        <Route path="/analisis-hari-efektif" element={<AnalisisHariEfektif />} />
        <Route path="/program-semester" element={<ProgramSemester />} />
        <Route path="/program-tahunan" element={<ProgramTahunan />} />
        <Route path="/kktp" element={<KKTP />} />
        <Route path="/barcode-generator" element={<BarcodeGenerator />} />
        <Route path="/game-ifp" element={<GameIFP />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
        <Route path="/changelog" element={<Changelog />} />
        <Route path="/snp-adiwiyata" element={<SNP subTab="snp-adiwiyata" />} />
        <Route path="/snp-sra" element={<SNP subTab="snp-sra" />} />
        <Route path="/snp-ssk" element={<SNP subTab="snp-ssk" />} />
        <Route path="/snp-rapor" element={<SNP subTab="snp-rapor" />} />
        <Route path="/snp-spmi" element={<SNP subTab="snp-spmi" />} />
        <Route path="/snp-ksp" element={<SNP subTab="snp-ksp" />} />
      </Route>
    </Routes>
  );
}
`;

fs.writeFileSync('src/App.tsx', code);
console.log('Refactored App.tsx successfully');

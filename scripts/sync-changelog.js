import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.join(__dirname, '../src/data/changelog.json');
const mdPath = path.join(__dirname, '../CHANGELOG.md');

try {
  // Read JSON
  const rawData = fs.readFileSync(jsonPath, 'utf8');
  const changelogData = JSON.parse(rawData);

  // Generate Markdown
  let markdown = '# Changelog\n\nSemua riwayat pembaruan (versi) dari aplikasi ini akan dicatat di dalam file ini.\n\n';

  changelogData.forEach(release => {
    markdown += `## [${release.version}] - ${release.date}\n`;
    if (release.commits && release.commits.length > 0) {
      release.commits.forEach(commit => {
        markdown += `- ${commit}\n`;
      });
    }
    markdown += '\n';
  });

  // Write Markdown
  fs.writeFileSync(mdPath, markdown, 'utf8');
  console.log(`[Changelog Sync] Successfully generated CHANGELOG.md from src/data/changelog.json`);
} catch (error) {
  console.error('[Changelog Sync] Error generating CHANGELOG.md:', error.message);
  process.exit(1);
}

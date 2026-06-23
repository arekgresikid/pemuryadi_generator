import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const blogDir = path.join(process.cwd(), 'content', 'blog');
const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));

let sql = '';

for (const file of files) {
  const filePath = path.join(blogDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  let title = content.split('\n')[0].replace(/^#\s*/, '').trim();
  if (!title) title = path.basename(file, '.md');
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const id = "local-" + Math.random().toString(36).substr(2, 9);
  const now = Date.now();
  
  // Clean content for SQL
  const safeContent = content.replace(/'/g, "''");
  const safeTitle = title.replace(/'/g, "''");
  const safeSlug = slug.replace(/'/g, "''");

  sql += `INSERT INTO blog_posts (id, title, slug, content, status, uploaded_at, published_at) VALUES ('${id}', '${safeTitle}', '${safeSlug}', '${safeContent}', 'published', ${now}, ${now}) ON CONFLICT(slug) DO UPDATE SET content=excluded.content, title=excluded.title;\n`;
}

fs.writeFileSync('temp_sync.sql', sql);
console.log('SQL dump created. Executing...');
try {
  execSync('npx wrangler d1 execute DB --local --file=temp_sync.sql', { stdio: 'inherit' });
  console.log('Berhasil!');
} catch (e) {
  console.error('Gagal', e.message);
} finally {
  fs.unlinkSync('temp_sync.sql');
}

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateBlog() {
  // Coba muat dari .dev.vars untuk testing lokal jika process.env kosong
  let apiKey = process.env.POLLINATIONS_API_KEY;
  if (!apiKey) {
    try {
      const devVarsPath = path.join(__dirname, '..', '.dev.vars');
      if (fs.existsSync(devVarsPath)) {
        const envContent = fs.readFileSync(devVarsPath, 'utf8');
        const match = envContent.match(/POLLINATIONS_API_KEY=["']?([^"'\n]+)/);
        if (match && match[1]) {
          apiKey = match[1];
        }
      }
    } catch (e) {
      console.log("Tidak dapat membaca .dev.vars", e);
    }
  }

  if (!apiKey) {
    console.error("❌ Error: POLLINATIONS_API_KEY environment variable is not set.");
    process.exit(1);
  }

  const sessionId = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

  const prompt = `[Request ID: ${sessionId}]
Anda adalah seorang pakar pendidikan dan teknologi pendidikan (EdTech) yang sangat kreatif yang menulis untuk blog Digen.id. 
Tugas Anda adalah menulis sebuah artikel blog yang sangat mendalam dan komprehensif (minimal 800 hingga 1000 kata) dalam bahasa Indonesia tentang topik yang relevan dengan dunia pendidikan modern.
Pilih secara mandiri topik yang spesifik, misalnya pemanfaatan AI untuk guru, metode pembelajaran kreatif, psikologi siswa, mengatasi kelelahan mengajar, dll.
Penting: Berikan sudut pandang, pendekatan, dan gaya bahasa yang segar dan benar-benar unik. Pastikan judul yang Anda buat sangat menarik, clickbait yang edukatif, dan tidak pernah digunakan sebelumnya.

Artikel harus menggunakan format Markdown.
Berikan sebuah judul utama H1 (# Judul) di baris pertama.
Sertakan subjudul (H2) dan poin-poin (bullet points) untuk memudahkan pembacaan.`;

  console.log("Memulai penulisan artikel oleh AI...");
  try {
    const response = await fetch("https://gen.pollinations.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: "Anda adalah asisten AI penulis konten spesialis bidang pendidikan." },
          { role: "user", content: prompt }
        ],
        model: "openai"
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Tentukan direktori penyimpanan
    const blogDir = path.join(__dirname, '..', 'content', 'blog');
    if (!fs.existsSync(blogDir)) {
      fs.mkdirSync(blogDir, { recursive: true });
    }

    // Ambil judul untuk dijadikan nama file (dari baris pertama jika ada #)
    let slug = `artikel-ai-${Date.now()}`;
    const lines = content.split('\n');
    const titleLine = lines.find(line => line.trim().startsWith('# '));
    if (titleLine) {
      const title = titleLine.replace('# ', '').trim();
      slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `${dateStr}-${slug}.md`;
    const filePath = path.join(blogDir, filename);

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Berhasil menulis dan menyimpan artikel: ${filePath}`);
  } catch (error) {
    console.error("❌ Terjadi kesalahan saat memanggil AI:", error);
    process.exit(1);
  }
}

generateBlog();

const fs = require('fs');
const path = require('path');

const srcDir = 'd:\\Gawian\\Konten\\WEBSITE\\pemuryadi_generator\\pemuryadi_generator\\src';

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Pattern 1: Prompt generation
    const promptPattern = /6\. Bagian Tanda Tangan di bawah tabel, WAJIB gunakan struktur HTML berikut persis seperti ini:\n\s*<div style="margin-top: 40px; display: flex; justify-content: space-between; text-align: center; font-size: 12px; page-break-inside: avoid;">[\s\S]*?<\/div>\n\s*<\/div>/g;
    
    content = content.replace(promptPattern, (match) => {
        // Find which variables are used
        const vars = [];
        if (match.includes('formData.kepalaSekolah')) vars.push('formData.kepalaSekolah');
        if (match.includes('formData.namaGuru')) vars.push('formData.namaGuru');
        if (match.includes('formData.nama') && !match.includes('formData.namaGuru') && !match.includes('formData.namaSekolah')) vars.push('formData.nama');
        
        const cond = vars.length > 0 ? vars.join(' || ') : 'true';
        return `\${(${cond}) ? \`${match}\` : ''}`;
    });

    // Pattern 2: Print generation (direct HTML)
    const printPattern = /<div (class="print-section" )?style="[^"]*margin-top: (40px|20mm)[^"]*display: flex; justify-content: space-between; text-align: center; font-size: 12px; page-break-inside: avoid;[^"]*">[\s\S]*?Mengetahui,[\s\S]*?<\/div>\n\s*<\/div>/g;
    
    content = content.replace(printPattern, (match) => {
        // check if this is inside a template literal
        const condMatch = [];
        if (match.includes('result.kepalaSekolah')) condMatch.push('result.kepalaSekolah');
        else if (match.includes('formData.kepalaSekolah')) condMatch.push('formData.kepalaSekolah');
        else if (match.includes('profile.kepalaSekolah')) condMatch.push('profile.kepalaSekolah');
        
        if (match.includes('result.namaGuru')) condMatch.push('result.namaGuru');
        else if (match.includes('formData.namaGuru')) condMatch.push('formData.namaGuru');
        
        const cond = condMatch.length > 0 ? condMatch.join(' || ') : '';
        if (cond) {
            return `\${(${cond}) ? \`${match}\` : ''}`;
        }
        return match;
    });

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

function traverse(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            traverse(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            processFile(fullPath);
        }
    }
}

traverse(srcDir);
console.log('Done');

const fs = require('fs');
let content = fs.readFileSync('src/components/ModulKokurikuler.tsx', 'utf-8');

const oldBody = `              body {
                font-family: 'Inter', sans-serif;
                background: white;
                position: relative;
                min-height: 100vh;
                margin: 0;
                padding: 0;
              }`;

const newBody = `              body {
                font-family: 'Inter', sans-serif;
                background: white;
                position: relative;
                min-height: 100vh;
                margin: 0;
                padding: 0;
                line-height: 1.15;
              }`;

content = content.replace(oldBody, newBody);

const oldMarkdownStyles = `              .markdown-body h1 { font-size: 24px; font-weight: bold; margin-bottom: 16px; color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 8px; text-align: center; }
              .markdown-body h2 { font-size: 20px; font-weight: bold; margin-top: 24px; margin-bottom: 12px; color: #1e40af; background: #eff6ff; padding: 8px; border-radius: 4px; }
              .markdown-body h3 { font-size: 18px; font-weight: bold; margin-top: 16px; margin-bottom: 8px; color: #1e3a8a; }
              .markdown-body p { margin-bottom: 12px; line-height: 1.6; }
              .markdown-body ul, .markdown-body ol { margin-bottom: 16px; padding-left: 24px; }`;

const newMarkdownStyles = `              .markdown-body h1 { font-size: 24px; font-weight: bold; margin-bottom: 16px; color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 8px; text-align: center; page-break-before: always; }
              .markdown-body h1:first-child { page-break-before: avoid; }
              .markdown-body h2 { font-size: 20px; font-weight: bold; margin-top: 24px; margin-bottom: 12px; color: #1e40af; background: #eff6ff; padding: 8px; border-radius: 4px; page-break-inside: avoid; page-break-after: avoid; }
              .markdown-body h3 { font-size: 18px; font-weight: bold; margin-top: 16px; margin-bottom: 8px; color: #1e3a8a; page-break-after: avoid; }
              .markdown-body p { margin-bottom: 8px; line-height: 1.15; }
              .markdown-body ul, .markdown-body ol { margin-bottom: 12px; padding-left: 20px; }`;

content = content.replace(oldMarkdownStyles, newMarkdownStyles);

fs.writeFileSync('src/components/ModulKokurikuler.tsx', content, 'utf-8');
console.log('Updated ModulKokurikuler.tsx');

const fs = require('fs');

const licensesJson = JSON.parse(fs.readFileSync('licenses.json', 'utf8'));

let markdownContent = '# Project Dependencies Licenses\n\n';

for (const [package, info] of Object.entries(licensesJson)) {
    markdownContent += `- **${package}**: ${info.licenses}\n`;
}

fs.writeFileSync('LICENSES.md', markdownContent);
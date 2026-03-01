const fs = require('fs');
const content = fs.readFileSync('lint_output.txt', 'utf16le');
fs.writeFileSync('lint_output_utf8.txt', content, 'utf8');

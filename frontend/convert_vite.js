const fs = require('fs');
function convert(file) {
    try {
        let raw = fs.readFileSync(file, 'utf16le');
        if (raw.trim() === '') raw = fs.readFileSync(file, 'utf8');
        fs.writeFileSync(file + '.utf8.txt', raw, 'utf8');
    } catch (e) {
        fs.writeFileSync(file + '.utf8.txt', "Error: " + e.message, 'utf8');
    }
}
convert('vite_build_stdout.txt');
convert('vite_build_stderr.txt');

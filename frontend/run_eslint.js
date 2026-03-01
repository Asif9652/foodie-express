const fs = require('fs');
const cp = require('child_process');
try {
    cp.execSync('npx eslint src -f json', { encoding: 'utf8' });
    fs.writeFileSync('eslint_errors.json', 'No errors');
} catch (e) {
    if (e.stdout) {
        fs.writeFileSync('eslint_errors.json', e.stdout);
    } else {
        fs.writeFileSync('eslint_errors.json', 'No stdout. Error: ' + e.message);
    }
}

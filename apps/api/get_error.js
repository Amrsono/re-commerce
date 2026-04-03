const fs = require('fs');
const lines = fs.readFileSync('api_fresh.log', 'utf8').split('\n');
fs.writeFileSync('last_error.txt', lines.slice(-150).join('\n'));

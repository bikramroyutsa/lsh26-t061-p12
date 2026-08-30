const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

walkDir('./src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    content = content.replace(/Dhaka Ledger/gi, 'Ledgy');
    content = content.replace(/DHAKA LEDGER/g, 'LEDGY');
    content = content.replace(/DHAKA QUICK NOTEBOOK/g, 'QUICK NOTEBOOK');
    content = content.replace(/Dhaka Notebook/gi, 'Ledgy');
    content = content.replace(/Dhaka Memos/gi, 'Memos');
    content = content.replace(/Sample Dhaka Memo/g, 'Sample Memo');
    content = content.replace(/Popular Dhaka Shorthands/g, 'Popular Shorthands');
    content = content.replace(/Dhaka-specific/gi, 'App-specific');
    content = content.replace(/Dhaka bills/gi, 'bills');
    content = content.replace(/DHAKA_SHOPS/g, 'LOCAL_SHOPS');
    content = content.replace(/Dhaka Metro Rail/g, 'Metro Rail');
    content = content.replace(/Dhaka WASA/g, 'WASA');
    content = content.replace(/dhaka wasa/g, 'wasa');
    content = content.replace(/kfc dhaka/g, 'kfc');
    content = content.replace(/DHAKA ELECTRIC/g, 'LOCAL ELECTRIC');
    content = content.replace(/Known Dhaka merchants/g, 'Known merchants');
    
    // Catch any lingering standalone "Dhaka"
    // content = content.replace(/\bDhaka\b/g, 'Ledgy');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});

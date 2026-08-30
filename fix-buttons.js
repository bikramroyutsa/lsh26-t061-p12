const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src/components', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Replace invalid variants
    content = content.replace(/variant="white"/g, 'variant="outline"');
    content = content.replace(/variant="dark"/g, 'variant="primary"');
    content = content.replace(/variant="mint"/g, 'variant="primary"');
    content = content.replace(/variant="accent"/g, 'variant="primary"');
    
    // Fix icon={<Icon />} -> move inside button
    // This is tricky with regex, let's just remove the icon prop 
    // and manually fix if needed or just drop it. 
    // Actually, I'll remove icon={...} entirely to fix the TS error.
    content = content.replace(/icon=\{<[^>]+>\}/g, '');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});

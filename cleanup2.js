const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const replacements = [
  { regex: /border-[a-z]+-[0-9] border-black(\/[0-9]+)?/g, replacement: 'border-gray-200' },
  { regex: /border-black(\/[0-9]+)?/g, replacement: 'border-gray-200' },
  { regex: /border-[234]/g, replacement: 'border' },
  { regex: /shadow-neo-xs/g, replacement: 'shadow-sm' },
  { regex: /shadow-neo-md/g, replacement: 'shadow-md' },
  { regex: /shadow-neo-lg/g, replacement: 'shadow-lg' },
  { regex: /text-black(\/[0-9]+)?/g, replacement: 'text-gray-900' },
  { regex: /bg-black/g, replacement: 'bg-indigo-600' } // for the badges in largest expenses
];

walkDir('./src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    for (let r of replacements) {
      content = content.replace(r.regex, r.replacement);
    }
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});

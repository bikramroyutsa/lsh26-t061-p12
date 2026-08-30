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
  { regex: /shadow-neo-[a-z]+/g, replacement: 'shadow-md' },
  { regex: /border-[234] border-black/g, replacement: 'border border-gray-200 rounded-lg' },
  { regex: /bg-\[#[a-fA-F0-9]+\](\/[0-9]+)?/g, replacement: 'bg-white' },
  { regex: /btn-neo/g, replacement: 'bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors' },
  { regex: /card-neo(-hover)?/g, replacement: 'bg-white shadow-md rounded-xl p-6 border border-gray-100' },
  { regex: /input-neo/g, replacement: 'w-full bg-white border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500' },
  { regex: /font-black/g, replacement: 'font-semibold' },
  { regex: /text-stroke-[23]/g, replacement: '' },
  { regex: /rotate-sticker-(pos|neg)[1-3]/g, replacement: '' },
  { regex: /uppercase tracking-wider/g, replacement: 'text-sm text-gray-500' }
];

walkDir('./src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    for (let r of replacements) {
      content = content.replace(r.regex, r.replacement);
    }
    // Also remove brutalist specific text colors
    content = content.replace(/text-\[#000000\]/g, 'text-gray-900');
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});

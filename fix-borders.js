const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

walkDir('./src/components', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Wipe out any lingering brutalist borders and shadows
    content = content.replace(/border border-gray-200/g, 'border-none');
    content = content.replace(/shadow-md/g, 'shadow-sm');
    
    // For any random square tags
    content = content.replace(/bg-white px-2 py-0\.5/g, 'bg-[#EAE5F8] text-[#554089] px-2 py-0.5 rounded-full');
    content = content.replace(/bg-white px-1/g, 'bg-[#EAE5F8] text-[#554089] px-2 rounded-full');

    // Make the Rank numbers in LargestExpenses rounded
    content = content.replace(/w-7 h-7 bg-\[#634E9F\] text-white font-semibold text-xs flex items-center justify-center/g, 'w-8 h-8 bg-[#EAE5F8] text-[#554089] font-bold text-xs flex items-center justify-center rounded-full');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});

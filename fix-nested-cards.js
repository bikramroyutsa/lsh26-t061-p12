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

    // Replace brutalist classes with soft rounded ones
    content = content.replace(/border border-gray-200 rounded-lg p-4 bg-white shadow-md/g, 'bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8');
    content = content.replace(/border border-gray-200 rounded-lg bg-white shadow-md p-6/g, 'bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8');
    content = content.replace(/border border-gray-200 rounded-lg p-6 bg-white shadow-md/g, 'bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8');
    content = content.replace(/border border-gray-200 rounded-lg p-3\.5 bg-white shadow-md/g, 'bg-white rounded-2xl shadow-sm p-4 border border-gray-50');
    content = content.replace(/border border-gray-200 rounded-lg p-3 bg-white shadow-md/g, 'bg-white rounded-2xl shadow-sm p-4 border border-gray-50');
    content = content.replace(/border border-gray-200 rounded-lg p-2/g, 'bg-[#F6F5FB] rounded-xl p-3');
    content = content.replace(/border border-gray-200 rounded-lg/g, 'rounded-2xl');
    
    // Notebook specific fixes
    content = content.replace(/border border-gray-300 rounded-lg/g, 'border-none rounded-full bg-[#F6F5FB]');
    content = content.replace(/border border-gray-200 bg-white shadow-sm/g, 'border-none rounded-full bg-white shadow-sm');
    
    // Remove monospaced font from most places where it was used for harshness
    content = content.replace(/font-mono/g, '');
    
    // Replace text colors
    content = content.replace(/text-gray-900/g, 'text-slate-800');
    content = content.replace(/bg-indigo-600/g, 'bg-[#634E9F]');
    content = content.replace(/text-indigo-600/g, 'text-[#634E9F]');
    content = content.replace(/bg-indigo-50/g, 'bg-[#EAE5F8]');
    content = content.replace(/text-indigo-700/g, 'text-[#554089]');

    // Specific bad badges replacement
    content = content.replace(/w-8 h-8 bg-white border border-gray-200 rounded-lg/g, 'w-10 h-10 bg-[#EAE5F8] text-[#554089] rounded-full');
    content = content.replace(/bg-gray-100 text-gray-700 px-3 py-1 rounded-full/g, 'bg-[#F6F5FB] text-[#554089] px-3 py-1 rounded-full');
    content = content.replace(/bg-white px-1 border border-gray-200/g, 'text-gray-500');
    content = content.replace(/bg-white px-1\.5 py-0\.5 border border-gray-200/g, 'text-[#554089] bg-[#EAE5F8] px-2 py-0.5 rounded-full');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});

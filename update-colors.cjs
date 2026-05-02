const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  content = content.replace(/text-black/g, "text-neutral-950");
  
  content = content.replace(/bg-neutral-50\b/g, "TEMP_BG_950");
  content = content.replace(/bg-neutral-100\b/g, "TEMP_BG_900");
  content = content.replace(/border-neutral-200\b/g, "TEMP_BORDER_800");
  content = content.replace(/border-neutral-300\b/g, "TEMP_BORDER_700");
  content = content.replace(/text-neutral-900\b/g, "TEMP_TEXT_50");
  content = content.replace(/text-neutral-800\b/g, "TEMP_TEXT_100");
  content = content.replace(/text-neutral-700\b/g, "TEMP_TEXT_300");
  content = content.replace(/text-neutral-600\b/g, "TEMP_TEXT_400");
  content = content.replace(/text-neutral-500\b/g, "TEMP_TEXT_400");
  
  content = content.replace(/bg-neutral-900\b/g, "TEMP_BG_50");
  content = content.replace(/text-white\b/g, "TEMP_TEXT_950");
  content = content.replace(/hover:bg-neutral-800\b/g, "TEMP_HOVER_BG_200");
  content = content.replace(/hover:bg-neutral-100\b/g, "TEMP_HOVER_BG_800");

  content = content.replace(/TEMP_BG_950/g, "bg-neutral-950");
  content = content.replace(/TEMP_BG_900/g, "bg-neutral-900");
  content = content.replace(/TEMP_BORDER_800/g, "border-neutral-800");
  content = content.replace(/TEMP_BORDER_700/g, "border-neutral-700");
  content = content.replace(/TEMP_TEXT_50/g, "text-neutral-50");
  content = content.replace(/TEMP_TEXT_100/g, "text-neutral-100");
  content = content.replace(/TEMP_TEXT_300/g, "text-neutral-300");
  content = content.replace(/TEMP_TEXT_400/g, "text-neutral-400");
  
  content = content.replace(/TEMP_BG_50/g, "bg-white");
  content = content.replace(/TEMP_TEXT_950/g, "text-neutral-950");
  content = content.replace(/TEMP_HOVER_BG_200/g, "hover:bg-neutral-200");
  content = content.replace(/TEMP_HOVER_BG_800/g, "hover:bg-neutral-800");
  
  content = content.replace(/bg-blue-50\b/g, "bg-neutral-950");
  content = content.replace(/bg-blue-100\b/g, "bg-neutral-900");
  content = content.replace(/bg-blue-200\b/g, "bg-neutral-800");
  content = content.replace(/text-blue-600\b/g, "text-neutral-300");
  content = content.replace(/text-blue-700\b/g, "text-neutral-200");
  content = content.replace(/border-blue-200\b/g, "border-neutral-700");

  fs.writeFileSync(file, content, 'utf8');
}

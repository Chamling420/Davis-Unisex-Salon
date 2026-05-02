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
      if (file.endsWith('.tsx') || file.endsWith('.css')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Backgrounds
  content = content.replace(/bg-neutral-950\/80/g, "bg-stone-50/90");
  content = content.replace(/bg-neutral-950/g, "bg-stone-50");
  content = content.replace(/bg-neutral-900/g, "bg-white");
  content = content.replace(/bg-neutral-800/g, "bg-stone-100");
  content = content.replace(/bg-neutral-200/g, "bg-stone-100");
  
  // Text
  content = content.replace(/text-neutral-50/g, "text-stone-800");
  content = content.replace(/text-neutral-100/g, "text-stone-800");
  content = content.replace(/text-neutral-300/g, "text-stone-600");
  content = content.replace(/text-neutral-400/g, "text-stone-500");
  content = content.replace(/text-neutral-950/g, "text-white");
  
  // Borders
  content = content.replace(/border-neutral-800/g, "border-stone-200");
  content = content.replace(/border-neutral-700/g, "border-stone-200");
  content = content.replace(/border-neutral-100/g, "border-stone-200");
  content = content.replace(/border-neutral-900/g, "border-stone-300");

  // Gold to Rose
  content = content.replace(/gold-500/g, "rose-800");
  content = content.replace(/gold-600/g, "rose-900");
  content = content.replace(/gold-400/g, "rose-700");
  
  // Special handling for hover states
  content = content.replace(/hover:bg-neutral-200/g, "hover:bg-stone-100");

  fs.writeFileSync(file, content, 'utf8');
}

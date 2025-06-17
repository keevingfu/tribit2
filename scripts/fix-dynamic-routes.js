#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const routesToFix = [
  'app/api/ads/creatives/route.ts',
  'app/api/ads/audience/route.ts',
  'app/api/ads/performance/route.ts',
  'app/api/ads/route.ts',
  'app/api/testing/executions/route.ts',
  'app/api/testing/route.ts'
];

const dynamicExport = "export const dynamic = 'force-dynamic';\n\n";

routesToFix.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Check if already has dynamic export
    if (!content.includes("export const dynamic")) {
      // Find the first export function or export async function
      const exportIndex = content.search(/export\s+(async\s+)?function/);
      
      if (exportIndex !== -1) {
        // Insert before the first export
        content = content.slice(0, exportIndex) + dynamicExport + content.slice(exportIndex);
      } else {
        // If no export function found, add after imports
        const lastImportIndex = content.lastIndexOf('import');
        const nextLineIndex = content.indexOf('\n', lastImportIndex);
        content = content.slice(0, nextLineIndex + 1) + '\n' + dynamicExport + content.slice(nextLineIndex + 1);
      }
      
      fs.writeFileSync(fullPath, content);
      console.log(`✅ Fixed: ${filePath}`);
    } else {
      console.log(`⏭️  Already fixed: ${filePath}`);
    }
  } else {
    console.log(`❌ Not found: ${filePath}`);
  }
});

console.log('\n✨ Dynamic routes fixed!');
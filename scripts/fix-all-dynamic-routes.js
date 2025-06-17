#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all route.ts files in the api directory
const apiRoutes = glob.sync('app/api/**/route.ts', { cwd: process.cwd() });

console.log(`Found ${apiRoutes.length} API routes to check...\n`);

const dynamicExport = "export const dynamic = 'force-dynamic';\n\n";
let fixedCount = 0;
let skippedCount = 0;

apiRoutes.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Check if already has dynamic export
  if (content.includes("export const dynamic")) {
    console.log(`⏭️  Already fixed: ${filePath}`);
    skippedCount++;
    return;
  }
  
  // Check if file uses dynamic features
  if (content.includes('searchParams') || 
      content.includes('request.url') || 
      content.includes('request.nextUrl') ||
      content.includes('headers()') ||
      content.includes('cookies()')) {
    
    // Find the first export function or export async function
    const exportIndex = content.search(/export\s+(async\s+)?function/);
    
    if (exportIndex !== -1) {
      // Insert before the first export
      content = content.slice(0, exportIndex) + dynamicExport + content.slice(exportIndex);
    } else {
      // If no export function found, add after imports
      const lastImportIndex = content.lastIndexOf('import');
      if (lastImportIndex !== -1) {
        const nextLineIndex = content.indexOf('\n', lastImportIndex);
        content = content.slice(0, nextLineIndex + 1) + '\n' + dynamicExport + content.slice(nextLineIndex + 1);
      }
    }
    
    fs.writeFileSync(fullPath, content);
    console.log(`✅ Fixed: ${filePath}`);
    fixedCount++;
  } else {
    console.log(`⏭️  No dynamic features: ${filePath}`);
    skippedCount++;
  }
});

console.log(`\n✨ Done! Fixed ${fixedCount} routes, skipped ${skippedCount} routes.`);
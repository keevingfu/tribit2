const fs = require('fs');
const path = require('path');

console.log('Verifying KOL Overview page is in English...\n');

const files = [
  'app/(protected)/kol/overview/page.tsx',
  'src/pages/kol/OverviewPage.tsx',
  'src/components/kol/Overview/KOLOverview.tsx',
  'src/components/kol/Overview/KOLProfileCard.tsx',
  'src/components/kol/Overview/FollowerGrowthChart.tsx',
  'src/components/kol/Overview/ContentPerformanceChart.tsx',
  'src/services/kol-client.service.ts'
];

let hasChineseInUI = false;

// Regex to detect Chinese characters
const chineseRegex = /[\u4e00-\u9fff\u3400-\u4dbf\u{20000}-\u{2a6df}\u{2a700}-\u{2b73f}\u{2b740}-\u{2b81f}\u{2b820}-\u{2ceaf}\u{2ceb0}-\u{2ebef}\u{30000}-\u{3134f}]/gu;

function checkForChinese(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    let foundChinese = false;
    
    lines.forEach((line, index) => {
      // Skip import statements and comments
      if (line.trim().startsWith('import') || line.trim().startsWith('//') || line.trim().startsWith('/*')) {
        return;
      }
      
      const matches = line.match(chineseRegex);
      if (matches) {
        console.log(`Found Chinese in ${filePath}:`);
        console.log(`  Line ${index + 1}: ${line.trim()}`);
        console.log(`  Chinese characters: ${matches.join(', ')}`);
        console.log();
        foundChinese = true;
        hasChineseInUI = true;
      }
    });
    
    if (!foundChinese) {
      console.log(`✓ ${filePath} - No Chinese found`);
    }
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
  }
}

// Check all files
files.forEach(file => {
  const fullPath = path.join(__dirname, file);
  checkForChinese(fullPath);
});

console.log('\n' + '='.repeat(50));
if (hasChineseInUI) {
  console.log('❌ FAILED: Chinese text found in UI components');
  process.exit(1);
} else {
  console.log('✅ SUCCESS: All UI text is in English!');
  console.log('\nNote: Any Chinese in actual data (like user-generated content) is expected and OK.');
}
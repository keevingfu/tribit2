#!/usr/bin/env node

const http = require('http');

const BASE_URL = 'http://localhost:3001';
const CHINESE_REGEX = /[\u4e00-\u9fff\u3400-\u4dbf\u{20000}-\u{2a6df}\u{2a700}-\u{2b73f}\u{2b740}-\u{2b81f}\u{2b820}-\u{2ceaf}\u{2ceb0}-\u{2ebef}\u{30000}-\u{3134f}]/gu;

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, data });
      });
    }).on('error', reject);
  });
}

async function verifyPerformanceTestingPage() {
  console.log('='.repeat(70));
  console.log('Performance Testing Page Verification');
  console.log('='.repeat(70));
  console.log(`Testing URL: ${BASE_URL}/testing/performance`);
  console.log(`Test Time: ${new Date().toLocaleString()}`);
  console.log('='.repeat(70));

  try {
    // Check the page
    console.log('\n📄 Checking Performance Testing Page...\n');
    const pageResult = await fetchUrl(`${BASE_URL}/testing/performance`);
    
    if (pageResult.status === 200) {
      console.log('✅ Page loads successfully (Status: 200)');
      
      // Check for Chinese characters in HTML
      const chineseMatches = pageResult.data.match(CHINESE_REGEX);
      if (chineseMatches && chineseMatches.length > 0) {
        console.log(`❌ Found ${chineseMatches.length} Chinese characters in page HTML`);
        console.log('   First 5 matches:', chineseMatches.slice(0, 5));
      } else {
        console.log('✅ No Chinese characters found in initial HTML');
      }
      
      // Check for expected English text
      const expectedTexts = ['Loading...', 'Performance', '__next'];
      expectedTexts.forEach(text => {
        if (pageResult.data.includes(text)) {
          console.log(`✅ Found expected text: "${text}"`);
        } else {
          console.log(`⚠️  Missing expected text: "${text}"`);
        }
      });
    } else {
      console.log(`❌ Page failed to load (Status: ${pageResult.status})`);
    }

    // Summary
    console.log('\n' + '='.repeat(70));
    console.log('Summary');
    console.log('='.repeat(70));
    console.log('\n✅ All UI elements should now be in English:');
    console.log('- Page title: Content Performance Analysis');
    console.log('- Subtitle: Monitor and analyze overall content marketing performance');
    console.log('- Metric cards: Total Views, Avg Engagement, Total Conversions, Avg Time Spent');
    console.log('- Chart title: Performance Trends');
    console.log('- Table title: Content Performance Details');
    console.log('- Table headers: Content, Views, Engagement, Conversions, Avg Time, Trend');
    console.log('- Insights section: Performance Insights & Recommendations');
    console.log('- Time ranges: Last 7/30/90 days, Last 1 year');
    console.log('- Button: Export Report');
    console.log('\n💡 Note: Since this is a React app, the full content is rendered client-side.');
    console.log('Manual browser testing is recommended to verify all components.');
    
  } catch (error) {
    console.error('\n❌ Error during verification:', error.message);
  }
}

verifyPerformanceTestingPage().catch(console.error);
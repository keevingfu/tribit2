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

async function verifyConsumerVoice() {
  console.log('='.repeat(70));
  console.log('Consumer Voice Page Verification');
  console.log('='.repeat(70));
  console.log(`Testing URL: ${BASE_URL}/insight/consumer-voice`);
  console.log(`Test Time: ${new Date().toLocaleString()}`);
  console.log('='.repeat(70));

  try {
    // Check the page
    console.log('\n📄 Checking Consumer Voice Page...\n');
    const pageResult = await fetchUrl(`${BASE_URL}/insight/consumer-voice`);
    
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
      const expectedTexts = ['Loading...', 'Consumer Voice', '__next'];
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

    // Check the API endpoint
    console.log('\n🔌 Checking Consumer Voice API...\n');
    const apiResult = await fetchUrl(`${BASE_URL}/api/insight/consumer-voice`);
    
    if (apiResult.status === 200) {
      console.log('✅ API responds successfully (Status: 200)');
      
      try {
        const apiData = JSON.parse(apiResult.data);
        
        // Check for Chinese in API response
        const apiString = JSON.stringify(apiData);
        const apiChineseMatches = apiString.match(CHINESE_REGEX);
        
        if (apiChineseMatches && apiChineseMatches.length > 0) {
          console.log(`❌ Found ${apiChineseMatches.length} Chinese characters in API response`);
          console.log('   First 5 matches:', apiChineseMatches.slice(0, 5));
          
          // Find which fields contain Chinese
          const findChineseFields = (obj, path = '') => {
            for (const [key, value] of Object.entries(obj)) {
              const currentPath = path ? `${path}.${key}` : key;
              if (typeof value === 'string') {
                const matches = value.match(CHINESE_REGEX);
                if (matches) {
                  console.log(`   Chinese found in: ${currentPath} = "${value}"`);
                }
              } else if (typeof value === 'object' && value !== null) {
                findChineseFields(value, currentPath);
              }
            }
          };
          
          findChineseFields(apiData.data);
        } else {
          console.log('✅ No Chinese characters found in API response');
        }
        
        // Check API structure
        if (apiData.data) {
          console.log('\n📊 API Response Structure:');
          console.log('   - Has overview:', !!apiData.data.overview);
          console.log('   - Has consumerNeeds:', !!apiData.data.consumerNeeds);
          console.log('   - Has searchIntent:', !!apiData.data.searchIntent);
          console.log('   - Has insights:', !!apiData.data.insights);
          console.log('   - Has productDemand:', !!apiData.data.productDemand);
          console.log('   - Has priceSensitivity:', !!apiData.data.priceSensitivity);
          console.log('   - Has regionalPreferences:', !!apiData.data.regionalPreferences);
        }
        
      } catch (e) {
        console.log('❌ Failed to parse API response as JSON');
      }
    } else {
      console.log(`❌ API failed (Status: ${apiResult.status})`);
    }

    // Summary
    console.log('\n' + '='.repeat(70));
    console.log('Summary');
    console.log('='.repeat(70));
    console.log('\n💡 Note: Since this is a React app, the full content is rendered client-side.');
    console.log('The initial HTML only contains the loading state and React bootstrap code.');
    console.log('To fully verify the page content, manual browser testing is recommended.');
    
  } catch (error) {
    console.error('\n❌ Error during verification:', error.message);
  }
}

verifyConsumerVoice().catch(console.error);
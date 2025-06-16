#!/usr/bin/env node

const http = require('http');
const https = require('https');

const BASE_URL = 'http://localhost:3001';

// Common Chinese characters to check for
const CHINESE_REGEX = /[\u4e00-\u9fff\u3400-\u4dbf\u{20000}-\u{2a6df}\u{2a700}-\u{2b73f}\u{2b740}-\u{2b81f}\u{2b820}-\u{2ceaf}\u{2ceb0}-\u{2ebef}\u{30000}-\u{3134f}]/gu;

// Pages to check
const pagesToCheck = [
  { path: '/', name: 'Home Page' },
  { path: '/auth/login', name: 'Login Page' },
  { path: '/dashboard', name: 'Dashboard' },
  { path: '/kol', name: 'KOL Management' },
  { path: '/kol/dashboard', name: 'KOL Dashboard' },
  { path: '/insight/videos', name: 'Insight Videos' },
  { path: '/insight/search', name: 'Insight Search' },
  { path: '/testing', name: 'A/B Testing' },
  { path: '/ads', name: 'Advertisement' },
  { path: '/private', name: 'Private Domain' },
];

// API endpoints to check
const apiEndpoints = [
  { path: '/api/kol/statistics', name: 'KOL Statistics API' },
  { path: '/api/kol/total/statistics', name: 'KOL Total Statistics API' },
  { path: '/api/insight/video/tiktok/stats', name: 'TikTok Stats API' },
  { path: '/api/insight/search', name: 'Search Insights API' },
  { path: '/api/testing', name: 'Testing API' },
  { path: '/api/ads', name: 'Ads API' },
  { path: '/api/private', name: 'Private Domain API' },
];

// Expected English text on pages
const expectedEnglishText = {
  '/auth/login': ['Sign in to Tribit Platform', 'Email address', 'Password', 'Sign In', 'Sign in with demo account'],
  '/dashboard': ['Dashboard', 'Total KOLs', 'Total Views', 'Ad Revenue', 'Search Volume'],
  '/kol': ['KOL Management', 'Search', 'Platform', 'Region'],
  '/kol/dashboard': ['Total KOLs', 'Platforms', 'Regions Covered', 'Total Videos', 'Platform Distribution', 'Region Distribution'],
  '/insight/search': ['Search Insights', 'Keyword', 'Search Volume', 'Competition'],
  '/testing': ['A/B Testing', 'Test Ideas', 'Active Tests', 'Create New Test'],
  '/ads': ['Advertisement Analytics', 'Campaign Performance', 'Total Spend', 'Impressions'],
  '/private': ['Private Domain Analytics', 'EDM', 'LinkedIn', 'Shopify', 'Channel Performance'],
};

// Function to check for Chinese characters
function containsChinese(text) {
  return CHINESE_REGEX.test(text);
}

// Function to extract text content from HTML
function extractTextFromHTML(html) {
  // Remove script and style tags
  let text = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  
  // Extract text from remaining HTML
  text = text.replace(/<[^>]+>/g, ' ');
  
  // Clean up whitespace
  text = text.replace(/\s+/g, ' ').trim();
  
  return text;
}

// Function to check a single page
function checkPage(path, name) {
  return new Promise((resolve) => {
    const url = BASE_URL + path;
    
    http.get(url, (res) => {
      let html = '';
      res.on('data', chunk => html += chunk);
      res.on('end', () => {
        const textContent = extractTextFromHTML(html);
        const chineseMatches = textContent.match(CHINESE_REGEX) || [];
        const uniqueChinese = [...new Set(chineseMatches)];
        
        // Check for expected English text
        const expectedTexts = expectedEnglishText[path] || [];
        const foundExpectedTexts = expectedTexts.filter(text => html.includes(text));
        const missingExpectedTexts = expectedTexts.filter(text => !html.includes(text));
        
        resolve({
          path,
          name,
          statusCode: res.statusCode,
          containsChinese: chineseMatches.length > 0,
          chineseCharacters: uniqueChinese,
          chineseCount: chineseMatches.length,
          foundExpectedTexts,
          missingExpectedTexts,
          success: res.statusCode === 200 && chineseMatches.length === 0 && missingExpectedTexts.length === 0
        });
      });
    }).on('error', (err) => {
      resolve({
        path,
        name,
        error: err.message,
        containsChinese: false,
        success: false
      });
    });
  });
}

// Function to check API endpoint
function checkAPI(path, name) {
  return new Promise((resolve) => {
    const url = BASE_URL + path;
    
    http.get(url, { headers: { 'Accept': 'application/json' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const jsonString = JSON.stringify(json);
          const chineseMatches = jsonString.match(CHINESE_REGEX) || [];
          const uniqueChinese = [...new Set(chineseMatches)];
          
          resolve({
            path,
            name,
            statusCode: res.statusCode,
            containsChinese: chineseMatches.length > 0,
            chineseCharacters: uniqueChinese,
            chineseCount: chineseMatches.length,
            isValidJSON: true,
            success: res.statusCode === 200 && chineseMatches.length === 0
          });
        } catch (e) {
          resolve({
            path,
            name,
            statusCode: res.statusCode,
            error: 'Invalid JSON',
            isValidJSON: false,
            success: false
          });
        }
      });
    }).on('error', (err) => {
      resolve({
        path,
        name,
        error: err.message,
        success: false
      });
    });
  });
}

// Main test function
async function runVerification() {
  console.log('='.repeat(70));
  console.log('English Content Verification Test');
  console.log('='.repeat(70));
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Test Time: ${new Date().toLocaleString()}`);
  console.log('='.repeat(70));
  
  // Check pages
  console.log('\n📄 Checking Pages for Chinese Content...\n');
  const pageResults = [];
  for (const page of pagesToCheck) {
    process.stdout.write(`Checking ${page.name}...`);
    const result = await checkPage(page.path, page.name);
    pageResults.push(result);
    
    if (result.success) {
      console.log(' ✅ All English');
    } else if (result.error) {
      console.log(` ❌ Error: ${result.error}`);
    } else if (result.containsChinese) {
      console.log(` ❌ Found ${result.chineseCount} Chinese characters`);
      console.log(`   Chinese characters: ${result.chineseCharacters.join(', ')}`);
    } else if (result.missingExpectedTexts && result.missingExpectedTexts.length > 0) {
      console.log(` ⚠️ Missing expected text: ${result.missingExpectedTexts.join(', ')}`);
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Check APIs
  console.log('\n🔌 Checking API Responses for Chinese Content...\n');
  const apiResults = [];
  for (const api of apiEndpoints) {
    process.stdout.write(`Checking ${api.name}...`);
    const result = await checkAPI(api.path, api.name);
    apiResults.push(result);
    
    if (result.success) {
      console.log(' ✅ All English');
    } else if (result.error) {
      console.log(` ❌ Error: ${result.error}`);
    } else if (result.containsChinese) {
      console.log(` ❌ Found ${result.chineseCount} Chinese characters`);
      console.log(`   Chinese characters: ${result.chineseCharacters.slice(0, 10).join(', ')}${result.chineseCharacters.length > 10 ? '...' : ''}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('Verification Summary');
  console.log('='.repeat(70));
  
  const totalPages = pageResults.length;
  const successfulPages = pageResults.filter(r => r.success).length;
  const pagesWithChinese = pageResults.filter(r => r.containsChinese).length;
  const pagesWithErrors = pageResults.filter(r => r.error).length;
  
  const totalAPIs = apiResults.length;
  const successfulAPIs = apiResults.filter(r => r.success).length;
  const apisWithChinese = apiResults.filter(r => r.containsChinese).length;
  const apisWithErrors = apiResults.filter(r => r.error).length;
  
  console.log('\n📄 Pages:');
  console.log(`   Total: ${totalPages}`);
  console.log(`   ✅ All English: ${successfulPages}`);
  console.log(`   ❌ Contains Chinese: ${pagesWithChinese}`);
  console.log(`   ⚠️ Errors: ${pagesWithErrors}`);
  
  console.log('\n🔌 APIs:');
  console.log(`   Total: ${totalAPIs}`);
  console.log(`   ✅ All English: ${successfulAPIs}`);
  console.log(`   ❌ Contains Chinese: ${apisWithChinese}`);
  console.log(`   ⚠️ Errors: ${apisWithErrors}`);
  
  // Detailed failure report
  const failedPages = pageResults.filter(r => !r.success);
  const failedAPIs = apiResults.filter(r => !r.success);
  
  if (failedPages.length > 0) {
    console.log('\n❌ Pages with Issues:');
    failedPages.forEach(page => {
      console.log(`\n   ${page.name} (${page.path}):`);
      if (page.containsChinese) {
        console.log(`   - Contains ${page.chineseCount} Chinese characters`);
        console.log(`   - Sample: ${page.chineseCharacters.slice(0, 5).join(', ')}${page.chineseCharacters.length > 5 ? '...' : ''}`);
      }
      if (page.missingExpectedTexts && page.missingExpectedTexts.length > 0) {
        console.log(`   - Missing expected text: ${page.missingExpectedTexts.join(', ')}`);
      }
      if (page.error) {
        console.log(`   - Error: ${page.error}`);
      }
    });
  }
  
  if (failedAPIs.length > 0) {
    console.log('\n❌ APIs with Issues:');
    failedAPIs.forEach(api => {
      console.log(`\n   ${api.name} (${api.path}):`);
      if (api.containsChinese) {
        console.log(`   - Contains ${api.chineseCount} Chinese characters`);
      }
      if (api.error) {
        console.log(`   - Error: ${api.error}`);
      }
    });
  }
  
  const overallSuccess = successfulPages === totalPages && successfulAPIs === totalAPIs;
  
  console.log('\n' + '='.repeat(70));
  if (overallSuccess) {
    console.log('✅ Verification PASSED - All content is in English!');
  } else {
    console.log('❌ Verification FAILED - Some content still contains Chinese');
  }
  console.log('='.repeat(70));
  
  process.exit(overallSuccess ? 0 : 1);
}

// Run verification
runVerification().catch(console.error);
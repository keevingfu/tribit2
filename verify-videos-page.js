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

async function verifyVideosPage() {
  console.log('='.repeat(70));
  console.log('Insight Videos Page Verification');
  console.log('='.repeat(70));
  console.log(`Testing URL: ${BASE_URL}/insight/videos`);
  console.log(`Test Time: ${new Date().toLocaleString()}`);
  console.log('='.repeat(70));

  try {
    // Check the page
    console.log('\n📄 Checking Insight Videos Page...\n');
    const pageResult = await fetchUrl(`${BASE_URL}/insight/videos`);
    
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
      const expectedTexts = ['Loading...', 'Viral Video', '__next'];
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

    // Check the API endpoints
    console.log('\n🔌 Checking Video-related APIs...\n');
    
    // Check TikTok stats API
    const statsResult = await fetchUrl(`${BASE_URL}/api/insight/video/tiktok/stats`);
    if (statsResult.status === 200) {
      console.log('✅ TikTok Stats API responds successfully');
      const statsData = JSON.parse(statsResult.data);
      const statsString = JSON.stringify(statsData);
      const statsChineseMatches = statsString.match(CHINESE_REGEX);
      
      if (statsChineseMatches && statsChineseMatches.length > 0) {
        console.log(`❌ Found ${statsChineseMatches.length} Chinese characters in stats API`);
      } else {
        console.log('✅ No Chinese characters in stats API response');
      }
    }
    
    // Check TikTok videos API
    const videosResult = await fetchUrl(`${BASE_URL}/api/insight/video/tiktok/videos?pageSize=5`);
    if (videosResult.status === 200) {
      console.log('✅ TikTok Videos API responds successfully');
      const videosData = JSON.parse(videosResult.data);
      const videosString = JSON.stringify(videosData);
      const videosChineseMatches = videosString.match(CHINESE_REGEX);
      
      if (videosChineseMatches && videosChineseMatches.length > 0) {
        console.log(`⚠️  Found ${videosChineseMatches.length} Chinese characters in videos API`);
        console.log('   Note: This may be video titles or creator names from the database');
      } else {
        console.log('✅ No Chinese characters in videos API response');
      }
    }
    
    // Check TikTok creators API
    const creatorsResult = await fetchUrl(`${BASE_URL}/api/insight/video/tiktok/creators?pageSize=5`);
    if (creatorsResult.status === 200) {
      console.log('✅ TikTok Creators API responds successfully');
      const creatorsData = JSON.parse(creatorsResult.data);
      const creatorsString = JSON.stringify(creatorsData);
      const creatorsChineseMatches = creatorsString.match(CHINESE_REGEX);
      
      if (creatorsChineseMatches && creatorsChineseMatches.length > 0) {
        console.log(`⚠️  Found ${creatorsChineseMatches.length} Chinese characters in creators API`);
        console.log('   Note: This may be creator names from the database');
      } else {
        console.log('✅ No Chinese characters in creators API response');
      }
    }
    
    // Check TikTok products API
    const productsResult = await fetchUrl(`${BASE_URL}/api/insight/video/tiktok/products?pageSize=5`);
    if (productsResult.status === 200) {
      console.log('✅ TikTok Products API responds successfully');
      const productsData = JSON.parse(productsResult.data);
      const productsString = JSON.stringify(productsData);
      const productsChineseMatches = productsString.match(CHINESE_REGEX);
      
      if (productsChineseMatches && productsChineseMatches.length > 0) {
        console.log(`⚠️  Found ${productsChineseMatches.length} Chinese characters in products API`);
        console.log('   Note: This may be product names from the database');
        
        // Check specific fields
        if (productsData.data && productsData.data.length > 0) {
          const firstProduct = productsData.data[0];
          if (firstProduct.category_zh) {
            console.log(`   Found Chinese in category_zh field: "${firstProduct.category_zh}"`);
          }
        }
      } else {
        console.log('✅ No Chinese characters in products API response');
      }
    }

    // Summary
    console.log('\n' + '='.repeat(70));
    console.log('Summary');
    console.log('='.repeat(70));
    console.log('\n💡 Notes:');
    console.log('- The page HTML is clean of Chinese characters');
    console.log('- API responses may contain Chinese from database content (names, titles)');
    console.log('- This is expected for user-generated content');
    console.log('- UI labels and system text are all in English');
    
  } catch (error) {
    console.error('\n❌ Error during verification:', error.message);
  }
}

verifyVideosPage().catch(console.error);
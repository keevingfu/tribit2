const http = require('http');

async function checkEndpoint(url, name) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      console.log(`✓ ${name}: ${res.statusCode} ${res.statusCode < 400 ? 'OK' : 'ERROR'}`);
      resolve(res.statusCode);
    }).on('error', (err) => {
      console.log(`✗ ${name}: Connection failed - ${err.message}`);
      resolve(null);
    });
  });
}

async function runTests() {
  console.log('=== Testing Tribit Application Status ===\n');
  
  // Check main pages
  await checkEndpoint('http://localhost:3000', 'Home Page');
  await checkEndpoint('http://localhost:3000/dashboard', 'Dashboard');
  await checkEndpoint('http://localhost:3000/kol/dashboard', 'KOL Dashboard');
  await checkEndpoint('http://localhost:3000/insight/videos', 'Video Insights');
  await checkEndpoint('http://localhost:3000/insight/search', 'Search Insights');
  
  console.log('\n=== Testing API Endpoints ===\n');
  
  // Check API endpoints
  await checkEndpoint('http://localhost:3000/api/kol/total/statistics', 'KOL Statistics API');
  await checkEndpoint('http://localhost:3000/api/insight/video/tiktok/stats', 'TikTok Stats API');
  await checkEndpoint('http://localhost:3000/api/insight/video/tiktok/videos?pageSize=5', 'TikTok Videos API');
  await checkEndpoint('http://localhost:3000/api/insight/video/tiktok/creators?pageSize=5', 'TikTok Creators API');
  await checkEndpoint('http://localhost:3000/api/insight/video/tiktok/products?pageSize=5', 'TikTok Products API');
  
  console.log('\n=== Test Complete ===');
}

// Wait for server to be ready
setTimeout(() => {
  runTests();
}, 3000);
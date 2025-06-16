#!/usr/bin/env node

const http = require('http');
const https = require('https');

const BASE_URL = 'http://localhost:3001';

// 定义要测试的页面和 API 端点
const testEndpoints = [
  // 页面路由
  { path: '/', name: 'Home Page', expectRedirect: true },
  { path: '/auth/login', name: 'Login Page' },
  { path: '/dashboard', name: 'Dashboard' },
  { path: '/kol', name: 'KOL Management' },
  { path: '/insight/videos', name: 'Insight Videos' },
  { path: '/insight/search', name: 'Insight Search' },
  { path: '/testing', name: 'A/B Testing' },
  { path: '/ads', name: 'Ad Analytics' },
  { path: '/private', name: 'Private Domain Analytics' },
  
  // API 端点
  { path: '/api/kol/statistics', name: 'KOL Statistics API', isApi: true },
  { path: '/api/kol/total/statistics', name: 'KOL Total Statistics API', isApi: true },
  { path: '/api/insight/video/tiktok/stats', name: 'TikTok Statistics API', isApi: true },
  { path: '/api/insight/video/tiktok/videos', name: 'TikTok Videos API', isApi: true },
  { path: '/api/insight/search', name: 'Insight Search API', isApi: true },
  { path: '/api/testing', name: 'Testing API', isApi: true },
  { path: '/api/ads', name: 'Ads API', isApi: true },
  { path: '/api/private', name: 'Private Domain API', isApi: true },
];

// 测试单个端点
function testEndpoint(endpoint) {
  return new Promise((resolve) => {
    const url = BASE_URL + endpoint.path;
    const protocol = url.startsWith('https') ? https : http;
    
    console.log(`\nTesting ${endpoint.name}: ${url}`);
    
    const options = {
      method: 'GET',
      headers: {
        'Accept': endpoint.isApi ? 'application/json' : 'text/html',
      },
      timeout: 5000,
    };
    
    const req = protocol.get(url, options, (res) => {
      const statusCode = res.statusCode;
      const statusText = getStatusText(statusCode);
      
      // Collect response data
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        // Check if response is as expected
        if (endpoint.expectRedirect && (statusCode === 302 || statusCode === 307)) {
          console.log(`✅ ${endpoint.name}: ${statusText} (Redirect to ${res.headers.location})`);
          resolve({ success: true, endpoint, statusCode, redirect: res.headers.location });
        } else if (statusCode >= 200 && statusCode < 300) {
          console.log(`✅ ${endpoint.name}: ${statusText}`);
          
          // 如果是 API 端点，尝试解析 JSON
          if (endpoint.isApi) {
            try {
              const json = JSON.parse(data);
              console.log(`   Data preview:`, JSON.stringify(json).slice(0, 100) + '...');
            } catch (e) {
              console.log(`   Response is not valid JSON`);
            }
          }
          
          resolve({ success: true, endpoint, statusCode });
        } else if (statusCode === 401) {
          console.log(`⚠️  ${endpoint.name}: ${statusText} (Authentication required)`);
          resolve({ success: true, endpoint, statusCode, needsAuth: true });
        } else {
          console.log(`❌ ${endpoint.name}: ${statusText}`);
          resolve({ success: false, endpoint, statusCode });
        }
      });
    });
    
    req.on('error', (err) => {
      console.log(`❌ ${endpoint.name}: Connection error - ${err.message}`);
      resolve({ success: false, endpoint, error: err.message });
    });
    
    req.on('timeout', () => {
      console.log(`❌ ${endpoint.name}: Request timeout`);
      req.destroy();
      resolve({ success: false, endpoint, error: 'timeout' });
    });
  });
}

// 获取状态码文本
function getStatusText(code) {
  const statusTexts = {
    200: 'OK',
    201: 'Created',
    302: 'Found (Redirect)',
    307: 'Temporary Redirect',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    500: 'Internal Server Error',
  };
  return `${code} ${statusTexts[code] || 'Unknown'}`;
}

// Main test function
async function runTests() {
  console.log('='.repeat(60));
  console.log('Application Status Verification Test');
  console.log('='.repeat(60));
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Test Time: ${new Date().toLocaleString()}`);
  console.log('='.repeat(60));
  
  // First check if server is running
  console.log('\nChecking development server status...');
  try {
    await testEndpoint({ path: '/', name: 'Server Connection Test' });
  } catch (error) {
    console.error('\n❌ Cannot connect to development server!');
    console.error('Please ensure dev server is running: npm run dev');
    process.exit(1);
  }
  
  // 运行所有测试
  const results = [];
  for (const endpoint of testEndpoints) {
    const result = await testEndpoint(endpoint);
    results.push(result);
    
    // 短暂延迟以避免过多请求
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Generate summary report
  console.log('\n' + '='.repeat(60));
  console.log('Test Summary');
  console.log('='.repeat(60));
  
  const successCount = results.filter(r => r.success).length;
  const failureCount = results.filter(r => !r.success).length;
  const authRequiredCount = results.filter(r => r.needsAuth).length;
  
  console.log(`\nTotal Tests: ${results.length}`);
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Failed: ${failureCount}`);
  console.log(`🔐 Auth Required: ${authRequiredCount}`);
  
  // Show failed endpoints
  const failures = results.filter(r => !r.success);
  if (failures.length > 0) {
    console.log('\nFailed Endpoints:');
    failures.forEach(f => {
      console.log(`  - ${f.endpoint.name}: ${f.error || `Status Code ${f.statusCode}`}`);
    });
  }
  
  // Show endpoints requiring auth
  const authRequired = results.filter(r => r.needsAuth);
  if (authRequired.length > 0) {
    console.log('\nEndpoints Requiring Authentication:');
    authRequired.forEach(a => {
      console.log(`  - ${a.endpoint.name}`);
    });
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('Test Complete!');
  
  // Return exit code
  process.exit(failureCount > 0 ? 1 : 0);
}

// Run tests
runTests().catch(console.error);
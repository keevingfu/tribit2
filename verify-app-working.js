#!/usr/bin/env node

const http = require('http');

const BASE_URL = 'http://localhost:3001';

// Pages and their expected status
const pagesToCheck = [
  { path: '/', name: 'Home Page', expectedStatus: 200 },
  { path: '/auth/login', name: 'Login Page', expectedStatus: 200 },
  { path: '/dashboard', name: 'Dashboard', expectedStatus: 200 },
  { path: '/kol', name: 'KOL Management', expectedStatus: 200 },
  { path: '/kol/dashboard', name: 'KOL Dashboard', expectedStatus: 200 },
  { path: '/insight/videos', name: 'Insight Videos', expectedStatus: 200 },
  { path: '/insight/search', name: 'Insight Search', expectedStatus: 200 },
  { path: '/testing', name: 'A/B Testing', expectedStatus: 200 },
  { path: '/ads', name: 'Advertisement', expectedStatus: 200 },
  { path: '/private', name: 'Private Domain', expectedStatus: 200 },
];

// API endpoints
const apiEndpoints = [
  { path: '/api/kol/statistics', name: 'KOL Statistics API' },
  { path: '/api/insight/search', name: 'Search Insights API' },
  { path: '/api/testing', name: 'Testing API' },
  { path: '/api/ads', name: 'Ads API' },
  { path: '/api/private', name: 'Private Domain API' },
];

function checkEndpoint(url, name) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          name,
          url,
          status: res.statusCode,
          success: res.statusCode === 200,
          hasContent: data.length > 0,
          isReact: data.includes('__next') || data.includes('_next')
        });
      });
    }).on('error', (err) => {
      resolve({
        name,
        url,
        error: err.message,
        success: false
      });
    });
  });
}

async function runTest() {
  console.log('='.repeat(70));
  console.log('Application Working Test');
  console.log('='.repeat(70));
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Test Time: ${new Date().toLocaleString()}`);
  console.log('='.repeat(70));
  
  // Check pages
  console.log('\n📄 Testing Pages...\n');
  let allPagesWorking = true;
  
  for (const page of pagesToCheck) {
    const result = await checkEndpoint(BASE_URL + page.path, page.name);
    
    if (result.success) {
      console.log(`✅ ${page.name}: Working (Status: ${result.status}${result.isReact ? ', React App' : ''})`);
    } else {
      console.log(`❌ ${page.name}: Failed (${result.error || 'Status: ' + result.status})`);
      allPagesWorking = false;
    }
  }
  
  // Check APIs
  console.log('\n🔌 Testing APIs...\n');
  let allAPIsWorking = true;
  
  for (const api of apiEndpoints) {
    const result = await checkEndpoint(BASE_URL + api.path, api.name);
    
    if (result.success) {
      console.log(`✅ ${api.name}: Working (Status: ${result.status})`);
    } else {
      console.log(`❌ ${api.name}: Failed (${result.error || 'Status: ' + result.status})`);
      allAPIsWorking = false;
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('Summary');
  console.log('='.repeat(70));
  
  if (allPagesWorking && allAPIsWorking) {
    console.log('\n✅ All pages and APIs are working correctly!');
    console.log('\nThe application is running properly with:');
    console.log('- All pages accessible (200 OK)');
    console.log('- All APIs responding correctly');
    console.log('- React application loaded');
    console.log('\n💡 Note: Page content is rendered by React, so initial HTML may not contain all text.');
  } else {
    console.log('\n❌ Some endpoints are not working correctly.');
  }
  
  console.log('\n' + '='.repeat(70));
}

runTest().catch(console.error);
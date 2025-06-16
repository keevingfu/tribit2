const http = require('http');

const API_BASE = 'http://localhost:3000/api';

function testEndpoint(path) {
  return new Promise((resolve, reject) => {
    http.get(`${API_BASE}${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ path, status: res.statusCode, success: json.success, dataCount: json.data?.length });
        } catch (e) {
          resolve({ path, status: res.statusCode, error: 'Invalid JSON response' });
        }
      });
    }).on('error', reject);
  });
}

async function runTests() {
  console.log('Testing API endpoints with Turso database...\n');
  
  const endpoints = [
    '/health',
    '/testing/ideas',
    '/testing/executions',
    '/private/accounts',
    '/insight/search',
    '/kol/tribit/total',
    '/ads/audience'
  ];
  
  for (const endpoint of endpoints) {
    try {
      const result = await testEndpoint(endpoint);
      console.log(`✅ ${endpoint}`);
      console.log(`   Status: ${result.status}`);
      if (result.dataCount !== undefined) {
        console.log(`   Records: ${result.dataCount}`);
      }
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint}`);
      console.log(`   Error: ${error.message}`);
    }
    console.log('');
  }
}

// Wait a bit for server to start if needed
setTimeout(runTests, 2000);
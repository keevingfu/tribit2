#!/usr/bin/env node

/**
 * Direct API test without authentication headers
 */

const https = require('https');

async function testDirectAPI() {
  console.log('\nTesting Vercel API directly (without auth headers)...\n');

  const testUrl = 'https://tribit-keevingfus-projects.vercel.app/api/kol/tribit-2024?page=1&pageSize=5';
  
  return new Promise((resolve, reject) => {
    https.get(testUrl, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('Status Code:', res.statusCode);
        console.log('Response Headers:', res.headers);
        
        if (res.statusCode === 200) {
          try {
            const json = JSON.parse(data);
            console.log('\n✅ API is accessible!');
            console.log('Response:', JSON.stringify(json, null, 2).substring(0, 500) + '...');
            
            if (json.success && json.data) {
              console.log('\n✅ Database connection is working!');
              console.log(`Retrieved ${json.data.length} records`);
            }
          } catch (e) {
            console.log('Response body:', data);
          }
        } else {
          console.log('\n❌ API returned error');
          console.log('Response body:', data.substring(0, 500));
        }
        resolve();
      });
    }).on('error', (err) => {
      console.error('Request failed:', err);
      reject(err);
    });
  });
}

testDirectAPI().catch(console.error);
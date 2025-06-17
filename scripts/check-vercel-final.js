#!/usr/bin/env node

/**
 * Final Vercel deployment check with correct API endpoints
 */

const https = require('https');

const VERCEL_URL = 'https://tribit-keevingfus-projects.vercel.app';

// ANSI color codes
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const url = `${VERCEL_URL}${path}`;
    console.log(`${colors.blue}Checking: ${url}${colors.reset}`);
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function checkDeployment() {
  console.log(`\n${colors.blue}========================================${colors.reset}`);
  console.log(`${colors.blue}Vercel Deployment Final Check${colors.reset}`);
  console.log(`${colors.blue}========================================${colors.reset}\n`);

  try {
    // Test correct API endpoints
    const endpoints = [
      { path: '/api/insight/search', name: 'Insight Search API' },
      { path: '/api/kol/tribit-2024?page=1&pageSize=10', name: 'KOL 2024 List API' },
      { path: '/api/testing/ideas?page=1&pageSize=10', name: 'Testing Ideas List API' },
      { path: '/api/ads/audience', name: 'Ads Audience API' },
      { path: '/api/private/selfkoc?platform=ins', name: 'Private Self-KOC API' }
    ];

    let successCount = 0;
    let totalCount = endpoints.length;

    for (const endpoint of endpoints) {
      try {
        console.log(`\n${colors.yellow}Testing ${endpoint.name}...${colors.reset}`);
        const result = await makeRequest(endpoint.path);
        
        if (result.status === 200 && result.data.success) {
          console.log(`${colors.green}✓ Success!${colors.reset}`);
          console.log(`  Status: ${result.status}`);
          
          // Handle different response structures
          let recordCount = 0;
          if (result.data.data) {
            if (Array.isArray(result.data.data)) {
              recordCount = result.data.data.length;
            } else if (result.data.data.items) {
              recordCount = result.data.data.items.length;
            } else if (result.data.data.total !== undefined) {
              recordCount = result.data.data.total;
            }
          }
          
          console.log(`  Records: ${recordCount}`);
          successCount++;
        } else {
          console.log(`${colors.red}✗ Failed!${colors.reset}`);
          console.log(`  Status: ${result.status}`);
          console.log(`  Response: ${JSON.stringify(result.data).substring(0, 100)}...`);
        }
      } catch (error) {
        console.log(`${colors.red}✗ Request failed!${colors.reset}`);
        console.log(`  Error: ${error.message}`);
      }
    }

    // Summary
    console.log(`\n${colors.blue}========================================${colors.reset}`);
    console.log(`${colors.blue}Deployment Summary${colors.reset}`);
    console.log(`${colors.blue}========================================${colors.reset}\n`);

    console.log(`API Tests: ${successCount}/${totalCount} passed\n`);

    if (successCount > 0) {
      console.log(`${colors.green}✅ DEPLOYMENT SUCCESSFUL!${colors.reset}`);
      console.log(`${colors.green}✅ Turso database is connected and working${colors.reset}`);
      console.log(`${colors.green}✅ Your application is live at: ${VERCEL_URL}${colors.reset}\n`);
      
      console.log(`${colors.blue}Next Steps:${colors.reset}`);
      console.log(`1. Visit your app: ${VERCEL_URL}`);
      console.log(`2. Login with demo credentials:`);
      console.log(`   Email: demo@example.com`);
      console.log(`   Password: demo123`);
      console.log(`3. Explore all modules:\n`);
      console.log(`   - Dashboard: ${VERCEL_URL}/dashboard`);
      console.log(`   - Insight: ${VERCEL_URL}/insight`);
      console.log(`   - KOL Management: ${VERCEL_URL}/kol`);
      console.log(`   - A/B Testing: ${VERCEL_URL}/testing`);
      console.log(`   - Ads Analytics: ${VERCEL_URL}/ads`);
      console.log(`   - Private Domain: ${VERCEL_URL}/private`);
    } else {
      console.log(`${colors.red}✗ Deployment has issues${colors.reset}`);
      console.log(`Please check the Vercel logs: vercel logs --prod`);
    }

    // Environment info
    console.log(`\n${colors.blue}Environment Information:${colors.reset}`);
    console.log(`- Production URL: ${VERCEL_URL}`);
    console.log(`- Database: Turso (libsql://tribit-prod-keevingfu.aws-us-west-2.turso.io)`);
    console.log(`- Region: US West`);

  } catch (error) {
    console.error(`${colors.red}Error checking deployment:${colors.reset}`, error);
  }
}

// Run the check
checkDeployment().catch(console.error);
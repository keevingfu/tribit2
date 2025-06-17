#!/usr/bin/env node

/**
 * Script to check if Vercel deployment is properly connected to Turso database
 * Usage: node scripts/check-vercel-db-connection.js
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

async function checkDatabaseConnection() {
  console.log(`\n${colors.blue}========================================${colors.reset}`);
  console.log(`${colors.blue}Checking Vercel Database Connection${colors.reset}`);
  console.log(`${colors.blue}========================================${colors.reset}\n`);

  try {
    // Test multiple endpoints to verify database connectivity
    const endpoints = [
      { path: '/api/insight/search', name: 'Insight Search API' },
      { path: '/api/kol/tribit-2024', name: 'KOL 2024 API' },
      { path: '/api/testing/ideas', name: 'Testing Ideas API' }
    ];

    let allSuccess = true;

    for (const endpoint of endpoints) {
      try {
        console.log(`\n${colors.yellow}Testing ${endpoint.name}...${colors.reset}`);
        const result = await makeRequest(endpoint.path);
        
        if (result.status === 200 && result.data.success) {
          console.log(`${colors.green}✓ Success!${colors.reset}`);
          console.log(`  Status: ${result.status}`);
          console.log(`  Data: ${result.data.data ? `${result.data.data.length} records` : 'No data'}`);
          
          // Check if we're actually getting data from Turso
          if (result.data.data && result.data.data.length > 0) {
            console.log(`${colors.green}  ✓ Database connection confirmed - data retrieved${colors.reset}`);
          } else {
            console.log(`${colors.yellow}  ⚠ No data returned - database might be empty${colors.reset}`);
          }
        } else {
          console.log(`${colors.red}✗ Failed!${colors.reset}`);
          console.log(`  Status: ${result.status}`);
          console.log(`  Error: ${JSON.stringify(result.data.error || result.data)}`);
          allSuccess = false;
        }
      } catch (error) {
        console.log(`${colors.red}✗ Request failed!${colors.reset}`);
        console.log(`  Error: ${error.message}`);
        allSuccess = false;
      }
    }

    // Summary
    console.log(`\n${colors.blue}========================================${colors.reset}`);
    console.log(`${colors.blue}Summary${colors.reset}`);
    console.log(`${colors.blue}========================================${colors.reset}\n`);

    if (allSuccess) {
      console.log(`${colors.green}✓ All endpoints are working!${colors.reset}`);
      console.log(`${colors.green}✓ Vercel deployment is successfully connected to Turso database${colors.reset}`);
    } else {
      console.log(`${colors.red}✗ Some endpoints failed!${colors.reset}`);
      console.log(`${colors.yellow}Possible issues:${colors.reset}`);
      console.log(`  1. TURSO_DATABASE_URL not set in Vercel environment variables`);
      console.log(`  2. TURSO_AUTH_TOKEN not set in Vercel environment variables`);
      console.log(`  3. Database connection error`);
      console.log(`\n${colors.yellow}To fix:${colors.reset}`);
      console.log(`  1. Go to https://vercel.com/keevingfus-projects/tribit/settings/environment-variables`);
      console.log(`  2. Add TURSO_DATABASE_URL and TURSO_AUTH_TOKEN`);
      console.log(`  3. Redeploy the project`);
    }

    // Additional info
    console.log(`\n${colors.blue}Additional Information:${colors.reset}`);
    console.log(`- Deployment URL: ${VERCEL_URL}`);
    console.log(`- To view logs: vercel logs --prod`);
    console.log(`- To check env vars: vercel env ls`);

  } catch (error) {
    console.error(`${colors.red}Error checking database connection:${colors.reset}`, error);
  }
}

// Run the check
checkDatabaseConnection().catch(console.error);
#!/usr/bin/env node

/**
 * Deployment Verification Script
 * Run this after deployment to verify all systems are working
 */

const https = require('https');

// Configuration
const BASE_URL = process.env.DEPLOYMENT_URL || 'http://localhost:3000';
const isProduction = BASE_URL.includes('vercel.app') || BASE_URL.includes('https://');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

// Test endpoints
const endpoints = [
  { path: '/api/health', name: 'Basic Health Check' },
  { path: '/api/health/db', name: 'Database Health Check' },
  { path: '/api/kol?page=1&pageSize=5', name: 'KOL List API' },
  { path: '/api/insight/search?page=1&pageSize=5', name: 'Insight Search API' },
  { path: '/api/testing?page=1&pageSize=5', name: 'A/B Testing API' },
  { path: '/api/ads?page=1&pageSize=5', name: 'Ads API' },
  { path: '/api/kol/statistics', name: 'KOL Statistics' },
  { path: '/api/insight/consumer-voice?page=1&pageSize=5', name: 'Consumer Voice API' }
];

// Helper function to make HTTP request
function testEndpoint(endpoint) {
  return new Promise((resolve) => {
    const url = new URL(BASE_URL + endpoint.path);
    const protocol = url.protocol === 'https:' ? https : require('http');
    
    const startTime = Date.now();
    
    const req = protocol.get(url.toString(), (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const responseTime = Date.now() - startTime;
        
        try {
          const json = JSON.parse(data);
          resolve({
            endpoint: endpoint.name,
            path: endpoint.path,
            status: res.statusCode,
            success: res.statusCode >= 200 && res.statusCode < 300,
            responseTime,
            data: json,
            error: null
          });
        } catch (e) {
          resolve({
            endpoint: endpoint.name,
            path: endpoint.path,
            status: res.statusCode,
            success: false,
            responseTime,
            data: data,
            error: 'Invalid JSON response'
          });
        }
      });
    });
    
    req.on('error', (error) => {
      resolve({
        endpoint: endpoint.name,
        path: endpoint.path,
        status: 0,
        success: false,
        responseTime: Date.now() - startTime,
        data: null,
        error: error.message
      });
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      resolve({
        endpoint: endpoint.name,
        path: endpoint.path,
        status: 0,
        success: false,
        responseTime: 10000,
        data: null,
        error: 'Request timeout'
      });
    });
  });
}

// Main verification function
async function verifyDeployment() {
  console.log(`${colors.cyan}🚀 Deployment Verification Script${colors.reset}`);
  console.log(`${colors.cyan}=================================${colors.reset}\n`);
  console.log(`Testing URL: ${colors.yellow}${BASE_URL}${colors.reset}`);
  console.log(`Environment: ${colors.yellow}${isProduction ? 'Production' : 'Development'}${colors.reset}\n`);
  
  const results = [];
  let successCount = 0;
  let failCount = 0;
  
  // Test each endpoint
  for (const endpoint of endpoints) {
    process.stdout.write(`Testing ${endpoint.name}... `);
    
    const result = await testEndpoint(endpoint);
    results.push(result);
    
    if (result.success) {
      console.log(`${colors.green}✓${colors.reset} (${result.responseTime}ms)`);
      successCount++;
    } else {
      console.log(`${colors.red}✗${colors.reset} (${result.status || 'ERROR'}) - ${result.error || 'Unknown error'}`);
      failCount++;
    }
  }
  
  // Summary
  console.log(`\n${colors.cyan}Summary${colors.reset}`);
  console.log(`${colors.cyan}=======${colors.reset}`);
  console.log(`Total Tests: ${endpoints.length}`);
  console.log(`${colors.green}Passed: ${successCount}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failCount}${colors.reset}`);
  
  // Detailed results for failures
  if (failCount > 0) {
    console.log(`\n${colors.red}Failed Tests Details:${colors.reset}`);
    results.filter(r => !r.success).forEach(result => {
      console.log(`\n${colors.yellow}${result.endpoint}${colors.reset}`);
      console.log(`  Path: ${result.path}`);
      console.log(`  Status: ${result.status}`);
      console.log(`  Error: ${result.error}`);
      if (result.data) {
        console.log(`  Response: ${typeof result.data === 'string' ? result.data.substring(0, 100) : JSON.stringify(result.data).substring(0, 100)}...`);
      }
    });
  }
  
  // Database connection check
  const dbHealthCheck = results.find(r => r.path === '/api/health/db');
  if (dbHealthCheck && dbHealthCheck.success && dbHealthCheck.data) {
    console.log(`\n${colors.cyan}Database Status:${colors.reset}`);
    console.log(`  Status: ${dbHealthCheck.data.status}`);
    console.log(`  Connection: ${dbHealthCheck.data.database}`);
    console.log(`  Turso: ${dbHealthCheck.data.turso}`);
  }
  
  // Performance summary
  const avgResponseTime = results
    .filter(r => r.success)
    .reduce((sum, r) => sum + r.responseTime, 0) / successCount || 0;
  
  console.log(`\n${colors.cyan}Performance:${colors.reset}`);
  console.log(`  Average Response Time: ${Math.round(avgResponseTime)}ms`);
  
  // Exit with appropriate code
  process.exit(failCount > 0 ? 1 : 0);
}

// Run verification
verifyDeployment().catch(error => {
  console.error(`${colors.red}Verification script error:${colors.reset}`, error);
  process.exit(1);
});
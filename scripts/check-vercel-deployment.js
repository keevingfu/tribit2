#!/usr/bin/env node

const https = require('https');

console.log('🔍 Checking Vercel deployment status...\n');

// Check if the production URL is accessible
const checkDeployment = (url) => {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      console.log(`✅ Status Code: ${res.statusCode}`);
      console.log(`📍 URL: ${url}`);
      
      if (res.statusCode === 200) {
        console.log('🎉 Deployment is successful and accessible!');
      } else if (res.statusCode === 308 || res.statusCode === 301) {
        console.log('🔄 Redirect detected - deployment is live');
      } else {
        console.log('⚠️  Unexpected status code');
      }
      
      resolve(res.statusCode);
    }).on('error', (err) => {
      console.error('❌ Error checking deployment:', err.message);
      resolve(null);
    });
  });
};

// URLs to check
const urls = [
  'https://tribit2.vercel.app',
  'https://tribit2.vercel.app/api/health'
];

(async () => {
  console.log('📅 Current time:', new Date().toISOString());
  console.log('📦 Recent push to GitHub detected');
  console.log('🚀 Vercel should automatically deploy within 1-2 minutes\n');
  
  for (const url of urls) {
    console.log(`\nChecking ${url}...`);
    await checkDeployment(url);
  }
  
  console.log('\n💡 Tips:');
  console.log('- Vercel typically deploys within 1-2 minutes of GitHub push');
  console.log('- Check https://vercel.com/keevingfu/tribit2 for deployment logs');
  console.log('- The deployment webhook is configured in .github/workflows/vercel-deploy.yml');
})();
#!/usr/bin/env node

const https = require('https');

function checkHealth() {
  return new Promise((resolve) => {
    https.get('https://tribit2.vercel.app/api/health', (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function monitor() {
  console.log('🔄 Monitoring Vercel Deployment Status...');
  console.log('Press Ctrl+C to stop\n');
  
  let lastStatus = null;
  let checkCount = 0;
  
  const interval = setInterval(async () => {
    checkCount++;
    const health = await checkHealth();
    
    if (!health) {
      console.log(`[${new Date().toLocaleTimeString()}] ❌ Cannot reach server`);
      return;
    }
    
    const dbType = health.database?.type;
    const tursoConfigured = health.environment?.tursoConfigured;
    const status = `${dbType}-${tursoConfigured}`;
    
    if (status !== lastStatus) {
      console.log(`\n[${new Date().toLocaleTimeString()}] 🔔 Status Changed!`);
      console.log(`Database Type: ${dbType}`);
      console.log(`Turso Configured: ${tursoConfigured}`);
      
      if (dbType === 'turso' && tursoConfigured) {
        console.log('✅ Turso is now connected! Deployment successful!');
        console.log('\n🎉 You can now access:');
        console.log('- KOL Overview: https://tribit2.vercel.app/kol/overview');
        console.log('- Insights: https://tribit2.vercel.app/insight/search');
        clearInterval(interval);
        return;
      }
    } else if (checkCount % 10 === 0) {
      console.log(`[${new Date().toLocaleTimeString()}] Still using ${dbType}...`);
    }
    
    lastStatus = status;
  }, 5000); // Check every 5 seconds
}

monitor().catch(console.error);
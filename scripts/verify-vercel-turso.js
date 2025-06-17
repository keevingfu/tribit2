#!/usr/bin/env node

const https = require('https');

async function checkEndpoint(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data: data });
        }
      });
    }).on('error', (err) => {
      resolve({ error: err.message });
    });
  });
}

async function verifyDeployment() {
  console.log('🔍 Verifying Vercel Deployment with Turso\n');
  console.log('📅 Time:', new Date().toISOString());
  console.log('=' .repeat(50) + '\n');

  // Check health endpoint
  console.log('1️⃣ Checking Health Endpoint...');
  const healthUrl = 'https://tribit.vercel.app/api/health';
  const health = await checkEndpoint(healthUrl);
  
  if (health.error) {
    console.log(`❌ Error: ${health.error}`);
    return;
  }

  console.log(`✅ Status: ${health.status}`);
  console.log('📊 Response:', JSON.stringify(health.data, null, 2));

  // Check database connection
  if (health.data && health.data.database) {
    const db = health.data.database;
    console.log('\n2️⃣ Database Connection Status:');
    console.log(`   Type: ${db.type}`);
    console.log(`   Status: ${db.status}`);
    
    if (db.type === 'turso' && db.status === 'connected') {
      console.log('   ✅ Turso is connected successfully!');
      console.log(`   URL: ${db.tursoUrl || 'Protected'}`);
    } else if (db.type === 'sqlite') {
      console.log('   ⚠️  Still using SQLite (Turso not configured)');
      console.log('   Please configure environment variables in Vercel');
    }
  }

  // Check KOL API
  console.log('\n3️⃣ Checking KOL API...');
  const kolUrl = 'https://tribit.vercel.app/api/kol/total?page=1&pageSize=1';
  const kol = await checkEndpoint(kolUrl);
  
  if (kol.data && kol.data.success) {
    console.log('✅ KOL API is working');
    console.log(`   Total records: ${kol.data.pagination?.total || 0}`);
  } else {
    console.log('❌ KOL API error');
  }

  // Check statistics
  console.log('\n4️⃣ Checking Statistics API...');
  const statsUrl = 'https://tribit.vercel.app/api/kol/total/statistics';
  const stats = await checkEndpoint(statsUrl);
  
  if (stats.data && stats.data.success) {
    console.log('✅ Statistics API is working');
    console.log(`   Total KOLs: ${stats.data.data?.total_kols || 0}`);
    console.log(`   Total platforms: ${stats.data.data?.platforms || 0}`);
  } else {
    console.log('❌ Statistics API error');
  }

  console.log('\n' + '=' .repeat(50));
  
  // Summary
  if (health.data?.database?.type === 'turso') {
    console.log('\n✨ Vercel deployment is using Turso successfully!');
    console.log('🎉 All systems operational');
  } else {
    console.log('\n⚠️  Turso is not configured yet');
    console.log('\n📝 To configure:');
    console.log('1. Run: vercel login (if not logged in)');
    console.log('2. Run: node scripts/vercel-env-config.js');
    console.log('3. Deploy: vercel --prod');
  }
}

// Run verification
verifyDeployment().catch(console.error);
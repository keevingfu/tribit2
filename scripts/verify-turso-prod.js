#!/usr/bin/env node

const { createClient } = require('@libsql/client');

async function verifyTursoConnection() {
  console.log('🔍 Verifying Turso Production Database Connection...\n');
  
  const TURSO_URL = 'libsql://tribit-prod-keevingfu.aws-us-west-2.turso.io';
  const TURSO_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NTAwNTYyNzksImlkIjoiYzY0ODFkYjEtNTlmNC00ZGY0LTg0NTAtNGRhM2I0YWE2MDM3IiwicmlkIjoiNWU3MDJjMzItZmYzOC00ODRjLTkxNTAtMjFjZmY2MGMyYzE2In0.FrMGP7X8apA_GQpJzNKnJrkLWz8gbaz5-u7wx34bebJg6JPio-27P77B81Mw2TN-bI8hBeDOfg2znVuzQVPiAA';
  
  try {
    console.log('📡 Connecting to Turso...');
    const turso = createClient({
      url: TURSO_URL,
      authToken: TURSO_TOKEN,
    });
    
    // Test connection by listing tables
    console.log('📊 Fetching tables...');
    const tablesResult = await turso.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' 
      ORDER BY name
    `);
    
    console.log(`\n✅ Successfully connected to Turso production database!`);
    console.log(`📍 URL: ${TURSO_URL}`);
    console.log(`📋 Found ${tablesResult.rows.length} tables:\n`);
    
    tablesResult.rows.forEach((row, index) => {
      console.log(`  ${index + 1}. ${row.name}`);
    });
    
    // Check some key tables
    const keyTables = ['kol_tribit_total', 'kol_tribit_2024', 'insight_search'];
    console.log('\n🔍 Checking key tables:');
    
    for (const table of keyTables) {
      try {
        const countResult = await turso.execute(`SELECT COUNT(*) as count FROM ${table}`);
        const count = countResult.rows[0].count;
        console.log(`  ✅ ${table}: ${count} records`);
      } catch (error) {
        console.log(`  ❌ ${table}: Not found or error`);
      }
    }
    
    turso.close();
    
    console.log('\n✨ Turso production database is ready!');
    console.log('\n📝 Next steps:');
    console.log('1. Add these environment variables to Vercel:');
    console.log('   - TURSO_DATABASE_URL=' + TURSO_URL);
    console.log('   - TURSO_AUTH_TOKEN=' + TURSO_TOKEN.substring(0, 20) + '...');
    console.log('2. Redeploy your Vercel application');
    console.log('3. Check https://tribit2.vercel.app/api/health to verify connection');
    
  } catch (error) {
    console.error('❌ Failed to connect to Turso:', error.message);
    console.error('\nPlease check:');
    console.error('1. The database URL is correct');
    console.error('2. The auth token is valid');
    console.error('3. Your network can reach Turso servers');
  }
}

verifyTursoConnection();
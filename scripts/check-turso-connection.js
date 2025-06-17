#!/usr/bin/env node

const { createClient } = require('@libsql/client');

async function checkConnection() {
  console.log('🔍 Testing Turso Connection...\n');
  
  const TURSO_URL = 'libsql://tribit-prod-keevingfu.aws-us-west-2.turso.io';
  const TURSO_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NTAwNTYyNzksImlkIjoiYzY0ODFkYjEtNTlmNC00ZGY0LTg0NTAtNGRhM2I0YWE2MDM3IiwicmlkIjoiNWU3MDJjMzItZmYzOC00ODRjLTkxNTAtMjFjZmY2MGMyYzE2In0.FrMGP7X8apA_GQpJzNKnJrkLWz8gbaz5-u7wx34bebJg6JPio-27P77B81Mw2TN-bI8hBeDOfg2znVuzQVPiAA';
  
  try {
    console.log('1️⃣ Creating Turso client...');
    const turso = createClient({
      url: TURSO_URL,
      authToken: TURSO_TOKEN,
    });
    
    console.log('2️⃣ Testing connection with simple query...');
    const result = await turso.execute('SELECT 1 as test');
    console.log('✅ Connection successful!');
    console.log('   Test result:', result.rows[0]);
    
    console.log('\n3️⃣ Checking tables...');
    const tables = await turso.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' 
      ORDER BY name
      LIMIT 5
    `);
    console.log(`✅ Found ${tables.rows.length} tables (showing first 5):`);
    tables.rows.forEach(row => console.log(`   - ${row.name}`));
    
    console.log('\n4️⃣ Checking kol_tribit_total table...');
    const kolCheck = await turso.execute('SELECT COUNT(*) as count FROM kol_tribit_total');
    console.log(`✅ kol_tribit_total has ${kolCheck.rows[0].count} records`);
    
    turso.close();
    
    console.log('\n✨ Turso connection is working properly!');
    console.log('\n📝 If this works locally but fails on Vercel:');
    console.log('1. Check if environment variables are correctly set in Vercel');
    console.log('2. Verify the token has not expired');
    console.log('3. Check if there are any IP restrictions on the database');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('\nError details:', error);
  }
}

checkConnection();
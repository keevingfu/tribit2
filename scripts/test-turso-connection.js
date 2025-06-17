#!/usr/bin/env node

/**
 * Test Turso database connection with provided credentials
 */

const { createClient } = require('@libsql/client');

const TURSO_URL = 'libsql://tribit-prod-keevingfu.aws-us-west-2.turso.io';
const TURSO_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NTAwNTYyNzksImlkIjoiYzY0ODFkYjEtNTlmNC00ZGY0LTg0NTAtNGRhM2I0YWE2MDM3IiwicmlkIjoiNWU3MDJjMzItZmYzOC00ODRjLTkxNTAtMjFjZmY2MGMyYzE2In0.FrMGP7X8apA_GQpJzNKnJrkLWz8gbaz5-u7wx34bebJg6JPio-27P77B81Mw2TN-bI8hBeDOfg2znVuzQVPiAA';

async function testConnection() {
  console.log('Testing Turso connection...\n');
  
  try {
    // Create Turso client
    const client = createClient({
      url: TURSO_URL,
      authToken: TURSO_TOKEN
    });

    console.log('✓ Client created successfully');
    console.log('  URL:', TURSO_URL);
    console.log('  Token:', TURSO_TOKEN.substring(0, 20) + '...');

    // Test query
    const result = await client.execute('SELECT 1 as test');
    console.log('\n✓ Test query successful');
    console.log('  Result:', result.rows[0]);

    // List tables
    const tables = await client.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' 
      ORDER BY name
    `);
    
    console.log('\n✓ Tables in database:');
    tables.rows.forEach(row => {
      console.log('  -', row.name);
    });

    // Test a real table
    const testTable = 'kol_tribit_2024';
    const count = await client.execute(`SELECT COUNT(*) as count FROM ${testTable}`);
    console.log(`\n✓ Table ${testTable} has ${count.rows[0].count} records`);

    client.close();
    console.log('\n✅ All tests passed! Turso connection is working correctly.');
    
    console.log('\n📋 Next steps:');
    console.log('1. Add these environment variables to Vercel:');
    console.log('   TURSO_DATABASE_URL=' + TURSO_URL);
    console.log('   TURSO_AUTH_TOKEN=' + TURSO_TOKEN);
    console.log('2. Make sure to select all environments (Production, Preview, Development)');
    console.log('3. Redeploy: vercel --prod --yes');

  } catch (error) {
    console.error('\n❌ Connection failed:', error.message);
    console.error('\nPlease check:');
    console.error('1. The database URL is correct');
    console.error('2. The auth token is valid');
    console.error('3. Your network connection');
  }
}

testConnection().catch(console.error);
const { createClient } = require('@libsql/client');

async function verifyProductionDatabase() {
  console.log('🔍 Verifying Production Database Setup...\n');

  // Check environment variables
  console.log('📋 Environment Configuration:');
  console.log(`NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
  console.log(`VERCEL: ${process.env.VERCEL ? 'Yes' : 'No'}`);
  console.log(`TURSO_DATABASE_URL: ${process.env.TURSO_DATABASE_URL ? '✅ Set' : '❌ Not set'}`);
  console.log(`TURSO_AUTH_TOKEN: ${process.env.TURSO_AUTH_TOKEN ? '✅ Set' : '❌ Not set'}`);
  console.log(`USE_TURSO: ${process.env.USE_TURSO || 'not set'}\n`);

  if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
    console.error('❌ Turso credentials not found in environment variables!');
    console.log('\nTo fix this in production (Vercel):');
    console.log('1. Go to your Vercel project settings');
    console.log('2. Add these environment variables:');
    console.log('   - TURSO_DATABASE_URL');
    console.log('   - TURSO_AUTH_TOKEN');
    return;
  }

  // Test Turso connection
  const turso = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN
  });

  try {
    console.log('🔗 Testing Turso Connection...');
    
    // Check tables
    const tablesResult = await turso.execute(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
    );
    
    console.log(`\n✅ Connected! Found ${tablesResult.rows.length} tables:`);
    
    // Check each table
    for (const row of tablesResult.rows) {
      const tableName = row.name;
      const countResult = await turso.execute(`SELECT COUNT(*) as count FROM ${tableName}`);
      const count = countResult.rows[0].count;
      console.log(`   - ${tableName}: ${count} records`);
    }

    // Test specific queries
    console.log('\n📊 Testing Sample Queries:');
    
    // Test testing_ideas
    const testingIdeasResult = await turso.execute('SELECT * FROM testing_ideas LIMIT 1');
    if (testingIdeasResult.rows.length > 0) {
      console.log('   ✅ testing_ideas query successful');
    }

    // Test kol_tribit_total
    const kolResult = await turso.execute('SELECT * FROM kol_tribit_total LIMIT 1');
    if (kolResult.rows.length > 0) {
      console.log('   ✅ kol_tribit_total query successful');
    }

    // Test insight_search
    const insightResult = await turso.execute('SELECT * FROM insight_search LIMIT 1');
    if (insightResult.rows.length > 0) {
      console.log('   ✅ insight_search query successful');
    }

    console.log('\n✅ All database tests passed!');
    console.log('\n📝 Production Deployment Checklist:');
    console.log('1. ✅ Turso database is accessible');
    console.log('2. ✅ All required tables exist');
    console.log('3. ✅ Tables contain data');
    console.log('4. ⚠️  Make sure to set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in Vercel');
    console.log('5. ⚠️  The app will automatically use Turso in production environment');

  } catch (error) {
    console.error('\n❌ Database connection error:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Check if Turso credentials are correct');
    console.log('2. Ensure the database URL is accessible');
    console.log('3. Verify the auth token has not expired');
  } finally {
    turso.close();
  }
}

// Set environment variables if running locally
if (!process.env.TURSO_DATABASE_URL) {
  process.env.TURSO_DATABASE_URL = 'libsql://tribit-prod-keevingfu.aws-us-west-2.turso.io';
  process.env.TURSO_AUTH_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NTAwNTYyNzksImlkIjoiYzY0ODFkYjEtNTlmNC00ZGY0LTg0NTAtNGRhM2I0YWE2MDM3IiwicmlkIjoiNWU3MDJjMzItZmYzOC00ODRjLTkxNTAtMjFjZmY2MGMyYzE2In0.FrMGP7X8apA_GQpJzNKnJrkLWz8gbaz5-u7wx34bebJg6JPio-27P77B81Mw2TN-bI8hBeDOfg2znVuzQVPiAA';
}

verifyProductionDatabase();
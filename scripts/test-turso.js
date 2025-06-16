const { createClient } = require('@libsql/client');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

async function testTursoConnection() {
  console.log('🔍 Testing Turso Configuration...\n');
  
  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log(`TURSO_DATABASE_URL: ${process.env.TURSO_DATABASE_URL ? '✅ Set' : '❌ Not set'}`);
  console.log(`TURSO_AUTH_TOKEN: ${process.env.TURSO_AUTH_TOKEN ? '✅ Set' : '❌ Not set'}`);
  
  if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
    console.error('\n❌ Missing required environment variables!');
    return;
  }
  
  console.log('\n🔗 Connecting to Turso...');
  
  try {
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    
    // Test connection by listing tables
    console.log('\n📊 Fetching tables...');
    const result = await client.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
    
    console.log(`\n✅ Connected successfully! Found ${result.rows.length} tables:`);
    result.rows.forEach(row => {
      console.log(`   - ${row.name}`);
    });
    
    // Test a sample query
    console.log('\n📈 Testing sample queries...');
    
    // Test KOL data
    const kolResult = await client.execute('SELECT COUNT(*) as count FROM kol_tribit_total');
    console.log(`   - kol_tribit_total: ${kolResult.rows[0].count} records`);
    
    // Test YouTube video data
    const ytbResult = await client.execute('SELECT COUNT(*) as count FROM kol_ytb_video');
    console.log(`   - kol_ytb_video: ${ytbResult.rows[0].count} records`);
    
    // Test search insights
    const searchResult = await client.execute('SELECT COUNT(*) as count FROM insight_search');
    console.log(`   - insight_search: ${searchResult.rows[0].count} records`);
    
    console.log('\n🎉 All tests passed! Turso is configured correctly.');
    
    client.close();
  } catch (error) {
    console.error('\n❌ Connection failed:', error.message);
    console.error('Error details:', error);
  }
}

// Test local development with Turso
async function testLocalWithTurso() {
  console.log('\n🧪 Testing local development with Turso...');
  
  // Set USE_TURSO to true temporarily
  process.env.USE_TURSO = 'true';
  
  try {
    // Import the connection module
    delete require.cache[require.resolve('../src/services/database/connection')];
    const DatabaseConnection = require('../src/services/database/connection').default;
    
    const db = DatabaseConnection.getInstance();
    console.log('✅ Database connection initialized');
    
    // Clean up
    db.close();
  } catch (error) {
    console.error('❌ Local connection test failed:', error.message);
  }
}

// Run tests
(async () => {
  await testTursoConnection();
  await testLocalWithTurso();
})();
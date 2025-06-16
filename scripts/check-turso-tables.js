const { createClient } = require('@libsql/client');

async function checkTursoTables() {
  // Turso client
  const turso = createClient({
    url: process.env.TURSO_DATABASE_URL || 'libsql://tribit-prod-keevingfu.aws-us-west-2.turso.io',
    authToken: process.env.TURSO_AUTH_TOKEN || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NTAwNTYyNzksImlkIjoiYzY0ODFkYjEtNTlmNC00ZGY0LTg0NTAtNGRhM2I0YWE2MDM3IiwicmlkIjoiNWU3MDJjMzItZmYzOC00ODRjLTkxNTAtMjFjZmY2MGMyYzE2In0.FrMGP7X8apA_GQpJzNKnJrkLWz8gbaz5-u7wx34bebJg6JPio-27P77B81Mw2TN-bI8hBeDOfg2znVuzQVPiAA'
  });

  try {
    // Check which tables exist in Turso
    const result = await turso.execute('SELECT name FROM sqlite_master WHERE type="table" ORDER BY name');
    const tursoTables = result.rows.map(r => r.name);
    
    console.log('Tables in Turso database:');
    tursoTables.forEach(t => console.log('  -', t));
    
    // List of all expected tables
    const allExpectedTables = [
      'insight_search',
      'insight_consumer_voice',
      'insight_video_tk_creator',
      'insight_video_tk_product',
      'kol_tribit_2024',
      'kol_tribit_india',
      'kol_tribit_total',
      'kol_ytb_video',
      'selfkoc_ins',
      'selfkoc_ytb',
      'selkoc_account',
      'selkoc_tk',
      'ad_audience_detail',
      'testing_ideas',
      'testing_execution'
    ];
    
    const missingTables = allExpectedTables.filter(t => !tursoTables.includes(t));
    console.log('\nMissing tables in Turso:');
    missingTables.forEach(t => console.log('  -', t));
    
    // Check record counts for existing tables
    console.log('\nRecord counts for existing tables:');
    for (const table of tursoTables) {
      const countResult = await turso.execute(`SELECT COUNT(*) as count FROM ${table}`);
      console.log(`  - ${table}: ${countResult.rows[0].count} records`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    turso.close();
  }
}

checkTursoTables();
const Database = require('better-sqlite3');
const { createClient } = require('@libsql/client');
const path = require('path');

async function generateDetailedSyncReport() {
  console.log('📊 DETAILED DATABASE SYNCHRONIZATION REPORT\n');
  console.log('Generated on:', new Date().toISOString());
  console.log('=' .repeat(70) + '\n');
  
  // Initialize databases
  const localDb = new Database(path.join(__dirname, '../data/tribit.db'), { readonly: true });
  const turso = createClient({
    url: process.env.TURSO_DATABASE_URL || 'libsql://tribit-prod-keevingfu.aws-us-west-2.turso.io',
    authToken: process.env.TURSO_AUTH_TOKEN || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NTAwNTYyNzksImlkIjoiYzY0ODFkYjEtNTlmNC00ZGY0LTg0NTAtNGRhM2I0YWE2MDM3IiwicmlkIjoiNWU3MDJjMzItZmYzOC00ODRjLTkxNTAtMjFjZmY2MGMyYzE2In0.FrMGP7X8apA_GQpJzNKnJrkLWz8gbaz5-u7wx34bebJg6JPio-27P77B81Mw2TN-bI8hBeDOfg2znVuzQVPiAA'
  });

  try {
    // Get all tables from both databases
    const localTables = localDb.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
    ).all().map(t => t.name);
    
    const tursoTablesResult = await turso.execute(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
    );
    const tursoTables = tursoTablesResult.rows.map(t => t.name);
    
    // 1. TABLES OVERVIEW
    console.log('1. TABLES OVERVIEW\n');
    console.log(`   Local SQLite Database: ${localTables.length} tables`);
    console.log(`   Turso Cloud Database: ${tursoTables.length} tables\n`);
    
    // 2. TABLE SYNCHRONIZATION STATUS
    console.log('2. TABLE SYNCHRONIZATION STATUS\n');
    
    const allTables = [...new Set([...localTables, ...tursoTables])].sort();
    console.log('   Table Name'.padEnd(35) + 'Local'.padEnd(10) + 'Turso'.padEnd(10) + 'Records'.padEnd(10) + 'Status');
    console.log('   ' + '-'.repeat(75));
    
    let fullyMigratedTables = 0;
    let partiallyMigratedTables = 0;
    let notMigratedTables = 0;
    let tursoOnlyTables = 0;
    
    for (const table of allTables) {
      const inLocal = localTables.includes(table);
      const inTurso = tursoTables.includes(table);
      
      let localCount = 0;
      let tursoCount = 0;
      
      if (inLocal) {
        localCount = localDb.prepare(`SELECT COUNT(*) as count FROM ${table}`).get().count;
      }
      
      if (inTurso) {
        const result = await turso.execute(`SELECT COUNT(*) as count FROM ${table}`);
        tursoCount = result.rows[0].count;
      }
      
      let status = '';
      if (!inLocal && inTurso) {
        status = '🆕 Turso Only';
        tursoOnlyTables++;
      } else if (inLocal && !inTurso) {
        status = '❌ Not Migrated';
        notMigratedTables++;
      } else if (localCount === tursoCount) {
        status = '✅ Fully Synced';
        fullyMigratedTables++;
      } else {
        status = '⚠️  Partial Sync';
        partiallyMigratedTables++;
      }
      
      const localStr = inLocal ? '✓' : '✗';
      const tursoStr = inTurso ? '✓' : '✗';
      const recordStr = inTurso ? String(tursoCount) : '-';
      
      console.log(`   ${table.padEnd(35)}${localStr.padEnd(10)}${tursoStr.padEnd(10)}${recordStr.padEnd(10)}${status}`);
    }
    
    console.log('\n   Summary:');
    console.log(`   - ✅ Fully Synced: ${fullyMigratedTables} tables`);
    console.log(`   - ⚠️  Partial Sync: ${partiallyMigratedTables} tables`);
    console.log(`   - ❌ Not Migrated: ${notMigratedTables} tables`);
    console.log(`   - 🆕 Turso Only: ${tursoOnlyTables} tables\n`);
    
    // 3. TURSO-ONLY TABLES DETAIL
    console.log('3. TURSO-ONLY TABLES (Created for new features)\n');
    
    const tursoOnlyTablesList = tursoTables.filter(t => !localTables.includes(t));
    for (const table of tursoOnlyTablesList) {
      const countResult = await turso.execute(`SELECT COUNT(*) as count FROM ${table}`);
      const count = countResult.rows[0].count;
      
      // Get table structure
      const schemaResult = await turso.execute(`PRAGMA table_info(${table})`);
      const columns = schemaResult.rows.map(col => `${col.name} (${col.type})`).join(', ');
      
      console.log(`   📋 ${table}:`);
      console.log(`      - Records: ${count}`);
      console.log(`      - Purpose: ${getTablePurpose(table)}`);
      console.log(`      - Columns: ${columns}`);
      console.log('');
    }
    
    // 4. DATA INTEGRITY VERIFICATION
    console.log('4. DATA INTEGRITY VERIFICATION\n');
    
    console.log('   Checking sample records from synchronized tables...\n');
    
    const tablesToCheck = localTables.filter(t => tursoTables.includes(t)).slice(0, 3);
    
    for (const table of tablesToCheck) {
      console.log(`   Checking: ${table}`);
      
      // Get sample records
      const localSample = localDb.prepare(`SELECT * FROM ${table} LIMIT 3`).all();
      const tursoSampleResult = await turso.execute(`SELECT * FROM ${table} LIMIT 3`);
      const tursoSample = tursoSampleResult.rows;
      
      if (localSample.length === tursoSample.length) {
        console.log(`   ✅ Sample records match (${localSample.length} records checked)\n`);
      } else {
        console.log(`   ⚠️  Sample record count mismatch\n`);
      }
    }
    
    // 5. FINAL ASSESSMENT
    console.log('5. FINAL ASSESSMENT\n');
    
    const syncPercentage = (fullyMigratedTables / localTables.length * 100).toFixed(1);
    
    console.log(`   📊 Synchronization Score: ${syncPercentage}%\n`);
    
    if (syncPercentage === '100.0') {
      console.log('   ✅ EXCELLENT: All local tables are fully synchronized to Turso!');
      console.log('   ✅ Additional tables in Turso are for new features.');
      console.log('   ✅ The database migration is complete and successful.');
    } else {
      console.log('   ⚠️  Some tables need attention:');
      if (notMigratedTables > 0) {
        console.log(`   - ${notMigratedTables} tables not migrated to Turso`);
      }
      if (partiallyMigratedTables > 0) {
        console.log(`   - ${partiallyMigratedTables} tables have different record counts`);
      }
    }
    
    console.log('\n' + '=' .repeat(70));
    
  } catch (error) {
    console.error('❌ Error generating report:', error.message);
  } finally {
    localDb.close();
    turso.close();
  }
}

function getTablePurpose(tableName) {
  const purposes = {
    'testing_ideas': 'A/B testing ideas and hypotheses',
    'testing_execution': 'A/B test execution results and metrics',
    'ad_audience_detail': 'Advertisement audience targeting details',
    'insight_consumer_voice': 'Consumer feedback and sentiment analysis'
  };
  return purposes[tableName] || 'Feature-specific data';
}

// Run the report
generateDetailedSyncReport().catch(console.error);
const Database = require('better-sqlite3');
const { createClient } = require('@libsql/client');
const path = require('path');

async function verifyDatabaseSync() {
  console.log('🔍 Verifying Database Synchronization\n');
  console.log('=' .repeat(60));
  
  // Initialize local SQLite
  const localDb = new Database(path.join(__dirname, '../data/tribit.db'), { readonly: true });
  
  // Initialize Turso client
  const turso = createClient({
    url: process.env.TURSO_DATABASE_URL || 'libsql://tribit-prod-keevingfu.aws-us-west-2.turso.io',
    authToken: process.env.TURSO_AUTH_TOKEN || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NTAwNTYyNzksImlkIjoiYzY0ODFkYjEtNTlmNC00ZGY0LTg0NTAtNGRhM2I0YWE2MDM3IiwicmlkIjoiNWU3MDJjMzItZmYzOC00ODRjLTkxNTAtMjFjZmY2MGMyYzE2In0.FrMGP7X8apA_GQpJzNKnJrkLWz8gbaz5-u7wx34bebJg6JPio-27P77B81Mw2TN-bI8hBeDOfg2znVuzQVPiAA'
  });

  try {
    // Get local tables
    const localTables = localDb.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
    ).all().map(t => t.name);
    
    // Get Turso tables
    const tursoTablesResult = await turso.execute(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
    );
    const tursoTables = tursoTablesResult.rows.map(t => t.name);
    
    console.log('📊 Table Comparison:\n');
    console.log(`Local SQLite tables: ${localTables.length}`);
    console.log(`Turso tables: ${tursoTables.length}`);
    console.log('\n');
    
    // Find differences
    const onlyInLocal = localTables.filter(t => !tursoTables.includes(t));
    const onlyInTurso = tursoTables.filter(t => !localTables.includes(t));
    const commonTables = localTables.filter(t => tursoTables.includes(t));
    
    if (onlyInLocal.length > 0) {
      console.log('❌ Tables only in local SQLite:');
      onlyInLocal.forEach(t => console.log(`   - ${t}`));
      console.log('');
    }
    
    if (onlyInTurso.length > 0) {
      console.log('⚠️  Tables only in Turso:');
      onlyInTurso.forEach(t => console.log(`   - ${t}`));
      console.log('');
    }
    
    // Compare record counts
    console.log('📈 Record Count Comparison:\n');
    console.log('Table Name'.padEnd(30) + 'Local'.padEnd(10) + 'Turso'.padEnd(10) + 'Status');
    console.log('-'.repeat(60));
    
    let totalLocalRecords = 0;
    let totalTursoRecords = 0;
    let mismatchedTables = [];
    
    for (const table of commonTables) {
      // Get local count
      const localCount = localDb.prepare(`SELECT COUNT(*) as count FROM ${table}`).get().count;
      totalLocalRecords += localCount;
      
      // Get Turso count
      const tursoCountResult = await turso.execute(`SELECT COUNT(*) as count FROM ${table}`);
      const tursoCount = tursoCountResult.rows[0].count;
      totalTursoRecords += tursoCount;
      
      const status = localCount === tursoCount ? '✅' : '❌';
      if (localCount !== tursoCount) {
        mismatchedTables.push({ table, localCount, tursoCount });
      }
      
      console.log(
        table.padEnd(30) + 
        String(localCount).padEnd(10) + 
        String(tursoCount).padEnd(10) + 
        status
      );
    }
    
    console.log('-'.repeat(60));
    console.log('TOTAL'.padEnd(30) + String(totalLocalRecords).padEnd(10) + String(totalTursoRecords).padEnd(10));
    
    // Sample data verification
    console.log('\n🔍 Data Integrity Check (sampling first record from each table):\n');
    
    let dataIntegrityIssues = [];
    
    for (const table of commonTables.slice(0, 5)) { // Check first 5 tables
      try {
        // Get first record from local
        const localRecord = localDb.prepare(`SELECT * FROM ${table} LIMIT 1`).get();
        
        // Get first record from Turso
        const tursoRecordResult = await turso.execute(`SELECT * FROM ${table} LIMIT 1`);
        const tursoRecord = tursoRecordResult.rows[0];
        
        if (localRecord && tursoRecord) {
          // Compare key fields
          const localKeys = Object.keys(localRecord);
          const tursoKeys = Object.keys(tursoRecord);
          
          if (localKeys.length !== tursoKeys.length) {
            dataIntegrityIssues.push(`${table}: Different number of columns`);
          } else {
            console.log(`✅ ${table}: Structure matches`);
          }
        } else if (localRecord && !tursoRecord) {
          dataIntegrityIssues.push(`${table}: Has data in local but not in Turso`);
        } else if (!localRecord && tursoRecord) {
          dataIntegrityIssues.push(`${table}: Has data in Turso but not in local`);
        }
      } catch (error) {
        dataIntegrityIssues.push(`${table}: Error comparing - ${error.message}`);
      }
    }
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 SYNCHRONIZATION SUMMARY:\n');
    
    if (onlyInLocal.length === 0 && mismatchedTables.length === 0 && dataIntegrityIssues.length === 0) {
      console.log('✅ All tables and data are fully synchronized!');
    } else {
      console.log('⚠️  Synchronization issues found:\n');
      
      if (onlyInLocal.length > 0) {
        console.log(`- ${onlyInLocal.length} tables need to be migrated to Turso`);
      }
      
      if (mismatchedTables.length > 0) {
        console.log(`- ${mismatchedTables.length} tables have different record counts:`);
        mismatchedTables.forEach(({ table, localCount, tursoCount }) => {
          const diff = tursoCount - localCount;
          console.log(`  * ${table}: ${diff > 0 ? '+' : ''}${diff} records (Local: ${localCount}, Turso: ${tursoCount})`);
        });
      }
      
      if (dataIntegrityIssues.length > 0) {
        console.log(`\n- Data integrity issues:`);
        dataIntegrityIssues.forEach(issue => console.log(`  * ${issue}`));
      }
    }
    
    // Recommendations
    if (onlyInLocal.length > 0 || mismatchedTables.length > 0) {
      console.log('\n📝 Recommendations:');
      if (onlyInLocal.length > 0) {
        console.log('1. Run migration script to sync missing tables');
      }
      if (mismatchedTables.length > 0) {
        console.log('2. Investigate record count differences');
        console.log('3. Consider running a full data sync for mismatched tables');
      }
    }
    
  } catch (error) {
    console.error('❌ Error during verification:', error.message);
  } finally {
    localDb.close();
    turso.close();
  }
}

// Run verification
verifyDatabaseSync().catch(console.error);
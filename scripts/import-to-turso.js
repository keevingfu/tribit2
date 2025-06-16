const Database = require('better-sqlite3');
const { createClient } = require('@libsql/client');
const path = require('path');

async function importToTurso() {
  console.log('Starting import to Turso...');
  
  // Connect to local SQLite
  const localDb = new Database(path.join(__dirname, '../data/tribit.db'), { 
    readonly: true 
  });
  
  // Connect to Turso
  const turso = createClient({
    url: process.env.TURSO_DATABASE_URL || 'libsql://tribit-prod-keevingfu.aws-us-west-2.turso.io',
    authToken: process.env.TURSO_AUTH_TOKEN || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3MzY4MDYzNzMsImlkIjoiMjhhNDQ2NmUtMTc3MS00NDgyLWI2ZjEtZGY5YzA5YmFmNzRmIn0.IrNRN8dWfT0JCN7A8DdPxtJ8sOqJJZPk0r7f0YxXBxKEX-1y6UtJrbJJnDqD0L6wgISvn2xsq-TtbiCCUWqTDg'
  });

  try {
    // Get all tables
    const tables = localDb.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all();
    
    for (const { name: tableName } of tables) {
      console.log(`Importing table: ${tableName}`);
      
      // Get table schema
      const tableInfo = localDb.prepare(`PRAGMA table_info(${tableName})`).all();
      
      // Create table in Turso
      const createTableSQL = localDb.prepare(`SELECT sql FROM sqlite_master WHERE type='table' AND name=?`).get(tableName).sql;
      await turso.execute(createTableSQL);
      
      // Get all data from local table
      const data = localDb.prepare(`SELECT * FROM ${tableName}`).all();
      
      if (data.length > 0) {
        // Insert data in batches
        const batchSize = 100;
        for (let i = 0; i < data.length; i += batchSize) {
          const batch = data.slice(i, i + batchSize);
          
          for (const row of batch) {
            const columns = Object.keys(row);
            const placeholders = columns.map(() => '?').join(', ');
            const sql = `INSERT INTO ${tableName} (${columns.map(c => `"${c}"`).join(', ')}) VALUES (${placeholders})`;
            const values = columns.map(col => row[col]);
            
            await turso.execute({
              sql,
              args: values
            });
          }
          
          console.log(`  Imported ${Math.min(i + batchSize, data.length)}/${data.length} rows`);
        }
      }
    }
    
    console.log('Import completed successfully!');
  } catch (error) {
    console.error('Import failed:', error);
  } finally {
    localDb.close();
    turso.close();
  }
}

// Load .env.local
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

importToTurso();
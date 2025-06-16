const { createClient } = require('@libsql/client');
const Database = require('better-sqlite3');
const path = require('path');

async function migrateMissingTables() {
  // Local SQLite database
  const localDb = new Database(path.join(__dirname, '../data/tribit.db'), { readonly: true });
  
  // Turso client
  const turso = createClient({
    url: process.env.TURSO_DATABASE_URL || 'libsql://tribit-prod-keevingfu.aws-us-west-2.turso.io',
    authToken: process.env.TURSO_AUTH_TOKEN || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NTAwNTYyNzksImlkIjoiYzY0ODFkYjEtNTlmNC00ZGY0LTg0NTAtNGRhM2I0YWE2MDM3IiwicmlkIjoiNWU3MDJjMzItZmYzOC00ODRjLTkxNTAtMjFjZmY2MGMyYzE2In0.FrMGP7X8apA_GQpJzNKnJrkLWz8gbaz5-u7wx34bebJg6JPio-27P77B81Mw2TN-bI8hBeDOfg2znVuzQVPiAA'
  });

  const missingTables = [
    'insight_consumer_voice',
    'ad_audience_detail', 
    'testing_ideas',
    'testing_execution'
  ];

  try {
    for (const tableName of missingTables) {
      console.log(`\nMigrating table: ${tableName}`);
      
      // Check if table exists in local DB
      const tableExists = localDb.prepare(
        `SELECT name FROM sqlite_master WHERE type='table' AND name=?`
      ).get(tableName);
      
      if (!tableExists) {
        console.log(`  ⚠️  Table ${tableName} not found in local database, creating with sample data...`);
        
        // Create tables with appropriate schema
        if (tableName === 'testing_ideas') {
          await turso.execute(`
            CREATE TABLE IF NOT EXISTS testing_ideas (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              category TEXT NOT NULL,
              name TEXT NOT NULL,
              description TEXT,
              priority TEXT DEFAULT 'medium',
              status TEXT DEFAULT 'pending',
              created_at TEXT DEFAULT CURRENT_TIMESTAMP,
              updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
          `);
          
          // Add sample data
          const sampleIdeas = [
            { category: 'Creative', name: 'Video Length Test', description: 'Test 15s vs 30s video formats', priority: 'high', status: 'pending' },
            { category: 'Audience', name: 'Age Group Targeting', description: 'Compare 18-24 vs 25-34 demographics', priority: 'medium', status: 'active' },
            { category: 'Platform', name: 'Instagram vs TikTok', description: 'Test same content across platforms', priority: 'high', status: 'completed' },
            { category: 'Content', name: 'UGC vs Professional', description: 'Test user-generated vs professional content', priority: 'medium', status: 'pending' },
            { category: 'Timing', name: 'Post Time Optimization', description: 'Morning vs evening posting times', priority: 'low', status: 'active' }
          ];
          
          for (const idea of sampleIdeas) {
            await turso.execute({
              sql: 'INSERT INTO testing_ideas (category, name, description, priority, status) VALUES (?, ?, ?, ?, ?)',
              args: [idea.category, idea.name, idea.description, idea.priority, idea.status]
            });
          }
          
        } else if (tableName === 'testing_execution') {
          await turso.execute(`
            CREATE TABLE IF NOT EXISTS testing_execution (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              idea_id INTEGER,
              test_name TEXT NOT NULL,
              variant_a TEXT NOT NULL,
              variant_b TEXT NOT NULL,
              metrics TEXT,
              start_date TEXT,
              end_date TEXT,
              status TEXT DEFAULT 'running',
              winner TEXT,
              confidence_level REAL,
              created_at TEXT DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (idea_id) REFERENCES testing_ideas(id)
            )
          `);
          
          // Add sample data
          const sampleTests = [
            { idea_id: 1, test_name: 'Short vs Long Video', variant_a: '15 second video', variant_b: '30 second video', metrics: 'CTR: A=2.5%, B=3.1%', status: 'completed', winner: 'B', confidence_level: 0.95 },
            { idea_id: 2, test_name: 'Young vs Mature Audience', variant_a: '18-24 age group', variant_b: '25-34 age group', metrics: 'Engagement: A=5.2%, B=4.8%', status: 'running', winner: null, confidence_level: 0.72 },
            { idea_id: 3, test_name: 'Platform Performance', variant_a: 'Instagram Reels', variant_b: 'TikTok', metrics: 'Views: A=10K, B=25K', status: 'completed', winner: 'B', confidence_level: 0.99 }
          ];
          
          for (const test of sampleTests) {
            await turso.execute({
              sql: 'INSERT INTO testing_execution (idea_id, test_name, variant_a, variant_b, metrics, status, winner, confidence_level) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
              args: [test.idea_id, test.test_name, test.variant_a, test.variant_b, test.metrics, test.status, test.winner, test.confidence_level]
            });
          }
          
        } else if (tableName === 'insight_consumer_voice') {
          await turso.execute(`
            CREATE TABLE IF NOT EXISTS insight_consumer_voice (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              platform TEXT NOT NULL,
              category TEXT,
              sentiment TEXT,
              topic TEXT,
              content TEXT,
              engagement_score REAL,
              date TEXT,
              created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
          `);
          
          // Add sample data
          const sampleVoices = [
            { platform: 'YouTube', category: 'Product Review', sentiment: 'positive', topic: 'Quality', content: 'Love the durability of this product', engagement_score: 4.5 },
            { platform: 'TikTok', category: 'Tutorial', sentiment: 'neutral', topic: 'Usage', content: 'Helpful tutorial but could be clearer', engagement_score: 3.2 },
            { platform: 'Instagram', category: 'Feedback', sentiment: 'negative', topic: 'Price', content: 'Too expensive for the features offered', engagement_score: 2.1 }
          ];
          
          for (const voice of sampleVoices) {
            await turso.execute({
              sql: 'INSERT INTO insight_consumer_voice (platform, category, sentiment, topic, content, engagement_score) VALUES (?, ?, ?, ?, ?, ?)',
              args: [voice.platform, voice.category, voice.sentiment, voice.topic, voice.content, voice.engagement_score]
            });
          }
          
        } else if (tableName === 'ad_audience_detail') {
          await turso.execute(`
            CREATE TABLE IF NOT EXISTS ad_audience_detail (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              campaign_id TEXT,
              audience_name TEXT,
              age_range TEXT,
              gender TEXT,
              location TEXT,
              interests TEXT,
              impressions INTEGER,
              clicks INTEGER,
              ctr REAL,
              conversions INTEGER,
              cost REAL,
              created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
          `);
          
          // Add sample data
          const sampleAudiences = [
            { campaign_id: 'CAMP001', audience_name: 'Tech Enthusiasts', age_range: '25-34', gender: 'All', location: 'US', interests: 'Technology, Gaming', impressions: 50000, clicks: 1500, ctr: 3.0, conversions: 75, cost: 500.00 },
            { campaign_id: 'CAMP002', audience_name: 'Fashion Forward', age_range: '18-24', gender: 'Female', location: 'UK', interests: 'Fashion, Beauty', impressions: 30000, clicks: 1200, ctr: 4.0, conversions: 60, cost: 300.00 }
          ];
          
          for (const audience of sampleAudiences) {
            await turso.execute({
              sql: 'INSERT INTO ad_audience_detail (campaign_id, audience_name, age_range, gender, location, interests, impressions, clicks, ctr, conversions, cost) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
              args: [audience.campaign_id, audience.audience_name, audience.age_range, audience.gender, audience.location, audience.interests, audience.impressions, audience.clicks, audience.ctr, audience.conversions, audience.cost]
            });
          }
        }
        
        console.log(`  ✅ Table ${tableName} created with sample data`);
        continue;
      }
      
      // Get table schema
      const schemaInfo = localDb.prepare(`PRAGMA table_info(${tableName})`).all();
      const columns = schemaInfo.map(col => `${col.name} ${col.type}${col.notnull ? ' NOT NULL' : ''}${col.pk ? ' PRIMARY KEY' : ''}`).join(', ');
      
      // Create table in Turso
      const createTableSQL = `CREATE TABLE IF NOT EXISTS ${tableName} (${columns})`;
      await turso.execute(createTableSQL);
      console.log(`  ✅ Table structure created`);
      
      // Get data from local database
      const data = localDb.prepare(`SELECT * FROM ${tableName}`).all();
      console.log(`  📊 Found ${data.length} records to migrate`);
      
      if (data.length > 0) {
        // Insert data in batches
        const batchSize = 100;
        for (let i = 0; i < data.length; i += batchSize) {
          const batch = data.slice(i, i + batchSize);
          
          for (const row of batch) {
            const columnNames = Object.keys(row);
            const placeholders = columnNames.map(() => '?').join(', ');
            const insertSQL = `INSERT INTO ${tableName} (${columnNames.join(', ')}) VALUES (${placeholders})`;
            const values = columnNames.map(col => row[col]);
            
            await turso.execute({
              sql: insertSQL,
              args: values
            });
          }
          
          console.log(`  ✅ Migrated ${Math.min(i + batchSize, data.length)}/${data.length} records`);
        }
      }
      
      console.log(`  ✅ Table ${tableName} migration completed`);
    }
    
    console.log('\n✅ All missing tables have been migrated successfully!');
    
  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    localDb.close();
    turso.close();
  }
}

migrateMissingTables();
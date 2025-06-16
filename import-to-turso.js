const Database = require('better-sqlite3');
const { createClient } = require('@libsql/client');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function importDataToTurso() {
  console.log('🚀 开始导入数据到 Turso...\n');
  
  // 连接到本地 SQLite
  const localDb = new Database(path.join(__dirname, 'data', 'tribit.db'), { readonly: true });
  
  // 连接到 Turso
  const tursoClient = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  try {
    // 获取所有表
    const tables = localDb.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
    ).all();
    
    console.log(`找到 ${tables.length} 个表需要导入\n`);

    for (const { name: tableName } of tables) {
      console.log(`📋 处理表: ${tableName}`);
      
      try {
        // 获取表结构
        const tableInfo = localDb.prepare(`PRAGMA table_info(${tableName})`).all();
        
        // 创建表
        const createTableSQL = localDb.prepare(
          `SELECT sql FROM sqlite_master WHERE type='table' AND name=?`
        ).get(tableName);
        
        if (createTableSQL && createTableSQL.sql) {
          await tursoClient.execute(createTableSQL.sql);
          console.log(`  ✅ 表已创建`);
        }
        
        // 获取数据
        const data = localDb.prepare(`SELECT * FROM ${tableName}`).all();
        
        if (data.length > 0) {
          console.log(`  📤 导入 ${data.length} 条记录...`);
          
          // 批量插入数据
          const columns = Object.keys(data[0]);
          const placeholders = columns.map(() => '?').join(', ');
          const insertSQL = `INSERT INTO ${tableName} (${columns.map(c => `"${c}"`).join(', ')}) VALUES (${placeholders})`;
          
          // 分批插入，每批100条
          const batchSize = 100;
          for (let i = 0; i < data.length; i += batchSize) {
            const batch = data.slice(i, i + batchSize);
            const statements = batch.map(row => ({
              sql: insertSQL,
              args: columns.map(col => row[col])
            }));
            
            await tursoClient.batch(statements);
            
            if (i % 1000 === 0 && i > 0) {
              console.log(`    ${i} 条已导入...`);
            }
          }
          
          console.log(`  ✅ ${data.length} 条记录导入完成`);
        } else {
          console.log(`  ℹ️  表为空，跳过`);
        }
        
      } catch (error) {
        console.error(`  ❌ 导入表 ${tableName} 失败:`, error.message);
      }
      
      console.log('');
    }
    
    console.log('✅ 数据导入完成！');
    
    // 验证导入
    console.log('\n📊 验证导入结果...');
    const kolCount = await tursoClient.execute('SELECT COUNT(*) as count FROM kol_tribit_total');
    console.log(`kol_tribit_total: ${kolCount.rows[0].count} 条记录`);
    
    const ytbCount = await tursoClient.execute('SELECT COUNT(*) as count FROM kol_ytb_video');
    console.log(`kol_ytb_video: ${ytbCount.rows[0].count} 条记录`);
    
  } catch (error) {
    console.error('导入失败:', error);
  } finally {
    localDb.close();
    tursoClient.close();
  }
}

// 检查依赖
try {
  require('@libsql/client');
  importDataToTurso();
} catch (error) {
  console.error('请先安装依赖: npm install @libsql/client');
}
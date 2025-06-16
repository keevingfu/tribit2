// 基本 Turso 连接测试
const TURSO_URL = 'libsql://tribit-prod-keevingfu.aws-us-west-2.turso.io';
const TURSO_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NTAwNTYyNzksImlkIjoiYzY0ODFkYjEtNTlmNC00ZGY0LTg0NTAtNGRhM2I0YWE2MDM3IiwicmlkIjoiNWU3MDJjMzItZmYzOC00ODRjLTkxNTAtMjFjZmY2MGMyYzE2In0.FrMGP7X8apA_GQpJzNKnJrkLWz8gbaz5-u7wx34bebJg6JPio-27P77B81Mw2TN-bI8hBeDOfg2znVuzQVPiAA';

async function testBasicConnection() {
  try {
    // 使用 fetch API 测试
    const response = await fetch(TURSO_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TURSO_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        statements: [
          { sql: 'SELECT 1 as test' }
        ]
      })
    });
    
    const result = await response.json();
    console.log('Turso 连接测试结果:', result);
    
  } catch (error) {
    console.error('连接失败:', error);
  }
}

// 创建基本表
async function createTables() {
  console.log('创建基本表结构...\n');
  
  const tables = [
    `CREATE TABLE IF NOT EXISTS kol_tribit_total (
      "No." INTEGER PRIMARY KEY,
      Region TEXT,
      Platform TEXT,
      kol_account TEXT,
      kol_url TEXT
    )`,
    
    `CREATE TABLE IF NOT EXISTS kol_ytb_video (
      rank INTEGER,
      Youtuber TEXT,
      subscribers INTEGER,
      "video views" INTEGER,
      category TEXT,
      Title TEXT,
      uploads INTEGER,
      Country TEXT,
      channel_type TEXT,
      created_year INTEGER
    )`
  ];
  
  // 插入示例数据的 SQL
  const sampleData = [
    `INSERT INTO kol_tribit_total ("No.", Region, Platform, kol_account, kol_url) VALUES
     (1, 'North America', 'YouTube', 'MrBeast', 'https://www.youtube.com/watch?v=_7iXfXX7tIA'),
     (2, 'Europe', 'YouTube', 'PewDiePie', 'https://www.youtube.com/watch?v=PHgc8Q6qTjc'),
     (3, 'Asia', 'YouTube', 'T-Series', 'https://www.youtube.com/watch?v=BBAyRBTfsOU')`,
     
    `INSERT INTO kol_ytb_video (rank, Youtuber, subscribers, "video views", category, Title, uploads, Country, channel_type, created_year) VALUES
     (1, 'T-Series', 245000000, 228000000000, 'Music', 'T-Series', 20082, 'India', 'Music', 2006),
     (2, 'MrBeast', 172000000, 125000000000, 'Entertainment', 'MrBeast', 741, 'United States', 'Entertainment', 2012),
     (3, 'PewDiePie', 111000000, 110000000000, 'Gaming', 'PewDiePie', 4700, 'Sweden', 'Gaming', 2010)`
  ];
  
  try {
    // 执行创建表
    for (const sql of tables) {
      const response = await fetch(TURSO_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${TURSO_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          statements: [{ sql }]
        })
      });
      
      const result = await response.json();
      if (result.error) {
        console.error('创建表失败:', result.error);
      } else {
        console.log('✅ 表创建成功');
      }
    }
    
    // 插入示例数据
    console.log('\n插入示例数据...');
    for (const sql of sampleData) {
      const response = await fetch(TURSO_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${TURSO_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          statements: [{ sql }]
        })
      });
      
      const result = await response.json();
      if (result.error) {
        console.error('插入数据失败:', result.error);
      } else {
        console.log('✅ 数据插入成功');
      }
    }
    
  } catch (error) {
    console.error('操作失败:', error);
  }
}

// 执行
console.log('🚀 Turso 数据库设置\n');
console.log('数据库 URL:', TURSO_URL);
console.log('开始测试...\n');

testBasicConnection()
  .then(() => createTables())
  .then(() => {
    console.log('\n✅ Turso 数据库基本设置完成！');
    console.log('\n下一步：');
    console.log('1. 更新代码使用 connection-turso.ts');
    console.log('2. 在 Vercel 设置环境变量');
    console.log('3. 部署到 Vercel');
  });
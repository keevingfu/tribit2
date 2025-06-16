// 测试 Turso 数据库连接
require('dotenv').config({ path: '.env.local' });

// 如果还没安装 @libsql/client，使用动态导入
async function testConnection() {
  let createClient;
  
  try {
    const libsql = await import('@libsql/client');
    createClient = libsql.createClient;
  } catch (error) {
    console.error('❌ 请先安装 @libsql/client: npm install @libsql/client');
    return;
  }

  if (!process.env.TURSO_DATABASE_URL) {
    console.error('❌ 未找到 TURSO_DATABASE_URL 环境变量');
    console.log('请先运行 turso-quick-setup.sh 脚本');
    return;
  }

  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  console.log('🔍 测试 Turso 数据库连接...\n');

  try {
    // 测试基本连接
    console.log('1. 测试基本查询...');
    const result = await client.execute('SELECT 1 as test');
    console.log('✅ 基本连接成功\n');

    // 列出所有表
    console.log('2. 获取数据库表列表...');
    const tables = await client.execute(
      "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
    );
    console.log(`✅ 找到 ${tables.rows.length} 个表:`);
    tables.rows.forEach(row => console.log(`   - ${row.name}`));
    console.log('');

    // 测试 KOL 数据
    console.log('3. 测试 KOL 数据...');
    const kolCount = await client.execute(
      'SELECT COUNT(*) as count FROM kol_tribit_total'
    );
    console.log(`✅ kol_tribit_total 表有 ${kolCount.rows[0].count} 条记录\n`);

    // 获取示例 KOL 数据
    console.log('4. 获取示例 KOL 数据...');
    const sampleKOLs = await client.execute(
      'SELECT kol_account, Platform, Region FROM kol_tribit_total LIMIT 5'
    );
    console.log('示例 KOL:');
    sampleKOLs.rows.forEach(row => {
      console.log(`   - ${row.kol_account} (${row.Platform}, ${row.Region})`);
    });
    console.log('');

    // 测试 YouTube 视频数据
    console.log('5. 测试 YouTube 视频数据...');
    const ytbVideos = await client.execute(
      'SELECT COUNT(*) as count FROM kol_ytb_video WHERE "video views" > 0'
    );
    console.log(`✅ 找到 ${ytbVideos.rows[0].count} 个有观看量的 YouTube 视频\n`);

    // 获取热门视频
    console.log('6. 获取热门 YouTube 频道...');
    const topChannels = await client.execute(
      'SELECT Youtuber, subscribers, "video views" FROM kol_ytb_video ORDER BY "video views" DESC LIMIT 5'
    );
    console.log('Top 5 YouTube 频道:');
    topChannels.rows.forEach((row, i) => {
      const views = (row['video views'] / 1e9).toFixed(1);
      const subs = (row.subscribers / 1e6).toFixed(1);
      console.log(`   ${i + 1}. ${row.Youtuber}: ${subs}M 订阅, ${views}B 观看`);
    });

    console.log('\n✅ 所有测试通过！Turso 数据库连接正常。');
    console.log('\n下一步：');
    console.log('1. 更新代码使用 connection-turso.ts');
    console.log('2. 在 Vercel 设置环境变量');
    console.log('3. 部署到 Vercel');

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    console.error('\n可能的原因:');
    console.error('1. Turso 数据库未创建');
    console.error('2. 环境变量未设置');
    console.error('3. 数据未导入');
  } finally {
    client.close();
  }
}

// 运行测试
testConnection().catch(console.error);
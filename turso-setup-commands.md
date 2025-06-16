# Turso 数据库设置命令

由于 Turso 登录需要在浏览器中完成身份验证，请按以下步骤操作：

## 1. 登录 Turso

在终端中运行：
```bash
export PATH="/var/root/.turso:$PATH"
/var/root/.turso/turso auth login
```

这会打开浏览器进行身份验证。完成后返回终端。

## 2. 创建数据库和导入数据

登录成功后，运行以下命令：

```bash
# 设置环境变量
export PATH="/var/root/.turso:$PATH"
export TURSO_BIN="/var/root/.turso/turso"
export DB_NAME="tribit-prod"
export DB_PATH="/Users/cavin/Desktop/dev/buagent/data/tribit.db"

# 创建数据库 (美国西部数据中心)
$TURSO_BIN db create $DB_NAME --location sjc

# 导入 SQLite 数据
$TURSO_BIN db shell $DB_NAME < $DB_PATH

# 获取数据库 URL
DB_URL=$($TURSO_BIN db show $DB_NAME --url)
echo "Database URL: $DB_URL"

# 创建访问令牌
AUTH_TOKEN=$($TURSO_BIN db tokens create $DB_NAME)
echo "Auth Token: $AUTH_TOKEN"

# 创建 .env.local 文件
cat > /Users/cavin/Desktop/dev/buagent/.env.local << EOF
# Turso Database Configuration
TURSO_DATABASE_URL=$DB_URL
TURSO_AUTH_TOKEN=$AUTH_TOKEN
EOF

echo "环境变量已保存到 .env.local"
```

## 3. 安装依赖（如果还没安装）

```bash
cd /Users/cavin/Desktop/dev/buagent
npm install @libsql/client
```

## 4. 在 Vercel 设置环境变量

1. 访问：https://vercel.com/keevingfu/tribit/settings/environment-variables
2. 添加两个环境变量：
   - `TURSO_DATABASE_URL`: 从上面的输出复制
   - `TURSO_AUTH_TOKEN`: 从上面的输出复制

## 5. 更新代码使用 Turso

已准备好的文件：
- `src/services/database/connection-turso.ts` - 支持 Turso 的连接代码

需要：
1. 备份原始的 `connection.ts`
2. 用 `connection-turso.ts` 替换它
3. 提交并推送代码

```bash
# 备份原文件
cp src/services/database/connection.ts src/services/database/connection-backup.ts

# 替换为 Turso 版本
cp src/services/database/connection-turso.ts src/services/database/connection.ts

# 提交更改
git add -A
git commit -m "Add Turso database support for production"
git push origin main
```

## 验证设置

创建测试文件 `test-turso-connection.js`:

```javascript
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@libsql/client');

async function testConnection() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  try {
    // 测试查询
    const result = await client.execute('SELECT COUNT(*) as count FROM kol_tribit_total');
    console.log('✅ 连接成功!');
    console.log('KOL 总数:', result.rows[0].count);
    
    // 测试更多表
    const tables = await client.execute("SELECT name FROM sqlite_master WHERE type='table'");
    console.log('\n数据库中的表:');
    tables.rows.forEach(row => console.log(' -', row.name));
    
  } catch (error) {
    console.error('❌ 连接失败:', error.message);
  } finally {
    client.close();
  }
}

testConnection();
```

运行测试：
```bash
node test-turso-connection.js
```

如果一切正常，您的 Vercel 应用就能访问真实的 SQLite 数据了！
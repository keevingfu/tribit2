# Turso 数据库设置指南

## 1. 安装 Turso CLI

在您的本地终端执行：

```bash
# macOS/Linux
curl -sSfL https://get.tur.so/install.sh | bash

# 或者使用 Homebrew (macOS)
brew install tursodatabase/tap/turso

# Windows (使用 PowerShell)
irm https://get.tur.so/install.ps1 | iex
```

安装完成后，重启终端或执行：
```bash
source ~/.bashrc  # 或 ~/.zshrc
```

## 2. 注册/登录 Turso

```bash
# 注册新账号
turso auth signup

# 或登录现有账号
turso auth login
```

## 3. 创建数据库并导入数据

```bash
# 创建新数据库
turso db create tribit-prod

# 查看数据库信息
turso db show tribit-prod

# 导入现有 SQLite 数据
turso db shell tribit-prod < /Users/cavin/Desktop/dev/buagent/data/tribit.db

# 创建访问令牌
turso db tokens create tribit-prod

# 获取数据库 URL
turso db show tribit-prod --url
```

## 4. 安装项目依赖

```bash
cd /Users/cavin/Desktop/dev/buagent
npm install @libsql/client
```

## 5. 创建 Turso 适配器

创建新文件 `src/services/database/turso-adapter.ts`：

```typescript
import { createClient, Client, ResultSet } from '@libsql/client';

export class TursoAdapter {
  private client: Client;

  constructor(url: string, authToken?: string) {
    this.client = createClient({
      url,
      authToken,
    });
  }

  // 模拟 better-sqlite3 的 prepare 方法
  prepare(sql: string) {
    return {
      all: async (...params: any[]) => {
        const result = await this.client.execute({
          sql,
          args: params.flat()
        });
        return result.rows;
      },
      
      get: async (...params: any[]) => {
        const result = await this.client.execute({
          sql,
          args: params.flat()
        });
        return result.rows[0];
      },
      
      run: async (...params: any[]) => {
        const result = await this.client.execute({
          sql,
          args: params.flat()
        });
        return {
          changes: result.rowsAffected || 0,
          lastInsertRowid: result.lastInsertRowid
        };
      }
    };
  }

  async execute(sql: string, args: any[] = []): Promise<ResultSet> {
    return await this.client.execute({ sql, args });
  }

  async batch(statements: { sql: string; args?: any[] }[]): Promise<ResultSet[]> {
    return await this.client.batch(statements);
  }

  async transaction<T>(fn: () => Promise<T>): Promise<T> {
    return await this.client.transaction(fn);
  }

  close(): void {
    this.client.close();
  }
}
```

## 6. 更新数据库连接

更新 `src/services/database/connection.ts`：

```typescript
import Database from 'better-sqlite3';
import { TursoAdapter } from './turso-adapter';
import path from 'path';

class DatabaseConnection {
  private static instance: DatabaseConnection;
  private db: Database.Database | TursoAdapter;
  private readonly isProduction: boolean;

  private constructor() {
    this.isProduction = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;
    
    if (this.isProduction && process.env.TURSO_DATABASE_URL) {
      // Use Turso in production
      console.log('Connecting to Turso database...');
      this.db = new TursoAdapter(
        process.env.TURSO_DATABASE_URL,
        process.env.TURSO_AUTH_TOKEN
      );
    } else if (this.isProduction) {
      // Fallback to in-memory database
      console.log('Using in-memory database (Turso not configured)');
      this.db = new Database(':memory:', { readonly: false });
      this.initializeInMemoryDatabase();
    } else {
      // Use local SQLite in development
      const dbPath = path.join(process.cwd(), 'data', 'tribit.db');
      this.db = new Database(dbPath, { 
        readonly: true,
        fileMustExist: true
      });
      (this.db as Database.Database).pragma('foreign_keys = ON');
      (this.db as Database.Database).pragma('busy_timeout = 5000');
    }
  }

  // ... rest of the implementation
}
```

## 7. 设置 Vercel 环境变量

在 Vercel Dashboard 中添加以下环境变量：

1. 访问：https://vercel.com/your-username/tribit/settings/environment-variables
2. 添加：
   - `TURSO_DATABASE_URL`: 从 `turso db show tribit-prod --url` 获取
   - `TURSO_AUTH_TOKEN`: 从 `turso db tokens create tribit-prod` 获取

示例：
```
TURSO_DATABASE_URL=libsql://tribit-prod-keevingfu.turso.io
TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...
```

## 8. 测试连接

创建测试脚本 `test-turso.js`：

```javascript
const { createClient } = require('@libsql/client');

async function testConnection() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  try {
    const result = await client.execute('SELECT COUNT(*) as count FROM kol_tribit_total');
    console.log('Connection successful!');
    console.log('Total KOLs:', result.rows[0].count);
  } catch (error) {
    console.error('Connection failed:', error);
  } finally {
    client.close();
  }
}

testConnection();
```

运行测试：
```bash
TURSO_DATABASE_URL=your-url TURSO_AUTH_TOKEN=your-token node test-turso.js
```

## 9. 部署到 Vercel

```bash
git add .
git commit -m "Add Turso database support"
git push origin main
```

Vercel 会自动部署，现在您的应用将使用真实的 SQLite 数据！

## 注意事项

1. **异步操作**：Turso 是异步的，所以所有数据库操作需要使用 async/await
2. **免费限制**：
   - 8 GB 存储
   - 10 亿行读取/月
   - 2500 万行写入/月
3. **性能**：Turso 使用边缘部署，延迟很低（通常 < 10ms）

## 故障排除

如果遇到问题：

1. 检查环境变量是否正确设置
2. 确保数据库已创建并导入数据
3. 查看 Vercel 函数日志：`vercel logs`
4. 使用 Turso dashboard 监控：https://turso.tech/dashboard

需要帮助？访问 Turso 文档：https://docs.turso.tech/
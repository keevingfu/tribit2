# 在 Vercel 环境下访问 SQLite 数据库的解决方案

## 推荐方案：使用 Turso

Turso 是最适合 Vercel 的 SQLite 云解决方案，提供：
- 完全的 SQLite 兼容性
- 边缘部署，低延迟
- 简单的迁移过程
- 免费套餐足够使用

### 步骤 1：设置 Turso

```bash
# 1. 安装 Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# 2. 注册/登录
turso auth signup  # 或 turso auth login

# 3. 创建数据库
turso db create tribit-prod --location ord  # ord = 美国中部

# 4. 上传现有数据
turso db shell tribit-prod < data/tribit.db

# 5. 创建访问令牌
turso db tokens create tribit-prod

# 6. 获取数据库 URL
turso db show tribit-prod --url
```

### 步骤 2：安装依赖

```bash
npm install @libsql/client
```

### 步骤 3：更新数据库连接

修改 `src/services/database/connection.ts`：

```typescript
import { createClient, Client } from '@libsql/client';
import Database from 'better-sqlite3';
import path from 'path';

class DatabaseConnection {
  private static instance: DatabaseConnection;
  private db: Database.Database | Client;
  private isProduction: boolean;

  private constructor() {
    this.isProduction = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;
    
    if (this.isProduction) {
      // Turso for production
      this.db = createClient({
        url: process.env.TURSO_DATABASE_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN!,
      });
    } else {
      // Local SQLite for development
      const dbPath = path.join(process.cwd(), 'data', 'tribit.db');
      this.db = new Database(dbPath, { 
        readonly: true,
        fileMustExist: true,
      });
    }
  }

  // Convert methods to handle both sync (local) and async (Turso)
  public async query<T>(sql: string, params?: any[]): Promise<T[]> {
    if (this.isProduction) {
      const result = await (this.db as Client).execute({
        sql,
        args: params || []
      });
      return result.rows as T[];
    } else {
      const stmt = (this.db as Database.Database).prepare(sql);
      return stmt.all(...(params || [])) as T[];
    }
  }

  public async queryOne<T>(sql: string, params?: any[]): Promise<T | undefined> {
    if (this.isProduction) {
      const result = await (this.db as Client).execute({
        sql,
        args: params || []
      });
      return result.rows[0] as T;
    } else {
      const stmt = (this.db as Database.Database).prepare(sql);
      return stmt.get(...(params || [])) as T;
    }
  }

  // ... other methods
}
```

### 步骤 4：更新服务层

由于 Turso 是异步的，需要更新所有数据库调用：

```typescript
// Before
const results = this.db.query('SELECT * FROM table');

// After
const results = await this.db.query('SELECT * FROM table');
```

### 步骤 5：设置 Vercel 环境变量

在 Vercel Dashboard 中添加：

```
TURSO_DATABASE_URL=libsql://tribit-prod-[your-org].turso.io
TURSO_AUTH_TOKEN=eyJ...your-token...
```

## 备选方案 1：使用 Vercel Blob Storage

如果您希望保持使用原始 SQLite 文件：

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 上传数据库文件到 Blob Storage
vercel blob upload data/tribit.db
```

然后在启动时下载：

```typescript
import { get } from '@vercel/blob';
import fs from 'fs';
import os from 'os';

async function downloadDatabase() {
  const blob = await get('tribit.db');
  const tempPath = path.join(os.tmpdir(), 'tribit.db');
  
  const response = await fetch(blob.downloadUrl);
  const buffer = await response.arrayBuffer();
  
  fs.writeFileSync(tempPath, Buffer.from(buffer));
  return tempPath;
}
```

## 备选方案 2：转换到 PostgreSQL

如果数据量大或需要更多功能：

1. 使用 Vercel Postgres 或 Supabase
2. 使用工具迁移数据：

```bash
# 使用 pgloader
pgloader tribit.db postgresql://user:password@host:port/dbname
```

## 快速实施建议

1. **最简单**: 继续使用内存数据库（当前方案）
2. **最佳性能**: 使用 Turso（推荐）
3. **最灵活**: 使用 PostgreSQL

## 注意事项

- Turso 免费套餐：8GB 存储，10亿行读取/月
- Vercel 函数有 10秒超时限制
- 考虑使用缓存减少数据库调用

需要我帮您实施哪个方案？
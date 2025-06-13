# 数据库服务层使用指南

## 概述

本数据库服务层为SQLite数据库提供了完整的TypeScript类型支持、查询缓存、以及丰富的查询方法。

## 安装依赖

```bash
npm install better-sqlite3 lru-cache
npm install -D @types/better-sqlite3
```

## 核心组件

### 1. 数据库连接 (DatabaseConnection)

单例模式的数据库连接管理器，提供了基础的查询方法。

```typescript
import DatabaseConnection from '@/services/database/connection';

const db = DatabaseConnection.getInstance();
const results = db.query<MyType>('SELECT * FROM my_table WHERE id = ?', [1]);
```

### 2. 基础服务类 (BaseService)

所有服务类的基类，提供了通用的CRUD操作和查询方法。

### 3. 具体服务类

#### InsightSearchService
处理搜索洞察数据，提供关键词搜索、热门搜索、地区统计等功能。

```typescript
import { getInsightSearchService } from '@/services/database';

const service = getInsightSearchService();

// 搜索关键词
const results = await service.searchByKeyword('marketing', {
  region: 'US',
  language: 'en',
  limit: 10
});

// 获取热门搜索
const topSearches = await service.getTopSearches(20, 'US', 'en');
```

#### TikTokCreatorService
处理TikTok创作者数据，提供创作者排行、搜索、统计等功能。

```typescript
import { getTikTokCreatorService } from '@/services/database';

const service = getTikTokCreatorService();

// 获取粉丝最多的创作者
const topCreators = await service.getTopCreatorsByFollowers(10);

// 搜索创作者
const searchResults = await service.searchCreators({
  name: 'fashion',
  minFollowers: 10000,
  page: 1,
  pageSize: 20
});
```

#### TikTokProductService
处理TikTok产品数据，提供产品搜索、热销产品、价格分析等功能。

```typescript
import { getTikTokProductService } from '@/services/database';

const service = getTikTokProductService();

// 获取热销产品
const topProducts = await service.getTopSellingProducts(10);

// 搜索产品
const products = await service.searchProducts({
  name: 'beauty',
  minPrice: 10,
  maxPrice: 100,
  page: 1,
  pageSize: 20
});
```

#### KOLService
处理KOL（关键意见领袖）数据，支持多平台KOL管理。

```typescript
import { getKOLService } from '@/services/database';

const service = getKOLService();

// 获取所有KOL
const kols = await service.getAllKOLAccounts({
  platform: 'YouTube',
  region: 'US',
  page: 1,
  pageSize: 20
});

// 获取YouTube视频统计
const channelStats = await service.getYouTubeChannelStats();
```

#### SelfMediaService
处理自媒体数据，支持Instagram、YouTube、TikTok等平台。

```typescript
import { getSelfMediaService } from '@/services/database';

const service = getSelfMediaService();

// 跨平台搜索
const results = await service.searchAcrossPlatforms('fashion');

// 获取账号内容
const content = await service.getAccountContent('example_account');
```

## 缓存系统

### 使用QueryCache

```typescript
import { QueryCache } from '@/services/database';

const cache = QueryCache.getInstance();

// 手动缓存
const result = await cache.wrap(
  'table_name',
  'method_name',
  [param1, param2],
  async () => {
    // 实际的查询逻辑
    return await someQuery();
  },
  60000 // TTL: 60秒
);
```

### 使用装饰器

```typescript
import { Cacheable, CacheClear } from '@/services/database';

class MyService extends BaseService<MyType> {
  @Cacheable('my_table', 300000) // 缓存5分钟
  async getPopularItems(): Promise<MyType[]> {
    return this.query('SELECT * FROM my_table ORDER BY views DESC LIMIT 10');
  }
  
  @CacheClear('my_table') // 清除缓存
  async updateItem(id: number, data: Partial<MyType>): Promise<void> {
    // 更新逻辑
  }
}
```

## 工具函数

### 构建WHERE子句

```typescript
import { buildWhereClause } from '@/services/database';

const conditions = {
  status: 'active',
  category: ['tech', 'business'],
  price: { min: 10, max: 100 }
};

const { clause, params } = buildWhereClause(conditions);
// clause: "status = ? AND category IN (?,?) AND price BETWEEN ? AND ?"
// params: ['active', 'tech', 'business', 10, 100]
```

### 分页参数验证

```typescript
import { validatePaginationParams } from '@/services/database';

const { page, pageSize, offset } = validatePaginationParams(
  requestPage, 
  requestPageSize
);
```

## 最佳实践

1. **使用服务管理器获取服务实例**
   ```typescript
   import { DatabaseServiceManager } from '@/services/database';
   
   const insightService = DatabaseServiceManager.insightSearch;
   const creatorService = DatabaseServiceManager.tikTokCreator;
   ```

2. **使用类型定义**
   ```typescript
   import type { InsightSearch, TikTokCreator } from '@/types/database';
   ```

3. **处理错误**
   ```typescript
   try {
     const results = await service.searchProducts({ name: 'test' });
   } catch (error) {
     console.error('Database query failed:', error);
   }
   ```

4. **关闭数据库连接**
   ```typescript
   // 在应用退出时
   DatabaseServiceManager.closeAll();
   ```

## 性能优化

1. **使用缓存**：对于频繁查询的数据，使用缓存机制减少数据库访问。

2. **批量查询**：使用`getByIds`等批量查询方法，避免N+1查询问题。

3. **索引优化**：确保数据库表有适当的索引。

4. **分页查询**：对于大量数据，始终使用分页。

## 监控

启用缓存监控：

```typescript
import { CacheMonitor } from '@/services/database';

const monitor = new CacheMonitor();
monitor.start(60000); // 每分钟输出一次统计信息

// 停止监控
monitor.stop();
```

## 示例项目

查看 `examples.ts` 文件获取完整的使用示例。
import { LRUCache } from 'lru-cache';

interface CacheOptions {
  max?: number; // 最大缓存条目数
  ttl?: number; // 生存时间（毫秒）
  updateAgeOnGet?: boolean; // 获取时是否更新年龄
}

/**
 * 查询结果缓存管理器
 */
export class QueryCache {
  private cache: LRUCache<string, any>;
  private static instance: QueryCache;

  private constructor(options: CacheOptions = {}) {
    this.cache = new LRUCache({
      max: options.max || 500, // 默认最多缓存500个查询结果
      ttl: options.ttl || 1000 * 60 * 5, // 默认5分钟过期
      updateAgeOnGet: options.updateAgeOnGet ?? true,
      allowStale: false,
    });
  }

  /**
   * 获取缓存实例（单例模式）
   */
  public static getInstance(options?: CacheOptions): QueryCache {
    if (!QueryCache.instance) {
      QueryCache.instance = new QueryCache(options);
    }
    return QueryCache.instance;
  }

  /**
   * 生成缓存键
   */
  private generateKey(tableName: string, method: string, params: any[]): string {
    const paramsStr = JSON.stringify(params);
    return `${tableName}:${method}:${paramsStr}`;
  }

  /**
   * 获取缓存
   */
  public get<T>(tableName: string, method: string, params: any[]): T | undefined {
    const key = this.generateKey(tableName, method, params);
    return this.cache.get(key) as T | undefined;
  }

  /**
   * 设置缓存
   */
  public set<T>(tableName: string, method: string, params: any[], value: T, ttl?: number): void {
    const key = this.generateKey(tableName, method, params);
    const options = ttl ? { ttl } : undefined;
    this.cache.set(key, value, options);
  }

  /**
   * 删除特定缓存
   */
  public delete(tableName: string, method: string, params: any[]): boolean {
    const key = this.generateKey(tableName, method, params);
    return this.cache.delete(key);
  }

  /**
   * 清除某个表的所有缓存
   */
  public clearTable(tableName: string): void {
    const keys = Array.from(this.cache.keys());
    keys.forEach(key => {
      if (key.startsWith(`${tableName}:`)) {
        this.cache.delete(key);
      }
    });
  }

  /**
   * 清除所有缓存
   */
  public clear(): void {
    this.cache.clear();
  }

  /**
   * 获取缓存统计信息
   */
  public getStats(): {
    size: number;
    capacity: number;
  } {
    return {
      size: this.cache.size,
      capacity: this.cache.max,
    };
  }

  /**
   * 包装查询函数，自动处理缓存
   */
  public async wrap<T>(
    tableName: string,
    method: string,
    params: any[],
    queryFn: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    // 尝试从缓存获取
    const cached = this.get<T>(tableName, method, params);
    if (cached !== undefined) {
      return cached;
    }

    // 执行查询
    const result = await queryFn();

    // 存入缓存
    this.set(tableName, method, params, result, ttl);

    return result;
  }
}

/**
 * 缓存装饰器
 */
export function Cacheable(tableName: string, ttl?: number) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const cache = QueryCache.getInstance();

    descriptor.value = async function (...args: any[]) {
      return cache.wrap(
        tableName,
        propertyKey,
        args,
        () => originalMethod.apply(this, args),
        ttl
      );
    };

    return descriptor;
  };
}

/**
 * 清除缓存装饰器（用于写操作）
 */
export function CacheClear(tableName: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const cache = QueryCache.getInstance();

    descriptor.value = async function (...args: any[]) {
      const result = await originalMethod.apply(this, args);
      
      // 清除该表的所有缓存
      cache.clearTable(tableName);
      
      return result;
    };

    return descriptor;
  };
}

/**
 * 结果缓存中间件（用于API路由）
 */
export function cacheMiddleware(tableName: string, ttl?: number) {
  const cache = QueryCache.getInstance();
  
  return async (req: any, res: any, next: any) => {
    const cacheKey = {
      path: req.path,
      query: req.query,
      body: req.body,
    };
    
    const cached = cache.get(tableName, req.method, [cacheKey]);
    
    if (cached) {
      return res.json(cached);
    }
    
    // 保存原始的json方法
    const originalJson = res.json;
    
    // 重写json方法以缓存响应
    res.json = function (data: any) {
      cache.set(tableName, req.method, [cacheKey], data, ttl);
      return originalJson.call(this, data);
    };
    
    next();
  };
}

/**
 * 内存缓存统计监控
 */
export class CacheMonitor {
  private cache: QueryCache;
  private interval: NodeJS.Timeout | null = null;

  constructor() {
    this.cache = QueryCache.getInstance();
  }

  /**
   * 开始监控
   */
  public start(intervalMs: number = 60000): void {
    this.interval = setInterval(() => {
      const stats = this.cache.getStats();
      
      console.log('[Cache Monitor]', {
        size: stats.size,
        capacity: stats.capacity,
        utilization: `${(stats.size / stats.capacity * 100).toFixed(2)}%`,
      });
    }, intervalMs);
  }

  /**
   * 停止监控
   */
  public stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}
import { BaseService } from './BaseService';
import { TikTokCreator, TikTokProduct, SearchParams, PaginatedResult } from '@/types/database';

/**
 * TikTok创作者视频洞察服务
 */
export class InsightVideoCreatorService extends BaseService<TikTokCreator> {
  constructor() {
    super('insight_video_tk_creator');
  }

  /**
   * 按粉丝数获取顶级创作者
   */
  async getTopCreatorsByFollowers(limit: number = 10): Promise<TikTokCreator[]> {
    const sql = `
      SELECT * FROM ${this.tableName}
      WHERE 达人粉丝数 IS NOT NULL
      ORDER BY 达人粉丝数 DESC
      LIMIT ?
    `;
    return this.db.query<TikTokCreator>(sql, [limit]);
  }

  /**
   * 按销售额获取顶级创作者
   */
  async getTopCreatorsBySales(limit: number = 10): Promise<TikTokCreator[]> {
    const sql = `
      SELECT * FROM ${this.tableName}
      WHERE 近30日销售额 IS NOT NULL
      ORDER BY 近30日销售额 DESC
      LIMIT ?
    `;
    return this.db.query<TikTokCreator>(sql, [limit]);
  }

  /**
   * 按创作者类型统计
   */
  async getCreatorTypeStats(): Promise<Array<{ type: string; count: number; avg_followers: number }>> {
    const sql = `
      SELECT 
        达人类型 as type,
        COUNT(*) as count,
        AVG(达人粉丝数) as avg_followers
      FROM ${this.tableName}
      WHERE 达人类型 IS NOT NULL
      GROUP BY 达人类型
      ORDER BY count DESC
    `;
    return this.db.query(sql);
  }

  /**
   * 搜索创作者
   */
  async searchCreators(keyword: string, params?: SearchParams): Promise<TikTokCreator[]> {
    let sql = `
      SELECT * FROM ${this.tableName}
      WHERE (达人名称 LIKE ? OR 达人账号 LIKE ?)
    `;
    const queryParams: any[] = [`%${keyword}%`, `%${keyword}%`];

    // 添加排序
    if (params?.orderBy) {
      sql += ` ORDER BY ${params.orderBy} ${params.order || 'DESC'}`;
    } else {
      sql += ` ORDER BY 达人粉丝数 DESC`;
    }

    // 添加分页
    if (params?.limit) {
      sql += ` LIMIT ? OFFSET ?`;
      queryParams.push(params.limit, params.offset || 0);
    }

    return this.db.query<TikTokCreator>(sql, queryParams);
  }

  /**
   * 获取高增长创作者（粉丝增长数最多）
   */
  async getHighGrowthCreators(limit: number = 10): Promise<TikTokCreator[]> {
    const sql = `
      SELECT * FROM ${this.tableName}
      WHERE 粉丝增长数 IS NOT NULL AND 粉丝增长数 > 0
      ORDER BY 粉丝增长数 DESC
      LIMIT ?
    `;
    return this.db.query<TikTokCreator>(sql, [limit]);
  }

  /**
   * 获取高GPM创作者
   */
  async getHighGPMCreators(type: 'video' | 'live' = 'video', limit: number = 10): Promise<TikTokCreator[]> {
    const column = type === 'video' ? '视频GPM' : '直播GPM';
    const sql = `
      SELECT * FROM ${this.tableName}
      WHERE ${column} IS NOT NULL AND ${column} > 0
      ORDER BY ${column} DESC
      LIMIT ?
    `;
    return this.db.query<TikTokCreator>(sql, [limit]);
  }

  /**
   * 获取MCN机构统计
   */
  async getMCNStats(): Promise<Array<{ mcn: number; creator_count: number; avg_sales: number }>> {
    const sql = `
      SELECT 
        MCN as mcn,
        COUNT(*) as creator_count,
        AVG(近30日销售额) as avg_sales
      FROM ${this.tableName}
      WHERE MCN IS NOT NULL
      GROUP BY MCN
      ORDER BY creator_count DESC
    `;
    return this.db.query(sql);
  }

  /**
   * 获取创作者详情
   */
  async getCreatorByAccount(account: string): Promise<TikTokCreator | null> {
    const sql = `SELECT * FROM ${this.tableName} WHERE 达人账号 = ?`;
    return this.queryOne<TikTokCreator>(sql, [account]);
  }

  /**
   * 高级搜索
   */
  async advancedSearch(params: {
    keyword?: string;
    minFollowers?: number;
    maxFollowers?: number;
    minSales?: number;
    maxSales?: number;
    creatorType?: string;
    mcn?: number;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResult<TikTokCreator>> {
    const whereConditions: string[] = [];
    const queryParams: any[] = [];

    // 关键词搜索
    if (params.keyword) {
      whereConditions.push('(达人名称 LIKE ? OR 达人账号 LIKE ?)');
      queryParams.push(`%${params.keyword}%`, `%${params.keyword}%`);
    }

    // 粉丝数范围
    if (params.minFollowers !== undefined) {
      whereConditions.push('达人粉丝数 >= ?');
      queryParams.push(params.minFollowers);
    }
    if (params.maxFollowers !== undefined) {
      whereConditions.push('达人粉丝数 <= ?');
      queryParams.push(params.maxFollowers);
    }

    // 销售额范围
    if (params.minSales !== undefined) {
      whereConditions.push('近30日销售额 >= ?');
      queryParams.push(params.minSales);
    }
    if (params.maxSales !== undefined) {
      whereConditions.push('近30日销售额 <= ?');
      queryParams.push(params.maxSales);
    }

    // 创作者类型
    if (params.creatorType) {
      whereConditions.push('达人类型 = ?');
      queryParams.push(params.creatorType);
    }

    // MCN
    if (params.mcn !== undefined) {
      whereConditions.push('MCN = ?');
      queryParams.push(params.mcn);
    }

    const whereClause = whereConditions.length > 0 ? whereConditions.join(' AND ') : undefined;

    return this.getPaginated(
      params.page || 1,
      params.pageSize || 20,
      whereClause,
      queryParams,
      '达人粉丝数 DESC'
    );
  }
}

/**
 * TikTok产品视频洞察服务
 */
export class InsightVideoProductService extends BaseService<TikTokProduct> {
  constructor() {
    super('insight_video_tk_product');
  }

  /**
   * 按销量获取热门产品
   */
  async getTopProductsBySales(limit: number = 10): Promise<TikTokProduct[]> {
    const sql = `
      SELECT * FROM ${this.tableName}
      WHERE 销量 IS NOT NULL
      ORDER BY 销量 DESC
      LIMIT ?
    `;
    return this.db.query<TikTokProduct>(sql, [limit]);
  }

  /**
   * 按销售额获取热门产品
   */
  async getTopProductsByRevenue(limit: number = 10): Promise<TikTokProduct[]> {
    const sql = `
      SELECT * FROM ${this.tableName}
      WHERE 销售额 IS NOT NULL
      ORDER BY 销售额 DESC
      LIMIT ?
    `;
    return this.db.query<TikTokProduct>(sql, [limit]);
  }

  /**
   * 按地区统计产品
   */
  async getProductStatsByRegion(): Promise<Array<{ region: string; count: number; total_sales: number }>> {
    const sql = `
      SELECT 
        \`国家、地区\` as region,
        COUNT(*) as count,
        SUM(销量) as total_sales
      FROM ${this.tableName}
      WHERE \`国家、地区\` IS NOT NULL
      GROUP BY \`国家、地区\`
      ORDER BY total_sales DESC
    `;
    return this.db.query(sql);
  }

  /**
   * 按类目统计产品
   */
  async getProductStatsByCategory(lang: 'en' | 'zh' = 'zh'): Promise<Array<{ category: string; count: number; avg_price: number }>> {
    const column = lang === 'en' ? '商品类目-en' : '商品类目-zh';
    const sql = `
      SELECT 
        \`${column}\` as category,
        COUNT(*) as count,
        AVG((商品价格最大值 + 商品价格最小值) / 2) as avg_price
      FROM ${this.tableName}
      WHERE \`${column}\` IS NOT NULL
      GROUP BY \`${column}\`
      ORDER BY count DESC
    `;
    return this.db.query(sql);
  }

  /**
   * 搜索产品
   */
  async searchProducts(keyword: string, params?: SearchParams): Promise<TikTokProduct[]> {
    let sql = `
      SELECT * FROM ${this.tableName}
      WHERE (商品名称 LIKE ? OR 店铺名称 LIKE ?)
    `;
    const queryParams: any[] = [`%${keyword}%`, `%${keyword}%`];

    // 添加地区过滤
    if (params?.region) {
      sql += ` AND \`国家、地区\` = ?`;
      queryParams.push(params.region);
    }

    // 添加排序
    if (params?.orderBy) {
      sql += ` ORDER BY ${params.orderBy} ${params.order || 'DESC'}`;
    } else {
      sql += ` ORDER BY 销量 DESC`;
    }

    // 添加分页
    if (params?.limit) {
      sql += ` LIMIT ? OFFSET ?`;
      queryParams.push(params.limit, params.offset || 0);
    }

    return this.db.query<TikTokProduct>(sql, queryParams);
  }

  /**
   * 获取高评分产品
   */
  async getHighRatedProducts(minRating: number = 4.0, limit: number = 10): Promise<TikTokProduct[]> {
    const sql = `
      SELECT * FROM ${this.tableName}
      WHERE 商品星级 >= ? AND 商品星级 IS NOT NULL
      ORDER BY 商品星级 DESC, 销量 DESC
      LIMIT ?
    `;
    return this.db.query<TikTokProduct>(sql, [minRating, limit]);
  }

  /**
   * 获取新上架产品
   */
  async getNewProducts(days: number = 30, limit: number = 10): Promise<TikTokProduct[]> {
    const sql = `
      SELECT * FROM ${this.tableName}
      WHERE 上架时间 >= date('now', '-${days} days')
      ORDER BY 上架时间 DESC
      LIMIT ?
    `;
    return this.db.query<TikTokProduct>(sql, [limit]);
  }

  /**
   * 获取高增长产品（销量环比）
   */
  async getHighGrowthProducts(minGrowthRate: number = 50, limit: number = 10): Promise<TikTokProduct[]> {
    const sql = `
      SELECT * FROM ${this.tableName}
      WHERE 销量环比 >= ? AND 销量环比 IS NOT NULL
      ORDER BY 销量环比 DESC
      LIMIT ?
    `;
    return this.db.query<TikTokProduct>(sql, [minGrowthRate, limit]);
  }

  /**
   * 按运营模式统计
   */
  async getStatsByOperationMode(): Promise<Array<{ mode: string; count: number; avg_sales: number }>> {
    const sql = `
      SELECT 
        运营模式 as mode,
        COUNT(*) as count,
        AVG(销量) as avg_sales
      FROM ${this.tableName}
      WHERE 运营模式 IS NOT NULL
      GROUP BY 运营模式
      ORDER BY count DESC
    `;
    return this.db.query(sql);
  }

  /**
   * 价格区间分析
   */
  async getPriceRangeAnalysis(): Promise<Array<{ price_range: string; count: number; total_sales: number }>> {
    const sql = `
      SELECT 
        CASE 
          WHEN (商品价格最大值 + 商品价格最小值) / 2 < 10 THEN '0-10'
          WHEN (商品价格最大值 + 商品价格最小值) / 2 < 50 THEN '10-50'
          WHEN (商品价格最大值 + 商品价格最小值) / 2 < 100 THEN '50-100'
          WHEN (商品价格最大值 + 商品价格最小值) / 2 < 500 THEN '100-500'
          ELSE '500+'
        END as price_range,
        COUNT(*) as count,
        SUM(销量) as total_sales
      FROM ${this.tableName}
      WHERE 商品价格最大值 IS NOT NULL AND 商品价格最小值 IS NOT NULL
      GROUP BY price_range
      ORDER BY CASE price_range
        WHEN '0-10' THEN 1
        WHEN '10-50' THEN 2
        WHEN '50-100' THEN 3
        WHEN '100-500' THEN 4
        ELSE 5
      END
    `;
    return this.db.query(sql);
  }

  /**
   * 高级搜索
   */
  async advancedSearch(params: {
    keyword?: string;
    region?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    minSales?: number;
    operationMode?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResult<TikTokProduct>> {
    const whereConditions: string[] = [];
    const queryParams: any[] = [];

    // 关键词搜索
    if (params.keyword) {
      whereConditions.push('(商品名称 LIKE ? OR 店铺名称 LIKE ?)');
      queryParams.push(`%${params.keyword}%`, `%${params.keyword}%`);
    }

    // 地区
    if (params.region) {
      whereConditions.push('`国家、地区` = ?');
      queryParams.push(params.region);
    }

    // 类目
    if (params.category) {
      whereConditions.push('(`商品类目-zh` = ? OR `商品类目-en` = ?)');
      queryParams.push(params.category, params.category);
    }

    // 价格范围
    if (params.minPrice !== undefined) {
      whereConditions.push('商品价格最小值 >= ?');
      queryParams.push(params.minPrice);
    }
    if (params.maxPrice !== undefined) {
      whereConditions.push('商品价格最大值 <= ?');
      queryParams.push(params.maxPrice);
    }

    // 评分
    if (params.minRating !== undefined) {
      whereConditions.push('商品星级 >= ?');
      queryParams.push(params.minRating);
    }

    // 销量
    if (params.minSales !== undefined) {
      whereConditions.push('销量 >= ?');
      queryParams.push(params.minSales);
    }

    // 运营模式
    if (params.operationMode) {
      whereConditions.push('运营模式 = ?');
      queryParams.push(params.operationMode);
    }

    const whereClause = whereConditions.length > 0 ? whereConditions.join(' AND ') : undefined;

    return this.getPaginated(
      params.page || 1,
      params.pageSize || 20,
      whereClause,
      queryParams,
      '销量 DESC'
    );
  }
}
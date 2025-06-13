import { BaseService } from './BaseService';
import { TikTokProduct, PaginatedResult } from '@/types/database';

export class TikTokProductService extends BaseService<TikTokProduct> {
  constructor() {
    super('insight_video_tk_product');
  }

  /**
   * 获取热销商品
   */
  async getTopSellingProducts(limit: number = 10): Promise<TikTokProduct[]> {
    const sql = `
      SELECT * FROM ${this.tableName}
      WHERE 销量 IS NOT NULL
      ORDER BY 销量 DESC
      LIMIT ?
    `;
    return this.db.query<TikTokProduct>(sql, [limit]);
  }

  /**
   * 按销售额获取商品
   */
  async getTopRevenueProducts(limit: number = 10): Promise<TikTokProduct[]> {
    const sql = `
      SELECT * FROM ${this.tableName}
      WHERE 销售额 IS NOT NULL
      ORDER BY 销售额 DESC
      LIMIT ?
    `;
    return this.db.query<TikTokProduct>(sql, [limit]);
  }

  /**
   * 按地区获取商品
   */
  async getProductsByRegion(region: string, limit?: number): Promise<TikTokProduct[]> {
    let sql = `
      SELECT * FROM ${this.tableName}
      WHERE \`国家、地区\` = ?
      ORDER BY 销量 DESC
    `;
    const params: any[] = [region];

    if (limit) {
      sql += ' LIMIT ?';
      params.push(limit);
    }

    return this.db.query<TikTokProduct>(sql, params);
  }

  /**
   * 搜索商品
   */
  async searchProducts(params: {
    name?: string;
    category?: string;
    region?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    minSales?: number;
    shopName?: string;
    operationMode?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResult<TikTokProduct>> {
    const whereConditions: string[] = [];
    const queryParams: any[] = [];

    if (params.name) {
      whereConditions.push('商品名称 LIKE ?');
      queryParams.push(`%${params.name}%`);
    }

    if (params.category) {
      whereConditions.push('(`商品类目-zh` LIKE ? OR `商品类目-en` LIKE ?)');
      queryParams.push(`%${params.category}%`, `%${params.category}%`);
    }

    if (params.region) {
      whereConditions.push('`国家、地区` = ?');
      queryParams.push(params.region);
    }

    if (params.minPrice !== undefined) {
      whereConditions.push('商品价格最小值 >= ?');
      queryParams.push(params.minPrice);
    }

    if (params.maxPrice !== undefined) {
      whereConditions.push('商品价格最大值 <= ?');
      queryParams.push(params.maxPrice);
    }

    if (params.minRating !== undefined) {
      whereConditions.push('商品星级 >= ?');
      queryParams.push(params.minRating);
    }

    if (params.minSales !== undefined) {
      whereConditions.push('销量 >= ?');
      queryParams.push(params.minSales);
    }

    if (params.shopName) {
      whereConditions.push('店铺名称 LIKE ?');
      queryParams.push(`%${params.shopName}%`);
    }

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

  /**
   * 获取价格区间分布
   */
  async getPriceDistribution(): Promise<Array<{
    priceRange: string;
    count: number;
    avgSales: number;
  }>> {
    const sql = `
      SELECT 
        CASE 
          WHEN 商品价格最小值 < 10 THEN '0-10'
          WHEN 商品价格最小值 < 50 THEN '10-50'
          WHEN 商品价格最小值 < 100 THEN '50-100'
          WHEN 商品价格最小值 < 500 THEN '100-500'
          ELSE '500+'
        END as priceRange,
        COUNT(*) as count,
        AVG(销量) as avgSales
      FROM ${this.tableName}
      WHERE 商品价格最小值 IS NOT NULL
      GROUP BY priceRange
      ORDER BY 
        CASE priceRange
          WHEN '0-10' THEN 1
          WHEN '10-50' THEN 2
          WHEN '50-100' THEN 3
          WHEN '100-500' THEN 4
          WHEN '500+' THEN 5
        END
    `;

    return this.db.query(sql);
  }

  /**
   * 获取类目统计
   */
  async getCategoryStats(): Promise<Array<{
    category: string;
    productCount: number;
    totalSales: number;
    avgPrice: number;
    avgRating: number;
  }>> {
    const sql = `
      SELECT 
        \`商品类目-zh\` as category,
        COUNT(*) as productCount,
        SUM(销量) as totalSales,
        AVG((商品价格最小值 + 商品价格最大值) / 2) as avgPrice,
        AVG(商品星级) as avgRating
      FROM ${this.tableName}
      WHERE \`商品类目-zh\` IS NOT NULL
      GROUP BY \`商品类目-zh\`
      ORDER BY totalSales DESC
    `;

    return this.db.query(sql);
  }

  /**
   * 获取店铺排行
   */
  async getTopShops(limit: number = 10): Promise<Array<{
    shopName: string;
    productCount: number;
    totalSales: number;
    avgRating: number;
  }>> {
    const sql = `
      SELECT 
        店铺名称 as shopName,
        COUNT(*) as productCount,
        SUM(销量) as totalSales,
        AVG(商品星级) as avgRating
      FROM ${this.tableName}
      WHERE 店铺名称 IS NOT NULL
      GROUP BY 店铺名称
      ORDER BY totalSales DESC
      LIMIT ?
    `;

    return this.db.query(sql, [limit]);
  }

  /**
   * 获取新品（最近上架）
   */
  async getNewProducts(days: number = 30, limit: number = 20): Promise<TikTokProduct[]> {
    const sql = `
      SELECT * FROM ${this.tableName}
      WHERE 上架时间 IS NOT NULL 
        AND date(上架时间) >= date('now', '-${days} days')
      ORDER BY 上架时间 DESC
      LIMIT ?
    `;

    return this.db.query<TikTokProduct>(sql, [limit]);
  }

  /**
   * 获取高增长商品（销量环比高）
   */
  async getHighGrowthProducts(minGrowthRate: number = 50, limit: number = 10): Promise<TikTokProduct[]> {
    const sql = `
      SELECT * FROM ${this.tableName}
      WHERE 销量环比 >= ?
      ORDER BY 销量环比 DESC
      LIMIT ?
    `;

    return this.db.query<TikTokProduct>(sql, [minGrowthRate, limit]);
  }

  /**
   * 获取达人带货商品
   */
  async getInfluencerProducts(minInfluencers: number = 5, limit: number = 20): Promise<TikTokProduct[]> {
    const sql = `
      SELECT * FROM ${this.tableName}
      WHERE 带货达人数 >= ?
      ORDER BY 带货达人数 DESC, 销量 DESC
      LIMIT ?
    `;

    return this.db.query<TikTokProduct>(sql, [minInfluencers, limit]);
  }

  /**
   * 获取地区销售统计
   */
  async getRegionStats(): Promise<Array<{
    region: string;
    productCount: number;
    totalSales: number;
    avgPrice: number;
  }>> {
    const sql = `
      SELECT 
        \`国家、地区\` as region,
        COUNT(*) as productCount,
        SUM(销量) as totalSales,
        AVG((商品价格最小值 + 商品价格最大值) / 2) as avgPrice
      FROM ${this.tableName}
      WHERE \`国家、地区\` IS NOT NULL
      GROUP BY \`国家、地区\`
      ORDER BY totalSales DESC
    `;

    return this.db.query(sql);
  }

  /**
   * 获取运营模式统计
   */
  async getOperationModeStats(): Promise<Array<{
    operationMode: string;
    count: number;
    avgSales: number;
    avgRevenue: number;
  }>> {
    const sql = `
      SELECT 
        运营模式 as operationMode,
        COUNT(*) as count,
        AVG(销量) as avgSales,
        AVG(销售额) as avgRevenue
      FROM ${this.tableName}
      WHERE 运营模式 IS NOT NULL
      GROUP BY 运营模式
      ORDER BY count DESC
    `;

    return this.db.query(sql);
  }
}
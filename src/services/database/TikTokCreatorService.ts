import { BaseService } from './BaseService';
import { TikTokCreator, PaginatedResult } from '@/types/database';

export class TikTokCreatorService extends BaseService<TikTokCreator> {
  constructor() {
    super('insight_video_tk_creator');
  }

  /**
   * 按粉丝数排序获取达人
   */
  async getTopCreatorsByFollowers(limit: number = 10): Promise<TikTokCreator[]> {
    const sql = `
      SELECT * FROM ${this.tableName}
      ORDER BY 达人粉丝数 DESC
      LIMIT ?
    `;
    return this.db.query<TikTokCreator>(sql, [limit]);
  }

  /**
   * 按销售额排序获取达人
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
   * 按GPM（千次曝光收益）获取达人
   */
  async getTopCreatorsByGPM(type: 'video' | 'live', limit: number = 10): Promise<TikTokCreator[]> {
    const column = type === 'video' ? '视频GPM' : '直播GPM';
    const sql = `
      SELECT * FROM ${this.tableName}
      WHERE ${column} IS NOT NULL
      ORDER BY ${column} DESC
      LIMIT ?
    `;
    return this.db.query<TikTokCreator>(sql, [limit]);
  }

  /**
   * 搜索达人
   */
  async searchCreators(params: {
    name?: string;
    account?: string;
    minFollowers?: number;
    maxFollowers?: number;
    minSales?: number;
    creatorType?: string;
    hasMCN?: boolean;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResult<TikTokCreator>> {
    const whereConditions: string[] = [];
    const queryParams: any[] = [];

    if (params.name) {
      whereConditions.push('达人名称 LIKE ?');
      queryParams.push(`%${params.name}%`);
    }

    if (params.account) {
      whereConditions.push('达人账号 LIKE ?');
      queryParams.push(`%${params.account}%`);
    }

    if (params.minFollowers !== undefined) {
      whereConditions.push('达人粉丝数 >= ?');
      queryParams.push(params.minFollowers);
    }

    if (params.maxFollowers !== undefined) {
      whereConditions.push('达人粉丝数 <= ?');
      queryParams.push(params.maxFollowers);
    }

    if (params.minSales !== undefined) {
      whereConditions.push('近30日销售额 >= ?');
      queryParams.push(params.minSales);
    }

    if (params.creatorType) {
      whereConditions.push('达人类型 = ?');
      queryParams.push(params.creatorType);
    }

    if (params.hasMCN !== undefined) {
      whereConditions.push('MCN = ?');
      queryParams.push(params.hasMCN ? 1 : 0);
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

  /**
   * 获取粉丝增长最快的达人
   */
  async getFastestGrowingCreators(limit: number = 10): Promise<TikTokCreator[]> {
    const sql = `
      SELECT * FROM ${this.tableName}
      WHERE 粉丝增长数 IS NOT NULL AND 粉丝增长数 > 0
      ORDER BY 粉丝增长数 DESC
      LIMIT ?
    `;
    return this.db.query<TikTokCreator>(sql, [limit]);
  }

  /**
   * 获取带货达人统计
   */
  async getEcommerceStats(): Promise<{
    totalCreators: number;
    avgSales: number;
    avgProducts: number;
    avgVideoGPM: number;
    avgLiveGPM: number;
  }> {
    const sql = `
      SELECT 
        COUNT(*) as totalCreators,
        AVG(近30日销售额) as avgSales,
        AVG(达人带货数) as avgProducts,
        AVG(视频GPM) as avgVideoGPM,
        AVG(直播GPM) as avgLiveGPM
      FROM ${this.tableName}
      WHERE 近30日销售额 > 0
    `;
    
    const result = await this.db.queryOne<any>(sql);
    return {
      totalCreators: result.totalCreators || 0,
      avgSales: result.avgSales || 0,
      avgProducts: result.avgProducts || 0,
      avgVideoGPM: result.avgVideoGPM || 0,
      avgLiveGPM: result.avgLiveGPM || 0
    };
  }

  /**
   * 按达人类型分组统计
   */
  async getStatsByCreatorType(): Promise<Array<{
    creatorType: string;
    count: number;
    avgFollowers: number;
    avgSales: number;
  }>> {
    const sql = `
      SELECT 
        达人类型 as creatorType,
        COUNT(*) as count,
        AVG(达人粉丝数) as avgFollowers,
        AVG(近30日销售额) as avgSales
      FROM ${this.tableName}
      WHERE 达人类型 IS NOT NULL
      GROUP BY 达人类型
      ORDER BY count DESC
    `;
    
    return this.db.query(sql);
  }

  /**
   * 获取MCN机构统计
   */
  async getMCNStats(): Promise<{
    withMCN: number;
    withoutMCN: number;
    mcnAvgFollowers: number;
    nonMcnAvgFollowers: number;
  }> {
    const sql = `
      SELECT 
        SUM(CASE WHEN MCN = 1 THEN 1 ELSE 0 END) as withMCN,
        SUM(CASE WHEN MCN = 0 THEN 1 ELSE 0 END) as withoutMCN,
        AVG(CASE WHEN MCN = 1 THEN 达人粉丝数 ELSE NULL END) as mcnAvgFollowers,
        AVG(CASE WHEN MCN = 0 THEN 达人粉丝数 ELSE NULL END) as nonMcnAvgFollowers
      FROM ${this.tableName}
    `;
    
    const result = await this.db.queryOne<any>(sql);
    return {
      withMCN: result.withMCN || 0,
      withoutMCN: result.withoutMCN || 0,
      mcnAvgFollowers: result.mcnAvgFollowers || 0,
      nonMcnAvgFollowers: result.nonMcnAvgFollowers || 0
    };
  }

  /**
   * 获取综合表现最好的达人（综合考虑粉丝、销售、GPM等）
   */
  async getTopPerformers(limit: number = 10): Promise<TikTokCreator[]> {
    const sql = `
      SELECT *,
        (
          COALESCE(达人粉丝数 / 1000000.0, 0) * 0.2 +
          COALESCE(近30日销售额 / 100000.0, 0) * 0.4 +
          COALESCE(视频GPM, 0) * 0.2 +
          COALESCE(均播量 / 100000.0, 0) * 0.2
        ) as performance_score
      FROM ${this.tableName}
      ORDER BY performance_score DESC
      LIMIT ?
    `;
    
    return this.db.query<TikTokCreator>(sql, [limit]);
  }
}
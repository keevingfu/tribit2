import { BaseService } from './BaseService';
import { InsightSearch, SearchParams, PaginatedResult } from '@/types/database';

export class InsightSearchService extends BaseService<InsightSearch> {
  constructor() {
    super('insight_search');
  }

  /**
   * 根据关键词搜索
   */
  async searchByKeyword(keyword: string, params?: SearchParams): Promise<InsightSearch[]> {
    let sql = `SELECT * FROM ${this.tableName} WHERE keyword LIKE ?`;
    const queryParams: any[] = [`%${keyword}%`];

    // 添加区域过滤
    if (params?.region) {
      sql += ` AND region = ?`;
      queryParams.push(params.region);
    }

    // 添加语言过滤
    if (params?.language) {
      sql += ` AND language = ?`;
      queryParams.push(params.language);
    }

    // 添加排序
    if (params?.orderBy) {
      sql += ` ORDER BY ${params.orderBy} ${params.order || 'DESC'}`;
    } else {
      sql += ` ORDER BY search_volume DESC`; // 默认按搜索量排序
    }

    // 添加分页
    if (params?.limit) {
      sql += ` LIMIT ? OFFSET ?`;
      queryParams.push(params.limit, params.offset || 0);
    }

    return this.db.query<InsightSearch>(sql, queryParams);
  }

  /**
   * 获取热门搜索词
   */
  async getTopSearches(
    limit: number = 10,
    region?: string,
    language?: string
  ): Promise<InsightSearch[]> {
    let sql = `SELECT * FROM ${this.tableName} WHERE 1=1`;
    const params: any[] = [];

    if (region) {
      sql += ` AND region = ?`;
      params.push(region);
    }

    if (language) {
      sql += ` AND language = ?`;
      params.push(language);
    }

    sql += ` ORDER BY search_volume DESC LIMIT ?`;
    params.push(limit);

    return this.db.query<InsightSearch>(sql, params);
  }

  /**
   * 按地区统计搜索量
   */
  async getSearchVolumeByRegion(): Promise<Array<{ region: string; total_volume: number; avg_cpc: number }>> {
    const sql = `
      SELECT 
        region,
        SUM(search_volume) as total_volume,
        AVG(cost_per_click) as avg_cpc
      FROM ${this.tableName}
      WHERE region IS NOT NULL
      GROUP BY region
      ORDER BY total_volume DESC
    `;

    return this.db.query(sql);
  }

  /**
   * 按语言统计搜索词数量
   */
  async getKeywordCountByLanguage(): Promise<Array<{ language: string; keyword_count: number }>> {
    const sql = `
      SELECT 
        language,
        COUNT(DISTINCT keyword) as keyword_count
      FROM ${this.tableName}
      WHERE language IS NOT NULL
      GROUP BY language
      ORDER BY keyword_count DESC
    `;

    return this.db.query(sql);
  }

  /**
   * 获取搜索建议
   */
  async getSuggestions(keyword: string, limit: number = 5): Promise<string[]> {
    const sql = `
      SELECT DISTINCT suggestion 
      FROM ${this.tableName}
      WHERE keyword LIKE ? AND suggestion IS NOT NULL
      LIMIT ?
    `;

    const results = await this.db.query<{ suggestion: string }>(sql, [`%${keyword}%`, limit]);
    return results.map(r => r.suggestion);
  }

  /**
   * 获取价格区间的关键词
   */
  async getKeywordsByCPCRange(minCPC: number, maxCPC: number, limit?: number): Promise<InsightSearch[]> {
    let sql = `
      SELECT * FROM ${this.tableName}
      WHERE cost_per_click BETWEEN ? AND ?
      ORDER BY search_volume DESC
    `;
    const params: any[] = [minCPC, maxCPC];

    if (limit) {
      sql += ` LIMIT ?`;
      params.push(limit);
    }

    return this.db.query<InsightSearch>(sql, params);
  }

  /**
   * 获取修饰词统计
   */
  async getModifierStats(): Promise<Array<{ modifier_type: string; modifier: string; count: number }>> {
    const sql = `
      SELECT 
        modifier_type,
        modifier,
        COUNT(*) as count
      FROM ${this.tableName}
      WHERE modifier IS NOT NULL AND modifier_type IS NOT NULL
      GROUP BY modifier_type, modifier
      ORDER BY count DESC
    `;

    return this.db.query(sql);
  }

  /**
   * 高级搜索
   */
  async advancedSearch(params: {
    keywords?: string[];
    regions?: string[];
    languages?: string[];
    minVolume?: number;
    maxVolume?: number;
    minCPC?: number;
    maxCPC?: number;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResult<InsightSearch>> {
    const whereConditions: string[] = [];
    const queryParams: any[] = [];

    // 关键词条件
    if (params.keywords && params.keywords.length > 0) {
      const keywordConditions = params.keywords.map(() => 'keyword LIKE ?').join(' OR ');
      whereConditions.push(`(${keywordConditions})`);
      params.keywords.forEach(kw => queryParams.push(`%${kw}%`));
    }

    // 地区条件
    if (params.regions && params.regions.length > 0) {
      const placeholders = params.regions.map(() => '?').join(',');
      whereConditions.push(`region IN (${placeholders})`);
      queryParams.push(...params.regions);
    }

    // 语言条件
    if (params.languages && params.languages.length > 0) {
      const placeholders = params.languages.map(() => '?').join(',');
      whereConditions.push(`language IN (${placeholders})`);
      queryParams.push(...params.languages);
    }

    // 搜索量条件
    if (params.minVolume !== undefined) {
      whereConditions.push('search_volume >= ?');
      queryParams.push(params.minVolume);
    }
    if (params.maxVolume !== undefined) {
      whereConditions.push('search_volume <= ?');
      queryParams.push(params.maxVolume);
    }

    // CPC条件
    if (params.minCPC !== undefined) {
      whereConditions.push('cost_per_click >= ?');
      queryParams.push(params.minCPC);
    }
    if (params.maxCPC !== undefined) {
      whereConditions.push('cost_per_click <= ?');
      queryParams.push(params.maxCPC);
    }

    const whereClause = whereConditions.length > 0 ? whereConditions.join(' AND ') : undefined;
    
    return this.getPaginated(
      params.page || 1,
      params.pageSize || 20,
      whereClause,
      queryParams,
      'search_volume DESC'
    );
  }
}
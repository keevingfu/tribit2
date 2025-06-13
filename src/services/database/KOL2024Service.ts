import { BaseService } from './BaseService';
import { PaginatedResult, QueryParams } from '@/types/database';

/**
 * KOL数据（2024表）
 */
export interface KOL2024 {
  'No.': number;
  platform: string;
  kol_account: string;
  kol_post_url: string;
}

/**
 * KOL搜索参数
 */
export interface KOLSearchParams {
  keyword?: string;
  platform?: string;
  page?: number;
  pageSize?: number;
  orderBy?: 'No.' | 'platform' | 'kol_account';
  order?: 'ASC' | 'DESC';
}

/**
 * KOL平台统计
 */
export interface KOLPlatformStats {
  platform: string;
  count: number;
  percentage: number;
}

/**
 * KOL Service for kol_tribit_2024 table
 * 处理2024年KOL数据的服务层
 */
export class KOL2024Service extends BaseService<KOL2024> {
  constructor() {
    super('kol_tribit_2024');
  }

  /**
   * 获取KOL列表（支持分页、搜索、排序）
   */
  async getList(params: KOLSearchParams = {}): Promise<PaginatedResult<KOL2024>> {
    const {
      keyword,
      platform,
      page = 1,
      pageSize = 20,
      orderBy = 'No.',
      order = 'ASC'
    } = params;

    const whereConditions: string[] = [];
    const queryParams: any[] = [];

    // 搜索条件 - 支持账号名称和URL搜索
    if (keyword) {
      whereConditions.push('(kol_account LIKE ? OR kol_post_url LIKE ?)');
      queryParams.push(`%${keyword}%`, `%${keyword}%`);
    }

    // 平台筛选
    if (platform) {
      whereConditions.push('platform = ?');
      queryParams.push(platform);
    }

    const whereClause = whereConditions.length > 0 ? whereConditions.join(' AND ') : undefined;
    
    // 确保排序字段名称正确（处理特殊字符）
    const orderByClause = orderBy === 'No.' ? '`No.`' : orderBy;

    return this.getPaginated(
      page,
      pageSize,
      whereClause,
      queryParams,
      `${orderByClause} ${order}`
    );
  }

  /**
   * 根据ID获取单个KOL
   */
  async getById(id: string | number, idField?: string): Promise<KOL2024 | undefined> {
    const result = await this.queryOne(
      'SELECT * FROM kol_tribit_2024 WHERE `No.` = ?',
      [id]
    );
    return result || undefined;
  }

  /**
   * 根据平台获取KOL列表
   */
  async getByPlatform(platform: string, limit?: number): Promise<KOL2024[]> {
    let sql = 'SELECT * FROM kol_tribit_2024 WHERE platform = ? ORDER BY `No.` ASC';
    const params: any[] = [platform];

    if (limit) {
      sql += ' LIMIT ?';
      params.push(limit);
    }

    return this.query(sql, params);
  }

  /**
   * 获取热门KOL（根据序号排序，假设序号越小越重要）
   */
  async getTopPerformers(limit: number = 10, platform?: string): Promise<KOL2024[]> {
    let sql = 'SELECT * FROM kol_tribit_2024';
    const params: any[] = [];

    if (platform) {
      sql += ' WHERE platform = ?';
      params.push(platform);
    }

    sql += ' ORDER BY `No.` ASC LIMIT ?';
    params.push(limit);

    return this.query(sql, params);
  }

  /**
   * 搜索KOL（支持账号名称和URL）
   */
  async search(searchFields: string[], searchTerm: string, params?: QueryParams): Promise<KOL2024[]> {
    // For backward compatibility, if searchFields is actually a string (the keyword), handle it
    if (typeof searchFields === 'string') {
      const keyword = searchFields;
      const limit = typeof searchTerm === 'number' ? searchTerm : 50;
      return this.query(
        'SELECT * FROM kol_tribit_2024 WHERE kol_account LIKE ? OR kol_post_url LIKE ? ORDER BY `No.` ASC LIMIT ?',
        [`%${keyword}%`, `%${keyword}%`, limit]
      );
    }
    
    // Normal BaseService search implementation
    return super.search(searchFields, searchTerm, params);
  }

  /**
   * 获取平台统计数据
   */
  async getPlatformStats(): Promise<KOLPlatformStats[]> {
    // 获取每个平台的数量
    const stats = await this.groupBy<{ platform: string; count: number }>(
      'platform',
      'platform, COUNT(*) as count',
      'platform IS NOT NULL'
    );

    // 获取总数
    const total = await this.getCount();

    // 计算百分比
    return stats.map(stat => ({
      platform: stat.platform,
      count: stat.count,
      percentage: total > 0 ? Math.round((stat.count / total) * 10000) / 100 : 0
    }));
  }

  /**
   * 获取所有平台列表
   */
  async getPlatforms(): Promise<string[]> {
    const result = await this.getDistinct<{ platform: string }>('platform', 'platform IS NOT NULL');
    return result.map(r => r.platform);
  }

  /**
   * 批量获取KOL
   */
  async getByIds(ids: number[]): Promise<KOL2024[]> {
    if (ids.length === 0) return [];
    
    const placeholders = ids.map(() => '?').join(',');
    const sql = `SELECT * FROM kol_tribit_2024 WHERE \`No.\` IN (${placeholders}) ORDER BY \`No.\` ASC`;
    
    return this.query(sql, ids);
  }

  /**
   * 获取KOL总数
   */
  async getTotalCount(platform?: string): Promise<number> {
    if (platform) {
      return this.getCount('platform = ?', [platform]);
    }
    return this.getCount();
  }

  /**
   * 检查KOL账号是否存在
   */
  async checkAccountExists(kolAccount: string): Promise<boolean> {
    const result = await this.queryOne(
      'SELECT 1 FROM kol_tribit_2024 WHERE kol_account = ? LIMIT 1',
      [kolAccount]
    );
    return result !== null;
  }

  /**
   * 获取随机KOL样本
   */
  async getRandomSample(count: number = 10, platform?: string): Promise<KOL2024[]> {
    let sql = 'SELECT * FROM kol_tribit_2024';
    const params: any[] = [];

    if (platform) {
      sql += ' WHERE platform = ?';
      params.push(platform);
    }

    sql += ' ORDER BY RANDOM() LIMIT ?';
    params.push(count);

    return this.query(sql, params);
  }

  /**
   * 导出数据（用于报表）
   */
  async exportData(platform?: string): Promise<KOL2024[]> {
    if (platform) {
      return this.query(
        'SELECT * FROM kol_tribit_2024 WHERE platform = ? ORDER BY `No.` ASC',
        [platform]
      );
    }
    return this.query('SELECT * FROM kol_tribit_2024 ORDER BY `No.` ASC');
  }

  /**
   * 获取账号名称建议（用于自动完成）
   */
  async getAccountSuggestions(prefix: string, limit: number = 10): Promise<string[]> {
    const results = await this.query<{ kol_account: string }>(
      'SELECT DISTINCT kol_account FROM kol_tribit_2024 WHERE kol_account LIKE ? ORDER BY kol_account LIMIT ?',
      [`${prefix}%`, limit]
    );
    return results.map(r => r.kol_account);
  }
}

// 导出单例实例
export const kol2024Service = new KOL2024Service();
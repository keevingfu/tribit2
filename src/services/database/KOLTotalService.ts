import { BaseService } from './BaseService';

export interface KOLTotal {
  'No.': number;
  Region: string;
  Platform: string;
  kol_account: string;
  kol_url: string;
}

export interface KOL2024 {
  'No.': number;
  platform: string;
  kol_account: string;
  kol_post_url: string;
}

export interface KOLIndia {
  'No.': number;
  Region: string;
  Platform: string;
  kol_account: string;
  kol_url: string;
}

class KOLTotalService extends BaseService {
  constructor() {
    super('kol_tribit_total');
  }

  // Get all KOL total data with pagination
  async getKOLTotalList(params: {
    page?: number;
    pageSize?: number;
    platform?: string;
    region?: string;
  } = {}) {
    const { page = 1, pageSize = 20, platform, region } = params;
    const offset = (page - 1) * pageSize;
    
    let whereClause = '';
    const whereConditions: string[] = [];
    const queryParams: any[] = [];
    
    if (platform) {
      whereConditions.push('Platform = ?');
      queryParams.push(platform);
    }
    
    if (region) {
      whereConditions.push('Region = ?');
      queryParams.push(region);
    }
    
    if (whereConditions.length > 0) {
      whereClause = 'WHERE ' + whereConditions.join(' AND ');
    }
    
    const countSql = `SELECT COUNT(*) as total FROM ${this.tableName} ${whereClause}`;
    const dataSql = `
      SELECT * FROM ${this.tableName} 
      ${whereClause}
      ORDER BY "No." DESC
      LIMIT ? OFFSET ?
    `;
    
    const countResult = await this.db.queryOne<{ total: number }>(
      countSql, 
      queryParams
    );
    
    const data = await this.db.query<KOLTotal>(
      dataSql, 
      [...queryParams, pageSize, offset]
    );
    
    return {
      data,
      pagination: {
        page,
        pageSize,
        total: countResult?.total || 0,
        totalPages: Math.ceil((countResult?.total || 0) / pageSize)
      }
    };
  }

  // Get KOL 2024 data
  async getKOL2024List(params: {
    page?: number;
    pageSize?: number;
    platform?: string;
  } = {}) {
    const { page = 1, pageSize = 20, platform } = params;
    const offset = (page - 1) * pageSize;
    
    let whereClause = '';
    const queryParams: any[] = [];
    
    if (platform) {
      whereClause = 'WHERE platform = ?';
      queryParams.push(platform);
    }
    
    const countSql = `SELECT COUNT(*) as total FROM kol_tribit_2024 ${whereClause}`;
    const dataSql = `
      SELECT * FROM kol_tribit_2024 
      ${whereClause}
      ORDER BY "No." DESC
      LIMIT ? OFFSET ?
    `;
    
    const countResult = await this.db.queryOne<{ total: number }>(
      countSql, 
      queryParams
    );
    
    const data = await this.db.query<KOL2024>(
      dataSql, 
      [...queryParams, pageSize, offset]
    );
    
    return {
      data,
      pagination: {
        page,
        pageSize,
        total: countResult?.total || 0,
        totalPages: Math.ceil((countResult?.total || 0) / pageSize)
      }
    };
  }

  // Get KOL India data
  async getKOLIndiaList(params: {
    page?: number;
    pageSize?: number;
    platform?: string;
  } = {}) {
    const { page = 1, pageSize = 20, platform } = params;
    const offset = (page - 1) * pageSize;
    
    let whereClause = '';
    const queryParams: any[] = [];
    
    if (platform) {
      whereClause = 'WHERE Platform = ?';
      queryParams.push(platform);
    }
    
    const countSql = `SELECT COUNT(*) as total FROM kol_tribit_india ${whereClause}`;
    const dataSql = `
      SELECT * FROM kol_tribit_india 
      ${whereClause}
      ORDER BY "No." DESC
      LIMIT ? OFFSET ?
    `;
    
    const countResult = await this.db.queryOne<{ total: number }>(
      countSql, 
      queryParams
    );
    
    const data = await this.db.query<KOLIndia>(
      dataSql, 
      [...queryParams, pageSize, offset]
    );
    
    return {
      data,
      pagination: {
        page,
        pageSize,
        total: countResult?.total || 0,
        totalPages: Math.ceil((countResult?.total || 0) / pageSize)
      }
    };
  }

  // Get platform distribution across all tables
  async getPlatformDistribution() {
    const sql = `
      SELECT 
        Platform as platform,
        COUNT(*) as count,
        'kol_total' as source
      FROM kol_tribit_total
      GROUP BY Platform
      
      UNION ALL
      
      SELECT 
        platform,
        COUNT(*) as count,
        'kol_2024' as source
      FROM kol_tribit_2024
      GROUP BY platform
      
      UNION ALL
      
      SELECT 
        Platform as platform,
        COUNT(*) as count,
        'kol_india' as source
      FROM kol_tribit_india
      GROUP BY Platform
    `;
    
    return await this.db.query<{ platform: string; count: number; source: string }>(sql);
  }

  // Get region distribution
  async getRegionDistribution() {
    const sql = `
      SELECT 
        Region,
        COUNT(*) as count
      FROM (
        SELECT Region FROM kol_tribit_total WHERE Region IS NOT NULL
        UNION ALL
        SELECT Region FROM kol_tribit_india WHERE Region IS NOT NULL
      )
      GROUP BY Region
      ORDER BY count DESC
    `;
    
    return await this.db.query<{ Region: string; count: number }>(sql);
  }

  // Get video URLs for preview
  async getVideoUrls(limit: number = 10, region?: string) {
    // First try to get YouTube videos from kol_tribit_total and kol_tribit_india which have region data
    let sql = `
      SELECT * FROM (
        SELECT 
          t.kol_account,
          t.kol_url as url,
          t.Platform as platform,
          t.Region as region,
          'kol_total' as source
        FROM kol_tribit_total t
        WHERE t.kol_url LIKE '%youtube.com%'
          AND t.kol_url NOT LIKE '%@%'
          ${region ? 'AND t.Region = ?' : ''}
        
        UNION ALL
        
        SELECT 
          i.kol_account,
          i.kol_url as url,
          i.Platform as platform,
          i.Region as region,
          'kol_india' as source
        FROM kol_tribit_india i
        WHERE i.kol_url LIKE '%youtube.com%'
          AND i.kol_url NOT LIKE '%@%'
          ${region ? 'AND i.Region = ?' : ''}
      )
      ORDER BY RANDOM()
      LIMIT ?
    `;
    
    const params = region ? [region, region, limit] : [limit];
    
    let results = await this.db.query<{ 
      kol_account: string; 
      url: string; 
      platform: string;
      region: string;
      source: string 
    }>(sql, params);
    
    // If not enough results, also get from kol_2024 (but without region info)
    if (results.length < limit && !region) {
      const remainingLimit = limit - results.length;
      const sql2024 = `
        SELECT 
          kol_account,
          kol_post_url as url,
          platform,
          NULL as region,
          'kol_2024' as source
        FROM kol_tribit_2024
        WHERE kol_post_url LIKE '%youtube.com%'
        ORDER BY RANDOM()
        LIMIT ?
      `;
      
      const results2024 = await this.db.query<{ 
        kol_account: string; 
        url: string; 
        platform: string;
        region: string;
        source: string 
      }>(sql2024, [remainingLimit]);
      
      results = results.concat(results2024);
    }
    
    return results;
  }

  // Get statistics
  async getStatistics() {
    const totalCountSql = `
      SELECT 
        (SELECT COUNT(*) FROM kol_tribit_total) as total_kols,
        (SELECT COUNT(*) FROM kol_tribit_2024) as kols_2024,
        (SELECT COUNT(*) FROM kol_tribit_india) as india_kols,
        (SELECT COUNT(DISTINCT platform) FROM kol_tribit_2024) as platforms
    `;
    
    return await this.db.queryOne<{
      total_kols: number;
      kols_2024: number;
      india_kols: number;
      platforms: number;
    }>(totalCountSql);
  }
}

export default KOLTotalService;
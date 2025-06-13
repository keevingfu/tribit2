import { BaseService } from './BaseService';
import { InsightSearch, TikTokProduct } from '@/types/database';
import DatabaseConnection from './connection';

interface ConsumerVoiceInsight {
  category: string;
  insights: string[];
  trending_keywords: string[];
  sentiment_score?: number;
  confidence: number;
}

interface SearchIntent {
  intent_type: 'informational' | 'navigational' | 'transactional' | 'commercial';
  keywords: string[];
  percentage: number;
}

interface UserNeed {
  need_category: string;
  frequency: number;
  related_keywords: string[];
  example_searches: string[];
}

/**
 * 消费者之声洞察服务
 * 通过分析搜索数据和产品数据来提取消费者洞察
 */
export class InsightConsumerVoiceService extends BaseService<any> {
  private searchTable = 'insight_search';
  private productTable = 'insight_video_tk_product';

  constructor() {
    super('insight_search'); // 使用search表作为主表
  }

  /**
   * 获取消费者需求分析
   */
  async getConsumerNeeds(region?: string, language?: string): Promise<UserNeed[]> {
    let sql = `
      SELECT 
        modifier_type as need_category,
        COUNT(*) as frequency,
        GROUP_CONCAT(DISTINCT modifier) as modifiers,
        GROUP_CONCAT(DISTINCT keyword, '|||') as keywords
      FROM ${this.searchTable}
      WHERE modifier_type IS NOT NULL
    `;
    const params: any[] = [];

    if (region) {
      sql += ` AND region = ?`;
      params.push(region);
    }

    if (language) {
      sql += ` AND language = ?`;
      params.push(language);
    }

    sql += `
      GROUP BY modifier_type
      ORDER BY frequency DESC
      LIMIT 20
    `;

    const results = await this.db.query<any>(sql, params);

    return results.map(r => ({
      need_category: r.need_category,
      frequency: r.frequency,
      related_keywords: r.modifiers ? r.modifiers.split(',').slice(0, 10) : [],
      example_searches: r.keywords ? r.keywords.split('|||').slice(0, 5) : []
    }));
  }

  /**
   * 分析搜索意图
   */
  async analyzeSearchIntent(region?: string): Promise<SearchIntent[]> {
    // 基于关键词模式分析搜索意图
    const intents: Array<{ pattern: string; type: SearchIntent['intent_type'] }> = [
      { pattern: 'how|what|why|when|where|guide|tutorial', type: 'informational' },
      { pattern: 'buy|price|cheap|deal|discount|sale', type: 'transactional' },
      { pattern: 'best|top|review|compare|vs', type: 'commercial' },
      { pattern: 'official|website|login|download', type: 'navigational' }
    ];

    const results: SearchIntent[] = [];

    for (const intent of intents) {
      let sql = `
        SELECT 
          COUNT(*) as count,
          GROUP_CONCAT(DISTINCT keyword, '|||') as keywords
        FROM ${this.searchTable}
        WHERE keyword REGEXP ?
      `;
      const params: any[] = [intent.pattern];

      if (region) {
        sql += ` AND region = ?`;
        params.push(region);
      }

      const result = await this.queryOne<any>(sql, params);

      if (result && result.count > 0) {
        // 获取总数以计算百分比
        const totalSql = `SELECT COUNT(*) as total FROM ${this.searchTable}` + (region ? ` WHERE region = ?` : '');
        const totalResult = await this.queryOne<any>(totalSql, region ? [region] : []);
        const total = totalResult?.total || 1;

        results.push({
          intent_type: intent.type,
          keywords: result.keywords ? result.keywords.split('|||').slice(0, 10) : [],
          percentage: Math.round((result.count / total) * 100)
        });
      }
    }

    return results.sort((a, b) => b.percentage - a.percentage);
  }

  /**
   * 获取热门话题和趋势
   */
  async getTrendingTopics(limit: number = 10): Promise<Array<{ topic: string; mentions: number; growth_rate: number }>> {
    // 分析高搜索量的关键词作为热门话题
    const sql = `
      SELECT 
        keyword as topic,
        search_volume as mentions,
        CASE 
          WHEN search_volume > 10000 THEN 100
          WHEN search_volume > 5000 THEN 50
          WHEN search_volume > 1000 THEN 20
          ELSE 10
        END as growth_rate
      FROM ${this.searchTable}
      WHERE search_volume IS NOT NULL
      ORDER BY search_volume DESC
      LIMIT ?
    `;

    return this.db.query(sql, [limit]);
  }

  /**
   * 获取消费者洞察
   */
  async getConsumerInsights(params?: {
    region?: string;
    language?: string;
    category?: string;
  }): Promise<ConsumerVoiceInsight[]> {
    // 按修饰词类型分组获取洞察
    let sql = `
      SELECT 
        modifier_type as category,
        COUNT(*) as count,
        AVG(search_volume) as avg_volume,
        GROUP_CONCAT(DISTINCT keyword, '|||') as keywords,
        GROUP_CONCAT(DISTINCT suggestion, '|||') as suggestions
      FROM ${this.searchTable}
      WHERE modifier_type IS NOT NULL
    `;
    const queryParams: any[] = [];

    if (params?.region) {
      sql += ` AND region = ?`;
      queryParams.push(params.region);
    }

    if (params?.language) {
      sql += ` AND language = ?`;
      queryParams.push(params.language);
    }

    if (params?.category) {
      sql += ` AND modifier_type = ?`;
      queryParams.push(params.category);
    }

    sql += `
      GROUP BY modifier_type
      ORDER BY count DESC
    `;

    const results = await this.db.query<any>(sql, queryParams);

    return results.map(r => {
      const keywords = r.keywords ? r.keywords.split('|||').filter(Boolean) : [];
      const suggestions = r.suggestions ? r.suggestions.split('|||').filter(Boolean) : [];

      // 生成洞察
      const insights: string[] = [];
      if (r.avg_volume > 5000) {
        insights.push(`High search volume indicates strong consumer interest in ${r.category}`);
      }
      if (keywords.length > 20) {
        insights.push(`Diverse search patterns suggest broad market appeal`);
      }
      if (suggestions.length > 0) {
        insights.push(`Related suggestions indicate potential cross-selling opportunities`);
      }

      return {
        category: r.category,
        insights,
        trending_keywords: keywords.slice(0, 10),
        confidence: Math.min(r.count / 10, 100) / 100 // 置信度基于数据量
      };
    });
  }

  /**
   * 获取产品需求洞察（结合产品数据）
   */
  async getProductDemandInsights(): Promise<Array<{
    category: string;
    demand_score: number;
    avg_price: number;
    top_products: string[];
  }>> {
    const sql = `
      SELECT 
        p.\`商品类目-zh\` as category,
        COUNT(DISTINCT p.商品名称) as product_count,
        SUM(p.销量) as total_sales,
        AVG((p.商品价格最大值 + p.商品价格最小值) / 2) as avg_price,
        GROUP_CONCAT(DISTINCT p.商品名称, '|||') as products
      FROM ${this.productTable} p
      WHERE p.\`商品类目-zh\` IS NOT NULL
      GROUP BY p.\`商品类目-zh\`
      ORDER BY total_sales DESC
      LIMIT 20
    `;

    const results = await this.db.query<any>(sql);

    return results.map(r => ({
      category: r.category,
      demand_score: Math.min(r.total_sales / 1000, 100), // 标准化需求分数
      avg_price: r.avg_price || 0,
      top_products: r.products ? r.products.split('|||').slice(0, 5) : []
    }));
  }

  /**
   * 获取价格敏感度分析
   */
  async getPriceSensitivityAnalysis(): Promise<Array<{
    keyword: string;
    search_volume: number;
    avg_cpc: number;
    price_sensitivity: 'high' | 'medium' | 'low';
  }>> {
    const sql = `
      SELECT 
        keyword,
        search_volume,
        cost_per_click as avg_cpc,
        CASE 
          WHEN keyword LIKE '%cheap%' OR keyword LIKE '%discount%' OR keyword LIKE '%deal%' THEN 'high'
          WHEN keyword LIKE '%best%' OR keyword LIKE '%quality%' THEN 'medium'
          ELSE 'low'
        END as price_sensitivity
      FROM ${this.searchTable}
      WHERE search_volume > 1000
        AND cost_per_click IS NOT NULL
      ORDER BY search_volume DESC
      LIMIT 50
    `;

    return this.db.query(sql);
  }

  /**
   * 获取地域偏好分析
   */
  async getRegionalPreferences(): Promise<Array<{
    region: string;
    top_categories: string[];
    avg_search_volume: number;
    preferred_language: string;
  }>> {
    const sql = `
      SELECT 
        region,
        GROUP_CONCAT(DISTINCT modifier_type) as categories,
        AVG(search_volume) as avg_search_volume,
        MAX(language) as preferred_language
      FROM ${this.searchTable}
      WHERE region IS NOT NULL
      GROUP BY region
      ORDER BY avg_search_volume DESC
    `;

    const results = await this.db.query<any>(sql);

    return results.map(r => ({
      region: r.region,
      top_categories: r.categories ? r.categories.split(',').slice(0, 5) : [],
      avg_search_volume: r.avg_search_volume || 0,
      preferred_language: r.preferred_language || 'Unknown'
    }));
  }

  /**
   * 获取竞争分析洞察
   */
  async getCompetitiveInsights(keyword: string): Promise<{
    keyword: string;
    competition_level: 'low' | 'medium' | 'high';
    related_keywords: string[];
    market_opportunity: number;
    recommendations: string[];
  }> {
    // 获取关键词信息
    const keywordSql = `
      SELECT * FROM ${this.searchTable}
      WHERE keyword = ?
    `;
    const keywordData = await this.queryOne<InsightSearch>(keywordSql, [keyword]);

    // 获取相关关键词
    const relatedSql = `
      SELECT DISTINCT keyword
      FROM ${this.searchTable}
      WHERE modifier IN (
        SELECT modifier FROM ${this.searchTable} WHERE keyword = ?
      )
      AND keyword != ?
      LIMIT 10
    `;
    const relatedResults = await this.db.query<any>(relatedSql, [keyword, keyword]);
    const relatedKeywords = relatedResults.map(r => r.keyword);

    // 计算竞争级别
    const cpc = keywordData?.cost_per_click || 0;
    const volume = keywordData?.search_volume || 0;
    let competitionLevel: 'low' | 'medium' | 'high' = 'low';
    
    if (cpc > 5 || volume > 10000) {
      competitionLevel = 'high';
    } else if (cpc > 2 || volume > 5000) {
      competitionLevel = 'medium';
    }

    // 计算市场机会分数
    const marketOpportunity = volume > 0 ? Math.min((volume / cpc) / 100, 100) : 0;

    // 生成建议
    const recommendations: string[] = [];
    if (competitionLevel === 'high') {
      recommendations.push('Consider long-tail keyword variations to reduce competition');
      recommendations.push('Focus on content quality and user intent');
    } else if (competitionLevel === 'medium') {
      recommendations.push('Good opportunity for targeted campaigns');
      recommendations.push('Monitor competitor strategies closely');
    } else {
      recommendations.push('Low competition presents growth opportunity');
      recommendations.push('Consider increasing investment in this keyword');
    }

    return {
      keyword,
      competition_level: competitionLevel,
      related_keywords: relatedKeywords,
      market_opportunity: marketOpportunity,
      recommendations
    };
  }
}
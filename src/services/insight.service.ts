import { InsightSearchService } from './database/InsightSearchService';
import { InsightVideoCreatorService, InsightVideoProductService } from './database/InsightVideoService';
import { InsightConsumerVoiceService } from './database/InsightConsumerVoiceService';

/**
 * Insight!W;�
 * t"�Ƒߌ�9K�IP�
 */
export class InsightService {
  private searchService: InsightSearchService;
  private videoCreatorService: InsightVideoCreatorService;
  private videoProductService: InsightVideoProductService;
  private consumerVoiceService: InsightConsumerVoiceService;

  constructor() {
    this.searchService = new InsightSearchService();
    this.videoCreatorService = new InsightVideoCreatorService();
    this.videoProductService = new InsightVideoProductService();
    this.consumerVoiceService = new InsightConsumerVoiceService();
  }

  /**
   * ��"��
   */
  get search() {
    return this.searchService;
  }

  /**
   * ��Ƒ\��
   */
  get videoCreator() {
    return this.videoCreatorService;
  }

  /**
   * ��Ƒ����
   */
  get videoProduct() {
    return this.videoProductService;
  }

  /**
   * �ֈ9K��
   */
  get consumerVoice() {
    return this.consumerVoiceService;
  }

  /**
   * �����hpn
   */
  async getDashboardStats() {
    try {
      // ��"ߡ
      const topSearches = await this.searchService.getTopSearches(5);
      const searchVolumeByRegion = await this.searchService.getSearchVolumeByRegion();
      const keywordCountByLanguage = await this.searchService.getKeywordCountByLanguage();

      // ��\ߡ
      const topCreators = await this.videoCreatorService.getTopCreatorsByFollowers(5);
      const creatorTypeStats = await this.videoCreatorService.getCreatorTypeStats();

      // �֧�ߡ
      const topProducts = await this.videoProductService.getTopProductsBySales(5);
      const productsByRegion = await this.videoProductService.getProductStatsByRegion();

      // �ֈ9�
      const trendingTopics = await this.consumerVoiceService.getTrendingTopics(5);
      const searchIntent = await this.consumerVoiceService.analyzeSearchIntent();

      return {
        search: {
          topKeywords: topSearches,
          volumeByRegion: searchVolumeByRegion,
          keywordsByLanguage: keywordCountByLanguage
        },
        creators: {
          topCreators,
          creatorTypes: creatorTypeStats
        },
        products: {
          topProducts,
          productsByRegion
        },
        insights: {
          trendingTopics,
          searchIntent
        }
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  /**
   * gL�!W��"
   */
  async globalSearch(keyword: string, options?: {
    includeSearch?: boolean;
    includeCreators?: boolean;
    includeProducts?: boolean;
    limit?: number;
  }) {
    const { 
      includeSearch = true, 
      includeCreators = true, 
      includeProducts = true,
      limit = 10 
    } = options || {};

    const results: any = {};

    try {
      // "s.�
      if (includeSearch) {
        results.searches = await this.searchService.searchByKeyword(keyword, { limit });
      }

      // "\
      if (includeCreators) {
        results.creators = await this.videoCreatorService.searchCreators(keyword, { limit });
      }

      // "��
      if (includeProducts) {
        results.products = await this.videoProductService.searchProducts(keyword, { limit });
      }

      // ���s�
      results.insights = await this.consumerVoiceService.getCompetitiveInsights(keyword);

      return results;
    } catch (error) {
      console.error('Error in global search:', error);
      throw error;
    }
  }

  /**
   * ��:���
   */
  async getMarketTrends(params?: {
    region?: string;
    timeRange?: 'week' | 'month' | 'quarter' | 'year';
  }) {
    try {
      // ����"��
      const searchTrends = await this.searchService.getTopSearches(20, params?.region);

      // ��؞\
      const growthCreators = await this.videoCreatorService.getHighGrowthCreators(10);

      // ��؞��
      const growthProducts = await this.videoProductService.getHighGrowthProducts(50, 10);

      // �ֈ9 B
      const consumerNeeds = await this.consumerVoiceService.getConsumerNeeds(params?.region);

      // �<���
      const priceTrends = await this.videoProductService.getPriceRangeAnalysis();

      return {
        searchTrends,
        risingCreators: growthCreators,
        trendingProducts: growthProducts,
        consumerDemands: consumerNeeds,
        priceAnalysis: priceTrends
      };
    } catch (error) {
      console.error('Error fetching market trends:', error);
      throw error;
    }
  }

  /**
   * ��މ��J
   */
  async getCompetitiveAnalysis(keyword: string, region?: string) {
    try {
      // ��s.�މ�
      const keywordInsights = await this.consumerVoiceService.getCompetitiveInsights(keyword);

      // ���s"�
      const relatedSearches = await this.searchService.searchByKeyword(keyword, { 
        limit: 20, 
        region 
      });

      // ���s.��s�\
      const relatedCreators = await this.videoCreatorService.searchCreators(keyword, { 
        limit: 10 
      });

      // ���s.��s���
      const relatedProducts = await this.videoProductService.searchProducts(keyword, { 
        limit: 10, 
        region 
      });

      // CPC�
      const cpcAnalysis = relatedSearches.map(s => ({
        keyword: s.keyword,
        cpc: s.cost_per_click,
        volume: s.search_volume,
        efficiency: s.search_volume && s.cost_per_click ? 
          s.search_volume / s.cost_per_click : 0
      })).sort((a, b) => b.efficiency - a.efficiency);

      return {
        overview: keywordInsights,
        relatedKeywords: relatedSearches,
        topCreators: relatedCreators,
        competingProducts: relatedProducts,
        cpcAnalysis: cpcAnalysis.slice(0, 10)
      };
    } catch (error) {
      console.error('Error in competitive analysis:', error);
      throw error;
    }
  }

  /**
   * �IߥJ
   */
  async generateInsightReport(params: {
    type: 'search' | 'creator' | 'product' | 'consumer';
    filters?: any;
    metrics?: string[];
  }) {
    const { type, filters = {}, metrics = [] } = params;

    try {
      switch (type) {
        case 'search':
          return await this._generateSearchReport(filters, metrics);
        case 'creator':
          return await this._generateCreatorReport(filters, metrics);
        case 'product':
          return await this._generateProductReport(filters, metrics);
        case 'consumer':
          return await this._generateConsumerReport(filters, metrics);
        default:
          throw new Error(`Unknown report type: ${type}`);
      }
    } catch (error) {
      console.error('Error generating insight report:', error);
      throw error;
    }
  }

  private async _generateSearchReport(filters: any, metrics: string[]) {
    const report: any = {
      type: 'search',
      generatedAt: new Date().toISOString(),
      data: {}
    };

    // �@pn
    if (metrics.includes('volume') || metrics.length === 0) {
      report.data.volumeByRegion = await this.searchService.getSearchVolumeByRegion();
    }

    if (metrics.includes('keywords') || metrics.length === 0) {
      report.data.topKeywords = await this.searchService.getTopSearches(
        filters.limit || 20,
        filters.region,
        filters.language
      );
    }

    if (metrics.includes('modifiers') || metrics.length === 0) {
      report.data.modifierStats = await this.searchService.getModifierStats();
    }

    if (metrics.includes('cpc')) {
      const minCPC = filters.minCPC || 0;
      const maxCPC = filters.maxCPC || 100;
      report.data.cpcRange = await this.searchService.getKeywordsByCPCRange(
        minCPC, 
        maxCPC, 
        filters.limit || 50
      );
    }

    return report;
  }

  private async _generateCreatorReport(filters: any, metrics: string[]) {
    const report: any = {
      type: 'creator',
      generatedAt: new Date().toISOString(),
      data: {}
    };

    if (metrics.includes('followers') || metrics.length === 0) {
      report.data.topByFollowers = await this.videoCreatorService.getTopCreatorsByFollowers(
        filters.limit || 20
      );
    }

    if (metrics.includes('sales') || metrics.length === 0) {
      report.data.topBySales = await this.videoCreatorService.getTopCreatorsBySales(
        filters.limit || 20
      );
    }

    if (metrics.includes('growth')) {
      report.data.highGrowth = await this.videoCreatorService.getHighGrowthCreators(
        filters.limit || 20
      );
    }

    if (metrics.includes('types')) {
      report.data.creatorTypes = await this.videoCreatorService.getCreatorTypeStats();
    }

    if (metrics.includes('mcn')) {
      report.data.mcnStats = await this.videoCreatorService.getMCNStats();
    }

    return report;
  }

  private async _generateProductReport(filters: any, metrics: string[]) {
    const report: any = {
      type: 'product',
      generatedAt: new Date().toISOString(),
      data: {}
    };

    if (metrics.includes('sales') || metrics.length === 0) {
      report.data.topBySales = await this.videoProductService.getTopProductsBySales(
        filters.limit || 20
      );
    }

    if (metrics.includes('revenue') || metrics.length === 0) {
      report.data.topByRevenue = await this.videoProductService.getTopProductsByRevenue(
        filters.limit || 20
      );
    }

    if (metrics.includes('categories')) {
      report.data.categoryStats = await this.videoProductService.getProductStatsByCategory(
        filters.language || 'zh'
      );
    }

    if (metrics.includes('regions')) {
      report.data.regionStats = await this.videoProductService.getProductStatsByRegion();
    }

    if (metrics.includes('ratings')) {
      report.data.highRated = await this.videoProductService.getHighRatedProducts(
        filters.minRating || 4.0,
        filters.limit || 20
      );
    }

    return report;
  }

  private async _generateConsumerReport(filters: any, metrics: string[]) {
    const report: any = {
      type: 'consumer',
      generatedAt: new Date().toISOString(),
      data: {}
    };

    if (metrics.includes('needs') || metrics.length === 0) {
      report.data.consumerNeeds = await this.consumerVoiceService.getConsumerNeeds(
        filters.region,
        filters.language
      );
    }

    if (metrics.includes('intent') || metrics.length === 0) {
      report.data.searchIntent = await this.consumerVoiceService.analyzeSearchIntent(
        filters.region
      );
    }

    if (metrics.includes('insights')) {
      report.data.insights = await this.consumerVoiceService.getConsumerInsights(filters);
    }

    if (metrics.includes('trends')) {
      report.data.trending = await this.consumerVoiceService.getTrendingTopics(
        filters.limit || 20
      );
    }

    if (metrics.includes('regions')) {
      report.data.regionalPreferences = await this.consumerVoiceService.getRegionalPreferences();
    }

    return report;
  }
}

// ��U�
export default new InsightService();
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import insightService from '../insight.service';
import DatabaseConnection from '../database/connection';

// Mock database connection for testing
jest.mock('../database/connection');

describe('InsightService', () => {
  beforeAll(() => {
    // Setup mock database connection
    const mockDb = {
      query: jest.fn(),
      queryOne: jest.fn(),
    };
    (DatabaseConnection.getInstance as jest.Mock).mockReturnValue(mockDb);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('InsightSearchService', () => {
    it('should get top searches', async () => {
      const mockSearches = [
        { id: 1, keyword: 'phone', search_volume: 10000, cost_per_click: 2.5 },
        { id: 2, keyword: 'laptop', search_volume: 8000, cost_per_click: 3.0 }
      ];

      const mockDb = DatabaseConnection.getInstance();
      (mockDb.query as jest.Mock).mockResolvedValue(mockSearches);

      const result = await insightService.search.getTopSearches(2);
      expect(result).toEqual(mockSearches);
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining('ORDER BY search_volume DESC'),
        [2]
      );
    });

    it('should search by keyword', async () => {
      const mockResults = [
        { id: 1, keyword: 'smartphone', search_volume: 5000 }
      ];

      const mockDb = DatabaseConnection.getInstance();
      (mockDb.query as jest.Mock).mockResolvedValue(mockResults);

      const result = await insightService.search.searchByKeyword('phone');
      expect(result).toEqual(mockResults);
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE keyword LIKE ?'),
        expect.arrayContaining(['%phone%'])
      );
    });
  });

  describe('InsightVideoCreatorService', () => {
    it('should get top creators by followers', async () => {
      const mockCreators = [
        { 达人名称: 'Creator1', 达人粉丝数: 1000000 },
        { 达人名称: 'Creator2', 达人粉丝数: 800000 }
      ];

      const mockDb = DatabaseConnection.getInstance();
      (mockDb.query as jest.Mock).mockResolvedValue(mockCreators);

      const result = await insightService.videoCreator.getTopCreatorsByFollowers(2);
      expect(result).toEqual(mockCreators);
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining('ORDER BY 达人粉丝数 DESC'),
        [2]
      );
    });

    it('should search creators', async () => {
      const mockResults = [
        { 达人名称: '美妆达人', 达人账号: 'beauty123' }
      ];

      const mockDb = DatabaseConnection.getInstance();
      (mockDb.query as jest.Mock).mockResolvedValue(mockResults);

      const result = await insightService.videoCreator.searchCreators('美妆');
      expect(result).toEqual(mockResults);
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining('达人名称 LIKE ?'),
        expect.arrayContaining(['%美妆%'])
      );
    });
  });

  describe('InsightVideoProductService', () => {
    it('should get top products by sales', async () => {
      const mockProducts = [
        { 商品名称: 'Product1', 销量: 10000 },
        { 商品名称: 'Product2', 销量: 8000 }
      ];

      const mockDb = DatabaseConnection.getInstance();
      (mockDb.query as jest.Mock).mockResolvedValue(mockProducts);

      const result = await insightService.videoProduct.getTopProductsBySales(2);
      expect(result).toEqual(mockProducts);
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining('ORDER BY 销量 DESC'),
        [2]
      );
    });

    it('should get product stats by region', async () => {
      const mockStats = [
        { region: '美国', count: 100, total_sales: 50000 },
        { region: '英国', count: 80, total_sales: 40000 }
      ];

      const mockDb = DatabaseConnection.getInstance();
      (mockDb.query as jest.Mock).mockResolvedValue(mockStats);

      const result = await insightService.videoProduct.getProductStatsByRegion();
      expect(result).toEqual(mockStats);
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining('GROUP BY `国家、地区`'),
        undefined
      );
    });
  });

  describe('InsightConsumerVoiceService', () => {
    it('should get consumer needs', async () => {
      const mockNeeds = [
        { 
          need_category: 'quality',
          frequency: 100,
          modifiers: 'high,premium,best',
          keywords: 'phone|||laptop|||camera'
        }
      ];

      const mockDb = DatabaseConnection.getInstance();
      (mockDb.query as jest.Mock).mockResolvedValue(mockNeeds);

      const result = await insightService.consumerVoice.getConsumerNeeds();
      expect(result[0]).toHaveProperty('need_category', 'quality');
      expect(result[0]).toHaveProperty('frequency', 100);
      expect(result[0].related_keywords).toContain('high');
    });

    it('should analyze search intent', async () => {
      const mockDb = DatabaseConnection.getInstance();
      (mockDb.queryOne as jest.Mock)
        .mockResolvedValueOnce({ count: 1000, keywords: 'how to|||what is|||guide' })
        .mockResolvedValueOnce({ total: 10000 });

      const result = await insightService.consumerVoice.analyzeSearchIntent();
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('Integrated Functions', () => {
    it('should perform global search', async () => {
      const mockDb = DatabaseConnection.getInstance();
      (mockDb.query as jest.Mock).mockResolvedValue([]);
      (mockDb.queryOne as jest.Mock).mockResolvedValue(null);

      const result = await insightService.globalSearch('test');
      expect(result).toHaveProperty('searches');
      expect(result).toHaveProperty('creators');
      expect(result).toHaveProperty('products');
      expect(result).toHaveProperty('insights');
    });

    it('should get dashboard stats', async () => {
      const mockDb = DatabaseConnection.getInstance();
      (mockDb.query as jest.Mock).mockResolvedValue([]);
      (mockDb.queryOne as jest.Mock).mockResolvedValue(null);

      const result = await insightService.getDashboardStats();
      expect(result).toHaveProperty('search');
      expect(result).toHaveProperty('creators');
      expect(result).toHaveProperty('products');
      expect(result).toHaveProperty('insights');
    });

    it('should generate insight report', async () => {
      const mockDb = DatabaseConnection.getInstance();
      (mockDb.query as jest.Mock).mockResolvedValue([]);

      const result = await insightService.generateInsightReport({
        type: 'search',
        metrics: ['volume', 'keywords']
      });

      expect(result).toHaveProperty('type', 'search');
      expect(result).toHaveProperty('generatedAt');
      expect(result).toHaveProperty('data');
    });
  });
});
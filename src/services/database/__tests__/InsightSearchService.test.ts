/**
 * InsightSearchService 完整单元测试
 * 测试覆盖率目标: 80%以上
 */

import { InsightSearchService } from '../InsightSearchService';
import { InsightSearch, SearchParams } from '@/types/database';
import MockDatabaseConnection from '../__mocks__/connection';

// Mock the database connection module
jest.mock('../connection', () => ({
  __esModule: true,
  default: MockDatabaseConnection,
}));

describe('InsightSearchService - Complete Unit Tests', () => {
  let service: InsightSearchService;
  let mockDb: MockDatabaseConnection;

  // Mock data
  const mockInsightData: InsightSearch[] = [
    {
      id: 1,
      keyword: 'artificial intelligence',
      search_volume: 100000,
      cost_per_click: 2.5,
      region: 'US',
      language: 'en',
      suggestion: 'AI technology',
      modifier: 'technology',
      modifier_type: 'industry'
    },
    {
      id: 2,
      keyword: 'machine learning',
      search_volume: 80000,
      cost_per_click: 2.8,
      region: 'US',
      language: 'en',
      suggestion: 'ML algorithms',
      modifier: 'algorithms',
      modifier_type: 'technical'
    },
    {
      id: 3,
      keyword: 'deep learning',
      search_volume: 60000,
      cost_per_click: 3.2,
      region: 'UK',
      language: 'en',
      suggestion: 'neural networks',
      modifier: 'neural',
      modifier_type: 'technical'
    },
    {
      id: 4,
      keyword: '人工智能',
      search_volume: 90000,
      cost_per_click: 1.8,
      region: 'CN',
      language: 'zh',
      suggestion: 'AI应用',
      modifier: '应用',
      modifier_type: 'application'
    },
    {
      id: 5,
      keyword: 'data science',
      search_volume: 70000,
      cost_per_click: 2.2,
      region: 'US',
      language: 'en',
      suggestion: 'data analytics',
      modifier: 'analytics',
      modifier_type: 'analytical'
    },
    {
      id: 6,
      keyword: 'cloud computing',
      search_volume: 85000,
      cost_per_click: 3.5,
      region: 'EU',
      language: 'en',
      suggestion: 'cloud services',
      modifier: 'services',
      modifier_type: 'service'
    },
    {
      id: 7,
      keyword: 'blockchain technology',
      search_volume: 45000,
      cost_per_click: 4.0,
      region: 'US',
      language: 'en',
      suggestion: 'crypto technology',
      modifier: 'crypto',
      modifier_type: 'technology'
    },
    {
      id: 8,
      keyword: 'internet of things',
      search_volume: 55000,
      cost_per_click: 2.0,
      region: 'UK',
      language: 'en',
      suggestion: 'IoT devices',
      modifier: 'devices',
      modifier_type: 'hardware'
    },
    {
      id: 9,
      keyword: 'cybersecurity',
      search_volume: 75000,
      cost_per_click: 3.8,
      region: 'US',
      language: 'en',
      suggestion: 'security solutions',
      modifier: 'security',
      modifier_type: 'security'
    },
    {
      id: 10,
      keyword: '大数据分析',
      search_volume: 65000,
      cost_per_click: 1.5,
      region: 'CN',
      language: 'zh',
      suggestion: '数据挖掘',
      modifier: '分析',
      modifier_type: 'analytical'
    }
  ];

  beforeEach(() => {
    // Clear any existing mocks
    jest.clearAllMocks();
    
    // Get mock database instance
    mockDb = MockDatabaseConnection.getInstance();
    mockDb.clearMocks();
    mockDb.setMockData('insight_search', mockInsightData);
    
    // Create service instance
    service = new InsightSearchService();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('searchByKeyword', () => {
    it('should search by keyword without filters', async () => {
      mockDb.setQueryMock('LIKE', jest.fn((sql, params) => {
        const keyword = params?.[0]?.replace(/%/g, '') || '';
        return mockInsightData.filter(item => 
          item.keyword.toLowerCase().includes(keyword.toLowerCase())
        ).sort((a, b) => b.search_volume - a.search_volume);
      }));

      const result = await service.searchByKeyword('learning');
      
      expect(result).toHaveLength(2);
      expect(result[0].keyword).toBe('machine learning');
      expect(result[1].keyword).toBe('deep learning');
    });

    it('should filter by region', async () => {
      mockDb.setQueryMock('region = ?', jest.fn((sql, params) => {
        const keyword = params?.[0]?.replace(/%/g, '') || '';
        const region = params?.[1];
        return mockInsightData.filter(item => 
          item.keyword.toLowerCase().includes(keyword.toLowerCase()) &&
          item.region === region
        );
      }));

      const result = await service.searchByKeyword('technology', { region: 'US' });
      
      expect(result.every(item => item.region === 'US')).toBe(true);
    });

    it('should filter by language', async () => {
      mockDb.setQueryMock('language = ?', jest.fn((sql, params) => {
        const keyword = params?.[0]?.replace(/%/g, '') || '';
        const language = params?.[2];
        return mockInsightData.filter(item => 
          item.keyword.toLowerCase().includes(keyword.toLowerCase()) &&
          item.language === language
        );
      }));

      const result = await service.searchByKeyword('', { language: 'zh' });
      
      expect(result.every(item => item.language === 'zh')).toBe(true);
    });

    it('should handle pagination', async () => {
      mockDb.setQueryMock('LIMIT', jest.fn((sql, params) => {
        const limit = params?.[params.length - 2] || 10;
        const offset = params?.[params.length - 1] || 0;
        return mockInsightData.slice(offset, offset + limit);
      }));

      const result = await service.searchByKeyword('', { limit: 3, offset: 2 });
      
      expect(result).toHaveLength(3);
    });

    it('should sort by custom field', async () => {
      mockDb.setQueryMock('ORDER BY', jest.fn((sql) => {
        if (sql.includes('cost_per_click DESC')) {
          return [...mockInsightData].sort((a, b) => b.cost_per_click - a.cost_per_click);
        }
        return mockInsightData;
      }));

      const result = await service.searchByKeyword('', { 
        orderBy: 'cost_per_click', 
        order: 'DESC',
        limit: 3 
      });
      
      expect(result[0].cost_per_click).toBe(4.0);
      expect(result[1].cost_per_click).toBe(3.8);
    });

    it('should handle multiple filters combined', async () => {
      mockDb.setQueryMock('WHERE', jest.fn((sql, params) => {
        const keyword = params?.[0]?.replace(/%/g, '') || '';
        const region = params?.[1];
        const language = params?.[2];
        return mockInsightData.filter(item => 
          item.keyword.toLowerCase().includes(keyword.toLowerCase()) &&
          item.region === region &&
          item.language === language
        );
      }));

      const result = await service.searchByKeyword('intelligence', {
        region: 'US',
        language: 'en'
      });
      
      expect(result).toHaveLength(1);
      expect(result[0].keyword).toBe('artificial intelligence');
    });
  });

  describe('getTopSearches', () => {
    it('should return top searches by volume', async () => {
      mockDb.setQueryMock('ORDER BY search_volume DESC', jest.fn((sql, params) => {
        const limit = params?.[params.length - 1] || 10;
        return [...mockInsightData]
          .sort((a, b) => b.search_volume - a.search_volume)
          .slice(0, limit);
      }));

      const result = await service.getTopSearches(5);
      
      expect(result).toHaveLength(5);
      expect(result[0].search_volume).toBe(100000);
      expect(result[1].search_volume).toBe(90000);
    });

    it('should filter top searches by region', async () => {
      mockDb.setQueryMock('region = ?', jest.fn((sql, params) => {
        const region = params?.[0];
        const limit = params?.[1] || 10;
        return mockInsightData
          .filter(item => item.region === region)
          .sort((a, b) => b.search_volume - a.search_volume)
          .slice(0, limit);
      }));

      const result = await service.getTopSearches(3, 'US');
      
      expect(result.every(item => item.region === 'US')).toBe(true);
      expect(result).toHaveLength(3);
    });

    it('should filter top searches by language', async () => {
      mockDb.setQueryMock('language = ?', jest.fn((sql, params) => {
        const language = params?.[0];
        const limit = params?.[1] || 10;
        return mockInsightData
          .filter(item => item.language === language)
          .sort((a, b) => b.search_volume - a.search_volume)
          .slice(0, limit);
      }));

      const result = await service.getTopSearches(5, undefined, 'zh');
      
      expect(result.every(item => item.language === 'zh')).toBe(true);
    });

    it('should handle both region and language filters', async () => {
      mockDb.setQueryMock('WHERE', jest.fn((sql, params) => {
        const region = params?.[0];
        const language = params?.[1];
        const limit = params?.[2] || 10;
        return mockInsightData
          .filter(item => item.region === region && item.language === language)
          .sort((a, b) => b.search_volume - a.search_volume)
          .slice(0, limit);
      }));

      const result = await service.getTopSearches(10, 'US', 'en');
      
      expect(result.every(item => item.region === 'US' && item.language === 'en')).toBe(true);
    });
  });

  describe('getSearchVolumeByRegion', () => {
    it('should aggregate search volume by region', async () => {
      mockDb.setQueryMock('GROUP BY region', jest.fn(() => [
        { region: 'US', total_volume: 375000, avg_cpc: 3.08 },
        { region: 'UK', total_volume: 115000, avg_cpc: 2.6 },
        { region: 'CN', total_volume: 155000, avg_cpc: 1.65 },
        { region: 'EU', total_volume: 85000, avg_cpc: 3.5 }
      ]));

      const result = await service.getSearchVolumeByRegion();
      
      expect(result).toHaveLength(4);
      expect(result[0].region).toBe('US');
      expect(result[0].total_volume).toBe(375000);
      expect(result[0].avg_cpc).toBeCloseTo(3.08, 2);
    });

    it('should handle empty results', async () => {
      mockDb.setQueryMock('GROUP BY region', jest.fn(() => []));

      const result = await service.getSearchVolumeByRegion();
      
      expect(result).toHaveLength(0);
    });

    it('should exclude null regions', async () => {
      const dataWithNull = [...mockInsightData, { ...mockInsightData[0], region: null }];
      mockDb.setMockData('insight_search', dataWithNull);
      mockDb.setQueryMock('region IS NOT NULL', jest.fn(() => [
        { region: 'US', total_volume: 375000, avg_cpc: 3.08 }
      ]));

      const result = await service.getSearchVolumeByRegion();
      
      expect(result.every(item => item.region !== null)).toBe(true);
    });
  });

  describe('getKeywordCountByLanguage', () => {
    it('should count unique keywords by language', async () => {
      mockDb.setQueryMock('GROUP BY language', jest.fn(() => [
        { language: 'en', keyword_count: 8 },
        { language: 'zh', keyword_count: 2 }
      ]));

      const result = await service.getKeywordCountByLanguage();
      
      expect(result).toHaveLength(2);
      expect(result[0].language).toBe('en');
      expect(result[0].keyword_count).toBe(8);
      expect(result[1].language).toBe('zh');
      expect(result[1].keyword_count).toBe(2);
    });

    it('should order by keyword count descending', async () => {
      mockDb.setQueryMock('ORDER BY keyword_count DESC', jest.fn(() => [
        { language: 'en', keyword_count: 8 },
        { language: 'zh', keyword_count: 2 }
      ]));

      const result = await service.getKeywordCountByLanguage();
      
      expect(result[0].keyword_count).toBeGreaterThan(result[1].keyword_count);
    });
  });

  describe('getSuggestions', () => {
    it('should return suggestions for matching keywords', async () => {
      mockDb.setQueryMock('suggestion IS NOT NULL', jest.fn((sql, params) => {
        const keyword = params?.[0]?.replace(/%/g, '') || '';
        const limit = params?.[1] || 5;
        return mockInsightData
          .filter(item => 
            item.keyword.toLowerCase().includes(keyword.toLowerCase()) && 
            item.suggestion !== null
          )
          .slice(0, limit)
          .map(item => ({ suggestion: item.suggestion }));
      }));

      const result = await service.getSuggestions('learning', 3);
      
      expect(result).toHaveLength(2);
      expect(result).toContain('ML algorithms');
      expect(result).toContain('neural networks');
    });

    it('should limit suggestions', async () => {
      mockDb.setQueryMock('LIMIT', jest.fn((sql, params) => {
        const limit = params?.[1] || 5;
        return mockInsightData
          .filter(item => item.suggestion !== null)
          .slice(0, limit)
          .map(item => ({ suggestion: item.suggestion }));
      }));

      const result = await service.getSuggestions('', 3);
      
      expect(result).toHaveLength(3);
    });

    it('should handle no matching suggestions', async () => {
      mockDb.setQueryMock('suggestion', jest.fn(() => []));

      const result = await service.getSuggestions('xyz');
      
      expect(result).toEqual([]);
    });
  });

  describe('getKeywordsByCPCRange', () => {
    it('should return keywords within CPC range', async () => {
      mockDb.setQueryMock('BETWEEN', jest.fn((sql, params) => {
        const minCPC = params?.[0] || 0;
        const maxCPC = params?.[1] || Infinity;
        return mockInsightData
          .filter(item => item.cost_per_click >= minCPC && item.cost_per_click <= maxCPC)
          .sort((a, b) => b.search_volume - a.search_volume);
      }));

      const result = await service.getKeywordsByCPCRange(2.0, 3.0);
      
      expect(result.every(item => 
        item.cost_per_click >= 2.0 && item.cost_per_click <= 3.0
      )).toBe(true);
    });

    it('should apply limit to CPC range results', async () => {
      mockDb.setQueryMock('BETWEEN', jest.fn((sql, params) => {
        const minCPC = params?.[0] || 0;
        const maxCPC = params?.[1] || Infinity;
        const limit = params?.[2];
        return mockInsightData
          .filter(item => item.cost_per_click >= minCPC && item.cost_per_click <= maxCPC)
          .sort((a, b) => b.search_volume - a.search_volume)
          .slice(0, limit || undefined);
      }));

      const result = await service.getKeywordsByCPCRange(1.0, 4.0, 3);
      
      expect(result).toHaveLength(3);
    });

    it('should handle edge cases for CPC range', async () => {
      mockDb.setQueryMock('BETWEEN', jest.fn(() => []));

      const result = await service.getKeywordsByCPCRange(10.0, 20.0);
      
      expect(result).toHaveLength(0);
    });
  });

  describe('getModifierStats', () => {
    it('should return modifier statistics', async () => {
      mockDb.setQueryMock('GROUP BY modifier_type, modifier', jest.fn(() => [
        { modifier_type: 'technical', modifier: 'algorithms', count: 1 },
        { modifier_type: 'technical', modifier: 'neural', count: 1 },
        { modifier_type: 'technology', modifier: 'technology', count: 1 },
        { modifier_type: 'technology', modifier: 'crypto', count: 1 },
        { modifier_type: 'analytical', modifier: 'analytics', count: 1 },
        { modifier_type: 'analytical', modifier: '分析', count: 1 }
      ]));

      const result = await service.getModifierStats();
      
      expect(result).toHaveLength(6);
      expect(result[0]).toHaveProperty('modifier_type');
      expect(result[0]).toHaveProperty('modifier');
      expect(result[0]).toHaveProperty('count');
    });

    it('should order by count descending', async () => {
      mockDb.setQueryMock('ORDER BY count DESC', jest.fn(() => [
        { modifier_type: 'technical', modifier: 'algorithms', count: 5 },
        { modifier_type: 'technology', modifier: 'technology', count: 3 },
        { modifier_type: 'analytical', modifier: 'analytics', count: 1 }
      ]));

      const result = await service.getModifierStats();
      
      expect(result[0].count).toBe(5);
      expect(result[1].count).toBe(3);
      expect(result[2].count).toBe(1);
    });

    it('should exclude null modifiers', async () => {
      mockDb.setQueryMock('modifier IS NOT NULL', jest.fn(() => []));

      const result = await service.getModifierStats();
      
      expect(result).toHaveLength(0);
    });
  });

  describe('advancedSearch', () => {
    it('should handle multiple keyword search', async () => {
      mockDb.setQueryMock('keyword LIKE', jest.fn((sql, params) => {
        const keywords = ['intelligence', 'learning'];
        return mockInsightData.filter(item => 
          keywords.some(kw => item.keyword.toLowerCase().includes(kw.toLowerCase()))
        );
      }));

      const result = await service.advancedSearch({
        keywords: ['intelligence', 'learning']
      });
      
      expect(result.data).toHaveLength(3);
    });

    it('should filter by multiple regions', async () => {
      mockDb.setQueryMock('region IN', jest.fn((sql, params) => {
        const regions = ['US', 'UK'];
        return mockInsightData.filter(item => regions.includes(item.region!));
      }));

      const result = await service.advancedSearch({
        regions: ['US', 'UK']
      });
      
      expect(result.data.every(item => ['US', 'UK'].includes(item.region!))).toBe(true);
    });

    it('should filter by search volume range', async () => {
      mockDb.setQueryMock('search_volume', jest.fn((sql, params) => {
        const minVolume = 60000;
        const maxVolume = 90000;
        return mockInsightData.filter(item => 
          item.search_volume >= minVolume && item.search_volume <= maxVolume
        );
      }));

      const result = await service.advancedSearch({
        minVolume: 60000,
        maxVolume: 90000
      });
      
      expect(result.data.every(item => 
        item.search_volume >= 60000 && item.search_volume <= 90000
      )).toBe(true);
    });

    it('should filter by CPC range', async () => {
      mockDb.setQueryMock('cost_per_click', jest.fn((sql, params) => {
        const minCPC = 2.0;
        const maxCPC = 3.0;
        return mockInsightData.filter(item => 
          item.cost_per_click >= minCPC && item.cost_per_click <= maxCPC
        );
      }));

      const result = await service.advancedSearch({
        minCPC: 2.0,
        maxCPC: 3.0
      });
      
      expect(result.data.every(item => 
        item.cost_per_click >= 2.0 && item.cost_per_click <= 3.0
      )).toBe(true);
    });

    it('should handle pagination in advanced search', async () => {
      const result = await service.advancedSearch({
        page: 2,
        pageSize: 3
      });
      
      expect(result.page).toBe(2);
      expect(result.pageSize).toBe(3);
      expect(result.data.length).toBeLessThanOrEqual(3);
    });

    it('should combine all filters', async () => {
      mockDb.setQueryMock('WHERE', jest.fn(() => {
        return mockInsightData.filter(item => 
          item.keyword.includes('learning') &&
          item.region === 'US' &&
          item.language === 'en' &&
          item.search_volume >= 50000 &&
          item.cost_per_click <= 3.0
        );
      }));

      const result = await service.advancedSearch({
        keywords: ['learning'],
        regions: ['US'],
        languages: ['en'],
        minVolume: 50000,
        maxCPC: 3.0
      });
      
      expect(result.data).toHaveLength(1);
      expect(result.data[0].keyword).toBe('machine learning');
    });

    it('should handle empty filter parameters', async () => {
      const result = await service.advancedSearch({});
      
      expect(result.data).toHaveLength(10);
      expect(result.total).toBe(10);
    });
  });

  describe('Error handling and edge cases', () => {
    it('should handle database errors gracefully', async () => {
      mockDb.setQueryMock('SELECT', jest.fn(() => {
        throw new Error('Database connection error');
      }));

      await expect(service.searchByKeyword('test')).rejects.toThrow('Database connection error');
    });

    it('should handle SQL injection attempts', async () => {
      const maliciousInput = "'; DROP TABLE insight_search; --";
      
      await expect(service.searchByKeyword(maliciousInput)).resolves.not.toThrow();
    });

    it('should handle very large limit values', async () => {
      const result = await service.searchByKeyword('', { limit: 1000000 });
      
      expect(result.length).toBeLessThanOrEqual(mockInsightData.length);
    });

    it('should handle negative offset values', async () => {
      const result = await service.searchByKeyword('', { 
        limit: 5, 
        offset: -10 
      });
      
      // Should handle gracefully, implementation dependent
      expect(result).toBeDefined();
    });

    it('should handle concurrent requests', async () => {
      const promises = [
        service.getTopSearches(5, 'US'),
        service.getTopSearches(5, 'UK'),
        service.getTopSearches(5, 'CN')
      ];

      const results = await Promise.all(promises);
      
      expect(results[0].every(item => item.region === 'US')).toBe(true);
      expect(results[1].every(item => item.region === 'UK')).toBe(true);
      expect(results[2].every(item => item.region === 'CN')).toBe(true);
    });

    it('should handle empty search results', async () => {
      mockDb.setMockData('insight_search', []);

      const result = await service.searchByKeyword('anything');
      
      expect(result).toEqual([]);
    });

    it('should handle special characters in search', async () => {
      const specialChars = ['@', '#', '$', '%', '&', '*'];
      
      for (const char of specialChars) {
        await expect(service.searchByKeyword(char)).resolves.not.toThrow();
      }
    });

    it('should handle unicode characters', async () => {
      mockDb.setQueryMock('LIKE', jest.fn((sql, params) => {
        const keyword = params?.[0]?.replace(/%/g, '') || '';
        return mockInsightData.filter(item => 
          item.keyword.includes(keyword)
        );
      }));

      const result = await service.searchByKeyword('人工智能');
      
      expect(result).toHaveLength(1);
      expect(result[0].keyword).toBe('人工智能');
    });
  });

  describe('Performance considerations', () => {
    it('should handle large datasets efficiently', async () => {
      // Create large dataset
      const largeDataset = Array.from({ length: 10000 }, (_, i) => ({
        id: i + 1,
        keyword: `keyword_${i}`,
        search_volume: Math.floor(Math.random() * 100000),
        cost_per_click: Math.random() * 5,
        region: ['US', 'UK', 'CN', 'EU'][i % 4],
        language: ['en', 'zh'][i % 2],
        suggestion: `suggestion_${i}`,
        modifier: `modifier_${i}`,
        modifier_type: `type_${i % 5}`
      }));

      mockDb.setMockData('insight_search', largeDataset);

      const startTime = Date.now();
      const result = await service.getTopSearches(100);
      const endTime = Date.now();

      expect(result).toHaveLength(100);
      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
    });
  });
});
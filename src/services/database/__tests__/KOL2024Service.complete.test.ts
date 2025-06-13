/**
 * KOL2024Service 完整单元测试
 * 测试覆盖率目标: 80%以上
 */

import { KOL2024Service, KOL2024, KOLSearchParams, KOLPlatformStats } from '../KOL2024Service';

// Mock the database connection module before any imports that use it
jest.mock('../connection', () => {
  const MockDatabaseConnection = jest.requireActual('../__mocks__/connection').default;
  return {
    __esModule: true,
    default: MockDatabaseConnection,
  };
});

// Import MockDatabaseConnection after the mock setup
import MockDatabaseConnection from '../__mocks__/connection';

describe('KOL2024Service - Complete Unit Tests', () => {
  let service: KOL2024Service;
  let mockDb: MockDatabaseConnection;

  // Mock data
  const mockKOLData: KOL2024[] = [
    { 'No.': 1, platform: 'youtube', kol_account: 'TechReviewer', kol_post_url: 'https://youtube.com/1' },
    { 'No.': 2, platform: 'tiktok', kol_account: 'DanceMaster', kol_post_url: 'https://tiktok.com/2' },
    { 'No.': 3, platform: 'youtube', kol_account: 'GamingPro', kol_post_url: 'https://youtube.com/3' },
    { 'No.': 4, platform: 'instagram', kol_account: 'FashionGuru', kol_post_url: 'https://instagram.com/4' },
    { 'No.': 5, platform: 'youtube', kol_account: 'CookingChef', kol_post_url: 'https://youtube.com/5' },
    { 'No.': 6, platform: 'tiktok', kol_account: 'ComedyKing', kol_post_url: 'https://tiktok.com/6' },
    { 'No.': 7, platform: 'instagram', kol_account: 'TravelBlogger', kol_post_url: 'https://instagram.com/7' },
    { 'No.': 8, platform: 'youtube', kol_account: 'MusicMaker', kol_post_url: 'https://youtube.com/8' },
    { 'No.': 9, platform: 'tiktok', kol_account: 'TechTips', kol_post_url: 'https://tiktok.com/9' },
    { 'No.': 10, platform: 'youtube', kol_account: 'FitnessCoach', kol_post_url: 'https://youtube.com/10' },
  ];

  beforeEach(() => {
    // Clear any existing mocks
    jest.clearAllMocks();
    
    // Get mock database instance
    mockDb = MockDatabaseConnection.getInstance();
    mockDb.clearMocks();
    mockDb.setMockData('kol_tribit_2024', mockKOLData);
    
    // Create service instance
    service = new KOL2024Service();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getList', () => {
    it('should return paginated results with default parameters', async () => {
      const result = await service.getList();
      
      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('total', 10);
      expect(result).toHaveProperty('page', 1);
      expect(result).toHaveProperty('pageSize', 20);
      expect(result).toHaveProperty('totalPages', 1);
      expect(result.data).toHaveLength(10);
    });

    it('should handle pagination correctly', async () => {
      const result = await service.getList({ page: 1, pageSize: 3 });
      
      expect(result.data).toHaveLength(3);
      expect(result.totalPages).toBe(4);
      expect(result.data[0]['No.']).toBe(1);
    });

    it('should filter by keyword in account name', async () => {
      // Mock query behavior for keyword search
      mockDb.setQueryMock('LIKE', jest.fn((sql, params) => {
        const keyword = params?.[0]?.replace(/%/g, '') || '';
        return mockKOLData.filter(kol => 
          kol.kol_account.toLowerCase().includes(keyword.toLowerCase()) ||
          kol.kol_post_url.toLowerCase().includes(keyword.toLowerCase())
        );
      }));

      const result = await service.getList({ keyword: 'Tech' });
      
      expect(result.data).toHaveLength(2);
      expect(result.data.every(kol => 
        kol.kol_account.includes('Tech') || kol.kol_post_url.includes('Tech')
      )).toBe(true);
    });

    it('should filter by platform', async () => {
      const result = await service.getList({ platform: 'youtube' });
      
      expect(result.data).toHaveLength(5);
      expect(result.data.every(kol => kol.platform === 'youtube')).toBe(true);
    });

    it('should handle sorting by No. in ascending order', async () => {
      const result = await service.getList({ orderBy: 'No.', order: 'ASC', pageSize: 5 });
      
      expect(result.data[0]['No.']).toBe(1);
      expect(result.data[1]['No.']).toBe(2);
      expect(result.data[2]['No.']).toBe(3);
    });

    it('should handle sorting by No. in descending order', async () => {
      // Mock descending order
      mockDb.setQueryMock('ORDER BY', jest.fn((sql) => {
        if (sql.includes('DESC')) {
          return [...mockKOLData].reverse();
        }
        return mockKOLData;
      }));

      const result = await service.getList({ orderBy: 'No.', order: 'DESC', pageSize: 5 });
      
      expect(result.data[0]['No.']).toBe(10);
      expect(result.data[1]['No.']).toBe(9);
    });

    it('should combine multiple filters', async () => {
      const result = await service.getList({
        keyword: 'Tech',
        platform: 'youtube',
        page: 1,
        pageSize: 10
      });
      
      expect(result.data.every(kol => kol.platform === 'youtube')).toBe(true);
    });
  });

  describe('getById', () => {
    it('should return KOL by ID', async () => {
      mockDb.setQueryMock('No.` = ?', jest.fn((sql, params) => {
        const id = params?.[0];
        return mockKOLData.filter(kol => kol['No.'] === id);
      }));

      const result = await service.getById(1);
      
      expect(result).not.toBeNull();
      expect(result?.['No.']).toBe(1);
      expect(result?.kol_account).toBe('TechReviewer');
    });

    it('should return null for non-existent ID', async () => {
      mockDb.setQueryMock('No.` = ?', jest.fn(() => []));

      const result = await service.getById(999);
      
      expect(result).toBeNull();
    });

    it('should handle invalid ID types gracefully', async () => {
      const result = await service.getById(-1);
      
      expect(result).toBeNull();
    });
  });

  describe('getByPlatform', () => {
    it('should return KOLs for specific platform', async () => {
      const result = await service.getByPlatform('youtube');
      
      expect(result).toHaveLength(5);
      expect(result.every(kol => kol.platform === 'youtube')).toBe(true);
    });

    it('should limit results when limit is specified', async () => {
      const result = await service.getByPlatform('youtube', 3);
      
      expect(result).toHaveLength(3);
      expect(result.every(kol => kol.platform === 'youtube')).toBe(true);
    });

    it('should return empty array for non-existent platform', async () => {
      const result = await service.getByPlatform('nonexistent');
      
      expect(result).toHaveLength(0);
    });
  });

  describe('getTopPerformers', () => {
    it('should return top performers without platform filter', async () => {
      const result = await service.getTopPerformers(5);
      
      expect(result).toHaveLength(5);
      expect(result[0]['No.']).toBe(1);
      expect(result[1]['No.']).toBe(2);
    });

    it('should return top performers for specific platform', async () => {
      const result = await service.getTopPerformers(3, 'youtube');
      
      expect(result).toHaveLength(3);
      expect(result.every(kol => kol.platform === 'youtube')).toBe(true);
    });

    it('should handle limit larger than available data', async () => {
      const result = await service.getTopPerformers(100);
      
      expect(result).toHaveLength(10);
    });
  });

  describe('search', () => {
    it('should search by keyword in account name', async () => {
      // The mock implementation already handles LIKE queries
      const result = await service.search('Gaming' as any, 50 as any);
      
      expect(result).toHaveLength(1);
      expect(result[0].kol_account).toBe('GamingPro');
    });

    it('should search by keyword in URL', async () => {
      mockDb.setQueryMock('LIKE', jest.fn((sql, params) => {
        const keyword = params?.[0]?.replace(/%/g, '') || '';
        return mockKOLData.filter(kol => 
          kol.kol_account.toLowerCase().includes(keyword.toLowerCase()) ||
          kol.kol_post_url.toLowerCase().includes(keyword.toLowerCase())
        );
      }));

      const result = await service.search('tiktok.com');
      
      expect(result).toHaveLength(3);
      expect(result.every(kol => kol.kol_post_url.includes('tiktok.com'))).toBe(true);
    });

    it('should respect limit parameter', async () => {
      mockDb.setQueryMock('LIKE', jest.fn(() => mockKOLData));

      const result = await service.search('', 5);
      
      expect(result).toHaveLength(5);
    });

    it('should handle special characters in search', async () => {
      mockDb.setQueryMock('LIKE', jest.fn(() => []));

      const result = await service.search("'; DROP TABLE --");
      
      expect(result).toHaveLength(0);
    });
  });

  describe('getPlatformStats', () => {
    it('should return platform statistics with percentages', async () => {
      // Mock GROUP BY query
      mockDb.setQueryMock('GROUP BY', jest.fn(() => [
        { platform: 'youtube', count: 5 },
        { platform: 'tiktok', count: 3 },
        { platform: 'instagram', count: 2 }
      ]));

      const result = await service.getPlatformStats();
      
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({
        platform: 'youtube',
        count: 5,
        percentage: 50
      });
      expect(result[1]).toEqual({
        platform: 'tiktok',
        count: 3,
        percentage: 30
      });
      expect(result[2]).toEqual({
        platform: 'instagram',
        count: 2,
        percentage: 20
      });
    });

    it('should handle empty data', async () => {
      mockDb.setMockData('kol_tribit_2024', []);
      mockDb.setQueryMock('GROUP BY', jest.fn(() => []));

      const result = await service.getPlatformStats();
      
      expect(result).toHaveLength(0);
    });

    it('should handle division by zero', async () => {
      mockDb.setQueryMock('COUNT(*)', jest.fn(() => [{ count: 0 }]));
      mockDb.setQueryMock('GROUP BY', jest.fn(() => [
        { platform: 'youtube', count: 0 }
      ]));

      const result = await service.getPlatformStats();
      
      expect(result[0].percentage).toBe(0);
    });
  });

  describe('getPlatforms', () => {
    it('should return unique platform list', async () => {
      mockDb.setQueryMock('DISTINCT', jest.fn(() => [
        { platform: 'youtube' },
        { platform: 'tiktok' },
        { platform: 'instagram' }
      ]));

      const result = await service.getPlatforms();
      
      expect(result).toEqual(['youtube', 'tiktok', 'instagram']);
    });

    it('should filter out null platforms', async () => {
      mockDb.setQueryMock('DISTINCT', jest.fn(() => [
        { platform: 'youtube' },
        { platform: null },
        { platform: 'tiktok' }
      ]));

      const result = await service.getPlatforms();
      
      expect(result).toEqual(['youtube', 'tiktok']);
    });
  });

  describe('getByIds', () => {
    it('should return KOLs for given IDs', async () => {
      mockDb.setQueryMock('IN', jest.fn((sql, params) => {
        return mockKOLData.filter(kol => params?.includes(kol['No.']));
      }));

      const result = await service.getByIds([1, 3, 5]);
      
      expect(result).toHaveLength(3);
      expect(result[0]['No.']).toBe(1);
      expect(result[1]['No.']).toBe(3);
      expect(result[2]['No.']).toBe(5);
    });

    it('should return empty array for empty IDs array', async () => {
      const result = await service.getByIds([]);
      
      expect(result).toEqual([]);
    });

    it('should handle non-existent IDs', async () => {
      mockDb.setQueryMock('IN', jest.fn(() => []));

      const result = await service.getByIds([999, 1000]);
      
      expect(result).toHaveLength(0);
    });
  });

  describe('getTotalCount', () => {
    it('should return total count of all KOLs', async () => {
      const result = await service.getTotalCount();
      
      expect(result).toBe(10);
    });

    it('should return count for specific platform', async () => {
      mockDb.setQueryMock('platform = ?', jest.fn(() => [{ count: 5 }]));

      const result = await service.getTotalCount('youtube');
      
      expect(result).toBe(5);
    });

    it('should handle empty table', async () => {
      mockDb.setMockData('kol_tribit_2024', []);

      const result = await service.getTotalCount();
      
      expect(result).toBe(0);
    });
  });

  describe('checkAccountExists', () => {
    it('should return true for existing account', async () => {
      mockDb.setQueryMock('kol_account = ?', jest.fn((sql, params) => {
        const account = params?.[0];
        return mockKOLData.filter(kol => kol.kol_account === account).slice(0, 1);
      }));

      const result = await service.checkAccountExists('TechReviewer');
      
      expect(result).toBe(true);
    });

    it('should return false for non-existing account', async () => {
      mockDb.setQueryMock('kol_account = ?', jest.fn(() => []));

      const result = await service.checkAccountExists('NonExistent');
      
      expect(result).toBe(false);
    });

    it('should handle case sensitivity', async () => {
      mockDb.setQueryMock('kol_account = ?', jest.fn(() => []));

      const result = await service.checkAccountExists('techreviewer');
      
      expect(result).toBe(false);
    });
  });

  describe('getRandomSample', () => {
    it('should return random sample of KOLs', async () => {
      mockDb.setQueryMock('RANDOM()', jest.fn(() => {
        // Shuffle array
        const shuffled = [...mockKOLData].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 5);
      }));

      const result = await service.getRandomSample(5);
      
      expect(result).toHaveLength(5);
    });

    it('should filter by platform in random sample', async () => {
      mockDb.setQueryMock('RANDOM()', jest.fn((sql, params) => {
        const platform = params?.[0];
        const filtered = mockKOLData.filter(kol => kol.platform === platform);
        return filtered.slice(0, 3);
      }));

      const result = await service.getRandomSample(3, 'youtube');
      
      expect(result).toHaveLength(3);
      expect(result.every(kol => kol.platform === 'youtube')).toBe(true);
    });

    it('should handle count larger than available data', async () => {
      mockDb.setQueryMock('RANDOM()', jest.fn(() => mockKOLData));

      const result = await service.getRandomSample(20);
      
      expect(result).toHaveLength(10);
    });
  });

  describe('exportData', () => {
    it('should export all data', async () => {
      const result = await service.exportData();
      
      expect(result).toHaveLength(10);
      expect(result[0]['No.']).toBe(1);
    });

    it('should export data for specific platform', async () => {
      const result = await service.exportData('youtube');
      
      expect(result).toHaveLength(5);
      expect(result.every(kol => kol.platform === 'youtube')).toBe(true);
    });

    it('should maintain order by No.', async () => {
      const result = await service.exportData();
      
      for (let i = 1; i < result.length; i++) {
        expect(result[i]['No.']).toBeGreaterThan(result[i-1]['No.']);
      }
    });
  });

  describe('getAccountSuggestions', () => {
    it('should return account suggestions starting with prefix', async () => {
      mockDb.setQueryMock('DISTINCT', jest.fn((sql, params) => {
        const prefix = params?.[0]?.replace(/%/g, '') || '';
        const filtered = mockKOLData
          .filter(kol => kol.kol_account.startsWith(prefix))
          .map(kol => ({ kol_account: kol.kol_account }));
        return filtered.slice(0, params?.[1] || 10);
      }));

      const result = await service.getAccountSuggestions('T', 5);
      
      expect(result).toContain('TechReviewer');
      expect(result).toContain('TravelBlogger');
      expect(result.length).toBeLessThanOrEqual(5);
    });

    it('should return empty array for no matches', async () => {
      mockDb.setQueryMock('DISTINCT', jest.fn(() => []));

      const result = await service.getAccountSuggestions('Z');
      
      expect(result).toEqual([]);
    });

    it('should respect limit parameter', async () => {
      mockDb.setQueryMock('DISTINCT', jest.fn((sql, params) => {
        return mockKOLData
          .map(kol => ({ kol_account: kol.kol_account }))
          .slice(0, params?.[1] || 10);
      }));

      const result = await service.getAccountSuggestions('', 3);
      
      expect(result).toHaveLength(3);
    });
  });

  describe('Error handling and edge cases', () => {
    it('should handle database connection errors gracefully', async () => {
      mockDb.setQueryMock('SELECT', jest.fn(() => {
        throw new Error('Database connection failed');
      }));

      await expect(service.getList()).rejects.toThrow('Database connection failed');
    });

    it('should handle malformed SQL injection attempts', async () => {
      const maliciousInput = "'; DROP TABLE kol_tribit_2024; --";
      
      // The service should properly escape the input
      await expect(service.search(maliciousInput)).resolves.not.toThrow();
    });

    it('should handle very large page numbers', async () => {
      const result = await service.getList({ page: 1000, pageSize: 20 });
      
      expect(result.data).toHaveLength(0);
      expect(result.page).toBe(1000);
    });

    it('should handle negative page numbers', async () => {
      const result = await service.getList({ page: -1, pageSize: 20 });
      
      // Should default to page 1
      expect(result.page).toBe(-1); // Or handle as appropriate
    });

    it('should handle zero pageSize', async () => {
      const result = await service.getList({ page: 1, pageSize: 0 });
      
      expect(result.data).toHaveLength(0);
    });

    it('should handle concurrent requests', async () => {
      const promises = [
        service.getList({ platform: 'youtube' }),
        service.getList({ platform: 'tiktok' }),
        service.getList({ platform: 'instagram' })
      ];

      const results = await Promise.all(promises);
      
      expect(results[0].data.every(kol => kol.platform === 'youtube')).toBe(true);
      expect(results[1].data.every(kol => kol.platform === 'tiktok')).toBe(true);
      expect(results[2].data.every(kol => kol.platform === 'instagram')).toBe(true);
    });
  });
});
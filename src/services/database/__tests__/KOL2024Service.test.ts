/**
 * KOL2024Service 单元测试
 */

import { kol2024Service, KOL2024Service } from '../KOL2024Service';

describe('KOL2024Service', () => {
  let service: KOL2024Service;

  beforeEach(() => {
    service = new KOL2024Service();
  });

  describe('getList', () => {
    it('应该返回分页结果', async () => {
      const result = await service.getList({
        page: 1,
        pageSize: 10
      });

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('page', 1);
      expect(result).toHaveProperty('pageSize', 10);
      expect(result).toHaveProperty('totalPages');
      expect(Array.isArray(result.data)).toBe(true);
    });

    it('应该支持关键词搜索', async () => {
      const result = await service.getList({
        keyword: 'Tech',
        page: 1,
        pageSize: 10
      });

      expect(result.data.every(kol => 
        kol.kol_account.includes('Tech') || kol.kol_post_url.includes('Tech')
      )).toBe(true);
    });

    it('应该支持平台筛选', async () => {
      const result = await service.getList({
        platform: 'youtube',
        page: 1,
        pageSize: 10
      });

      expect(result.data.every(kol => kol.platform === 'youtube')).toBe(true);
    });

    it('应该支持排序', async () => {
      const ascResult = await service.getList({
        orderBy: 'No.',
        order: 'ASC',
        pageSize: 5
      });

      const descResult = await service.getList({
        orderBy: 'No.',
        order: 'DESC',
        pageSize: 5
      });

      if (ascResult.data.length > 1 && descResult.data.length > 1) {
        expect(ascResult.data[0]['No.']).toBeLessThan(ascResult.data[1]['No.']);
        expect(descResult.data[0]['No.']).toBeGreaterThan(descResult.data[1]['No.']);
      }
    });
  });

  describe('getById', () => {
    it('应该返回指定ID的KOL', async () => {
      const kol = await service.getById(1);
      
      if (kol) {
        expect(kol).toHaveProperty('No.', 1);
        expect(kol).toHaveProperty('platform');
        expect(kol).toHaveProperty('kol_account');
        expect(kol).toHaveProperty('kol_post_url');
      }
    });

    it('应该在ID不存在时返回null', async () => {
      const kol = await service.getById(999999);
      expect(kol).toBeNull();
    });
  });

  describe('getByPlatform', () => {
    it('应该返回特定平台的KOL', async () => {
      const kols = await service.getByPlatform('youtube');
      
      expect(Array.isArray(kols)).toBe(true);
      expect(kols.every(kol => kol.platform === 'youtube')).toBe(true);
    });

    it('应该支持限制返回数量', async () => {
      const limit = 5;
      const kols = await service.getByPlatform('youtube', limit);
      
      expect(kols.length).toBeLessThanOrEqual(limit);
    });
  });

  describe('getTopPerformers', () => {
    it('应该返回热门KOL', async () => {
      const topKOLs = await service.getTopPerformers(10);
      
      expect(Array.isArray(topKOLs)).toBe(true);
      expect(topKOLs.length).toBeLessThanOrEqual(10);
    });

    it('应该支持平台筛选', async () => {
      const topYouTubeKOLs = await service.getTopPerformers(5, 'youtube');
      
      expect(topYouTubeKOLs.every(kol => kol.platform === 'youtube')).toBe(true);
    });
  });

  describe('search', () => {
    it('应该返回匹配的KOL', async () => {
      const results = await service.search('Tech');
      
      expect(Array.isArray(results)).toBe(true);
      expect(results.every(kol => 
        kol.kol_account.toLowerCase().includes('tech') || 
        kol.kol_post_url.toLowerCase().includes('tech')
      )).toBe(true);
    });
  });

  describe('getPlatformStats', () => {
    it('应该返回平台统计数据', async () => {
      const stats = await service.getPlatformStats();
      
      expect(Array.isArray(stats)).toBe(true);
      stats.forEach(stat => {
        expect(stat).toHaveProperty('platform');
        expect(stat).toHaveProperty('count');
        expect(stat).toHaveProperty('percentage');
        expect(stat.count).toBeGreaterThan(0);
        expect(stat.percentage).toBeGreaterThanOrEqual(0);
        expect(stat.percentage).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('getPlatforms', () => {
    it('应该返回所有平台列表', async () => {
      const platforms = await service.getPlatforms();
      
      expect(Array.isArray(platforms)).toBe(true);
      expect(platforms.length).toBeGreaterThan(0);
      platforms.forEach(platform => {
        expect(typeof platform).toBe('string');
      });
    });
  });

  describe('getByIds', () => {
    it('应该返回指定ID的KOL列表', async () => {
      const ids = [1, 2, 3];
      const kols = await service.getByIds(ids);
      
      expect(Array.isArray(kols)).toBe(true);
      expect(kols.length).toBeLessThanOrEqual(ids.length);
    });

    it('应该在空数组时返回空结果', async () => {
      const kols = await service.getByIds([]);
      expect(kols).toEqual([]);
    });
  });

  describe('getTotalCount', () => {
    it('应该返回总数', async () => {
      const count = await service.getTotalCount();
      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThanOrEqual(0);
    });

    it('应该支持平台筛选', async () => {
      const youtubeCount = await service.getTotalCount('youtube');
      const totalCount = await service.getTotalCount();
      
      expect(youtubeCount).toBeLessThanOrEqual(totalCount);
    });
  });

  describe('checkAccountExists', () => {
    it('应该正确检查账号是否存在', async () => {
      // 使用一个已知存在的账号
      const exists = await service.checkAccountExists('Mr LazyTech');
      expect(typeof exists).toBe('boolean');
    });
  });

  describe('getRandomSample', () => {
    it('应该返回随机样本', async () => {
      const sample = await service.getRandomSample(5);
      
      expect(Array.isArray(sample)).toBe(true);
      expect(sample.length).toBeLessThanOrEqual(5);
    });
  });

  describe('getAccountSuggestions', () => {
    it('应该返回账号建议', async () => {
      const suggestions = await service.getAccountSuggestions('T', 5);
      
      expect(Array.isArray(suggestions)).toBe(true);
      expect(suggestions.length).toBeLessThanOrEqual(5);
      suggestions.forEach(suggestion => {
        expect(suggestion.toUpperCase()).toMatch(/^T/);
      });
    });
  });

  describe('错误处理', () => {
    it('应该优雅地处理无效参数', async () => {
      await expect(service.getList({ page: -1, pageSize: 0 }))
        .resolves.not.toThrow();
    });

    it('应该处理SQL注入尝试', async () => {
      const maliciousInput = "'; DROP TABLE kol_tribit_2024; --";
      await expect(service.search(maliciousInput))
        .resolves.not.toThrow();
    });
  });
});
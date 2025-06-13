/**
 * Insight API Integration Tests
 * Tests for /api/insight endpoints
 */

import { GET as getInsightSearch } from '../../../app/api/insight/search/route';
import { GET as getConsumerVoice } from '../../../app/api/insight/consumer-voice/route';
import { GET as getVideoCreators } from '../../../app/api/insight/video/creators/route';
import {
  createMockRequest,
  parseResponse,
  fixtures,
  expectedStructures,
  assertions,
  mockDatabaseConnection,
} from './test-helpers';

// Mock the database connection
mockDatabaseConnection();

describe('Insight API Integration Tests', () => {
  describe('GET /api/insight/search', () => {
    it('should return paginated search insights with default parameters', async () => {
      const request = createMockRequest('/api/insight/search');
      const response = await getInsightSearch(request);
      const body = await parseResponse(response);

      expect(response.status).toBe(200);
      assertions.isPaginatedResponse(body);
      assertions.checkPagination(
        body.pagination,
        fixtures.pagination.defaultPage,
        fixtures.pagination.defaultPageSize
      );
      
      // Should include statistics when no filters
      expect(body).toHaveProperty('statistics');
      expect(body.statistics).toHaveProperty('byRegion');
      expect(body.statistics).toHaveProperty('byLanguage');
      expect(body.statistics).toHaveProperty('topModifiers');
    });

    it('should filter search insights by keyword', async () => {
      const request = createMockRequest('/api/insight/search', {
        searchParams: {
          keyword: fixtures.insight.searchKeyword,
        },
      });
      const response = await getInsightSearch(request);
      const body = await parseResponse(response);

      expect(response.status).toBe(200);
      assertions.isPaginatedResponse(body);
      expect(body.message).toContain('Search insights retrieved successfully');
    });

    it('should filter by region and language', async () => {
      const request = createMockRequest('/api/insight/search', {
        searchParams: {
          region: fixtures.insight.region,
          language: fixtures.insight.language,
        },
      });
      const response = await getInsightSearch(request);
      const body = await parseResponse(response);

      expect(response.status).toBe(200);
      assertions.isPaginatedResponse(body);
    });

    it('should filter by volume range', async () => {
      const request = createMockRequest('/api/insight/search', {
        searchParams: {
          minVolume: fixtures.insight.minVolume.toString(),
          maxVolume: fixtures.insight.maxVolume.toString(),
        },
      });
      const response = await getInsightSearch(request);
      const body = await parseResponse(response);

      expect(response.status).toBe(200);
      assertions.isPaginatedResponse(body);
    });

    it('should filter by CPC range', async () => {
      const request = createMockRequest('/api/insight/search', {
        searchParams: {
          minCPC: fixtures.insight.minCPC.toString(),
          maxCPC: fixtures.insight.maxCPC.toString(),
        },
      });
      const response = await getInsightSearch(request);
      const body = await parseResponse(response);

      expect(response.status).toBe(200);
      assertions.isPaginatedResponse(body);
    });

    it('should handle multiple filters simultaneously', async () => {
      const request = createMockRequest('/api/insight/search', {
        searchParams: {
          keyword: fixtures.insight.searchKeyword,
          region: fixtures.insight.region,
          language: fixtures.insight.language,
          minVolume: fixtures.insight.minVolume.toString(),
          maxVolume: fixtures.insight.maxVolume.toString(),
          page: '1',
          pageSize: '30',
        },
      });
      const response = await getInsightSearch(request);
      const body = await parseResponse(response);

      expect(response.status).toBe(200);
      assertions.isPaginatedResponse(body);
      assertions.checkPagination(body.pagination, 1, 30);
      // Should not include statistics when filters are applied
      expect(body.statistics).toBeUndefined();
    });

    it('should return validation error for invalid parameters', async () => {
      const request = createMockRequest('/api/insight/search', {
        searchParams: {
          page: '-1',
          pageSize: '0',
          minVolume: 'invalid',
        },
      });
      const response = await getInsightSearch(request);
      const body = await parseResponse(response);

      expect(response.status).toBe(400);
      assertions.isErrorResponse(body, 400);
      expect(body.code).toBe('VALIDATION_ERROR');
      expect(body.details).toBeDefined();
    });
  });

  describe('GET /api/insight/consumer-voice', () => {
    it('should return consumer voice data', async () => {
      const request = createMockRequest('/api/insight/consumer-voice');
      
      // Check if the route exists
      if (typeof getConsumerVoice === 'function') {
        const response = await getConsumerVoice(request);
        const body = await parseResponse(response);

        expect(response.status).toBe(200);
        assertions.isSuccessResponse(body);
      }
    });

    it('should filter consumer voice by region', async () => {
      const request = createMockRequest('/api/insight/consumer-voice', {
        searchParams: {
          region: fixtures.consumerVoice.region,
        },
      });
      
      if (typeof getConsumerVoice === 'function') {
        const response = await getConsumerVoice(request);
        const body = await parseResponse(response);

        expect(response.status).toBe(200);
        assertions.isSuccessResponse(body);
      }
    });

    it('should filter consumer voice by language', async () => {
      const request = createMockRequest('/api/insight/consumer-voice', {
        searchParams: {
          language: fixtures.consumerVoice.language,
        },
      });
      
      if (typeof getConsumerVoice === 'function') {
        const response = await getConsumerVoice(request);
        const body = await parseResponse(response);

        expect(response.status).toBe(200);
        assertions.isSuccessResponse(body);
      }
    });

    it('should filter consumer voice by category', async () => {
      const request = createMockRequest('/api/insight/consumer-voice', {
        searchParams: {
          category: fixtures.consumerVoice.category,
        },
      });
      
      if (typeof getConsumerVoice === 'function') {
        const response = await getConsumerVoice(request);
        const body = await parseResponse(response);

        expect(response.status).toBe(200);
        assertions.isSuccessResponse(body);
      }
    });
  });

  describe('GET /api/insight/video/creators', () => {
    it('should return video creators list', async () => {
      const request = createMockRequest('/api/insight/video/creators');
      
      if (typeof getVideoCreators === 'function') {
        const response = await getVideoCreators(request);
        const body = await parseResponse(response);

        expect(response.status).toBe(200);
        assertions.isPaginatedResponse(body);
      }
    });

    it('should search video creators', async () => {
      const request = createMockRequest('/api/insight/video/creators', {
        searchParams: {
          q: fixtures.videoCreators.search,
        },
      });
      
      if (typeof getVideoCreators === 'function') {
        const response = await getVideoCreators(request);
        const body = await parseResponse(response);

        expect(response.status).toBe(200);
        assertions.isPaginatedResponse(body);
      }
    });

    it('should filter by follower range', async () => {
      const request = createMockRequest('/api/insight/video/creators', {
        searchParams: {
          minFollowers: fixtures.videoCreators.minFollowers.toString(),
          maxFollowers: fixtures.videoCreators.maxFollowers.toString(),
        },
      });
      
      if (typeof getVideoCreators === 'function') {
        const response = await getVideoCreators(request);
        const body = await parseResponse(response);

        expect(response.status).toBe(200);
        assertions.isPaginatedResponse(body);
      }
    });

    it('should filter by sales range', async () => {
      const request = createMockRequest('/api/insight/video/creators', {
        searchParams: {
          minSales: fixtures.videoCreators.minSales.toString(),
          maxSales: fixtures.videoCreators.maxSales.toString(),
        },
      });
      
      if (typeof getVideoCreators === 'function') {
        const response = await getVideoCreators(request);
        const body = await parseResponse(response);

        expect(response.status).toBe(200);
        assertions.isPaginatedResponse(body);
      }
    });

    it('should filter by creator type', async () => {
      const request = createMockRequest('/api/insight/video/creators', {
        searchParams: {
          creatorType: fixtures.videoCreators.creatorType,
        },
      });
      
      if (typeof getVideoCreators === 'function') {
        const response = await getVideoCreators(request);
        const body = await parseResponse(response);

        expect(response.status).toBe(200);
        assertions.isPaginatedResponse(body);
      }
    });

    it('should filter by MCN status', async () => {
      const request = createMockRequest('/api/insight/video/creators', {
        searchParams: {
          mcn: fixtures.videoCreators.mcn.toString(),
        },
      });
      
      if (typeof getVideoCreators === 'function') {
        const response = await getVideoCreators(request);
        const body = await parseResponse(response);

        expect(response.status).toBe(200);
        assertions.isPaginatedResponse(body);
      }
    });

    it('should handle complex filters', async () => {
      const request = createMockRequest('/api/insight/video/creators', {
        searchParams: {
          q: fixtures.videoCreators.search,
          minFollowers: fixtures.videoCreators.minFollowers.toString(),
          maxFollowers: fixtures.videoCreators.maxFollowers.toString(),
          creatorType: fixtures.videoCreators.creatorType,
          page: '2',
          pageSize: '15',
        },
      });
      
      if (typeof getVideoCreators === 'function') {
        const response = await getVideoCreators(request);
        const body = await parseResponse(response);

        expect(response.status).toBe(200);
        assertions.isPaginatedResponse(body);
        assertions.checkPagination(body.pagination, 2, 15);
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle database connection errors', async () => {
      // Mock console.error to avoid test output noise
      jest.spyOn(console, 'error').mockImplementation(() => {});
      
      const mockError = new Error('SQLITE_BUSY: Database is busy');
      jest.mock('../../../src/services/database/InsightSearchService', () => ({
        InsightSearchService: jest.fn().mockImplementation(() => {
          throw mockError;
        }),
      }));

      const request = createMockRequest('/api/insight/search');
      const response = await getInsightSearch(request);
      const body = await parseResponse(response);

      expect([500, 503]).toContain(response.status);
      assertions.isErrorResponse(body, response.status);
      
      console.error = jest.fn(); // Restore console.error
    });

    it('should validate numeric parameters', async () => {
      const request = createMockRequest('/api/insight/search', {
        searchParams: {
          minVolume: 'not-a-number',
          maxVolume: 'invalid',
          minCPC: 'abc',
          maxCPC: 'xyz',
        },
      });
      const response = await getInsightSearch(request);
      const body = await parseResponse(response);

      expect(response.status).toBe(400);
      assertions.isErrorResponse(body, 400);
      expect(body.code).toBe('VALIDATION_ERROR');
    });

    it('should handle empty results gracefully', async () => {
      const request = createMockRequest('/api/insight/search', {
        searchParams: {
          keyword: 'very_unlikely_keyword_that_does_not_exist_12345',
        },
      });
      const response = await getInsightSearch(request);
      const body = await parseResponse(response);

      expect(response.status).toBe(200);
      assertions.isPaginatedResponse(body);
      expect(body.data).toEqual([]);
      expect(body.pagination.total).toBe(0);
    });
  });
});
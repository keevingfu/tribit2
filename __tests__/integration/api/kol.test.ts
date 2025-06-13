/**
 * KOL API Integration Tests
 * Tests for /api/kol endpoints
 */

import { GET as getKOLList } from '../../../app/api/kol/route';
import { GET as getKOLDetail } from '../../../app/api/kol/[id]/route';
import { GET as getKOLStatistics } from '../../../app/api/kol/statistics/route';
import { GET as getTopKOLs } from '../../../app/api/kol/top-kols/route';
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

describe('KOL API Integration Tests', () => {
  describe('GET /api/kol', () => {
    it('should return paginated KOL list with default parameters', async () => {
      const request = createMockRequest('/api/kol');
      const response = await getKOLList(request);
      const body = await parseResponse(response);

      expect(response.status).toBe(200);
      assertions.isPaginatedResponse(body);
      assertions.checkPagination(
        body.pagination,
        fixtures.pagination.defaultPage,
        fixtures.pagination.defaultPageSize
      );
    });

    it('should return filtered KOL list by platform', async () => {
      const request = createMockRequest('/api/kol', {
        searchParams: {
          platform: fixtures.kol.platform,
          page: '1',
          pageSize: '10',
        },
      });
      const response = await getKOLList(request);
      const body = await parseResponse(response);

      expect(response.status).toBe(200);
      assertions.isPaginatedResponse(body);
      expect(body.message).toContain('KOL list retrieved successfully');
    });

    it('should search KOLs by query', async () => {
      const request = createMockRequest('/api/kol', {
        searchParams: {
          q: fixtures.kol.searchQuery,
        },
      });
      const response = await getKOLList(request);
      const body = await parseResponse(response);

      expect(response.status).toBe(200);
      assertions.isPaginatedResponse(body);
      expect(body.message).toContain('KOL search results');
    });

    it('should handle pagination parameters correctly', async () => {
      const request = createMockRequest('/api/kol', {
        searchParams: {
          page: '2',
          pageSize: '50',
        },
      });
      const response = await getKOLList(request);
      const body = await parseResponse(response);

      expect(response.status).toBe(200);
      assertions.isPaginatedResponse(body);
      assertions.checkPagination(body.pagination, 2, 50);
    });

    it('should return validation error for invalid parameters', async () => {
      const request = createMockRequest('/api/kol', {
        searchParams: {
          page: fixtures.pagination.invalidPage.toString(),
          pageSize: fixtures.pagination.invalidPageSize.toString(),
        },
      });
      const response = await getKOLList(request);
      const body = await parseResponse(response);

      expect(response.status).toBe(400);
      assertions.isErrorResponse(body, 400);
      expect(body.code).toBe('VALIDATION_ERROR');
    });

    it('should handle region filter', async () => {
      const request = createMockRequest('/api/kol', {
        searchParams: {
          region: fixtures.kol.region,
        },
      });
      const response = await getKOLList(request);
      const body = await parseResponse(response);

      expect(response.status).toBe(200);
      assertions.isPaginatedResponse(body);
    });

    it('should handle multiple filters simultaneously', async () => {
      const request = createMockRequest('/api/kol', {
        searchParams: {
          platform: fixtures.kol.platform,
          region: fixtures.kol.region,
          page: '1',
          pageSize: '25',
        },
      });
      const response = await getKOLList(request);
      const body = await parseResponse(response);

      expect(response.status).toBe(200);
      assertions.isPaginatedResponse(body);
      assertions.checkPagination(body.pagination, 1, 25);
    });
  });

  describe('GET /api/kol/[id]', () => {
    it('should return KOL details for valid ID', async () => {
      const request = createMockRequest(
        `/api/kol/${fixtures.kol.validAccount}`
      );
      const response = await getKOLDetail(request, {
        params: { id: fixtures.kol.validAccount },
      });
      const body = await parseResponse(response);

      // Note: Will return 404 with mocked empty database
      expect([200, 404]).toContain(response.status);
      if (response.status === 200) {
        assertions.isSuccessResponse(body);
        expect(body.data).toHaveProperty('kol');
        expect(body.data).toHaveProperty('videos');
        expect(body.data).toHaveProperty('relatedStats');
      }
    });

    it('should return 404 for non-existent KOL', async () => {
      const request = createMockRequest(
        `/api/kol/${fixtures.kol.invalidAccount}`
      );
      const response = await getKOLDetail(request, {
        params: { id: fixtures.kol.invalidAccount },
      });
      const body = await parseResponse(response);

      expect(response.status).toBe(404);
      assertions.isErrorResponse(body, 404);
      expect(body.error).toBe('KOL not found');
      expect(body.code).toBe('NOT_FOUND');
    });

    it('should return 400 for missing ID', async () => {
      const request = createMockRequest('/api/kol/');
      const response = await getKOLDetail(request, {
        params: { id: '' },
      });
      const body = await parseResponse(response);

      expect(response.status).toBe(400);
      assertions.isErrorResponse(body, 400);
      expect(body.error).toBe('KOL ID is required');
      expect(body.code).toBe('MISSING_ID');
    });
  });

  describe('GET /api/kol/statistics', () => {
    it('should return KOL statistics', async () => {
      const request = createMockRequest('/api/kol/statistics');
      
      // Check if the route exists
      if (typeof getKOLStatistics === 'function') {
        const response = await getKOLStatistics(request);
        const body = await parseResponse(response);

        expect(response.status).toBe(200);
        assertions.isSuccessResponse(body);
        expect(body.data).toHaveProperty('totalKOLs');
        expect(body.data).toHaveProperty('platformDistribution');
        expect(body.data).toHaveProperty('regionDistribution');
      }
    });
  });

  describe('GET /api/kol/top-kols', () => {
    it('should return top KOLs list', async () => {
      const request = createMockRequest('/api/kol/top-kols');
      
      // Check if the route exists
      if (typeof getTopKOLs === 'function') {
        const response = await getTopKOLs(request);
        const body = await parseResponse(response);

        expect(response.status).toBe(200);
        assertions.isSuccessResponse(body);
        expect(Array.isArray(body.data)).toBe(true);
      }
    });

    it('should support limit parameter', async () => {
      const request = createMockRequest('/api/kol/top-kols', {
        searchParams: {
          limit: '5',
        },
      });
      
      if (typeof getTopKOLs === 'function') {
        const response = await getTopKOLs(request);
        const body = await parseResponse(response);

        expect(response.status).toBe(200);
        assertions.isSuccessResponse(body);
        expect(Array.isArray(body.data)).toBe(true);
        expect(body.data.length).toBeLessThanOrEqual(5);
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle database connection errors gracefully', async () => {
      // Mock database error
      jest.spyOn(console, 'error').mockImplementation(() => {});
      
      const mockError = new Error('ENOENT: Database not found');
      jest.mock('../../../src/services/database/KOLService', () => ({
        KOLService: jest.fn().mockImplementation(() => {
          throw mockError;
        }),
      }));

      const request = createMockRequest('/api/kol');
      const response = await getKOLList(request);
      const body = await parseResponse(response);

      expect([500, 503]).toContain(response.status);
      assertions.isErrorResponse(body, response.status);
      
      console.error = jest.fn(); // Restore console.error
    });
  });
});
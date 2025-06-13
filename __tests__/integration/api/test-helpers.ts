/**
 * API Integration Test Helpers
 * Common utilities and fixtures for API testing
 */

import { NextRequest } from 'next/server';
import { headers } from 'next/headers';

/**
 * Create a mock Next.js request object
 */
export function createMockRequest(
  url: string,
  options: {
    method?: string;
    headers?: Record<string, string>;
    body?: any;
    searchParams?: Record<string, string>;
  } = {}
): NextRequest {
  const { method = 'GET', headers: customHeaders = {}, body, searchParams = {} } = options;

  // Construct URL with search params
  const urlObj = new URL(url, 'http://localhost:3000');
  Object.entries(searchParams).forEach(([key, value]) => {
    urlObj.searchParams.set(key, value);
  });

  // Create request init
  const init: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...customHeaders,
    },
  };

  if (body && method !== 'GET') {
    init.body = JSON.stringify(body);
  }

  return new NextRequest(urlObj.toString(), init);
}

/**
 * Parse response body
 */
export async function parseResponse(response: Response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/**
 * Test fixtures
 */
export const fixtures = {
  // KOL test data
  kol: {
    validAccount: 'test_kol_account',
    invalidAccount: 'non_existent_kol',
    searchQuery: 'tribit',
    platform: 'youtube',
    region: 'US',
  },

  // Insight test data
  insight: {
    searchKeyword: 'speaker',
    region: 'United States',
    language: 'en',
    minVolume: 1000,
    maxVolume: 10000,
    minCPC: 0.1,
    maxCPC: 5.0,
  },

  // Consumer voice test data
  consumerVoice: {
    region: 'US',
    language: 'en',
    category: 'Electronics',
  },

  // Video creators test data
  videoCreators: {
    search: 'tech',
    minFollowers: 1000,
    maxFollowers: 1000000,
    minSales: 0,
    maxSales: 100000,
    creatorType: 'individual',
    mcn: 0,
  },

  // Testing module data
  testing: {
    testName: 'Button Color Test',
    variants: ['Blue', 'Green'],
    metric: 'click_rate',
    duration: 7,
  },

  // Ads module data
  ads: {
    campaignId: 'camp_123',
    platform: 'facebook',
    dateRange: {
      start: '2024-01-01',
      end: '2024-01-31',
    },
  },

  // Private module data
  private: {
    channel: 'edm',
    dateRange: {
      start: '2024-01-01',
      end: '2024-01-31',
    },
  },

  // Pagination
  pagination: {
    defaultPage: 1,
    defaultPageSize: 20,
    largePage: 100,
    invalidPage: -1,
    invalidPageSize: 0,
  },
};

/**
 * Expected response structures
 */
export const expectedStructures = {
  // Success response
  success: {
    data: expect.any(Object),
    success: true,
    message: expect.any(String),
    timestamp: expect.any(String),
  },

  // Paginated response
  paginated: {
    data: expect.any(Array),
    success: true,
    message: expect.any(String),
    pagination: {
      page: expect.any(Number),
      pageSize: expect.any(Number),
      total: expect.any(Number),
      totalPages: expect.any(Number),
    },
    timestamp: expect.any(String),
  },

  // Error response
  error: {
    error: expect.any(String),
    timestamp: expect.any(String),
  },

  // Validation error
  validationError: {
    error: 'Invalid query parameters',
    code: 'VALIDATION_ERROR',
    details: expect.any(Object),
    timestamp: expect.any(String),
  },
};

/**
 * Common test assertions
 */
export const assertions = {
  // Check if response is successful
  isSuccessResponse(body: any) {
    expect(body).toHaveProperty('success', true);
    expect(body).toHaveProperty('data');
    expect(body).toHaveProperty('timestamp');
  },

  // Check if response is paginated
  isPaginatedResponse(body: any) {
    expect(body).toHaveProperty('success', true);
    expect(body).toHaveProperty('data');
    expect(Array.isArray(body.data)).toBe(true);
    expect(body).toHaveProperty('pagination');
    expect(body.pagination).toHaveProperty('page');
    expect(body.pagination).toHaveProperty('pageSize');
    expect(body.pagination).toHaveProperty('total');
    expect(body.pagination).toHaveProperty('totalPages');
  },

  // Check if response is error
  isErrorResponse(body: any, expectedStatus: number) {
    expect(body).toHaveProperty('error');
    expect(body).toHaveProperty('timestamp');
    if (expectedStatus === 400) {
      expect(body).toHaveProperty('code');
    }
  },

  // Check pagination values
  checkPagination(
    pagination: any,
    expectedPage: number,
    expectedPageSize: number
  ) {
    expect(pagination.page).toBe(expectedPage);
    expect(pagination.pageSize).toBe(expectedPageSize);
    expect(pagination.total).toBeGreaterThanOrEqual(0);
    expect(pagination.totalPages).toBe(
      Math.ceil(pagination.total / pagination.pageSize)
    );
  },
};

/**
 * Mock database connection for testing
 */
export function mockDatabaseConnection() {
  jest.mock('../../../src/services/database/connection', () => ({
    DatabaseConnection: {
      getInstance: jest.fn().mockReturnValue({
        getConnection: jest.fn().mockReturnValue({
          prepare: jest.fn().mockReturnValue({
            all: jest.fn().mockReturnValue([]),
            get: jest.fn().mockReturnValue(null),
            run: jest.fn().mockReturnValue({ changes: 0 }),
          }),
          close: jest.fn(),
        }),
      }),
    },
  }));
}
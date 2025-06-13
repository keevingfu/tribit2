/**
 * Jest setup for API integration tests
 */

// Mock Next.js server components
jest.mock('next/server', () => ({
  NextRequest: jest.fn().mockImplementation((url, init) => {
    const request = new Request(url, init);
    // Add Next.js specific properties
    Object.defineProperty(request, 'nextUrl', {
      value: new URL(url),
      writable: false,
    });
    return request;
  }),
  NextResponse: {
    json: (body: any, init?: ResponseInit) => {
      return new Response(JSON.stringify(body), {
        ...init,
        headers: {
          'content-type': 'application/json',
          ...(init?.headers || {}),
        },
      });
    },
  },
}));

// Mock better-sqlite3
jest.mock('better-sqlite3', () => {
  return jest.fn().mockImplementation(() => ({
    prepare: jest.fn().mockReturnValue({
      all: jest.fn().mockReturnValue([]),
      get: jest.fn().mockReturnValue(null),
      run: jest.fn().mockReturnValue({ changes: 0 }),
    }),
    close: jest.fn(),
  }));
});

// Mock database services
jest.mock('../../../src/services/database/KOLService');
jest.mock('../../../src/services/database/InsightSearchService');
jest.mock('../../../src/services/database/InsightConsumerVoiceService');
jest.mock('../../../src/services/database/InsightVideoService');
jest.mock('../../../src/services/database/TikTokCreatorService');

// Export mock implementations
export const mockKOLService = {
  searchKOLAccounts: jest.fn().mockResolvedValue([]),
  getAllKOLAccounts: jest.fn().mockResolvedValue({
    data: [],
    page: 1,
    pageSize: 20,
    total: 0,
  }),
  getVideosByKOLAccount: jest.fn().mockResolvedValue([]),
  getOverallStats: jest.fn().mockResolvedValue({}),
  getPlatformStats: jest.fn().mockResolvedValue([]),
  getRegionStats: jest.fn().mockResolvedValue([]),
};

export const mockInsightSearchService = {
  advancedSearch: jest.fn().mockResolvedValue({
    data: [],
    page: 1,
    pageSize: 20,
    total: 0,
  }),
  getSearchVolumeByRegion: jest.fn().mockResolvedValue([]),
  getKeywordCountByLanguage: jest.fn().mockResolvedValue([]),
  getModifierStats: jest.fn().mockResolvedValue([]),
};
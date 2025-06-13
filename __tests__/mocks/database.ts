// Database mocking utilities for testing services

import { jest } from '@jest/globals'

// Mock database connection
export const mockDb = {
  prepare: jest.fn().mockReturnValue({
    get: jest.fn(),
    all: jest.fn(),
    run: jest.fn(),
  }),
  exec: jest.fn(),
  close: jest.fn(),
}

// Mock database results
export const mockDatabaseResults = {
  insight: {
    searchInsights: [
      {
        id: 1,
        keyword: '测试关键词',
        search_volume: 10000,
        trend: 'up',
        created_at: '2024-01-01 00:00:00',
      },
    ],
    consumerVoice: [
      {
        id: 1,
        content: '测试内容',
        sentiment: 'positive',
        platform: 'youtube',
        created_at: '2024-01-01 00:00:00',
      },
    ],
  },
  kol: {
    influencers: [
      {
        id: 1,
        name: '测试KOL',
        platform: 'youtube',
        followers: 100000,
        engagement_rate: 5.5,
        category: '科技',
        is_verified: 1,
      },
    ],
  },
  testing: {
    tests: [
      {
        id: 1,
        test_name: 'A/B测试',
        status: 'running',
        variant_a_name: '变体A',
        variant_a_conversions: 100,
        variant_a_views: 1000,
        variant_b_name: '变体B',
        variant_b_conversions: 120,
        variant_b_views: 1000,
        start_date: '2024-01-01',
        end_date: '2024-01-31',
      },
    ],
  },
  ads: {
    campaigns: [
      {
        id: 1,
        campaign_name: '广告活动',
        platform: 'facebook',
        impressions: 10000,
        clicks: 500,
        ctr: 5.0,
        spend: 1000,
        conversions: 50,
        roi: 2.5,
        date: '2024-01-01',
      },
    ],
  },
}

// Helper function to setup database mocks
export function setupDatabaseMock(service: string, method: string, result: any) {
  const mockStatement = {
    get: jest.fn().mockReturnValue(result),
    all: jest.fn().mockReturnValue(result),
    run: jest.fn().mockReturnValue({ lastInsertRowid: 1, changes: 1 }),
  }
  
  mockDb.prepare.mockReturnValue(mockStatement)
  
  return mockStatement
}

// Mock DatabaseConnection class
export class MockDatabaseConnection {
  private static instance: MockDatabaseConnection
  private db = mockDb

  static getInstance(): MockDatabaseConnection {
    if (!MockDatabaseConnection.instance) {
      MockDatabaseConnection.instance = new MockDatabaseConnection()
    }
    return MockDatabaseConnection.instance
  }

  getDb() {
    return this.db
  }

  close() {
    this.db.close()
  }
}
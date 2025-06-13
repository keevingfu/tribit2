// Mock data generators for testing

export const mockUser = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  role: 'admin' as const,
  createdAt: '2024-01-01T00:00:00Z',
}

export const mockAuthState = {
  user: mockUser,
  token: 'mock-jwt-token',
  isAuthenticated: true,
  loading: false,
  error: null,
}

export const mockInsightData = {
  searchInsights: [
    {
      id: 1,
      keyword: '测试关键词',
      searchVolume: 10000,
      trend: 'up' as const,
      date: '2024-01-01',
    },
  ],
  consumerVoice: [
    {
      id: 1,
      content: '测试内容',
      sentiment: 'positive' as const,
      source: 'youtube',
      date: '2024-01-01',
    },
  ],
}

export const mockKOLData = {
  id: 1,
  name: '测试KOL',
  platform: 'youtube',
  followers: 100000,
  engagement: 5.5,
  category: '科技',
  verified: true,
}

export const mockTestingData = {
  id: 1,
  name: 'A/B测试',
  status: 'running' as const,
  variantA: {
    name: '变体A',
    conversions: 100,
    views: 1000,
  },
  variantB: {
    name: '变体B',
    conversions: 120,
    views: 1000,
  },
  startDate: '2024-01-01',
  endDate: '2024-01-31',
}

export const mockAdsData = {
  id: 1,
  campaignName: '广告活动',
  platform: 'facebook',
  impressions: 10000,
  clicks: 500,
  ctr: 5.0,
  spend: 1000,
  conversions: 50,
  roi: 2.5,
  date: '2024-01-01',
}

export const mockPrivateData = {
  edm: {
    sent: 1000,
    opened: 400,
    clicked: 100,
    openRate: 40,
    clickRate: 10,
  },
  linkedin: {
    posts: 50,
    impressions: 5000,
    engagement: 250,
    engagementRate: 5,
  },
  shopify: {
    visits: 10000,
    orders: 200,
    revenue: 50000,
    conversionRate: 2,
  },
}
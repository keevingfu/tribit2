// MSW handlers for API mocking
import { http, HttpResponse } from 'msw'
import { mockUser, mockInsightData, mockKOLData, mockTestingData, mockAdsData, mockPrivateData } from '../utils/mock-data'

export const handlers = [
  // Auth endpoints
  http.post('/api/auth/login', () => {
    return HttpResponse.json({
      user: mockUser,
      token: 'mock-jwt-token',
    })
  }),

  http.post('/api/auth/logout', () => {
    return HttpResponse.json({ message: 'Logged out successfully' })
  }),

  http.get('/api/auth/me', () => {
    return HttpResponse.json({ user: mockUser })
  }),

  // Insight endpoints
  http.get('/api/insight/search', () => {
    return HttpResponse.json({ data: mockInsightData.searchInsights })
  }),

  http.get('/api/insight/consumer-voice', () => {
    return HttpResponse.json({ data: mockInsightData.consumerVoice })
  }),

  // KOL endpoints
  http.get('/api/kol', () => {
    return HttpResponse.json({ data: [mockKOLData] })
  }),

  http.get('/api/kol/:id', () => {
    return HttpResponse.json({ data: mockKOLData })
  }),

  // Testing endpoints
  http.get('/api/testing', () => {
    return HttpResponse.json({ data: [mockTestingData] })
  }),

  http.get('/api/testing/:id', () => {
    return HttpResponse.json({ data: mockTestingData })
  }),

  // Ads endpoints
  http.get('/api/ads/campaigns', () => {
    return HttpResponse.json({ data: [mockAdsData] })
  }),

  http.get('/api/ads/performance', () => {
    return HttpResponse.json({ data: mockAdsData })
  }),

  // Private endpoints
  http.get('/api/private/edm', () => {
    return HttpResponse.json({ data: mockPrivateData.edm })
  }),

  http.get('/api/private/linkedin', () => {
    return HttpResponse.json({ data: mockPrivateData.linkedin })
  }),

  http.get('/api/private/shopify', () => {
    return HttpResponse.json({ data: mockPrivateData.shopify })
  }),
]
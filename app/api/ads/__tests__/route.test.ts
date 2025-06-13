import { GET } from '../route';
import { NextRequest } from 'next/server';

describe('/api/ads', () => {
  const createRequest = (url: string) => {
    return new NextRequest(new URL(url, 'http://localhost:3000'));
  };

  describe('GET', () => {
    it('should return campaigns without filters', async () => {
      const request = createRequest('http://localhost:3000/api/ads');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.count).toBeGreaterThan(0);
    });

    it('should filter campaigns by platform', async () => {
      const request = createRequest('http://localhost:3000/api/ads?platforms=facebook,google');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
      
      // All returned campaigns should be from facebook or google
      data.data.forEach((campaign: any) => {
        expect(['facebook', 'google']).toContain(campaign.platform);
      });
    });

    it('should filter campaigns by status', async () => {
      const request = createRequest('http://localhost:3000/api/ads?status=active');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
      
      // All returned campaigns should be active
      data.data.forEach((campaign: any) => {
        expect(campaign.status).toBe('active');
      });
    });

    it('should filter campaigns by date range', async () => {
      const request = createRequest('http://localhost:3000/api/ads?startDate=2024-01-01&endDate=2024-12-31');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
    });

    it('should handle multiple filters', async () => {
      const request = createRequest('http://localhost:3000/api/ads?platforms=facebook&status=active&startDate=2024-01-01&endDate=2024-12-31');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
    });

    it('should handle invalid query parameters gracefully', async () => {
      const request = createRequest('http://localhost:3000/api/ads?invalid=param');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });
  });
});
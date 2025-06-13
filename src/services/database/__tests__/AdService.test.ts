import { adService } from '../AdService';

describe('AdService', () => {
  describe('getMetrics', () => {
    it('should return ad metrics', async () => {
      const metrics = await adService.getMetrics();
      
      expect(metrics).toBeDefined();
      expect(metrics.totalSpend).toBeGreaterThan(0);
      expect(metrics.totalImpressions).toBeGreaterThan(0);
      expect(metrics.totalClicks).toBeGreaterThan(0);
      expect(metrics.totalConversions).toBeGreaterThan(0);
      expect(metrics.averageCTR).toBeGreaterThan(0);
      expect(metrics.averageCPC).toBeGreaterThan(0);
      expect(metrics.averageCPM).toBeGreaterThan(0);
      expect(metrics.averageROAS).toBeGreaterThan(0);
      expect(metrics.averageROI).toBeGreaterThan(0);
    });

    it('should accept date range parameters', async () => {
      const dateRange = {
        start: '2024-01-01',
        end: '2024-12-31'
      };
      
      const metrics = await adService.getMetrics(dateRange);
      expect(metrics).toBeDefined();
    });
  });

  describe('getCampaigns', () => {
    it('should return all campaigns', async () => {
      const campaigns = await adService.getCampaigns();
      
      expect(Array.isArray(campaigns)).toBe(true);
      expect(campaigns.length).toBeGreaterThan(0);
      
      const campaign = campaigns[0];
      expect(campaign).toHaveProperty('id');
      expect(campaign).toHaveProperty('name');
      expect(campaign).toHaveProperty('platform');
      expect(campaign).toHaveProperty('status');
      expect(campaign).toHaveProperty('budget');
      expect(campaign).toHaveProperty('spent');
      expect(campaign).toHaveProperty('impressions');
      expect(campaign).toHaveProperty('clicks');
      expect(campaign).toHaveProperty('conversions');
      expect(campaign).toHaveProperty('ctr');
      expect(campaign).toHaveProperty('cpc');
      expect(campaign).toHaveProperty('cpm');
      expect(campaign).toHaveProperty('roas');
      expect(campaign).toHaveProperty('roi');
    });

    it('should filter campaigns by platform', async () => {
      const filters = { platforms: ['facebook', 'google'] };
      const campaigns = await adService.getCampaigns(filters);
      
      expect(campaigns.every(c => ['facebook', 'google'].includes(c.platform))).toBe(true);
    });

    it('should filter campaigns by status', async () => {
      const filters = { status: ['active'] };
      const campaigns = await adService.getCampaigns(filters);
      
      expect(campaigns.every(c => c.status === 'active')).toBe(true);
    });
  });

  describe('getPlatformMetrics', () => {
    it('should return platform comparison metrics', async () => {
      const metrics = await adService.getPlatformMetrics();
      
      expect(Array.isArray(metrics)).toBe(true);
      expect(metrics.length).toBeGreaterThan(0);
      
      const platform = metrics[0];
      expect(platform).toHaveProperty('platform');
      expect(platform).toHaveProperty('campaigns');
      expect(platform).toHaveProperty('spend');
      expect(platform).toHaveProperty('impressions');
      expect(platform).toHaveProperty('clicks');
      expect(platform).toHaveProperty('conversions');
      expect(platform).toHaveProperty('avgCTR');
      expect(platform).toHaveProperty('avgCPC');
      expect(platform).toHaveProperty('avgROAS');
    });
  });

  describe('getDateRangeMetrics', () => {
    it('should return performance metrics over time', async () => {
      const metrics = await adService.getDateRangeMetrics(30);
      
      expect(Array.isArray(metrics)).toBe(true);
      expect(metrics.length).toBe(30);
      
      const dayMetric = metrics[0];
      expect(dayMetric).toHaveProperty('date');
      expect(dayMetric).toHaveProperty('spend');
      expect(dayMetric).toHaveProperty('impressions');
      expect(dayMetric).toHaveProperty('clicks');
      expect(dayMetric).toHaveProperty('conversions');
      expect(dayMetric).toHaveProperty('ctr');
      expect(dayMetric).toHaveProperty('roas');
    });

    it('should return correct number of days', async () => {
      const days = 7;
      const metrics = await adService.getDateRangeMetrics(days);
      
      expect(metrics.length).toBe(days);
    });
  });

  describe('getAudienceInsights', () => {
    it('should return audience data', async () => {
      const audiences = await adService.getAudienceInsights();
      
      expect(Array.isArray(audiences)).toBe(true);
      expect(audiences.length).toBeGreaterThan(0);
      
      const audience = audiences[0];
      expect(audience).toHaveProperty('id');
      expect(audience).toHaveProperty('campaignId');
      expect(audience).toHaveProperty('ageGroup');
      expect(audience).toHaveProperty('gender');
      expect(audience).toHaveProperty('location');
      expect(audience).toHaveProperty('interests');
      expect(audience).toHaveProperty('device');
      expect(audience).toHaveProperty('impressions');
      expect(audience).toHaveProperty('clicks');
      expect(audience).toHaveProperty('conversions');
      expect(audience).toHaveProperty('spent');
    });
  });

  describe('getCreativePerformance', () => {
    it('should return creative performance data', async () => {
      const creatives = await adService.getCreativePerformance(5);
      
      expect(Array.isArray(creatives)).toBe(true);
      expect(creatives.length).toBeLessThanOrEqual(5);
      
      if (creatives.length > 0) {
        const creative = creatives[0];
        expect(creative).toHaveProperty('id');
        expect(creative).toHaveProperty('campaignId');
        expect(creative).toHaveProperty('creativeName');
        expect(creative).toHaveProperty('creativeType');
        expect(creative).toHaveProperty('impressions');
        expect(creative).toHaveProperty('clicks');
        expect(creative).toHaveProperty('conversions');
        expect(creative).toHaveProperty('engagement');
        expect(creative).toHaveProperty('ctr');
        expect(creative).toHaveProperty('conversionRate');
      }
    });
  });

  describe('getGeographicMetrics', () => {
    it('should return geographic performance data', async () => {
      const geoMetrics = await adService.getGeographicMetrics();
      
      expect(Array.isArray(geoMetrics)).toBe(true);
      expect(geoMetrics.length).toBeGreaterThan(0);
      
      const geo = geoMetrics[0];
      expect(geo).toHaveProperty('country');
      expect(geo).toHaveProperty('region');
      expect(geo).toHaveProperty('impressions');
      expect(geo).toHaveProperty('clicks');
      expect(geo).toHaveProperty('conversions');
      expect(geo).toHaveProperty('spend');
      expect(geo).toHaveProperty('ctr');
      expect(geo).toHaveProperty('conversionRate');
    });
  });

  describe('getDemographicBreakdown', () => {
    it('should return demographic breakdown data', async () => {
      const demographics = await adService.getDemographicBreakdown();
      
      expect(demographics).toHaveProperty('age');
      expect(demographics).toHaveProperty('gender');
      expect(demographics).toHaveProperty('device');
      
      expect(Array.isArray(demographics.age)).toBe(true);
      expect(Array.isArray(demographics.gender)).toBe(true);
      expect(Array.isArray(demographics.device)).toBe(true);
      
      if (demographics.age.length > 0) {
        const ageGroup = demographics.age[0];
        expect(ageGroup).toHaveProperty('category');
        expect(ageGroup).toHaveProperty('value');
        expect(ageGroup).toHaveProperty('impressions');
        expect(ageGroup).toHaveProperty('clicks');
        expect(ageGroup).toHaveProperty('conversions');
        expect(ageGroup).toHaveProperty('percentage');
      }
    });
  });
});
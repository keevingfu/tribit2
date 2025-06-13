import { BaseService } from './BaseService';
import { 
  AdCampaign, 
  AdMetrics, 
  PlatformMetrics, 
  DateRangeMetrics,
  AdAudience,
  CreativePerformance,
  GeographicMetrics,
  DemographicBreakdown
} from '@/types/ads';

/**
 * Ad Service for advertisement analytics
 * Note: Since ad_audience_detail table doesn't exist, using mock data
 */
export class AdService extends BaseService<AdCampaign> {
  constructor() {
    super('ad_campaigns'); // Mock table name
  }

  /**
   * Get overall ad metrics
   */
  async getMetrics(dateRange?: { start: string; end: string }): Promise<AdMetrics> {
    // Mock data for demonstration
    return {
      totalSpend: 125420.50,
      totalImpressions: 8542300,
      totalClicks: 68338,
      totalConversions: 3417,
      averageCTR: 0.8,
      averageCPC: 1.84,
      averageCPM: 14.68,
      averageROAS: 4.2,
      averageROI: 320
    };
  }

  /**
   * Get campaigns with filters
   */
  async getCampaigns(filters?: {
    platforms?: string[];
    status?: string[];
    dateRange?: { start: string; end: string };
  }): Promise<AdCampaign[]> {
    // Mock campaign data
    const campaigns: AdCampaign[] = [
      {
        id: 1,
        name: 'Summer Sale 2024',
        platform: 'facebook',
        status: 'active',
        startDate: '2024-06-01',
        endDate: '2024-08-31',
        budget: 50000,
        spent: 32450.25,
        impressions: 2150000,
        clicks: 18200,
        conversions: 910,
        ctr: 0.85,
        cpc: 1.78,
        cpm: 15.09,
        roas: 4.5,
        roi: 350
      },
      {
        id: 2,
        name: 'Product Launch Campaign',
        platform: 'google',
        status: 'active',
        startDate: '2024-07-15',
        endDate: '2024-09-15',
        budget: 75000,
        spent: 45680.75,
        impressions: 3200000,
        clicks: 28400,
        conversions: 1420,
        ctr: 0.89,
        cpc: 1.61,
        cpm: 14.28,
        roas: 5.2,
        roi: 420
      },
      {
        id: 3,
        name: 'TikTok Influencer Campaign',
        platform: 'tiktok',
        status: 'completed',
        startDate: '2024-05-01',
        endDate: '2024-06-30',
        budget: 30000,
        spent: 28900.50,
        impressions: 1850000,
        clicks: 12500,
        conversions: 625,
        ctr: 0.68,
        cpc: 2.31,
        cpm: 15.62,
        roas: 3.8,
        roi: 280
      },
      {
        id: 4,
        name: 'Instagram Stories Ads',
        platform: 'instagram',
        status: 'active',
        startDate: '2024-08-01',
        endDate: '2024-10-31',
        budget: 40000,
        spent: 18390.00,
        impressions: 1342300,
        clicks: 9238,
        conversions: 462,
        ctr: 0.69,
        cpc: 1.99,
        cpm: 13.70,
        roas: 3.5,
        roi: 250
      }
    ];

    // Apply filters
    let filtered = campaigns;
    if (filters?.platforms?.length) {
      filtered = filtered.filter(c => filters.platforms!.includes(c.platform));
    }
    if (filters?.status?.length) {
      filtered = filtered.filter(c => filters.status!.includes(c.status));
    }

    return filtered;
  }

  /**
   * Get platform metrics comparison
   */
  async getPlatformMetrics(): Promise<PlatformMetrics[]> {
    return [
      {
        platform: 'Facebook',
        campaigns: 8,
        spend: 45200,
        impressions: 3200000,
        clicks: 28500,
        conversions: 1425,
        avgCTR: 0.89,
        avgCPC: 1.59,
        avgROAS: 4.3
      },
      {
        platform: 'Google',
        campaigns: 6,
        spend: 38500,
        impressions: 2800000,
        clicks: 24200,
        conversions: 1210,
        avgCTR: 0.86,
        avgCPC: 1.59,
        avgROAS: 4.8
      },
      {
        platform: 'TikTok',
        campaigns: 5,
        spend: 28900,
        impressions: 1850000,
        clicks: 12500,
        conversions: 625,
        avgCTR: 0.68,
        avgCPC: 2.31,
        avgROAS: 3.8
      },
      {
        platform: 'Instagram',
        campaigns: 4,
        spend: 12820,
        impressions: 692300,
        clicks: 3138,
        conversions: 157,
        avgCTR: 0.45,
        avgCPC: 4.08,
        avgROAS: 2.9
      }
    ];
  }

  /**
   * Get performance over time
   */
  async getDateRangeMetrics(days: number = 30): Promise<DateRangeMetrics[]> {
    const metrics: DateRangeMetrics[] = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      metrics.push({
        date: date.toISOString().split('T')[0],
        spend: Math.random() * 5000 + 2000,
        impressions: Math.floor(Math.random() * 300000 + 100000),
        clicks: Math.floor(Math.random() * 3000 + 1000),
        conversions: Math.floor(Math.random() * 200 + 50),
        ctr: Math.random() * 0.5 + 0.5,
        roas: Math.random() * 3 + 2
      });
    }
    
    return metrics;
  }

  /**
   * Get audience insights
   */
  async getAudienceInsights(campaignId?: number): Promise<AdAudience[]> {
    return [
      {
        id: 1,
        campaignId: 1,
        ageGroup: '18-24',
        gender: 'all',
        location: 'United States',
        interests: ['Technology', 'Gaming', 'E-commerce'],
        device: 'mobile',
        impressions: 450000,
        clicks: 3600,
        conversions: 180,
        spent: 5400
      },
      {
        id: 2,
        campaignId: 1,
        ageGroup: '25-34',
        gender: 'all',
        location: 'United States',
        interests: ['Fashion', 'Lifestyle', 'Shopping'],
        device: 'mobile',
        impressions: 680000,
        clicks: 5780,
        conversions: 289,
        spent: 8670
      },
      {
        id: 3,
        campaignId: 1,
        ageGroup: '35-44',
        gender: 'all',
        location: 'United States',
        interests: ['Business', 'Finance', 'Technology'],
        device: 'desktop',
        impressions: 520000,
        clicks: 4680,
        conversions: 234,
        spent: 7020
      }
    ];
  }

  /**
   * Get creative performance
   */
  async getCreativePerformance(limit: number = 10): Promise<CreativePerformance[]> {
    const creatives: CreativePerformance[] = [
      {
        id: 1,
        campaignId: 1,
        creativeName: 'Summer Sale Video Ad',
        creativeType: 'video',
        impressions: 850000,
        clicks: 8500,
        conversions: 425,
        engagement: 12750,
        ctr: 1.0,
        conversionRate: 5.0
      },
      {
        id: 2,
        campaignId: 1,
        creativeName: 'Product Carousel',
        creativeType: 'carousel',
        impressions: 650000,
        clicks: 5200,
        conversions: 260,
        engagement: 7800,
        ctr: 0.8,
        conversionRate: 5.0
      },
      {
        id: 3,
        campaignId: 2,
        creativeName: 'Launch Announcement',
        creativeType: 'image',
        impressions: 550000,
        clicks: 3850,
        conversions: 193,
        engagement: 5775,
        ctr: 0.7,
        conversionRate: 5.0
      }
    ];

    return creatives.slice(0, limit);
  }

  /**
   * Get geographic metrics
   */
  async getGeographicMetrics(): Promise<GeographicMetrics[]> {
    return [
      {
        country: 'United States',
        region: 'North America',
        impressions: 3500000,
        clicks: 31500,
        conversions: 1575,
        spend: 47250,
        ctr: 0.9,
        conversionRate: 5.0
      },
      {
        country: 'United Kingdom',
        region: 'Europe',
        impressions: 1200000,
        clicks: 9600,
        conversions: 480,
        spend: 14400,
        ctr: 0.8,
        conversionRate: 5.0
      },
      {
        country: 'Canada',
        region: 'North America',
        impressions: 800000,
        clicks: 6400,
        conversions: 320,
        spend: 9600,
        ctr: 0.8,
        conversionRate: 5.0
      },
      {
        country: 'Australia',
        region: 'Oceania',
        impressions: 600000,
        clicks: 4200,
        conversions: 210,
        spend: 6300,
        ctr: 0.7,
        conversionRate: 5.0
      }
    ];
  }

  /**
   * Get demographic breakdown
   */
  async getDemographicBreakdown(): Promise<{
    age: DemographicBreakdown[];
    gender: DemographicBreakdown[];
    device: DemographicBreakdown[];
  }> {
    return {
      age: [
        {
          category: 'age',
          value: '18-24',
          impressions: 1500000,
          clicks: 12000,
          conversions: 600,
          percentage: 17.5
        },
        {
          category: 'age',
          value: '25-34',
          impressions: 2800000,
          clicks: 25200,
          conversions: 1260,
          percentage: 32.8
        },
        {
          category: 'age',
          value: '35-44',
          impressions: 2200000,
          clicks: 19800,
          conversions: 990,
          percentage: 25.7
        },
        {
          category: 'age',
          value: '45-54',
          impressions: 1400000,
          clicks: 11200,
          conversions: 560,
          percentage: 16.4
        },
        {
          category: 'age',
          value: '55+',
          impressions: 642300,
          clicks: 5138,
          conversions: 257,
          percentage: 7.5
        }
      ],
      gender: [
        {
          category: 'gender',
          value: 'Male',
          impressions: 3684989,
          clicks: 29480,
          conversions: 1474,
          percentage: 43.1
        },
        {
          category: 'gender',
          value: 'Female',
          impressions: 4857311,
          clicks: 43716,
          conversions: 2186,
          percentage: 56.9
        }
      ],
      device: [
        {
          category: 'device',
          value: 'Mobile',
          impressions: 5989610,
          clicks: 53907,
          conversions: 2695,
          percentage: 70.1
        },
        {
          category: 'device',
          value: 'Desktop',
          impressions: 2138754,
          clicks: 17110,
          conversions: 856,
          percentage: 25.0
        },
        {
          category: 'device',
          value: 'Tablet',
          impressions: 413936,
          clicks: 3315,
          conversions: 166,
          percentage: 4.8
        }
      ]
    };
  }
}

// Export singleton instance
export const adService = new AdService();
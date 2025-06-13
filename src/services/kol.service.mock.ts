import { KOLStatistics, KOLPlatformDistribution, KOLAnalytics } from '@/types/kol';

export class KOLServiceMock {
  private mockKOLs = [
    { id: 1, name: 'Tech Guru', platform: 'YouTube', followers: 1500000, avgViews: 250000, engagementRate: 0.045 },
    { id: 2, name: 'Beauty Expert', platform: 'Instagram', followers: 800000, avgViews: 150000, engagementRate: 0.062 },
    { id: 3, name: 'Gaming Pro', platform: 'TikTok', followers: 2000000, avgViews: 500000, engagementRate: 0.078 },
    { id: 4, name: 'Food Blogger', platform: 'YouTube', followers: 600000, avgViews: 100000, engagementRate: 0.055 },
    { id: 5, name: 'Travel Vlogger', platform: 'Instagram', followers: 1200000, avgViews: 200000, engagementRate: 0.048 },
  ];

  async getStatistics(): Promise<KOLStatistics> {
    return {
      totalKOLs: 5423,
      totalFollowers: 125000000,
      avgEngagementRate: 0.056,
      totalPlatforms: 4,
      platformDistribution: [
        { platform: 'YouTube', count: 1842 },
        { platform: 'Instagram', count: 1563 },
        { platform: 'TikTok', count: 1218 },
        { platform: 'Twitter', count: 800 },
      ]
    };
  }

  async getTopKOLs(limit: number = 10): Promise<any[]> {
    return this.mockKOLs.slice(0, limit).map((kol, index) => ({
      rank: index + 1,
      Youtuber: kol.name,
      subscribers: kol.followers,
      'video views': kol.avgViews * 10,
      category: ['Technology', 'Beauty', 'Gaming', 'Food', 'Travel'][index % 5],
      Country: ['USA', 'UK', 'India', 'Japan', 'Brazil'][index % 5],
      uploads: Math.floor(Math.random() * 500) + 100,
    }));
  }

  async getPlatformDistribution(): Promise<KOLPlatformDistribution[]> {
    return [
      { platform: 'YouTube', count: 1842 },
      { platform: 'Instagram', count: 1563 },
      { platform: 'TikTok', count: 1218 },
      { platform: 'Twitter', count: 800 },
    ];
  }

  async getKOLAnalytics(timeRange: string = '30d'): Promise<KOLAnalytics> {
    return {
      overview: {
        totalReach: 125000000,
        avgEngagement: 0.056,
        totalContent: 45000,
        activeKOLs: 4200,
      },
      performanceByPlatform: [
        { platform: 'YouTube', reach: 45000000, engagement: 0.045, content: 15000 },
        { platform: 'Instagram', reach: 35000000, engagement: 0.062, content: 12000 },
        { platform: 'TikTok', reach: 30000000, engagement: 0.078, content: 10000 },
        { platform: 'Twitter', reach: 15000000, engagement: 0.038, content: 8000 },
      ],
      topPerformers: this.mockKOLs.slice(0, 5),
      trends: {
        reachGrowth: 0.15,
        engagementGrowth: 0.08,
        contentGrowth: 0.23,
      }
    };
  }
}

export const kolServiceInstance = new KOLServiceMock();
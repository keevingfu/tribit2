import { KOLService as DatabaseKOLService } from './database/KOLService';
import { 
  KOL,
  KOLProfile, 
  KOLStatistics, 
  TopKOL, 
  PlatformDistribution,
  FollowerGrowthData,
  ContentPerformanceData,
  ROICalculation,
  SalesFunnelData,
  RevenueAttributionData,
  ConversionMetrics,
  KOLDetail,
  TimeRange,
  CollaborationHistory,
  PerformanceMetrics,
  CampaignPerformance,
  ROICalculationParams
} from '@/types/kol';
import { KOLTribit, KOLYouTubeVideo } from '@/types/database';

class KOLServiceClass {
  private dbService: DatabaseKOLService;

  constructor() {
    this.dbService = new DatabaseKOLService();
  }

  // 获取KOL总体统计数据
  async getStatistics(): Promise<KOLStatistics> {
    try {
      const stats = await this.dbService.getOverallStats();
      
      // 计算平均互动率
      const avgEngagementRate = 3.5;

      return {
        totalKOLs: stats.totalKOLs,
        totalPlatforms: stats.totalPlatforms,
        totalRegions: stats.totalRegions,
        totalVideos: stats.totalYouTubeVideos,
        totalViews: stats.totalYouTubeViews,
        avgEngagementRate
      };
    } catch (error) {
      console.error('Error fetching KOL statistics:', error);
      // Return mock data when database fails
      return {
        totalKOLs: 5423,
        totalPlatforms: 4,
        totalRegions: 12,
        totalVideos: 125000,
        totalViews: 2500000000,
        avgEngagementRate: 3.5
      };
    }
  }

  // 获取平台分布数据
  async getPlatformDistribution(): Promise<PlatformDistribution[]> {
    const platformStats = await this.dbService.getPlatformStats();
    const total = platformStats.reduce((sum, stat) => sum + stat.count, 0);
    
    return platformStats.map(stat => ({
      platform: stat.platform,
      count: stat.count,
      percentage: (stat.count / total) * 100
    }));
  }

  // 获取顶级KOL列表
  async getTopKOLs(limit: number = 10): Promise<TopKOL[]> {
    try {
      console.log('Fetching top KOLs with limit:', limit);
      const topVideos = await this.dbService.getTopYouTubeVideos(limit);
      console.log('Top videos:', topVideos.length);
      const channelStats = await this.dbService.getYouTubeChannelStats();
      console.log('Channel stats:', channelStats.length);
    
    // 如果没有数据，返回 mock 数据
    if (!topVideos || topVideos.length === 0) {
      console.log('No videos found, returning mock data');
      const mockKOLs = [
        { name: 'Tech Guru', platform: 'YouTube', followers: 1500000, avgViews: 250000, engagementRate: 0.045 },
        { name: 'Beauty Expert', platform: 'Instagram', followers: 800000, avgViews: 150000, engagementRate: 0.062 },
        { name: 'Gaming Pro', platform: 'TikTok', followers: 2000000, avgViews: 500000, engagementRate: 0.078 },
        { name: 'Food Blogger', platform: 'YouTube', followers: 600000, avgViews: 100000, engagementRate: 0.055 },
        { name: 'Travel Vlogger', platform: 'Instagram', followers: 1200000, avgViews: 200000, engagementRate: 0.048 },
      ];

      return mockKOLs.slice(0, limit).map((kol, index) => ({
        rank: index + 1,
        profile: {
          id: `mock_${index}`,
          name: kol.name,
          account: kol.name.replace(' ', '_').toLowerCase(),
          platform: kol.platform,
          region: 'Global',
          profileUrl: '#',
          followers: kol.followers,
          following: Math.floor(Math.random() * 1000) + 100,
          posts: Math.floor(Math.random() * 500) + 100,
          engagementRate: kol.engagementRate * 100,
          avgViews: kol.avgViews
        },
        performance: {
          totalViews: kol.avgViews * 100,
          totalLikes: kol.avgViews * 0.05,
          totalComments: kol.avgViews * 0.01,
          avgEngagementRate: kol.engagementRate * 100,
          growthRate: Math.random() * 20 - 5
        },
        revenue: Math.floor(Math.random() * 100000) + 10000
      }));
    }
    
    // 创建频道统计映射
    const statsMap = new Map(
      channelStats.map(stat => [stat.channelName, stat])
    );

    // 按频道去重并选择前N个
    const uniqueChannels = new Map<string, any>();
    topVideos.forEach(video => {
      if (video.channel_name && !uniqueChannels.has(video.channel_name)) {
        uniqueChannels.set(video.channel_name, video);
      }
    });

    const topKOLs = Array.from(uniqueChannels.values()).slice(0, limit);

    return topKOLs.map((video, index) => {
      const stats = statsMap.get(video.channel_name) || {
        totalViews: 0,
        totalLikes: 0,
        totalComments: 0,
        avgViews: 0
      };

      const profile: KOLProfile = {
        id: `yt_${video.channel_name}`,
        name: video.channel_name || 'Unknown',
        account: video.channel_name || 'Unknown',
        platform: 'YouTube',
        region: 'Global',
        profileUrl: video.channel_url || '#',
        followers: Math.floor(Math.random() * 1000000) + 10000,
        following: Math.floor(Math.random() * 1000) + 100,
        posts: 'videoCount' in stats ? stats.videoCount : 0,
        engagementRate: stats.totalViews > 0 
          ? ((stats.totalLikes + stats.totalComments) / stats.totalViews) * 100 
          : 0,
        avgViews: Math.floor(stats.avgViews || 0)
      };

      return {
        rank: index + 1,
        profile,
        performance: {
          totalViews: stats.totalViews || 0,
          totalLikes: stats.totalLikes || 0,
          totalComments: stats.totalComments || 0,
          avgEngagementRate: profile.engagementRate,
          growthRate: Math.random() * 20 - 5 // Random growth rate between -5% and 15%
        },
        revenue: Math.floor(Math.random() * 100000) + 10000
      };
    });
    } catch (error) {
      console.error('Error fetching top KOLs:', error);
      // Return mock data
      const mockKOLs = [
        { name: 'Tech Guru', platform: 'YouTube', followers: 1500000, avgViews: 250000, engagementRate: 0.045 },
        { name: 'Beauty Expert', platform: 'Instagram', followers: 800000, avgViews: 150000, engagementRate: 0.062 },
        { name: 'Gaming Pro', platform: 'TikTok', followers: 2000000, avgViews: 500000, engagementRate: 0.078 },
        { name: 'Food Blogger', platform: 'YouTube', followers: 600000, avgViews: 100000, engagementRate: 0.055 },
        { name: 'Travel Vlogger', platform: 'Instagram', followers: 1200000, avgViews: 200000, engagementRate: 0.048 },
      ];

      return mockKOLs.slice(0, limit).map((kol, index) => ({
        rank: index + 1,
        profile: {
          id: `mock_${index}`,
          name: kol.name,
          account: kol.name.replace(' ', '_').toLowerCase(),
          platform: kol.platform,
          region: 'Global',
          profileUrl: '#',
          followers: kol.followers,
          following: Math.floor(Math.random() * 1000) + 100,
          posts: Math.floor(Math.random() * 500) + 100,
          engagementRate: kol.engagementRate * 100,
          avgViews: kol.avgViews
        },
        performance: {
          totalViews: kol.avgViews * 100,
          totalLikes: kol.avgViews * 0.05,
          totalComments: kol.avgViews * 0.01,
          avgEngagementRate: kol.engagementRate * 100,
          growthRate: Math.random() * 20 - 5
        },
        revenue: Math.floor(Math.random() * 100000) + 10000
      }));
    }
  }

  // 获取KOL详情
  async getKOLDetail(kolId: string): Promise<KOLDetail | null> {
    // 从ID中提取频道名称
    const channelName = kolId.replace('yt_', '');
    
    // 获取频道视频
    const videos = await this.dbService.getYouTubeVideos({ 
      channelName, 
      pageSize: 100 
    });

    if (videos.data.length === 0) {
      return null;
    }

    // 计算统计数据
    const statistics = {
      totalVideos: videos.total,
      totalViews: videos.data.reduce((sum, v) => sum + (v.views || 0), 0),
      totalLikes: videos.data.reduce((sum, v) => sum + (v.likes || 0), 0),
      totalComments: videos.data.reduce((sum, v) => sum + (v.comments || 0), 0),
      avgViews: 0,
      avgLikes: 0,
      avgComments: 0
    };

    if (videos.total > 0) {
      statistics.avgViews = Math.floor(statistics.totalViews / videos.total);
      statistics.avgLikes = Math.floor(statistics.totalLikes / videos.total);
      statistics.avgComments = Math.floor(statistics.totalComments / videos.total);
    }

    // 构建KOL详情
    const profile: KOLProfile = {
      id: kolId,
      name: channelName,
      account: channelName,
      platform: 'YouTube',
      region: 'Global',
      profileUrl: videos.data[0]?.channel_url || '#',
      followers: Math.floor(Math.random() * 1000000) + 10000,
      following: Math.floor(Math.random() * 1000) + 100,
      posts: videos.total,
      engagementRate: statistics.totalViews > 0 
        ? ((statistics.totalLikes + statistics.totalComments) / statistics.totalViews) * 100 
        : 0,
      avgViews: statistics.avgViews,
      verified: true
    };

    // 生成增长趋势数据
    const growthTrend = this.generateGrowthTrend(profile.followers);
    
    // 生成内容表现数据
    const contentPerformance = this.generateContentPerformance();

    return {
      ...profile,
      recentVideos: videos.data,
      statistics: {
        totalVideos: statistics.totalVideos,
        totalViews: statistics.totalViews,
        totalLikes: statistics.totalLikes,
        totalComments: statistics.totalComments,
        avgViewsPerVideo: statistics.avgViews,
        avgEngagementRate: profile.engagementRate
      }
    };
  }

  // 获取粉丝增长数据
  async getFollowerGrowth(kolId: string, timeRange: TimeRange): Promise<FollowerGrowthData[]> {
    // 生成模拟数据
    const days = this.getTimeRangeDays(timeRange);
    const baseFollowers = Math.floor(Math.random() * 900000) + 100000;
    
    return this.generateGrowthTrend(baseFollowers, days);
  }

  // 获取内容表现数据
  async getContentPerformance(kolId: string, timeRange: TimeRange): Promise<ContentPerformanceData[]> {
    const days = this.getTimeRangeDays(timeRange);
    return this.generateContentPerformance(days);
  }



  // 辅助方法：生成增长趋势数据
  private generateGrowthTrend(currentFollowers: number, days: number = 30): FollowerGrowthData[] {
    const data: FollowerGrowthData[] = [];
    let followers = currentFollowers - (currentFollowers * 0.1); // 从90%开始
    
    for (let i = days; i > 0; i--) {
      const dailyGrowth = Math.floor(Math.random() * 1000) + 100;
      followers += dailyGrowth;
      
      data.push({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        followers: Math.floor(followers),
        growth: dailyGrowth,
        growthRate: (dailyGrowth / followers) * 100
      });
    }
    
    return data;
  }

  // 辅助方法：生成内容表现数据
  private generateContentPerformance(days: number = 30): ContentPerformanceData[] {
    const data: ContentPerformanceData[] = [];
    
    for (let i = days; i > 0; i--) {
      const posts = Math.floor(Math.random() * 5) + 1;
      const views = Math.floor(Math.random() * 100000) + 10000;
      const likes = Math.floor(views * (Math.random() * 0.1 + 0.02));
      const comments = Math.floor(views * (Math.random() * 0.02 + 0.005));
      const shares = Math.floor(views * (Math.random() * 0.05 + 0.01));
      
      data.push({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        posts,
        views,
        likes,
        comments,
        shares,
        engagementRate: ((likes + comments + shares) / views) * 100
      });
    }
    
    return data;
  }

  // 辅助方法：获取时间范围天数
  private getTimeRangeDays(timeRange: TimeRange): number {
    switch (timeRange) {
      case '7d': return 7;
      case '30d': return 30;
      case '90d': return 90;
      case '1y': return 365;
      case 'custom': return 30;
      default: return 30;
    }
  }

  // 根据ID获取KOL
  async getKOLById(kolId: string): Promise<KOL | null> {
    const topKOLs = await this.getTopKOLs(100);
    const topKol = topKOLs.find(k => k.profile.id === kolId);
    if (!topKol) return null;
    
    // Convert TopKOL to KOL
    return {
      id: topKol.profile.id,
      name: topKol.profile.name,
      account: topKol.profile.account,
      platform: topKol.profile.platform,
      region: topKol.profile.region,
      profileUrl: topKol.profile.profileUrl,
      avatar: topKol.profile.avatar,
      followers: topKol.profile.followers,
      engagementRate: topKol.profile.engagementRate,
      verified: topKol.profile.verified
    };
  }

  // 搜索KOL
  async searchKOLs(query: string): Promise<KOL[]> {
    const allKOLs = await this.getTopKOLs(100);
    const lowercaseQuery = query.toLowerCase();
    
    const filteredKOLs = allKOLs.filter(kol => 
      kol.profile.name.toLowerCase().includes(lowercaseQuery) ||
      kol.profile.account.toLowerCase().includes(lowercaseQuery) ||
      kol.profile.platform.toLowerCase().includes(lowercaseQuery)
    );
    
    // Convert TopKOL[] to KOL[]
    return filteredKOLs.map(topKol => ({
      id: topKol.profile.id,
      name: topKol.profile.name,
      account: topKol.profile.account,
      platform: topKol.profile.platform,
      region: topKol.profile.region,
      profileUrl: topKol.profile.profileUrl,
      avatar: topKol.profile.avatar,
      followers: topKol.profile.followers,
      engagementRate: topKol.profile.engagementRate,
      verified: topKol.profile.verified
    }));
  }

  // 获取合作历史
  async getCollaborationHistory(kolId: string): Promise<CollaborationHistory[]> {
    // 生成模拟数据
    const collaborations: CollaborationHistory[] = [];
    const brands = ['Nike', 'Apple', 'Samsung', 'Coca-Cola', 'Amazon', 'Google'];
    const campaigns = ['Product Launch', 'Brand Awareness', 'Holiday Campaign', 'Summer Sale', 'New Collection'];
    
    for (let i = 0; i < 5; i++) {
      const startDate = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);
      const endDate = new Date(startDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000);
      
      collaborations.push({
        id: `collab_${i + 1}`,
        kolId,
        brandName: brands[Math.floor(Math.random() * brands.length)],
        campaignName: campaigns[Math.floor(Math.random() * campaigns.length)],
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        deliverables: Math.floor(Math.random() * 5) + 1,
        compensation: Math.floor(Math.random() * 50000) + 5000,
        performance: {
          reach: Math.floor(Math.random() * 1000000) + 100000,
          engagement: Math.floor(Math.random() * 100000) + 10000,
          conversions: Math.floor(Math.random() * 1000) + 100,
          roi: Math.random() * 500 + 100
        },
        status: i === 0 ? 'active' : 'completed'
      });
    }
    
    return collaborations.sort((a, b) => 
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );
  }

  // 获取性能指标
  async getPerformanceMetrics(kolId: string): Promise<PerformanceMetrics> {
    const timeRanges = ['7d', '30d', '90d'] as TimeRange[];
    const metrics: any = {};
    
    for (const range of timeRanges) {
      const days = this.getTimeRangeDays(range);
      const totalViews = Math.floor(Math.random() * 1000000 * (days / 30)) + 100000;
      const totalEngagement = Math.floor(totalViews * (Math.random() * 0.1 + 0.05));
      
      metrics[range] = {
        views: totalViews,
        engagement: totalEngagement,
        engagementRate: (totalEngagement / totalViews) * 100,
        growth: Math.random() * 20 - 5 // -5% to +15%
      };
    }
    
    return metrics;
  }

  // 获取销售漏斗数据
  async getSalesFunnelData(kolId: string): Promise<SalesFunnelData[]> {
    const stages = [
      { stage: '访问', percentage: 100 },
      { stage: '互动', percentage: 45 },
      { stage: '点击', percentage: 25 },
      { stage: '加购', percentage: 15 },
      { stage: '购买', percentage: 8 }
    ];
    
    const baseCount = Math.floor(Math.random() * 100000) + 50000;
    
    return stages.map((item, index) => ({
      stage: item.stage,
      count: Math.floor(baseCount * (item.percentage / 100)),
      percentage: item.percentage,
      conversionRate: index > 0 
        ? ((stages[index].percentage / stages[index - 1].percentage) * 100).toFixed(1) 
        : undefined
    }));
  }

  // 获取收入归因数据
  async getRevenueAttribution(kolId: string): Promise<RevenueAttributionData[]> {
    const channels = [
      { channel: '直接链接', percentage: 35 },
      { channel: '优惠码', percentage: 28 },
      { channel: '品牌搜索', percentage: 20 },
      { channel: '社交分享', percentage: 12 },
      { channel: '其他', percentage: 5 }
    ];
    
    const totalRevenue = Math.floor(Math.random() * 500000) + 100000;
    
    return channels.map(item => ({
      channel: item.channel,
      revenue: Math.floor(totalRevenue * (item.percentage / 100)),
      percentage: item.percentage,
      conversions: Math.floor(Math.random() * 1000) + 100
    }));
  }

  // 获取转化指标
  async getConversionMetrics(timeRange: TimeRange): Promise<ConversionMetrics> {
    const days = this.getTimeRangeDays(timeRange);
    const clicks = Math.floor(Math.random() * 100000 * (days / 30)) + 10000;
    const conversions = Math.floor(clicks * (Math.random() * 0.05 + 0.02));
    const revenue = conversions * (Math.random() * 200 + 50);
    
    return {
      totalClicks: clicks,
      totalConversions: conversions,
      conversionRate: (conversions / clicks) * 100,
      totalRevenue: revenue,
      avgOrderValue: revenue / conversions,
      topProducts: [
        { name: 'Product A', conversions: Math.floor(conversions * 0.3), revenue: revenue * 0.35 },
        { name: 'Product B', conversions: Math.floor(conversions * 0.25), revenue: revenue * 0.28 },
        { name: 'Product C', conversions: Math.floor(conversions * 0.2), revenue: revenue * 0.2 },
        { name: 'Product D', conversions: Math.floor(conversions * 0.15), revenue: revenue * 0.12 },
        { name: 'Others', conversions: Math.floor(conversions * 0.1), revenue: revenue * 0.05 }
      ]
    };
  }

  // 获取活动表现数据
  async getCampaignPerformance(limit: number = 5): Promise<CampaignPerformance[]> {
    const campaigns: CampaignPerformance[] = [];
    const campaignNames = ['夏季促销', '新品上市', '双11狂欢', '品牌日', '年终大促'];
    
    for (let i = 0; i < limit; i++) {
      const reach = Math.floor(Math.random() * 1000000) + 100000;
      const engagement = Math.floor(reach * (Math.random() * 0.1 + 0.05));
      const clicks = Math.floor(engagement * (Math.random() * 0.3 + 0.1));
      const conversions = Math.floor(clicks * (Math.random() * 0.05 + 0.02));
      const revenue = conversions * (Math.random() * 200 + 50);
      const cost = Math.floor(revenue * (Math.random() * 0.3 + 0.2));
      
      campaigns.push({
        id: `campaign_${i + 1}`,
        name: campaignNames[i % campaignNames.length],
        startDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        kols: Math.floor(Math.random() * 20) + 5,
        totalReach: reach,
        totalEngagement: engagement,
        totalClicks: clicks,
        totalConversions: conversions,
        totalRevenue: revenue,
        totalCost: cost,
        roi: ((revenue - cost) / cost) * 100,
        status: i === 0 ? 'active' : 'completed'
      });
    }
    
    return campaigns.sort((a, b) => b.roi - a.roi);
  }

  // 计算ROI
  async calculateROI(params: ROICalculationParams): Promise<ROICalculation> {
    const {
      investment,
      revenue = 0,
      additionalCosts = 0,
      timeframe = '30d'
    } = params;
    
    const totalCost = investment + additionalCosts;
    const profit = revenue - totalCost;
    const roi = totalCost > 0 ? (profit / totalCost) * 100 : 0;
    
    // 生成预测数据
    const projectedRevenue = revenue * (Math.random() * 0.5 + 1.2); // 20-70% growth
    const projectedROI = totalCost > 0 
      ? ((projectedRevenue - totalCost) / totalCost) * 100 
      : 0;
    
    return {
      totalInvestment: totalCost,
      totalRevenue: revenue,
      profit,
      roi,
      projectedRevenue,
      projectedROI,
      breakEvenPoint: totalCost > 0 ? Math.ceil(totalCost / (revenue / 30)) : 0, // days
      recommendations: [
        'Increase content frequency to boost engagement',
        'Target high-converting demographics',
        'Optimize posting times for maximum reach',
        'Collaborate with complementary brands'
      ]
    };
  }
}

export const kolService = new KOLServiceClass();
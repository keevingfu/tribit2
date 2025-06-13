// KOL相关类型定义

import { KOLTribit, KOLYouTubeVideo } from './database';

// KOL统计数据
export interface KOLStatistics {
  totalKOLs: number;
  totalPlatforms: number;
  totalRegions: number;
  totalVideos: number;
  totalViews: number;
  avgEngagementRate: number;
}

// KOL基本信息
export interface KOLProfile {
  id: string;
  name: string;
  account: string;
  platform: string;
  region: string;
  profileUrl: string;
  avatar?: string;
  followers: number;
  following: number;
  posts: number;
  engagementRate: number;
  avgViews: number;
  description?: string;
  categories?: string[];
  verified?: boolean;
}

// 粉丝增长数据
export interface FollowerGrowthData {
  date: string;
  followers: number;
  growth: number;
  growthRate: number;
}

// 内容表现数据
export interface ContentPerformanceData {
  date: string;
  posts: number;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagementRate: number;
}

// 平台分布数据
export interface PlatformDistribution {
  platform: string;
  count: number;
  percentage: number;
}

// TopKOL数据
export interface TopKOL {
  profile: KOLProfile;
  performance: {
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    avgEngagementRate: number;
    growthRate: number;
  };
  revenue?: number;
  rank?: number;
}

// KOL实体（用于搜索结果）
export interface KOL {
  id: string;
  name: string;
  account: string;
  platform: string;
  region: string;
  profileUrl: string;
  avatar?: string;
  followers: number;
  engagementRate: number;
  verified?: boolean;
}

// KOL详情
export interface KOLDetail extends KOLProfile {
  statistics: {
    totalVideos: number;
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    avgViewsPerVideo: number;
    avgEngagementRate: number;
  };
  recentVideos?: KOLYouTubeVideo[];
  tags?: string[];
  collaborationHistory?: CollaborationHistory[];
}

// 表现指标
export interface PerformanceMetrics {
  [key: string]: {
    views: number;
    engagement: number;
    engagementRate: number;
    growth: number;
  };
}

// 合作历史
export interface CollaborationHistory {
  id: string;
  kolId: string;
  brandName: string;
  campaignName: string;
  startDate: string;
  endDate: string;
  deliverables: number;
  compensation: number;
  performance: {
    reach: number;
    engagement: number;
    conversions: number;
    roi: number;
  };
  status: 'active' | 'completed';
}

// 活动表现数据
export interface CampaignPerformance {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  kols: number;
  totalReach: number;
  totalEngagement: number;
  totalClicks: number;
  totalConversions: number;
  totalRevenue: number;
  totalCost: number;
  roi: number;
  status: 'active' | 'completed';
}

// 时间范围类型
export type TimeRange = '7d' | '30d' | '90d' | '1y' | 'custom';

// 销售漏斗数据
export interface SalesFunnelData {
  stage: string;
  count: number;
  percentage: number;
  conversionRate?: string;
}

// 收入归因数据
export interface RevenueAttributionData {
  channel: string;
  revenue: number;
  percentage: number;
  conversions: number;
}

// 转化指标
export interface ConversionMetrics {
  totalClicks: number;
  totalConversions: number;
  conversionRate: number;
  totalRevenue: number;
  avgOrderValue: number;
  topProducts: Array<{
    name: string;
    conversions: number;
    revenue: number;
  }>;
}

// ROI计算参数
export interface ROICalculationParams {
  investment: number;
  revenue?: number;
  additionalCosts?: number;
  timeframe?: string;
}

// ROI计算结果
export interface ROICalculation {
  totalInvestment: number;
  totalRevenue: number;
  profit: number;
  roi: number;
  projectedRevenue: number;
  projectedROI: number;
  breakEvenPoint: number;
  recommendations: string[];
}

// 导出数据库类型
export type { KOLTribit, KOLYouTubeVideo } from './database';
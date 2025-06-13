/**
 * Advertisement Analytics Types
 */

export interface AdCampaign {
  id: number;
  name: string;
  platform: 'facebook' | 'google' | 'tiktok' | 'instagram' | 'youtube';
  status: 'active' | 'paused' | 'completed' | 'draft';
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number; // Click-through rate
  cpc: number; // Cost per click
  cpm: number; // Cost per mille (thousand impressions)
  roas: number; // Return on ad spend
  roi: number; // Return on investment
}

export interface AdMetrics {
  totalSpend: number;
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  averageCTR: number;
  averageCPC: number;
  averageCPM: number;
  averageROAS: number;
  averageROI: number;
}

export interface AdAudience {
  id: number;
  campaignId: number;
  ageGroup: string;
  gender: 'male' | 'female' | 'all';
  location: string;
  interests: string[];
  device: 'mobile' | 'desktop' | 'tablet' | 'all';
  impressions: number;
  clicks: number;
  conversions: number;
  spent: number;
}

export interface PlatformMetrics {
  platform: string;
  campaigns: number;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  avgCTR: number;
  avgCPC: number;
  avgROAS: number;
}

export interface CreativePerformance {
  id: number;
  campaignId: number;
  creativeName: string;
  creativeType: 'image' | 'video' | 'carousel' | 'text';
  impressions: number;
  clicks: number;
  conversions: number;
  engagement: number;
  ctr: number;
  conversionRate: number;
}

export interface DateRangeMetrics {
  date: string;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  roas: number;
}

export interface GeographicMetrics {
  country: string;
  region: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  ctr: number;
  conversionRate: number;
}

export interface DemographicBreakdown {
  category: string;
  value: string;
  impressions: number;
  clicks: number;
  conversions: number;
  percentage: number;
}

export interface AdFilters {
  dateRange?: {
    start: string;
    end: string;
  };
  platforms?: string[];
  status?: string[];
  search?: string;
}

export interface AdDashboardData {
  metrics: AdMetrics;
  campaigns: AdCampaign[];
  platformMetrics: PlatformMetrics[];
  dateRangeMetrics: DateRangeMetrics[];
  audienceInsights: {
    demographics: DemographicBreakdown[];
    geographic: GeographicMetrics[];
  };
  topCreatives: CreativePerformance[];
}
// Search Insights Types
export interface KeywordData {
  keyword: string;
  searchVolume: number;
  cpc: number;
  competition: 'low' | 'medium' | 'high';
  trend: number; // percentage change
  relatedKeywords?: string[];
}

export interface SearchTrend {
  date: string;
  volume: number;
  keyword: string;
}

export interface CPCAnalysis {
  keyword: string;
  avgCPC: number;
  minCPC: number;
  maxCPC: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  monthlyData: {
    month: string;
    cpc: number;
  }[];
}

// Consumer Voice Types
export interface UserNeed {
  category: string;
  frequency: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  examples: string[];
}

export interface SearchIntent {
  intent: 'informational' | 'navigational' | 'transactional' | 'commercial';
  percentage: number;
  keywords: string[];
}

export interface VoiceInsight {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
  actionItems: string[];
  confidence: number;
}

// Video Insights Types
export interface VideoData {
  id: string;
  title: string;
  platform: 'youtube' | 'tiktok' | 'instagram' | 'twitter';
  thumbnail: string;
  url: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagementRate: number;
  publishDate: string;
  creator: {
    name: string;
    avatar: string;
    followers: number;
  };
  tags: string[];
  duration: number; // in seconds
}

export interface PlatformMetrics {
  platform: string;
  totalViews: number;
  avgEngagement: number;
  topVideos: VideoData[];
  growthRate: number;
}

export interface EngagementMetrics {
  date: string;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  engagementRate: number;
}
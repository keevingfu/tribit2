// Private module types - can be imported by both client and server

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Private domain data types
export interface EDMCampaign {
  id: number;
  campaign_name: string;
  sent_date: string;
  total_sent: number;
  opens: number;
  clicks: number;
  conversions: number;
  open_rate: number;
  click_rate: number;
  conversion_rate: number;
  revenue: number;
}

export interface LinkedInMetrics {
  id: number;
  post_date: string;
  post_type: string;
  impressions: number;
  engagements: number;
  likes: number;
  comments: number;
  shares: number;
  engagement_rate: number;
  follower_count: number;
  follower_growth: number;
}

export interface ShopifyAnalytics {
  id: number;
  date: string;
  store_name: string;
  sessions: number;
  unique_visitors: number;
  page_views: number;
  add_to_carts: number;
  checkouts: number;
  purchases: number;
  conversion_rate: number;
  average_order_value: number;
  revenue: number;
}

export interface CustomerLifecycle {
  id: number;
  customer_segment: string;
  total_customers: number;
  new_customers: number;
  active_customers: number;
  at_risk_customers: number;
  churned_customers: number;
  retention_rate: number;
  lifetime_value: number;
}

export interface PrivateChannelStats {
  channel: string;
  total_reach: number;
  total_engagement: number;
  total_conversions: number;
  total_revenue: number;
  growth_rate: number;
}

export interface PrivateFilterParams extends PaginationParams {
  channel?: string;
  dateFrom?: string;
  dateTo?: string;
  segment?: string;
  campaign?: string;
}

// WhatsApp specific types
export interface WhatsAppCampaign {
  id: number;
  campaign_name: string;
  sent_date: string;
  total_sent: number;
  delivered: number;
  read: number;
  replied: number;
  delivery_rate: number;
  read_rate: number;
  reply_rate: number;
  conversions: number;
  revenue: number;
}

// Offline store types
export interface OfflineStore {
  id: number;
  store_name: string;
  location: string;
  date: string;
  foot_traffic: number;
  transactions: number;
  conversion_rate: number;
  average_basket_size: number;
  revenue: number;
  new_customers: number;
  returning_customers: number;
}

// Funnel analysis types
export interface FunnelStep {
  step_name: string;
  users: number;
  conversion_rate: number;
  drop_off_rate: number;
  average_time: number;
}

export interface FunnelAnalysis {
  funnel_name: string;
  date_range: string;
  total_users: number;
  completed_users: number;
  overall_conversion: number;
  steps: FunnelStep[];
}

// Trends types
export interface TrendData {
  date: string;
  channel: string;
  metric_name: string;
  metric_value: number;
  growth_rate: number;
  forecast_value?: number;
}

// Stats overview
export interface PrivateStatsOverview {
  totalRevenue: number;
  totalCustomers: number;
  totalEngagement: number;
  totalConversions: number;
  revenueGrowth: number;
  customerGrowth: number;
  engagementGrowth: number;
  conversionGrowth: number;
}
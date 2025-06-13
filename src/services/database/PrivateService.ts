import { BaseService } from './BaseService';

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

export class PrivateService extends BaseService<any> {
  constructor() {
    super('selkoc_account'); // Using existing table as base
  }

  /**
   * Get EDM campaign analytics
   */
  async getEDMCampaigns(params: PrivateFilterParams): Promise<PaginatedResponse<EDMCampaign>> {
    // Mock data for EDM campaigns
    const mockCampaigns: EDMCampaign[] = [
      {
        id: 1,
        campaign_name: 'Holiday Sale 2024',
        sent_date: '2024-12-15',
        total_sent: 10000,
        opens: 3500,
        clicks: 1200,
        conversions: 150,
        open_rate: 35.0,
        click_rate: 12.0,
        conversion_rate: 1.5,
        revenue: 45000
      },
      {
        id: 2,
        campaign_name: 'New Product Launch',
        sent_date: '2024-12-10',
        total_sent: 8000,
        opens: 3200,
        clicks: 960,
        conversions: 120,
        open_rate: 40.0,
        click_rate: 12.0,
        conversion_rate: 1.5,
        revenue: 36000
      },
      {
        id: 3,
        campaign_name: 'Black Friday Special',
        sent_date: '2024-11-24',
        total_sent: 15000,
        opens: 6000,
        clicks: 2100,
        conversions: 315,
        open_rate: 40.0,
        click_rate: 14.0,
        conversion_rate: 2.1,
        revenue: 94500
      },
      {
        id: 4,
        campaign_name: 'Customer Retention',
        sent_date: '2024-11-15',
        total_sent: 5000,
        opens: 2250,
        clicks: 750,
        conversions: 100,
        open_rate: 45.0,
        click_rate: 15.0,
        conversion_rate: 2.0,
        revenue: 25000
      },
      {
        id: 5,
        campaign_name: 'Weekly Newsletter',
        sent_date: '2024-12-20',
        total_sent: 12000,
        opens: 4200,
        clicks: 840,
        conversions: 84,
        open_rate: 35.0,
        click_rate: 7.0,
        conversion_rate: 0.7,
        revenue: 16800
      }
    ];

    // Apply date filters if provided
    let filteredCampaigns = mockCampaigns;
    if (params.dateFrom) {
      filteredCampaigns = filteredCampaigns.filter(c => c.sent_date >= params.dateFrom!);
    }
    if (params.dateTo) {
      filteredCampaigns = filteredCampaigns.filter(c => c.sent_date <= params.dateTo!);
    }

    // Apply pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const offset = (page - 1) * limit;
    const paginatedData = filteredCampaigns.slice(offset, offset + limit);

    return {
      data: paginatedData,
      pagination: {
        page,
        limit,
        total: filteredCampaigns.length,
        totalPages: Math.ceil(filteredCampaigns.length / limit)
      }
    };
  }

  /**
   * Get LinkedIn performance metrics
   */
  async getLinkedInMetrics(params: PrivateFilterParams): Promise<PaginatedResponse<LinkedInMetrics>> {
    // Mock data for LinkedIn metrics
    const mockMetrics: LinkedInMetrics[] = [
      {
        id: 1,
        post_date: '2024-12-20',
        post_type: 'article',
        impressions: 5000,
        engagements: 350,
        likes: 200,
        comments: 50,
        shares: 100,
        engagement_rate: 7.0,
        follower_count: 15000,
        follower_growth: 150
      },
      {
        id: 2,
        post_date: '2024-12-18',
        post_type: 'video',
        impressions: 8000,
        engagements: 640,
        likes: 400,
        comments: 80,
        shares: 160,
        engagement_rate: 8.0,
        follower_count: 14850,
        follower_growth: 120
      },
      {
        id: 3,
        post_date: '2024-12-15',
        post_type: 'image',
        impressions: 3500,
        engagements: 210,
        likes: 150,
        comments: 30,
        shares: 30,
        engagement_rate: 6.0,
        follower_count: 14730,
        follower_growth: 80
      },
      {
        id: 4,
        post_date: '2024-12-12',
        post_type: 'poll',
        impressions: 6000,
        engagements: 480,
        likes: 300,
        comments: 120,
        shares: 60,
        engagement_rate: 8.0,
        follower_count: 14650,
        follower_growth: 100
      }
    ];

    // Apply filters and pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const offset = (page - 1) * limit;
    const paginatedData = mockMetrics.slice(offset, offset + limit);

    return {
      data: paginatedData,
      pagination: {
        page,
        limit,
        total: mockMetrics.length,
        totalPages: Math.ceil(mockMetrics.length / limit)
      }
    };
  }

  /**
   * Get Shopify store analytics
   */
  async getShopifyAnalytics(params: PrivateFilterParams): Promise<PaginatedResponse<ShopifyAnalytics>> {
    // Mock data for Shopify analytics
    const mockAnalytics: ShopifyAnalytics[] = [
      {
        id: 1,
        date: '2024-12-20',
        store_name: 'Main Store',
        sessions: 2500,
        unique_visitors: 2000,
        page_views: 7500,
        add_to_carts: 300,
        checkouts: 150,
        purchases: 120,
        conversion_rate: 4.8,
        average_order_value: 150,
        revenue: 18000
      },
      {
        id: 2,
        date: '2024-12-19',
        store_name: 'Main Store',
        sessions: 2300,
        unique_visitors: 1840,
        page_views: 6900,
        add_to_carts: 276,
        checkouts: 138,
        purchases: 110,
        conversion_rate: 4.78,
        average_order_value: 145,
        revenue: 15950
      },
      {
        id: 3,
        date: '2024-12-18',
        store_name: 'Main Store',
        sessions: 2800,
        unique_visitors: 2240,
        page_views: 8400,
        add_to_carts: 350,
        checkouts: 175,
        purchases: 140,
        conversion_rate: 5.0,
        average_order_value: 160,
        revenue: 22400
      }
    ];

    // Apply filters and pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const offset = (page - 1) * limit;
    const paginatedData = mockAnalytics.slice(offset, offset + limit);

    return {
      data: paginatedData,
      pagination: {
        page,
        limit,
        total: mockAnalytics.length,
        totalPages: Math.ceil(mockAnalytics.length / limit)
      }
    };
  }

  /**
   * Get customer lifecycle analytics
   */
  async getCustomerLifecycle(params: PrivateFilterParams): Promise<CustomerLifecycle[]> {
    // Mock data for customer lifecycle
    return [
      {
        id: 1,
        customer_segment: 'New Customers',
        total_customers: 2500,
        new_customers: 2500,
        active_customers: 2000,
        at_risk_customers: 300,
        churned_customers: 200,
        retention_rate: 92.0,
        lifetime_value: 500
      },
      {
        id: 2,
        customer_segment: 'Active Customers',
        total_customers: 8000,
        new_customers: 0,
        active_customers: 8000,
        at_risk_customers: 500,
        churned_customers: 100,
        retention_rate: 98.75,
        lifetime_value: 1200
      },
      {
        id: 3,
        customer_segment: 'VIP Customers',
        total_customers: 1500,
        new_customers: 50,
        active_customers: 1450,
        at_risk_customers: 30,
        churned_customers: 20,
        retention_rate: 98.67,
        lifetime_value: 3500
      },
      {
        id: 4,
        customer_segment: 'At Risk',
        total_customers: 1000,
        new_customers: 0,
        active_customers: 400,
        at_risk_customers: 600,
        churned_customers: 0,
        retention_rate: 40.0,
        lifetime_value: 800
      }
    ];
  }

  /**
   * Get channel statistics overview
   */
  async getChannelStats(): Promise<PrivateChannelStats[]> {
    return [
      {
        channel: 'EDM',
        total_reach: 50000,
        total_engagement: 13710,
        total_conversions: 769,
        total_revenue: 217300,
        growth_rate: 15.5
      },
      {
        channel: 'LinkedIn',
        total_reach: 22500,
        total_engagement: 1680,
        total_conversions: 120,
        total_revenue: 36000,
        growth_rate: 22.3
      },
      {
        channel: 'Shopify',
        total_reach: 10000,
        total_engagement: 3500,
        total_conversions: 370,
        total_revenue: 56350,
        growth_rate: 18.7
      },
      {
        channel: 'WeChat',
        total_reach: 15000,
        total_engagement: 4500,
        total_conversions: 225,
        total_revenue: 45000,
        growth_rate: 25.0
      }
    ];
  }

  /**
   * Get email campaign performance trends
   */
  async getEmailTrends(params: { days?: number } = {}): Promise<any[]> {
    const days = params.days || 30;
    const trends = [];
    const now = new Date();

    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      trends.push({
        date: date.toISOString().split('T')[0],
        sent: Math.floor(Math.random() * 5000) + 3000,
        opens: Math.floor(Math.random() * 2000) + 1000,
        clicks: Math.floor(Math.random() * 800) + 200,
        conversions: Math.floor(Math.random() * 100) + 20
      });
    }

    return trends;
  }

  /**
   * Get conversion funnel data
   */
  async getConversionFunnel(): Promise<any[]> {
    return [
      { stage: 'Website Visits', value: 10000, percentage: 100 },
      { stage: 'Product Views', value: 6500, percentage: 65 },
      { stage: 'Add to Cart', value: 2500, percentage: 25 },
      { stage: 'Checkout', value: 1500, percentage: 15 },
      { stage: 'Purchase', value: 1200, percentage: 12 },
      { stage: 'Repeat Purchase', value: 360, percentage: 3.6 }
    ];
  }
}

// Export singleton instance
export const privateService = new PrivateService();
import { 
  KOLStatistics, 
  PlatformDistribution, 
  TopKOL, 
  KOL,
  KOLDetail,
  PerformanceMetrics,
  CollaborationHistory,
  CampaignPerformance,
  FollowerGrowthData,
  ContentPerformanceData,
  TimeRange,
  SalesFunnelData,
  RevenueAttributionData,
  ConversionMetrics,
  ROICalculation,
  ROICalculationParams
} from '@/types/kol';

class KOLClientService {
  private baseUrl = '/api/kol';

  async getStatistics(): Promise<KOLStatistics> {
    const response = await fetch(`${this.baseUrl}/statistics`);
    if (!response.ok) throw new Error('Failed to fetch statistics');
    return response.json();
  }

  async getPlatformDistribution(): Promise<PlatformDistribution[]> {
    const response = await fetch(`${this.baseUrl}/platform-distribution`);
    if (!response.ok) throw new Error('Failed to fetch platform distribution');
    return response.json();
  }

  async getTopKOLs(limit: number = 10): Promise<TopKOL[]> {
    const response = await fetch(`${this.baseUrl}/top-kols?limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch top KOLs');
    return response.json();
  }

  async getKOLById(id: string): Promise<KOL | null> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    if (!response.ok) return null;
    return response.json();
  }

  async getKOLDetail(id: string): Promise<KOLDetail | null> {
    const response = await fetch(`${this.baseUrl}/${id}/detail`);
    if (!response.ok) return null;
    return response.json();
  }

  async getPerformanceMetrics(kolId: string): Promise<PerformanceMetrics> {
    const response = await fetch(`${this.baseUrl}/${kolId}/performance`);
    if (!response.ok) throw new Error('Failed to fetch performance metrics');
    return response.json();
  }

  async getCollaborationHistory(kolId: string): Promise<CollaborationHistory[]> {
    const response = await fetch(`${this.baseUrl}/${kolId}/collaborations`);
    if (!response.ok) throw new Error('Failed to fetch collaboration history');
    return response.json();
  }

  async getCampaignPerformance(limit: number = 5): Promise<CampaignPerformance[]> {
    const response = await fetch(`${this.baseUrl}/campaign-performance?limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch campaign performance');
    return response.json();
  }

  async searchKOLs(query: string): Promise<KOL[]> {
    const response = await fetch(`${this.baseUrl}/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to search KOLs');
    return response.json();
  }

  async getFollowerGrowth(kolId: string, timeRange: TimeRange): Promise<FollowerGrowthData[]> {
    const response = await fetch(`${this.baseUrl}/${kolId}/follower-growth?timeRange=${timeRange}`);
    if (!response.ok) throw new Error('Failed to fetch follower growth');
    return response.json();
  }

  async getContentPerformance(kolId: string, timeRange: TimeRange): Promise<ContentPerformanceData[]> {
    const response = await fetch(`${this.baseUrl}/${kolId}/content-performance?timeRange=${timeRange}`);
    if (!response.ok) throw new Error('Failed to fetch content performance');
    return response.json();
  }

  async getSalesFunnelData(kolId: string): Promise<SalesFunnelData[]> {
    const response = await fetch(`${this.baseUrl}/${kolId}/sales-funnel`);
    if (!response.ok) throw new Error('Failed to fetch sales funnel data');
    return response.json();
  }

  async getRevenueAttribution(kolId: string): Promise<RevenueAttributionData[]> {
    const response = await fetch(`${this.baseUrl}/${kolId}/revenue-attribution`);
    if (!response.ok) throw new Error('Failed to fetch revenue attribution');
    return response.json();
  }

  async getConversionMetrics(timeRange: TimeRange): Promise<ConversionMetrics> {
    const response = await fetch(`${this.baseUrl}/conversion-metrics?timeRange=${timeRange}`);
    if (!response.ok) throw new Error('Failed to fetch conversion metrics');
    return response.json();
  }

  async calculateROI(params: ROICalculationParams): Promise<ROICalculation> {
    const response = await fetch(`${this.baseUrl}/calculate-roi`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });
    if (!response.ok) throw new Error('Failed to calculate ROI');
    return response.json();
  }
}

export const kolClientService = new KOLClientService();
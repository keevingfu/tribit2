import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  AdCampaign,
  AdMetrics,
  PlatformMetrics,
  DateRangeMetrics,
  AdAudience,
  CreativePerformance,
  GeographicMetrics,
  DemographicBreakdown,
  AdFilters,
} from '@/types/ads';

interface CampaignsResponse {
  success: boolean;
  data: AdCampaign[];
  count: number;
}

interface MetricsResponse {
  success: boolean;
  data: AdMetrics;
}

interface PlatformsResponse {
  success: boolean;
  data: PlatformMetrics[];
}

interface PerformanceResponse {
  success: boolean;
  data: DateRangeMetrics[];
}

interface AudienceResponse {
  success: boolean;
  data: {
    audience: AdAudience[];
    demographics: {
      age: DemographicBreakdown[];
      gender: DemographicBreakdown[];
      device: DemographicBreakdown[];
    };
    geographic: GeographicMetrics[];
  };
}

interface CreativesResponse {
  success: boolean;
  data: CreativePerformance[];
}

export const adsApi = createApi({
  reducerPath: 'adsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/ads' }),
  tagTypes: ['Campaigns', 'Metrics', 'Platforms', 'Performance', 'Audience', 'Creatives'],
  endpoints: (builder) => ({
    // Get campaigns with filters
    getCampaigns: builder.query<CampaignsResponse, AdFilters>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters.platforms?.length) {
          params.append('platforms', filters.platforms.join(','));
        }
        if (filters.status?.length) {
          params.append('status', filters.status.join(','));
        }
        if (filters.dateRange?.start) {
          params.append('startDate', filters.dateRange.start);
        }
        if (filters.dateRange?.end) {
          params.append('endDate', filters.dateRange.end);
        }
        return `?${params.toString()}`;
      },
      providesTags: ['Campaigns'],
    }),

    // Get overall metrics
    getMetrics: builder.query<MetricsResponse, { startDate?: string; endDate?: string } | void>({
      query: (params) => {
        if (!params) return '/metrics';
        const searchParams = new URLSearchParams();
        if (params.startDate) searchParams.append('startDate', params.startDate);
        if (params.endDate) searchParams.append('endDate', params.endDate);
        return `/metrics?${searchParams.toString()}`;
      },
      providesTags: ['Metrics'],
    }),

    // Get platform metrics
    getPlatformMetrics: builder.query<PlatformsResponse, void>({
      query: () => '/platforms',
      providesTags: ['Platforms'],
    }),

    // Get performance over time
    getPerformance: builder.query<PerformanceResponse, { days?: number }>({
      query: ({ days = 30 }) => `/performance?days=${days}`,
      providesTags: ['Performance'],
    }),

    // Get audience insights
    getAudienceInsights: builder.query<AudienceResponse, { campaignId?: number } | void>({
      query: (params) => {
        if (!params?.campaignId) return '/audience';
        return `/audience?campaignId=${params.campaignId}`;
      },
      providesTags: ['Audience'],
    }),

    // Get creative performance
    getCreativePerformance: builder.query<CreativesResponse, { limit?: number }>({
      query: ({ limit = 10 }) => `/creatives?limit=${limit}`,
      providesTags: ['Creatives'],
    }),
  }),
});

export const {
  useGetCampaignsQuery,
  useGetMetricsQuery,
  useGetPlatformMetricsQuery,
  useGetPerformanceQuery,
  useGetAudienceInsightsQuery,
  useGetCreativePerformanceQuery,
} = adsApi;
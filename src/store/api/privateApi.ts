import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../index';
import type { 
  EDMCampaign, 
  LinkedInMetrics, 
  ShopifyAnalytics, 
  CustomerLifecycle,
  PrivateChannelStats,
  PaginatedResponse,
  WhatsAppCampaign,
  OfflineStore,
  FunnelAnalysis,
  TrendData,
  PrivateStatsOverview
} from '@/types/private';

export interface PrivateQueryParams {
  page?: number;
  limit?: number;
  channel?: 'EDM' | 'LinkedIn' | 'Shopify' | 'WeChat' | 'WhatsApp';
  dateFrom?: string;
  dateTo?: string;
  segment?: string;
  type?: 'edm' | 'linkedin' | 'shopify' | 'lifecycle' | 'stats';
}

export interface TrendsQueryParams {
  days?: number;
}

export const privateApi = createApi({
  reducerPath: 'privateApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/private',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Private', 'EDM', 'LinkedIn', 'Shopify', 'Lifecycle'],
  endpoints: (builder) => ({
    // Get channel statistics overview
    getChannelStats: builder.query<{ data: PrivateChannelStats[] }, void>({
      query: () => ({
        url: '',
        params: { type: 'stats' }
      }),
      providesTags: ['Private']
    }),

    // Get EDM campaigns
    getEDMCampaigns: builder.query<PaginatedResponse<EDMCampaign>, PrivateQueryParams>({
      query: (params) => ({
        url: '',
        params: { ...params, type: 'edm' }
      }),
      providesTags: ['EDM']
    }),

    // Get LinkedIn metrics
    getLinkedInMetrics: builder.query<PaginatedResponse<LinkedInMetrics>, PrivateQueryParams>({
      query: (params) => ({
        url: '',
        params: { ...params, type: 'linkedin' }
      }),
      providesTags: ['LinkedIn']
    }),

    // Get Shopify analytics
    getShopifyAnalytics: builder.query<PaginatedResponse<ShopifyAnalytics>, PrivateQueryParams>({
      query: (params) => ({
        url: '',
        params: { ...params, type: 'shopify' }
      }),
      providesTags: ['Shopify']
    }),

    // Get customer lifecycle
    getCustomerLifecycle: builder.query<{ data: CustomerLifecycle[] }, PrivateQueryParams>({
      query: (params) => ({
        url: '',
        params: { ...params, type: 'lifecycle' }
      }),
      providesTags: ['Lifecycle']
    }),

    // Get email trends
    getEmailTrends: builder.query<{ data: any[] }, TrendsQueryParams>({
      query: (params) => ({
        url: '/trends',
        params
      }),
      providesTags: ['Private']
    }),

    // Get conversion funnel
    getConversionFunnel: builder.query<{ data: any[] }, void>({
      query: () => '/funnel',
      providesTags: ['Private']
    })
  })
});

export const {
  useGetChannelStatsQuery,
  useGetEDMCampaignsQuery,
  useGetLinkedInMetricsQuery,
  useGetShopifyAnalyticsQuery,
  useGetCustomerLifecycleQuery,
  useGetEmailTrendsQuery,
  useGetConversionFunnelQuery
} = privateApi;
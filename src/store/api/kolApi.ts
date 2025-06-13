import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../index';

export interface KOL {
  'No.': number;
  Region: string;
  Platform: string;
  kol_account: string;
  kol_url: string;
}

export interface KOLListResponse {
  data: KOL[];
  success: boolean;
  message?: string;
  timestamp: string;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface KOLDetailResponse {
  'No.': number;
  Region: string;
  Platform: string;
  kol_account: string;
  kol_url: string;
  bio?: string;
  recentPosts?: Array<{
    id: string;
    content: string;
    likes: number;
    comments: number;
    shares: number;
    publishedAt: string;
  }>;
  performance?: {
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
    roi: number;
  };
  audienceDemographics?: {
    age: Record<string, number>;
    gender: Record<string, number>;
    location: Record<string, number>;
  };
}

export const kolApi = createApi({
  reducerPath: 'kolApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/kol',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['KOL', 'KOLDetail'],
  endpoints: (builder) => ({
    // Get KOL list
    getKOLs: builder.query<KOLListResponse, {
      page?: number;
      pageSize?: number;
      platform?: string;
      region?: string;
      q?: string;
      search?: string;
    }>({
      query: (params) => ({
        url: '/',
        params: {
          page: params.page || 1,
          pageSize: params.pageSize || 20,
          ...params
        },
      }),
      providesTags: ['KOL'],
    }),

    // Get KOL detail
    getKOLDetail: builder.query<KOLDetailResponse, string>({
      query: (id) => `/detail/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'KOLDetail', id }],
    }),

    // Get KOL performance
    getKOLPerformance: builder.query<{
      daily: Array<{ date: string; impressions: number; conversions: number }>;
      monthly: Array<{ month: string; revenue: number; roi: number }>;
    }, { id: string; startDate: string; endDate: string }>({
      query: ({ id, startDate, endDate }) => ({
        url: `/performance/${id}`,
        params: { startDate, endDate },
      }),
    }),

    // Get conversion data
    getConversionData: builder.query<{
      funnel: Array<{ stage: string; count: number; rate: number }>;
      attribution: Array<{ channel: string; conversions: number; revenue: number }>;
      topProducts: Array<{ product: string; conversions: number; revenue: number }>;
    }, { startDate: string; endDate: string }>({
      query: ({ startDate, endDate }) => ({
        url: '/conversion',
        params: { startDate, endDate },
      }),
    }),

    // Search KOLs
    searchKOLs: builder.query<KOL[], string>({
      query: (keyword) => ({
        url: '/search',
        params: { keyword },
      }),
    }),

    // Get KOL statistics
    getKOLStatistics: builder.query<{
      totalKOLs: number;
      totalPlatforms: number;
      totalRegions: number;
      totalVideos: number;
      totalVideoViews: number;
    }, void>({
      query: () => '/statistics',
    }),

    // Get platform distribution
    getPlatformDistribution: builder.query<Array<{
      platform: string;
      count: number;
    }>, void>({
      query: () => '/platform-distribution',
    }),

    // Get top KOLs
    getTopKOLs: builder.query<Array<{
      channelName?: string;
      Youtuber?: string;
      videoCount: number;
      totalViews: number;
      avgViews: number;
      totalLikes: number;
      totalComments: number;
    }>, { limit?: number }>({
      query: (params) => ({
        url: '/top-kols',
        params,
      }),
    }),
  }),
});

export const {
  useGetKOLsQuery,
  useGetKOLDetailQuery,
  useGetKOLPerformanceQuery,
  useGetConversionDataQuery,
  useSearchKOLsQuery,
  useGetKOLStatisticsQuery,
  useGetPlatformDistributionQuery,
  useGetTopKOLsQuery,
} = kolApi;
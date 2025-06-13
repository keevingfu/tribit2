import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../index';
import { InsightSearch } from '@/types/database';

export interface SearchInsightResponse {
  data: InsightSearch[];
  total: number;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
  statistics?: {
    byRegion: Array<{ region: string; total_volume: number; avg_cpc: number }>;
    byLanguage: Array<{ language: string; keyword_count: number }>;
    topModifiers: Array<{ modifier: string; count: number; avg_volume: number }>;
  };
}

export interface ConsumerVoiceResponse {
  data: {
    id: string;
    platform: string;
    content: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    engagement: number;
    date: string;
  }[];
  total: number;
}

export interface VideoInsightResponse {
  data: {
    id: string;
    title: string;
    platform: 'youtube' | 'tiktok' | 'instagram';
    views: number;
    likes: number;
    comments: number;
    engagementRate: number;
    thumbnail: string;
    url: string;
  }[];
  total: number;
}

export const insightApi = createApi({
  reducerPath: 'insightApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/insight',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['SearchInsight', 'ConsumerVoice', 'VideoInsight'],
  endpoints: (builder) => ({
    // Search Insights
    getSearchInsights: builder.query<SearchInsightResponse, { 
      page?: number; 
      pageSize?: number; 
      keyword?: string;
      region?: string;
      language?: string;
      minVolume?: number;
      maxVolume?: number;
      minCPC?: number;
      maxCPC?: number;
    }>({
      query: (params) => ({
        url: '/search',
        params: {
          page: params.page || 1,
          pageSize: params.pageSize || 20,
          ...params
        },
      }),
      providesTags: ['SearchInsight'],
    }),

    // Consumer Voice
    getConsumerVoices: builder.query<ConsumerVoiceResponse, { 
      page?: number; 
      limit?: number; 
      platform?: string;
      sentiment?: string;
      startDate?: string;
      endDate?: string;
    }>({
      query: (params) => ({
        url: '/consumer-voice',
        params,
      }),
      providesTags: ['ConsumerVoice'],
    }),

    // Video Insights
    getVideoInsights: builder.query<VideoInsightResponse, {
      page?: number;
      limit?: number;
      platform?: string;
      sortBy?: 'views' | 'engagement' | 'recent';
    }>({
      query: (params) => ({
        url: '/videos',
        params,
      }),
      providesTags: ['VideoInsight'],
    }),

    // Viral Analysis
    getViralAnalysis: builder.query<{
      trends: Array<{ date: string; value: number }>;
      factors: Array<{ factor: string; impact: number }>;
      predictions: Array<{ content: string; probability: number }>;
    }, { timeRange: string }>({
      query: ({ timeRange }) => ({
        url: '/viral-analysis',
        params: { timeRange },
      }),
    }),
  }),
});

export const {
  useGetSearchInsightsQuery,
  useGetConsumerVoicesQuery,
  useGetVideoInsightsQuery,
  useGetViralAnalysisQuery,
} = insightApi;
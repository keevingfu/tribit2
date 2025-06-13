import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

interface SearchInsight {
  id: string;
  keyword: string;
  searchVolume: number;
  trend: 'up' | 'down' | 'stable';
  cpc: number;
  competition: 'low' | 'medium' | 'high';
}

interface ConsumerVoice {
  id: string;
  platform: string;
  content: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  engagement: number;
  date: string;
}

interface VideoInsight {
  id: string;
  title: string;
  platform: 'youtube' | 'tiktok' | 'instagram';
  views: number;
  likes: number;
  comments: number;
  engagementRate: number;
  thumbnail: string;
  url: string;
}

interface InsightState {
  searchInsights: SearchInsight[];
  consumerVoices: ConsumerVoice[];
  videoInsights: VideoInsight[];
  filters: {
    dateRange: { start: string; end: string };
    platform: string[];
    sentiment: string[];
  };
  loading: boolean;
  error: string | null;
}

const initialState: InsightState = {
  searchInsights: [],
  consumerVoices: [],
  videoInsights: [],
  filters: {
    dateRange: { start: '', end: '' },
    platform: [],
    sentiment: [],
  },
  loading: false,
  error: null,
};

const insightSlice = createSlice({
  name: 'insight',
  initialState,
  reducers: {
    setSearchInsights: (state, action: PayloadAction<SearchInsight[]>) => {
      state.searchInsights = action.payload;
    },
    setConsumerVoices: (state, action: PayloadAction<ConsumerVoice[]>) => {
      state.consumerVoices = action.payload;
    },
    setVideoInsights: (state, action: PayloadAction<VideoInsight[]>) => {
      state.videoInsights = action.payload;
    },
    updateFilters: (state, action: PayloadAction<Partial<InsightState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearInsightData: (state) => {
      state.searchInsights = [];
      state.consumerVoices = [];
      state.videoInsights = [];
      state.error = null;
    },
  },
});

export const {
  setSearchInsights,
  setConsumerVoices,
  setVideoInsights,
  updateFilters,
  setLoading,
  setError,
  clearInsightData,
} = insightSlice.actions;

// Selectors
export const selectSearchInsights = (state: RootState) => state.insight.searchInsights;
export const selectConsumerVoices = (state: RootState) => state.insight.consumerVoices;
export const selectVideoInsights = (state: RootState) => state.insight.videoInsights;
export const selectInsightFilters = (state: RootState) => state.insight.filters;
export const selectInsightLoading = (state: RootState) => state.insight.loading;
export const selectInsightError = (state: RootState) => state.insight.error;

export default insightSlice.reducer;
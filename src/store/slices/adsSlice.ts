import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

interface AdCampaign {
  id: string;
  name: string;
  platform: 'google' | 'facebook' | 'instagram' | 'tiktok' | 'youtube';
  status: 'active' | 'paused' | 'completed' | 'draft';
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  objectives: string[];
}

interface AdPerformance {
  campaignId: string;
  impressions: number;
  clicks: number;
  ctr: number;
  conversions: number;
  conversionRate: number;
  cpc: number;
  cpa: number;
  roas: number;
}

interface Audience {
  id: string;
  name: string;
  size: number;
  demographics: {
    age: { min: number; max: number };
    gender: 'all' | 'male' | 'female';
    location: string[];
    interests: string[];
  };
  performance: {
    engagementRate: number;
    conversionRate: number;
  };
}

interface AdsState {
  campaigns: AdCampaign[];
  performances: AdPerformance[];
  audiences: Audience[];
  selectedCampaign: AdCampaign | null;
  optimization: {
    recommendations: string[];
    score: number;
  };
  filters: {
    platform: string[];
    status: string[];
    dateRange: { start: string; end: string };
  };
  loading: boolean;
  error: string | null;
}

const initialState: AdsState = {
  campaigns: [],
  performances: [],
  audiences: [],
  selectedCampaign: null,
  optimization: {
    recommendations: [],
    score: 0,
  },
  filters: {
    platform: [],
    status: [],
    dateRange: { start: '', end: '' },
  },
  loading: false,
  error: null,
};

const adsSlice = createSlice({
  name: 'ads',
  initialState,
  reducers: {
    setCampaigns: (state, action: PayloadAction<AdCampaign[]>) => {
      state.campaigns = action.payload;
    },
    setPerformances: (state, action: PayloadAction<AdPerformance[]>) => {
      state.performances = action.payload;
    },
    setAudiences: (state, action: PayloadAction<Audience[]>) => {
      state.audiences = action.payload;
    },
    setSelectedCampaign: (state, action: PayloadAction<AdCampaign | null>) => {
      state.selectedCampaign = action.payload;
    },
    setOptimization: (state, action: PayloadAction<AdsState['optimization']>) => {
      state.optimization = action.payload;
    },
    updateAdsFilters: (state, action: PayloadAction<Partial<AdsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setAdsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setAdsError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearAdsData: (state) => {
      state.campaigns = [];
      state.performances = [];
      state.audiences = [];
      state.selectedCampaign = null;
      state.error = null;
    },
  },
});

export const {
  setCampaigns,
  setPerformances,
  setAudiences,
  setSelectedCampaign,
  setOptimization,
  updateAdsFilters,
  setAdsLoading,
  setAdsError,
  clearAdsData,
} = adsSlice.actions;

// Selectors
export const selectCampaigns = (state: RootState) => state.ads.campaigns;
export const selectAdPerformances = (state: RootState) => state.ads.performances;
export const selectAudiences = (state: RootState) => state.ads.audiences;
export const selectSelectedCampaign = (state: RootState) => state.ads.selectedCampaign;
export const selectOptimization = (state: RootState) => state.ads.optimization;
export const selectAdsFilters = (state: RootState) => state.ads.filters;
export const selectAdsLoading = (state: RootState) => state.ads.loading;
export const selectAdsError = (state: RootState) => state.ads.error;

export default adsSlice.reducer;
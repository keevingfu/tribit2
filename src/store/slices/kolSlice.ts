import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

interface KOL {
  id: string;
  name: string;
  platform: string;
  followers: number;
  engagementRate: number;
  avgViews: number;
  category: string;
  region: string;
  verified: boolean;
  profileImage: string;
}

interface KOLPerformance {
  kolId: string;
  period: string;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  roi: number;
}

interface KOLState {
  kols: KOL[];
  selectedKOL: KOL | null;
  performances: KOLPerformance[];
  filters: {
    platform: string[];
    category: string[];
    region: string[];
    minFollowers: number;
    maxFollowers: number;
  };
  sorting: {
    field: string;
    order: 'asc' | 'desc';
  };
  loading: boolean;
  error: string | null;
}

const initialState: KOLState = {
  kols: [],
  selectedKOL: null,
  performances: [],
  filters: {
    platform: [],
    category: [],
    region: [],
    minFollowers: 0,
    maxFollowers: 0,
  },
  sorting: {
    field: 'followers',
    order: 'desc',
  },
  loading: false,
  error: null,
};

const kolSlice = createSlice({
  name: 'kol',
  initialState,
  reducers: {
    setKOLs: (state, action: PayloadAction<KOL[]>) => {
      state.kols = action.payload;
    },
    setSelectedKOL: (state, action: PayloadAction<KOL | null>) => {
      state.selectedKOL = action.payload;
    },
    setPerformances: (state, action: PayloadAction<KOLPerformance[]>) => {
      state.performances = action.payload;
    },
    updateKOLFilters: (state, action: PayloadAction<Partial<KOLState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSorting: (state, action: PayloadAction<KOLState['sorting']>) => {
      state.sorting = action.payload;
    },
    setKOLLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setKOLError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearKOLData: (state) => {
      state.kols = [];
      state.selectedKOL = null;
      state.performances = [];
      state.error = null;
    },
  },
});

export const {
  setKOLs,
  setSelectedKOL,
  setPerformances,
  updateKOLFilters,
  setSorting,
  setKOLLoading,
  setKOLError,
  clearKOLData,
} = kolSlice.actions;

// Selectors
export const selectKOLs = (state: RootState) => state.kol.kols;
export const selectSelectedKOL = (state: RootState) => state.kol.selectedKOL;
export const selectKOLPerformances = (state: RootState) => state.kol.performances;
export const selectKOLFilters = (state: RootState) => state.kol.filters;
export const selectKOLSorting = (state: RootState) => state.kol.sorting;
export const selectKOLLoading = (state: RootState) => state.kol.loading;
export const selectKOLError = (state: RootState) => state.kol.error;

export default kolSlice.reducer;
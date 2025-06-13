import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

interface EDMCampaign {
  id: string;
  name: string;
  subject: string;
  sentCount: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
  unsubscribeRate: number;
  sentDate: string;
}

interface LinkedInPost {
  id: string;
  content: string;
  type: 'post' | 'article' | 'video';
  impressions: number;
  engagement: number;
  shares: number;
  comments: number;
  publishDate: string;
}

interface ShopifyData {
  orders: number;
  revenue: number;
  averageOrderValue: number;
  conversionRate: number;
  topProducts: {
    id: string;
    name: string;
    sales: number;
    revenue: number;
  }[];
}

interface WhatsAppCampaign {
  id: string;
  name: string;
  messagesSent: number;
  delivered: number;
  read: number;
  replied: number;
  conversionRate: number;
}

interface OfflineStore {
  id: string;
  name: string;
  location: string;
  footTraffic: number;
  sales: number;
  conversionRate: number;
  averageBasketSize: number;
}

interface PrivateState {
  edm: {
    campaigns: EDMCampaign[];
    subscribers: number;
    growthRate: number;
  };
  linkedin: {
    posts: LinkedInPost[];
    followers: number;
    engagementRate: number;
  };
  shopify: ShopifyData | null;
  whatsapp: {
    campaigns: WhatsAppCampaign[];
    contacts: number;
    activeConversations: number;
  };
  offlineStores: OfflineStore[];
  filters: {
    dateRange: { start: string; end: string };
    channel: string[];
  };
  loading: boolean;
  error: string | null;
}

const initialState: PrivateState = {
  edm: {
    campaigns: [],
    subscribers: 0,
    growthRate: 0,
  },
  linkedin: {
    posts: [],
    followers: 0,
    engagementRate: 0,
  },
  shopify: null,
  whatsapp: {
    campaigns: [],
    contacts: 0,
    activeConversations: 0,
  },
  offlineStores: [],
  filters: {
    dateRange: { start: '', end: '' },
    channel: [],
  },
  loading: false,
  error: null,
};

const privateSlice = createSlice({
  name: 'private',
  initialState,
  reducers: {
    setEDMData: (state, action: PayloadAction<PrivateState['edm']>) => {
      state.edm = action.payload;
    },
    setLinkedInData: (state, action: PayloadAction<PrivateState['linkedin']>) => {
      state.linkedin = action.payload;
    },
    setShopifyData: (state, action: PayloadAction<ShopifyData | null>) => {
      state.shopify = action.payload;
    },
    setWhatsAppData: (state, action: PayloadAction<PrivateState['whatsapp']>) => {
      state.whatsapp = action.payload;
    },
    setOfflineStores: (state, action: PayloadAction<OfflineStore[]>) => {
      state.offlineStores = action.payload;
    },
    updatePrivateFilters: (state, action: PayloadAction<Partial<PrivateState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPrivateLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setPrivateError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearPrivateData: (state) => {
      state.edm = initialState.edm;
      state.linkedin = initialState.linkedin;
      state.shopify = null;
      state.whatsapp = initialState.whatsapp;
      state.offlineStores = [];
      state.error = null;
    },
  },
});

export const {
  setEDMData,
  setLinkedInData,
  setShopifyData,
  setWhatsAppData,
  setOfflineStores,
  updatePrivateFilters,
  setPrivateLoading,
  setPrivateError,
  clearPrivateData,
} = privateSlice.actions;

// Selectors
export const selectEDMData = (state: RootState) => state.private.edm;
export const selectLinkedInData = (state: RootState) => state.private.linkedin;
export const selectShopifyData = (state: RootState) => state.private.shopify;
export const selectWhatsAppData = (state: RootState) => state.private.whatsapp;
export const selectOfflineStores = (state: RootState) => state.private.offlineStores;
export const selectPrivateFilters = (state: RootState) => state.private.filters;
export const selectPrivateLoading = (state: RootState) => state.private.loading;
export const selectPrivateError = (state: RootState) => state.private.error;

export default privateSlice.reducer;
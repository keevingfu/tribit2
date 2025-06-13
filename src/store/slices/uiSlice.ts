import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: number;
}

interface UIState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
  language: 'zh' | 'en';
  notifications: Notification[];
  modals: {
    [key: string]: boolean;
  };
  loading: {
    [key: string]: boolean;
  };
  preferences: {
    compactView: boolean;
    showTooltips: boolean;
    autoRefresh: boolean;
    refreshInterval: number; // in seconds
  };
}

const initialState: UIState = {
  sidebarOpen: true,
  sidebarCollapsed: false,
  theme: 'light',
  language: 'zh',
  notifications: [],
  modals: {},
  loading: {},
  preferences: {
    compactView: false,
    showTooltips: true,
    autoRefresh: false,
    refreshInterval: 300, // 5 minutes
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleSidebarCollapse: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<'zh' | 'en'>) => {
      state.language = action.payload;
    },
    addNotification: (state, action: PayloadAction<Omit<Notification, 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        timestamp: Date.now(),
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    openModal: (state, action: PayloadAction<string>) => {
      state.modals[action.payload] = true;
    },
    closeModal: (state, action: PayloadAction<string>) => {
      state.modals[action.payload] = false;
    },
    setLoading: (state, action: PayloadAction<{ key: string; value: boolean }>) => {
      state.loading[action.payload.key] = action.payload.value;
    },
    updatePreferences: (state, action: PayloadAction<Partial<UIState['preferences']>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleSidebarCollapse,
  setTheme,
  setLanguage,
  addNotification,
  removeNotification,
  clearNotifications,
  openModal,
  closeModal,
  setLoading,
  updatePreferences,
} = uiSlice.actions;

// Selectors
export const selectSidebarOpen = (state: RootState) => state.ui.sidebarOpen;
export const selectSidebarCollapsed = (state: RootState) => state.ui.sidebarCollapsed;
export const selectTheme = (state: RootState) => state.ui.theme;
export const selectLanguage = (state: RootState) => state.ui.language;
export const selectNotifications = (state: RootState) => state.ui.notifications;
export const selectModals = (state: RootState) => state.ui.modals;
export const selectUILoading = (state: RootState) => state.ui.loading;
export const selectPreferences = (state: RootState) => state.ui.preferences;

// Helper selectors
export const selectIsModalOpen = (modalKey: string) => (state: RootState) => 
  state.ui.modals[modalKey] || false;

export const selectIsLoading = (loadingKey: string) => (state: RootState) => 
  state.ui.loading[loadingKey] || false;

export default uiSlice.reducer;
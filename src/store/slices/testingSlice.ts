import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

interface TestCase {
  id: string;
  name: string;
  description: string;
  hypothesis: string;
  status: 'draft' | 'active' | 'completed' | 'paused';
  variants: TestVariant[];
  metrics: TestMetric[];
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
}

interface TestVariant {
  id: string;
  name: string;
  description: string;
  trafficAllocation: number; // percentage
  performance: {
    impressions: number;
    conversions: number;
    conversionRate: number;
  };
}

interface TestMetric {
  id: string;
  name: string;
  type: 'primary' | 'secondary';
  value: number;
  change: number; // percentage change
  significance: number; // statistical significance
}

interface TestingState {
  testCases: TestCase[];
  activeTest: TestCase | null;
  testResults: {
    [testId: string]: {
      winner?: string;
      confidence: number;
      insights: string[];
    };
  };
  filters: {
    status: string[];
    dateRange: { start: string; end: string };
  };
  loading: boolean;
  error: string | null;
}

const initialState: TestingState = {
  testCases: [],
  activeTest: null,
  testResults: {},
  filters: {
    status: [],
    dateRange: { start: '', end: '' },
  },
  loading: false,
  error: null,
};

const testingSlice = createSlice({
  name: 'testing',
  initialState,
  reducers: {
    setTestCases: (state, action: PayloadAction<TestCase[]>) => {
      state.testCases = action.payload;
    },
    setActiveTest: (state, action: PayloadAction<TestCase | null>) => {
      state.activeTest = action.payload;
    },
    addTestCase: (state, action: PayloadAction<TestCase>) => {
      state.testCases.push(action.payload);
    },
    updateTestCase: (state, action: PayloadAction<{ id: string; updates: Partial<TestCase> }>) => {
      const index = state.testCases.findIndex(test => test.id === action.payload.id);
      if (index !== -1) {
        state.testCases[index] = { ...state.testCases[index], ...action.payload.updates };
      }
    },
    setTestResults: (state, action: PayloadAction<{ testId: string; results: TestingState['testResults'][string] }>) => {
      state.testResults[action.payload.testId] = action.payload.results;
    },
    updateTestingFilters: (state, action: PayloadAction<Partial<TestingState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setTestingLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setTestingError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearTestingData: (state) => {
      state.testCases = [];
      state.activeTest = null;
      state.testResults = {};
      state.error = null;
    },
  },
});

export const {
  setTestCases,
  setActiveTest,
  addTestCase,
  updateTestCase,
  setTestResults,
  updateTestingFilters,
  setTestingLoading,
  setTestingError,
  clearTestingData,
} = testingSlice.actions;

// Selectors
export const selectTestCases = (state: RootState) => state.testing.testCases;
export const selectActiveTest = (state: RootState) => state.testing.activeTest;
export const selectTestResults = (state: RootState) => state.testing.testResults;
export const selectTestingFilters = (state: RootState) => state.testing.filters;
export const selectTestingLoading = (state: RootState) => state.testing.loading;
export const selectTestingError = (state: RootState) => state.testing.error;

export default testingSlice.reducer;
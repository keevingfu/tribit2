import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  setSearchInsights,
  setConsumerVoices,
  setVideoInsights,
  setLoading,
  setError,
  updateFilters,
  selectSearchInsights,
  selectConsumerVoices,
  selectVideoInsights,
  selectInsightFilters,
  selectInsightLoading,
  selectInsightError,
} from '../store/slices/insightSlice';
import {
  useGetSearchInsightsQuery,
  useGetConsumerVoicesQuery,
  useGetVideoInsightsQuery,
  useGetViralAnalysisQuery,
} from '../store/api/insightApi';

export const useInsightData = () => {
  const dispatch = useAppDispatch();
  
  const searchInsights = useAppSelector(selectSearchInsights);
  const consumerVoices = useAppSelector(selectConsumerVoices);
  const videoInsights = useAppSelector(selectVideoInsights);
  const filters = useAppSelector(selectInsightFilters);
  const loading = useAppSelector(selectInsightLoading);
  const error = useAppSelector(selectInsightError);

  // Fetch search insights
  const fetchSearchInsights = useCallback(async (keyword?: string, page = 1, limit = 20) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      // Using RTK Query hook in component would be better, but for demo:
      const response = await fetch(`/api/insight/search?page=${page}&limit=${limit}&keyword=${keyword || ''}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch search insights');
      }

      const data = await response.json();
      dispatch(setSearchInsights(data.data));
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'An error occurred'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // Fetch consumer voices
  const fetchConsumerVoices = useCallback(async (params: {
    platform?: string;
    sentiment?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });

      const response = await fetch(`/api/insight/consumer-voice?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch consumer voices');
      }

      const data = await response.json();
      dispatch(setConsumerVoices(data.data));
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'An error occurred'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // Fetch video insights
  const fetchVideoInsights = useCallback(async (params: {
    platform?: string;
    sortBy?: 'views' | 'engagement' | 'recent';
    page?: number;
    limit?: number;
  }) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });

      const response = await fetch(`/api/insight/videos?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch video insights');
      }

      const data = await response.json();
      dispatch(setVideoInsights(data.data));
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'An error occurred'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // Update filters
  const setFilters = useCallback((newFilters: Partial<typeof filters>) => {
    dispatch(updateFilters(newFilters));
  }, [dispatch]);

  // Clear all data
  const clearData = useCallback(() => {
    dispatch(setSearchInsights([]));
    dispatch(setConsumerVoices([]));
    dispatch(setVideoInsights([]));
    dispatch(setError(null));
  }, [dispatch]);

  return {
    // Data
    searchInsights,
    consumerVoices,
    videoInsights,
    filters,
    loading,
    error,
    
    // Actions
    fetchSearchInsights,
    fetchConsumerVoices,
    fetchVideoInsights,
    setFilters,
    clearData,
    
    // RTK Query hooks for direct use in components
    useGetSearchInsightsQuery,
    useGetConsumerVoicesQuery,
    useGetVideoInsightsQuery,
    useGetViralAnalysisQuery,
  };
};
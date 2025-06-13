import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  setKOLs,
  setSelectedKOL,
  setPerformances,
  updateKOLFilters,
  setSorting,
  setKOLLoading,
  setKOLError,
  clearKOLData,
  selectKOLs,
  selectSelectedKOL,
  selectKOLPerformances,
  selectKOLFilters,
  selectKOLSorting,
  selectKOLLoading,
  selectKOLError,
} from '../store/slices/kolSlice';
import {
  useGetKOLsQuery,
  useGetKOLDetailQuery,
  useGetKOLPerformanceQuery,
  useGetConversionDataQuery,
  useSearchKOLsQuery,
} from '../store/api/kolApi';

interface KOLFilterParams {
  platform?: string[];
  category?: string[];
  region?: string[];
  minFollowers?: number;
  maxFollowers?: number;
}

export const useKOLData = () => {
  const dispatch = useAppDispatch();
  
  const kols = useAppSelector(selectKOLs);
  const selectedKOL = useAppSelector(selectSelectedKOL);
  const performances = useAppSelector(selectKOLPerformances);
  const filters = useAppSelector(selectKOLFilters);
  const sorting = useAppSelector(selectKOLSorting);
  const loading = useAppSelector(selectKOLLoading);
  const error = useAppSelector(selectKOLError);

  // Fetch KOLs
  const fetchKOLs = useCallback(async (params?: {
    page?: number;
    limit?: number;
    filters?: KOLFilterParams;
    sortBy?: string;
    order?: 'asc' | 'desc';
  }) => {
    dispatch(setKOLLoading(true));
    dispatch(setKOLError(null));

    try {
      const queryParams = new URLSearchParams();
      
      // Add pagination
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      
      // Add filters
      if (params?.filters) {
        Object.entries(params.filters).forEach(([key, value]) => {
          if (value) {
            if (Array.isArray(value)) {
              queryParams.append(key, value.join(','));
            } else {
              queryParams.append(key, value.toString());
            }
          }
        });
      }
      
      // Add sorting
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params?.order) queryParams.append('order', params.order);

      const response = await fetch(`/api/kol?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch KOLs');
      }

      const data = await response.json();
      dispatch(setKOLs(data.data));
    } catch (error) {
      dispatch(setKOLError(error instanceof Error ? error.message : 'An error occurred'));
    } finally {
      dispatch(setKOLLoading(false));
    }
  }, [dispatch]);

  // Fetch KOL detail
  const fetchKOLDetail = useCallback(async (id: string) => {
    dispatch(setKOLLoading(true));
    dispatch(setKOLError(null));

    try {
      const response = await fetch(`/api/kol/detail/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch KOL detail');
      }

      const data = await response.json();
      dispatch(setSelectedKOL(data));
    } catch (error) {
      dispatch(setKOLError(error instanceof Error ? error.message : 'An error occurred'));
    } finally {
      dispatch(setKOLLoading(false));
    }
  }, [dispatch]);

  // Fetch KOL performance
  const fetchKOLPerformance = useCallback(async (id: string, startDate: string, endDate: string) => {
    dispatch(setKOLLoading(true));
    dispatch(setKOLError(null));

    try {
      const response = await fetch(`/api/kol/performance/${id}?startDate=${startDate}&endDate=${endDate}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch KOL performance');
      }

      const data = await response.json();
      dispatch(setPerformances(data));
    } catch (error) {
      dispatch(setKOLError(error instanceof Error ? error.message : 'An error occurred'));
    } finally {
      dispatch(setKOLLoading(false));
    }
  }, [dispatch]);

  // Update filters
  const setFilters = useCallback((newFilters: Partial<typeof filters>) => {
    dispatch(updateKOLFilters(newFilters));
  }, [dispatch]);

  // Update sorting
  const setSortingOptions = useCallback((field: string, order: 'asc' | 'desc') => {
    dispatch(setSorting({ field, order }));
  }, [dispatch]);

  // Select KOL
  const selectKOL = useCallback((kol: typeof selectedKOL) => {
    dispatch(setSelectedKOL(kol));
  }, [dispatch]);

  // Clear data
  const clearData = useCallback(() => {
    dispatch(clearKOLData());
  }, [dispatch]);

  return {
    // Data
    kols,
    selectedKOL,
    performances,
    filters,
    sorting,
    loading,
    error,
    
    // Actions
    fetchKOLs,
    fetchKOLDetail,
    fetchKOLPerformance,
    setFilters,
    setSortingOptions,
    selectKOL,
    clearData,
    
    // RTK Query hooks for direct use in components
    useGetKOLsQuery,
    useGetKOLDetailQuery,
    useGetKOLPerformanceQuery,
    useGetConversionDataQuery,
    useSearchKOLsQuery,
  };
};
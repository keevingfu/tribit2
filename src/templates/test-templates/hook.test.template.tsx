import { renderHook, act, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMyHook } from './useMyHook';

// Mock dependencies
jest.mock('@/services/api', () => ({
  fetchData: jest.fn(),
  postData: jest.fn(),
}));

import { fetchData, postData } from '@/services/api';

describe('useMyHook', () => {
  let queryClient: QueryClient;
  let store: any;

  // Test fixtures
  const mockData = {
    id: 1,
    name: 'Test Data',
    value: 100,
  };

  // Wrapper component for providers
  const createWrapper = (initialState = {}) => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    store = configureStore({
      reducer: {
        // Add your reducers here
        mySlice: (state = initialState) => state,
      },
    });

    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          {children}
        </Provider>
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (fetchData as jest.Mock).mockResolvedValue(mockData);
  });

  describe('Basic Functionality', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useMyHook(), {
        wrapper: createWrapper(),
      });

      expect(result.current.data).toBeUndefined();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should accept initial configuration', () => {
      const config = { autoFetch: true, defaultValue: 'test' };
      
      const { result } = renderHook(() => useMyHook(config), {
        wrapper: createWrapper(),
      });

      expect(result.current.value).toBe('test');
    });
  });

  describe('Data Fetching', () => {
    it('should fetch data on mount when autoFetch is true', async () => {
      const { result } = renderHook(() => useMyHook({ autoFetch: true }), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockData);
      expect(fetchData).toHaveBeenCalledTimes(1);
    });

    it('should handle fetch errors', async () => {
      const error = new Error('Fetch failed');
      (fetchData as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useMyHook({ autoFetch: true }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.error).toEqual(error);
      });

      expect(result.current.data).toBeUndefined();
      expect(result.current.isLoading).toBe(false);
    });

    it('should refetch data when requested', async () => {
      const { result } = renderHook(() => useMyHook(), {
        wrapper: createWrapper(),
      });

      // Initial fetch
      await act(async () => {
        await result.current.fetch();
      });

      expect(fetchData).toHaveBeenCalledTimes(1);

      // Refetch
      await act(async () => {
        await result.current.refetch();
      });

      expect(fetchData).toHaveBeenCalledTimes(2);
    });
  });

  describe('State Management', () => {
    it('should update local state', () => {
      const { result } = renderHook(() => useMyHook(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setValue('new value');
      });

      expect(result.current.value).toBe('new value');
    });

    it('should reset to initial state', () => {
      const { result } = renderHook(() => useMyHook({ defaultValue: 'initial' }), {
        wrapper: createWrapper(),
      });

      // Change value
      act(() => {
        result.current.setValue('changed');
      });

      expect(result.current.value).toBe('changed');

      // Reset
      act(() => {
        result.current.reset();
      });

      expect(result.current.value).toBe('initial');
    });

    it('should sync with Redux store', () => {
      const { result } = renderHook(() => useMyHook({ syncWithStore: true }), {
        wrapper: createWrapper({ value: 'from store' }),
      });

      expect(result.current.value).toBe('from store');
    });
  });

  describe('Side Effects', () => {
    it('should call onChange callback when value changes', () => {
      const onChange = jest.fn();
      
      const { result } = renderHook(() => useMyHook({ onChange }), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setValue('new value');
      });

      expect(onChange).toHaveBeenCalledWith('new value');
    });

    it('should debounce rapid changes', async () => {
      jest.useFakeTimers();
      const onDebouncedChange = jest.fn();

      const { result } = renderHook(
        () => useMyHook({ onDebouncedChange, debounceMs: 500 }),
        { wrapper: createWrapper() }
      );

      // Make rapid changes
      act(() => {
        result.current.setValue('1');
        result.current.setValue('12');
        result.current.setValue('123');
      });

      expect(onDebouncedChange).not.toHaveBeenCalled();

      // Fast forward time
      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(onDebouncedChange).toHaveBeenCalledTimes(1);
      expect(onDebouncedChange).toHaveBeenCalledWith('123');

      jest.useRealTimers();
    });

    it('should cleanup on unmount', () => {
      const cleanup = jest.fn();
      
      const { unmount } = renderHook(
        () => useMyHook({ onCleanup: cleanup }),
        { wrapper: createWrapper() }
      );

      unmount();

      expect(cleanup).toHaveBeenCalled();
    });
  });

  describe('Mutations', () => {
    it('should handle successful mutations', async () => {
      (postData as jest.Mock).mockResolvedValue({ success: true });

      const { result } = renderHook(() => useMyHook(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.save({ name: 'New Item' });
      });

      expect(result.current.isSaving).toBe(false);
      expect(result.current.saveError).toBeNull();
      expect(postData).toHaveBeenCalledWith({ name: 'New Item' });
    });

    it('should handle mutation errors', async () => {
      const error = new Error('Save failed');
      (postData as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useMyHook(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        try {
          await result.current.save({ name: 'New Item' });
        } catch (e) {
          // Expected error
        }
      });

      expect(result.current.saveError).toEqual(error);
      expect(result.current.isSaving).toBe(false);
    });

    it('should optimistically update data', async () => {
      const { result } = renderHook(() => useMyHook({ optimisticUpdate: true }), {
        wrapper: createWrapper(),
      });

      // Set initial data
      act(() => {
        result.current.setData(mockData);
      });

      // Perform optimistic update
      const updatedData = { ...mockData, value: 200 };
      
      act(() => {
        result.current.update(updatedData);
      });

      // Data should be updated immediately
      expect(result.current.data).toEqual(updatedData);
      
      // Wait for server response
      await waitFor(() => {
        expect(postData).toHaveBeenCalled();
      });
    });
  });

  describe('Pagination', () => {
    it('should handle paginated data', async () => {
      const paginatedData = {
        items: [mockData],
        page: 1,
        totalPages: 3,
        total: 30,
      };
      
      (fetchData as jest.Mock).mockResolvedValue(paginatedData);

      const { result } = renderHook(() => useMyHook({ paginated: true }), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.fetch();
      });

      expect(result.current.data).toEqual(paginatedData.items);
      expect(result.current.pagination).toEqual({
        page: 1,
        totalPages: 3,
        total: 30,
      });
    });

    it('should load next page', async () => {
      const { result } = renderHook(() => useMyHook({ paginated: true }), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.loadNextPage();
      });

      expect(fetchData).toHaveBeenCalledWith(expect.objectContaining({
        page: 2,
      }));
    });
  });

  describe('Caching', () => {
    it('should use cached data when available', async () => {
      const { result, rerender } = renderHook(() => useMyHook({ cacheKey: 'test' }), {
        wrapper: createWrapper(),
      });

      // Initial fetch
      await act(async () => {
        await result.current.fetch();
      });

      expect(fetchData).toHaveBeenCalledTimes(1);

      // Remount component
      rerender();

      // Should use cached data
      expect(result.current.data).toEqual(mockData);
      expect(fetchData).toHaveBeenCalledTimes(1); // No additional fetch
    });

    it('should invalidate cache when requested', async () => {
      const { result } = renderHook(() => useMyHook({ cacheKey: 'test' }), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.fetch();
      });

      await act(async () => {
        await result.current.invalidateCache();
      });

      await act(async () => {
        await result.current.fetch();
      });

      expect(fetchData).toHaveBeenCalledTimes(2);
    });
  });

  describe('Error Recovery', () => {
    it('should retry failed requests', async () => {
      (fetchData as jest.Mock)
        .mockRejectedValueOnce(new Error('First attempt failed'))
        .mockResolvedValueOnce(mockData);

      const { result } = renderHook(() => useMyHook({ retryOnError: true }), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.fetch();
      });

      expect(fetchData).toHaveBeenCalledTimes(2); // Initial + retry
      expect(result.current.data).toEqual(mockData);
    });

    it('should reset error state', async () => {
      (fetchData as jest.Mock).mockRejectedValue(new Error('Failed'));

      const { result } = renderHook(() => useMyHook(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        try {
          await result.current.fetch();
        } catch (e) {
          // Expected
        }
      });

      expect(result.current.error).toBeTruthy();

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('Performance', () => {
    it('should memoize expensive computations', () => {
      const expensiveComputation = jest.fn((data: any) => data?.value * 2);

      const { result, rerender } = renderHook(
        ({ data }) => useMyHook({ data, compute: expensiveComputation }),
        {
          wrapper: createWrapper(),
          initialProps: { data: mockData },
        }
      );

      expect(expensiveComputation).toHaveBeenCalledTimes(1);
      expect(result.current.computedValue).toBe(200);

      // Re-render with same data
      rerender({ data: mockData });

      // Should not recompute
      expect(expensiveComputation).toHaveBeenCalledTimes(1);
      expect(result.current.computedValue).toBe(200);

      // Re-render with different data
      rerender({ data: { ...mockData, value: 150 } });

      // Should recompute
      expect(expensiveComputation).toHaveBeenCalledTimes(2);
      expect(result.current.computedValue).toBe(300);
    });
  });
});
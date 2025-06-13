import { renderHook, act, waitFor } from '@testing-library/react';
import { useVirtualScroll } from '../useVirtualScroll';

describe('useVirtualScroll', () => {
  // Mock fetch function
  const mockFetchFunction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => 
      useVirtualScroll(mockFetchFunction)
    );

    expect(result.current.items).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.hasMore).toBe(true);
    expect(result.current.totalLoaded).toBe(0);
  });

  it('should load items when loadMore is called', async () => {
    const mockData = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' }
    ];

    mockFetchFunction.mockResolvedValueOnce({
      data: mockData,
      hasMore: true
    });

    const { result } = renderHook(() => 
      useVirtualScroll(mockFetchFunction, { pageSize: 2 })
    );

    await act(async () => {
      await result.current.loadMore();
    });

    await waitFor(() => {
      expect(result.current.items).toEqual(mockData);
      expect(result.current.totalLoaded).toBe(2);
      expect(mockFetchFunction).toHaveBeenCalledWith(0, 2);
    });
  });

  it('should append items on subsequent loads', async () => {
    const firstBatch = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' }
    ];
    const secondBatch = [
      { id: 3, name: 'Item 3' },
      { id: 4, name: 'Item 4' }
    ];

    mockFetchFunction
      .mockResolvedValueOnce({ data: firstBatch, hasMore: true })
      .mockResolvedValueOnce({ data: secondBatch, hasMore: false });

    const { result } = renderHook(() => 
      useVirtualScroll(mockFetchFunction, { pageSize: 2 })
    );

    // Load first batch
    await act(async () => {
      await result.current.loadMore();
    });

    // Load second batch
    await act(async () => {
      await result.current.loadMore();
    });

    await waitFor(() => {
      expect(result.current.items).toEqual([...firstBatch, ...secondBatch]);
      expect(result.current.totalLoaded).toBe(4);
      expect(result.current.hasMore).toBe(false);
    });
  });

  it('should prevent concurrent loads', async () => {
    mockFetchFunction.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => 
        resolve({ data: [{ id: 1 }], hasMore: true }), 100
      ))
    );

    const { result } = renderHook(() => 
      useVirtualScroll(mockFetchFunction)
    );

    // Start multiple loads
    act(() => {
      result.current.loadMore();
      result.current.loadMore();
      result.current.loadMore();
    });

    await waitFor(() => {
      expect(mockFetchFunction).toHaveBeenCalledTimes(1);
    });
  });

  it('should reset state when reset is called', async () => {
    const mockData = [{ id: 1, name: 'Item 1' }];
    mockFetchFunction.mockResolvedValueOnce({
      data: mockData,
      hasMore: true
    });

    const { result } = renderHook(() => 
      useVirtualScroll(mockFetchFunction)
    );

    // Load some data
    await act(async () => {
      await result.current.loadMore();
    });

    // Reset
    act(() => {
      result.current.reset();
    });

    expect(result.current.items).toEqual([]);
    expect(result.current.hasMore).toBe(true);
    expect(result.current.totalLoaded).toBe(0);
  });

  it('should handle errors gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    mockFetchFunction.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => 
      useVirtualScroll(mockFetchFunction)
    );

    await act(async () => {
      await result.current.loadMore();
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.items).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error loading more items:', 
        expect.any(Error)
      );
    });

    consoleErrorSpy.mockRestore();
  });

  it('should not load when hasMore is false', async () => {
    mockFetchFunction.mockResolvedValueOnce({
      data: [{ id: 1 }],
      hasMore: false
    });

    const { result } = renderHook(() => 
      useVirtualScroll(mockFetchFunction)
    );

    // Load first batch
    await act(async () => {
      await result.current.loadMore();
    });

    // Try to load more
    await act(async () => {
      await result.current.loadMore();
    });

    expect(mockFetchFunction).toHaveBeenCalledTimes(1);
  });

  it('should use custom page size', async () => {
    mockFetchFunction.mockResolvedValueOnce({
      data: [],
      hasMore: true
    });

    const { result } = renderHook(() => 
      useVirtualScroll(mockFetchFunction, { pageSize: 100 })
    );

    await act(async () => {
      await result.current.loadMore();
    });

    expect(mockFetchFunction).toHaveBeenCalledWith(0, 100);
  });
});
import { useState, useCallback, useRef } from 'react';

interface UseVirtualScrollOptions {
  pageSize?: number;
  threshold?: number;
}

interface UseVirtualScrollReturn<T> {
  items: T[];
  isLoading: boolean;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  reset: () => void;
  totalLoaded: number;
}

export function useVirtualScroll<T>(
  fetchFunction: (offset: number, limit: number) => Promise<{ data: T[]; hasMore: boolean }>,
  options: UseVirtualScrollOptions = {}
): UseVirtualScrollReturn<T> {
  const { pageSize = 50, threshold = 5 } = options;
  
  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;
    
    loadingRef.current = true;
    setIsLoading(true);
    
    try {
      const result = await fetchFunction(items.length, pageSize);
      
      setItems(prev => [...prev, ...result.data]);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error('Error loading more items:', error);
    } finally {
      setIsLoading(false);
      loadingRef.current = false;
    }
  }, [items.length, pageSize, hasMore, fetchFunction]);

  const reset = useCallback(() => {
    setItems([]);
    setHasMore(true);
    setIsLoading(false);
    loadingRef.current = false;
  }, []);

  return {
    items,
    isLoading,
    hasMore,
    loadMore,
    reset,
    totalLoaded: items.length,
  };
}
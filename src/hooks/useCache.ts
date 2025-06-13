import { useCallback, useRef } from 'react';
import { LRUCache } from 'lru-cache';

interface CacheOptions {
  max?: number;
  ttl?: number;
}

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

export function useCache<T>(options: CacheOptions = {}) {
  const cacheRef = useRef(
    new LRUCache<string, CacheItem<T>>({
      max: options.max || 100,
      ttl: options.ttl || 1000 * 60 * 5, // 5 minutes default
    })
  );

  const get = useCallback((key: string): T | undefined => {
    const item = cacheRef.current.get(key);
    if (!item) return undefined;

    // Check if item is expired (for browsers that don't support LRU ttl)
    if (options.ttl && Date.now() - item.timestamp > options.ttl) {
      cacheRef.current.delete(key);
      return undefined;
    }

    return item.data;
  }, [options.ttl]);

  const set = useCallback((key: string, value: T) => {
    cacheRef.current.set(key, {
      data: value,
      timestamp: Date.now(),
    });
  }, []);

  const remove = useCallback((key: string) => {
    cacheRef.current.delete(key);
  }, []);

  const clear = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  const has = useCallback((key: string): boolean => {
    return cacheRef.current.has(key);
  }, []);

  const size = useCallback((): number => {
    return cacheRef.current.size;
  }, []);

  return {
    get,
    set,
    remove,
    clear,
    has,
    size,
  };
}

// Global cache instance for API responses
const apiCache = new LRUCache<string, any>({
  max: 500,
  ttl: 1000 * 60 * 10, // 10 minutes
});

export function useApiCache() {
  const getCachedData = useCallback(async <T,>(
    key: string,
    fetcher: () => Promise<T>,
    ttl?: number
  ): Promise<T> => {
    const cached = apiCache.get(key);
    
    if (cached) {
      return cached as T;
    }

    const data = await fetcher();
    apiCache.set(key, data, { ttl });
    
    return data;
  }, []);

  const invalidateCache = useCallback((pattern?: string) => {
    if (!pattern) {
      apiCache.clear();
      return;
    }

    // Remove all keys matching the pattern
    const keys = [...apiCache.keys()];
    keys.forEach(key => {
      if (key.includes(pattern)) {
        apiCache.delete(key);
      }
    });
  }, []);

  const preloadCache = useCallback(async (
    requests: Array<{ key: string; fetcher: () => Promise<any> }>
  ) => {
    await Promise.all(
      requests.map(async ({ key, fetcher }) => {
        if (!apiCache.has(key)) {
          try {
            const data = await fetcher();
            apiCache.set(key, data);
          } catch (error) {
            console.error(`Failed to preload cache for key: ${key}`, error);
          }
        }
      })
    );
  }, []);

  return {
    getCachedData,
    invalidateCache,
    preloadCache,
  };
}
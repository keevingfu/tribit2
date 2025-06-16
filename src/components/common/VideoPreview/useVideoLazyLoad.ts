import { useState, useEffect, useRef } from 'react';

interface UseVideoLazyLoadOptions {
  threshold?: number;
  rootMargin?: string;
  preloadDelay?: number;
}

export const useVideoLazyLoad = (options: UseVideoLazyLoadOptions = {}) => {
  const { 
    threshold = 0.1, 
    rootMargin = '50px',
    preloadDelay = 0 
  } = options;
  
  const [isInView, setIsInView] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          
          // Add delay for preloading strategy
          if (preloadDelay > 0) {
            setTimeout(() => setShouldLoad(true), preloadDelay);
          } else {
            setShouldLoad(true);
          }
        }
      },
      { threshold, rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, preloadDelay]);

  return { ref, isInView, shouldLoad };
};
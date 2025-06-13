'use client';

import { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import type { ECharts, EChartsOption } from 'echarts';

interface UseChartOptions {
  theme?: 'light' | 'dark';
  loading?: boolean;
  autoResize?: boolean;
}

export const useChart = (
  option: EChartsOption,
  options: UseChartOptions = {}
) => {
  const { theme = 'light', loading = false, autoResize = true } = options;
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartInstance, setChartInstance] = useState<ECharts | null>(null);

  // Initialize chart
  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current, theme);
    setChartInstance(chart);

    return () => {
      chart.dispose();
    };
  }, [theme]);

  // Update chart option
  useEffect(() => {
    if (!chartInstance) return;

    if (loading) {
      chartInstance.showLoading();
    } else {
      chartInstance.hideLoading();
      chartInstance.setOption(option, true);
    }
  }, [chartInstance, option, loading]);

  // Handle resize
  useEffect(() => {
    if (!chartInstance || !autoResize) return;

    const handleResize = () => {
      chartInstance.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [chartInstance, autoResize]);

  return {
    chartRef,
    chartInstance,
  };
};

// Helper hook for responsive charts
export const useResponsiveChart = () => {
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return dimensions;
};
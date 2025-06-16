'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

interface ChartWrapperProps {
  option: echarts.EChartsOption;
  height?: string | number;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  className?: string;
  theme?: 'light' | 'dark';
}

const ChartWrapper: React.FC<ChartWrapperProps> = ({
  option,
  height = 400,
  loading = false,
  error = null,
  onRetry,
  className = '',
  theme = 'light',
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartInstance, setChartInstance] = useState<echarts.ECharts | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // 初始化图表
    const chart = echarts.init(chartRef.current, theme);
    setChartInstance(chart);

    // 响应式调整
    const handleResize = () => {
      chart.resize();
    };

    window.addEventListener('resize', handleResize);

    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [theme]);

  useEffect(() => {
    if (chartInstance && !loading && !error && option) {
      try {
        chartInstance.setOption(option, true);
      } catch (err) {
        console.error('ECharts setOption error:', err);
        setLocalError(`Chart configuration error: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
  }, [chartInstance, option, loading, error]);

  // 加载状态
  if (loading) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-50 rounded-lg ${className}`}
        style={{ height }}
      >
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-2" />
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // 错误状态
  const displayError = error || localError;
  if (displayError) {
    return (
      <div
        className={`flex items-center justify-center bg-red-50 rounded-lg ${className}`}
        style={{ height }}
      >
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-sm text-red-600 mb-3">{displayError}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // 正常渲染
  return (
    <div
      ref={chartRef}
      className={`w-full ${className}`}
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
    />
  );
};

export default ChartWrapper;
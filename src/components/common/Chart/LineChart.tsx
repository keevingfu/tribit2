'use client';

import React from 'react';
import * as echarts from 'echarts';
import ChartWrapper from './ChartWrapper';

interface LineChartProps {
  data: {
    xAxis: string[];
    series: Array<{
      name: string;
      data: number[];
      type?: 'line';
      smooth?: boolean;
      color?: string;
      areaStyle?: any;
    }>;
  };
  title?: string;
  height?: string | number;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  className?: string;
  showLegend?: boolean;
  yAxisLabel?: string;
  xAxisLabel?: string;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  title,
  height = 400,
  loading = false,
  error = null,
  onRetry,
  className = '',
  showLegend = true,
  yAxisLabel = '',
  xAxisLabel = '',
}) => {
  // Ensure data is valid - let ChartWrapper handle empty state
  const validData = {
    xAxis: data?.xAxis || [],
    series: data?.series || []
  };

  const option: echarts.EChartsOption = {
    title: title ? {
      text: title,
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
      },
    } : undefined,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
        },
      },
    },
    legend: showLegend ? {
      data: validData.series.map((s) => s.name),
      bottom: 0,
    } : undefined,
    grid: {
      left: '3%',
      right: '4%',
      bottom: showLegend ? '15%' : '3%',
      top: title ? '15%' : '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: validData.xAxis,
      name: xAxisLabel,
      nameLocation: 'middle',
      nameGap: 30,
      axisLabel: {
        rotate: validData.xAxis.length > 10 ? 45 : 0,
      },
    },
    yAxis: {
      type: 'value',
      name: yAxisLabel,
      nameLocation: 'middle',
      nameGap: 50,
    },
    series: validData.series.map((series) => ({
      name: series.name,
      type: 'line',
      smooth: series.smooth !== false,
      data: series.data,
      itemStyle: series.color ? {
        color: series.color,
      } : undefined,
      areaStyle: series.areaStyle,
      emphasis: {
        focus: 'series',
      },
    })),
  };

  return (
    <ChartWrapper
      option={option}
      height={height}
      loading={loading}
      error={error}
      onRetry={onRetry}
      className={className}
    />
  );
};

export default React.memo(LineChart);
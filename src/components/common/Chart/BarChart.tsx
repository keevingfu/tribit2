'use client';

import React from 'react';
import * as echarts from 'echarts';
import ChartWrapper from './ChartWrapper';

interface BarChartProps {
  data: {
    xAxis: string[];
    series: Array<{
      name: string;
      data: number[];
      type?: 'bar';
      color?: string;
      stack?: string;
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
  horizontal?: boolean;
}

const BarChart: React.FC<BarChartProps> = ({
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
  horizontal = false,
}) => {
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
        type: 'shadow',
      },
    },
    legend: showLegend ? {
      data: data.series.map((s) => s.name),
      bottom: 0,
    } : undefined,
    grid: {
      left: '3%',
      right: '4%',
      bottom: showLegend ? '15%' : '3%',
      top: title ? '15%' : '3%',
      containLabel: true,
    },
    xAxis: horizontal ? {
      type: 'value',
      name: xAxisLabel,
      nameLocation: 'middle',
      nameGap: 30,
    } : {
      type: 'category',
      data: data.xAxis,
      name: xAxisLabel,
      nameLocation: 'middle',
      nameGap: 30,
      axisLabel: {
        rotate: data.xAxis.length > 10 ? 45 : 0,
      },
    },
    yAxis: horizontal ? {
      type: 'category',
      data: data.xAxis,
      name: yAxisLabel,
      nameLocation: 'middle',
      nameGap: 50,
    } : {
      type: 'value',
      name: yAxisLabel,
      nameLocation: 'middle',
      nameGap: 50,
    },
    series: data.series.map((series) => ({
      name: series.name,
      type: 'bar',
      data: series.data,
      stack: series.stack,
      itemStyle: series.color ? {
        color: series.color,
      } : undefined,
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

export default BarChart;
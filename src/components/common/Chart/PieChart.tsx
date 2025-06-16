'use client';

import React from 'react';
import * as echarts from 'echarts';
import ChartWrapper from './ChartWrapper';

interface PieChartProps {
  data: Array<{
    name: string;
    value: number;
    color?: string;
  }>;
  title?: string;
  height?: string | number;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  className?: string;
  showLegend?: boolean;
  donut?: boolean;
  roseType?: 'radius' | 'area';
}

const PieChart: React.FC<PieChartProps> = ({
  data,
  title,
  height = 400,
  loading = false,
  error = null,
  onRetry,
  className = '',
  showLegend = true,
  donut = false,
  roseType,
}) => {
  // Ensure data is valid - let ChartWrapper handle empty state
  const validData = data && data.length > 0 ? data : [];

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
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    legend: showLegend ? {
      orient: 'vertical',
      left: 'left',
      data: validData.map((item) => item.name),
    } : undefined,
    series: [
      {
        name: title || 'pn',
        type: 'pie',
        radius: donut ? ['40%', '70%'] : '70%',
        center: ['50%', '50%'],
        roseType: roseType,
        data: validData.map((item) => ({
          name: item.name,
          value: item.value,
          itemStyle: item.color ? {
            color: item.color,
          } : undefined,
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        label: {
          formatter: '{b}: {d}%',
        },
      },
    ],
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

export default PieChart;
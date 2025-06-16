'use client';

import React from 'react';
import * as echarts from 'echarts';
import ChartWrapper from './ChartWrapper';

interface RadarChartProps {
  data: Array<{
    subject: string;
    A: number;
    B: number;
    fullMark: number;
  }>;
  title?: string;
  height?: string | number;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  className?: string;
  showLegend?: boolean;
}

const RadarChart: React.FC<RadarChartProps> = ({
  data,
  title,
  height = 400,
  loading = false,
  error = null,
  onRetry,
  className = '',
  showLegend = true,
}) => {
  // Ensure data is valid
  const validData = data && data.length > 0 ? data : [];
  
  const indicator = validData.map(item => ({
    name: item.subject,
    max: item.fullMark
  }));

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
    },
    legend: showLegend ? {
      data: ['Current Performance', 'Target Performance'],
      bottom: 0,
    } : undefined,
    radar: {
      indicator: indicator,
      shape: 'polygon',
      splitNumber: 5,
      name: {
        textStyle: {
          color: 'rgb(107, 114, 128)',
          fontSize: 12
        }
      },
      splitLine: {
        lineStyle: {
          color: [
            'rgba(229, 231, 235, 0.3)',
            'rgba(229, 231, 235, 0.3)',
            'rgba(229, 231, 235, 0.3)',
            'rgba(229, 231, 235, 0.3)',
            'rgba(229, 231, 235, 0.3)',
            'rgba(229, 231, 235, 0.3)'
          ].reverse()
        }
      },
      splitArea: {
        show: false
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(229, 231, 235, 0.3)'
        }
      }
    },
    series: [{
      name: 'Performance Metrics',
      type: 'radar',
      data: [
        {
          value: validData.map(item => item.A),
          name: 'Current Performance',
          lineStyle: {
            color: '#3B82F6'
          },
          areaStyle: {
            color: 'rgba(59, 130, 246, 0.2)'
          },
          itemStyle: {
            color: '#3B82F6'
          }
        },
        {
          value: validData.map(item => item.B),
          name: 'Target Performance',
          lineStyle: {
            color: '#10B981'
          },
          areaStyle: {
            color: 'rgba(16, 185, 129, 0.2)'
          },
          itemStyle: {
            color: '#10B981'
          }
        }
      ]
    }]
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

export default RadarChart;
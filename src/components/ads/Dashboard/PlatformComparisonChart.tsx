'use client';

import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import { PlatformMetrics } from '@/types/ads';

interface PlatformComparisonChartProps {
  data: PlatformMetrics[];
  loading: boolean;
}

const PlatformComparisonChart: React.FC<PlatformComparisonChartProps> = ({ data, loading }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Initialize chart
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    if (loading) {
      chartInstance.current.showLoading();
      return;
    }

    chartInstance.current.hideLoading();

    // Prepare data
    const platforms = data.map(d => d.platform);
    const spend = data.map(d => d.spend);
    const impressions = data.map(d => d.impressions / 1000000); // Show in millions
    const conversions = data.map(d => d.conversions);
    const roas = data.map(d => d.avgROAS);

    const option: EChartsOption = {
      title: {
        text: 'Platform Performance Comparison',
        left: 'center',
        textStyle: {
          fontSize: 18,
          fontWeight: 'bold',
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: function(params: any) {
          let tooltip = `<div class="font-semibold">${params[0].axisValue}</div>`;
          params.forEach((param: any) => {
            const value = param.seriesName === 'Impressions' 
              ? `${param.value.toFixed(1)}M` 
              : param.seriesName === 'Spend'
              ? `$${param.value.toLocaleString()}`
              : param.seriesName === 'ROAS'
              ? `${param.value.toFixed(2)}x`
              : param.value.toLocaleString();
            
            tooltip += `
              <div class="flex items-center justify-between mt-1">
                <span class="flex items-center">
                  <span class="inline-block w-3 h-3 rounded-full mr-2" style="background-color: ${param.color}"></span>
                  ${param.seriesName}
                </span>
                <span class="font-medium ml-4">${value}</span>
              </div>
            `;
          });
          return tooltip;
        },
      },
      legend: {
        data: ['Spend', 'Impressions', 'Conversions', 'ROAS'],
        bottom: 0,
      },
      grid: {
        left: '3%',
        right: '8%',
        bottom: '15%',
        top: '15%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: platforms,
      },
      yAxis: [
        {
          type: 'value',
          name: 'Amount',
          position: 'left',
          axisLabel: {
            formatter: (value: number) => {
              if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`;
              if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
              return value.toString();
            },
          },
        },
        {
          type: 'value',
          name: 'ROAS',
          position: 'right',
          axisLabel: {
            formatter: (value: number) => `${value}x`,
          },
        },
      ],
      series: [
        {
          name: 'Spend',
          type: 'bar',
          data: spend,
          itemStyle: {
            color: '#3B82F6',
          },
          barMaxWidth: 40,
        },
        {
          name: 'Impressions',
          type: 'bar',
          data: impressions,
          yAxisIndex: 0,
          itemStyle: {
            color: '#10B981',
          },
          barMaxWidth: 40,
        },
        {
          name: 'Conversions',
          type: 'bar',
          data: conversions,
          itemStyle: {
            color: '#F59E0B',
          },
          barMaxWidth: 40,
        },
        {
          name: 'ROAS',
          type: 'line',
          data: roas,
          yAxisIndex: 1,
          itemStyle: {
            color: '#EF4444',
          },
          lineStyle: {
            width: 3,
          },
          symbol: 'circle',
          symbolSize: 8,
        },
      ],
    };

    chartInstance.current.setOption(option);

    // Handle resize
    const handleResize = () => {
      chartInstance.current?.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [data, loading]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div ref={chartRef} className="w-full h-[400px]" />
    </div>
  );
};

export default PlatformComparisonChart;
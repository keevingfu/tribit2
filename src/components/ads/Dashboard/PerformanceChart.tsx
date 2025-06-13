'use client';

import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import { DateRangeMetrics } from '@/types/ads';

interface PerformanceChartProps {
  data: DateRangeMetrics[];
  loading: boolean;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data, loading }) => {
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
    const dates = data.map(d => d.date);
    const spend = data.map(d => d.spend);
    const impressions = data.map(d => d.impressions / 1000); // Show in thousands
    const clicks = data.map(d => d.clicks);
    const conversions = data.map(d => d.conversions);
    const roas = data.map(d => d.roas);

    const option: EChartsOption = {
      title: {
        text: 'Campaign Performance Trends',
        left: 'center',
        textStyle: {
          fontSize: 18,
          fontWeight: 'bold',
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
        formatter: function(params: any) {
          let tooltip = `<div class="font-semibold">${params[0].axisValue}</div>`;
          params.forEach((param: any) => {
            const value = param.seriesName === 'Impressions' 
              ? `${param.value}K` 
              : param.seriesName === 'Spend'
              ? `$${param.value.toLocaleString()}`
              : param.seriesName === 'ROAS'
              ? `${param.value}x`
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
        data: ['Spend', 'Impressions', 'Clicks', 'Conversions', 'ROAS'],
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
        boundaryGap: false,
        data: dates,
        axisLabel: {
          formatter: (value: string) => {
            const date = new Date(value);
            return `${date.getMonth() + 1}/${date.getDate()}`;
          },
        },
      },
      yAxis: [
        {
          type: 'value',
          name: 'Spend ($)',
          position: 'left',
          axisLabel: {
            formatter: (value: number) => `$${(value / 1000).toFixed(0)}K`,
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
          type: 'line',
          data: spend,
          smooth: true,
          yAxisIndex: 0,
          itemStyle: {
            color: '#3B82F6',
          },
          areaStyle: {
            opacity: 0.1,
          },
        },
        {
          name: 'Impressions',
          type: 'line',
          data: impressions,
          smooth: true,
          yAxisIndex: 0,
          itemStyle: {
            color: '#10B981',
          },
        },
        {
          name: 'Clicks',
          type: 'line',
          data: clicks,
          smooth: true,
          yAxisIndex: 0,
          itemStyle: {
            color: '#F59E0B',
          },
        },
        {
          name: 'Conversions',
          type: 'line',
          data: conversions,
          smooth: true,
          yAxisIndex: 0,
          itemStyle: {
            color: '#EF4444',
          },
        },
        {
          name: 'ROAS',
          type: 'line',
          data: roas,
          smooth: true,
          yAxisIndex: 1,
          itemStyle: {
            color: '#8B5CF6',
          },
          lineStyle: {
            width: 3,
            type: 'dashed',
          },
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

export default PerformanceChart;
'use client';

import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface PerformanceChartProps {
  metric: 'views' | 'engagement' | 'conversions';
  period: '7d' | '30d' | '90d' | '1y';
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ metric, period }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);

    // 根据时间段生成日期数据
    const generateDates = () => {
      const dates = [];
      const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365;
      const today = new Date();

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        dates.push(date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }));
      }

      return dates;
    };

    // 生成模拟数据
    const generateData = () => {
      const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365;
      const baseValue = metric === 'views' ? 5000 : metric === 'engagement' ? 10 : 100;
      const data = [];

      for (let i = 0; i < days; i++) {
        const randomFactor = 0.8 + Math.random() * 0.4;
        const trendFactor = 1 + (i / days) * 0.2; // 增长趋势
        data.push(Math.round(baseValue * randomFactor * trendFactor));
      }

      return data;
    };

    const dates = generateDates();
    const data = generateData();

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const param = params[0];
          const unit = metric === 'views' ? '' : metric === 'engagement' ? '%' : '个';
          return `${param.name}<br/>${param.seriesName}: ${param.value}${unit}`;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: dates,
        axisLabel: {
          rotate: period === '90d' || period === '1y' ? 45 : 0
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (value: number) => {
            if (metric === 'views' && value >= 1000) {
              return `${(value / 1000).toFixed(0)}k`;
            }
            return metric === 'engagement' ? `${value}%` : value.toString();
          }
        }
      },
      series: [
        {
          name: metric === 'views' ? '浏览量' : metric === 'engagement' ? '互动率' : '转化数',
          type: 'line',
          smooth: true,
          data: data,
          itemStyle: {
            color: '#3B82F6'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(59, 130, 246, 0.25)' },
                { offset: 1, color: 'rgba(59, 130, 246, 0.05)' }
              ]
            }
          }
        }
      ]
    };

    chart.setOption(option);

    const handleResize = () => {
      chart.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [metric, period]);

  return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />;
};
'use client';

import React, { useMemo } from 'react';
import ChartWrapper from '../../common/Chart/ChartWrapper';
import type { EChartsOption } from 'echarts';
import type { VideoData } from '@/types/insight';

interface ViralChartProps {
  videos: VideoData[];
  timeRange: string;
}

export const ViralChart: React.FC<ViralChartProps> = ({ videos, timeRange }) => {
  const option: EChartsOption = useMemo(() => {
    if (!videos || videos.length === 0) {
      return {};
    }

    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const dates = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      return date.toISOString().split('T')[0];
    });

    const viralCurves = videos.slice(0, 3).map((video, videoIndex) => {
      const finalViews = video.views;
      const data = dates.map((date, dayIndex) => {
        const progress = dayIndex / (days - 1);
        const viralFactor = video.engagementRate / 20;
        const k = 8 * viralFactor;
        const x0 = 0.3 + Math.random() * 0.4;
        const sigmoidValue = 1 / (1 + Math.exp(-k * (progress - x0)));
        return Math.floor(finalViews * sigmoidValue);
      });

      return {
        name: video.title.slice(0, 20) + '...',
        type: 'line' as const,
        smooth: true,
        data: data,
        lineStyle: { width: 3 },
        areaStyle: { opacity: 0.1 }
      };
    });

    return {
      title: {
        text: 'Viral Growth Curve',
        left: 'center',
        textStyle: { fontSize: 14 }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' }
      },
      legend: {
        data: viralCurves.map(curve => curve.name),
        bottom: 10
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: dates,
        axisLabel: {
          formatter: (value: string) => {
            const date = new Date(value);
            return `${date.getMonth() + 1}/${date.getDate()}`;
          }
        }
      },
      yAxis: {
        type: 'value',
        name: 'Views',
        axisLabel: {
          formatter: (value: number) => {
            if (value >= 1000000) {
              return (value / 1000000).toFixed(1) + 'M';
            } else if (value >= 1000) {
              return (value / 1000).toFixed(0) + 'K';
            }
            return value.toString();
          }
        }
      },
      series: viralCurves.map((curve, index) => ({
        ...curve,
        itemStyle: {
          color: ['#ef4444', '#3b82f6', '#10b981'][index % 3]
        }
      }))
    };
  }, [videos, timeRange]);

  return <ChartWrapper option={option} height={350} />;
};
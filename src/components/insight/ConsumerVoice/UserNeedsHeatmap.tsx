'use client';

import React, { useMemo } from 'react';
import ChartWrapper from '../../common/Chart/ChartWrapper';
import type { EChartsOption } from 'echarts';
import type { UserNeed } from '../../../types/insight';

interface UserNeedsHeatmapProps {
  data: UserNeed[];
  onCategoryClick?: (category: string) => void;
  loading?: boolean;
}

export const UserNeedsHeatmap: React.FC<UserNeedsHeatmapProps> = ({ 
  data, 
  onCategoryClick,
  loading = false 
}) => {
  const option: EChartsOption = useMemo(() => {
    if (!data || data.length === 0) {
      return {};
    }
    
    // 转换数据为热力图格式
    const categories = data.map(d => d.category);
    const sentiments = ['positive', 'neutral', 'negative'];
    const sentimentLabels = ['正面', '中性', '负面'];
    
    // 创建热力图数据
    const heatmapData: number[][] = [];
    categories.forEach((category, categoryIndex) => {
      const need = data.find(d => d.category === category);
      sentiments.forEach((sentiment, sentimentIndex) => {
        const value = need?.sentiment === sentiment ? need.frequency : 0;
        heatmapData.push([sentimentIndex, categoryIndex, value]);
      });
    });

    return {
      tooltip: {
        position: 'top',
        formatter: (params: any) => {
          const sentiment = sentimentLabels[params.data[0]];
          const category = categories[params.data[1]];
          const value = params.data[2];
          return `
            <div class="p-2">
              <div class="font-semibold">${category}</div>
              <div class="text-sm mt-1">情感: ${sentiment}</div>
              <div class="text-sm">频率: ${value}</div>
            </div>
          `;
        }
      },
      grid: {
        height: '60%',
        top: '10%',
        left: '15%',
        right: '10%'
      },
      xAxis: {
        type: 'category',
        data: sentimentLabels,
        splitArea: {
          show: true
        },
        axisLabel: {
          interval: 0
        }
      },
      yAxis: {
        type: 'category',
        data: categories,
        splitArea: {
          show: true
        },
        axisLabel: {
          interval: 0
        }
      },
      visualMap: {
        min: 0,
        max: 100,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '10%',
        inRange: {
          color: ['#f3f4f6', '#fbbf24', '#ef4444']
        }
      },
      series: [{
        name: '用户需求',
        type: 'heatmap',
        data: heatmapData,
        label: {
          show: true,
          formatter: (params: any) => params.data[2] || ''
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };
  }, [data]);


  return (
    <ChartWrapper 
      option={option} 
      height={400}
      loading={loading}
    />
  );
};
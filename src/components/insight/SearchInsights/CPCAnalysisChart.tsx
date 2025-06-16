'use client';

import React, { useMemo } from 'react';
import ChartWrapper from '../../common/Chart/ChartWrapper';
import type { EChartsOption } from 'echarts';
import type { CPCAnalysis } from '../../../types/insight';

interface CPCAnalysisChartProps {
  data: CPCAnalysis[];
  selectedKeyword?: string;
  loading?: boolean;
}

export const CPCAnalysisChart: React.FC<CPCAnalysisChartProps> = ({ 
  data, 
  selectedKeyword,
  loading = false 
}) => {
  const option: EChartsOption = useMemo(() => {
    // If a keyword is selected, only show detailed data for that keyword
    if (selectedKeyword) {
      const selectedData = data.find(d => d.keyword === selectedKeyword);
      if (!selectedData) return {};

      return {
        title: {
          text: `${selectedKeyword} CPC Trend`,
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          formatter: (params: any) => {
            const param = params[0];
            return `
              <div class="p-2">
                <div class="font-semibold">${param.name}</div>
                <div class="mt-1">CPC: $${param.value.toFixed(2)}</div>
              </div>
            `;
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
          data: selectedData.monthlyData.map(d => d.month),
          axisLabel: {
            rotate: 45
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '${value}'
          }
        },
        series: [{
          type: 'line',
          data: selectedData.monthlyData.map(d => d.cpc),
          smooth: true,
          areaStyle: {
            opacity: 0.3
          },
          lineStyle: {
            width: 3
          },
          itemStyle: {
            color: selectedData.trend === 'increasing' ? '#ef4444' :
                   selectedData.trend === 'decreasing' ? '#10b981' : '#3b82f6'
          },
          markLine: {
            data: [
              { type: 'average', name: 'Average' },
              { type: 'max', name: 'Maximum' },
              { type: 'min', name: 'Minimum' }
            ]
          }
        }]
      };
    }

    // Default: show CPC comparison for all keywords
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (params: any) => {
          const param = params[0];
          const item = data.find(d => d.keyword === param.name);
          return `
            <div class="p-2">
              <div class="font-semibold">${param.name}</div>
              <div class="mt-1">Average CPC: $${item?.avgCPC.toFixed(2)}</div>
              <div>Min CPC: $${item?.minCPC.toFixed(2)}</div>
              <div>Max CPC: $${item?.maxCPC.toFixed(2)}</div>
              <div>Trend: ${
                item?.trend === 'increasing' ? 'Increasing' :
                item?.trend === 'decreasing' ? 'Decreasing' : 'Stable'
              }</div>
            </div>
          `;
        }
      },
      legend: {
        data: ['Min CPC', 'Average CPC', 'Max CPC'],
        bottom: 0
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: data.map(d => d.keyword),
        axisLabel: {
          rotate: 45,
          interval: 0
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '${value}'
        }
      },
      series: [
        {
          name: 'Min CPC',
          type: 'bar',
          stack: 'cpc',
          itemStyle: {
            color: '#10b981'
          },
          data: data.map(d => d.minCPC)
        },
        {
          name: 'Average CPC',
          type: 'bar',
          stack: 'cpc',
          itemStyle: {
            color: '#3b82f6'
          },
          data: data.map(d => d.avgCPC - d.minCPC)
        },
        {
          name: 'Max CPC',
          type: 'bar',
          stack: 'cpc',
          itemStyle: {
            color: '#ef4444'
          },
          data: data.map(d => d.maxCPC - d.avgCPC)
        }
      ]
    };
  }, [data, selectedKeyword]);

  return (
    <ChartWrapper 
      option={option} 
      height={400}
      loading={loading}
    />
  );
};
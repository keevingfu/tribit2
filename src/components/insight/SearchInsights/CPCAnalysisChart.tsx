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
    // 如果有选中的关键词，只显示该关键词的详细数据
    if (selectedKeyword) {
      const selectedData = data.find(d => d.keyword === selectedKeyword);
      if (!selectedData) return {};

      return {
        title: {
          text: `${selectedKeyword} CPC趋势`,
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          formatter: (params: any) => {
            const param = params[0];
            return `
              <div class="p-2">
                <div class="font-semibold">${param.name}</div>
                <div class="mt-1">CPC: ¥${param.value.toFixed(2)}</div>
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
            formatter: '¥{value}'
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
              { type: 'average', name: '平均值' },
              { type: 'max', name: '最大值' },
              { type: 'min', name: '最小值' }
            ]
          }
        }]
      };
    }

    // 默认显示所有关键词的CPC对比
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
              <div class="mt-1">平均CPC: ¥${item?.avgCPC.toFixed(2)}</div>
              <div>最低CPC: ¥${item?.minCPC.toFixed(2)}</div>
              <div>最高CPC: ¥${item?.maxCPC.toFixed(2)}</div>
              <div>趋势: ${
                item?.trend === 'increasing' ? '上升' :
                item?.trend === 'decreasing' ? '下降' : '稳定'
              }</div>
            </div>
          `;
        }
      },
      legend: {
        data: ['最低CPC', '平均CPC', '最高CPC'],
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
          formatter: '¥{value}'
        }
      },
      series: [
        {
          name: '最低CPC',
          type: 'bar',
          stack: 'cpc',
          itemStyle: {
            color: '#10b981'
          },
          data: data.map(d => d.minCPC)
        },
        {
          name: '平均CPC',
          type: 'bar',
          stack: 'cpc',
          itemStyle: {
            color: '#3b82f6'
          },
          data: data.map(d => d.avgCPC - d.minCPC)
        },
        {
          name: '最高CPC',
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
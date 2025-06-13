'use client';

import React, { useMemo } from 'react';
import ChartWrapper from '../../common/Chart/ChartWrapper';
import type { EChartsOption } from 'echarts';
import type { SearchTrend } from '../../../types/insight';

interface SearchTrendsChartProps {
  data: SearchTrend[];
  selectedKeyword?: string;
  loading?: boolean;
}

export const SearchTrendsChart: React.FC<SearchTrendsChartProps> = ({ 
  data, 
  selectedKeyword,
  loading = false 
}) => {
  const option: EChartsOption = useMemo(() => {
    // 按日期和关键词分组数据
    const groupedData = data.reduce((acc, item) => {
      if (!acc[item.keyword]) {
        acc[item.keyword] = [];
      }
      acc[item.keyword].push(item);
      return acc;
    }, {} as Record<string, SearchTrend[]>);

    // 获取所有唯一日期并排序
    const allDates = [...new Set(data.map(item => item.date))].sort();

    // 构建系列数据
    const series = Object.entries(groupedData).map(([keyword, trends]) => {
      const seriesData = allDates.map(date => {
        const trend = trends.find(t => t.date === date);
        return trend ? trend.volume : 0;
      });

      return {
        name: keyword,
        type: 'line' as const,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          width: selectedKeyword === keyword ? 3 : 2,
          opacity: selectedKeyword && selectedKeyword !== keyword ? 0.3 : 1
        },
        itemStyle: {
          opacity: selectedKeyword && selectedKeyword !== keyword ? 0.3 : 1
        },
        emphasis: {
          focus: 'series' as const,
          lineStyle: {
            width: 4
          }
        },
        data: seriesData
      };
    });

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        },
        formatter: (params: any) => {
          let tooltip = `<div class="p-2"><div class="font-semibold mb-2">${params[0].axisValue}</div>`;
          params.forEach((param: any) => {
            tooltip += `
              <div class="flex justify-between items-center">
                <span class="flex items-center">
                  <span class="inline-block w-3 h-3 rounded-full mr-2" style="background-color: ${param.color}"></span>
                  ${param.seriesName}
                </span>
                <span class="ml-4 font-semibold">${param.value.toLocaleString()}</span>
              </div>
            `;
          });
          tooltip += '</div>';
          return tooltip;
        }
      },
      legend: {
        data: Object.keys(groupedData),
        bottom: 0,
        selected: selectedKeyword ? {
          [selectedKeyword]: true,
          ...Object.keys(groupedData).reduce((acc, key) => {
            if (key !== selectedKeyword) acc[key] = false;
            return acc;
          }, {} as Record<string, boolean>)
        } : undefined
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
        data: allDates,
        axisLabel: {
          formatter: (value: string) => {
            const date = new Date(value);
            return `${date.getMonth() + 1}/${date.getDate()}`;
          },
          interval: Math.floor(allDates.length / 7) // 显示约7个标签
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (value: number) => {
            if (value >= 1000) {
              return (value / 1000).toFixed(0) + 'k';
            }
            return value.toString();
          }
        }
      },
      series: series
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
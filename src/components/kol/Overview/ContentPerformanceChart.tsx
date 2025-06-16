'use client';

import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { ContentPerformanceData } from '@/types/kol';
import { formatNumber } from '@/utils/format';

interface ContentPerformanceChartProps {
  data: ContentPerformanceData[];
  loading?: boolean;
  title?: string;
}

const ContentPerformanceChart: React.FC<ContentPerformanceChartProps> = ({ 
  data, 
  loading = false,
  title = 'Content Performance Analysis'
}) => {

  const option = useMemo(() => {
    const dates = data.map(item => item.date);
    const views = data.map(item => item.views);
    const likes = data.map(item => item.likes);
    const comments = data.map(item => item.comments);
    const shares = data.map(item => item.shares);
    const engagementRates = data.map(item => item.engagementRate);

    return {
      title: {
        text: title,
        left: 'left',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold',
          color: '#333'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (params: any) => {
          const date = params[0].axisValue;
          
          return `
            <div class="px-3 py-2">
              <div class="font-semibold mb-2">${date}</div>
              ${params.map((item: any) => `
                <div class="flex items-center justify-between mb-1">
                  <span class="flex items-center">
                    <span class="w-3 h-3 rounded-full mr-2" style="background: ${item.color}"></span>
                    <span>${item.seriesName}:</span>
                  </span>
                  <span class="ml-4 font-medium">
                    ${item.seriesName === 'Engagement Rate' 
                      ? `${item.value.toFixed(2)}%` 
                      : formatNumber(item.value)
                    }
                  </span>
                </div>
              `).join('')}
            </div>
          `;
        }
      },
      legend: {
        data: ['Views', 'Likes', 'Comments', 'Shares', 'Engagement Rate'],
        bottom: 0,
        textStyle: {
          color: '#666'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: dates,
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        axisLabel: {
          color: '#666',
          rotate: 45,
          formatter: (value: string) => {
            const date = new Date(value);
            return `${date.getMonth() + 1}/${date.getDate()}`;
          }
        }
      },
      yAxis: [
        {
          type: 'value',
          name: 'Count',
          position: 'left',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#999'
            }
          },
          axisLabel: {
            color: '#666',
            formatter: (value: number) => formatNumber(value)
          },
          splitLine: {
            lineStyle: {
              color: '#f0f0f0'
            }
          }
        },
        {
          type: 'value',
          name: 'Engagement Rate (%)',
          position: 'right',
          min: 0,
          max: Math.ceil(Math.max(...engagementRates) * 1.2),
          axisLine: {
            show: true,
            lineStyle: {
              color: '#fac858'
            }
          },
          axisLabel: {
            color: '#666',
            formatter: '{value}%'
          },
          splitLine: {
            show: false
          }
        }
      ],
      series: [
        {
          name: 'Views',
          type: 'bar',
          stack: 'total',
          data: views,
          itemStyle: {
            color: '#5470c6'
          }
        },
        {
          name: 'Likes',
          type: 'bar',
          stack: 'interaction',
          data: likes,
          itemStyle: {
            color: '#91cc75'
          }
        },
        {
          name: 'Comments',
          type: 'bar',
          stack: 'interaction',
          data: comments,
          itemStyle: {
            color: '#ee6666'
          }
        },
        {
          name: 'Shares',
          type: 'bar',
          stack: 'interaction',
          data: shares,
          itemStyle: {
            color: '#73c0de'
          }
        },
        {
          name: 'Engagement Rate',
          type: 'line',
          yAxisIndex: 1,
          data: engagementRates,
          smooth: true,
          lineStyle: {
            width: 3,
            color: '#fac858'
          },
          itemStyle: {
            color: '#fac858'
          },
          symbol: 'circle',
          symbolSize: 8
        }
      ]
    };
  }, [data, title]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="h-[400px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="h-[400px] flex items-center justify-center text-gray-500">
          No data available
        </div>
      </div>
    );
  }

  // Calculate summary data
  const totalViews = data.reduce((sum, item) => sum + item.views, 0);
  const totalLikes = data.reduce((sum, item) => sum + item.likes, 0);
  const totalComments = data.reduce((sum, item) => sum + item.comments, 0);
  const totalShares = data.reduce((sum, item) => sum + item.shares, 0);
  const avgEngagementRate = data.reduce((sum, item) => sum + item.engagementRate, 0) / data.length;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <ReactECharts 
        option={option} 
        style={{ height: '400px' }}
        notMerge
        lazyUpdate
      />
      
      {/* Performance metrics summary */}
      <div className="grid grid-cols-5 gap-4 mt-6 pt-6 border-t border-gray-100">
        <div className="text-center">
          <div className="text-sm text-gray-600">Total Views</div>
          <div className="text-lg font-semibold text-gray-900 mt-1">
            {formatNumber(totalViews)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-600">Total Likes</div>
          <div className="text-lg font-semibold text-gray-900 mt-1">
            {formatNumber(totalLikes)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-600">Total Comments</div>
          <div className="text-lg font-semibold text-gray-900 mt-1">
            {formatNumber(totalComments)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-600">Total Shares</div>
          <div className="text-lg font-semibold text-gray-900 mt-1">
            {formatNumber(totalShares)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-600">Avg Engagement Rate</div>
          <div className="text-lg font-semibold text-orange-600 mt-1">
            {avgEngagementRate.toFixed(2)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentPerformanceChart;
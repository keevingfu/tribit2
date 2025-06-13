'use client';

import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { FollowerGrowthData } from '@/types/kol';
import { formatNumber } from '@/utils/format';

interface FollowerGrowthChartProps {
  data: FollowerGrowthData[];
  loading?: boolean;
  title?: string;
}

const FollowerGrowthChart: React.FC<FollowerGrowthChartProps> = ({ 
  data, 
  loading = false,
  title = '粉丝增长趋势'
}) => {

  const option = useMemo(() => {
    const dates = data.map(item => item.date);
    const followers = data.map(item => item.followers);
    const growthRates = data.map(item => item.growthRate);

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
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        },
        formatter: (params: any) => {
          const date = params[0].axisValue;
          const followerData = params.find((p: any) => p.seriesName === '粉丝数');
          const growthData = params.find((p: any) => p.seriesName === '增长率');
          
          return `
            <div class="px-3 py-2">
              <div class="font-semibold mb-2">${date}</div>
              ${followerData ? `
                <div class="flex items-center justify-between mb-1">
                  <span class="flex items-center">
                    <span class="w-3 h-3 rounded-full mr-2" style="background: ${followerData.color}"></span>
                    <span>粉丝数:</span>
                  </span>
                  <span class="ml-4 font-medium">${formatNumber(followerData.value)}</span>
                </div>
              ` : ''}
              ${growthData ? `
                <div class="flex items-center justify-between">
                  <span class="flex items-center">
                    <span class="w-3 h-3 rounded-full mr-2" style="background: ${growthData.color}"></span>
                    <span>增长率:</span>
                  </span>
                  <span class="ml-4 font-medium">${growthData.value.toFixed(2)}%</span>
                </div>
              ` : ''}
            </div>
          `;
        }
      },
      legend: {
        data: ['粉丝数', '增长率'],
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
        boundaryGap: false,
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
          name: '粉丝数',
          position: 'left',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#5470c6'
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
          name: '增长率 (%)',
          position: 'right',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#91cc75'
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
          name: '粉丝数',
          type: 'line',
          data: followers,
          smooth: true,
          lineStyle: {
            width: 3,
            color: '#5470c6'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(84, 112, 198, 0.3)' },
                { offset: 1, color: 'rgba(84, 112, 198, 0.05)' }
              ]
            }
          },
          itemStyle: {
            color: '#5470c6'
          }
        },
        {
          name: '增长率',
          type: 'line',
          yAxisIndex: 1,
          data: growthRates,
          smooth: true,
          lineStyle: {
            width: 2,
            color: '#91cc75',
            type: 'dashed'
          },
          itemStyle: {
            color: '#91cc75'
          }
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
          暂无数据
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <ReactECharts 
        option={option} 
        style={{ height: '400px' }}
        notMerge
        lazyUpdate
      />
      
      {/* 增长统计摘要 */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
        <div>
          <div className="text-sm text-gray-600">当前粉丝数</div>
          <div className="text-lg font-semibold text-gray-900 mt-1">
            {formatNumber(data[data.length - 1]?.followers || 0)}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-600">总增长</div>
          <div className="text-lg font-semibold text-green-600 mt-1">
            +{formatNumber((data[data.length - 1]?.followers || 0) - (data[0]?.followers || 0))}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-600">平均日增长</div>
          <div className="text-lg font-semibold text-blue-600 mt-1">
            +{formatNumber(
              data.reduce((sum, item) => sum + item.growth, 0) / data.length
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowerGrowthChart;
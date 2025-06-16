'use client';

import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { RevenueAttributionData } from '@/types/kol';
import { formatCurrency, formatNumber } from '@/utils/format';

interface RevenueAttributionChartProps {
  data: RevenueAttributionData[];
  loading?: boolean;
  title?: string;
}

const RevenueAttributionChart: React.FC<RevenueAttributionChartProps> = ({ 
  data, 
  loading = false,
  title = 'Revenue Attribution Analysis'
}) => {

  const option = useMemo(() => {
    const sources = data.map(item => item.channel);
    const revenues = data.map(item => item.revenue);
    const conversions = data.map(item => item.conversions);

    const colors = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de'];

    return {
      title: {
        text: title,
        left: 'center',
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
          const revenueData = params[0];
          const conversionData = params[1];
          const index = revenueData.dataIndex;
          const item = data[index];
          
          return `
            <div class="px-3 py-2">
              <div class="font-semibold mb-2">${item.channel}</div>
              <div class="flex items-center justify-between mb-1">
                <span>Revenue:</span>
                <span class="ml-4 font-medium">${formatCurrency(item.revenue)}</span>
              </div>
              <div class="flex items-center justify-between mb-1">
                <span>Percentage:</span>
                <span class="ml-4 font-medium">${item.percentage.toFixed(1)}%</span>
              </div>
              <div class="flex items-center justify-between">
                <span>Conversions:</span>
                <span class="ml-4 font-medium">${formatNumber(item.conversions)}</span>
              </div>
              <div class="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
                <span>Average Order:</span>
                <span class="ml-4 font-medium text-green-600">
                  ${formatNumber(item.revenue / item.conversions)}
                </span>
              </div>
            </div>
          `;
        }
      },
      legend: {
        data: ['Revenue', 'Conversions'],
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
        data: sources,
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        axisLabel: {
          color: '#666',
          interval: 0,
          rotate: 0
        }
      },
      yAxis: [
        {
          type: 'value',
          name: 'Revenue ($)',
          position: 'left',
          axisLine: {
            show: true,
            lineStyle: {
              color: colors[0]
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
          name: 'Conversions',
          position: 'right',
          axisLine: {
            show: true,
            lineStyle: {
              color: colors[1]
            }
          },
          axisLabel: {
            color: '#666',
            formatter: (value: number) => formatNumber(value)
          },
          splitLine: {
            show: false
          }
        }
      ],
      series: [
        {
          name: 'Revenue',
          type: 'bar',
          data: revenues,
          itemStyle: {
            color: (params: any) => colors[params.dataIndex % colors.length],
            borderRadius: [4, 4, 0, 0]
          },
          label: {
            show: true,
            position: 'top',
            formatter: (params: any) => {
              const percentage = data[params.dataIndex].percentage;
              return `${percentage.toFixed(1)}%`;
            },
            fontSize: 12,
            color: '#666'
          }
        },
        {
          name: 'Conversions',
          type: 'line',
          yAxisIndex: 1,
          data: conversions,
          smooth: true,
          lineStyle: {
            width: 3,
            color: colors[1]
          },
          itemStyle: {
            color: colors[1]
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
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const totalConversions = data.reduce((sum, item) => sum + item.conversions, 0);
  const avgOrderValue = totalRevenue / totalConversions;

  // Find best channel
  const bestSource = data.reduce((best, item) => 
    item.revenue > best.revenue ? item : best
  , data[0]);

  const mostEfficientSource = data.reduce((best, item) => {
    const currentAvg = item.revenue / item.conversions;
    const bestAvg = best.revenue / best.conversions;
    return currentAvg > bestAvg ? item : best;
  }, data[0]);

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <ReactECharts 
        option={option} 
        style={{ height: '400px' }}
        notMerge
        lazyUpdate
      />
      
      {/* Attribution Analysis Summary */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <h4 className="text-sm font-semibold text-gray-700 mb-4">Attribution Analysis Summary</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Total Revenue</div>
            <div className="text-xl font-bold text-gray-900">
              {formatCurrency(totalRevenue)}
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Total Conversions</div>
            <div className="text-xl font-bold text-gray-900">
              {formatNumber(totalConversions)}
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Average Order Value</div>
            <div className="text-xl font-bold text-green-600">
              {formatCurrency(avgOrderValue)}
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Best Channel</div>
            <div className="text-lg font-semibold text-blue-600">
              {bestSource.channel}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {formatCurrency(bestSource.revenue)} ({bestSource.percentage.toFixed(1)}%)
            </div>
          </div>
        </div>

        {/* Channel Efficiency Analysis */}
        <div className="mt-6">
          <h5 className="text-sm font-semibold text-gray-700 mb-3">Channel Efficiency Ranking</h5>
          <div className="space-y-3">
            {data
              .sort((a, b) => (b.revenue / b.conversions) - (a.revenue / a.conversions))
              .map((item, index) => {
                const avgValue = item.revenue / item.conversions;
                const efficiency = (avgValue / avgOrderValue) * 100;
                
                return (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900">{item.channel}</span>
                        <span className="text-sm text-gray-600">
                          {formatCurrency(avgValue)}/order
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(efficiency, 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-700 w-12 text-right">
                      {efficiency.toFixed(0)}%
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Optimization Suggestions */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h5 className="text-sm font-semibold text-blue-900 mb-2">Optimization Suggestions</h5>
          <div className="text-sm text-blue-800 space-y-2">
            <p>
              • "{mostEfficientSource.channel}" channel has the highest average order value
              ({formatCurrency(mostEfficientSource.revenue / mostEfficientSource.conversions)}),
              suggest increasing investment in this channel.
            </p>
            {data.some(item => item.percentage < 10) && (
              <p>
                • Consider optimizing or adjusting channels with less than 10% share, focus resources on high-efficiency channels.
              </p>
            )}
            <p>
              • Continuously monitor conversion efficiency of each channel, regularly adjust budget allocation to maximize ROI.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueAttributionChart;
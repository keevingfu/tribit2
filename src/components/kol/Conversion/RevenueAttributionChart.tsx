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
  title = '收入归因分析'
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
                <span>收入:</span>
                <span class="ml-4 font-medium">${formatCurrency(item.revenue)}</span>
              </div>
              <div class="flex items-center justify-between mb-1">
                <span>占比:</span>
                <span class="ml-4 font-medium">${item.percentage.toFixed(1)}%</span>
              </div>
              <div class="flex items-center justify-between">
                <span>转化数:</span>
                <span class="ml-4 font-medium">${formatNumber(item.conversions)}</span>
              </div>
              <div class="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
                <span>平均订单:</span>
                <span class="ml-4 font-medium text-green-600">
                  ${formatNumber(item.revenue / item.conversions)}
                </span>
              </div>
            </div>
          `;
        }
      },
      legend: {
        data: ['收入', '转化数'],
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
          name: '收入 ($)',
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
          name: '转化数',
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
          name: '收入',
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
          name: '转化数',
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
          暂无数据
        </div>
      </div>
    );
  }

  // 计算汇总数据
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const totalConversions = data.reduce((sum, item) => sum + item.conversions, 0);
  const avgOrderValue = totalRevenue / totalConversions;

  // 找出最佳渠道
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
      
      {/* 归因分析摘要 */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <h4 className="text-sm font-semibold text-gray-700 mb-4">归因分析摘要</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">总收入</div>
            <div className="text-xl font-bold text-gray-900">
              {formatCurrency(totalRevenue)}
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">总转化</div>
            <div className="text-xl font-bold text-gray-900">
              {formatNumber(totalConversions)}
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">平均订单价值</div>
            <div className="text-xl font-bold text-green-600">
              {formatCurrency(avgOrderValue)}
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">最佳渠道</div>
            <div className="text-lg font-semibold text-blue-600">
              {bestSource.channel}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {formatCurrency(bestSource.revenue)} ({bestSource.percentage.toFixed(1)}%)
            </div>
          </div>
        </div>

        {/* 渠道效率分析 */}
        <div className="mt-6">
          <h5 className="text-sm font-semibold text-gray-700 mb-3">渠道效率排名</h5>
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
                          {formatCurrency(avgValue)}/单
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

        {/* 优化建议 */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h5 className="text-sm font-semibold text-blue-900 mb-2">优化建议</h5>
          <div className="text-sm text-blue-800 space-y-2">
            <p>
              • "{mostEfficientSource.channel}" 渠道的平均订单价值最高
              （{formatCurrency(mostEfficientSource.revenue / mostEfficientSource.conversions)}），
              建议增加该渠道的投入。
            </p>
            {data.some(item => item.percentage < 10) && (
              <p>
                • 考虑优化或调整占比低于10%的渠道策略，集中资源在高效渠道上。
              </p>
            )}
            <p>
              • 持续监控各渠道的转化效率，定期调整预算分配以最大化ROI。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueAttributionChart;
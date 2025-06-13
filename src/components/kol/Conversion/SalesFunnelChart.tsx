'use client';

import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { SalesFunnelData } from '@/types/kol';
import { formatNumber } from '@/utils/format';

interface SalesFunnelChartProps {
  data: SalesFunnelData[];
  loading?: boolean;
  title?: string;
}

const SalesFunnelChart: React.FC<SalesFunnelChartProps> = ({ 
  data, 
  loading = false,
  title = '销售漏斗分析'
}) => {

  const option = useMemo(() => {
    const stages = data.map(item => item.stage);
    const values = data.map(item => item.count);

    // 计算漏斗颜色渐变
    const colors = [
      '#5470c6',
      '#66b3ff',
      '#99ccff',
      '#cce5ff',
      '#e6f2ff'
    ];

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
        trigger: 'item',
        formatter: (params: any) => {
          const index = params.dataIndex;
          const conversionRate = data[index]?.conversionRate;
          
          return `
            <div class="px-3 py-2">
              <div class="font-semibold mb-2">${params.name}</div>
              <div class="flex items-center justify-between mb-1">
                <span>数量:</span>
                <span class="ml-4 font-medium">${formatNumber(params.value)}</span>
              </div>
              <div class="flex items-center justify-between mb-1">
                <span>占比:</span>
                <span class="ml-4 font-medium">${params.data.percentage}%</span>
              </div>
              ${conversionRate !== undefined ? `
                <div class="flex items-center justify-between pt-2 border-t border-gray-200">
                  <span>转化率:</span>
                  <span class="ml-4 font-medium text-green-600">${conversionRate}%</span>
                </div>
              ` : ''}
            </div>
          `;
        }
      },
      series: [
        {
          name: '销售漏斗',
          type: 'funnel',
          left: '10%',
          top: 60,
          bottom: 60,
          width: '80%',
          min: 0,
          max: 100,
          minSize: '0%',
          maxSize: '100%',
          sort: 'descending',
          gap: 2,
          label: {
            show: true,
            position: 'inside',
            formatter: (params: any) => {
              return `${params.name}\n${formatNumber(params.data.value)}`;
            },
            fontSize: 14,
            fontWeight: 'bold',
            color: '#fff'
          },
          labelLine: {
            length: 10,
            lineStyle: {
              width: 1,
              type: 'solid'
            }
          },
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 1
          },
          emphasis: {
            label: {
              fontSize: 18,
              fontWeight: 'bold'
            }
          },
          data: data.map((item, index) => ({
            value: item.percentage,
            name: item.stage,
            count: item.count,
            percentage: item.percentage,
            itemStyle: {
              color: colors[index % colors.length]
            }
          }))
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

  // 计算总体转化率
  const overallConversionRate = data.length > 0 && data[0].count > 0
    ? ((data[data.length - 1].count / data[0].count) * 100).toFixed(2)
    : '0.00';

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <ReactECharts 
        option={option} 
        style={{ height: '400px' }}
        notMerge
        lazyUpdate
      />
      
      {/* 转化率分析 */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <h4 className="text-sm font-semibold text-gray-700 mb-4">转化率分析</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">总体转化率</div>
            <div className="text-2xl font-bold text-blue-600">
              {overallConversionRate}%
            </div>
            <div className="text-xs text-gray-500 mt-1">
              从访问到购买
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">最大流失环节</div>
            <div className="text-lg font-semibold text-red-600">
              {data.reduce((max, item, index) => {
                if (index === 0) return max;
                const prevCount = data[index - 1].count;
                const loss = prevCount - item.count;
                const lossRate = (loss / prevCount) * 100;
                return lossRate > max.rate ? { stage: data[index - 1].stage, rate: lossRate } : max;
              }, { stage: '', rate: 0 }).stage}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              流失率 {data.reduce((max, item, index) => {
                if (index === 0) return 0;
                const prevCount = data[index - 1].count;
                const loss = prevCount - item.count;
                const lossRate = (loss / prevCount) * 100;
                return lossRate > max ? lossRate : max;
              }, 0).toFixed(1)}%
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">平均转化率</div>
            <div className="text-2xl font-bold text-green-600">
              {(data.filter(d => d.conversionRate).reduce((sum, item) => 
                sum + (typeof item.conversionRate === 'string' ? parseFloat(item.conversionRate) : 0), 0
              ) / data.filter(d => d.conversionRate).length || 0).toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500 mt-1">
              各环节平均
            </div>
          </div>
        </div>

        {/* 优化建议 */}
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h5 className="text-sm font-semibold text-blue-900 mb-2">优化建议</h5>
          <ul className="text-sm text-blue-800 space-y-1">
            {data.map((item, index) => {
              if (index === 0 || !item.conversionRate) return null;
              
              const rate = typeof item.conversionRate === 'string' ? parseFloat(item.conversionRate) : 0;
              if (rate < 30) {
                return (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>
                      {data[index - 1].stage} → {item.stage} 
                      转化率较低（{typeof item.conversionRate === 'string' ? item.conversionRate : item.conversionRate}%），建议优化该环节的用户体验
                    </span>
                  </li>
                );
              }
              return null;
            }).filter(Boolean)}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SalesFunnelChart;
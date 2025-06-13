'use client';

import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { PlatformDistribution } from '@/types/kol';

interface PlatformDistributionChartProps {
  data: PlatformDistribution[];
  loading?: boolean;
}

const PlatformDistributionChart: React.FC<PlatformDistributionChartProps> = ({ 
  data, 
  loading = false 
}) => {
  const option = useMemo(() => {
    const chartData = data.map(item => ({
      value: item.count,
      name: item.platform,
      percentage: item.percentage
    }));

    const colors = [
      '#5470c6',
      '#91cc75',
      '#fac858',
      '#ee6666',
      '#73c0de',
      '#3ba272',
      '#fc8452',
      '#9a60b4',
      '#ea7ccc'
    ];

    return {
      title: {
        text: '平台分布',
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
          return `
            <div class="px-3 py-2">
              <div class="font-semibold">${params.name}</div>
              <div class="flex items-center justify-between mt-1">
                <span>数量:</span>
                <span class="ml-2 font-medium">${params.value}</span>
              </div>
              <div class="flex items-center justify-between">
                <span>占比:</span>
                <span class="ml-2 font-medium">${params.data.percentage.toFixed(1)}%</span>
              </div>
            </div>
          `;
        }
      },
      legend: {
        type: 'scroll',
        orient: 'vertical',
        right: 10,
        top: 20,
        bottom: 20,
        data: chartData.map(item => item.name),
        textStyle: {
          color: '#666'
        }
      },
      series: [
        {
          name: '平台分布',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['40%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 20,
              fontWeight: 'bold',
              formatter: (params: any) => {
                return `${params.name}\n${params.data.percentage.toFixed(1)}%`;
              }
            }
          },
          labelLine: {
            show: false
          },
          data: chartData.map((item, index) => ({
            ...item,
            itemStyle: {
              color: colors[index % colors.length]
            }
          }))
        }
      ]
    };
  }, [data]);

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
    </div>
  );
};

export default PlatformDistributionChart;
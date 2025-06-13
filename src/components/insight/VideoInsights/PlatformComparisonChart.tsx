'use client';

import React, { useMemo } from 'react';
import ChartWrapper from '../../common/Chart/ChartWrapper';
import type { EChartsOption } from 'echarts';
import type { PlatformMetrics } from '../../../types/insight';

interface PlatformComparisonChartProps {
  data: PlatformMetrics[];
  loading?: boolean;
}

export const PlatformComparisonChart: React.FC<PlatformComparisonChartProps> = ({ 
  data, 
  loading = false 
}) => {
  const option: EChartsOption = useMemo(() => {
    const platforms = data.map(d => d.platform);
    
    // 雷达图数据准备
    const radarIndicator = [
      { name: '总播放量', max: Math.max(...data.map(d => d.totalViews)) * 1.2 },
      { name: '平均互动率', max: 25 },
      { name: '增长率', max: 50 },
      { name: '视频数量', max: Math.max(...data.map(d => d.topVideos.length)) * 1.5 }
    ];

    const radarData = data.map(platform => ({
      name: platform.platform,
      value: [
        platform.totalViews,
        platform.avgEngagement,
        platform.growthRate,
        platform.topVideos.length
      ]
    }));

    return {
      title: {
        text: '平台综合表现对比',
        left: 'center',
        top: 10
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          if (params.componentType === 'radar') {
            const platform = data.find(d => d.platform === params.name);
            return `
              <div class="p-2">
                <div class="font-semibold mb-2">${params.name}</div>
                <div class="space-y-1 text-sm">
                  <div>总播放量: ${(params.value[0] / 1000000).toFixed(1)}M</div>
                  <div>平均互动率: ${params.value[1].toFixed(1)}%</div>
                  <div>增长率: ${params.value[2].toFixed(1)}%</div>
                  <div>热门视频数: ${params.value[3]}</div>
                </div>
              </div>
            `;
          }
          return params.name;
        }
      },
      legend: {
        data: platforms,
        bottom: 20
      },
      radar: {
        indicator: radarIndicator,
        center: ['50%', '50%'],
        radius: '65%',
        splitNumber: 4,
        shape: 'polygon',
        axisName: {
          color: '#666',
          fontSize: 12
        },
        splitLine: {
          lineStyle: {
            color: '#e5e7eb'
          }
        },
        splitArea: {
          areaStyle: {
            color: ['#f3f4f6', '#ffffff']
          }
        },
        axisLine: {
          lineStyle: {
            color: '#e5e7eb'
          }
        }
      },
      series: [
        {
          type: 'radar',
          data: radarData,
          symbol: 'circle',
          symbolSize: 8,
          lineStyle: {
            width: 2
          },
          areaStyle: {
            opacity: 0.3
          },
          emphasis: {
            lineStyle: {
              width: 3
            },
            areaStyle: {
              opacity: 0.5
            }
          }
        }
      ],
      color: ['#ef4444', '#3b82f6', '#10b981', '#f59e0b']
    };
  }, [data]);

  // 平台详细数据卡片
  const renderPlatformCards = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {data.map((platform, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">{platform.platform}</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">总播放量</span>
                <span className="font-medium">{(platform.totalViews / 1000000).toFixed(1)}M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">平均互动率</span>
                <span className="font-medium">{platform.avgEngagement.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">增长率</span>
                <span className={`font-medium ${platform.growthRate > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {platform.growthRate > 0 ? '+' : ''}{platform.growthRate.toFixed(1)}%
                </span>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <div className="text-gray-600 mb-1">热门内容类型</div>
                <div className="flex flex-wrap gap-1">
                  {Array.from(new Set(platform.topVideos.flatMap(v => v.tags))).slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-white rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <ChartWrapper 
        option={option} 
        height={350}
        loading={loading}
      />
      {renderPlatformCards()}
    </div>
  );
};
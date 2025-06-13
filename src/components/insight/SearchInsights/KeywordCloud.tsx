'use client';

import React, { useMemo } from 'react';
import ChartWrapper from '../../common/Chart/ChartWrapper';
import type { EChartsOption } from 'echarts';
import type { KeywordData } from '../../../types/insight';

interface KeywordCloudProps {
  data: KeywordData[];
  onKeywordClick?: (keyword: string) => void;
  loading?: boolean;
}

export const KeywordCloud: React.FC<KeywordCloudProps> = ({ 
  data, 
  onKeywordClick,
  loading = false 
}) => {
  // 使用TreeMap作为词云的替代方案
  const option: EChartsOption = useMemo(() => {
    const treeMapData = data.map(item => ({
      name: item.keyword,
      value: item.searchVolume,
      itemStyle: {
        color: item.competition === 'high' ? '#ef4444' : 
               item.competition === 'medium' ? '#f59e0b' : '#10b981'
      },
      label: {
        show: true,
        formatter: '{b}',
        fontSize: Math.min(Math.max(12, item.searchVolume / 1000), 24)
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      cpc: item.cpc,
      competition: item.competition,
      trend: item.trend
    }));

    return {
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          return `
            <div class="p-2">
              <div class="font-semibold">${params.name}</div>
              <div class="text-sm mt-1">搜索量: ${params.value.toLocaleString()}</div>
              <div class="text-sm">CPC: ¥${params.data.cpc.toFixed(2)}</div>
              <div class="text-sm">竞争度: ${
                params.data.competition === 'high' ? '高' : 
                params.data.competition === 'medium' ? '中' : '低'
              }</div>
              <div class="text-sm">趋势: ${params.data.trend > 0 ? '+' : ''}${params.data.trend}%</div>
            </div>
          `;
        }
      },
      series: [{
        type: 'treemap',
        breadcrumb: {
          show: false
        },
        roam: false,
        nodeClick: false,
        data: treeMapData,
        leafDepth: 1,
        levels: [{
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 2,
            gapWidth: 2
          }
        }],
        label: {
          position: 'inside' as const,
          formatter: '{b}',
          color: '#fff',
          textBorderColor: 'transparent',
          fontWeight: 'bold'
        }
      }]
    };
  }, [data]);


  // 标签云备选方案
  const renderTagCloud = () => {
    const maxVolume = Math.max(...data.map(d => d.searchVolume));
    const minVolume = Math.min(...data.map(d => d.searchVolume));
    
    const getFontSize = (volume: number) => {
      const normalized = (volume - minVolume) / (maxVolume - minVolume);
      return 14 + normalized * 20; // 14px to 34px
    };

    const getColor = (competition: string) => {
      switch (competition) {
        case 'high': return 'text-red-600';
        case 'medium': return 'text-yellow-600';
        case 'low': return 'text-green-600';
        default: return 'text-gray-600';
      }
    };

    return (
      <div className="flex flex-wrap gap-3 p-6 justify-center items-center min-h-[400px]">
        {data.map((item, index) => (
          <button
            key={index}
            onClick={() => onKeywordClick?.(item.keyword)}
            className={`
              px-3 py-1 rounded-full transition-all duration-200
              hover:shadow-lg hover:scale-110 cursor-pointer
              ${getColor(item.competition)}
            `}
            style={{ fontSize: `${getFontSize(item.searchVolume)}px` }}
          >
            {item.keyword}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div>
      <ChartWrapper 
        option={option} 
        height={400}
        loading={loading}
      />
      {/* 备选方案：标签云 */}
      {/* {renderTagCloud()} */}
    </div>
  );
};
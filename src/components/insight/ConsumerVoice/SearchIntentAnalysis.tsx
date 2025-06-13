'use client';

import React, { useMemo } from 'react';
import ChartWrapper from '../../common/Chart/ChartWrapper';
import type { EChartsOption } from 'echarts';
import type { SearchIntent } from '../../../types/insight';

interface SearchIntentAnalysisProps {
  data: SearchIntent[];
  loading?: boolean;
}

export const SearchIntentAnalysis: React.FC<SearchIntentAnalysisProps> = ({ 
  data, 
  loading = false 
}) => {
  const option: EChartsOption = useMemo(() => {
    if (!data || data.length === 0) {
      return {};
    }
    const intentLabels = {
      'informational': '信息查询',
      'transactional': '交易意图',
      'navigational': '导航定位',
      'commercial': '商业调研'
    };

    const colors = {
      'informational': '#3b82f6',
      'transactional': '#10b981',
      'navigational': '#f59e0b',
      'commercial': '#8b5cf6'
    };

    return {
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const intent = data.find(d => intentLabels[d.intent] === params.name);
          return `
            <div class="p-2">
              <div class="font-semibold">${params.name}</div>
              <div class="text-sm mt-1">占比: ${params.value}%</div>
              <div class="text-sm mt-2">相关关键词:</div>
              <ul class="text-xs mt-1">
                ${intent?.keywords.slice(0, 3).map(kw => `<li>• ${kw}</li>`).join('')}
              </ul>
            </div>
          `;
        }
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: data.map(d => intentLabels[d.intent])
      },
      series: [
        {
          name: '搜索意图',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          padAngle: 2,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            position: 'center',
            formatter: (params: any) => {
              return `{a|${params.name}}\n{b|${params.value}%}`;
            },
            rich: {
              a: {
                color: '#374151',
                fontSize: 14,
                fontWeight: 'bold'
              },
              b: {
                color: '#6b7280',
                fontSize: 20,
                fontWeight: 'bold',
                lineHeight: 30
              }
            }
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: 'bold'
            },
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          labelLine: {
            show: false
          },
          data: data.map(d => ({
            value: d.percentage,
            name: intentLabels[d.intent],
            itemStyle: {
              color: colors[d.intent]
            }
          }))
        }
      ]
    };
  }, [data]);

  // 关键词标签云
  const renderKeywordTags = () => {
    if (!data || data.length === 0) {
      return null;
    }
    
    return (
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">高频搜索关键词</h3>
        <div className="flex flex-wrap gap-2">
          {data.flatMap(d => d.keywords || []).map((keyword, index) => (
            <span 
              key={index}
              className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
            >
              {keyword}
            </span>
          ))}
        </div>
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
      {renderKeywordTags()}
    </div>
  );
};
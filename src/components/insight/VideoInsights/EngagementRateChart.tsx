'use client';

import React, { useMemo } from 'react';
import ChartWrapper from '../../common/Chart/ChartWrapper';
import type { EChartsOption } from 'echarts';
import type { EngagementMetrics, VideoData } from '../../../types/insight';

interface EngagementRateChartProps {
  data: EngagementMetrics[];
  selectedVideo?: VideoData | null;
  loading?: boolean;
}

export const EngagementRateChart: React.FC<EngagementRateChartProps> = ({ 
  data, 
  selectedVideo,
  loading = false 
}) => {
  const option: EChartsOption = useMemo(() => {
    const dates = data.map(d => d.date);
    
    return {
      title: {
        text: selectedVideo ? `${selectedVideo.title} Engagement Trend` : 'Overall Engagement Trend',
        left: 'center',
        textStyle: {
          fontSize: 14
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          animation: false,
          label: {
            backgroundColor: '#505765'
          }
        },
        formatter: (params: any) => {
          let tooltip = `<div class="p-2"><div class="font-semibold mb-2">${params[0].axisValue}</div>`;
          const dataPoint = data.find(d => d.date === params[0].axisValue);
          if (dataPoint) {
            tooltip += `
              <div class="space-y-1">
                <div>Views: ${dataPoint.views.toLocaleString()}</div>
                <div>Likes: ${dataPoint.likes.toLocaleString()}</div>
                <div>Comments: ${dataPoint.comments.toLocaleString()}</div>
                <div>Shares: ${dataPoint.shares.toLocaleString()}</div>
                <div class="font-semibold pt-1 border-t">Engagement Rate: ${dataPoint.engagementRate.toFixed(2)}%</div>
              </div>
            `;
          }
          tooltip += '</div>';
          return tooltip;
        }
      },
      legend: {
        data: ['Likes', 'Comments', 'Shares', 'Engagement Rate'],
        bottom: 0
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
        axisLabel: {
          formatter: (value: string) => {
            const date = new Date(value);
            return `${date.getMonth() + 1}/${date.getDate()}`;
          },
          interval: Math.floor(dates.length / 7)
        }
      },
      yAxis: [
        {
          type: 'value',
          name: 'Interactions',
          position: 'left',
          axisLabel: {
            formatter: (value: number) => {
              if (value >= 1000) {
                return (value / 1000).toFixed(0) + 'k';
              }
              return value.toString();
            }
          }
        },
        {
          type: 'value',
          name: 'Engagement Rate (%)',
          position: 'right',
          axisLabel: {
            formatter: '{value}%'
          }
        }
      ],
      series: [
        {
          name: 'Likes',
          type: 'line',
          smooth: true,
          data: data.map(d => d.likes),
          itemStyle: {
            color: '#ef4444'
          },
          areaStyle: {
            opacity: 0.1
          }
        },
        {
          name: 'Comments',
          type: 'line',
          smooth: true,
          data: data.map(d => d.comments),
          itemStyle: {
            color: '#3b82f6'
          },
          areaStyle: {
            opacity: 0.1
          }
        },
        {
          name: 'Shares',
          type: 'line',
          smooth: true,
          data: data.map(d => d.shares),
          itemStyle: {
            color: '#10b981'
          },
          areaStyle: {
            opacity: 0.1
          }
        },
        {
          name: 'Engagement Rate',
          type: 'line',
          smooth: true,
          yAxisIndex: 1,
          data: data.map(d => d.engagementRate),
          itemStyle: {
            color: '#f59e0b'
          },
          lineStyle: {
            width: 3,
            type: 'dashed'
          },
          markPoint: {
            data: [
              { type: 'max', name: 'Max' },
              { type: 'min', name: 'Min' }
            ]
          },
          markLine: {
            data: [
              { type: 'average', name: 'Average' }
            ]
          }
        }
      ]
    };
  }, [data, selectedVideo]);

  return (
    <ChartWrapper 
      option={option} 
      height={400}
      loading={loading}
    />
  );
};
'use client';

import React, { useMemo } from 'react';
import ChartWrapper from '../../common/Chart/ChartWrapper';
import type { EChartsOption } from 'echarts';

export const TrendAnalysis: React.FC = () => {
  const option: EChartsOption = useMemo(() => {
    const categories = ['产品评测', '使用场景', '开箱体验', '技术分享', '用户故事'];
    const dates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    const generateTrendData = (category: string) => {
      return dates.map(() => Math.floor(Math.random() * 50) + 20);
    };

    return {
      title: {
        text: '内容趋势分析',
        left: 'center',
        textStyle: { fontSize: 14 }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' }
      },
      legend: {
        data: categories,
        bottom: 10
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
          }
        }
      },
      yAxis: {
        type: 'value',
        name: '热度指数'
      },
      series: categories.map((category, index) => ({
        name: category,
        type: 'line',
        smooth: true,
        data: generateTrendData(category),
        areaStyle: { opacity: 0.1 },
        itemStyle: {
          color: ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'][index]
        }
      }))
    };
  }, []);

  const trendInsights = [
    { category: '产品评测', trend: 'up', change: '+23%', description: '用户对深度评测内容的需求持续增长' },
    { category: '使用场景', trend: 'up', change: '+15%', description: '户外场景相关内容受到更多关注' },
    { category: '开箱体验', trend: 'stable', change: '+2%', description: '保持稳定的观看率和互动率' },
    { category: '技术分享', trend: 'down', change: '-8%', description: '技术类内容需要更通俗的表达方式' }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">内容趋势分析</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <ChartWrapper option={option} height={300} />
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">趋势洞察</h4>
          <div className="space-y-3">
            {trendInsights.map((insight, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    insight.trend === 'up' ? 'bg-green-100' :
                    insight.trend === 'down' ? 'bg-red-100' : 'bg-gray-100'
                  }`}>
                    <svg 
                      className={`w-4 h-4 ${
                        insight.trend === 'up' ? 'text-green-600' :
                        insight.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                      }`}
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d={
                          insight.trend === 'up' ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" :
                          insight.trend === 'down' ? "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" :
                          "M5 12h14"
                        }
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{insight.category}</span>
                      <span className={`text-sm font-medium ${
                        insight.trend === 'up' ? 'text-green-600' :
                        insight.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {insight.change}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{insight.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
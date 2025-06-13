'use client';

import React from 'react';
import { ContentPerformance } from './PerformanceDashboard';

interface PerformanceInsightsProps {
  data: ContentPerformance[];
}

export const PerformanceInsights: React.FC<PerformanceInsightsProps> = ({ data }) => {
  // 计算洞察数据
  const calculateInsights = () => {
    const totalViews = data.reduce((sum, item) => sum + item.views, 0);
    const avgEngagement = data.reduce((sum, item) => sum + item.engagement, 0) / data.length;
    const totalConversions = data.reduce((sum, item) => sum + item.conversions, 0);
    
    const bestPerformer = data.reduce((best, item) => 
      item.views > best.views ? item : best
    );
    
    const highestEngagement = data.reduce((best, item) => 
      item.engagement > best.engagement ? item : best
    );
    
    const typePerformance = data.reduce((acc, item) => {
      if (!acc[item.type]) {
        acc[item.type] = { count: 0, views: 0, engagement: 0 };
      }
      acc[item.type].count++;
      acc[item.type].views += item.views;
      acc[item.type].engagement += item.engagement;
      return acc;
    }, {} as Record<string, { count: number; views: number; engagement: number }>);
    
    const bestType = Object.entries(typePerformance).reduce((best, [type, stats]) => {
      const avgViews = stats.views / stats.count;
      return avgViews > best.avgViews ? { type, avgViews } : best;
    }, { type: '', avgViews: 0 });
    
    return {
      totalViews,
      avgEngagement: avgEngagement.toFixed(1),
      totalConversions,
      bestPerformer,
      highestEngagement,
      bestType: bestType.type,
      insights: [
        {
          type: 'success',
          title: '最佳表现内容',
          description: `"${bestPerformer.title}" 获得了 ${bestPerformer.views.toLocaleString()} 次浏览，是本期表现最好的内容。`,
          recommendation: '建议创作更多类似主题的内容，并分析其成功要素。'
        },
        {
          type: 'info',
          title: '互动率分析',
          description: `"${highestEngagement.title}" 的互动率达到 ${highestEngagement.engagement}%，显著高于平均水平。`,
          recommendation: '研究该内容的互动元素，并应用到其他内容中。'
        },
        {
          type: 'warning',
          title: '内容类型表现',
          description: `${bestType.type === 'video' ? '视频' : bestType.type === 'article' ? '文章' : bestType.type === 'social' ? '社交媒体' : '信息图'}内容平均表现最佳。`,
          recommendation: '考虑增加该类型内容的产出比例。'
        },
        {
          type: 'tip',
          title: '优化建议',
          description: `当前平均跳出率较高的内容需要优化，特别是停留时间低于1分钟的内容。`,
          recommendation: '改进内容开头的吸引力，增加互动元素。'
        }
      ]
    };
  };

  const insights = calculateInsights();

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success':
        return (
          <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
      case 'info':
        return (
          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">效果洞察与建议</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {insights.insights.map((insight, index) => (
          <div key={index} className="flex space-x-4">
            {getInsightIcon(insight.type)}
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900 mb-1">{insight.title}</h4>
              <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
              <p className="text-xs text-gray-500">
                <span className="font-medium">建议：</span> {insight.recommendation}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* 关键指标总结 */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">{insights.totalViews.toLocaleString()}</p>
            <p className="text-sm text-gray-500">总浏览量</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{insights.avgEngagement}%</p>
            <p className="text-sm text-gray-500">平均互动率</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{insights.totalConversions.toLocaleString()}</p>
            <p className="text-sm text-gray-500">总转化数</p>
          </div>
        </div>
      </div>
    </div>
  );
};
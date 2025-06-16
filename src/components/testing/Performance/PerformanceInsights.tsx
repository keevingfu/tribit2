'use client';

import React from 'react';
import { ContentPerformance } from './PerformanceDashboard';

interface PerformanceInsightsProps {
  data: ContentPerformance[];
}

export const PerformanceInsights: React.FC<PerformanceInsightsProps> = ({ data }) => {
  // Calculate insights data
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
          title: 'Best Performing Content',
          description: `"${bestPerformer.title}" achieved ${bestPerformer.views.toLocaleString()} views, the best performing content this period.`,
          recommendation: 'Consider creating more content on similar topics and analyze its success factors.'
        },
        {
          type: 'info',
          title: 'Engagement Analysis',
          description: `"${highestEngagement.title}" achieved ${highestEngagement.engagement}% engagement rate, significantly above average.`,
          recommendation: 'Study the engagement elements and apply them to other content.'
        },
        {
          type: 'warning',
          title: 'Content Type Performance',
          description: `${bestType.type === 'video' ? 'Video' : bestType.type === 'article' ? 'Article' : bestType.type === 'social' ? 'Social Media' : 'Infographic'} content performs best on average.`,
          recommendation: 'Consider increasing the proportion of this content type.'
        },
        {
          type: 'tip',
          title: 'Optimization Suggestions',
          description: `Content with high bounce rates needs optimization, especially those with time spent under 1 minute.`,
          recommendation: 'Improve the appeal of content openings and add interactive elements.'
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
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Insights & Recommendations</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {insights.insights.map((insight, index) => (
          <div key={index} className="flex space-x-4">
            {getInsightIcon(insight.type)}
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900 mb-1">{insight.title}</h4>
              <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
              <p className="text-xs text-gray-500">
                <span className="font-medium">Recommendation:</span> {insight.recommendation}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Key Metrics Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">{insights.totalViews.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Total Views</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{insights.avgEngagement}%</p>
            <p className="text-sm text-gray-500">Average Engagement</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{insights.totalConversions.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Total Conversions</p>
          </div>
        </div>
      </div>
    </div>
  );
};
'use client';

import React from 'react';
import { Campaign } from './ExecutionDashboard';

interface PerformanceMetricsProps {
  campaigns: Campaign[];
}

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ campaigns }) => {
  // 计算总体指标
  const totalMetrics = campaigns.reduce((acc, campaign) => {
    return {
      views: acc.views + campaign.metrics.views,
      engagement: acc.engagement + campaign.metrics.engagement,
      conversions: acc.conversions + campaign.metrics.conversions,
      roi: acc.roi + campaign.metrics.roi
    };
  }, { views: 0, engagement: 0, conversions: 0, roi: 0 });

  const avgEngagement = campaigns.length > 0 ? (totalMetrics.engagement / campaigns.length).toFixed(1) : '0';
  const avgROI = campaigns.length > 0 ? (totalMetrics.roi / campaigns.length).toFixed(1) : '0';

  const metrics = [
    {
      title: '总浏览量',
      value: totalMetrics.views.toLocaleString(),
      change: '+12.5%',
      trend: 'up',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )
    },
    {
      title: '平均互动率',
      value: `${avgEngagement}%`,
      change: '+5.3%',
      trend: 'up',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    },
    {
      title: '总转化数',
      value: totalMetrics.conversions.toLocaleString(),
      change: '+8.7%',
      trend: 'up',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    },
    {
      title: '平均 ROI',
      value: `${avgROI}x`,
      change: '-2.1%',
      trend: 'down',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div className="text-gray-400">{metric.icon}</div>
            <div className={`flex items-center text-sm ${
              metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {metric.trend === 'up' ? (
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              ) : (
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              )}
              {metric.change}
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-gray-900">{metric.value}</h3>
            <p className="text-sm text-gray-500 mt-1">{metric.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
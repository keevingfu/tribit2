'use client';

import React from 'react';
import type { VideoData } from '@/types/insight';

interface ViralMetricsProps {
  videos: VideoData[];
  timeRange: string;
}

export const ViralMetrics: React.FC<ViralMetricsProps> = ({ videos }) => {
  const totalViews = videos.reduce((sum, video) => sum + video.views, 0);
  const totalShares = videos.reduce((sum, video) => sum + video.shares, 0);
  const avgEngagementRate = videos.reduce((sum, video) => sum + video.engagementRate, 0) / videos.length;
  const viralVideoCount = videos.filter(video => video.engagementRate > 15).length;

  const metrics = [
    {
      title: 'Viral Videos',
      value: viralVideoCount,
      unit: '',
      change: '+12.5%'
    },
    {
      title: 'Total Reach',
      value: Math.floor(totalViews / 1000000 * 10) / 10,
      unit: 'M',
      change: '+45.8%'
    },
    {
      title: 'Avg Engagement',
      value: avgEngagementRate.toFixed(1),
      unit: '%',
      change: '+8.2%'
    },
    {
      title: 'Viral Coefficient',
      value: (totalShares / totalViews * 100).toFixed(3),
      unit: '%',
      change: '+2.1%'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-500">{metric.title}</p>
          <div className="flex items-baseline">
            <p className="text-2xl font-bold text-gray-900">
              {metric.value}
              <span className="text-lg font-medium text-gray-500 ml-1">{metric.unit}</span>
            </p>
          </div>
          <div className="flex items-center text-sm font-medium text-green-600">
            <svg className="w-4 h-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            {metric.change}
          </div>
        </div>
      ))}
    </div>
  );
};
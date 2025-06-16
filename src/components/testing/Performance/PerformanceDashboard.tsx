'use client';

import React, { useState } from 'react';
import { MetricsOverview } from './MetricsOverview';
import { PerformanceChart } from './PerformanceChart';
import { ContentPerformanceTable } from './ContentPerformanceTable';
import { PerformanceInsights } from './PerformanceInsights';

export interface ContentPerformance {
  id: string;
  title: string;
  type: 'video' | 'article' | 'social' | 'infographic';
  platform: string;
  publishDate: string;
  views: number;
  engagement: number;
  shares: number;
  conversions: number;
  avgTimeSpent: number;
  bounceRate: number;
  trend: 'up' | 'down' | 'stable';
}

export interface PerformanceMetric {
  name: string;
  value: number;
  change: number;
  period: string;
}

export const PerformanceDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<'views' | 'engagement' | 'conversions'>('views');

  // Generate sample data
  const performanceData: ContentPerformance[] = [
    {
      id: '1',
      title: 'Tribit StormBox Pro Review: New Benchmark for Outdoor Speakers',
      type: 'video',
      platform: 'YouTube',
      publishDate: '2024-05-15',
      views: 85420,
      engagement: 12.5,
      shares: 2340,
      conversions: 856,
      avgTimeSpent: 425,
      bounceRate: 23.5,
      trend: 'up'
    },
    {
      id: '2',
      title: 'Summer Music Festival Essentials: Top 5 Portable Speakers',
      type: 'article',
      platform: 'Blog',
      publishDate: '2024-05-20',
      views: 42100,
      engagement: 8.7,
      shares: 1120,
      conversions: 421,
      avgTimeSpent: 180,
      bounceRate: 35.2,
      trend: 'stable'
    },
    {
      id: '3',
      title: 'Tribit MaxSound Plus Unboxing Experience',
      type: 'social',
      platform: 'Instagram',
      publishDate: '2024-05-25',
      views: 28500,
      engagement: 15.3,
      shares: 850,
      conversions: 285,
      avgTimeSpent: 45,
      bounceRate: 0,
      trend: 'up'
    },
    {
      id: '4',
      title: 'Portable Speaker Buying Guide',
      type: 'infographic',
      platform: 'Pinterest',
      publishDate: '2024-05-28',
      views: 15200,
      engagement: 6.2,
      shares: 520,
      conversions: 152,
      avgTimeSpent: 90,
      bounceRate: 42.1,
      trend: 'down'
    }
  ];

  const metrics: PerformanceMetric[] = [
    { name: 'Total Views', value: 171220, change: 12.5, period: 'vs last period' },
    { name: 'Avg Engagement', value: 10.7, change: 5.3, period: 'vs last period' },
    { name: 'Total Conversions', value: 1714, change: -2.1, period: 'vs last period' },
    { name: 'Avg Time Spent', value: 185, change: 8.7, period: 'vs last period' }
  ];

  const periodOptions = [
    { value: '7d' as const, label: 'Last 7 days' },
    { value: '30d' as const, label: 'Last 30 days' },
    { value: '90d' as const, label: 'Last 90 days' },
    { value: '1y' as const, label: 'Last 1 year' }
  ];

  const metricOptions = [
    { value: 'views' as const, label: 'Views' },
    { value: 'engagement' as const, label: 'Engagement' },
    { value: 'conversions' as const, label: 'Conversions' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Content Performance Analysis</h2>
          <p className="text-gray-600 mt-1">Monitor and analyze overall content marketing performance</p>
        </div>
        <div className="flex space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {periodOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Export Report
          </button>
        </div>
      </div>

      {/* Metrics Overview */}
      <MetricsOverview metrics={metrics} />

      {/* Performance Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Performance Trends</h3>
          <div className="flex space-x-2">
            {metricOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setSelectedMetric(option.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedMetric === option.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <PerformanceChart metric={selectedMetric} period={selectedPeriod} />
      </div>

      {/* Content Performance Table */}
      <ContentPerformanceTable data={performanceData} />

      {/* Performance Insights */}
      <PerformanceInsights data={performanceData} />
    </div>
  );
};
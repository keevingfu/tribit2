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

  // 生成示例数据
  const performanceData: ContentPerformance[] = [
    {
      id: '1',
      title: 'Tribit StormBox Pro 评测：户外音响的新标杆',
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
      title: '夏季音乐节必备：5款便携音响推荐',
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
      title: 'Tribit MaxSound Plus 开箱体验',
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
      title: '便携音响选购指南',
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
    { name: '总浏览量', value: 171220, change: 12.5, period: '较上期' },
    { name: '平均互动率', value: 10.7, change: 5.3, period: '较上期' },
    { name: '总转化数', value: 1714, change: -2.1, period: '较上期' },
    { name: '平均停留时间', value: 185, change: 8.7, period: '较上期' }
  ];

  const periodOptions = [
    { value: '7d' as const, label: '最近7天' },
    { value: '30d' as const, label: '最近30天' },
    { value: '90d' as const, label: '最近90天' },
    { value: '1y' as const, label: '最近1年' }
  ];

  const metricOptions = [
    { value: 'views' as const, label: '浏览量' },
    { value: 'engagement' as const, label: '互动率' },
    { value: 'conversions' as const, label: '转化率' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">内容效果分析</h2>
          <p className="text-gray-600 mt-1">监控和分析内容营销的整体表现</p>
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
            导出报告
          </button>
        </div>
      </div>

      {/* Metrics Overview */}
      <MetricsOverview metrics={metrics} />

      {/* Performance Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">效果趋势</h3>
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
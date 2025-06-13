'use client';

import React, { useState } from 'react';
import { VideoRankingList } from './VideoRankingList';
import { EngagementRateChart } from './EngagementRateChart';
import { PlatformComparisonChart } from './PlatformComparisonChart';
import type { VideoData, EngagementMetrics, PlatformMetrics } from '@/types/insight';

export const ViralVideoInsights: React.FC = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<'all' | 'youtube' | 'tiktok' | 'instagram'>('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');

  // 生成示例视频数据
  const generateVideoData = (): VideoData[] => {
    const platforms = ['YouTube', 'TikTok', 'Instagram'];
    const creators = [
      { name: '科技达人', avatar: 'https://picsum.photos/40/40?random=1', followers: 520000 },
      { name: '音响测评师', avatar: 'https://picsum.photos/40/40?random=2', followers: 180000 },
      { name: '数码生活家', avatar: 'https://picsum.photos/40/40?random=3', followers: 350000 },
      { name: '潮流玩家', avatar: 'https://picsum.photos/40/40?random=4', followers: 920000 },
      { name: '户外探险家', avatar: 'https://picsum.photos/40/40?random=5', followers: 430000 }
    ];

    return Array.from({ length: 10 }, (_, i) => ({
      id: `video-${i + 1}`,
      title: `Tribit音响测评${i + 1} - 震撼音质体验`,
      platform: platforms[i % 3].toLowerCase() as 'youtube' | 'tiktok' | 'instagram',
      thumbnail: `https://picsum.photos/320/180?random=${i + 10}`,
      url: `https://example.com/video/${i + 1}`,
      views: Math.floor(Math.random() * 1000000) + 100000,
      likes: Math.floor(Math.random() * 50000) + 5000,
      comments: Math.floor(Math.random() * 5000) + 500,
      shares: Math.floor(Math.random() * 10000) + 1000,
      engagementRate: Math.random() * 10 + 2,
      publishDate: new Date(2024, 0, i + 1).toISOString().split('T')[0],
      creator: creators[i % 5],
      tags: ['音响', '测评', '科技'],
      duration: Math.floor(Math.random() * 600) + 60
    }));
  };

  // 生成互动率数据
  const generateEngagementData = (): EngagementMetrics[] => {
    const dates = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toISOString().split('T')[0];
    });

    return dates.map(date => ({
      date,
      likes: Math.floor(Math.random() * 50000) + 5000,
      comments: Math.floor(Math.random() * 5000) + 500,
      shares: Math.floor(Math.random() * 10000) + 1000,
      views: Math.floor(Math.random() * 1000000) + 100000,
      engagementRate: Math.random() * 8 + 2
    }));
  };

  const videoData = generateVideoData();
  const engagementData = generateEngagementData();
  
  // 生成平台对比数据
  const platformData: PlatformMetrics[] = [
    {
      platform: 'YouTube',
      totalViews: 8500000,
      avgEngagement: 4.5,
      topVideos: videoData.filter(v => v.platform === 'youtube').slice(0, 5),
      growthRate: 15.5
    },
    {
      platform: 'TikTok',
      totalViews: 12000000,
      avgEngagement: 8.2,
      topVideos: videoData.filter(v => v.platform === 'tiktok').slice(0, 5),
      growthRate: 45.8
    },
    {
      platform: 'Instagram',
      totalViews: 4500000,
      avgEngagement: 6.1,
      topVideos: videoData.filter(v => v.platform === 'instagram').slice(0, 5),
      growthRate: 22.3
    }
  ];

  // 根据平台筛选视频
  const filteredVideos = selectedPlatform === 'all' 
    ? videoData 
    : videoData.filter(v => v.platform.toLowerCase() === selectedPlatform);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">病毒视频洞察</h2>
        <div className="flex space-x-4">
          {/* Platform Filter */}
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">所有平台</option>
            <option value="youtube">YouTube</option>
            <option value="tiktok">TikTok</option>
            <option value="instagram">Instagram</option>
          </select>
          
          {/* Time Range */}
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">最近7天</option>
            <option value="30d">最近30天</option>
            <option value="90d">最近90天</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">总视频数</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">{filteredVideos.length}</p>
          <p className="mt-1 text-sm text-green-600">+15.5% vs 上周</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">平均观看量</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {Math.floor(filteredVideos.reduce((sum, v) => sum + v.views, 0) / filteredVideos.length).toLocaleString()}
          </p>
          <p className="mt-1 text-sm text-green-600">+23.8% vs 上周</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">平均互动率</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {(filteredVideos.reduce((sum, v) => sum + v.engagementRate, 0) / filteredVideos.length).toFixed(1)}%
          </p>
          <p className="mt-1 text-sm text-green-600">+2.1% vs 上周</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">总分享数</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {filteredVideos.reduce((sum, v) => sum + v.shares, 0).toLocaleString()}
          </p>
          <p className="mt-1 text-sm text-green-600">+45.2% vs 上周</p>
        </div>
      </div>

      {/* Video Ranking */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">热门视频排行榜</h3>
          <VideoRankingList videos={filteredVideos} />
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement Rate Trend */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">互动率趋势</h3>
          <EngagementRateChart data={engagementData} />
        </div>

        {/* Platform Comparison */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">平台表现对比</h3>
          <PlatformComparisonChart data={platformData} />
        </div>
      </div>
    </div>
  );
};


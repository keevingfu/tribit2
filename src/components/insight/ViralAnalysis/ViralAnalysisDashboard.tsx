'use client';

import React, { useState } from 'react';
import { ViralMetrics } from './ViralMetrics';
import { ViralFactorAnalysis } from './ViralFactorAnalysis';
import { ViralChart } from './ViralChart';
import type { VideoData } from '@/types/insight';

export const ViralAnalysisDashboard: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);

  // 生成示例病毒视频数据
  const generateViralVideos = (): VideoData[] => {
    const titles = [
      'Tribit音响震撼低音测试 - 邻居都惊呆了！',
      '100块的音响能有多好？Tribit开箱真实体验',
      '这款音响让我重新认识了便携音响',
      'Tribit音响户外测试 - 防水防尘挑战',
      '音响发烧友深度测评：Tribit值得买吗？'
    ];

    const creators = [
      { name: '科技老王', avatar: 'https://picsum.photos/40/40?random=10', followers: 850000 },
      { name: '数码小妹', avatar: 'https://picsum.photos/40/40?random=11', followers: 560000 },
      { name: '音响发烧友', avatar: 'https://picsum.photos/40/40?random=12', followers: 320000 },
      { name: '户外达人', avatar: 'https://picsum.photos/40/40?random=13', followers: 720000 },
      { name: '评测君', avatar: 'https://picsum.photos/40/40?random=14', followers: 1200000 }
    ];

    return titles.map((title, i) => ({
      id: `viral-${i + 1}`,
      title,
      platform: ['youtube', 'tiktok', 'instagram'][i % 3] as 'youtube' | 'tiktok' | 'instagram',
      thumbnail: `https://picsum.photos/320/180?random=${i + 20}`,
      url: `https://example.com/viral/${i + 1}`,
      views: Math.floor(Math.random() * 5000000) + 1000000, // 1M-6M views
      likes: Math.floor(Math.random() * 200000) + 50000,
      comments: Math.floor(Math.random() * 20000) + 5000,
      shares: Math.floor(Math.random() * 50000) + 10000,
      engagementRate: Math.random() * 10 + 15, // 15-25% for viral videos
      publishDate: new Date(2024, 0, i * 3 + 1).toISOString().split('T')[0],
      creator: creators[i],
      tags: ['音响', '测评', '科技', '开箱', '户外'][Math.floor(Math.random() * 5)] ? ['音响', '测评'] : ['科技', '开箱'],
      duration: Math.floor(Math.random() * 300) + 120 // 2-7 minutes
    }));
  };

  const viralVideos = generateViralVideos();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">病毒传播分析</h2>
          <p className="text-gray-600 mt-1">分析内容的病毒传播因子和增长模式</p>
        </div>
        <div className="flex space-x-4">
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

      {/* Viral Metrics Overview */}
      <ViralMetrics videos={viralVideos} timeRange={selectedTimeRange} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Viral Factor Analysis */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">病毒因子分析</h3>
          <ViralFactorAnalysis videos={viralVideos} selectedVideo={selectedVideo} />
        </div>

        {/* Viral Growth Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">传播增长曲线</h3>
          <ViralChart videos={viralVideos} timeRange={selectedTimeRange} />
        </div>
      </div>

      {/* Video List with Viral Metrics */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">病毒视频排行</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    视频信息
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    播放量
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    互动率
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    病毒系数
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    传播速度
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {viralVideos.map((video, index) => {
                  const viralCoefficient = (video.shares / video.views * 100).toFixed(2);
                  const spreadRate = Math.floor(video.views / 7); // Views per day assuming 7 days
                  
                  return (
                    <tr
                      key={video.id}
                      className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                        selectedVideo?.id === video.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedVideo(video)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img
                            className="h-12 w-20 rounded object-cover"
                            src={video.thumbnail}
                            alt={video.title}
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 line-clamp-2 max-w-xs">
                              {video.title}
                            </div>
                            <div className="text-sm text-gray-500">{video.creator.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {(video.views / 1000000).toFixed(1)}M
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {video.engagementRate.toFixed(1)}%
                        </div>
                        <div className={`text-xs ${video.engagementRate > 20 ? 'text-green-600' : 'text-yellow-600'}`}>
                          {video.engagementRate > 20 ? '超高' : '高'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{viralCoefficient}%</div>
                        <div className={`text-xs ${parseFloat(viralCoefficient) > 1 ? 'text-green-600' : 'text-orange-600'}`}>
                          {parseFloat(viralCoefficient) > 1 ? '病毒级' : '良好'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {(spreadRate / 1000).toFixed(0)}K/天
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
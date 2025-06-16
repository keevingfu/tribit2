'use client';

import React, { useState } from 'react';
import { ViralMetrics } from './ViralMetrics';
import { ViralFactorAnalysis } from './ViralFactorAnalysis';
import { ViralChart } from './ViralChart';
import { ResponsiveVideoGrid } from '@/components/common/VideoPreview';
import type { VideoData } from '@/types/insight';

export const ViralAnalysisDashboard: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // 生成示例病毒视频数据
  const generateViralVideos = (): VideoData[] => {
    const titles = [
      'Tribit Speaker Bass Test - Neighbors Were Shocked!',
      'How Good Can a $100 Speaker Be? Tribit Unboxing',
      'This Speaker Changed My View on Portable Audio',
      'Tribit Speaker Outdoor Test - Waterproof Challenge',
      'Audiophile Deep Review: Is Tribit Worth Buying?'
    ];

    const creators = [
      { name: 'Tech Master', avatar: 'https://picsum.photos/40/40?random=10', followers: 850000 },
      { name: 'Digital Girl', avatar: 'https://picsum.photos/40/40?random=11', followers: 560000 },
      { name: 'Audio Enthusiast', avatar: 'https://picsum.photos/40/40?random=12', followers: 320000 },
      { name: 'Outdoor Expert', avatar: 'https://picsum.photos/40/40?random=13', followers: 720000 },
      { name: 'Review King', avatar: 'https://picsum.photos/40/40?random=14', followers: 1200000 }
    ];

    return titles.map((title, i) => ({
      id: `viral-${i + 1}`,
      title,
      platform: ['youtube', 'tiktok', 'instagram'][i % 3] as 'youtube' | 'tiktok' | 'instagram',
      thumbnail: `https://picsum.photos/320/180?random=${i + 20}`,
      url: ['youtube', 'tiktok', 'instagram'][i % 3] === 'youtube'
        ? `https://www.youtube.com/watch?v=${['JGwWNGJdvx8', 'YQHsXMglC9A', '7wtfhZwyrcc', 'L_jWHffIx5E', '0KSOMA3QBU0'][i]}`
        : ['youtube', 'tiktok', 'instagram'][i % 3] === 'tiktok'
        ? `https://www.tiktok.com/@tribitaudio/video/${7100000000000000000 + i}`
        : `https://www.instagram.com/reel/${['CViral123456', 'CViral234567', 'CViral345678', 'CViral456789', 'CViral567890'][i]}/`,
      views: Math.floor(Math.random() * 5000000) + 1000000, // 1M-6M views
      likes: Math.floor(Math.random() * 200000) + 50000,
      comments: Math.floor(Math.random() * 20000) + 5000,
      shares: Math.floor(Math.random() * 50000) + 10000,
      engagementRate: Math.random() * 10 + 15, // 15-25% for viral videos
      publishDate: new Date(2024, 0, i * 3 + 1).toISOString().split('T')[0],
      creator: creators[i],
      tags: ['speaker', 'review', 'tech', 'unboxing', 'outdoor'][Math.floor(Math.random() * 5)] ? ['speaker', 'review'] : ['tech', 'unboxing'],
      duration: Math.floor(Math.random() * 300) + 120 // 2-7 minutes
    }));
  };

  const viralVideos = generateViralVideos();

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Viral Analysis</h2>
          <p className="text-gray-600 mt-1">Analyze viral factors and growth patterns of content</p>
        </div>
        <div className="flex space-x-4">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'table' 
                  ? 'bg-white text-gray-900 shadow' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-white text-gray-900 shadow' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Preview
            </button>
          </div>
          
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Viral Metrics Overview */}
      <ViralMetrics videos={viralVideos} timeRange={selectedTimeRange} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Viral Factor Analysis */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Viral Factor Analysis</h3>
          <ViralFactorAnalysis videos={viralVideos} selectedVideo={selectedVideo} />
        </div>

        {/* Viral Growth Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Viral Growth Curve</h3>
          <ViralChart videos={viralVideos} timeRange={selectedTimeRange} />
        </div>
      </div>

      {/* Video List with Viral Metrics */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Viral Video Rankings</h3>
          {viewMode === 'table' ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Video Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Engagement
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Viral Coefficient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Spread Rate
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
                            {video.engagementRate > 20 ? 'Very High' : 'High'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">{viralCoefficient}%</div>
                          <div className={`text-xs ${parseFloat(viralCoefficient) > 1 ? 'text-green-600' : 'text-orange-600'}`}>
                            {parseFloat(viralCoefficient) > 1 ? 'Viral' : 'Good'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            {(spreadRate / 1000).toFixed(0)}K/day
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <ResponsiveVideoGrid
              videos={viralVideos.map(video => ({
                url: video.url,
                platform: video.platform,
                title: video.title,
                thumbnail: video.thumbnail,
                duration: formatDuration(video.duration),
                creator: video.creator.name
              }))}
              aspectRatio="16/9"
              onVideoPlay={(videoPreview) => {
                const original = viralVideos.find(v => v.url === videoPreview.url);
                if (original) setSelectedVideo(original);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
'use client';

import React, { useState, useEffect } from 'react';
import { VideoRankingList } from './VideoRankingList';
import { EngagementRateChart } from './EngagementRateChart';
import { PlatformComparisonChart } from './PlatformComparisonChart';
import { ResponsiveVideoGrid, VideoGrid } from '@/components/common/VideoPreview';
import { TikTokAnalytics } from './TikTokAnalytics';
import type { VideoData, EngagementMetrics, PlatformMetrics } from '@/types/insight';

export const ViralVideoInsights: React.FC = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<'all' | 'youtube' | 'tiktok' | 'instagram'>('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [showTikTokAnalytics, setShowTikTokAnalytics] = useState(false);
  const [realTikTokVideos, setRealTikTokVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch real TikTok data
  useEffect(() => {
    if (selectedPlatform === 'tiktok' || selectedPlatform === 'all') {
      fetchTikTokVideos();
    }
  }, [selectedPlatform]);

  const fetchTikTokVideos = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/insight/video/tiktok/videos?pageSize=20');
      const result = await response.json();
      
      if (result.success) {
        const tiktokVideos: VideoData[] = result.data.map((video: any) => ({
          id: video.id,
          title: video.title,
          platform: 'tiktok' as const,
          thumbnail: video.thumbnail,
          url: video.url,
          views: video.views,
          likes: Math.floor(video.views * 0.1), // Estimate 10% like rate
          comments: Math.floor(video.views * 0.02), // Estimate 2% comment rate
          shares: Math.floor(video.views * 0.05), // Estimate 5% share rate
          engagementRate: video.gpm || 5.5,
          publishDate: new Date().toISOString().split('T')[0],
          creator: {
            name: video.creator_name,
            avatar: video.thumbnail,
            followers: video.follower_count
          },
          tags: ['TikTok', 'Tribit'],
          duration: video.duration
        }));
        setRealTikTokVideos(tiktokVideos);
      }
    } catch (error) {
      console.error('Failed to fetch TikTok videos:', error);
    } finally {
      setLoading(false);
    }
  };

  // 生成示例视频数据
  const generateVideoData = (): VideoData[] => {
    const platforms = ['YouTube', 'TikTok', 'Instagram'];
    const creators = [
      { name: 'Tech Expert', avatar: 'https://picsum.photos/40/40?random=1', followers: 520000 },
      { name: 'Audio Reviewer', avatar: 'https://picsum.photos/40/40?random=2', followers: 180000 },
      { name: 'Digital Lifestyle', avatar: 'https://picsum.photos/40/40?random=3', followers: 350000 },
      { name: 'Trend Player', avatar: 'https://picsum.photos/40/40?random=4', followers: 920000 },
      { name: 'Outdoor Explorer', avatar: 'https://picsum.photos/40/40?random=5', followers: 430000 }
    ];

    return Array.from({ length: 50 }, (_, i) => ({
      id: `video-${i + 1}`,
      title: `Tribit Speaker Review ${i + 1} - Amazing Sound Quality`,
      platform: platforms[i % 3].toLowerCase() as 'youtube' | 'tiktok' | 'instagram',
      thumbnail: `https://picsum.photos/320/180?random=${i + 10}`,
      url: platforms[i % 3].toLowerCase() === 'youtube' 
        ? `https://www.youtube.com/watch?v=${['dQw4w9WgXcQ', 'jNQXAC9IVRw', '9bZkp7q19f0', 'kJQP7kiw5Fk', 'RgKAFK5djSk'][i % 5]}`
        : platforms[i % 3].toLowerCase() === 'tiktok'
        ? `https://www.tiktok.com/@tribitaudio/video/${7000000000000000000 + i}`
        : `https://www.instagram.com/reel/${['C1234567890', 'C2345678901', 'C3456789012', 'C4567890123', 'C5678901234'][i % 5]}/`,
      views: Math.floor(Math.random() * 1000000) + 100000,
      likes: Math.floor(Math.random() * 50000) + 5000,
      comments: Math.floor(Math.random() * 5000) + 500,
      shares: Math.floor(Math.random() * 10000) + 1000,
      engagementRate: Math.random() * 10 + 2,
      publishDate: new Date(2024, 0, i + 1).toISOString().split('T')[0],
      creator: creators[i % 5],
      tags: ['speaker', 'review', 'tech'],
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

  const generatedData = generateVideoData();
  const videoData = selectedPlatform === 'tiktok' && realTikTokVideos.length > 0 
    ? realTikTokVideos 
    : selectedPlatform === 'all' 
    ? [...generatedData, ...realTikTokVideos]
    : generatedData;
    
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
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

  // State for view mode
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Viral Video Insights</h2>
        <div className="flex space-x-4">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'list' 
                  ? 'bg-white text-gray-900 shadow' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-white text-gray-900 shadow' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Grid
            </button>
          </div>
          
          {/* Platform Filter */}
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Platforms</option>
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
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Videos</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">{filteredVideos.length}</p>
          <p className="mt-1 text-sm text-green-600">+15.5% vs last week</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Average Views</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {Math.floor(filteredVideos.reduce((sum, v) => sum + v.views, 0) / filteredVideos.length).toLocaleString()}
          </p>
          <p className="mt-1 text-sm text-green-600">+23.8% vs last week</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Average Engagement</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {(filteredVideos.reduce((sum, v) => sum + v.engagementRate, 0) / filteredVideos.length).toFixed(1)}%
          </p>
          <p className="mt-1 text-sm text-green-600">+2.1% vs last week</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Shares</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {filteredVideos.reduce((sum, v) => sum + v.shares, 0).toLocaleString()}
          </p>
          <p className="mt-1 text-sm text-green-600">+45.2% vs last week</p>
        </div>
      </div>

      {/* Video Display */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Videos Ranking</h3>
          {viewMode === 'list' ? (
            <VideoRankingList 
              videos={filteredVideos} 
              onVideoSelect={setSelectedVideo}
              selectedVideo={selectedVideo}
            />
          ) : (
            filteredVideos.length > 20 ? (
              <VideoGrid
                videos={filteredVideos.map(video => ({
                  url: video.url,
                  platform: video.platform as 'youtube' | 'instagram' | 'tiktok',
                  title: video.title,
                  thumbnail: video.thumbnail,
                  duration: formatDuration(video.duration),
                  creator: video.creator.name
                }))}
                columns={3}
                itemHeight={280}
                gridHeight={600}
                aspectRatio="16/9"
                onVideoPlay={(video) => {
                  const original = filteredVideos.find(v => v.url === video.url);
                  if (original) setSelectedVideo(original);
                }}
              />
            ) : (
              <ResponsiveVideoGrid
                videos={filteredVideos.map(video => ({
                  url: video.url,
                  platform: video.platform as 'youtube' | 'instagram' | 'tiktok',
                  title: video.title,
                  thumbnail: video.thumbnail,
                  duration: formatDuration(video.duration),
                  creator: video.creator.name
                }))}
                aspectRatio="16/9"
                onVideoPlay={(video) => {
                  const original = filteredVideos.find(v => v.url === video.url);
                  if (original) setSelectedVideo(original);
                }}
              />
            )
          )}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement Rate Trend */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Rate Trend</h3>
          <EngagementRateChart data={engagementData} />
        </div>

        {/* Platform Comparison */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Performance Comparison</h3>
          <PlatformComparisonChart data={platformData} />
        </div>
      </div>
    </div>
  );
};


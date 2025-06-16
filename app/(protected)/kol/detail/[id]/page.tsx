'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ExternalLink, 
  Eye, 
  Heart,
  MessageCircle,
  Calendar,
  MapPin,
  Hash,
  MoreVertical,
  PlayCircle
} from 'lucide-react';
import { kolClientService } from '@/services/kol-client.service';
import { KOLDetail, TimeRange } from '@/types/kol';
import { FollowerGrowthChart, ContentPerformanceChart } from '@/components/kol/Overview';
import { formatNumber, formatDate } from '@/utils/format';

interface DetailPageProps {
  params: { id: string };
}

const DetailPage: React.FC<DetailPageProps> = ({ params }) => {
  const id = params.id;
  const [kolDetail, setKolDetail] = useState<KOLDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [activeTab, setActiveTab] = useState<'videos' | 'analytics' | 'audience'>('videos');

  useEffect(() => {
    if (id) {
      fetchKOLDetail(id);
    }
  }, [id]);

  const fetchKOLDetail = async (kolId: string) => {
    try {
      setLoading(true);
      const detail = await kolClientService.getKOLDetail(kolId);
      setKolDetail(detail);
    } catch (error) {
      console.error('Error fetching KOL detail:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!kolDetail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">KOL Not Found</h2>
          <p className="text-gray-600 mb-4">Cannot find information for this KOL</p>
          <Link
            href="/kol/overview"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to KOL List</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部背景 */}
      <div className="relative h-64 bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="absolute inset-0 bg-black bg-opacity-20" />
        
        {/* 返回按钮 */}
        <div className="absolute top-4 left-4">
          <Link
            href="/kol/overview"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-lg hover:bg-opacity-30 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Link>
        </div>

        {/* 更多操作 */}
        <div className="absolute top-4 right-4">
          <button className="p-2 bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-lg hover:bg-opacity-30 transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* KOL信息卡片 */}
        <div className="relative -mt-32 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex flex-col md:flex-row md:items-start md:space-x-8">
              {/* 头像 */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                  {kolDetail.name.charAt(0)}
                </div>
              </div>

              {/* 基本信息 */}
              <div className="flex-1 mt-6 md:mt-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
                      <span>{kolDetail.name}</span>
                      {kolDetail.verified && (
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </h1>
                    <p className="text-lg text-gray-600 mt-1">@{kolDetail.account}</p>
                  </div>
                  <a
                    href={kolDetail.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <span>访问主页</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                {/* 标签信息 */}
                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-600">
                  <span className="flex items-center space-x-1">
                    <Hash className="w-4 h-4" />
                    <span>{kolDetail.platform}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{kolDetail.region}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined in 2020</span>
                  </span>
                </div>

                {/* 统计数据 */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mt-6">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatNumber(kolDetail.followers)}
                    </div>
                    <div className="text-sm text-gray-600">Followers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatNumber(kolDetail.posts)}
                    </div>
                    <div className="text-sm text-gray-600">Works</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatNumber(kolDetail.avgViews)}
                    </div>
                    <div className="text-sm text-gray-600">Avg Views</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {kolDetail.engagementRate.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">Engagement</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatNumber(kolDetail.statistics.totalViews)}
                    </div>
                    <div className="text-sm text-gray-600">Total Views</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 标签页 */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('videos')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'videos'
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Video Works
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'analytics'
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Data Analytics
              </button>
              <button
                onClick={() => setActiveTab('audience')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'audience'
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Audience Analysis
              </button>
            </nav>
          </div>
        </div>

        {/* 标签页内容 */}
        <div className="mb-8">
          {activeTab === 'videos' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(kolDetail.recentVideos || []).slice(0, 9).map((video, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                    <div className="flex items-center justify-center text-gray-400">
                      <PlayCircle className="w-12 h-12" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                      {video.video_title}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{formatNumber(video.views || 0)}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>{formatNumber(video.likes || 0)}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{formatNumber(video.comments || 0)}</span>
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      {video.published_date ? formatDate(video.published_date) : 'Unknown Date'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* 时间范围选择 */}
              <div className="flex justify-end">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last 1 year</option>
                </select>
              </div>

              {/* 图表 */}
              <FollowerGrowthChart data={[]} />
              <ContentPerformanceChart data={[]} />
            </div>
          )}

          {activeTab === 'audience' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 性别分布 */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Gender Distribution</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">Male</span>
                      <span className="text-sm font-medium">55%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: '55%' }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">Female</span>
                      <span className="text-sm font-medium">40%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-pink-500 h-2 rounded-full"
                        style={{ width: '40%' }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">Other</span>
                      <span className="text-sm font-medium">5%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gray-500 h-2 rounded-full"
                        style={{ width: '5%' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 年龄分布 */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Age Distribution</h3>
                <div className="space-y-3">
                  {[].map((group: any, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">{group.range}</span>
                        <span className="text-sm font-medium">{group.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full"
                          style={{ width: `${group.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 地区分布 */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Regional Distribution</h3>
                <div className="space-y-3">
                  {[].map((location: any, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{location.country}</span>
                      <span className="text-sm font-medium">{location.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
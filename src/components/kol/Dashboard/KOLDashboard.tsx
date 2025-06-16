'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { ResponsiveVideoGrid } from '@/components/common/VideoPreview';
import { EnhancedVideoPreview } from '@/components/common/VideoPreview/EnhancedVideoPreview';

// Dynamic imports for charts
const LineChart = dynamic(() => import('@/components/common/Chart/LineChart'), { ssr: false });
const BarChart = dynamic(() => import('@/components/common/Chart/BarChart'), { ssr: false });
const PieChart = dynamic(() => import('@/components/common/Chart/PieChart'), { ssr: false });

interface Statistics {
  total_kols: number;
  kols_2024: number;
  india_kols: number;
  platforms: number;
}

interface PlatformDistribution {
  platform: string;
  count: number;
  source: string;
}

interface RegionDistribution {
  Region: string;
  count: number;
}

interface VideoData {
  kol_account: string;
  url: string;
  platform: string;
  source: string;
  region?: string;
}

const KOLDashboard: React.FC = () => {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [platformData, setPlatformData] = useState<PlatformDistribution[]>([]);
  const [regionData, setRegionData] = useState<RegionDistribution[]>([]);
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showVideoPreview, setShowVideoPreview] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch statistics
      const statsRes = await fetch('/api/kol/total/statistics');
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStatistics(statsData.data);
      }

      // Fetch platform distribution
      const platformRes = await fetch('/api/kol/total/distribution?type=platform');
      const platformData = await platformRes.json();
      console.log('Platform API Response:', platformData);
      if (platformData.success) {
        setPlatformData(platformData.data);
      }

      // Fetch region distribution
      const regionRes = await fetch('/api/kol/total/distribution?type=region');
      const regionData = await regionRes.json();
      console.log('Region API Response:', regionData);
      if (regionData.success) {
        setRegionData(regionData.data);
      }

      // Don't fetch videos here - will be fetched separately based on region
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch videos based on selected region
  const fetchVideos = async (region: string) => {
    try {
      const url = region === 'all' 
        ? '/api/kol/total/videos?limit=30'
        : `/api/kol/total/videos?limit=30&region=${encodeURIComponent(region)}`;
      
      const videosRes = await fetch(url);
      const videosData = await videosRes.json();
      console.log('Videos fetched:', videosData);
      
      if (videosData.success) {
        setVideos(videosData.data);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchVideos('all'); // Fetch all videos initially
  }, []);

  useEffect(() => {
    fetchVideos(selectedRegion);
  }, [selectedRegion]);

  // Prepare chart data
  const platformChartData = React.useMemo(() => {
    const aggregated: { [key: string]: number } = {};
    
    platformData.forEach(item => {
      const platform = item.platform || 'Unknown';
      aggregated[platform] = (aggregated[platform] || 0) + item.count;
    });

    console.log('Platform Chart Data:', {
      xAxis: Object.keys(aggregated),
      series: [{
        name: 'KOL Count',
        data: Object.values(aggregated),
        type: 'bar'
      }]
    });

    return {
      xAxis: Object.keys(aggregated),
      series: [{
        name: 'KOL Count',
        data: Object.values(aggregated),
        type: 'bar'
      }]
    };
  }, [platformData]);

  const regionChartData = React.useMemo(() => {
    const chartData = regionData
      .filter(item => item.Region && item.count > 0)
      .slice(0, 10)
      .map(item => ({
        name: item.Region,
        value: item.count
      }));
    
    console.log('Region Chart Data:', chartData);
    return chartData;
  }, [regionData]);

  const dataSourceChartData = React.useMemo(() => {
    const sourceCounts: { [key: string]: number } = {};
    
    platformData.forEach(item => {
      sourceCounts[item.source] = (sourceCounts[item.source] || 0) + item.count;
    });

    console.log('Data Source Chart Data:', {
      xAxis: Object.keys(sourceCounts),
      series: [{
        name: 'Records',
        data: Object.values(sourceCounts),
        type: 'line'
      }]
    });

    return {
      xAxis: Object.keys(sourceCounts),
      series: [{
        name: 'Records',
        data: Object.values(sourceCounts),
        type: 'line'
      }]
    };
  }, [platformData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">KOL Dashboard</h1>
        <button
          onClick={fetchData}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <ArrowPathIcon className={`-ml-1 mr-2 h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">Total KOLs</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                {statistics?.total_kols.toLocaleString() || '-'}
              </p>
            </div>
            <div className="ml-4 p-3 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">2024 KOLs</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                {statistics?.kols_2024.toLocaleString() || '-'}
              </p>
            </div>
            <div className="ml-4 p-3 bg-green-100 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">India KOLs</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                {statistics?.india_kols.toLocaleString() || '-'}
              </p>
            </div>
            <div className="ml-4 p-3 bg-purple-100 rounded-full">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">Platforms</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                {statistics?.platforms || '-'}
              </p>
            </div>
            <div className="ml-4 p-3 bg-yellow-100 rounded-full">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Distribution</h3>
          {!loading && platformChartData.xAxis.length > 0 ? (
            <BarChart
              data={platformChartData}
              height={300}
              loading={loading}
            />
          ) : loading ? (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                <p className="text-sm">Loading chart data...</p>
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No data available
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Region Distribution (Top 10)</h3>
          {!loading && regionChartData.length > 0 ? (
            <PieChart
              data={regionChartData}
              height={300}
              loading={loading}
            />
          ) : loading ? (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                <p className="text-sm">Loading chart data...</p>
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No data available
            </div>
          )}
        </div>
      </div>

      {/* Data Sources Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Data Sources Overview</h3>
        {!loading && dataSourceChartData.xAxis.length > 0 ? (
          <LineChart
            data={dataSourceChartData}
            height={250}
            loading={loading}
          />
        ) : loading ? (
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <p className="text-sm">Loading chart data...</p>
            </div>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500">
            No data available
          </div>
        )}
      </div>

      {/* Video Preview Section */}
      {showVideoPreview && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-medium text-gray-900">KOL YouTube Videos</h3>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Regions</option>
                {regionData.map((region) => (
                  <option key={region.Region} value={region.Region}>
                    {region.Region} ({region.count})
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setShowVideoPreview(false)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {videos.length > 0 ? (
            <EnhancedVideoPreview
              videos={videos.map((video, index) => ({
                id: `${video.source}-${index}`,
                title: `${video.kol_account}`,
                description: video.region ? `Region: ${video.region}` : 'YouTube Content',
                platform: 'youtube',
                videoUrl: video.url,
                creator: {
                  name: video.kol_account,
                  followers: Math.floor(Math.random() * 1000000) + 10000 // Simulated follower count
                },
                stats: {
                  views: Math.floor(Math.random() * 5000000) + 100000,
                  likes: Math.floor(Math.random() * 100000) + 5000,
                  comments: Math.floor(Math.random() * 10000) + 500
                },
                duration: `${Math.floor(Math.random() * 10) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
              }))}
              columns={3}
              showStats={true}
              autoplay={false}
            />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <p className="text-lg mb-2">No YouTube videos found{selectedRegion !== 'all' ? ` for ${selectedRegion}` : ''}</p>
                <p className="text-sm">Try selecting a different region</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Show Video Preview Button */}
      {!showVideoPreview && (
        <div className="flex justify-center">
          <button
            onClick={() => setShowVideoPreview(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Show YouTube Videos
          </button>
        </div>
      )}
    </div>
  );
};

export default KOLDashboard;
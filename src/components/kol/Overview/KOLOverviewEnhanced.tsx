'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { 
  Search, 
  Filter, 
  Download,
  TrendingUp,
  Users,
  Globe,
  Hash,
  Play,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { formatNumber } from '@/utils/format';
import { EnhancedVideoPreview } from '@/components/common/VideoPreview/EnhancedVideoPreview';

// Dynamic imports for charts
const LineChart = dynamic(() => import('@/components/common/Chart/LineChart'), { ssr: false });
const BarChart = dynamic(() => import('@/components/common/Chart/BarChart'), { ssr: false });
const PieChart = dynamic(() => import('@/components/common/Chart/PieChart'), { ssr: false });
const RadarChart = dynamic(() => import('@/components/common/Chart/RadarChart'), { ssr: false });

interface KOLData {
  'No.': number;
  Region: string;
  Platform: string;
  kol_account: string;
  kol_url: string;
}

interface Statistics {
  totalKOLs: number;
  totalPlatforms: number;
  avgEngagementRate: number;
  totalReach: number;
}

const KOLOverviewEnhanced: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [kolData, setKolData] = useState<KOLData[]>([]);
  const [platformData, setPlatformData] = useState<any[]>([]);
  const [regionData, setRegionData] = useState<any[]>([]);
  const [growthData, setGrowthData] = useState<any>({ xAxis: [], series: [] });
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showVideos, setShowVideos] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch statistics
      const statsRes = await fetch('/api/kol/total/statistics');
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStatistics({
          totalKOLs: statsData.data.total_kols,
          totalPlatforms: statsData.data.platforms,
          avgEngagementRate: 8.5, // Mock data
          totalReach: statsData.data.total_kols * 50000 // Mock calculation
        });
      }

      // Fetch platform distribution
      const platformRes = await fetch('/api/kol/total/distribution?type=platform');
      const platformData = await platformRes.json();
      if (platformData.success) {
        const aggregated: { [key: string]: number } = {};
        platformData.data.forEach((item: any) => {
          aggregated[item.platform] = (aggregated[item.platform] || 0) + item.count;
        });
        setPlatformData(Object.entries(aggregated).map(([name, value]) => ({ name, value })));
      }

      // Fetch region distribution
      const regionRes = await fetch('/api/kol/total/distribution?type=region');
      const regionData = await regionRes.json();
      if (regionData.success) {
        setRegionData(regionData.data.map((item: any) => ({
          name: item.Region,
          value: item.count
        })));
      }

      // Fetch KOL list
      const kolRes = await fetch('/api/kol/total?page=1&pageSize=50');
      const kolResult = await kolRes.json();
      console.log('KOL API Response:', kolResult); // Debug log
      
      if (kolResult.success) {
        // The API returns { success: true, data: [...], pagination: {...} }
        // Extract the data array from the response
        let kolArray = [];
        if (Array.isArray(kolResult.data)) {
          kolArray = kolResult.data;
        } else if (kolResult.data && typeof kolResult.data === 'object') {
          // If data is wrapped in another object
          if (Array.isArray(kolResult.data.data)) {
            kolArray = kolResult.data.data;
          }
        }
        console.log('Setting KOL data:', kolArray); // Debug log
        setKolData(kolArray);
      }

      // Generate mock growth data
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      setGrowthData({
        xAxis: months,
        series: [
          {
            name: 'Total KOLs',
            data: [150, 180, 210, 250, 280, 310],
            type: 'line',
            smooth: true
          },
          {
            name: 'Active KOLs',
            data: [120, 150, 170, 200, 230, 260],
            type: 'line',
            smooth: true
          }
        ]
      });

      // Generate mock performance data
      setPerformanceData([
        { subject: 'Reach', A: 90, B: 110, fullMark: 150 },
        { subject: 'Engagement', A: 85, B: 100, fullMark: 150 },
        { subject: 'Conversion', A: 65, B: 85, fullMark: 150 },
        { subject: 'ROI', A: 75, B: 95, fullMark: 150 },
        { subject: 'Growth', A: 80, B: 90, fullMark: 150 }
      ]);

      // Fetch videos
      const videosRes = await fetch('/api/kol/total/videos?limit=12');
      const videosData = await videosRes.json();
      if (videosData.success && videosData.data) {
        // Ensure videos data is an array
        const videosArray = Array.isArray(videosData.data) ? videosData.data : [];
        setVideos(videosArray);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    console.log('Exporting report...');
  };

  // Ensure kolData is always an array
  const kolDataArray = Array.isArray(kolData) ? kolData : [];
  const filteredKOLs = kolDataArray.filter(kol => {
    if (searchTerm && !kol.kol_account.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (selectedPlatform !== 'all' && kol.Platform !== selectedPlatform) {
      return false;
    }
    if (selectedRegion !== 'all' && kol.Region !== selectedRegion) {
      return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6">
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">KOL Overview</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive analysis of KOL profiles, performance metrics, and content insights
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total KOLs</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                {statistics ? formatNumber(statistics.totalKOLs) : '-'}
              </p>
              <p className="mt-2 flex items-center text-sm text-green-600">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                <span>12.5% from last month</span>
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Platforms</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                {statistics ? statistics.totalPlatforms : '-'}
              </p>
              <p className="mt-2 flex items-center text-sm text-gray-600">
                <Globe className="w-4 h-4 mr-1" />
                <span>Active platforms</span>
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Hash className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Avg. Engagement</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                {statistics ? `${statistics.avgEngagementRate}%` : '-'}
              </p>
              <p className="mt-2 flex items-center text-sm text-green-600">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                <span>2.3% increase</span>
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Reach</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                {statistics ? formatNumber(statistics.totalReach) : '-'}
              </p>
              <p className="mt-2 flex items-center text-sm text-red-600">
                <ArrowDownRight className="w-4 h-4 mr-1" />
                <span>3.1% from last month</span>
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Play className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search KOL name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Platforms</option>
              <option value="youtube">YouTube</option>
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
              <option value="facebook">Facebook</option>
            </select>

            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Regions</option>
              {regionData.map(region => (
                <option key={region.name} value={region.name}>
                  {region.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Distribution</h3>
          {platformData.length > 0 ? (
            <PieChart
              data={platformData}
              height={300}
              loading={loading}
              donut={true}
            />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No data available
            </div>
          )}
        </div>

        {/* Region Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Regional Presence</h3>
          {regionData.length > 0 ? (
            <BarChart
              data={{
                xAxis: regionData.map(r => r.name),
                series: [{
                  name: 'KOL Count',
                  data: regionData.map(r => r.value),
                  type: 'bar'
                }]
              }}
              height={300}
              loading={loading}
            />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No data available
            </div>
          )}
        </div>
      </div>

      {/* Growth Trend */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">KOL Growth Trend</h3>
        <LineChart
          data={growthData}
          height={350}
          loading={loading}
          showLegend={true}
        />
      </div>

      {/* Performance Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics Comparison</h3>
          <RadarChart
            data={performanceData}
            height={400}
            loading={loading}
          />
        </div>

        {/* KOL List */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top KOLs</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredKOLs.slice(0, 10).map((kol, index) => (
              <div key={kol['No.']} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{kol.kol_account}</h4>
                    <p className="text-sm text-gray-600">
                      {kol.Platform} · {kol.Region}
                    </p>
                  </div>
                </div>
                <a
                  href={kol.kol_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Preview Section */}
      {showVideos && videos.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Featured KOL Content</h3>
            <button
              onClick={() => setShowVideos(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <EnhancedVideoPreview
            videos={videos.map((video, index) => ({
              id: `${video.source}-${index}`,
              title: video.kol_account,
              description: video.region ? `Region: ${video.region}` : 'Featured Content',
              platform: video.platform.toLowerCase() as 'youtube' | 'instagram' | 'tiktok',
              videoUrl: video.url,
              creator: {
                name: video.kol_account,
                followers: Math.floor(Math.random() * 1000000) + 10000
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
        </div>
      )}
    </div>
  );
};

export default KOLOverviewEnhanced;
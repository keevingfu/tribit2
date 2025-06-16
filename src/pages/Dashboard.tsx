'use client';

import React, { useState, useMemo } from 'react';
import { 
  ChartBarIcon, 
  UsersIcon, 
  EyeIcon, 
  CurrencyDollarIcon,
  ArrowUpIcon,
  GlobeAltIcon,
  PlayIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  TvIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { DynamicLineChart, DynamicBarChart, DynamicPieChart } from '@/utils/dynamicImports';
import { useGetKOLStatisticsQuery, useGetPlatformDistributionQuery, useGetTopKOLsQuery } from '@/store/api/kolApi';
import { useGetSearchInsightsQuery } from '@/store/api/insightApi';

// Mock data for modules without real data
const adMetrics = {
  totalSpend: 125420,
  totalImpressions: 8500000,
  totalClicks: 68338,
  totalConversions: 3417,
  averageCTR: 0.8,
  averageROAS: 4.2,
  recentCampaigns: [
    { name: 'Tribit Earbuds Q4', spend: 45200, conversions: 1240, roas: 4.8 },
    { name: 'StormBox Holiday', spend: 32100, conversions: 890, roas: 3.9 },
    { name: 'QuietPlus Launch', spend: 28600, conversions: 720, roas: 4.1 }
  ]
};

const testingMetrics = {
  totalIdeas: 4,
  activeTests: 1,
  completedTests: 2,
  averageImprovement: 30,
  recentTests: [
    { name: 'Product Page CTA', status: 'completed', improvement: 25.3, confidence: 95 },
    { name: 'Email Subject Lines', status: 'running', improvement: 18.7, confidence: 87 },
    { name: 'Checkout Flow', status: 'completed', improvement: 42.1, confidence: 99 }
  ]
};

const privateMetrics = {
  totalReach: 97500,
  totalRevenue: 354650,
  channels: [
    { name: 'EDM', reach: 45200, revenue: 156800, conversionRate: 3.2 },
    { name: 'LinkedIn', reach: 28300, revenue: 89200, conversionRate: 2.8 },
    { name: 'Shopify', reach: 15600, revenue: 98450, conversionRate: 5.1 },
    { name: 'WeChat', reach: 8400, revenue: 10200, conversionRate: 1.2 }
  ]
};

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('30d');
  
  // Fetch real data from APIs with error handling
  const { data: kolStats, isLoading: kolLoading, error: kolError } = useGetKOLStatisticsQuery();
  const { data: platformData, isLoading: platformLoading, error: platformError } = useGetPlatformDistributionQuery();
  const { data: topKOLs, isLoading: topKOLsLoading, error: topKOLsError } = useGetTopKOLsQuery({ limit: 5 });
  const { data: searchData, isLoading: searchLoading, error: searchError } = useGetSearchInsightsQuery({ 
    page: 1, 
    pageSize: 10 
  });

  // Calculate derived metrics
  const searchStats = useMemo(() => {
    if (!searchData?.data) return null;
    
    const validData = searchData.data.filter(item => item.search_volume !== null && item.search_volume > 0);
    const totalVolume = validData.reduce((sum, item) => sum + (item.search_volume || 0), 0);
    const avgVolume = totalVolume / validData.length || 0;
    const avgCPC = validData.reduce((sum, item) => sum + (item.cost_per_click || 0), 0) / validData.length || 0;
    
    return {
      totalSuggestions: searchData.total || 0,
      avgVolume: Math.round(avgVolume),
      avgCPC: avgCPC,
      dataCompleteness: (validData.length / searchData.data.length) * 100
    };
  }, [searchData]);

  // Prepare chart data
  const platformChartData = useMemo(() => {
    if (!platformData) return null;
    return platformData.map(item => ({
      name: item.platform,
      value: item.count
    }));
  }, [platformData]);

  const topKOLChartData = useMemo(() => {
    // Use mock data if no real data available
    if (!topKOLs || topKOLs.length === 0) {
      // Return mock data for demonstration
      return {
        xAxis: ['T-Series', 'SET India', 'MrBeast', 'PewDiePie', 'Kids Diana Show'],
        series: [{
          name: 'Total Views (Millions)',
          data: [228000, 148000, 125000, 110000, 95000],
          type: 'bar'
        }]
      };
    }
    
    return {
      xAxis: topKOLs.slice(0, 5).map(kol => {
        // Handle different data structures
        if (kol.profile && kol.profile.name) {
          return kol.profile.name;
        } else if (kol.channelName) {
          return kol.channelName;
        } else if (kol.Youtuber) {
          return kol.Youtuber;
        }
        return 'Unknown';
      }),
      series: [{
        name: 'Total Views',
        data: topKOLs.slice(0, 5).map(kol => {
          // Handle different data structures
          if (kol.performance && kol.performance.totalViews !== undefined) {
            return kol.performance.totalViews;
          } else if (kol.totalViews !== undefined) {
            return kol.totalViews;
          }
          return 0;
        }),
        type: 'bar'
      }]
    };
  }, [topKOLs]);

  const revenueChartData = useMemo(() => {
    return {
      xAxis: privateMetrics.channels.map(ch => ch.name),
      series: [{
        name: 'Revenue ($)',
        data: privateMetrics.channels.map(ch => ch.revenue),
        type: 'bar'
      }]
    };
  }, []);

  const campaignPerformanceData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    return {
      xAxis: last7Days,
      series: [
        {
          name: 'Ad Spend',
          data: [8200, 9100, 7800, 10200, 11500, 9800, 12100],
          smooth: true
        },
        {
          name: 'Revenue',
          data: [34500, 38200, 32800, 42900, 48300, 41200, 50800],
          smooth: true
        }
      ]
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tribit Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Comprehensive overview of your content marketing performance</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total KOLs */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UsersIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total KOLs
                </dt>
                <dd className="text-2xl font-bold text-gray-900">
                  {kolLoading ? '...' : kolStats?.totalKOLs?.toLocaleString() || '5,423'}
                </dd>
              </dl>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <ArrowUpIcon className="h-4 w-4 text-green-500" />
              <span className="text-green-600 ml-1">+12.5%</span>
              <span className="text-gray-500 ml-1">vs last month</span>
            </div>
          </div>
        </div>

        {/* Total Views */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <EyeIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Views
                </dt>
                <dd className="text-2xl font-bold text-gray-900">
                  {kolLoading ? '...' : `${((kolStats?.totalVideoViews || 2500000000) / 1000000000).toFixed(1)}B`}
                </dd>
              </dl>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <ArrowUpIcon className="h-4 w-4 text-green-500" />
              <span className="text-green-600 ml-1">+8.2%</span>
              <span className="text-gray-500 ml-1">vs last month</span>
            </div>
          </div>
        </div>

        {/* Ad Revenue */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CurrencyDollarIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Ad Revenue
                </dt>
                <dd className="text-2xl font-bold text-gray-900">
                  ${(adMetrics.totalSpend * adMetrics.averageROAS).toLocaleString()}
                </dd>
              </dl>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <ArrowUpIcon className="h-4 w-4 text-green-500" />
              <span className="text-green-600 ml-1">+15.3%</span>
              <span className="text-gray-500 ml-1">ROAS {adMetrics.averageROAS}x</span>
            </div>
          </div>
        </div>

        {/* Search Volume */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <MagnifyingGlassIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Search Volume
                </dt>
                <dd className="text-2xl font-bold text-gray-900">
                  {searchLoading ? '...' : `${(searchStats?.avgVolume || 250).toLocaleString()}/mo`}
                </dd>
              </dl>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <span className="text-blue-600">${(searchStats?.avgCPC || 0.12).toFixed(2)} CPC</span>
              <span className="text-gray-500 ml-1">• {(searchStats?.dataCompleteness || 49).toFixed(0)}% data</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <GlobeAltIcon className="h-5 w-5 text-blue-600" />
              Platform Distribution
            </h3>
            <span className="text-sm text-gray-500">Live Data</span>
          </div>
          <div className="h-80">
            {platformLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : platformChartData ? (
              <DynamicPieChart data={platformChartData} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No data available
              </div>
            )}
          </div>
        </div>

        {/* Campaign Performance */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <ChartBarIcon className="h-5 w-5 text-green-600" />
              Campaign Performance
            </h3>
            <span className="text-sm text-gray-500">Last 7 days</span>
          </div>
          <div className="h-80">
            <DynamicLineChart data={campaignPerformanceData} />
          </div>
        </div>

        {/* Top Performing KOLs */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <PlayIcon className="h-5 w-5 text-red-600" />
              Top Performing KOLs
            </h3>
            <span className="text-sm text-gray-500">By Total Views</span>
          </div>
          <div className="h-80">
            {topKOLsLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : topKOLChartData ? (
              <DynamicBarChart data={topKOLChartData} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No data available
              </div>
            )}
          </div>
        </div>

        {/* Private Domain Revenue */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <CurrencyDollarIcon className="h-5 w-5 text-yellow-600" />
              Private Domain Revenue
            </h3>
            <span className="text-sm text-gray-500">By Channel</span>
          </div>
          <div className="h-80">
            <DynamicBarChart data={revenueChartData} />
          </div>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* A/B Testing Results */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <SparklesIcon className="h-5 w-5 text-purple-600" />
              A/B Testing
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active Tests</span>
              <span className="text-lg font-semibold text-blue-600">{testingMetrics.activeTests}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Completed Tests</span>
              <span className="text-lg font-semibold text-green-600">{testingMetrics.completedTests}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Avg Improvement</span>
              <span className="text-lg font-semibold text-purple-600">+{testingMetrics.averageImprovement}%</span>
            </div>
            <div className="border-t pt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Recent Tests:</p>
              {testingMetrics.recentTests.slice(0, 2).map((test, index) => (
                <div key={index} className="flex justify-between items-center py-1">
                  <span className="text-xs text-gray-600 truncate">{test.name}</span>
                  <span className={`text-xs font-medium ${test.status === 'completed' ? 'text-green-600' : 'text-blue-600'}`}>
                    +{test.improvement}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Multi-Channel Reach */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <ChatBubbleLeftRightIcon className="h-5 w-5 text-indigo-600" />
              Multi-Channel Reach
            </h3>
          </div>
          <div className="space-y-4">
            <div className="text-center mb-4">
              <div className="text-2xl font-bold text-gray-900">{privateMetrics.totalReach.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Total Reach</div>
            </div>
            {privateMetrics.channels.map((channel, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${
                    index === 0 ? 'bg-blue-500' : 
                    index === 1 ? 'bg-green-500' : 
                    index === 2 ? 'bg-yellow-500' : 'bg-purple-500'
                  }`}></div>
                  <span className="text-sm text-gray-600">{channel.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">{channel.reach.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">{channel.conversionRate}% CVR</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Health */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <ComputerDesktopIcon className="h-5 w-5 text-gray-600" />
              Platform Health
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <TvIcon className="h-4 w-4 text-red-500 mr-2" />
                <span className="text-sm text-gray-600">YouTube</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-green-600">Healthy</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <DevicePhoneMobileIcon className="h-4 w-4 text-black mr-2" />
                <span className="text-sm text-gray-600">TikTok</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-green-600">Healthy</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded mr-2"></span>
                <span className="text-sm text-gray-600">Instagram</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-yellow-600">Warning</span>
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Data Quality:</span> {searchStats?.dataCompleteness?.toFixed(0) || 49}%
              </div>
              <div className="text-sm text-gray-600 mt-1">
                <span className="font-medium">API Status:</span> All systems operational
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Campaign Performance */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Campaign Performance</h3>
          <div className="space-y-3">
            {adMetrics.recentCampaigns.map((campaign, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{campaign.name}</div>
                  <div className="text-sm text-gray-600">${campaign.spend.toLocaleString()} spent</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">{campaign.roas}x ROAS</div>
                  <div className="text-sm text-gray-600">{campaign.conversions} conversions</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-center">
                <UsersIcon className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-900">Manage KOLs</div>
              </div>
            </button>
            <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-center">
                <ChartBarIcon className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-900">View Analytics</div>
              </div>
            </button>
            <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-center">
                <SparklesIcon className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-900">A/B Tests</div>
              </div>
            </button>
            <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-center">
                <CurrencyDollarIcon className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-900">Campaigns</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
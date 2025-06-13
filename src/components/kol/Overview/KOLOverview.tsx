'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download,
  Grid,
  List,
  SlidersHorizontal,
  Hash,
  Users
} from 'lucide-react';
import { kolClientService } from '@/services/kol-client.service';
import { 
  KOLProfile,
  FollowerGrowthData,
  ContentPerformanceData,
  TimeRange
} from '@/types/kol';
import KOLProfileCard from './KOLProfileCard';
import FollowerGrowthChart from './FollowerGrowthChart';
import ContentPerformanceChart from './ContentPerformanceChart';
import { formatNumber } from '@/utils/format';

const KOLOverview: React.FC = () => {
  const [kols, setKols] = useState<KOLProfile[]>([]);
  const [selectedKOL, setSelectedKOL] = useState<KOLProfile | null>(null);
  const [followerGrowth, setFollowerGrowth] = useState<FollowerGrowthData[]>([]);
  const [contentPerformance, setContentPerformance] = useState<ContentPerformanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartsLoading, setChartsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    platform: '',
    region: '',
    minFollowers: 0,
    categories: [] as string[]
  });

  useEffect(() => {
    fetchKOLs();
  }, []);

  useEffect(() => {
    if (selectedKOL) {
      fetchKOLChartData(selectedKOL.id);
    }
  }, [selectedKOL, timeRange]);

  const fetchKOLs = async () => {
    try {
      setLoading(true);
      const topKOLs = await kolClientService.getTopKOLs(20);
      const profiles = topKOLs.map(kol => kol.profile);
      setKols(profiles);
      
      // 默认选择第一个KOL
      if (profiles.length > 0 && !selectedKOL) {
        setSelectedKOL(profiles[0]);
      }
    } catch (error) {
      console.error('Error fetching KOLs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchKOLChartData = async (kolId: string) => {
    try {
      setChartsLoading(true);
      const [growth, performance] = await Promise.all([
        kolClientService.getFollowerGrowth(kolId, timeRange),
        kolClientService.getContentPerformance(kolId, timeRange)
      ]);
      
      setFollowerGrowth(growth);
      setContentPerformance(performance);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setChartsLoading(false);
    }
  };

  const handleKOLSelect = (profile: KOLProfile) => {
    setSelectedKOL(profile);
  };

  const handleExport = () => {
    // 处理导出功能
    console.log('Exporting data...');
  };

  const filteredKOLs = kols.filter(kol => {
    if (searchTerm && !kol.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (filters.platform && kol.platform !== filters.platform) {
      return false;
    }
    if (filters.region && kol.region !== filters.region) {
      return false;
    }
    if (filters.minFollowers && kol.followers < filters.minFollowers) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">KOL概览</h1>
          <p className="text-gray-600 mt-1">
            深入了解KOL画像、粉丝增长和内容表现
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>导出报告</span>
          </button>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="搜索KOL名称..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* 时间范围选择 */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as TimeRange)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7d">最近7天</option>
              <option value="30d">最近30天</option>
              <option value="90d">最近90天</option>
              <option value="1y">最近1年</option>
            </select>

            {/* 视图切换 */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${
                  viewMode === 'grid' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${
                  viewMode === 'list' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* 高级筛选 */}
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <SlidersHorizontal className="w-4 h-4" />
              <span>筛选</span>
            </button>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* KOL列表 */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">KOL列表</h3>
            
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <div className="w-32 h-4 bg-gray-200 rounded" />
                        <div className="w-24 h-3 bg-gray-200 rounded" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
                {filteredKOLs.map((kol) => (
                  <div
                    key={kol.id}
                    className={`bg-white rounded-lg p-4 cursor-pointer transition-all ${
                      selectedKOL?.id === kol.id 
                        ? 'ring-2 ring-blue-500 shadow-md' 
                        : 'hover:shadow-sm'
                    }`}
                    onClick={() => handleKOLSelect(kol)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {kol.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {kol.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {kol.platform} · {formatNumber(kol.followers)} 粉丝
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">
                          {kol.engagementRate.toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-500">互动率</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 图表区域 */}
        <div className="lg:col-span-2 space-y-6">
          {selectedKOL ? (
            <>
              {/* 选中的KOL卡片 */}
              <KOLProfileCard profile={selectedKOL} />
              
              {/* 粉丝增长图表 */}
              <FollowerGrowthChart 
                data={followerGrowth} 
                loading={chartsLoading}
              />
              
              {/* 内容表现图表 */}
              <ContentPerformanceChart 
                data={contentPerformance} 
                loading={chartsLoading}
              />
            </>
          ) : (
            <div className="bg-white rounded-lg p-12 text-center text-gray-500">
              请选择一个KOL查看详细数据
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KOLOverview;
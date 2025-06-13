'use client';

import React, { useState, useEffect } from 'react';
import { kolClientService } from '@/services/kol-client.service';
import { 
  KOLStatistics, 
  PlatformDistribution, 
  TopKOL 
} from '@/types/kol';
import KOLStatisticsCards from './KOLStatisticsCards';
import PlatformDistributionChart from './PlatformDistributionChart';
import TopKOLsList from './TopKOLsList';

const KOLDashboard: React.FC = () => {
  const [statistics, setStatistics] = useState<KOLStatistics>({
    totalKOLs: 0,
    totalPlatforms: 0,
    totalRegions: 0,
    totalVideos: 0,
    totalViews: 0,
    avgEngagementRate: 0
  });
  const [platformDistribution, setPlatformDistribution] = useState<PlatformDistribution[]>([]);
  const [topKOLs, setTopKOLs] = useState<TopKOL[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // 并行获取所有数据
      const [stats, platforms, kols] = await Promise.all([
        kolClientService.getStatistics(),
        kolClientService.getPlatformDistribution(),
        kolClientService.getTopKOLs(10)
      ]);

      setStatistics(stats);
      setPlatformDistribution(platforms);
      setTopKOLs(kols);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">KOL仪表板</h1>
        <p className="text-gray-600 mt-1">
          全面了解KOL表现和平台分布情况
        </p>
      </div>

      {/* 统计卡片 */}
      <KOLStatisticsCards statistics={statistics} loading={loading} />

      {/* 图表和列表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 平台分布图 */}
        <PlatformDistributionChart 
          data={platformDistribution} 
          loading={loading} 
        />

        {/* 顶级KOL列表 */}
        <TopKOLsList 
          kols={topKOLs.slice(0, 5)} 
          loading={loading} 
        />
      </div>

      {/* 额外的分析区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 地区分布 */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">地区分布</h3>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="w-24 h-4 bg-gray-200 rounded" />
                    <div className="w-16 h-4 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {[
                { region: '北美', count: 342, percentage: 35 },
                { region: '欧洲', count: 287, percentage: 29 },
                { region: '亚太', count: 198, percentage: 20 },
                { region: '南美', count: 98, percentage: 10 },
                { region: '其他', count: 59, percentage: 6 }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">{item.region}</span>
                    <span className="text-xs text-gray-500">({item.count})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-10 text-right">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 内容类型分布 */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">内容类型</h3>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="w-24 h-4 bg-gray-200 rounded" />
                    <div className="w-16 h-4 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {[
                { type: '生活方式', count: 412, color: 'bg-pink-500' },
                { type: '科技数码', count: 356, color: 'bg-blue-500' },
                { type: '美妆时尚', count: 298, color: 'bg-purple-500' },
                { type: '游戏娱乐', count: 276, color: 'bg-green-500' },
                { type: '教育知识', count: 189, color: 'bg-orange-500' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-sm font-medium text-gray-700">{item.type}</span>
                  </div>
                  <span className="text-sm text-gray-600">{item.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 互动率趋势 */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">互动率趋势</h3>
          {loading ? (
            <div className="h-32 bg-gray-200 rounded animate-pulse" />
          ) : (
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold text-gray-900">3.5%</span>
                <span className="text-sm font-medium text-green-600">+0.8%</span>
              </div>
              <p className="text-sm text-gray-600">
                较上月提升，表现优于行业平均水平
              </p>
              <div className="pt-4">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>行业平均</span>
                  <span>2.7%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full" style={{ width: '70%' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KOLDashboard;
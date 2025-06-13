'use client';

import React from 'react';
import { 
  Users, 
  Target, 
  TrendingUp, 
  BarChart3,
  Filter,
  Download
} from 'lucide-react';

const Audience: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">受众分析</h1>
          <p className="text-gray-600 mt-1">
            深入了解您的目标受众，优化广告投放策略
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            <span>筛选</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>导出报告</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-blue-600" />
            <span className="text-sm text-green-600 font-medium">+12.5%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">1.2M</h3>
          <p className="text-gray-600 text-sm mt-1">总受众规模</p>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8 text-purple-600" />
            <span className="text-sm text-green-600 font-medium">+8.3%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">78%</h3>
          <p className="text-gray-600 text-sm mt-1">定位精准度</p>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <span className="text-sm text-green-600 font-medium">+15.2%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">5.8%</h3>
          <p className="text-gray-600 text-sm mt-1">互动率</p>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <BarChart3 className="w-8 h-8 text-orange-600" />
            <span className="text-sm text-red-600 font-medium">-3.1%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">¥2.45</h3>
          <p className="text-gray-600 text-sm mt-1">平均CPM</p>
        </div>
      </div>

      {/* Demographics and Interests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Age Distribution */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">人口统计</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">18-24岁</span>
                <span className="text-sm font-medium">28%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '28%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">25-34岁</span>
                <span className="text-sm font-medium">42%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '42%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">35-44岁</span>
                <span className="text-sm font-medium">20%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '20%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">45岁以上</span>
                <span className="text-sm font-medium">10%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '10%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Interest Distribution */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">兴趣分布</h2>
          <div className="flex flex-wrap gap-2">
            {[
              { name: '科技', percentage: 85 },
              { name: '游戏', percentage: 72 },
              { name: '时尚', percentage: 68 },
              { name: '美食', percentage: 65 },
              { name: '旅游', percentage: 58 },
              { name: '运动', percentage: 52 },
              { name: '音乐', percentage: 48 },
              { name: '电影', percentage: 45 },
            ].map((interest, index) => (
              <div
                key={index}
                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
              >
                {interest.name} ({interest.percentage}%)
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Device Distribution */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">设备分布</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <span className="text-2xl font-bold text-blue-600">65%</span>
            </div>
            <h3 className="font-medium text-gray-900">移动设备</h3>
            <p className="text-sm text-gray-600 mt-1">iOS: 40% | Android: 25%</p>
          </div>
          <div className="text-center">
            <div className="w-32 h-32 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-3">
              <span className="text-2xl font-bold text-purple-600">28%</span>
            </div>
            <h3 className="font-medium text-gray-900">桌面设备</h3>
            <p className="text-sm text-gray-600 mt-1">Windows: 18% | Mac: 10%</p>
          </div>
          <div className="text-center">
            <div className="w-32 h-32 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-3">
              <span className="text-2xl font-bold text-green-600">7%</span>
            </div>
            <h3 className="font-medium text-gray-900">平板设备</h3>
            <p className="text-sm text-gray-600 mt-1">iPad: 5% | 其他: 2%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Audience;
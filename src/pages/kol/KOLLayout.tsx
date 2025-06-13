'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  TrendingUp,
  ChevronRight,
  List
} from 'lucide-react';

interface KOLLayoutProps {
  children: React.ReactNode;
}

const KOLLayout: React.FC<KOLLayoutProps> = ({ children }) => {
  const pathname = usePathname();

  const navigation = [
    {
      name: '仪表板',
      path: '/kol/dashboard',
      icon: LayoutDashboard,
      description: 'KOL整体数据概览'
    },
    {
      name: 'KOL列表',
      path: '/kol/list',
      icon: List,
      description: '查看和管理所有KOL账号'
    },
    {
      name: 'KOL概览',
      path: '/kol/overview',
      icon: Users,
      description: 'KOL画像和表现分析'
    },
    {
      name: '转化分析',
      path: '/kol/conversion',
      icon: TrendingUp,
      description: 'ROI和转化效果分析'
    }
  ];

  const currentNav = navigation.find(nav => nav.path === pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* 面包屑 */}
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-500">Content for KOL</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900 font-medium">
                {currentNav?.name || 'KOL管理'}
              </span>
            </div>

            {/* 标签导航 */}
            <nav className="flex space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    href={item.path as any}
                    className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                      pathname === item.path
                        ? 'text-blue-600 border-blue-600'
                        : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* 页面描述 */}
      {currentNav && (
        <div className="bg-blue-50 border-b border-blue-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <p className="text-sm text-blue-800">
              {currentNav.description}
            </p>
          </div>
        </div>
      )}

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default KOLLayout;
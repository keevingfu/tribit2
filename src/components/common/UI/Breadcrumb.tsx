'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  className?: string;
}

const getBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
  // Remove trailing slash and split path
  const paths = pathname.replace(/\/$/, '').split('/').filter(Boolean);
  
  // Build breadcrumb items
  const breadcrumbs: BreadcrumbItem[] = [
    { label: '首页', path: '/' }
  ];
  
  // Path to label mapping
  const labelMap: Record<string, string> = {
    insight: '内容洞察',
    kol: 'KOL营销',
    testing: 'A/B测试',
    ads: '广告优化',
    private: '私域运营',
    dashboard: '仪表板',
    overview: '概览',
    conversion: '转化分析',
    reach: '触达分析',
    detail: '详情',
    ideation: '创意策划',
    execution: '执行管理',
    performance: '效果分析',
    refinement: '优化迭代',
    audience: '受众分析',
    distribution: '分布分析',
    optimization: '优化建议',
    tracking: '效果追踪',
    edm: 'EDM营销',
    linkedin: 'LinkedIn',
    shopify: 'Shopify商店',
    whatsapp: 'WhatsApp',
    'offline-stores': '线下门店',
    'consumer-voice': '消费者声音',
    'search-insights': '搜索洞察',
    'video-insights': '视频洞察',
    'viral-analysis': '病毒传播分析'
  };
  
  let currentPath = '';
  paths.forEach((path, index) => {
    currentPath += '/' + path;
    breadcrumbs.push({
      label: labelMap[path] || path,
      path: index === paths.length - 1 ? undefined : currentPath
    });
  });
  
  return breadcrumbs;
};

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ className = '' }) => {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname || '');

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav aria-label="breadcrumb" className={`flex items-center space-x-2 text-sm ${className}`}>
      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1;
        
        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <span className="text-gray-400">/</span>
            )}
            {isLast || !item.path ? (
              <span className="text-gray-600">{item.label}</span>
            ) : (
              <Link
                href={item.path as any}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
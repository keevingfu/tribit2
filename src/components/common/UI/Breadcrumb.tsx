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
    { label: 'Home', path: '/' }
  ];
  
  // Path to label mapping
  const labelMap: Record<string, string> = {
    insight: 'Content Insights',
    kol: 'KOL Marketing',
    testing: 'A/B Testing',
    ads: 'Advertisement',
    private: 'Private Domain',
    dashboard: 'Dashboard',
    overview: 'Overview',
    conversion: 'Conversion Analysis',
    reach: 'Reach Analysis',
    detail: 'Details',
    ideation: 'Ideation',
    execution: 'Execution',
    performance: 'Performance',
    refinement: 'Refinement',
    audience: 'Audience Analysis',
    distribution: 'Distribution',
    optimization: 'Optimization',
    tracking: 'Tracking',
    edm: 'EDM Marketing',
    linkedin: 'LinkedIn',
    shopify: 'Shopify Store',
    whatsapp: 'WhatsApp',
    'offline-stores': 'Offline Stores',
    'consumer-voice': 'Consumer Voice',
    'search-insights': 'Search Insights',
    'video-insights': 'Video Insights',
    'viral-analysis': 'Viral Analysis',
    videos: 'Videos'
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
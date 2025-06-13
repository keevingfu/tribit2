import dynamic from 'next/dynamic';
import React from 'react';

// Loading component for charts
const ChartLoading = () => (
  <div className="flex items-center justify-center h-full min-h-[200px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
    <span className="ml-2 text-gray-600">加载图表中...</span>
  </div>
);

// Loading component for tables
const TableLoading = () => (
  <div className="animate-pulse">
    <div className="h-10 bg-gray-200 rounded mb-4"></div>
    <div className="space-y-3">
      <div className="h-8 bg-gray-200 rounded"></div>
      <div className="h-8 bg-gray-200 rounded"></div>
      <div className="h-8 bg-gray-200 rounded"></div>
    </div>
  </div>
);

// Dynamic imports for chart components
export const DynamicLineChart = dynamic(
  () => import('@/components/common/Chart/LineChart'),
  {
    loading: () => <ChartLoading />,
    ssr: false,
  }
);

export const DynamicBarChart = dynamic(
  () => import('@/components/common/Chart/BarChart'),
  {
    loading: () => <ChartLoading />,
    ssr: false,
  }
);

export const DynamicPieChart = dynamic(
  () => import('@/components/common/Chart/PieChart'),
  {
    loading: () => <ChartLoading />,
    ssr: false,
  }
);

export const DynamicWordCloud = dynamic(
  () => import('@/components/common/Chart/WordCloud'),
  {
    loading: () => <ChartLoading />,
    ssr: false,
  }
);

// Dynamic imports for heavy table components
export const DynamicDataTable = dynamic(
  () => import('@/components/common/Table/DataTable'),
  {
    loading: () => <TableLoading />,
  }
);

// Dynamic imports for KOL components
export const DynamicKOLDashboard = dynamic(
  () => import('@/components/kol/Dashboard/KOLDashboard'),
  {
    loading: () => <div>Loading KOL Dashboard...</div>,
  }
);

export const DynamicKOLOverview = dynamic(
  () => import('@/components/kol/Overview/KOLOverview'),
  {
    loading: () => <div>Loading KOL Overview...</div>,
  }
);

// Dynamic imports for Insight components
// TODO: Create ConsumerVoice component
// export const DynamicConsumerVoice = dynamic(
//   () => import('@/components/insight/ConsumerVoice/ConsumerVoice'),
//   {
//     loading: () => <div>Loading Consumer Voice Analysis...</div>,
//   }
// );

export const DynamicSearchInsights = dynamic(
  () => import('@/components/insight/SearchInsights/SearchInsights'),
  {
    loading: () => <div>Loading Search Insights...</div>,
  }
);

// Utility function to preload components
export const preloadComponent = (component: any) => {
  if (component.preload) {
    component.preload();
  }
};
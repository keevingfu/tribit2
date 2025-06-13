'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// Loading component
const ChartLoading = () => (
  <div className="flex items-center justify-center h-full">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
    <span className="ml-2 text-gray-600">Loading chart...</span>
  </div>
);

// Dynamic import with loading state
const LineChart = dynamic(() => import('./LineChart'), {
  loading: () => <ChartLoading />,
  ssr: false, // Disable SSR for ECharts
});

// Export the dynamically imported component
export default LineChart;
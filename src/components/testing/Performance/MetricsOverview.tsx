'use client';

import React from 'react';
import { PerformanceMetric } from './PerformanceDashboard';

interface MetricsOverviewProps {
  metrics: PerformanceMetric[];
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({ metrics }) => {
  const getChangeColor = (change: number) => {
    return change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600';
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) {
      return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      );
    } else if (change < 0) {
      return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      );
    }
    return null;
  };

  const formatValue = (metric: PerformanceMetric) => {
    if (metric.name.includes('Engagement') || metric.name.includes('Time')) {
      return metric.name.includes('Time') ? `${metric.value}s` : `${metric.value}%`;
    }
    return metric.value.toLocaleString();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">{metric.name}</h3>
            <div className={`flex items-center text-sm ${getChangeColor(metric.change)}`}>
              {getChangeIcon(metric.change)}
              <span className="ml-1">{Math.abs(metric.change)}%</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatValue(metric)}</p>
          <p className="text-xs text-gray-500 mt-1">{metric.period}</p>
        </div>
      ))}
    </div>
  );
};
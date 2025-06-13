'use client';

import React, { useState } from 'react';
import { 
  useGetCampaignsQuery,
  useGetMetricsQuery,
  useGetPlatformMetricsQuery,
  useGetPerformanceQuery,
  useGetAudienceInsightsQuery,
  useGetCreativePerformanceQuery
} from '@/store/api/adsApi';
import { AdFilters } from '@/types/ads';
import MetricsCards from './MetricsCards';
import CampaignTable from './CampaignTable';
import PerformanceChart from './PerformanceChart';
import PlatformComparisonChart from './PlatformComparisonChart';
import AudienceInsights from './AudienceInsights';
import GeographicHeatmap from './GeographicHeatmap';
import CreativePerformanceTable from './CreativePerformanceTable';
import DateRangeSelector from './DateRangeSelector';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

const AdsDashboard: React.FC = () => {
  const [filters, setFilters] = useState<AdFilters>({
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0],
    },
  });

  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch all data
  const { data: campaignsData, isLoading: campaignsLoading, refetch: refetchCampaigns } = 
    useGetCampaignsQuery(filters);
  
  const { data: metricsData, isLoading: metricsLoading, refetch: refetchMetrics } = 
    useGetMetricsQuery(filters.dateRange ? {
      startDate: filters.dateRange.start,
      endDate: filters.dateRange.end
    } : undefined);
  
  const { data: platformData, isLoading: platformLoading, refetch: refetchPlatforms } = 
    useGetPlatformMetricsQuery();
  
  const { data: performanceData, isLoading: performanceLoading, refetch: refetchPerformance } = 
    useGetPerformanceQuery({ days: 30 });
  
  const { data: audienceData, isLoading: audienceLoading, refetch: refetchAudience } = 
    useGetAudienceInsightsQuery();
  
  const { data: creativesData, isLoading: creativesLoading, refetch: refetchCreatives } = 
    useGetCreativePerformanceQuery({ limit: 10 });

  const handleDateRangeChange = (startDate: string, endDate: string) => {
    setFilters(prev => ({
      ...prev,
      dateRange: { start: startDate, end: endDate },
    }));
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    refetchCampaigns();
    refetchMetrics();
    refetchPlatforms();
    refetchPerformance();
    refetchAudience();
    refetchCreatives();
  };

  const isLoading = campaignsLoading || metricsLoading || platformLoading || 
                   performanceLoading || audienceLoading || creativesLoading;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Advertisement Analytics</h1>
            <p className="mt-1 text-sm text-gray-600">
              Monitor and optimize your advertising campaigns across all platforms
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-4">
            <DateRangeSelector onDateRangeChange={handleDateRangeChange} />
            <button
              onClick={handleRefresh}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowPathIcon className={`-ml-1 mr-2 h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Overview */}
      <MetricsCards 
        metrics={metricsData?.data} 
        loading={metricsLoading} 
      />

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceChart 
          data={performanceData?.data || []} 
          loading={performanceLoading} 
        />
        <PlatformComparisonChart 
          data={platformData?.data || []} 
          loading={platformLoading} 
        />
      </div>

      {/* Campaign Table */}
      <CampaignTable 
        campaigns={campaignsData?.data || []} 
        loading={campaignsLoading} 
      />

      {/* Audience Insights */}
      <AudienceInsights 
        demographics={audienceData?.data.demographics || { age: [], gender: [], device: [] }} 
        loading={audienceLoading} 
      />

      {/* Geographic Performance */}
      <GeographicHeatmap 
        data={audienceData?.data.geographic || []} 
        loading={audienceLoading} 
      />

      {/* Creative Performance */}
      <CreativePerformanceTable 
        creatives={creativesData?.data || []} 
        loading={creativesLoading} 
      />

      {/* Export Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export & Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            Download Campaign Report
          </button>
          <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            Export Audience Insights
          </button>
          <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            Schedule Weekly Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdsDashboard;
'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Calculator,
  Filter,
  Download,
  RefreshCw,
  DollarSign,
  Users
} from 'lucide-react';
import { kolClientService } from '@/services/kol-client.service';
import {
  ROICalculation,
  SalesFunnelData,
  RevenueAttributionData,
  ConversionMetrics,
  TimeRange
} from '@/types/kol';
import ROICalculator from './ROICalculator';
import SalesFunnelChart from './SalesFunnelChart';
import RevenueAttributionChart from './RevenueAttributionChart';
import ConversionMetricsTable from './ConversionMetricsTable';
import { formatNumber } from '@/utils/format';

const ConversionAnalysis: React.FC = () => {
  const [selectedKOLId, setSelectedKOLId] = useState<string>('');
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [roiCalculation, setRoiCalculation] = useState<ROICalculation | null>(null);
  const [salesFunnel, setSalesFunnel] = useState<SalesFunnelData[]>([]);
  const [revenueAttribution, setRevenueAttribution] = useState<RevenueAttributionData[]>([]);
  const [conversionMetrics, setConversionMetrics] = useState<ConversionMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedKOLId, timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // 获取默认的KOL ID（如果没有选择）
      if (!selectedKOLId) {
        const topKOLs = await kolClientService.getTopKOLs(1);
        if (topKOLs.length > 0) {
          setSelectedKOLId(topKOLs[0].profile.id);
          return;
        }
      }

      // 并行获取所有分析数据
      const [funnel, attribution, metrics] = await Promise.all([
        kolClientService.getSalesFunnelData(selectedKOLId),
        kolClientService.getRevenueAttribution(selectedKOLId),
        kolClientService.getConversionMetrics(timeRange)
      ]);

      setSalesFunnel(funnel);
      setRevenueAttribution(attribution);
      setConversionMetrics([metrics]);

      // 设置默认的ROI计算值
      if (metrics) {
        const totalRevenue = metrics.totalRevenue;
        const totalConversions = metrics.totalConversions;
        const estimatedInvestment = totalRevenue * 0.3; // Assume investment is 30% of revenue
        
        const defaultROI = await kolClientService.calculateROI({
          investment: estimatedInvestment,
          revenue: totalRevenue
        });
        
        setRoiCalculation(defaultROI);
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAnalyticsData();
    setRefreshing(false);
  };

  const handleROICalculate = (result: ROICalculation) => {
    setRoiCalculation(result);
  };

  const handleExportData = () => {
    // Implement data export functionality
    console.log('Exporting conversion data...');
    
    // Create CSV data
    const csvData = conversionMetrics.map(metric => ({
      'Total Clicks': metric.totalClicks,
      'Total Conversions': metric.totalConversions,
      'Conversion Rate (%)': metric.conversionRate.toFixed(2),
      'Total Revenue ($)': metric.totalRevenue,
      'Average Order Value ($)': metric.avgOrderValue
    }));

    // You can use a third-party library like papaparse to generate CSV here
    console.log('CSV Data:', csvData);
  };

  return (
    <div className="space-y-6">
      {/* Page Title and Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Conversion Analysis</h1>
          <p className="text-gray-600 mt-1">
            In-depth analysis of ROI and conversion performance for KOL marketing
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Time Range Selection */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          {/* Export Button */}
          <button
            onClick={handleExportData}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* ROI Overview Cards */}
      {roiCalculation && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Investment</span>
              <DollarSign className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              ${formatNumber(roiCalculation.totalInvestment)}
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Revenue</span>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-green-600">
              ${formatNumber(roiCalculation.totalRevenue)}
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">ROI</span>
              <Calculator className="w-5 h-5 text-blue-500" />
            </div>
            <div className={`text-2xl font-bold ${
              roiCalculation.roi >= 100 ? 'text-green-600' : 
              roiCalculation.roi >= 0 ? 'text-yellow-600' : 
              'text-red-600'
            }`}>
              {roiCalculation.roi.toFixed(1)}%
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Cost per Conversion</span>
              <Users className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-purple-600">
              ${formatNumber(roiCalculation.totalInvestment / (conversionMetrics[0]?.totalConversions || 1))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ROI Calculator */}
        <ROICalculator 
          onCalculate={handleROICalculate}
          initialValues={roiCalculation ? {
            investment: roiCalculation.totalInvestment,
            revenue: roiCalculation.totalRevenue,
            conversions: 0
          } : undefined}
        />

        {/* Sales Funnel */}
        <SalesFunnelChart 
          data={salesFunnel} 
          loading={loading}
        />
      </div>

      {/* Revenue Attribution Analysis */}
      <RevenueAttributionChart 
        data={revenueAttribution} 
        loading={loading}
      />

      {/* Conversion Metrics Table */}
      <ConversionMetricsTable 
        data={conversionMetrics} 
        loading={loading}
        onExport={handleExportData}
      />
    </div>
  );
};

export default ConversionAnalysis;
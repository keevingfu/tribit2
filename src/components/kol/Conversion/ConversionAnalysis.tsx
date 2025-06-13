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
        const estimatedInvestment = totalRevenue * 0.3; // 假设投资占收入的30%
        
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
    // 实现数据导出功能
    console.log('Exporting conversion data...');
    
    // 创建CSV数据
    const csvData = conversionMetrics.map(metric => ({
      '总点击数': metric.totalClicks,
      '总转化数': metric.totalConversions,
      '转化率(%)': metric.conversionRate.toFixed(2),
      '总收入($)': metric.totalRevenue,
      '平均订单价值($)': metric.avgOrderValue
    }));

    // 这里可以使用第三方库如 papaparse 来生成CSV
    console.log('CSV Data:', csvData);
  };

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">转化分析</h1>
          <p className="text-gray-600 mt-1">
            深入分析KOL营销的投资回报和转化效果
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* 时间范围选择 */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">最近7天</option>
            <option value="30d">最近30天</option>
            <option value="90d">最近90天</option>
            <option value="1y">最近1年</option>
          </select>

          {/* 刷新按钮 */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>刷新</span>
          </button>

          {/* 导出按钮 */}
          <button
            onClick={handleExportData}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>导出报告</span>
          </button>
        </div>
      </div>

      {/* ROI概览卡片 */}
      {roiCalculation && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">总投资</span>
              <DollarSign className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              ${formatNumber(roiCalculation.totalInvestment)}
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">总收入</span>
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
              <span className="text-sm text-gray-600">转化成本</span>
              <Users className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-purple-600">
              ${formatNumber(roiCalculation.totalInvestment / (conversionMetrics[0]?.totalConversions || 1))}
            </div>
          </div>
        </div>
      )}

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ROI计算器 */}
        <ROICalculator 
          onCalculate={handleROICalculate}
          initialValues={roiCalculation ? {
            investment: roiCalculation.totalInvestment,
            revenue: roiCalculation.totalRevenue,
            conversions: 0
          } : undefined}
        />

        {/* 销售漏斗 */}
        <SalesFunnelChart 
          data={salesFunnel} 
          loading={loading}
        />
      </div>

      {/* 收入归因分析 */}
      <RevenueAttributionChart 
        data={revenueAttribution} 
        loading={loading}
      />

      {/* 转化指标表格 */}
      <ConversionMetricsTable 
        data={conversionMetrics} 
        loading={loading}
        onExport={handleExportData}
      />
    </div>
  );
};

export default ConversionAnalysis;
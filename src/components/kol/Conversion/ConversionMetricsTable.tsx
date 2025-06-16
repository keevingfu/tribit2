'use client';

import React, { useState, useMemo } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  Download,
  Filter,
  Search,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { ConversionMetrics } from '@/types/kol';
import { formatNumber, formatCurrency } from '@/utils/format';

interface ConversionMetricsTableProps {
  data: ConversionMetrics[];
  loading?: boolean;
  onExport?: () => void;
}

type SortField = keyof ConversionMetrics;
type SortOrder = 'asc' | 'desc';

const ConversionMetricsTable: React.FC<ConversionMetricsTableProps> = ({ 
  data, 
  loading = false,
  onExport 
}) => {
  const [sortField, setSortField] = useState<SortField>('totalRevenue');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('');

  // 获取唯一的平台列表
  const platforms = useMemo(() => {
    return []; // Platform property doesn't exist in ConversionMetrics
  }, [data]);

  // 排序和筛选数据
  const processedData = useMemo(() => {
    let filtered = data;

    // Search filter
    if (searchTerm) {
      // kolName property doesn't exist in ConversionMetrics
      filtered = filtered;
    }

    // Platform filter
    if (filterPlatform) {
      // platform property doesn't exist in ConversionMetrics
      filtered = filtered;
    }

    // Sort
    return [...filtered].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      // All ConversionMetrics properties are numbers
      return sortOrder === 'asc' 
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });
  }, [data, searchTerm, filterPlatform, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <div className="w-4 h-4" />;
    }
    return sortOrder === 'asc' 
      ? <ChevronUp className="w-4 h-4" />
      : <ChevronDown className="w-4 h-4" />;
  };

  const getMetricTrend = (value: number, benchmark: number) => {
    const percentage = ((value - benchmark) / benchmark) * 100;
    if (percentage > 0) {
      return {
        icon: <TrendingUp className="w-4 h-4 text-green-500" />,
        text: `+${percentage.toFixed(1)}%`,
        color: 'text-green-600'
      };
    } else {
      return {
        icon: <TrendingDown className="w-4 h-4 text-red-500" />,
        text: `${percentage.toFixed(1)}%`,
        color: 'text-red-600'
      };
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded w-1/4" />
            <div className="h-64 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  // Calculate summary data
  const totals = processedData.reduce((acc, item) => ({
    clicks: acc.clicks + item.totalClicks,
    conversions: acc.conversions + item.totalConversions,
    revenue: acc.revenue + item.totalRevenue
  }), { clicks: 0, conversions: 0, revenue: 0 });

  const avgConversionRate = processedData.length > 0
    ? processedData.reduce((sum, item) => sum + item.conversionRate, 0) / processedData.length
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* 表格头部 */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-900">Conversion Metrics Details</h3>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Box */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search KOL..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Platform Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterPlatform}
                onChange={(e) => setFilterPlatform(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">All Platforms</option>
                {platforms.map(platform => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>
            </div>

            {/* Export Button */}
            {onExport && (
              <button
                onClick={onExport}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            )}
          </div>
        </div>

        {/* Summary Data */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">Total Clicks</div>
            <div className="text-xl font-bold text-gray-900 mt-1">
              {formatNumber(totals.clicks)}
            </div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">Total Conversions</div>
            <div className="text-xl font-bold text-gray-900 mt-1">
              {formatNumber(totals.conversions)}
            </div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">Total Revenue</div>
            <div className="text-xl font-bold text-green-600 mt-1">
              {formatCurrency(totals.revenue)}
            </div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">Average Conversion Rate</div>
            <div className="text-xl font-bold text-blue-600 mt-1">
              {avgConversionRate.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('totalClicks')}
                  className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                >
                  <span>KOL Name</span>
                  <SortIcon field="totalClicks" />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('totalClicks')}
                  className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                >
                  <span>Platform</span>
                  <SortIcon field="totalClicks" />
                </button>
              </th>
              <th className="px-6 py-3 text-right">
                <button
                  onClick={() => handleSort('totalClicks')}
                  className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 ml-auto"
                >
                  <span>Clicks</span>
                  <SortIcon field="totalClicks" />
                </button>
              </th>
              <th className="px-6 py-3 text-right">
                <button
                  onClick={() => handleSort('totalConversions')}
                  className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 ml-auto"
                >
                  <span>Conversions</span>
                  <SortIcon field="totalConversions" />
                </button>
              </th>
              <th className="px-6 py-3 text-right">
                <button
                  onClick={() => handleSort('conversionRate')}
                  className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 ml-auto"
                >
                  <span>Conversion Rate</span>
                  <SortIcon field="conversionRate" />
                </button>
              </th>
              <th className="px-6 py-3 text-right">
                <button
                  onClick={() => handleSort('totalRevenue')}
                  className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 ml-auto"
                >
                  <span>Revenue</span>
                  <SortIcon field="totalRevenue" />
                </button>
              </th>
              <th className="px-6 py-3 text-right">
                <button
                  onClick={() => handleSort('avgOrderValue')}
                  className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 ml-auto"
                >
                  <span>Average Order Value</span>
                  <SortIcon field="avgOrderValue" />
                </button>
              </th>
              <th className="px-6 py-3 text-right">
                <button
                  onClick={() => handleSort('totalRevenue')}
                  className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 ml-auto"
                >
                  <span>ROI</span>
                  <SortIcon field="totalRevenue" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {processedData.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            ) : (
              processedData.map((item, index) => {
                const conversionTrend = getMetricTrend(item.conversionRate, avgConversionRate);
                
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        -
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                        -
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      {formatNumber(item.totalClicks)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      {formatNumber(item.totalConversions)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <span className="text-sm font-medium text-gray-900">
                          {item.conversionRate.toFixed(2)}%
                        </span>
                        {conversionTrend.icon}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-green-600">
                      {formatCurrency(item.totalRevenue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      {formatCurrency(item.avgOrderValue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="text-sm font-medium text-gray-900">
                        -
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConversionMetricsTable;
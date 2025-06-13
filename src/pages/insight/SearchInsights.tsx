'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useGetSearchInsightsQuery } from '@/store/api/insightApi';
import { DynamicLineChart, DynamicBarChart, DynamicPieChart, DynamicWordCloud } from '@/utils/dynamicImports';
import { 
  MagnifyingGlassIcon, 
  CalendarIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  ChartBarIcon,
  CloudIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { InsightSearch } from '@/types/database';

// Platform options
const PLATFORMS = [
  { value: 'youtube', label: 'YouTube', color: '#FF0000' },
  { value: 'tiktok', label: 'TikTok', color: '#000000' },
  { value: 'instagram', label: 'Instagram', color: '#E4405F' },
];

// Product categories based on Tribit data analysis
const CATEGORIES = [
  { value: 'all', label: 'All Products' },
  { value: 'earbuds', label: 'Earbuds' },
  { value: 'speakers', label: 'Speakers' },
  { value: 'headphones', label: 'Headphones' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'comparison', label: 'Comparisons' },
  { value: 'questions', label: 'How-to/Questions' },
];

export default function SearchInsights() {
  // Search states
  const [keyword, setKeyword] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);

  // Fetch data using RTK Query
  const {
    data: searchResponse,
    isLoading,
    isError,
    error,
    refetch
  } = useGetSearchInsightsQuery({
    page: currentPage,
    pageSize: pageSize,
    keyword: keyword || undefined,
  });

  const searchData = searchResponse?.data || [];
  const total = searchResponse?.total || 0;
  const statistics = (searchResponse as any)?.statistics;

  // Calculate chart data based on real insight_search data
  const searchVolumeData = useMemo(() => {
    if (!searchData.length) return null;

    // Get top suggestions by search volume (filter out null/zero values)
    const validData = searchData
      .filter(item => item.suggestion && item.search_volume > 0)
      .sort((a, b) => (b.search_volume || 0) - (a.search_volume || 0))
      .slice(0, 15);

    if (!validData.length) return null;

    return {
      xAxis: validData.map(item => {
        // Truncate long suggestions for better display
        const suggestion = item.suggestion || 'Unknown';
        return suggestion.length > 20 ? suggestion.substring(0, 20) + '...' : suggestion;
      }),
      series: [
        {
          name: 'Search Volume',
          data: validData.map(item => item.search_volume || 0),
          type: 'bar',
          itemStyle: {
            color: new Array(validData.length).fill(0).map((_, index) => {
              const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
              return colors[index % colors.length];
            })
          },
        },
      ],
    };
  }, [searchData]);

  const productCategoryData = useMemo(() => {
    if (!searchData.length) return null;

    // Analyze Tribit product categories from suggestions
    const categoryMap = new Map();
    const categories = {
      'earbuds': ['earbuds', 'earbud', 'wireless earbuds'],
      'speakers': ['speaker', 'stormbox', 'blast', 'micro', 'maxsound'],
      'headphones': ['headphones', 'headphone', 'quietplus'],
      'accessories': ['case', 'charging', 'cable', 'mount'],
      'comparison': ['vs', 'versus', 'compare'],
      'questions': ['how', 'what', 'why', 'when', 'where']
    };

    searchData.forEach(item => {
      if (!item.suggestion) return;
      const suggestion = item.suggestion.toLowerCase();
      const volume = item.search_volume || 0;
      
      let categorized = false;
      for (const [category, keywords] of Object.entries(categories)) {
        if (keywords.some(keyword => suggestion.includes(keyword))) {
          categoryMap.set(category, (categoryMap.get(category) || 0) + volume);
          categorized = true;
          break;
        }
      }
      
      if (!categorized && volume > 0) {
        categoryMap.set('other', (categoryMap.get('other') || 0) + volume);
      }
    });

    return Array.from(categoryMap.entries())
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
      }))
      .sort((a, b) => b.value - a.value);
  }, [searchData]);

  const modifierCloudData = useMemo(() => {
    if (!searchData.length) return null;

    // Analyze search modifiers and suggestions for word cloud
    const wordMap = new Map();
    
    searchData.forEach(item => {
      if (item.suggestion) {
        // Split suggestion into words and count frequency
        const words = item.suggestion.toLowerCase()
          .replace(/[^a-zA-Z0-9\s]/g, ' ') // Remove special chars
          .split(/\s+/)
          .filter(word => word.length > 2 && word !== 'tribit'); // Filter short words and brand name
        
        words.forEach(word => {
          const volume = item.search_volume || 1;
          wordMap.set(word, (wordMap.get(word) || 0) + volume);
        });
      }
      
      // Also include modifiers
      if (item.modifier && item.modifier.length > 1) {
        const volume = item.search_volume || 1;
        wordMap.set(item.modifier, (wordMap.get(item.modifier) || 0) + volume);
      }
    });

    // Get top 50 words by frequency
    const words = Array.from(wordMap.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 50)
      .map(([name, value]) => ({
        name,
        value: Math.max(Math.log(value || 1) * 15, 12), // Scale for visualization
      }));

    if (words.length === 0) return null;

    return {
      series: [
        {
          type: 'wordCloud',
          shape: 'circle',
          left: 'center',
          top: 'center',
          width: '90%',
          height: '90%',
          right: null,
          bottom: null,
          sizeRange: [12, 60],
          rotationRange: [-90, 90],
          rotationStep: 45,
          gridSize: 8,
          drawOutOfBound: false,
          layoutAnimation: true,
          textStyle: {
            fontFamily: 'sans-serif',
            fontWeight: 'bold',
            color: () => {
              const colors = [
                '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
                '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
              ];
              return colors[Math.floor(Math.random() * colors.length)];
            },
          },
          emphasis: {
            focus: 'self',
            textStyle: {
              shadowBlur: 10,
              shadowColor: '#333',
            },
          },
          data: words,
        },
      ],
      tooltip: {
        show: true,
        formatter: (params: any) => `${params.name}: Search Interest ${params.value}`,
      },
    };
  }, [searchData]);

  // Handlers
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    refetch();
  }, [refetch]);

  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleExport = useCallback(() => {
    if (!searchData.length) return;

    const csv = [
      ['Keyword', 'Search Volume', 'CPC', 'Region', 'Language'].join(','),
      ...searchData.map(item => [
        item.keyword || '',
        item.search_volume || 0,
        item.cost_per_click || 0,
        item.region || '',
        item.language || '',
      ].join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `insight-search-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [searchData]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ChartBarIcon className="h-8 w-8 text-blue-600" />
            Tribit Brand Search Analytics
          </h1>
          <p className="text-gray-600 mt-2">
            Analyze Tribit product search patterns, volumes, and user intent across different product categories
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Keyword Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Keywords
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Search Tribit product suggestions, e.g., 'earbuds', 'stormbox'..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="self-center text-gray-500">to</span>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Platform Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platforms
                </label>
                <div className="flex gap-2">
                  {PLATFORMS.map(platform => (
                    <button
                      key={platform.value}
                      type="button"
                      onClick={() => handlePlatformToggle(platform.value)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedPlatforms.includes(platform.value)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {platform.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {CATEGORIES.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <FunnelIcon className="h-5 w-5" />
                Apply Filters
              </button>
              <button
                type="button"
                onClick={handleExport}
                disabled={!searchData.length}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
                Export Data
              </button>
            </div>
          </form>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-600">Error loading search insights. Please try again.</p>
          </div>
        )}

        {/* Results Section */}
        {!isLoading && !isError && searchData.length > 0 && (
          <>
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ChartBarIcon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Suggestions
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {total.toLocaleString()}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <MagnifyingGlassIcon className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Avg Search Volume
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {Math.round(searchData.filter(d => d.search_volume).reduce((sum, d) => sum + (d.search_volume || 0), 0) / searchData.filter(d => d.search_volume).length || 0).toLocaleString()}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Avg CPC
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        ${(searchData.filter(d => d.cost_per_click).reduce((sum, d) => sum + (d.cost_per_click || 0), 0) / searchData.filter(d => d.cost_per_click).length || 0).toFixed(2)}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Data Completeness
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {Math.round((searchData.filter(d => d.search_volume).length / searchData.length) * 100)}%
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Top Search Suggestions */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ChartBarIcon className="h-5 w-5 text-blue-600" />
                  Top Tribit Search Suggestions
                </h3>
                <div className="h-80">
                  {searchVolumeData && <DynamicBarChart data={searchVolumeData} />}
                </div>
              </div>

              {/* Product Category Distribution */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <GlobeAltIcon className="h-5 w-5 text-green-600" />
                  Product Category Interest
                </h3>
                <div className="h-80">
                  {productCategoryData && <DynamicPieChart data={productCategoryData} />}
                </div>
              </div>
            </div>

            {/* Search Term Word Cloud */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CloudIcon className="h-5 w-5 text-purple-600" />
                Search Terms & Modifiers Analysis
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Visual representation of the most popular search terms and modifiers from Tribit brand searches.
              </p>
              <div className="h-96">
                {modifierCloudData && <DynamicWordCloud option={modifierCloudData} />}
              </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Search Insights Data ({total} results)
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Search Suggestion
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Modifier
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Search Volume
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        CPC
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data Source
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {searchData.map((item: InsightSearch, index) => (
                      <tr key={item.id || index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs">
                          <div className="truncate" title={item.suggestion || '-'}>
                            {item.suggestion || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {item.modifier || '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.search_volume ? (
                            <span className="font-medium text-blue-600">
                              {item.search_volume.toLocaleString()}
                            </span>
                          ) : (
                            <span className="text-gray-400">No data</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.cost_per_click ? (
                            <span className="font-medium text-green-600">
                              ${item.cost_per_click.toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-gray-400">No data</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {item.file_source ? item.file_source.replace('.csv', '').replace('insight_search', 'Batch ') : 'Unknown'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, total)} of {total} results
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={currentPage * pageSize >= total}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* No Results */}
        {!isLoading && !isError && searchData.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No search insights found</h3>
            <p className="text-gray-500">Try adjusting your filters or search for different keywords.</p>
          </div>
        )}
      </div>
    </div>
  );
}
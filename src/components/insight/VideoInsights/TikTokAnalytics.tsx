'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ResponsiveVideoGrid } from '@/components/common/VideoPreview';

// Dynamic imports for charts
const BarChart = dynamic(() => import('@/components/common/Chart/BarChart'), { ssr: false });
const PieChart = dynamic(() => import('@/components/common/Chart/PieChart'), { ssr: false });
const LineChart = dynamic(() => import('@/components/common/Chart/LineChart'), { ssr: false });

interface CreatorData {
  name: string;
  account: string;
  avatar: string;
  follower_count: number;
  sales_30d: number;
  video_gpm: number;
}

interface ProductData {
  product_name: string;
  thumbnail: string;
  sales_revenue: number;
  rating: number;
  creator_count: number;
  category_zh: string;
}

export const TikTokAnalytics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [creators, setCreators] = useState<CreatorData[]>([]);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'creators' | 'products'>('overview');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch stats
      const statsRes = await fetch('/api/insight/video/tiktok/stats');
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData.data);
      }

      // Fetch top creators
      const creatorsRes = await fetch('/api/insight/video/tiktok/creators?pageSize=10&sortBy=sales');
      const creatorsData = await creatorsRes.json();
      if (creatorsData.success) {
        setCreators(creatorsData.data);
      }

      // Fetch top products
      const productsRes = await fetch('/api/insight/video/tiktok/products?pageSize=10&sortBy=sales');
      const productsData = await productsRes.json();
      if (productsData.success) {
        setProducts(productsData.data);
      }
    } catch (error) {
      console.error('Failed to fetch TikTok data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <p className="mt-4 text-gray-600">Loading TikTok analytics data...</p>
          </div>
        </div>
      </div>
    );
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatCurrency = (num: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-black text-white rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
              TikTok In-depth Data Analysis
            </h3>
            <p className="text-gray-300 mt-1">Based on real creator and product data</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedTab('overview')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedTab === 'overview' ? 'bg-white text-black' : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setSelectedTab('creators')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedTab === 'creators' ? 'bg-white text-black' : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              Creators
            </button>
            <button
              onClick={() => setSelectedTab('products')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedTab === 'products' ? 'bg-white text-black' : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              Products
            </button>
          </div>
        </div>
      </div>

      {/* Overview Tab */}
      {selectedTab === 'overview' && stats && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="text-sm font-medium text-gray-500">Total Creators</h4>
              <p className="mt-2 text-3xl font-bold text-gray-900">{stats.creators.total_creators}</p>
              <p className="mt-1 text-sm text-green-600">Active creators</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="text-sm font-medium text-gray-500">Total Followers</h4>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {formatNumber(stats.creators.total_followers)}
              </p>
              <p className="mt-1 text-sm text-gray-600">
                Average {formatNumber(stats.creators.avg_followers)} followers/person
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="text-sm font-medium text-gray-500">30-Day Sales</h4>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {formatCurrency(stats.creators.total_sales_30d)}
              </p>
              <p className="mt-1 text-sm text-green-600">Total creator sales</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="text-sm font-medium text-gray-500">Total Products</h4>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {formatNumber(stats.products.total_products)}
              </p>
              <p className="mt-1 text-sm text-gray-600">
                Average rating {stats.products.avg_rating}
              </p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Creator Types Distribution */}
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Creator Type Distribution</h4>
              {stats.creators.top_creator_types.length > 0 && (
                <PieChart
                  data={stats.creators.top_creator_types.map((type: any) => ({
                    name: type.type || 'Uncategorized',
                    value: type.count
                  }))}
                  height={300}
                />
              )}
            </div>

            {/* Product Categories */}
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Product Category Sales</h4>
              {stats.products.top_categories.length > 0 && (
                <BarChart
                  data={{
                    xAxis: stats.products.top_categories.map((cat: any) => cat.category),
                    series: [{
                      name: 'Sales',
                      data: stats.products.top_categories.map((cat: any) => cat.revenue)
                    }]
                  }}
                  height={300}
                />
              )}
            </div>
          </div>
        </>
      )}

      {/* Creators Tab */}
      {selectedTab === 'creators' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Top 10 Creators</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Creator
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Followers
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      30-Day Sales
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Video GPM
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {creators.map((creator, index) => (
                    <tr key={creator.account} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={creator.avatar || `https://picsum.photos/40/40?random=${index}`}
                            alt={creator.name}
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{creator.name}</div>
                            <div className="text-sm text-gray-500">@{creator.account}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatNumber(creator.follower_count)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {formatCurrency(creator.sales_30d)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{creator.video_gpm.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <a
                          href={`https://www.tiktok.com/@${creator.account}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Profile
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Products Tab */}
      {selectedTab === 'products' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Best Sellers</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.slice(0, 6).map((product, index) => (
                <div key={index} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <div className="aspect-square mb-3 overflow-hidden rounded-lg bg-gray-100">
                    <img
                      src={product.thumbnail || `https://picsum.photos/200/200?random=${index}`}
                      alt={product.product_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h5 className="font-medium text-sm text-gray-900 line-clamp-2 mb-2">
                    {product.product_name}
                  </h5>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold text-red-600">
                      {formatCurrency(product.sales_revenue)}
                    </span>
                    <span className="text-sm text-gray-500">
                      ⭐ {product.rating}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    <span>{product.creator_count} creators promoted</span>
                    <span className="mx-2">•</span>
                    <span>{product.category_zh}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Region Distribution */}
          {stats && stats.products.top_regions.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Product Regional Distribution</h4>
              <BarChart
                data={{
                  xAxis: stats.products.top_regions.map((region: any) => region.region),
                  series: [{
                    name: 'Product Count',
                    data: stats.products.top_regions.map((region: any) => region.count)
                  }]
                }}
                height={250}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
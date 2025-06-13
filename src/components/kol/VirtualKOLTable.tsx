'use client';

import React, { useState, useCallback, useEffect } from 'react';
import VirtualTable from '@/components/common/Table/VirtualTable';
import { useVirtualScroll } from '@/hooks/useVirtualScroll';
import { Column } from '@/components/common/Table/DataTable';

interface KOLData {
  id: number;
  name: string;
  platform: string;
  category: string;
  followers: number;
  avgViews: number;
  engagementRate: number;
  cpm: number;
}

// Simulated API call
const fetchKOLData = async (offset: number, limit: number): Promise<{ data: KOLData[]; hasMore: boolean }> => {
  // In production, this would be an actual API call
  const response = await fetch(`/api/kol?offset=${offset}&limit=${limit}`);
  const result = await response.json();
  
  return {
    data: result.data,
    hasMore: result.pagination.total > offset + limit
  };
};

const VirtualKOLTable: React.FC = () => {
  const { items, isLoading, hasMore, loadMore, reset } = useVirtualScroll<KOLData>(
    fetchKOLData,
    { pageSize: 100 }
  );

  // Define columns
  const columns: Column<KOLData>[] = [
    {
      key: 'name',
      header: 'KOL Name',
      width: 200,
      render: (value, item) => (
        <div className="font-medium text-gray-900">
          {value}
          <div className="text-xs text-gray-500">{item.platform}</div>
        </div>
      )
    },
    {
      key: 'category',
      header: 'Category',
      width: 150,
    },
    {
      key: 'followers',
      header: 'Followers',
      width: 120,
      align: 'right',
      render: (value) => (
        <span className="text-sm">
          {new Intl.NumberFormat('en-US', { 
            notation: 'compact', 
            maximumFractionDigits: 1 
          }).format(value as number)}
        </span>
      )
    },
    {
      key: 'avgViews',
      header: 'Avg Views',
      width: 120,
      align: 'right',
      render: (value) => (
        <span className="text-sm">
          {new Intl.NumberFormat('en-US', { 
            notation: 'compact', 
            maximumFractionDigits: 1 
          }).format(value as number)}
        </span>
      )
    },
    {
      key: 'engagementRate',
      header: 'Engagement',
      width: 100,
      align: 'right',
      render: (value) => (
        <span className="text-sm">{((value as number) * 100).toFixed(2)}%</span>
      )
    },
    {
      key: 'cpm',
      header: 'CPM',
      width: 100,
      align: 'right',
      render: (value) => (
        <span className="text-sm font-medium text-green-600">
          ${(value as number).toFixed(2)}
        </span>
      )
    }
  ];

  const handleRowClick = useCallback((item: KOLData) => {
    console.log('Clicked KOL:', item);
    // Navigate to KOL detail page
  }, []);

  // Load initial data
  useEffect(() => {
    loadMore();
  }, []);

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          KOL Database ({items.length} loaded)
        </h2>
        <button
          onClick={reset}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Reset
        </button>
      </div>

      <VirtualTable
        columns={columns}
        data={items}
        height={600}
        rowHeight={60}
        onLoadMore={loadMore}
        hasNextPage={hasMore}
        isNextPageLoading={isLoading}
        onRowClick={handleRowClick}
        className="border border-gray-200"
      />
    </div>
  );
};

export default React.memo(VirtualKOLTable);
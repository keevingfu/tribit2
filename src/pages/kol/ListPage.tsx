'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, RefreshCw, Download, ChevronRight } from 'lucide-react';
import { useGetKOLsQuery } from '@/store/api/kolApi';
import DataTable, { Column } from '@/components/common/Table/DataTable';
import LoadingSkeleton from '@/components/kol/List/LoadingSkeleton';
import type { KOL } from '@/store/api/kolApi';

// 平台选项
const PLATFORM_OPTIONS = [
  { value: '', label: 'All Platforms' },
  { value: 'YouTube', label: 'YouTube' },
  { value: 'TikTok', label: 'TikTok' },
  { value: 'Instagram', label: 'Instagram' },
  { value: 'Facebook', label: 'Facebook' },
  { value: 'Twitter', label: 'Twitter' },
];

// 地区选项
const REGION_OPTIONS = [
  { value: '', label: 'All Regions' },
  { value: 'USA', label: 'United States' },
  { value: 'UK', label: 'United Kingdom' },
  { value: 'Japan', label: 'Japan' },
  { value: 'Korea', label: 'South Korea' },
  { value: 'China', label: 'China' },
  { value: 'India', label: 'India' },
  { value: 'Singapore', label: 'Singapore' },
  { value: 'Malaysia', label: 'Malaysia' },
  { value: 'Thailand', label: 'Thailand' },
  { value: 'Indonesia', label: 'Indonesia' },
];

export default function ListPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // 搜索防抖
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // 搜索时重置到第一页
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 查询KOL数据
  const { data, isLoading, isFetching, error, refetch } = useGetKOLsQuery({
    page: currentPage,
    pageSize,
    q: debouncedSearchTerm,
    platform: selectedPlatform,
    region: selectedRegion,
  });

  // 表格列配置
  const columns: Column<KOL>[] = [
    {
      key: 'No.',
      header: '序号',
      width: '80px',
      align: 'center',
      sortable: true,
    },
    {
      key: 'kol_account',
      header: 'KOL账号',
      sortable: true,
      render: (value, item) => (
        <div className="flex items-center space-x-2">
          <span className="font-medium text-gray-900">{value}</span>
        </div>
      ),
    },
    {
      key: 'Platform',
      header: '平台',
      width: '120px',
      align: 'center',
      sortable: true,
      filterable: true,
      render: (value) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value === 'YouTube' ? 'bg-red-100 text-red-800' :
          value === 'TikTok' ? 'bg-gray-100 text-gray-800' :
          value === 'Instagram' ? 'bg-purple-100 text-purple-800' :
          value === 'Facebook' ? 'bg-blue-100 text-blue-800' :
          value === 'Twitter' ? 'bg-sky-100 text-sky-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: 'Region',
      header: '地区',
      width: '120px',
      align: 'center',
      sortable: true,
      filterable: true,
      render: (value) => {
        const regionLabel = REGION_OPTIONS.find(opt => opt.value === value)?.label || value;
        return <span className="text-gray-700">{regionLabel}</span>;
      },
    },
    {
      key: 'kol_url',
      header: 'KOL链接',
      render: (value) => (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 hover:underline flex items-center"
          onClick={(e) => e.stopPropagation()}
        >
          访问主页
          <ChevronRight className="w-3 h-3 ml-1" />
        </a>
      ),
    },
  ];

  // 处理行点击
  const handleRowClick = (item: KOL) => {
    // 使用账号名作为ID进行跳转
    const id = encodeURIComponent(item.kol_account);
    router.push(`/kol/detail/${id}`);
  };

  // 处理筛选器变化
  const handlePlatformChange = (platform: string) => {
    setSelectedPlatform(platform);
    setCurrentPage(1);
  };

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    setCurrentPage(1);
  };

  // 处理分页
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  // 导出数据
  const handleExport = () => {
    if (!data?.data || data.data.length === 0) {
      alert('没有数据可以导出');
      return;
    }

    // 准备CSV数据
    const headers = ['序号', 'KOL账号', '平台', '地区', 'KOL链接'];
    const rows = data.data.map(item => [
      item['No.'],
      item.kol_account,
      item.Platform,
      REGION_OPTIONS.find(opt => opt.value === item.Region)?.label || item.Region,
      item.kol_url
    ]);

    // 创建CSV内容
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell || ''}"`).join(','))
    ].join('\n');

    // 创建Blob并下载
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `kol_list_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6">
      {/* 页面标题 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">KOL列表</h1>
        <p className="mt-1 text-sm text-gray-500">
          管理和查看所有KOL账号信息
        </p>
      </div>

      {/* 搜索和筛选栏 */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col space-y-4">
          {/* 搜索框 */}
          <div className="w-full lg:max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="搜索KOL账号..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* 筛选器和操作按钮 */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* 平台筛选 */}
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500 hidden sm:block" />
                <select
                  value={selectedPlatform}
                  onChange={(e) => handlePlatformChange(e.target.value)}
                  className="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {PLATFORM_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 地区筛选 */}
              <select
                value={selectedRegion}
                onChange={(e) => handleRegionChange(e.target.value)}
                className="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {REGION_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 操作按钮 */}
            <div className="flex items-center space-x-2 self-end sm:self-auto">
              <button
                onClick={() => refetch()}
                disabled={isFetching}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                title="刷新数据"
              >
                <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={handleExport}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="导出数据"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 分页大小选择 */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            共 {data?.pagination?.total || 0} 条记录
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">每页显示：</span>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>

      {/* 数据表格 */}
      {isLoading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <LoadingSkeleton />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={data?.data || []}
          loading={false}
          pageSize={pageSize}
          showPagination={false}
          onRowClick={handleRowClick}
          emptyMessage="暂无KOL数据"
          hoverable
          striped
        />
      )}

      {/* 自定义分页 */}
      {data && data.pagination.total > pageSize && (
        <div className="mt-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-gray-700 text-center sm:text-left">
              显示 {(currentPage - 1) * pageSize + 1} 到 {Math.min(currentPage * pageSize, data.pagination.total)} 条，共 {data.pagination.total} 条
            </div>
            <div className="flex items-center justify-center space-x-1 sm:space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-2 sm:px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一页
              </button>
              
              {/* 页码按钮 - 移动端显示更少 */}
              {Array.from({ length: data.pagination.totalPages }, (_, i) => i + 1)
                .filter(page => {
                  const totalPages = data.pagination.totalPages;
                  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
                  const range = isMobile ? 1 : 2;
                  
                  if (totalPages <= (isMobile ? 5 : 7)) return true;
                  if (page === 1 || page === totalPages) return true;
                  if (Math.abs(page - currentPage) <= range) return true;
                  return false;
                })
                .map((page, index, pages) => {
                  const prevPage = pages[index - 1];
                  const showEllipsis = prevPage && page - prevPage > 1;
                  
                  return (
                    <React.Fragment key={page}>
                      {showEllipsis && <span className="px-1 sm:px-2 text-gray-500">...</span>}
                      <button
                        onClick={() => handlePageChange(page)}
                        className={`px-2 sm:px-3 py-1 text-sm border rounded ${
                          currentPage === page
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  );
                })}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === data.pagination.totalPages}
                className="px-2 sm:px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一页
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 错误提示 */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">
            加载数据时出错，请稍后重试。
          </p>
        </div>
      )}
    </div>
  );
}
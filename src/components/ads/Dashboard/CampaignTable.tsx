'use client';

import React, { useState } from 'react';
import { AdCampaign } from '@/types/ads';
import { 
  ChevronUpIcon, 
  ChevronDownIcon,
  FunnelIcon,
  ArrowDownTrayIcon 
} from '@heroicons/react/24/outline';

interface CampaignTableProps {
  campaigns: AdCampaign[];
  loading: boolean;
}

type SortField = 'name' | 'platform' | 'status' | 'spent' | 'impressions' | 'clicks' | 'conversions' | 'roas';
type SortOrder = 'asc' | 'desc';

const CampaignTable: React.FC<CampaignTableProps> = ({ campaigns, loading }) => {
  const [sortField, setSortField] = useState<SortField>('spent');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const platforms = ['facebook', 'google', 'tiktok', 'instagram', 'youtube'];
  const statuses = ['active', 'paused', 'completed', 'draft'];

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const filteredAndSortedCampaigns = React.useMemo(() => {
    let filtered = [...campaigns];

    // Apply filters
    if (selectedPlatforms.length > 0) {
      filtered = filtered.filter(c => selectedPlatforms.includes(c.platform));
    }
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter(c => selectedStatuses.includes(c.status));
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [campaigns, selectedPlatforms, selectedStatuses, sortField, sortOrder]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Platform', 'Status', 'Budget', 'Spent', 'Impressions', 'Clicks', 'Conversions', 'CTR', 'CPC', 'ROAS'];
    const rows = filteredAndSortedCampaigns.map(campaign => [
      campaign.name,
      campaign.platform,
      campaign.status,
      campaign.budget,
      campaign.spent,
      campaign.impressions,
      campaign.clicks,
      campaign.conversions,
      campaign.ctr,
      campaign.cpc,
      campaign.roas
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campaigns_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <div className="w-4 h-4" />;
    }
    return sortOrder === 'asc' ? (
      <ChevronUpIcon className="h-4 w-4" />
    ) : (
      <ChevronDownIcon className="h-4 w-4" />
    );
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-gray-100 text-gray-800',
      draft: 'bg-blue-100 text-blue-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status as keyof typeof colors]}`}>
        {status}
      </span>
    );
  };

  const PlatformBadge = ({ platform }: { platform: string }) => {
    const colors = {
      facebook: 'bg-blue-100 text-blue-800',
      google: 'bg-red-100 text-red-800',
      tiktok: 'bg-black text-white',
      instagram: 'bg-purple-100 text-purple-800',
      youtube: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${colors[platform as keyof typeof colors]}`}>
        {platform}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex space-x-4">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Campaign Performance</h3>
          <div className="flex items-center space-x-4">
            {/* Filters */}
            <div className="relative">
              <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                <FunnelIcon className="h-4 w-4 mr-2" />
                Filters
              </button>
            </div>

            {/* Export */}
            <button
              onClick={exportToCSV}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center space-x-1">
                  <span>Campaign</span>
                  <SortIcon field="name" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('platform')}
              >
                <div className="flex items-center space-x-1">
                  <span>Platform</span>
                  <SortIcon field="platform" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  <SortIcon field="status" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('spent')}
              >
                <div className="flex items-center space-x-1">
                  <span>Spent / Budget</span>
                  <SortIcon field="spent" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('impressions')}
              >
                <div className="flex items-center space-x-1">
                  <span>Impressions</span>
                  <SortIcon field="impressions" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('clicks')}
              >
                <div className="flex items-center space-x-1">
                  <span>Clicks</span>
                  <SortIcon field="clicks" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('conversions')}
              >
                <div className="flex items-center space-x-1">
                  <span>Conversions</span>
                  <SortIcon field="conversions" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('roas')}
              >
                <div className="flex items-center space-x-1">
                  <span>ROAS</span>
                  <SortIcon field="roas" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedCampaigns.map((campaign) => (
              <tr key={campaign.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                    <div className="text-sm text-gray-500">
                      {campaign.startDate} - {campaign.endDate}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <PlatformBadge platform={campaign.platform} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={campaign.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm text-gray-900">{formatCurrency(campaign.spent)}</div>
                    <div className="text-sm text-gray-500">of {formatCurrency(campaign.budget)}</div>
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatNumber(campaign.impressions)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm text-gray-900">{formatNumber(campaign.clicks)}</div>
                    <div className="text-sm text-gray-500">CTR: {campaign.ctr}%</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatNumber(campaign.conversions)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${campaign.roas >= 3 ? 'text-green-600' : campaign.roas >= 2 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {campaign.roas.toFixed(2)}x
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CampaignTable;
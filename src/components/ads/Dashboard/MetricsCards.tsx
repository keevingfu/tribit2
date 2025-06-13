'use client';

import React from 'react';
import { 
  CurrencyDollarIcon, 
  EyeIcon, 
  CursorArrowRaysIcon, 
  ShoppingCartIcon,
  ArrowUpIcon,
  ArrowDownIcon 
} from '@heroicons/react/24/outline';
import { AdMetrics } from '@/types/ads';

interface MetricsCardsProps {
  metrics: AdMetrics | undefined;
  loading: boolean;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  trend?: number;
  loading?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  loading 
}) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {loading ? (
            <div className="mt-2 space-y-2">
              <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
              {subtitle && <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />}
            </div>
          ) : (
            <>
              <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
              {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
              {trend !== undefined && (
                <div className={`mt-2 flex items-center text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {trend >= 0 ? (
                    <ArrowUpIcon className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 mr-1" />
                  )}
                  <span>{Math.abs(trend)}% vs last period</span>
                </div>
              )}
            </>
          )}
        </div>
        <div className="ml-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <Icon className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricsCards: React.FC<MetricsCardsProps> = ({ metrics, loading }) => {
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

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Total Spend"
        value={metrics ? formatCurrency(metrics.totalSpend) : '-'}
        subtitle={metrics ? `CPM: ${formatCurrency(metrics.averageCPM)}` : undefined}
        icon={CurrencyDollarIcon}
        trend={12.5}
        loading={loading}
      />
      <MetricCard
        title="Total Impressions"
        value={metrics ? formatNumber(metrics.totalImpressions) : '-'}
        subtitle={metrics ? `CTR: ${formatPercentage(metrics.averageCTR)}` : undefined}
        icon={EyeIcon}
        trend={8.3}
        loading={loading}
      />
      <MetricCard
        title="Total Clicks"
        value={metrics ? formatNumber(metrics.totalClicks) : '-'}
        subtitle={metrics ? `CPC: ${formatCurrency(metrics.averageCPC)}` : undefined}
        icon={CursorArrowRaysIcon}
        trend={-2.1}
        loading={loading}
      />
      <MetricCard
        title="Total Conversions"
        value={metrics ? formatNumber(metrics.totalConversions) : '-'}
        subtitle={metrics ? `ROAS: ${metrics.averageROAS.toFixed(2)}x` : undefined}
        icon={ShoppingCartIcon}
        trend={15.7}
        loading={loading}
      />
    </div>
  );
};

export default MetricsCards;
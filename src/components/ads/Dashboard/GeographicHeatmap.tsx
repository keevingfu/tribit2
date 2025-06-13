'use client';

import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import { GeographicMetrics } from '@/types/ads';

interface GeographicHeatmapProps {
  data: GeographicMetrics[];
  loading: boolean;
}

const GeographicHeatmap: React.FC<GeographicHeatmapProps> = ({ data, loading }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Initialize chart
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    if (loading) {
      chartInstance.current.showLoading();
      return;
    }

    chartInstance.current.hideLoading();

    // Sort data by spend for better visualization
    const sortedData = [...data].sort((a, b) => b.spend - a.spend);

    const option: EChartsOption = {
      title: {
        text: 'Geographic Performance',
        left: 'center',
        textStyle: {
          fontSize: 18,
          fontWeight: 'bold',
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: function(params: any) {
          const data = params[0];
          const geo = sortedData[data.dataIndex];
          return `
            <div class="font-semibold">${geo.country}</div>
            <div class="mt-1">Region: ${geo.region}</div>
            <div class="mt-1">Spend: $${geo.spend.toLocaleString()}</div>
            <div>Impressions: ${geo.impressions.toLocaleString()}</div>
            <div>Clicks: ${geo.clicks.toLocaleString()}</div>
            <div>Conversions: ${geo.conversions.toLocaleString()}</div>
            <div>CTR: ${geo.ctr.toFixed(2)}%</div>
            <div>Conv. Rate: ${geo.conversionRate.toFixed(2)}%</div>
          `;
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        name: 'Spend ($)',
        axisLabel: {
          formatter: (value: number) => `$${(value / 1000).toFixed(0)}K`,
        },
      },
      yAxis: {
        type: 'category',
        data: sortedData.map(d => d.country),
        axisLabel: {
          interval: 0,
        },
      },
      visualMap: {
        orient: 'horizontal',
        left: 'center',
        bottom: '5%',
        min: 0,
        max: Math.max(...data.map(d => d.conversionRate)),
        text: ['High Conv. Rate', 'Low Conv. Rate'],
        dimension: 0,
        inRange: {
          color: ['#FEE2E2', '#DC2626'],
        },
      },
      series: [
        {
          name: 'Spend',
          type: 'bar',
          data: sortedData.map(d => ({
            value: d.spend,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: '#3B82F6' },
                { offset: 1, color: '#1D4ED8' }
              ]),
            },
          })),
          barMaxWidth: 30,
        },
      ],
    };

    chartInstance.current.setOption(option);

    // Handle resize
    const handleResize = () => {
      chartInstance.current?.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [data, loading]);

  // Performance metrics by region
  const getRegionMetrics = () => {
    const regionMap = new Map<string, GeographicMetrics[]>();
    
    data.forEach(geo => {
      const region = geo.region;
      if (!regionMap.has(region)) {
        regionMap.set(region, []);
      }
      regionMap.get(region)!.push(geo);
    });

    const regionMetrics = Array.from(regionMap.entries()).map(([region, countries]) => {
      const totalSpend = countries.reduce((sum, c) => sum + c.spend, 0);
      const totalImpressions = countries.reduce((sum, c) => sum + c.impressions, 0);
      const totalClicks = countries.reduce((sum, c) => sum + c.clicks, 0);
      const totalConversions = countries.reduce((sum, c) => sum + c.conversions, 0);

      return {
        region,
        spend: totalSpend,
        impressions: totalImpressions,
        clicks: totalClicks,
        conversions: totalConversions,
        ctr: totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0,
        conversionRate: totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0,
      };
    });

    return regionMetrics.sort((a, b) => b.spend - a.spend);
  };

  const regionMetrics = getRegionMetrics();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div ref={chartRef} className="w-full h-[400px]" />
      </div>

      {/* Region Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Regional Summary</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Region
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Spend
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Impressions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conversions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CTR
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conv. Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {regionMetrics.map((region, index) => (
                <tr key={region.region} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {region.region}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${region.spend.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(region.impressions / 1000000).toFixed(2)}M
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {region.conversions.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {region.ctr.toFixed(2)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      region.conversionRate >= 5 ? 'bg-green-100 text-green-800' :
                      region.conversionRate >= 3 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {region.conversionRate.toFixed(2)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GeographicHeatmap;
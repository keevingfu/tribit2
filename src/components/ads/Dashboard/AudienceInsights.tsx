'use client';

import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import { DemographicBreakdown } from '@/types/ads';

interface AudienceInsightsProps {
  demographics: {
    age: DemographicBreakdown[];
    gender: DemographicBreakdown[];
    device: DemographicBreakdown[];
  };
  loading: boolean;
}

const AudienceInsights: React.FC<AudienceInsightsProps> = ({ demographics, loading }) => {
  const ageChartRef = useRef<HTMLDivElement>(null);
  const genderChartRef = useRef<HTMLDivElement>(null);
  const deviceChartRef = useRef<HTMLDivElement>(null);
  
  const ageChartInstance = useRef<echarts.ECharts | null>(null);
  const genderChartInstance = useRef<echarts.ECharts | null>(null);
  const deviceChartInstance = useRef<echarts.ECharts | null>(null);

  // Age Distribution Chart
  useEffect(() => {
    if (!ageChartRef.current) return;

    if (!ageChartInstance.current) {
      ageChartInstance.current = echarts.init(ageChartRef.current);
    }

    if (loading) {
      ageChartInstance.current.showLoading();
      return;
    }

    ageChartInstance.current.hideLoading();

    const option: EChartsOption = {
      title: {
        text: 'Age Distribution',
        left: 'center',
        textStyle: { fontSize: 16 },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: any) => {
          const data = params[0];
          return `
            <div class="font-semibold">${data.name}</div>
            <div>Impressions: ${data.value.toLocaleString()}</div>
            <div>Percentage: ${data.data.percentage}%</div>
          `;
        },
      },
      xAxis: {
        type: 'category',
        data: demographics.age.map(d => d.value),
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (value: number) => `${(value / 1000000).toFixed(1)}M`,
        },
      },
      series: [{
        type: 'bar',
        data: demographics.age.map(d => ({
          value: d.impressions,
          percentage: d.percentage,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#3B82F6' },
              { offset: 1, color: '#60A5FA' }
            ]),
          },
        })),
        barMaxWidth: 40,
      }],
    };

    ageChartInstance.current.setOption(option);
  }, [demographics.age, loading]);

  // Gender Distribution Chart
  useEffect(() => {
    if (!genderChartRef.current) return;

    if (!genderChartInstance.current) {
      genderChartInstance.current = echarts.init(genderChartRef.current);
    }

    if (loading) {
      genderChartInstance.current.showLoading();
      return;
    }

    genderChartInstance.current.hideLoading();

    const option: EChartsOption = {
      title: {
        text: 'Gender Distribution',
        left: 'center',
        textStyle: { fontSize: 16 },
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {d}%',
      },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          position: 'center',
          formatter: (params: any) => {
            return `{a|${params.name}}\n{b|${params.percent}%}`;
          },
          rich: {
            a: {
              fontSize: 14,
              fontWeight: 'bold',
              lineHeight: 20,
            },
            b: {
              fontSize: 20,
              fontWeight: 'bold',
              lineHeight: 30,
            },
          },
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold',
          },
        },
        data: demographics.gender.map(d => ({
          name: d.value,
          value: d.impressions,
          itemStyle: {
            color: d.value === 'Male' ? '#3B82F6' : '#EC4899',
          },
        })),
      }],
    };

    genderChartInstance.current.setOption(option);
  }, [demographics.gender, loading]);

  // Device Distribution Chart
  useEffect(() => {
    if (!deviceChartRef.current) return;

    if (!deviceChartInstance.current) {
      deviceChartInstance.current = echarts.init(deviceChartRef.current);
    }

    if (loading) {
      deviceChartInstance.current.showLoading();
      return;
    }

    deviceChartInstance.current.hideLoading();

    const option: EChartsOption = {
      title: {
        text: 'Device Distribution',
        left: 'center',
        textStyle: { fontSize: 16 },
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          return `
            <div class="font-semibold">${params.name}</div>
            <div>Impressions: ${params.value.toLocaleString()}</div>
            <div>Percentage: ${params.percent}%</div>
          `;
        },
      },
      series: [{
        type: 'pie',
        radius: '70%',
        data: demographics.device.map(d => ({
          name: d.value,
          value: d.impressions,
          itemStyle: {
            color: d.value === 'Mobile' ? '#10B981' : 
                  d.value === 'Desktop' ? '#3B82F6' : '#F59E0B',
          },
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      }],
    };

    deviceChartInstance.current.setOption(option);
  }, [demographics.device, loading]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      ageChartInstance.current?.resize();
      genderChartInstance.current?.resize();
      deviceChartInstance.current?.resize();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Audience Insights</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div ref={ageChartRef} className="w-full h-[300px]" />
        <div ref={genderChartRef} className="w-full h-[300px]" />
        <div ref={deviceChartRef} className="w-full h-[300px]" />
      </div>

      {/* Additional insights */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Top Age Group</h4>
          <p className="text-2xl font-bold text-gray-900">
            {demographics.age.length > 0 ? demographics.age[0].value : '-'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {demographics.age.length > 0 ? `${demographics.age[0].percentage}% of audience` : ''}
          </p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Gender Split</h4>
          <div className="flex items-center space-x-4">
            {demographics.gender.map(g => (
              <div key={g.value} className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${g.value === 'Male' ? 'bg-blue-500' : 'bg-pink-500'}`} />
                <span className="text-sm font-medium">{g.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Primary Device</h4>
          <p className="text-2xl font-bold text-gray-900">
            {demographics.device.length > 0 ? demographics.device[0].value : '-'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {demographics.device.length > 0 ? `${demographics.device[0].percentage}% usage` : ''}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AudienceInsights;
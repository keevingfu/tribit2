'use client';

import React from 'react';
import { CreativePerformance } from '@/types/ads';
import { 
  PhotoIcon, 
  VideoCameraIcon, 
  Squares2X2Icon,
  DocumentTextIcon 
} from '@heroicons/react/24/outline';

interface CreativePerformanceTableProps {
  creatives: CreativePerformance[];
  loading: boolean;
}

const CreativePerformanceTable: React.FC<CreativePerformanceTableProps> = ({ creatives, loading }) => {
  const getCreativeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return PhotoIcon;
      case 'video':
        return VideoCameraIcon;
      case 'carousel':
        return Squares2X2Icon;
      case 'text':
        return DocumentTextIcon;
      default:
        return PhotoIcon;
    }
  };

  const formatNumber = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Creative Performance</h3>
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
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Top Performing Creatives</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Creative
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Impressions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Engagement
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                CTR
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Conv. Rate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Performance
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {creatives.map((creative) => {
              const Icon = getCreativeIcon(creative.creativeType);
              const performanceScore = (creative.ctr * 0.4 + creative.conversionRate * 0.6) / 2;
              
              return (
                <tr key={creative.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{creative.creativeName}</div>
                    <div className="text-sm text-gray-500">Campaign #{creative.campaignId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Icon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900 capitalize">{creative.creativeType}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatNumber(creative.impressions)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatNumber(creative.engagement)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${
                      creative.ctr >= 1 ? 'text-green-600' : 
                      creative.ctr >= 0.5 ? 'text-yellow-600' : 
                      'text-red-600'
                    }`}>
                      {creative.ctr.toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${
                      creative.conversionRate >= 5 ? 'text-green-600' : 
                      creative.conversionRate >= 3 ? 'text-yellow-600' : 
                      'text-red-600'
                    }`}>
                      {creative.conversionRate.toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-1 mr-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              performanceScore >= 3 ? 'bg-green-500' :
                              performanceScore >= 2 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(performanceScore * 20, 100)}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {performanceScore.toFixed(1)}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Performance Tips */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Performance Tips</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Video creatives show {((creatives.filter(c => c.creativeType === 'video').reduce((acc, c) => acc + c.ctr, 0) / creatives.filter(c => c.creativeType === 'video').length) || 0).toFixed(1)}% average CTR</li>
          <li>• Carousel ads have the highest engagement rates</li>
          <li>• Consider A/B testing different creative formats</li>
        </ul>
      </div>
    </div>
  );
};

export default CreativePerformanceTable;
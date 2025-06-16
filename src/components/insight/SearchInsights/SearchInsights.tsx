'use client';

import React from 'react';

export function SearchInsights() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Search Insights</h2>
        <p className="text-gray-600 mt-1">Analyze keyword search trends and market insights</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Search Trends</h3>
          <div className="h-64 flex items-center justify-center text-gray-400">
            Loading chart...
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Keyword Cloud</h3>
          <div className="h-64 flex items-center justify-center text-gray-400">
            Loading chart...
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Popular Keywords</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              { keyword: 'Content Marketing', volume: 12500, cpc: 3.5, trend: 'up' },
              { keyword: 'KOL Marketing', volume: 8900, cpc: 4.2, trend: 'up' },
              { keyword: 'Video Promotion', volume: 6700, cpc: 2.8, trend: 'down' },
              { keyword: 'Social Media Analytics', volume: 5400, cpc: 3.1, trend: 'up' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">{item.keyword}</p>
                  <p className="text-sm text-gray-500">Search Volume: {item.volume.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">${item.cpc}</p>
                  <p className={`text-sm ${item.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {item.trend === 'up' ? '↑' : '↓'} CPC
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
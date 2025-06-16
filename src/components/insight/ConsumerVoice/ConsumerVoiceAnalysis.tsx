'use client';

import React, { useState } from 'react';
import { UserNeedsHeatmap } from './UserNeedsHeatmap';
import { SearchIntentAnalysis } from './SearchIntentAnalysis';
import { VoiceInsightCards } from './VoiceInsightCards';
import type { UserNeed, SearchIntent, VoiceInsight } from '@/types/insight';

const ConsumerVoiceAnalysis: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');

  // Sample data
  const generateUserNeeds = (): UserNeed[] => {
    return [
      { 
        category: 'Sound Quality', 
        frequency: 150, 
        sentiment: 'positive',
        examples: ['Clear sound', 'Deep bass', 'Rich audio']
      },
      { 
        category: 'Portability', 
        frequency: 120, 
        sentiment: 'positive',
        examples: ['Compact size', 'Easy to carry', 'Lightweight']
      },
      { 
        category: 'Battery Life', 
        frequency: 100, 
        sentiment: 'neutral',
        examples: ['Long battery life', 'Fast charging', 'Durable battery']
      },
      { 
        category: 'Connection Stability', 
        frequency: 80, 
        sentiment: 'neutral',
        examples: ['Stable Bluetooth', 'No disconnections', 'Easy pairing']
      },
      { 
        category: 'Price', 
        frequency: 90, 
        sentiment: 'positive',
        examples: ['Good value', 'Worth the money', 'Reasonable price']
      },
      { 
        category: 'Design', 
        frequency: 65, 
        sentiment: 'positive',
        examples: ['Attractive design', 'Stylish look', 'Quality build']
      },
      { 
        category: 'Water Resistance', 
        frequency: 45, 
        sentiment: 'positive',
        examples: ['IPX7 waterproof', 'Outdoor use', 'Good water protection']
      },
      { 
        category: 'Customer Service', 
        frequency: 30, 
        sentiment: 'negative',
        examples: ['Slow response', 'Warranty policy', 'Returns/exchanges']
      }
    ];
  };

  const generateSearchIntents = (): SearchIntent[] => {
    return [
      { intent: 'commercial', percentage: 35, keywords: ['how is it', 'worth buying', 'review'] },
      { intent: 'informational', percentage: 25, keywords: ['compare', 'vs', 'which is better'] },
      { intent: 'informational', percentage: 20, keywords: ['how to use', 'manual', 'pairing'] },
      { intent: 'transactional', percentage: 15, keywords: ['cannot connect', 'no sound', 'malfunction'] },
      { intent: 'commercial', percentage: 5, keywords: ['how much', 'price', 'discount'] }
    ];
  };

  const generateInsights = (): VoiceInsight[] => {
    return [
      {
        id: '1',
        title: 'Sound quality is the most important feature for consumers',
        description: 'Over 60% of user reviews mention sound quality, with 85% positive ratings',
        category: 'Product Features',
        impact: 'high',
        confidence: 0.85,
        actionItems: [
          'Highlight sound quality advantages in product marketing',
          'Collect more user feedback on sound quality',
          'Consider launching sound quality upgraded products',
          'Strengthen cooperation with audio technology suppliers'
        ]
      },
      {
        id: '2',
        title: 'Portability demand grows significantly',
        description: 'Outdoor usage scenarios increase, user attention to portability up 30%',
        category: 'Usage Scenarios',
        impact: 'medium',
        confidence: 0.78,
        actionItems: [
          'Optimize product design to improve portability',
          'Develop marketing content for outdoor use scenarios',
          'Launch portable versions or accessories',
          'Cross-brand cooperation with outdoor sports brands'
        ]
      },
      {
        id: '3',
        title: 'After-sales service becomes improvement focus',
        description: 'About 20% of negative feedback relates to after-sales service, needs attention',
        category: 'Service Experience',
        impact: 'high',
        confidence: 0.92,
        actionItems: [
          'Strengthen customer service team training',
          'Optimize after-sales service processes',
          'Establish faster problem feedback mechanism',
          'Launch extended warranty service to boost confidence'
        ]
      },
      {
        id: '4',
        title: 'Water resistance feature favored by outdoor users',
        description: 'Search volume for IPX7 waterproof products increased by 45%',
        category: 'Feature Requirements',
        impact: 'medium',
        confidence: 0.74,
        actionItems: [
          'Highlight waterproof features in marketing',
          'Create waterproof test demonstration videos',
          'Develop promotion strategies for outdoor sports scenarios',
          'Consider launching products with higher waterproof ratings'
        ]
      }
    ];
  };

  const userNeeds = generateUserNeeds();
  const searchIntents = generateSearchIntents();
  const insights = generateInsights();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Consumer Voice Analysis</h2>
        <select
          value={selectedTimeRange}
          onChange={(e) => setSelectedTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* Voice Insights */}
      <VoiceInsightCards insights={insights} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Needs Heatmap */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Needs Heatmap</h3>
          <UserNeedsHeatmap data={userNeeds} />
        </div>

        {/* Search Intent Analysis */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Intent Analysis</h3>
          <SearchIntentAnalysis data={searchIntents} />
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Needs Analysis</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Need Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mention Frequency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sentiment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Typical Expressions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {userNeeds.map((need, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {need.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <span>{need.frequency}</span>
                      <div className="ml-2 w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(need.frequency / 150) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${need.sentiment === 'positive' ? 'bg-green-100 text-green-800' : ''}
                      ${need.sentiment === 'negative' ? 'bg-red-100 text-red-800' : ''}
                      ${need.sentiment === 'neutral' ? 'bg-gray-100 text-gray-800' : ''}
                      ${(need.sentiment as any) === 'mixed' ? 'bg-yellow-100 text-yellow-800' : ''}
                    `}>
                      {need.sentiment === 'positive' ? 'Positive' : ''}
                      {need.sentiment === 'negative' ? 'Negative' : ''}
                      {need.sentiment === 'neutral' ? 'Neutral' : ''}
                      {(need.sentiment as any) === 'mixed' ? 'Mixed' : ''}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {need.examples.join(', ')}
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

export { ConsumerVoiceAnalysis };
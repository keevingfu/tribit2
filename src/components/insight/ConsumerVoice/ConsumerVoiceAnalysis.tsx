'use client';

import React, { useState } from 'react';
import { UserNeedsHeatmap } from './UserNeedsHeatmap';
import { SearchIntentAnalysis } from './SearchIntentAnalysis';
import { VoiceInsightCards } from './VoiceInsightCards';
import type { UserNeed, SearchIntent, VoiceInsight } from '@/types/insight';

const ConsumerVoiceAnalysis: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');

  // 示例数据
  const generateUserNeeds = (): UserNeed[] => {
    return [
      { 
        category: '音质', 
        frequency: 150, 
        sentiment: 'positive',
        examples: ['音质清晰', '低音震撼', '声音饱满']
      },
      { 
        category: '便携性', 
        frequency: 120, 
        sentiment: 'positive',
        examples: ['体积小巧', '方便携带', '轻便']
      },
      { 
        category: '电池续航', 
        frequency: 100, 
        sentiment: 'neutral',
        examples: ['续航时间长', '充电快', '电池耐用']
      },
      { 
        category: '连接稳定性', 
        frequency: 80, 
        sentiment: 'neutral',
        examples: ['蓝牙连接稳定', '不断连', '配对简单']
      },
      { 
        category: '价格', 
        frequency: 90, 
        sentiment: 'positive',
        examples: ['性价比高', '物超所值', '价格合理']
      },
      { 
        category: '外观设计', 
        frequency: 65, 
        sentiment: 'positive',
        examples: ['颜值高', '设计时尚', '做工精致']
      },
      { 
        category: '防水性能', 
        frequency: 45, 
        sentiment: 'positive',
        examples: ['IPX7防水', '户外使用', '防水效果好']
      },
      { 
        category: '售后服务', 
        frequency: 30, 
        sentiment: 'negative',
        examples: ['客服响应慢', '保修政策', '退换货']
      }
    ];
  };

  const generateSearchIntents = (): SearchIntent[] => {
    return [
      { intent: 'commercial', percentage: 35, keywords: ['怎么样', '值得买吗', '评测'] },
      { intent: 'informational', percentage: 25, keywords: ['对比', 'vs', '哪个好'] },
      { intent: 'informational', percentage: 20, keywords: ['怎么用', '说明书', '配对'] },
      { intent: 'transactional', percentage: 15, keywords: ['无法连接', '没声音', '故障'] },
      { intent: 'commercial', percentage: 5, keywords: ['多少钱', '价格', '优惠'] }
    ];
  };

  const generateInsights = (): VoiceInsight[] => {
    return [
      {
        id: '1',
        title: '音质成为消费者最关注的产品特性',
        description: '超过60%的用户评论提到音质，且正面评价占比达85%',
        category: '产品特性',
        impact: 'high',
        confidence: 0.85,
        actionItems: [
          '重点突出音质优势在产品宣传中',
          '收集更多音质相关的用户反馈',
          '考虑推出音质升级版本产品',
          '与音频技术供应商加强合作'
        ]
      },
      {
        id: '2',
        title: '便携性需求显著增长',
        description: '户外使用场景增多，用户对产品便携性的关注度提升30%',
        category: '使用场景',
        impact: 'medium',
        confidence: 0.78,
        actionItems: [
          '优化产品外形设计，提升便携性',
          '开发户外使用场景的营销内容',
          '推出便携版本或配件',
          '与户外运动品牌进行跨界合作'
        ]
      },
      {
        id: '3',
        title: '售后服务成为改进重点',
        description: '约20%的负面反馈与售后服务相关，需要重点关注',
        category: '服务体验',
        impact: 'high',
        confidence: 0.92,
        actionItems: [
          '加强客服团队培训',
          '优化售后服务流程',
          '建立更快速的问题反馈机制',
          '推出延保服务以提升用户信心'
        ]
      },
      {
        id: '4',
        title: '防水功能受到户外用户青睐',
        description: 'IPX7防水等级产品的搜索量增长45%',
        category: '功能需求',
        impact: 'medium',
        confidence: 0.74,
        actionItems: [
          '在营销中突出防水功能',
          '创建防水测试演示视频',
          '针对户外运动场景制定推广策略',
          '考虑推出更高防水等级的产品'
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
        <h2 className="text-2xl font-bold text-gray-900">消费者声音分析</h2>
        <select
          value={selectedTimeRange}
          onChange={(e) => setSelectedTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="7d">最近7天</option>
          <option value="30d">最近30天</option>
          <option value="90d">最近90天</option>
        </select>
      </div>

      {/* Voice Insights */}
      <VoiceInsightCards insights={insights} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Needs Heatmap */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">用户需求热力图</h3>
          <UserNeedsHeatmap data={userNeeds} />
        </div>

        {/* Search Intent Analysis */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">搜索意图分析</h3>
          <SearchIntentAnalysis data={searchIntents} />
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">需求详细分析</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  需求类别
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  提及频率
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  情感倾向
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  典型表述
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
                      {need.sentiment === 'positive' ? '积极' : ''}
                      {need.sentiment === 'negative' ? '消极' : ''}
                      {need.sentiment === 'neutral' ? '中性' : ''}
                      {(need.sentiment as any) === 'mixed' ? '混合' : ''}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {need.examples.join('、')}
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
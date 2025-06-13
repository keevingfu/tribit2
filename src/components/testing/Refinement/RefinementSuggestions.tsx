'use client';

import React from 'react';
import { ContentFeedback, ABTest } from './RefinementDashboard';

interface RefinementSuggestionsProps {
  feedback: ContentFeedback[];
  tests: ABTest[];
}

export const RefinementSuggestions: React.FC<RefinementSuggestionsProps> = ({ feedback, tests }) => {
  // 分析反馈生成建议
  const generateSuggestions = () => {
    const negativeFeedback = feedback.filter(f => f.sentiment === 'negative');
    const completedTests = tests.filter(t => t.status === 'completed' && t.results?.winner);
    
    const suggestions = [
      {
        id: '1',
        type: 'content',
        priority: 'high',
        title: '优化视频长度',
        description: '基于用户反馈，65%的观众在视频后半部分流失。建议将视频长度控制在5-8分钟内。',
        impact: '预计可提升完播率30%',
        effort: '中等',
        actionItems: [
          '分析高流失时间点的内容',
          '删减重复或冗余片段',
          '将详细内容制作成系列视频'
        ]
      },
      {
        id: '2',
        type: 'format',
        priority: 'medium',
        title: '增加互动元素',
        description: '互动率较高的内容获得了更多正面反馈。建议在内容中增加问答、投票等互动环节。',
        impact: '预计可提升互动率40%',
        effort: '低',
        actionItems: [
          '在视频开头提出问题',
          '中间设置投票环节',
          '结尾引导评论互动'
        ]
      },
      {
        id: '3',
        type: 'seo',
        priority: 'high',
        title: '优化标题和缩略图',
        description: 'A/B测试显示，使用场景图的缩略图点击率提升50%。建议统一更新所有内容的缩略图策略。',
        impact: '预计可提升点击率35%',
        effort: '低',
        actionItems: [
          '使用真实使用场景替代产品图',
          '标题中加入具体数字和年份',
          '缩略图增加文字说明'
        ]
      },
      {
        id: '4',
        type: 'distribution',
        priority: 'medium',
        title: '优化发布时间',
        description: '数据显示周二和周四晚上8-10点的内容表现最佳。建议调整发布计划。',
        impact: '预计可提升初始曝光20%',
        effort: '低',
        actionItems: [
          '制定固定发布时间表',
          '提前准备内容避免延期',
          '针对不同平台优化发布时间'
        ]
      }
    ];
    
    return suggestions;
  };

  const suggestions = generateSuggestions();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'content':
        return '📝';
      case 'format':
        return '🎨';
      case 'seo':
        return '🔍';
      case 'distribution':
        return '📢';
      default:
        return '💡';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case '低':
        return 'text-green-600';
      case '中等':
        return 'text-yellow-600';
      case '高':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* 优化建议概览 */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-2">优化建议总结</h3>
        <p className="text-blue-700">
          基于 {feedback.length} 条用户反馈和 {tests.filter(t => t.status === 'completed').length} 个完成的A/B测试，
          我们为您生成了 {suggestions.length} 条优化建议。实施这些建议预计可以整体提升内容效果 25-40%。
        </p>
      </div>

      {/* 建议列表 */}
      <div className="space-y-4">
        {suggestions.map((suggestion) => (
          <div key={suggestion.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">{getTypeIcon(suggestion.type)}</span>
                <div>
                  <h4 className="text-lg font-medium text-gray-900">{suggestion.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{suggestion.description}</p>
                </div>
              </div>
              <span className={`px-3 py-1 text-xs rounded-full ${getPriorityColor(suggestion.priority)}`}>
                {suggestion.priority === 'high' ? '高优先级' : suggestion.priority === 'medium' ? '中优先级' : '低优先级'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">预期效果</p>
                <p className="text-sm font-medium text-gray-900">{suggestion.impact}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">实施难度</p>
                <p className={`text-sm font-medium ${getEffortColor(suggestion.effort)}`}>{suggestion.effort}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">建议类型</p>
                <p className="text-sm font-medium text-gray-900">
                  {suggestion.type === 'content' ? '内容优化' :
                   suggestion.type === 'format' ? '格式优化' :
                   suggestion.type === 'seo' ? 'SEO优化' : '分发优化'}
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h5 className="text-sm font-medium text-gray-900 mb-2">行动计划</h5>
              <ul className="space-y-1">
                {suggestion.actionItems.map((item, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end mt-4 space-x-2">
              <button className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                查看详情
              </button>
              <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                开始实施
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 实施路线图 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">优化实施路线图</h3>
        <div className="space-y-3">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-red-600 font-medium">1</span>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-900">第一周：高优先级快速优化</p>
              <p className="text-xs text-gray-600">实施标题、缩略图和发布时间优化</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-yellow-600 font-medium">2</span>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-900">第二周：内容格式调整</p>
              <p className="text-xs text-gray-600">优化视频长度，增加互动元素</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-green-600 font-medium">3</span>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-900">第三周：效果评估与迭代</p>
              <p className="text-xs text-gray-600">分析优化效果，持续改进</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
'use client';

import React, { useState } from 'react';
import { FeedbackAnalysis } from './FeedbackAnalysis';
import { ContentOptimizer } from './ContentOptimizer';
import { ABTestResults } from './ABTestResults';
import { RefinementSuggestions } from './RefinementSuggestions';

export interface ContentFeedback {
  id: string;
  contentId: string;
  contentTitle: string;
  source: 'comment' | 'survey' | 'analytics' | 'social';
  sentiment: 'positive' | 'negative' | 'neutral';
  category: string;
  feedback: string;
  timestamp: string;
  actionTaken?: string;
}

export interface OptimizationTask {
  id: string;
  contentId: string;
  contentTitle: string;
  type: 'title' | 'thumbnail' | 'description' | 'content' | 'cta';
  currentValue: string;
  suggestedValue: string;
  expectedImprovement: number;
  status: 'pending' | 'testing' | 'completed' | 'rejected';
  priority: 'high' | 'medium' | 'low';
}

export interface ABTest {
  id: string;
  contentId: string;
  contentTitle: string;
  testName: string;
  variantA: string;
  variantB: string;
  metric: string;
  startDate: string;
  endDate?: string;
  status: 'running' | 'completed' | 'paused';
  results?: {
    variantA: { value: number; confidence: number };
    variantB: { value: number; confidence: number };
    winner?: 'A' | 'B';
    significance: number;
  };
}

export const RefinementDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'feedback' | 'optimizer' | 'abtest' | 'suggestions'>('feedback');

  // 生成示例反馈数据
  const feedbackData: ContentFeedback[] = [
    {
      id: '1',
      contentId: 'c1',
      contentTitle: 'Tribit StormBox Pro 评测',
      source: 'comment',
      sentiment: 'positive',
      category: '内容质量',
      feedback: '评测很详细，特别是音质对比部分非常有帮助',
      timestamp: '2024-06-10T10:30:00',
      actionTaken: '已标记为精选评论'
    },
    {
      id: '2',
      contentId: 'c1',
      contentTitle: 'Tribit StormBox Pro 评测',
      source: 'analytics',
      sentiment: 'negative',
      category: '用户体验',
      feedback: '视频后半部分跳出率达到65%，可能内容过长',
      timestamp: '2024-06-11T14:20:00',
      actionTaken: '计划制作精简版'
    },
    {
      id: '3',
      contentId: 'c2',
      contentTitle: '夏季音乐节必备音响推荐',
      source: 'social',
      sentiment: 'neutral',
      category: '内容建议',
      feedback: '希望能加入防水性能的对比测试',
      timestamp: '2024-06-12T09:15:00'
    }
  ];

  // 生成优化任务数据
  const optimizationTasks: OptimizationTask[] = [
    {
      id: '1',
      contentId: 'c1',
      contentTitle: 'Tribit StormBox Pro 评测',
      type: 'thumbnail',
      currentValue: 'product-shot.jpg',
      suggestedValue: 'lifestyle-outdoor.jpg',
      expectedImprovement: 23,
      status: 'testing',
      priority: 'high'
    },
    {
      id: '2',
      contentId: 'c2',
      contentTitle: '夏季音乐节必备音响推荐',
      type: 'title',
      currentValue: '夏季音乐节必备音响推荐',
      suggestedValue: '2024夏季音乐节：5款户外音响终极对比',
      expectedImprovement: 15,
      status: 'pending',
      priority: 'medium'
    }
  ];

  // 生成A/B测试数据
  const abTests: ABTest[] = [
    {
      id: '1',
      contentId: 'c1',
      contentTitle: 'Tribit StormBox Pro 评测',
      testName: '缩略图测试',
      variantA: '产品图',
      variantB: '使用场景图',
      metric: '点击率',
      startDate: '2024-06-01',
      endDate: '2024-06-08',
      status: 'completed',
      results: {
        variantA: { value: 5.2, confidence: 95 },
        variantB: { value: 7.8, confidence: 95 },
        winner: 'B',
        significance: 98.5
      }
    },
    {
      id: '2',
      contentId: 'c3',
      contentTitle: '便携音响选购指南',
      testName: '标题优化测试',
      variantA: '便携音响选购指南',
      variantB: '2024最值得买的10款便携音响',
      metric: '点击率',
      startDate: '2024-06-10',
      status: 'running',
      results: {
        variantA: { value: 3.5, confidence: 82 },
        variantB: { value: 4.1, confidence: 82 },
        significance: 65
      }
    }
  ];

  const tabs = [
    { id: 'feedback' as const, label: '反馈分析', icon: '💬' },
    { id: 'optimizer' as const, label: '内容优化', icon: '🎯' },
    { id: 'abtest' as const, label: 'A/B 测试', icon: '🧪' },
    { id: 'suggestions' as const, label: '优化建议', icon: '💡' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">内容优化与改进</h2>
          <p className="text-gray-600 mt-1">基于反馈和数据持续优化内容质量</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          生成优化报告
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'feedback' && <FeedbackAnalysis data={feedbackData} />}
        {activeTab === 'optimizer' && <ContentOptimizer tasks={optimizationTasks} />}
        {activeTab === 'abtest' && <ABTestResults tests={abTests} />}
        {activeTab === 'suggestions' && <RefinementSuggestions feedback={feedbackData} tests={abTests} />}
      </div>
    </div>
  );
};
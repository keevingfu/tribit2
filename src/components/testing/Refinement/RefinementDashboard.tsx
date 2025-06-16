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

  // Generate sample feedback data
  const feedbackData: ContentFeedback[] = [
    {
      id: '1',
      contentId: 'c1',
      contentTitle: 'Tribit StormBox Pro Review',
      source: 'comment',
      sentiment: 'positive',
      category: 'Content Quality',
      feedback: 'Very detailed review, especially the sound quality comparison was very helpful',
      timestamp: '2024-06-10T10:30:00',
      actionTaken: 'Marked as featured comment'
    },
    {
      id: '2',
      contentId: 'c1',
      contentTitle: 'Tribit StormBox Pro Review',
      source: 'analytics',
      sentiment: 'negative',
      category: 'User Experience',
      feedback: 'Video has 65% bounce rate in the second half, possibly too long',
      timestamp: '2024-06-11T14:20:00',
      actionTaken: 'Planning to create a shorter version'
    },
    {
      id: '3',
      contentId: 'c2',
      contentTitle: 'Summer Music Festival Speaker Recommendations',
      source: 'social',
      sentiment: 'neutral',
      category: 'Content Suggestions',
      feedback: 'Would like to see waterproof performance comparison tests',
      timestamp: '2024-06-12T09:15:00'
    }
  ];

  // Generate optimization task data
  const optimizationTasks: OptimizationTask[] = [
    {
      id: '1',
      contentId: 'c1',
      contentTitle: 'Tribit StormBox Pro Review',
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
      contentTitle: 'Summer Music Festival Speaker Recommendations',
      type: 'title',
      currentValue: 'Summer Music Festival Speaker Recommendations',
      suggestedValue: '2024 Summer Festival: Ultimate Comparison of 5 Outdoor Speakers',
      expectedImprovement: 15,
      status: 'pending',
      priority: 'medium'
    }
  ];

  // Generate A/B test data
  const abTests: ABTest[] = [
    {
      id: '1',
      contentId: 'c1',
      contentTitle: 'Tribit StormBox Pro Review',
      testName: 'Thumbnail Test',
      variantA: 'Product Image',
      variantB: 'Usage Scenario Image',
      metric: 'Click-through Rate',
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
      contentTitle: 'Portable Speaker Buying Guide',
      testName: 'Title Optimization Test',
      variantA: 'Portable Speaker Buying Guide',
      variantB: 'Top 10 Portable Speakers Worth Buying in 2024',
      metric: 'Click-through Rate',
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
    { id: 'feedback' as const, label: 'Feedback Analysis', icon: '💬' },
    { id: 'optimizer' as const, label: 'Content Optimization', icon: '🎯' },
    { id: 'abtest' as const, label: 'A/B Testing', icon: '🧪' },
    { id: 'suggestions' as const, label: 'Optimization Suggestions', icon: '💡' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Content Optimization & Refinement</h2>
          <p className="text-gray-600 mt-1">Continuously improve content quality based on feedback and data</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Generate Optimization Report
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
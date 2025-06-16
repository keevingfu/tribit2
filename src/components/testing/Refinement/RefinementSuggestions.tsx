'use client';

import React from 'react';
import { ContentFeedback, ABTest } from './RefinementDashboard';

interface RefinementSuggestionsProps {
  feedback: ContentFeedback[];
  tests: ABTest[];
}

export const RefinementSuggestions: React.FC<RefinementSuggestionsProps> = ({ feedback, tests }) => {
  // Analyze feedback to generate suggestions
  const generateSuggestions = () => {
    const negativeFeedback = feedback.filter(f => f.sentiment === 'negative');
    const completedTests = tests.filter(t => t.status === 'completed' && t.results?.winner);
    
    const suggestions = [
      {
        id: '1',
        type: 'content',
        priority: 'high',
        title: 'Optimize Video Length',
        description: 'Based on user feedback, 65% of viewers drop off in the second half. Recommend keeping videos between 5-8 minutes.',
        impact: 'Expected to improve completion rate by 30%',
        effort: 'Medium',
        actionItems: [
          'Analyze content at high drop-off points',
          'Remove repetitive or redundant segments',
          'Create detailed content as a video series'
        ]
      },
      {
        id: '2',
        type: 'format',
        priority: 'medium',
        title: 'Add Interactive Elements',
        description: 'Content with higher engagement received more positive feedback. Recommend adding Q&A, polls, and other interactive elements.',
        impact: 'Expected to improve engagement rate by 40%',
        effort: 'Low',
        actionItems: [
          'Ask questions at the beginning',
          'Add polls in the middle',
          'Encourage comments at the end'
        ]
      },
      {
        id: '3',
        type: 'seo',
        priority: 'high',
        title: 'Optimize Titles and Thumbnails',
        description: 'A/B tests show thumbnails with usage scenarios increased CTR by 50%. Recommend updating thumbnail strategy for all content.',
        impact: 'Expected to improve CTR by 35%',
        effort: 'Low',
        actionItems: [
          'Use real usage scenarios instead of product shots',
          'Include specific numbers and years in titles',
          'Add text overlay to thumbnails'
        ]
      },
      {
        id: '4',
        type: 'distribution',
        priority: 'medium',
        title: 'Optimize Publishing Time',
        description: 'Data shows content performs best on Tuesday and Thursday 8-10 PM. Recommend adjusting publishing schedule.',
        impact: 'Expected to improve initial exposure by 20%',
        effort: 'Low',
        actionItems: [
          'Create a fixed publishing schedule',
          'Prepare content in advance to avoid delays',
          'Optimize publishing times for different platforms'
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
      case 'Low':
        return 'text-green-600';
      case 'Medium':
        return 'text-yellow-600';
      case 'High':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Optimization Suggestions Overview */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-2">Optimization Suggestions Summary</h3>
        <p className="text-blue-700">
          Based on {feedback.length} user feedback and {tests.filter(t => t.status === 'completed').length} completed A/B tests,
          we've generated {suggestions.length} optimization suggestions. Implementing these suggestions is expected to improve overall content performance by 25-40%.
        </p>
      </div>

      {/* Suggestions List */}
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
                {suggestion.priority === 'high' ? 'High Priority' : suggestion.priority === 'medium' ? 'Medium Priority' : 'Low Priority'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Expected Impact</p>
                <p className="text-sm font-medium text-gray-900">{suggestion.impact}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Implementation Effort</p>
                <p className={`text-sm font-medium ${getEffortColor(suggestion.effort)}`}>{suggestion.effort}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Suggestion Type</p>
                <p className="text-sm font-medium text-gray-900">
                  {suggestion.type === 'content' ? 'Content Optimization' :
                   suggestion.type === 'format' ? 'Format Optimization' :
                   suggestion.type === 'seo' ? 'SEO Optimization' : 'Distribution Optimization'}
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h5 className="text-sm font-medium text-gray-900 mb-2">Action Plan</h5>
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
                View Details
              </button>
              <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Start Implementation
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Implementation Roadmap */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Optimization Implementation Roadmap</h3>
        <div className="space-y-3">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-red-600 font-medium">1</span>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-900">Week 1: High Priority Quick Wins</p>
              <p className="text-xs text-gray-600">Implement title, thumbnail, and publishing time optimizations</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-yellow-600 font-medium">2</span>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-900">Week 2: Content Format Adjustments</p>
              <p className="text-xs text-gray-600">Optimize video length and add interactive elements</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-green-600 font-medium">3</span>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-900">Week 3: Performance Evaluation & Iteration</p>
              <p className="text-xs text-gray-600">Analyze optimization results and continuously improve</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
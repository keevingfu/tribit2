'use client';

import React, { useState } from 'react';
import { ContentFeedback } from './RefinementDashboard';

interface FeedbackAnalysisProps {
  data: ContentFeedback[];
}

export const FeedbackAnalysis: React.FC<FeedbackAnalysisProps> = ({ data }) => {
  const [filterSource, setFilterSource] = useState<string>('all');
  const [filterSentiment, setFilterSentiment] = useState<string>('all');

  // Filter data
  const filteredData = data.filter(item => {
    const sourceMatch = filterSource === 'all' || item.source === filterSource;
    const sentimentMatch = filterSentiment === 'all' || item.sentiment === filterSentiment;
    return sourceMatch && sentimentMatch;
  });

  // Statistics
  const sentimentCounts = data.reduce((acc, item) => {
    acc[item.sentiment] = (acc[item.sentiment] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sourceCounts = data.reduce((acc, item) => {
    acc[item.source] = (acc[item.source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const getSentimentIcon = (sentiment: ContentFeedback['sentiment']) => {
    switch (sentiment) {
      case 'positive':
        return '😊';
      case 'negative':
        return '😞';
      default:
        return '😐';
    }
  };

  const getSentimentColor = (sentiment: ContentFeedback['sentiment']) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600 bg-green-100';
      case 'negative':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getSourceIcon = (source: ContentFeedback['source']) => {
    switch (source) {
      case 'comment':
        return '💬';
      case 'survey':
        return '📋';
      case 'analytics':
        return '📊';
      case 'social':
        return '📱';
      default:
        return '📌';
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Positive Feedback</p>
              <p className="text-2xl font-bold text-green-700">{sentimentCounts.positive || 0}</p>
            </div>
            <span className="text-3xl">😊</span>
          </div>
        </div>
        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600">Negative Feedback</p>
              <p className="text-2xl font-bold text-red-700">{sentimentCounts.negative || 0}</p>
            </div>
            <span className="text-3xl">😞</span>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Neutral Feedback</p>
              <p className="text-2xl font-bold text-gray-700">{sentimentCounts.neutral || 0}</p>
            </div>
            <span className="text-3xl">😐</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Sources</option>
              <option value="comment">Comments</option>
              <option value="survey">Surveys</option>
              <option value="analytics">Analytics</option>
              <option value="social">Social Media</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sentiment</label>
            <select
              value={filterSentiment}
              onChange={(e) => setFilterSentiment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Sentiments</option>
              <option value="positive">Positive</option>
              <option value="negative">Negative</option>
              <option value="neutral">Neutral</option>
            </select>
          </div>
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {filteredData.map((feedback) => (
          <div key={feedback.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-lg">{getSourceIcon(feedback.source)}</span>
                  <h4 className="text-sm font-medium text-gray-900">{feedback.contentTitle}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${getSentimentColor(feedback.sentiment)}`}>
                    {getSentimentIcon(feedback.sentiment)} {feedback.sentiment === 'positive' ? 'Positive' : feedback.sentiment === 'negative' ? 'Negative' : 'Neutral'}
                  </span>
                  <span className="text-xs text-gray-500">{feedback.category}</span>
                </div>
                <p className="text-gray-700 mb-3">{feedback.feedback}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    {new Date(feedback.timestamp).toLocaleString('en-US')}
                  </p>
                  {feedback.actionTaken && (
                    <p className="text-xs text-green-600">
                      ✓ {feedback.actionTaken}
                    </p>
                  )}
                </div>
              </div>
              {!feedback.actionTaken && (
                <button className="ml-4 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  Take Action
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
'use client';

import React from 'react';
import { ABTest } from './RefinementDashboard';

interface ABTestResultsProps {
  tests: ABTest[];
}

export const ABTestResults: React.FC<ABTestResultsProps> = ({ tests }) => {
  const getStatusColor = (status: ABTest['status']) => {
    switch (status) {
      case 'running':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: ABTest['status']) => {
    switch (status) {
      case 'running':
        return 'Running';
      case 'completed':
        return 'Completed';
      case 'paused':
        return 'Paused';
      default:
        return status;
    }
  };

  const getConfidenceLevel = (confidence: number) => {
    if (confidence >= 95) return { label: 'High', color: 'text-green-600' };
    if (confidence >= 80) return { label: 'Medium', color: 'text-yellow-600' };
    return { label: 'Low', color: 'text-red-600' };
  };

  return (
    <div className="space-y-6">
      {tests.map((test) => (
        <div key={test.id} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{test.contentTitle}</h3>
              <p className="text-sm text-gray-600">{test.testName}</p>
            </div>
            <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(test.status)}`}>
              {getStatusLabel(test.status)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900">Variant A</h4>
                {test.results?.winner === 'A' && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Winner</span>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2">{test.variantA}</p>
              {test.results && (
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-gray-900">
                    {test.results.variantA.value}
                    {test.metric === 'Click-through Rate' ? '%' : ''}
                  </p>
                  <p className="text-xs text-gray-500">
                    Confidence: <span className={getConfidenceLevel(test.results.variantA.confidence).color}>
                      {test.results.variantA.confidence}% ({getConfidenceLevel(test.results.variantA.confidence).label})
                    </span>
                  </p>
                </div>
              )}
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900">Variant B</h4>
                {test.results?.winner === 'B' && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Winner</span>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2">{test.variantB}</p>
              {test.results && (
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-gray-900">
                    {test.results.variantB.value}
                    {test.metric === 'Click-through Rate' ? '%' : ''}
                  </p>
                  <p className="text-xs text-gray-500">
                    Confidence: <span className={getConfidenceLevel(test.results.variantB.confidence).color}>
                      {test.results.variantB.confidence}% ({getConfidenceLevel(test.results.variantB.confidence).label})
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <span>Test Metric: {test.metric}</span>
                <span className="mx-2">•</span>
                <span>Start Date: {new Date(test.startDate).toLocaleDateString('en-US')}</span>
                {test.endDate && (
                  <>
                    <span className="mx-2">•</span>
                    <span>End Date: {new Date(test.endDate).toLocaleDateString('en-US')}</span>
                  </>
                )}
              </div>
              {test.results && test.results.significance && (
                <div className="text-sm">
                  <span className="text-gray-600">Statistical Significance: </span>
                  <span className={`font-medium ${
                    test.results.significance >= 95 ? 'text-green-600' : 
                    test.results.significance >= 80 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {test.results.significance}%
                  </span>
                </div>
              )}
            </div>

            {test.status === 'running' && (
              <div className="mt-4 flex space-x-2">
                <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  View Detailed Data
                </button>
                <button className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Pause Test
                </button>
              </div>
            )}

            {test.status === 'completed' && test.results?.winner && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  <span className="font-medium">Test Conclusion:</span>
                  Variant {test.results.winner} performed better, improving {test.metric} by {Math.abs(test.results.variantB.value - test.results.variantA.value).toFixed(1)}
                  {test.metric === 'Click-through Rate' ? '%' : ''}.
                  Recommend adopting Variant {test.results.winner}'s approach.
                </p>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Create new test */}
      <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Create New A/B Test</h3>
          <p className="mt-1 text-sm text-gray-500">Find the best solution through comparison testing</p>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
            Create Test
          </button>
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import type { VoiceInsight } from '../../../types/insight';

interface VoiceInsightCardsProps {
  insights: VoiceInsight[];
  onInsightClick?: (insight: VoiceInsight) => void;
}

export const VoiceInsightCards: React.FC<VoiceInsightCardsProps> = ({ 
  insights, 
  onInsightClick 
}) => {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'border-red-500 bg-red-50';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-green-500 bg-green-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  const getImpactLabel = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'High Priority';
      case 'medium':
        return 'Medium Priority';
      case 'low':
        return 'Low Priority';
      default:
        return impact;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {insights.map((insight) => (
        <div
          key={insight.id}
          className={`border-l-4 rounded-lg p-6 cursor-pointer transition-all hover:shadow-lg ${getImpactColor(insight.impact)}`}
          onClick={() => onInsightClick?.(insight)}
        >
          {/* Header Information */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {insight.title}
              </h3>
              <p className="text-sm text-gray-600">
                {insight.description}
              </p>
            </div>
            <div className="ml-4 text-right">
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                insight.impact === 'high' ? 'bg-red-100 text-red-800' :
                insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {getImpactLabel(insight.impact)}
              </span>
              {insight.confidence !== undefined && (
                <div className={`text-sm mt-2 ${getConfidenceColor(insight.confidence)}`}>
                  Confidence: {(insight.confidence * 100).toFixed(0)}%
                </div>
              )}
            </div>
          </div>

          {/* Category Tags */}
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full">
              {insight.category}
            </span>
          </div>

          {/* Action Suggestions */}
          {insight.actionItems && insight.actionItems.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Suggested Actions</h4>
              <ul className="space-y-1">
                {insight.actionItems.map((item, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-600">
                    <svg 
                      className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0 mt-0.5" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M9 5l7 7-7 7" 
                      />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* View Details Button */}
          <div className="mt-4 flex justify-end">
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
              View Details
              <svg 
                className="w-4 h-4 ml-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 7l5 5m0 0l-5 5m5-5H6" 
                />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
'use client';

import React, { useState } from 'react';
import { ContentIdea } from './IdeationDashboard';

interface IdeaGeneratorProps {
  onGenerateIdea: (idea: ContentIdea) => void;
}

export const IdeaGenerator: React.FC<IdeaGeneratorProps> = ({ onGenerateIdea }) => {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const categories = ['Product Reviews', 'Use Cases', 'Unboxing', 'Tech Tutorials', 'User Stories'];
  const contentTypes = ['video', 'blog', 'social', 'infographic'] as const;

  const generateIdea = () => {
    if (!topic.trim()) return;

    setIsGenerating(true);
    
    // Simulate AI generation process
    setTimeout(() => {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const contentType = contentTypes[Math.floor(Math.random() * contentTypes.length)];
      
      const templates = [
        `10 Amazing Uses for ${topic}`,
        `Why ${topic} is the Most Notable Product of 2024`,
        `Complete ${topic} Guide: From Beginner to Expert`,
        `${topic} vs Market Competitors: In-depth Analysis`,
        `My Real Experience After 30 Days with ${topic}`
      ];

      const newIdea: ContentIdea = {
        id: Date.now().toString(),
        title: templates[Math.floor(Math.random() * templates.length)],
        description: `Creative content generated based on the "${topic}" theme, suitable for ${category} type content creation`,
        category,
        keywords: [topic, category, 'review', 'experience'],
        estimatedReach: Math.floor(Math.random() * 100000) + 10000,
        engagementScore: Math.random() * 3 + 7,
        difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)] as 'easy' | 'medium' | 'hard',
        contentType,
        createdAt: new Date().toISOString(),
        trending: Math.random() > 0.5
      };

      onGenerateIdea(newIdea);
      setTopic('');
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Idea Generator</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter topic or keywords
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && generateIdea()}
            placeholder="e.g., Tribit speaker, outdoor speaker, sound quality test"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={generateIdea}
          disabled={!topic.trim() || isGenerating}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
            !topic.trim() || isGenerating
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isGenerating ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Generating...
            </div>
          ) : (
            'Generate Ideas'
          )}
        </button>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Popular Topic Suggestions</h4>
          <div className="flex flex-wrap gap-2">
            {['Sound Comparison', 'Waterproof Test', 'Battery Life', 'Portability', 'Party Speaker'].map((tag) => (
              <button
                key={tag}
                onClick={() => setTopic(tag)}
                className="px-3 py-1 bg-white text-blue-700 text-sm rounded-full hover:bg-blue-100 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
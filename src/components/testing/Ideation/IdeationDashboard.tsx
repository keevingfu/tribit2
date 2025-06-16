'use client';

import React, { useState } from 'react';
import { IdeaGenerator } from './IdeaGenerator';
import { IdeaList } from './IdeaList';
import { TrendAnalysis } from './TrendAnalysis';
import { KeywordSuggestions } from './KeywordSuggestions';

export interface ContentIdea {
  id: string;
  title: string;
  description: string;
  category: string;
  keywords: string[];
  estimatedReach: number;
  engagementScore: number;
  difficulty: 'easy' | 'medium' | 'hard';
  contentType: 'video' | 'blog' | 'social' | 'infographic';
  createdAt: string;
  trending: boolean;
}

export const IdeationDashboard: React.FC = () => {
  const [ideas, setIdeas] = useState<ContentIdea[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedContentType, setSelectedContentType] = useState('all');

  // Generate initial idea data
  React.useEffect(() => {
    const initialIdeas: ContentIdea[] = [
      {
        id: '1',
        title: 'Tribit Speaker vs Competitor Comparison',
        description: 'In-depth comparison test of Tribit and other mainstream brand speakers, evaluating from multiple dimensions such as sound quality, battery life, and waterproofing',
        category: 'Product Reviews',
        keywords: ['speaker comparison', 'Tribit review', 'sound quality test'],
        estimatedReach: 85000,
        engagementScore: 8.5,
        difficulty: 'medium',
        contentType: 'video',
        createdAt: new Date().toISOString(),
        trending: true
      },
      {
        id: '2',
        title: 'Outdoor Camping Speaker Buying Guide',
        description: 'Speaker purchasing recommendations for outdoor enthusiasts, focusing on key features such as waterproofing, battery life, and portability',
        category: 'Use Cases',
        keywords: ['outdoor speaker', 'camping gear', 'waterproof speaker'],
        estimatedReach: 62000,
        engagementScore: 7.8,
        difficulty: 'easy',
        contentType: 'blog',
        createdAt: new Date().toISOString(),
        trending: true
      },
      {
        id: '3',
        title: 'Speaker Unboxing First Experience',
        description: 'Recording the complete Tribit speaker unboxing process, showcasing product details and first impressions',
        category: 'Unboxing',
        keywords: ['unboxing', 'first experience', 'Tribit'],
        estimatedReach: 45000,
        engagementScore: 7.2,
        difficulty: 'easy',
        contentType: 'video',
        createdAt: new Date().toISOString(),
        trending: false
      }
    ];
    setIdeas(initialIdeas);
  }, []);

  const handleGenerateIdea = (newIdea: ContentIdea) => {
    setIdeas([newIdea, ...ideas]);
  };

  const filteredIdeas = ideas.filter(idea => {
    const categoryMatch = selectedCategory === 'all' || idea.category === selectedCategory;
    const typeMatch = selectedContentType === 'all' || idea.contentType === selectedContentType;
    return categoryMatch && typeMatch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Content Ideation Center</h2>
          <p className="text-gray-600 mt-1">AI-powered content ideation generation and management platform</p>
        </div>
        <div className="flex space-x-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="Product Reviews">Product Reviews</option>
            <option value="Use Cases">Use Cases</option>
            <option value="Unboxing">Unboxing</option>
            <option value="Tech Tutorials">Tech Tutorials</option>
          </select>
          <select
            value={selectedContentType}
            onChange={(e) => setSelectedContentType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="video">Video</option>
            <option value="blog">Blog</option>
            <option value="social">Social Media</option>
            <option value="infographic">Infographic</option>
          </select>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Idea Generator & Keywords */}
        <div className="space-y-6">
          <IdeaGenerator onGenerateIdea={handleGenerateIdea} />
          <KeywordSuggestions />
        </div>

        {/* Middle Column - Idea List */}
        <div className="lg:col-span-2">
          <IdeaList ideas={filteredIdeas} />
        </div>
      </div>

      {/* Trend Analysis Section */}
      <TrendAnalysis />
    </div>
  );
};
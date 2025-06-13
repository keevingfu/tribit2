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

  // 生成初始创意数据
  React.useEffect(() => {
    const initialIdeas: ContentIdea[] = [
      {
        id: '1',
        title: 'Tribit音响 vs 竞品大对比',
        description: '深度对比测试Tribit与其他主流品牌音响，从音质、续航、防水等多维度进行评测',
        category: '产品评测',
        keywords: ['音响对比', 'Tribit测评', '音质测试'],
        estimatedReach: 85000,
        engagementScore: 8.5,
        difficulty: 'medium',
        contentType: 'video',
        createdAt: new Date().toISOString(),
        trending: true
      },
      {
        id: '2',
        title: '户外露营音响选购指南',
        description: '针对户外爱好者的音响选购建议，重点介绍防水、续航、便携性等关键特性',
        category: '使用场景',
        keywords: ['户外音响', '露营装备', '防水音响'],
        estimatedReach: 62000,
        engagementScore: 7.8,
        difficulty: 'easy',
        contentType: 'blog',
        createdAt: new Date().toISOString(),
        trending: true
      },
      {
        id: '3',
        title: '音响开箱初体验',
        description: '记录Tribit音响开箱全过程，展示产品细节和初次使用感受',
        category: '开箱体验',
        keywords: ['开箱', '初体验', 'Tribit'],
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
          <h2 className="text-2xl font-bold text-gray-900">内容创意中心</h2>
          <p className="text-gray-600 mt-1">AI驱动的内容创意生成和管理平台</p>
        </div>
        <div className="flex space-x-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">所有分类</option>
            <option value="产品评测">产品评测</option>
            <option value="使用场景">使用场景</option>
            <option value="开箱体验">开箱体验</option>
            <option value="技术分享">技术分享</option>
          </select>
          <select
            value={selectedContentType}
            onChange={(e) => setSelectedContentType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">所有类型</option>
            <option value="video">视频</option>
            <option value="blog">博客</option>
            <option value="social">社交媒体</option>
            <option value="infographic">信息图</option>
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
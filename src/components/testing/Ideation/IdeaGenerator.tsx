'use client';

import React, { useState } from 'react';
import { ContentIdea } from './IdeationDashboard';

interface IdeaGeneratorProps {
  onGenerateIdea: (idea: ContentIdea) => void;
}

export const IdeaGenerator: React.FC<IdeaGeneratorProps> = ({ onGenerateIdea }) => {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const categories = ['产品评测', '使用场景', '开箱体验', '技术分享', '用户故事'];
  const contentTypes = ['video', 'blog', 'social', 'infographic'] as const;

  const generateIdea = () => {
    if (!topic.trim()) return;

    setIsGenerating(true);
    
    // 模拟AI生成过程
    setTimeout(() => {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const contentType = contentTypes[Math.floor(Math.random() * contentTypes.length)];
      
      const templates = [
        `${topic}的10个惊人用途`,
        `为什么${topic}是2024年最值得关注的产品`,
        `${topic}完全使用指南：从入门到精通`,
        `${topic} vs 市场竞品：深度对比分析`,
        `我使用${topic}30天后的真实感受`
      ];

      const newIdea: ContentIdea = {
        id: Date.now().toString(),
        title: templates[Math.floor(Math.random() * templates.length)],
        description: `基于"${topic}"主题生成的创意内容，适合${category}类型的内容创作`,
        category,
        keywords: [topic, category, '测评', '体验'],
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
      <h3 className="text-lg font-semibold text-gray-900 mb-4">AI创意生成器</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            输入主题或关键词
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && generateIdea()}
            placeholder="例如：Tribit音响、户外音响、音质测试"
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
              生成中...
            </div>
          ) : (
            '生成创意'
          )}
        </button>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">热门主题推荐</h4>
          <div className="flex flex-wrap gap-2">
            {['音质对比', '防水测试', '续航体验', '便携性', '派对音响'].map((tag) => (
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
'use client';

import React, { useState } from 'react';

export const KeywordSuggestions: React.FC = () => {
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);

  const keywordGroups = {
    '热门关键词': ['音质测评', '防水测试', '续航体验', '便携音响', '户外音响'],
    '长尾关键词': ['Tribit音响开箱', '便携音响推荐2024', '户外防水音响评测', '高性价比蓝牙音响'],
    '竞品关键词': ['JBL vs Tribit', 'Bose对比', 'Sony音响比较', '千元音响推荐'],
    '场景关键词': ['露营音响', '派对音响', '运动音响', '浴室音响', '车载音响']
  };

  const toggleKeyword = (keyword: string) => {
    setSelectedKeywords(prev => 
      prev.includes(keyword) 
        ? prev.filter(k => k !== keyword)
        : [...prev, keyword]
    );
  };

  const getKeywordMetrics = () => {
    return {
      searchVolume: Math.floor(Math.random() * 10000) + 1000,
      competition: ['低', '中', '高'][Math.floor(Math.random() * 3)],
      cpc: (Math.random() * 5 + 0.5).toFixed(2)
    };
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">关键词建议</h3>
      
      <div className="space-y-4">
        {Object.entries(keywordGroups).map(([group, keywords]) => (
          <div key={group}>
            <h4 className="text-sm font-medium text-gray-700 mb-2">{group}</h4>
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword) => {
                const isSelected = selectedKeywords.includes(keyword);
                const metrics = getKeywordMetrics();
                
                return (
                  <button
                    key={keyword}
                    onClick={() => toggleKeyword(keyword)}
                    className={`group relative px-3 py-1 rounded-full text-sm transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {keyword}
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                      <div>搜索量: {metrics.searchVolume}</div>
                      <div>竞争度: {metrics.competition}</div>
                      <div>CPC: ¥{metrics.cpc}</div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                        <div className="border-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {selectedKeywords.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-blue-900">已选关键词 ({selectedKeywords.length})</h4>
            <button
              onClick={() => setSelectedKeywords([])}
              className="text-sm text-blue-700 hover:text-blue-800"
            >
              清空
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedKeywords.map((keyword) => (
              <span key={keyword} className="px-2 py-1 bg-white text-blue-700 text-sm rounded">
                {keyword}
              </span>
            ))}
          </div>
          <button className="mt-3 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            基于关键词生成创意
          </button>
        </div>
      )}
    </div>
  );
};
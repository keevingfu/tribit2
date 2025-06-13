'use client';

import React from 'react';
import { Campaign } from './ExecutionDashboard';

interface CampaignListProps {
  campaigns: Campaign[];
  selectedCampaign: Campaign | null;
  onSelectCampaign: (campaign: Campaign) => void;
}

export const CampaignList: React.FC<CampaignListProps> = ({
  campaigns,
  selectedCampaign,
  onSelectCampaign
}) => {
  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'running': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: Campaign['status']) => {
    switch (status) {
      case 'draft': return '草稿';
      case 'scheduled': return '已计划';
      case 'running': return '进行中';
      case 'completed': return '已完成';
      case 'paused': return '已暂停';
      default: return status;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">活动列表</h3>
      </div>
      
      <div className="divide-y divide-gray-200">
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            onClick={() => onSelectCampaign(campaign)}
            className={`p-4 cursor-pointer transition-colors ${
              selectedCampaign?.id === campaign.id
                ? 'bg-blue-50 border-l-4 border-blue-600'
                : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">{campaign.name}</h4>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(campaign.startDate).toLocaleDateString('zh-CN')} - 
                  {new Date(campaign.endDate).toLocaleDateString('zh-CN')}
                </p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(campaign.status)}`}>
                {getStatusLabel(campaign.status)}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>进度</span>
                <span>{campaign.progress}%</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${campaign.progress}%` }}
                />
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="text-gray-600">
                任务: <span className="font-medium text-gray-900">{campaign.tasks.length}</span>
              </div>
              <div className="text-gray-600">
                类型: <span className="font-medium text-gray-900">
                  {campaign.type === 'multi-channel' ? '多渠道' : campaign.type}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
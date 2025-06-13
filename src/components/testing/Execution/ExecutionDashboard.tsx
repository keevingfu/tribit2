'use client';

import React, { useState } from 'react';
import { CampaignList } from './CampaignList';
import { TaskBoard } from './TaskBoard';
import { PerformanceMetrics } from './PerformanceMetrics';
import { ContentCalendar } from './ContentCalendar';

export interface Campaign {
  id: string;
  name: string;
  status: 'draft' | 'scheduled' | 'running' | 'completed' | 'paused';
  type: 'video' | 'blog' | 'social' | 'multi-channel';
  startDate: string;
  endDate: string;
  progress: number;
  tasks: Task[];
  metrics: {
    views: number;
    engagement: number;
    conversions: number;
    roi: number;
  };
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  assignee?: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dependencies?: string[];
}

export const ExecutionDashboard: React.FC = () => {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  // 生成示例活动数据
  const campaigns: Campaign[] = [
    {
      id: '1',
      name: 'Tribit音响夏季推广',
      status: 'running',
      type: 'multi-channel',
      startDate: '2024-06-01',
      endDate: '2024-08-31',
      progress: 65,
      tasks: [
        {
          id: 't1',
          title: '拍摄产品展示视频',
          description: '展示Tribit音响的主要功能和使用场景',
          status: 'completed',
          dueDate: '2024-06-15',
          priority: 'high'
        },
        {
          id: 't2',
          title: '撰写评测文章',
          description: '深度评测Tribit音响的音质、续航等特性',
          status: 'in-progress',
          dueDate: '2024-06-20',
          priority: 'high'
        },
        {
          id: 't3',
          title: '社交媒体推广',
          description: '在各大社交平台发布宣传内容',
          status: 'review',
          dueDate: '2024-06-25',
          priority: 'medium'
        }
      ],
      metrics: {
        views: 125000,
        engagement: 8.5,
        conversions: 1250,
        roi: 3.2
      }
    },
    {
      id: '2',
      name: '户外音响使用指南',
      status: 'scheduled',
      type: 'video',
      startDate: '2024-07-01',
      endDate: '2024-07-15',
      progress: 20,
      tasks: [
        {
          id: 't4',
          title: '场景规划',
          description: '确定户外使用场景和拍摄地点',
          status: 'in-progress',
          dueDate: '2024-06-28',
          priority: 'medium'
        },
        {
          id: 't5',
          title: '脚本撰写',
          description: '编写视频脚本和分镜头',
          status: 'todo',
          dueDate: '2024-06-30',
          priority: 'high'
        }
      ],
      metrics: {
        views: 0,
        engagement: 0,
        conversions: 0,
        roi: 0
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">内容执行管理</h2>
          <p className="text-gray-600 mt-1">管理和跟踪内容营销活动的执行进度</p>
        </div>
        <div className="flex space-x-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              列表视图
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              日历视图
            </button>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            创建新活动
          </button>
        </div>
      </div>

      {/* Performance Metrics */}
      <PerformanceMetrics campaigns={campaigns} />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaign List */}
        <div className="lg:col-span-1">
          <CampaignList 
            campaigns={campaigns}
            selectedCampaign={selectedCampaign}
            onSelectCampaign={setSelectedCampaign}
          />
        </div>

        {/* Task Board or Calendar */}
        <div className="lg:col-span-2">
          {viewMode === 'list' ? (
            <TaskBoard campaign={selectedCampaign || campaigns[0]} />
          ) : (
            <ContentCalendar campaigns={campaigns} />
          )}
        </div>
      </div>
    </div>
  );
};
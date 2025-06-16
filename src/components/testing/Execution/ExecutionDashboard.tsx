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

  // Generate example campaign data
  const campaigns: Campaign[] = [
    {
      id: '1',
      name: 'Tribit Speaker Summer Promotion',
      status: 'running',
      type: 'multi-channel',
      startDate: '2024-06-01',
      endDate: '2024-08-31',
      progress: 65,
      tasks: [
        {
          id: 't1',
          title: 'Product Showcase Video',
          description: 'Showcase Tribit speaker main features and use cases',
          status: 'completed',
          dueDate: '2024-06-15',
          priority: 'high'
        },
        {
          id: 't2',
          title: 'Write Review Article',
          description: 'In-depth review of Tribit speaker sound quality, battery life and features',
          status: 'in-progress',
          dueDate: '2024-06-20',
          priority: 'high'
        },
        {
          id: 't3',
          title: 'Social Media Promotion',
          description: 'Publish promotional content across major social platforms',
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
      name: 'Outdoor Speaker Usage Guide',
      status: 'scheduled',
      type: 'video',
      startDate: '2024-07-01',
      endDate: '2024-07-15',
      progress: 20,
      tasks: [
        {
          id: 't4',
          title: 'Scene Planning',
          description: 'Determine outdoor usage scenarios and shooting locations',
          status: 'in-progress',
          dueDate: '2024-06-28',
          priority: 'medium'
        },
        {
          id: 't5',
          title: 'Script Writing',
          description: 'Write video script and storyboard',
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
          <h2 className="text-2xl font-bold text-gray-900">Content Execution Management</h2>
          <p className="text-gray-600 mt-1">Manage and track content marketing campaign execution progress</p>
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
              List View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Calendar View
            </button>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Create New Campaign
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
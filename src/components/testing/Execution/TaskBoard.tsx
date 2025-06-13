'use client';

import React from 'react';
import { Campaign, Task } from './ExecutionDashboard';

interface TaskBoardProps {
  campaign: Campaign;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({ campaign }) => {
  const taskColumns = {
    'todo': { title: '待办', tasks: [] as Task[] },
    'in-progress': { title: '进行中', tasks: [] as Task[] },
    'review': { title: '审核中', tasks: [] as Task[] },
    'completed': { title: '已完成', tasks: [] as Task[] }
  };

  // 将任务分组到对应的列
  campaign.tasks.forEach(task => {
    taskColumns[task.status].tasks.push(task);
  });

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getPriorityLabel = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent': return '紧急';
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
      default: return priority;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{campaign.name} - 任务看板</h3>
        <p className="text-sm text-gray-600 mt-1">{campaign.tasks.length} 个任务</p>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(taskColumns).map(([status, column]) => (
            <div key={status} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-gray-900">{column.title}</h4>
                <span className="text-xs text-gray-500">{column.tasks.length}</span>
              </div>
              
              <div className="space-y-3">
                {column.tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`bg-white rounded-lg p-4 border-l-4 cursor-pointer hover:shadow-md transition-shadow ${getPriorityColor(task.priority)}`}
                  >
                    <h5 className="text-sm font-medium text-gray-900 mb-2">{task.title}</h5>
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        task.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                        task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {getPriorityLabel(task.priority)}
                      </span>
                      
                      <div className="flex items-center text-xs text-gray-500">
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(task.dueDate).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                    
                    {task.assignee && (
                      <div className="mt-3 flex items-center">
                        <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs text-gray-700">
                          {task.assignee.charAt(0)}
                        </div>
                        <span className="ml-2 text-xs text-gray-600">{task.assignee}</span>
                      </div>
                    )}
                  </div>
                ))}
                
                {column.tasks.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <p className="text-sm">暂无任务</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
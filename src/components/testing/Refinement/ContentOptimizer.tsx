'use client';

import React, { useState } from 'react';
import { OptimizationTask } from './RefinementDashboard';

interface ContentOptimizerProps {
  tasks: OptimizationTask[];
}

export const ContentOptimizer: React.FC<ContentOptimizerProps> = ({ tasks }) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  // 过滤任务
  const filteredTasks = tasks.filter(task => {
    const statusMatch = filterStatus === 'all' || task.status === filterStatus;
    const priorityMatch = filterPriority === 'all' || task.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

  const getStatusColor = (status: OptimizationTask['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'testing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: OptimizationTask['status']) => {
    switch (status) {
      case 'pending':
        return '待处理';
      case 'testing':
        return '测试中';
      case 'completed':
        return '已完成';
      case 'rejected':
        return '已拒绝';
      default:
        return status;
    }
  };

  const getPriorityColor = (priority: OptimizationTask['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTypeIcon = (type: OptimizationTask['type']) => {
    switch (type) {
      case 'title':
        return '📝';
      case 'thumbnail':
        return '🖼️';
      case 'description':
        return '📄';
      case 'content':
        return '📋';
      case 'cta':
        return '🎯';
      default:
        return '📌';
    }
  };

  return (
    <div className="space-y-6">
      {/* 过滤器 */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">全部状态</option>
              <option value="pending">待处理</option>
              <option value="testing">测试中</option>
              <option value="completed">已完成</option>
              <option value="rejected">已拒绝</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">优先级</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">全部优先级</option>
              <option value="high">高</option>
              <option value="medium">中</option>
              <option value="low">低</option>
            </select>
          </div>
        </div>
      </div>

      {/* 任务列表 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                内容
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                优化类型
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                预期提升
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                状态
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTasks.map((task) => (
              <tr key={task.id}>
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{task.contentTitle}</div>
                    <div className={`text-xs ${getPriorityColor(task.priority)}`}>
                      优先级: {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">{getTypeIcon(task.type)}</span>
                    <span className="text-sm text-gray-900">
                      {task.type === 'title' ? '标题' : 
                       task.type === 'thumbnail' ? '缩略图' :
                       task.type === 'description' ? '描述' :
                       task.type === 'content' ? '内容' : 'CTA'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span className="text-sm font-medium text-gray-900">+{task.expectedImprovement}%</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
                    {getStatusLabel(task.status)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    {task.status === 'pending' && (
                      <>
                        <button className="text-sm text-blue-600 hover:text-blue-900">开始测试</button>
                        <button className="text-sm text-gray-600 hover:text-gray-900">查看详情</button>
                      </>
                    )}
                    {task.status === 'testing' && (
                      <button className="text-sm text-blue-600 hover:text-blue-900">查看进度</button>
                    )}
                    {task.status === 'completed' && (
                      <button className="text-sm text-green-600 hover:text-green-900">查看结果</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 优化建议预览 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTasks.filter(task => task.status === 'pending').slice(0, 2).map((task) => (
          <div key={task.id} className="bg-white rounded-lg shadow p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              {getTypeIcon(task.type)} {task.contentTitle} - {
                task.type === 'title' ? '标题优化' : 
                task.type === 'thumbnail' ? '缩略图优化' :
                task.type === 'description' ? '描述优化' :
                task.type === 'content' ? '内容优化' : 'CTA优化'
              }
            </h4>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">当前:</p>
                <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{task.currentValue}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">建议:</p>
                <p className="text-sm text-gray-700 bg-blue-50 p-2 rounded">{task.suggestedValue}</p>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm text-gray-600">预期提升: <span className="font-medium text-green-600">+{task.expectedImprovement}%</span></span>
                <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                  应用优化
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
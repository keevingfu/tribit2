'use client';

import React, { useState } from 'react';
import { OptimizationTask } from './RefinementDashboard';

interface ContentOptimizerProps {
  tasks: OptimizationTask[];
}

export const ContentOptimizer: React.FC<ContentOptimizerProps> = ({ tasks }) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  // Filter tasks
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
        return 'Pending';
      case 'testing':
        return 'Testing';
      case 'completed':
        return 'Completed';
      case 'rejected':
        return 'Rejected';
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
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="testing">Testing</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Content
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Optimization Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expected Improvement
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
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
                      Priority: {task.priority === 'high' ? 'High' : task.priority === 'medium' ? 'Medium' : 'Low'}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">{getTypeIcon(task.type)}</span>
                    <span className="text-sm text-gray-900">
                      {task.type === 'title' ? 'Title' : 
                       task.type === 'thumbnail' ? 'Thumbnail' :
                       task.type === 'description' ? 'Description' :
                       task.type === 'content' ? 'Content' : 'CTA'}
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
                        <button className="text-sm text-blue-600 hover:text-blue-900">Start Test</button>
                        <button className="text-sm text-gray-600 hover:text-gray-900">View Details</button>
                      </>
                    )}
                    {task.status === 'testing' && (
                      <button className="text-sm text-blue-600 hover:text-blue-900">View Progress</button>
                    )}
                    {task.status === 'completed' && (
                      <button className="text-sm text-green-600 hover:text-green-900">View Results</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Optimization Suggestions Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTasks.filter(task => task.status === 'pending').slice(0, 2).map((task) => (
          <div key={task.id} className="bg-white rounded-lg shadow p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              {getTypeIcon(task.type)} {task.contentTitle} - {
                task.type === 'title' ? 'Title Optimization' : 
                task.type === 'thumbnail' ? 'Thumbnail Optimization' :
                task.type === 'description' ? 'Description Optimization' :
                task.type === 'content' ? 'Content Optimization' : 'CTA Optimization'
              }
            </h4>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Current:</p>
                <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{task.currentValue}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Suggested:</p>
                <p className="text-sm text-gray-700 bg-blue-50 p-2 rounded">{task.suggestedValue}</p>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm text-gray-600">Expected Improvement: <span className="font-medium text-green-600">+{task.expectedImprovement}%</span></span>
                <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                  Apply Optimization
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
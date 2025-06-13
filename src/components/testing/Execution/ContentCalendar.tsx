'use client';

import React, { useState } from 'react';
import { Campaign } from './ExecutionDashboard';

interface ContentCalendarProps {
  campaigns: Campaign[];
}

export const ContentCalendar: React.FC<ContentCalendarProps> = ({ campaigns }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // 获取当前月份的天数
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // 获取月份第一天是星期几
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // 生成日历数据
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // 添加空白天数
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // 添加实际天数
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  // 获取某一天的任务
  const getTasksForDay = (day: number) => {
    const tasks: any[] = [];
    const dayDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);

    campaigns.forEach(campaign => {
      campaign.tasks.forEach(task => {
        const taskDate = new Date(task.dueDate);
        if (
          taskDate.getFullYear() === dayDate.getFullYear() &&
          taskDate.getMonth() === dayDate.getMonth() &&
          taskDate.getDate() === dayDate.getDate()
        ) {
          tasks.push({
            ...task,
            campaignName: campaign.name,
            campaignType: campaign.type
          });
        }
      });
    });

    return tasks;
  };

  // 导航到上个月
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  // 导航到下个月
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  const getTaskColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-purple-100 text-purple-800';
      case 'blog': return 'bg-blue-100 text-blue-800';
      case 'social': return 'bg-green-100 text-green-800';
      case 'multi-channel': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">内容日历</h3>
          <div className="flex items-center space-x-4">
            <button
              onClick={goToPreviousMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-base font-medium text-gray-900">
              {currentMonth.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })}
            </span>
            <button
              onClick={goToNextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* 星期标题 */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map((day, index) => (
            <div key={index} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* 日历天数 */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, index) => {
            const tasks = day ? getTasksForDay(day) : [];
            const isToday = day && 
              new Date().getFullYear() === currentMonth.getFullYear() &&
              new Date().getMonth() === currentMonth.getMonth() &&
              new Date().getDate() === day;

            return (
              <div
                key={index}
                className={`min-h-[100px] border rounded-lg p-2 ${
                  day ? 'hover:bg-gray-50' : ''
                } ${isToday ? 'bg-blue-50 border-blue-500' : 'border-gray-200'}`}
              >
                {day && (
                  <>
                    <div className={`text-sm font-medium mb-1 ${
                      isToday ? 'text-blue-600' : 'text-gray-900'
                    }`}>
                      {day}
                    </div>
                    <div className="space-y-1">
                      {tasks.slice(0, 3).map((task, taskIndex) => (
                        <div
                          key={taskIndex}
                          className={`text-xs px-1 py-0.5 rounded truncate ${getTaskColor(task.campaignType)}`}
                          title={`${task.campaignName}: ${task.title}`}
                        >
                          {task.title}
                        </div>
                      ))}
                      {tasks.length > 3 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{tasks.length - 3} 更多
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* 图例 */}
        <div className="mt-6 flex items-center space-x-4 text-sm">
          <span className="text-gray-600">类型：</span>
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-100 rounded mr-1"></div>
              <span className="text-gray-600">视频</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-100 rounded mr-1"></div>
              <span className="text-gray-600">博客</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-100 rounded mr-1"></div>
              <span className="text-gray-600">社交</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-orange-100 rounded mr-1"></div>
              <span className="text-gray-600">多渠道</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
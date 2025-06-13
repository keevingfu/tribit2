'use client';

import React, { useState } from 'react';
import { CalendarIcon } from '@heroicons/react/24/outline';

interface DateRangeSelectorProps {
  onDateRangeChange: (startDate: string, endDate: string) => void;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({ onDateRangeChange }) => {
  const [selectedRange, setSelectedRange] = useState('last30days');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const handleRangeChange = (range: string) => {
    setSelectedRange(range);
    setShowCustom(range === 'custom');

    const today = new Date();
    let startDate: Date;
    let endDate = today;

    switch (range) {
      case 'today':
        startDate = today;
        break;
      case 'yesterday':
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 1);
        endDate = new Date(startDate);
        break;
      case 'last7days':
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'last30days':
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 30);
        break;
      case 'last90days':
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 90);
        break;
      case 'thisMonth':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case 'lastMonth':
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        endDate = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case 'custom':
        return; // Wait for custom input
      default:
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 30);
    }

    if (range !== 'custom') {
      onDateRangeChange(
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      );
    }
  };

  const handleCustomDateSubmit = () => {
    if (customStart && customEnd) {
      onDateRangeChange(customStart, customEnd);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <CalendarIcon className="h-5 w-5 text-gray-400" />
      
      <select
        value={selectedRange}
        onChange={(e) => handleRangeChange(e.target.value)}
        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
      >
        <option value="today">Today</option>
        <option value="yesterday">Yesterday</option>
        <option value="last7days">Last 7 days</option>
        <option value="last30days">Last 30 days</option>
        <option value="last90days">Last 90 days</option>
        <option value="thisMonth">This month</option>
        <option value="lastMonth">Last month</option>
        <option value="custom">Custom range</option>
      </select>

      {showCustom && (
        <div className="flex items-center space-x-2">
          <input
            type="date"
            value={customStart}
            onChange={(e) => setCustomStart(e.target.value)}
            className="block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            placeholder="Start date"
          />
          <span className="text-gray-500">to</span>
          <input
            type="date"
            value={customEnd}
            onChange={(e) => setCustomEnd(e.target.value)}
            className="block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            placeholder="End date"
          />
          <button
            onClick={handleCustomDateSubmit}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
};

export default DateRangeSelector;
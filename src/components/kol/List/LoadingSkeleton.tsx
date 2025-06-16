'use client';

import React from 'react';

export default function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Table Header */}
      <div className="bg-gray-100 h-12 rounded-t-lg"></div>
      
      {/* Table Rows */}
      {[...Array(5)].map((_, index) => (
        <div key={index} className="border-b border-gray-200">
          <div className="flex items-center space-x-4 p-4">
            <div className="h-4 bg-gray-200 rounded w-12"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-48"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded-full w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
'use client';

import React from 'react';
import * as echarts from 'echarts';
import 'echarts-wordcloud';
import ChartWrapper from './ChartWrapper';

// WordCloud series type is handled by echarts-wordcloud
// Using 'as any' to bypass TypeScript strict checking for wordCloud type

interface WordCloudData {
  name: string;
  value: number;
}

interface WordCloudProps {
  data?: WordCloudData[];
  option?: any;
  height?: string | number;
  className?: string;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const WordCloud: React.FC<WordCloudProps> = ({
  data,
  option,
  height = 400,
  className = '',
  loading = false,
  error = null,
  onRetry,
}) => {
  // Use option if provided, otherwise create from data
  let chartOption: any; // Use 'any' to bypass strict type checking for wordCloud

  if (option) {
    chartOption = option;
  } else if (data && data.length > 0) {
    chartOption = {
      tooltip: {
        show: true,
        formatter: (params: any) => {
          return `${params.name}: ${params.value}`;
        },
      },
      series: [
        {
          type: 'wordCloud',
          shape: 'circle',
          left: 'center',
          top: 'center',
          width: '90%',
          height: '90%',
          sizeRange: [12, 60],
          rotationRange: [-90, 90],
          rotationStep: 45,
          gridSize: 8,
          drawOutOfBound: false,
          layoutAnimation: true,
          textStyle: {
            fontFamily: 'sans-serif',
            fontWeight: 'bold',
            color: () => {
              const colors = [
                '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
                '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
              ];
              return colors[Math.floor(Math.random() * colors.length)];
            },
          },
          emphasis: {
            focus: 'self',
            textStyle: {
              shadowBlur: 10,
              shadowColor: '#333',
            },
          },
          data: data,
        },
      ],
    };
  } else {
    // No data available
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height }}>
        <div className="text-center">
          <p className="text-gray-500 mb-2">No keywords available</p>
          <p className="text-sm text-gray-400">
            Search for keywords to see the word cloud
          </p>
        </div>
      </div>
    );
  }

  return (
    <ChartWrapper
      option={chartOption}
      height={height}
      loading={loading}
      error={error}
      onRetry={onRetry}
      className={className}
    />
  );
};

export default WordCloud;
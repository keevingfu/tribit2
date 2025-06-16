'use client';

import React, { useMemo } from 'react';
import ChartWrapper from '../../common/Chart/ChartWrapper';
import type { EChartsOption } from 'echarts';
import type { VideoData } from '@/types/insight';

interface ViralFactorAnalysisProps {
  videos: VideoData[];
  selectedVideo?: VideoData | null;
}

export const ViralFactorAnalysis: React.FC<ViralFactorAnalysisProps> = ({ 
  videos, 
  selectedVideo 
}) => {
  const option: EChartsOption = useMemo(() => {
    if (!videos || videos.length === 0) {
      return {};
    }

    const factors = ['Content Quality', 'Viral Potential', 'Engagement Appeal', 'Timing', 'Creator Influence', 'Algorithm'];

    const getFactorScores = (video?: VideoData) => {
      if (video) {
        return [
          Math.min(video.engagementRate * 4, 100),
          Math.min(video.shares / video.views * 10000, 100),
          Math.min(video.comments / video.views * 5000, 100),
          Math.random() * 30 + 70,
          Math.min(video.creator.followers / 10000, 100),
          Math.random() * 20 + 60
        ];
      } else {
        return factors.map(() => Math.random() * 40 + 50);
      }
    };

    const currentScores = getFactorScores(selectedVideo || undefined);

    return {
      title: {
        text: selectedVideo ? `${selectedVideo.title.slice(0, 30)}... - Viral Factor Analysis` : 'Overall Viral Factor Analysis',
        left: 'center',
        top: 10,
        textStyle: { fontSize: 14 }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      radar: {
        indicator: factors.map(factor => ({ name: factor, max: 100 })),
        center: ['50%', '50%'],
        radius: '60%'
      },
      series: [{
        type: 'radar',
        data: [{
          value: currentScores,
          name: selectedVideo ? 'Current Video' : 'Average Level',
          areaStyle: { opacity: 0.3 }
        }]
      }]
    };
  }, [videos, selectedVideo]);

  return <ChartWrapper option={option} height={350} />;
};
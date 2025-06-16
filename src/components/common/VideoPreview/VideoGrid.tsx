import React, { useCallback } from 'react';
import { FixedSizeGrid } from 'react-window';
import VideoPreviewCard from './VideoPreviewCard';

interface VideoData {
  url: string;
  platform: 'youtube' | 'instagram' | 'tiktok';
  title?: string;
  thumbnail?: string;
  duration?: string;
  creator?: string;
}

interface VideoGridProps {
  videos: VideoData[];
  columns?: number;
  itemHeight?: number;
  gridHeight?: number;
  gap?: number;
  aspectRatio?: '16/9' | '9/16' | 'auto';
  onVideoPlay?: (video: VideoData) => void;
}

const VideoGrid: React.FC<VideoGridProps> = ({
  videos,
  columns = 3,
  itemHeight = 300,
  gridHeight = 600,
  gap = 16,
  aspectRatio = '16/9',
  onVideoPlay
}) => {
  const rowCount = Math.ceil(videos.length / columns);
  
  const Cell = useCallback(({ columnIndex, rowIndex, style }: any) => {
    const index = rowIndex * columns + columnIndex;
    if (index >= videos.length) return null;
    
    const video = videos[index];
    
    return (
      <div 
        style={{
          ...style,
          padding: gap / 2
        }}
      >
        <VideoPreviewCard
          video={video}
          aspectRatio={aspectRatio}
          onPlay={() => onVideoPlay?.(video)}
        />
      </div>
    );
  }, [videos, columns, gap, aspectRatio, onVideoPlay]);

  // For smaller video counts, use regular grid
  if (videos.length <= 12) {
    return (
      <div 
        className="grid gap-4"
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`
        }}
      >
        {videos.map((video, index) => (
          <VideoPreviewCard
            key={`${video.platform}-${index}`}
            video={video}
            aspectRatio={aspectRatio}
            onPlay={() => onVideoPlay?.(video)}
          />
        ))}
      </div>
    );
  }

  // For larger video counts, use virtual scrolling
  return (
    <FixedSizeGrid
      columnCount={columns}
      columnWidth={window.innerWidth / columns - gap}
      height={gridHeight}
      rowCount={rowCount}
      rowHeight={itemHeight}
      width={window.innerWidth}
    >
      {Cell}
    </FixedSizeGrid>
  );
};

// Responsive video grid without virtual scrolling
export const ResponsiveVideoGrid: React.FC<Omit<VideoGridProps, 'columns' | 'gridHeight'>> = ({
  videos,
  aspectRatio = '16/9',
  onVideoPlay
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {videos.map((video, index) => (
        <VideoPreviewCard
          key={`${video.platform}-${index}`}
          video={video}
          aspectRatio={aspectRatio}
          onPlay={() => onVideoPlay?.(video)}
        />
      ))}
    </div>
  );
};

export default VideoGrid;
import React, { useState, useEffect, useRef } from 'react';
import { Play, ExternalLink, AlertCircle } from 'lucide-react';

interface VideoData {
  url: string;
  platform: 'youtube' | 'instagram' | 'tiktok';
  title?: string;
  thumbnail?: string;
  duration?: string;
  creator?: string;
}

interface VideoPreviewCardProps {
  video: VideoData;
  className?: string;
  showTitle?: boolean;
  aspectRatio?: '16/9' | '9/16' | 'auto';
  onPlay?: () => void;
}

const VideoPreviewCard: React.FC<VideoPreviewCardProps> = ({ 
  video, 
  className = '', 
  showTitle = true,
  aspectRatio = '16/9',
  onPlay 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.1 }
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  // Extract video ID from URL
  const getVideoId = (url: string, platform: string) => {
    switch (platform) {
      case 'youtube':
        const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
        return youtubeMatch?.[1];
      case 'instagram':
        const instagramMatch = url.match(/instagram\.com\/(?:p|reel)\/([^/?]+)/);
        return instagramMatch?.[1];
      case 'tiktok':
        const tiktokMatch = url.match(/tiktok\.com\/@[\w.-]+\/video\/(\d+)/);
        return tiktokMatch?.[1];
      default:
        return null;
    }
  };

  // Get embed URL for the video
  const getEmbedUrl = (video: VideoData) => {
    const videoId = getVideoId(video.url, video.platform);
    if (!videoId) return null;

    switch (video.platform) {
      case 'youtube':
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
      case 'instagram':
        // Instagram embedding is limited, return null to use fallback
        return null;
      case 'tiktok':
        // TikTok doesn't support direct embedding
        return null;
      default:
        return null;
    }
  };

  // Get platform-specific styles
  const getPlatformStyles = () => {
    switch (video.platform) {
      case 'youtube':
        return 'bg-red-600 text-white';
      case 'instagram':
        return 'bg-gradient-to-br from-purple-500 to-pink-500 text-white';
      case 'tiktok':
        return 'bg-black text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  // Get aspect ratio class
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case '16/9':
        return 'aspect-video';
      case '9/16':
        return 'aspect-[9/16] max-h-[500px]';
      case 'auto':
        return '';
      default:
        return 'aspect-video';
    }
  };

  const embedUrl = getEmbedUrl(video);
  const canEmbed = embedUrl !== null && video.platform === 'youtube';

  const handlePlayClick = () => {
    if (canEmbed) {
      setIsPlaying(true);
      setIsLoading(true);
      onPlay?.();
    } else {
      window.open(video.url, '_blank');
    }
  };

  if (!isInView) {
    // Placeholder while not in view
    return (
      <div 
        ref={containerRef} 
        className={`bg-gray-100 rounded-lg ${getAspectRatioClass()} ${className}`}
      />
    );
  }

  return (
    <div ref={containerRef} className={`relative group ${className}`}>
      <div className={`relative overflow-hidden rounded-lg ${getAspectRatioClass()} bg-black`}>
        {error ? (
          // Error state
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white p-4">
            <AlertCircle className="w-12 h-12 mb-2 text-red-400" />
            <p className="text-sm mb-2">Failed to load video</p>
            <button
              onClick={() => window.open(video.url, '_blank')}
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Watch on {video.platform}
            </button>
          </div>
        ) : isPlaying && canEmbed ? (
          // Embedded video player (YouTube only)
          <>
            <iframe
              src={embedUrl}
              title={video.title || `Video by ${video.creator}`}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={() => setIsLoading(false)}
              onError={() => setError(true)}
            />
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </>
        ) : (
          // Thumbnail view
          <>
            {video.thumbnail ? (
              <img 
                src={video.thumbnail} 
                alt={video.title || 'Video thumbnail'}
                className="absolute inset-0 w-full h-full object-cover"
                onError={() => setError(true)}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900" />
            )}

            {/* Play overlay */}
            <div 
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all cursor-pointer"
              onClick={handlePlayClick}
            >
              <button className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform shadow-lg">
                <Play className="w-8 h-8 text-gray-900 ml-1" fill="currentColor" />
              </button>
            </div>

            {/* Platform indicator */}
            <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium ${getPlatformStyles()}`}>
              {video.platform.toUpperCase()}
            </div>

            {/* Duration */}
            {video.duration && (
              <div className="absolute bottom-2 right-2 px-2 py-1 bg-black bg-opacity-75 text-white text-xs rounded">
                {video.duration}
              </div>
            )}

            {/* External link indicator for non-embeddable platforms */}
            {!canEmbed && (
              <div className="absolute top-2 right-2">
                <ExternalLink className="w-5 h-5 text-white drop-shadow-lg" />
              </div>
            )}
          </>
        )}
      </div>

      {/* Video info */}
      {showTitle && (video.title || video.creator) && (
        <div className="mt-2">
          {video.title && (
            <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
              {video.title}
            </h3>
          )}
          {video.creator && (
            <p className="text-xs text-gray-500 mt-1">
              {video.creator}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoPreviewCard;
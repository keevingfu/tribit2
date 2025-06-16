'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { 
  PlayCircleIcon, 
  XMarkIcon, 
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon
} from '@heroicons/react/24/solid';
import { 
  GlobeAltIcon,
  UserCircleIcon,
  EyeIcon,
  HeartIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';

interface VideoData {
  id?: string;
  title: string;
  description?: string;
  platform: 'youtube' | 'tiktok' | 'instagram';
  videoUrl: string;
  thumbnailUrl?: string;
  creator?: {
    name: string;
    avatar?: string;
    followers?: number;
  };
  stats?: {
    views?: number;
    likes?: number;
    comments?: number;
  };
  duration?: string;
}

interface EnhancedVideoPreviewProps {
  videos: VideoData[];
  columns?: number;
  showStats?: boolean;
  autoplay?: boolean;
}

export const EnhancedVideoPreview: React.FC<EnhancedVideoPreviewProps> = ({
  videos,
  columns = 3,
  showStats = true,
  autoplay = false
}) => {
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});

  // Generate thumbnail URL if not provided
  const getThumbnailUrl = useCallback((video: VideoData) => {
    if (video.thumbnailUrl) return video.thumbnailUrl;
    
    if (video.platform === 'youtube') {
      const videoId = video.videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
      return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '';
    }
    
    // For TikTok and Instagram, return a placeholder
    return `https://picsum.photos/320/180?random=${video.id || Math.random()}`;
  }, []);

  // Format numbers for display
  const formatNumber = useCallback((num?: number) => {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }, []);

  // Get platform icon
  const getPlatformIcon = useCallback((platform: string) => {
    switch (platform) {
      case 'youtube':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        );
      case 'tiktok':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
          </svg>
        );
      case 'instagram':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.405a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
          </svg>
        );
      default:
        return <GlobeAltIcon className="w-5 h-5" />;
    }
  }, []);

  // Render video embed
  const renderEmbed = useCallback((video: VideoData) => {
    const embedUrl = getEmbedUrl(video);
    if (!embedUrl) {
      return (
        <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
          <p className="text-gray-500">Unable to load video</p>
        </div>
      );
    }

    return (
      <div className="relative w-full h-full">
        {loadingStates[video.id || video.videoUrl] && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}
        <iframe
          src={embedUrl}
          className="w-full h-full rounded-lg"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={() => setLoadingStates(prev => ({ ...prev, [video.id || video.videoUrl]: false }))}
        />
      </div>
    );
  }, [loadingStates]);

  // Get embed URL based on platform
  const getEmbedUrl = (video: VideoData) => {
    switch (video.platform) {
      case 'youtube':
        const youtubeId = video.videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
        return youtubeId ? `https://www.youtube.com/embed/${youtubeId}?autoplay=${autoplay ? 1 : 0}&mute=${isMuted ? 1 : 0}` : null;
      case 'tiktok':
        // TikTok doesn't support direct embedding, return null to show fallback
        return null;
      case 'instagram':
        // Instagram embedding is complex, return null for fallback
        return null;
      default:
        return null;
    }
  };

  // Handle video selection
  const handleVideoClick = useCallback((video: VideoData) => {
    setSelectedVideo(video);
    setLoadingStates(prev => ({ ...prev, [video.id || video.videoUrl]: true }));
  }, []);

  // Close modal
  const handleClose = useCallback(() => {
    setSelectedVideo(null);
    setIsFullscreen(false);
  }, []);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    setIsMuted(!isMuted);
  }, [isMuted]);

  // Grid classes based on columns
  const gridColsClass = useMemo(() => {
    switch (columns) {
      case 1: return 'grid-cols-1';
      case 2: return 'sm:grid-cols-2';
      case 3: return 'sm:grid-cols-2 lg:grid-cols-3';
      case 4: return 'sm:grid-cols-2 lg:grid-cols-4';
      default: return 'sm:grid-cols-2 lg:grid-cols-3';
    }
  }, [columns]);

  return (
    <>
      {/* Video Grid */}
      <div className={`grid grid-cols-1 ${gridColsClass} gap-4`}>
        {videos.map((video, index) => (
          <div
            key={video.id || index}
            className="group relative bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            onClick={() => handleVideoClick(video)}
          >
            {/* Thumbnail */}
            <div className="relative aspect-video overflow-hidden bg-gray-100">
              <img
                src={getThumbnailUrl(video)}
                alt={video.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              
              {/* Play Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                <PlayCircleIcon className="w-16 h-16 text-white opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300" />
              </div>
              
              {/* Platform Badge */}
              <div className={`absolute top-2 left-2 px-2 py-1 rounded-full flex items-center gap-1 text-white text-xs font-medium ${
                video.platform === 'youtube' ? 'bg-red-600' :
                video.platform === 'tiktok' ? 'bg-black' :
                'bg-gradient-to-r from-purple-500 to-pink-500'
              }`}>
                {getPlatformIcon(video.platform)}
                <span className="capitalize">{video.platform}</span>
              </div>
              
              {/* Duration */}
              {video.duration && (
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded">
                  {video.duration}
                </div>
              )}
            </div>
            
            {/* Content */}
            <div className="p-4">
              {/* Title */}
              <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                {video.title}
              </h3>
              
              {/* Creator Info */}
              {video.creator && (
                <div className="flex items-center gap-2 mb-3">
                  {video.creator.avatar ? (
                    <img
                      src={video.creator.avatar}
                      alt={video.creator.name}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <UserCircleIcon className="w-8 h-8 text-gray-400" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">
                      {video.creator.name}
                    </p>
                    {video.creator.followers && (
                      <p className="text-xs text-gray-500">
                        {formatNumber(video.creator.followers)} followers
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              {/* Stats */}
              {showStats && video.stats && (
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  {video.stats.views && (
                    <div className="flex items-center gap-1">
                      <EyeIcon className="w-4 h-4" />
                      <span>{formatNumber(video.stats.views)}</span>
                    </div>
                  )}
                  {video.stats.likes && (
                    <div className="flex items-center gap-1">
                      <HeartIcon className="w-4 h-4" />
                      <span>{formatNumber(video.stats.likes)}</span>
                    </div>
                  )}
                  {video.stats.comments && (
                    <div className="flex items-center gap-1">
                      <ChatBubbleLeftIcon className="w-4 h-4" />
                      <span>{formatNumber(video.stats.comments)}</span>
                    </div>
                  )}
                </div>
              )}
              
              {/* Description */}
              {video.description && (
                <p className="text-sm text-gray-600 line-clamp-2 mt-2">
                  {video.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-75 transition-opacity"
            onClick={handleClose}
          />
          
          {/* Modal Content */}
          <div className={`relative bg-white rounded-lg shadow-2xl transition-all ${
            isFullscreen ? 'w-full h-full m-0' : 'w-full max-w-4xl max-h-[90vh]'
          }`}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <div className={`px-3 py-1 rounded-full flex items-center gap-2 text-white text-sm font-medium ${
                  selectedVideo.platform === 'youtube' ? 'bg-red-600' :
                  selectedVideo.platform === 'tiktok' ? 'bg-black' :
                  'bg-gradient-to-r from-purple-500 to-pink-500'
                }`}>
                  {getPlatformIcon(selectedVideo.platform)}
                  <span className="capitalize">{selectedVideo.platform}</span>
                </div>
                <h3 className="font-semibold text-gray-900 line-clamp-1">
                  {selectedVideo.title}
                </h3>
              </div>
              
              {/* Controls */}
              <div className="flex items-center gap-2">
                {selectedVideo.platform === 'youtube' && (
                  <button
                    onClick={toggleMute}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                    title={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? <SpeakerXMarkIcon className="w-5 h-5" /> : <SpeakerWaveIcon className="w-5 h-5" />}
                  </button>
                )}
                <button
                  onClick={toggleFullscreen}
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                  title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                >
                  {isFullscreen ? <ArrowsPointingInIcon className="w-5 h-5" /> : <ArrowsPointingOutIcon className="w-5 h-5" />}
                </button>
                <button
                  onClick={handleClose}
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                  title="Close"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Video Container */}
            <div className={`relative bg-black ${
              isFullscreen ? 'h-[calc(100%-4rem)]' : 'aspect-video'
            }`}>
              {selectedVideo.platform === 'youtube' ? (
                renderEmbed(selectedVideo)
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-white p-8">
                  <div className="mb-4">
                    {getPlatformIcon(selectedVideo.platform)}
                  </div>
                  <p className="text-lg mb-4">
                    {selectedVideo.platform === 'tiktok' ? 'TikTok' : 'Instagram'} videos cannot be embedded directly
                  </p>
                  <a
                    href={selectedVideo.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Open in {selectedVideo.platform === 'tiktok' ? 'TikTok' : 'Instagram'}
                  </a>
                </div>
              )}
            </div>
            
            {/* Footer Info */}
            {!isFullscreen && (
              <div className="p-4 border-t">
                <div className="flex items-center justify-between">
                  {selectedVideo.creator && (
                    <div className="flex items-center gap-3">
                      {selectedVideo.creator.avatar ? (
                        <img
                          src={selectedVideo.creator.avatar}
                          alt={selectedVideo.creator.name}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <UserCircleIcon className="w-10 h-10 text-gray-400" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">
                          {selectedVideo.creator.name}
                        </p>
                        {selectedVideo.creator.followers && (
                          <p className="text-sm text-gray-500">
                            {formatNumber(selectedVideo.creator.followers)} followers
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {showStats && selectedVideo.stats && (
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      {selectedVideo.stats.views && (
                        <div className="flex items-center gap-2">
                          <EyeIcon className="w-5 h-5" />
                          <span>{formatNumber(selectedVideo.stats.views)} views</span>
                        </div>
                      )}
                      {selectedVideo.stats.likes && (
                        <div className="flex items-center gap-2">
                          <HeartIcon className="w-5 h-5" />
                          <span>{formatNumber(selectedVideo.stats.likes)} likes</span>
                        </div>
                      )}
                      {selectedVideo.stats.comments && (
                        <div className="flex items-center gap-2">
                          <ChatBubbleLeftIcon className="w-5 h-5" />
                          <span>{formatNumber(selectedVideo.stats.comments)} comments</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default EnhancedVideoPreview;
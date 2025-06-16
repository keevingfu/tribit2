'use client';

import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface VideoData {
  kol_account: string;
  url: string;
  platform: string;
  source: string;
}

interface VideoPreviewProps {
  videos: VideoData[];
  onClose?: () => void;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ videos, onClose }) => {
  const [currentVideo, setCurrentVideo] = useState<VideoData | null>(null);
  const [embedUrl, setEmbedUrl] = useState<string>('');

  const extractVideoId = (url: string, platform: string) => {
    try {
      if (platform === 'youtube') {
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
        return match ? match[1] : null;
      } else if (platform === 'instagram') {
        const match = url.match(/instagram\.com\/(?:p|reel)\/([^/?]+)/);
        return match ? match[1] : null;
      } else if (platform === 'tiktok') {
        const match = url.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/);
        return match ? match[1] : null;
      }
    } catch (error) {
      console.error('Error extracting video ID:', error);
    }
    return null;
  };

  const getEmbedUrl = (video: VideoData) => {
    const videoId = extractVideoId(video.url, video.platform);
    
    if (!videoId) return '';
    
    switch (video.platform) {
      case 'youtube':
        return `https://www.youtube.com/embed/${videoId}`;
      case 'instagram':
        return `https://www.instagram.com/p/${videoId}/embed`;
      case 'tiktok':
        // TikTok doesn't support iframe embeds easily, show link instead
        return '';
      default:
        return '';
    }
  };

  useEffect(() => {
    if (currentVideo) {
      setEmbedUrl(getEmbedUrl(currentVideo));
    }
  }, [currentVideo]);

  const handleVideoClick = (video: VideoData) => {
    setCurrentVideo(video);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">KOL Video Preview</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Video List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          <h4 className="font-medium text-gray-700 mb-2">Recent KOL Videos</h4>
          {videos.map((video, index) => (
            <div
              key={index}
              onClick={() => handleVideoClick(video)}
              className={`p-3 border rounded-lg cursor-pointer transition-all ${
                currentVideo?.url === video.url
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                    video.platform === 'youtube' ? 'bg-red-600' :
                    video.platform === 'instagram' ? 'bg-pink-600' :
                    video.platform === 'tiktok' ? 'bg-black' :
                    'bg-gray-600'
                  }`}>
                    {video.platform.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {video.kol_account}
                  </p>
                  <p className="text-xs text-gray-500">
                    {video.platform} • {video.source}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Video Player */}
        <div className="bg-gray-100 rounded-lg p-4">
          {currentVideo ? (
            <div>
              <h4 className="font-medium text-gray-700 mb-3">
                {currentVideo.kol_account} - {currentVideo.platform}
              </h4>
              {embedUrl ? (
                <div className="aspect-w-16 aspect-h-9">
                  <iframe
                    src={embedUrl}
                    className="w-full h-64 rounded-lg"
                    allowFullScreen
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              ) : (
                <div className="bg-white rounded-lg p-6 text-center">
                  <p className="text-gray-600 mb-3">
                    {currentVideo.platform === 'tiktok' 
                      ? 'TikTok videos cannot be embedded. Click to view on TikTok.'
                      : 'Video preview not available'}
                  </p>
                  <a
                    href={currentVideo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Open in {currentVideo.platform}
                  </a>
                </div>
              )}
              <div className="mt-3 text-xs text-gray-500">
                <a
                  href={currentVideo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600"
                >
                  {currentVideo.url}
                </a>
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <p>Select a video to preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;
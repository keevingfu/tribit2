import React from 'react';
import Link from 'next/link';
import { 
  User, 
  MapPin, 
  Users, 
  Eye, 
  TrendingUp,
  ExternalLink,
  MoreVertical
} from 'lucide-react';
import { KOLProfile } from '@/types/kol';
import { formatNumber } from '@/utils/format';

interface KOLProfileCardProps {
  profile: KOLProfile;
  onSelect?: (profile: KOLProfile) => void;
}

const KOLProfileCard: React.FC<KOLProfileCardProps> = ({ 
  profile, 
  onSelect 
}) => {
  const platformColors: Record<string, string> = {
    YouTube: 'bg-red-500',
    TikTok: 'bg-black',
    Instagram: 'bg-gradient-to-br from-purple-500 to-pink-500',
    Twitter: 'bg-blue-500',
    Facebook: 'bg-blue-600'
  };

  const handleClick = () => {
    if (onSelect) {
      onSelect(profile);
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
      onClick={handleClick}
    >
      {/* Header */}
      <div className="relative h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-t-lg">
        <div className="absolute top-4 right-4">
          <button 
            className="p-1 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              // Handle more actions
            }}
          >
            <MoreVertical className="w-5 h-5 text-white" />
          </button>
        </div>
        
        {/* Platform badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 text-xs font-medium text-white rounded-full ${
            platformColors[profile.platform] || 'bg-gray-500'
          }`}>
            {profile.platform}
          </span>
        </div>
      </div>

      {/* Avatar */}
      <div className="relative -mt-12 px-6">
        <div className="relative inline-block">
          <div className="w-24 h-24 bg-white rounded-full p-1">
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              {profile.avatar ? (
                <img 
                  src={profile.avatar} 
                  alt={profile.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-white" />
              )}
            </div>
          </div>
          {profile.verified && (
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Information area */}
      <div className="px-6 pb-6">
        {/* Name and link */}
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <Link 
              href={`/kol/detail/${profile.id}`}
              className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              {profile.name}
            </Link>
            <a 
              href={profile.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-600"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
          <p className="text-sm text-gray-600 mt-1">@{profile.account}</p>
        </div>

        {/* Region and categories */}
        <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600">
          <span className="flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span>{profile.region}</span>
          </span>
          {profile.categories && profile.categories.length > 0 && (
            <span className="flex items-center space-x-1">
              <span>{profile.categories[0]}</span>
              {profile.categories.length > 1 && (
                <span className="text-xs text-gray-400">+{profile.categories.length - 1}</span>
              )}
            </span>
          )}
        </div>

        {/* Description */}
        {profile.description && (
          <p className="text-sm text-gray-600 mt-3 line-clamp-2">
            {profile.description}
          </p>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
              {formatNumber(profile.followers)}
            </div>
            <div className="text-xs text-gray-600 mt-1">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
              {formatNumber(profile.avgViews)}
            </div>
            <div className="text-xs text-gray-600 mt-1">Avg Views</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
              {profile.engagementRate.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-600 mt-1">Engagement</div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          {profile.posts > 100 && (
            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
              Active Creator
            </span>
          )}
          {profile.engagementRate > 5 && (
            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
              High Engagement
            </span>
          )}
          {profile.followers > 100000 && (
            <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
              Top Influencer
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default KOLProfileCard;
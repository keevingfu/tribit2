import React from 'react';
import Link from 'next/link';
import { 
  User, 
  Users,
  Eye, 
  Heart, 
  MessageCircle, 
  TrendingUp,
  ExternalLink,
  Hash
} from 'lucide-react';
import { TopKOL } from '@/types/kol';
import { formatNumber } from '@/utils/format';

interface TopKOLsListProps {
  kols: TopKOL[];
  loading?: boolean;
}

const TopKOLsList: React.FC<TopKOLsListProps> = ({ kols, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Top KOL Rankings</h3>
        </div>
        <div className="p-6">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center space-x-4 mb-4 last:mb-0">
              <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-24 h-3 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="w-20 h-8 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Top KOL Rankings</h3>
          <Link 
            href="/kol/overview" 
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View All
          </Link>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {kols.map((kol) => (
          <div key={kol.profile.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-start space-x-4">
              {/* Ranking and Avatar */}
              <div className="flex items-center space-x-3">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                  (kol.rank || 0) <= 3 
                    ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {kol.rank}
                </div>
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white">
                    <User className="w-6 h-6" />
                  </div>
                  {kol.profile.verified && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* KOL Information */}
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <Link 
                    href={`/kol/detail/${kol.profile.id}`}
                    className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                  >
                    {kol.profile.name}
                  </Link>
                  <a 
                    href={kol.profile.profileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                
                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                  <span className="flex items-center space-x-1">
                    <Hash className="w-4 h-4" />
                    <span>{kol.profile.platform}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{formatNumber(kol.profile.followers)} followers</span>
                  </span>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-4 gap-4 mt-3">
                  <div>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Eye className="w-4 h-4" />
                      <span className="text-xs">Views</span>
                    </div>
                    <div className="text-sm font-semibold text-gray-900 mt-1">
                      {formatNumber(kol.performance.totalViews)}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Heart className="w-4 h-4" />
                      <span className="text-xs">Likes</span>
                    </div>
                    <div className="text-sm font-semibold text-gray-900 mt-1">
                      {formatNumber(kol.performance.totalLikes)}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-xs">Comments</span>
                    </div>
                    <div className="text-sm font-semibold text-gray-900 mt-1">
                      {formatNumber(kol.performance.totalComments)}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-xs">Engagement</span>
                    </div>
                    <div className="text-sm font-semibold text-gray-900 mt-1">
                      {kol.performance.avgEngagementRate.toFixed(2)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Revenue */}
              {kol.revenue && (
                <div className="text-right">
                  <div className="text-xs text-gray-500 mb-1">Est. Revenue</div>
                  <div className="text-lg font-bold text-green-600">
                    ${formatNumber(kol.revenue)}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopKOLsList;
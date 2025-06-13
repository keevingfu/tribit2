import React from 'react';
import { 
  Users, 
  Hash, 
  Globe, 
  PlayCircle, 
  Eye, 
  TrendingUp 
} from 'lucide-react';
import { KOLStatistics } from '@/types/kol';
import { formatNumber } from '@/utils/format';

interface KOLStatisticsCardsProps {
  statistics: KOLStatistics;
  loading?: boolean;
}

const KOLStatisticsCards: React.FC<KOLStatisticsCardsProps> = ({ 
  statistics, 
  loading = false 
}) => {
  const cards = [
    {
      title: 'KOL总数',
      value: statistics.totalKOLs,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      change: '+12.5%',
      changeType: 'positive' as const
    },
    {
      title: '平台数量',
      value: statistics.totalPlatforms,
      icon: Hash,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      change: '+2',
      changeType: 'positive' as const
    },
    {
      title: '覆盖地区',
      value: statistics.totalRegions,
      icon: Globe,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      change: '+5',
      changeType: 'positive' as const
    },
    {
      title: '视频总数',
      value: statistics.totalVideos,
      icon: PlayCircle,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      change: '+18.3%',
      changeType: 'positive' as const
    },
    {
      title: '总观看量',
      value: statistics.totalViews,
      icon: Eye,
      color: 'text-pink-500',
      bgColor: 'bg-pink-50',
      change: '+25.6%',
      changeType: 'positive' as const,
      format: 'compact'
    },
    {
      title: '平均互动率',
      value: statistics.avgEngagementRate,
      icon: TrendingUp,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50',
      change: '+0.8%',
      changeType: 'positive' as const,
      suffix: '%'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[...Array(6)].map((_, index) => (
          <div 
            key={index}
            className="bg-white rounded-lg p-6 shadow-sm animate-pulse"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg" />
              <div className="w-16 h-6 bg-gray-200 rounded" />
            </div>
            <div className="w-24 h-8 bg-gray-200 rounded mb-2" />
            <div className="w-20 h-4 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        
        return (
          <div 
            key={index}
            className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${card.bgColor}`}>
                <Icon className={`w-6 h-6 ${card.color}`} />
              </div>
              {card.change && (
                <span className={`text-sm font-medium ${
                  card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {card.change}
                </span>
              )}
            </div>
            
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatNumber(card.value)}
              {card.suffix}
            </div>
            
            <div className="text-sm text-gray-600">
              {card.title}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default React.memo(KOLStatisticsCards);
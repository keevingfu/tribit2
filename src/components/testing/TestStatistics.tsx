import { FlaskConical, TrendingUp, CheckCircle2, BarChart3 } from 'lucide-react';

interface TestStatisticsProps {
  stats?: {
    totalIdeas: number;
    activeTests: number;
    completedTests: number;
    averageImprovement: number;
  };
}

export default function TestStatistics({ stats }: TestStatisticsProps) {
  const statisticsCards = [
    {
      title: 'Total Ideas',
      value: stats?.totalIdeas || 0,
      icon: FlaskConical,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      title: 'Active Tests',
      value: stats?.activeTests || 0,
      icon: BarChart3,
      color: 'bg-green-500',
      lightColor: 'bg-green-100',
      textColor: 'text-green-600'
    },
    {
      title: 'Completed Tests',
      value: stats?.completedTests || 0,
      icon: CheckCircle2,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-100',
      textColor: 'text-purple-600'
    },
    {
      title: 'Avg Improvement',
      value: `${stats?.averageImprovement?.toFixed(1) || 0}%`,
      icon: TrendingUp,
      color: 'bg-orange-500',
      lightColor: 'bg-orange-100',
      textColor: 'text-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statisticsCards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {card.title}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {card.value}
              </p>
            </div>
            <div className={`${card.lightColor} p-3 rounded-full`}>
              <card.icon className={`w-6 h-6 ${card.textColor}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
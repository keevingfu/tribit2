import { useState, lazy, Suspense } from 'react';
import { Play, Pause, TrendingUp, Users, BarChart3, CheckCircle2 } from 'lucide-react';
import { TestExecution } from '@/types/testing';

// Dynamic import for chart
const LineChart = lazy(() => import('@/components/common/Chart/LineChart'));

interface ActiveTestsSectionProps {
  activeTests: TestExecution[];
  isLoading: boolean;
}

export default function ActiveTestsSection({ activeTests, isLoading }: ActiveTestsSectionProps) {
  const [expandedTest, setExpandedTest] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (activeTests.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No active tests</h3>
        <p className="text-gray-600">Start a test from your ideas to see real-time results here.</p>
      </div>
    );
  }

  const calculateDaysRunning = (startDate: string) => {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 95) return 'text-green-600';
    if (confidence >= 90) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-4">
      {activeTests.map((test) => {
        const isExpanded = expandedTest === test.id;
        const hasResults = test.results && test.results.variant_results.length > 0;
        const winnerVariant = hasResults 
          ? test.results?.variant_results.find(v => v.is_winner)
          : null;

        return (
          <div
            key={test.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <div
              className="p-6 cursor-pointer"
              onClick={() => setExpandedTest(isExpanded ? null : test.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Play className="w-5 h-5 text-green-500" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {test.name}
                    </h3>
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      {test.type.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{test.results?.total_participants.toLocaleString() || 0} participants</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>Running for {calculateDaysRunning(test.start_date)} days</span>
                    </div>
                    {hasResults && (
                      <div className="flex items-center gap-1">
                        <span className={getConfidenceColor(test.results!.confidence_level)}>
                          {test.results!.confidence_level}% confidence
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Variants Quick View */}
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                    {test.variants.map((variant) => {
                      const variantResult = test.results?.variant_results.find(
                        vr => vr.variant_id === variant.id
                      );
                      return (
                        <div
                          key={variant.id}
                          className={`p-3 rounded-lg border ${
                            variantResult?.is_winner 
                              ? 'border-green-500 bg-green-50' 
                              : 'border-gray-200 bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-900">
                              {variant.name}
                            </span>
                            {variant.is_control && (
                              <span className="text-xs text-gray-500">Control</span>
                            )}
                          </div>
                          {variantResult && (
                            <>
                              <div className="text-2xl font-bold text-gray-900">
                                {variantResult.conversion_rate.toFixed(1)}%
                              </div>
                              {!variant.is_control && (
                                <div className={`text-sm ${
                                  variantResult.improvement > 0 
                                    ? 'text-green-600' 
                                    : 'text-red-600'
                                }`}>
                                  {variantResult.improvement > 0 ? '+' : ''}
                                  {variantResult.improvement.toFixed(1)}%
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Pause className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Expanded View */}
            {isExpanded && hasResults && (
              <div className="border-t border-gray-200 p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Chart */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-4">
                      Conversion Rate Over Time
                    </h4>
                    <div className="h-64">
                      <Suspense fallback={
                        <div className="h-full flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                      }>
                        <LineChart
                          data={{
                            xAxis: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                            series: test.variants.map((variant, index) => ({
                              name: variant.name,
                              data: [10, 11, 12, variant.is_control ? 12.5 : 13.5],
                              color: index === 0 ? '#3B82F6' : '#10B981',
                            }))
                          }}
                          height={256}
                          showLegend={true}
                          yAxisLabel="Conversion Rate (%)"
                        />
                      </Suspense>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-4">
                      Test Metrics
                    </h4>
                    <div className="space-y-3">
                      {test.metrics.map((metric) => (
                        <div key={metric.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <span className="text-sm font-medium text-gray-900">
                              {metric.name}
                            </span>
                            {metric.primary && (
                              <span className="ml-2 text-xs text-blue-600">Primary</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600">
                            Goal: {metric.goal_type}
                          </div>
                        </div>
                      ))}
                    </div>

                    {test.results?.statistical_significance && (
                      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                          <span className="text-sm font-medium text-green-900">
                            Statistical Significance Reached
                          </span>
                        </div>
                        {winnerVariant && (
                          <p className="mt-2 text-sm text-green-800">
                            {winnerVariant.variant_name} is the winner with {winnerVariant.improvement.toFixed(1)}% improvement
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
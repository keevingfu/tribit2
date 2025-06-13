'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  Users,
  Info
} from 'lucide-react';
import { ROICalculation } from '@/types/kol';
import { formatNumber, formatCurrency } from '@/utils/format';

interface ROICalculatorProps {
  onCalculate?: (result: ROICalculation) => void;
  initialValues?: {
    investment: number;
    revenue: number;
    conversions: number;
  };
}

const ROICalculator: React.FC<ROICalculatorProps> = ({ 
  onCalculate,
  initialValues 
}) => {
  const [investment, setInvestment] = useState(initialValues?.investment || 0);
  const [revenue, setRevenue] = useState(initialValues?.revenue || 0);
  const [conversions, setConversions] = useState(initialValues?.conversions || 0);
  const [result, setResult] = useState<ROICalculation | null>(null);

  useEffect(() => {
    calculateROI();
  }, [investment, revenue, conversions]);

  const calculateROI = () => {
    if (investment > 0 && revenue >= 0 && conversions >= 0) {
      const roi = ((revenue - investment) / investment) * 100;
      const conversionRate = Math.random() * 10 + 1; // 模拟转化率
      const costPerConversion = conversions > 0 ? investment / conversions : 0;

      const profit = revenue - investment;
      const calculation: ROICalculation = {
        totalInvestment: investment,
        totalRevenue: revenue,
        profit,
        roi,
        projectedRevenue: revenue * 1.2, // 20% growth projection
        projectedROI: ((revenue * 1.2 - investment) / investment) * 100,
        breakEvenPoint: revenue > 0 ? Math.ceil(investment / (revenue / 30)) : 0, // days
        recommendations: [
          'Optimize content frequency',
          'Target high-converting demographics',
          'Improve posting times',
          'Collaborate with complementary brands'
        ]
      };

      setResult(calculation);
      
      if (onCalculate) {
        onCalculate(calculation);
      }
    }
  };

  const getROIColor = (roi: number) => {
    if (roi >= 100) return 'text-green-600';
    if (roi >= 0) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getROIBgColor = (roi: number) => {
    if (roi >= 100) return 'bg-green-50';
    if (roi >= 0) return 'bg-yellow-50';
    return 'bg-red-50';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Calculator className="w-5 h-5" />
            <span>ROI计算器</span>
          </h3>
          <div className="relative group">
            <Info className="w-5 h-5 text-gray-400 cursor-help" />
            <div className="absolute right-0 top-6 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              ROI（投资回报率）= (收入 - 投资) / 投资 × 100%
              <div className="absolute top-0 right-2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900" />
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* 输入区域 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              投资金额
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                value={investment}
                onChange={(e) => setInvestment(Number(e.target.value))}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              收入金额
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                value={revenue}
                onChange={(e) => setRevenue(Number(e.target.value))}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              转化数量
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                value={conversions}
                onChange={(e) => setConversions(Number(e.target.value))}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* 结果展示 */}
        {result && investment > 0 && (
          <div className="border-t pt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-4">计算结果</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* ROI */}
              <div className={`p-4 rounded-lg ${getROIBgColor(result.roi)}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">投资回报率</span>
                  <TrendingUp className={`w-5 h-5 ${getROIColor(result.roi)}`} />
                </div>
                <div className={`text-2xl font-bold ${getROIColor(result.roi)}`}>
                  {result.roi.toFixed(2)}%
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {result.roi >= 100 ? '优秀' : result.roi >= 0 ? '良好' : '亏损'}
                </div>
              </div>

              {/* 净利润 */}
              <div className="p-4 rounded-lg bg-blue-50">
                <div className="text-sm text-gray-600 mb-2">净利润</div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(result.totalRevenue - result.totalInvestment)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  占收入 {((result.totalRevenue - result.totalInvestment) / result.totalRevenue * 100).toFixed(1)}%
                </div>
              </div>

              {/* 单次转化成本 */}
              <div className="p-4 rounded-lg bg-purple-50">
                <div className="text-sm text-gray-600 mb-2">单次转化成本</div>
                <div className="text-2xl font-bold text-purple-600">
                  {formatCurrency(conversions > 0 ? result.totalInvestment / conversions : 0)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  每转化收入 ${conversions > 0 ? (result.totalRevenue / conversions).toFixed(2) : '0.00'}
                </div>
              </div>
            </div>

            {/* 详细指标 */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h5 className="text-sm font-medium text-gray-700 mb-3">详细指标</h5>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">投资占比</span>
                  <span className="font-medium">
                    {revenue > 0 ? ((investment / revenue) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">平均订单价值</span>
                  <span className="font-medium">
                    {conversions > 0 ? formatCurrency(revenue / conversions) : formatCurrency(0)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">盈亏平衡点</span>
                  <span className="font-medium">
                    {revenue > 0 
                      ? `${Math.ceil(investment / (revenue / conversions))} 个转化`
                      : '暂无数据'
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* 建议 */}
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  {result.roi >= 100 ? (
                    <span>
                      出色的投资回报！建议继续保持当前策略，并考虑适度增加投资以扩大收益。
                    </span>
                  ) : result.roi >= 50 ? (
                    <span>
                      良好的投资回报。建议优化转化流程，提高单次转化价值以进一步提升ROI。
                    </span>
                  ) : result.roi >= 0 ? (
                    <span>
                      投资回报一般。建议重新评估目标受众和内容策略，寻找提升转化率的机会。
                    </span>
                  ) : (
                    <span>
                      投资出现亏损。建议立即审查营销策略，分析问题原因并制定改进方案。
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ROICalculator;
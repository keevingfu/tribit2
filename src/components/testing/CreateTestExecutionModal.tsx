import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { useGetTestIdeaByIdQuery, useCreateTestExecutionMutation } from '@/store/api/testingApi';

interface CreateTestExecutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  ideaId: string | null;
}

interface Variant {
  name: string;
  description: string;
  traffic_percentage: number;
  is_control: boolean;
  configuration: Record<string, string>;
}

interface Metric {
  name: string;
  type: 'conversion' | 'revenue' | 'engagement' | 'custom';
  goal_type: 'increase' | 'decrease';
  primary: boolean;
}

export default function CreateTestExecutionModal({ isOpen, onClose, ideaId }: CreateTestExecutionModalProps) {
  const { data: idea } = useGetTestIdeaByIdQuery(ideaId || '', { skip: !ideaId });
  const [createExecution, { isLoading }] = useCreateTestExecutionMutation();

  const [formData, setFormData] = useState({
    name: '',
    type: 'ab' as 'ab' | 'multivariate' | 'split',
    traffic_allocation: 100,
    status: 'draft' as 'draft' | 'running' | 'paused' | 'completed'
  });

  const [variants, setVariants] = useState<Variant[]>([
    { name: 'Control', description: 'Original version', traffic_percentage: 50, is_control: true, configuration: {} },
    { name: 'Variant A', description: 'Test version', traffic_percentage: 50, is_control: false, configuration: {} }
  ]);

  const [metrics, setMetrics] = useState<Metric[]>([
    { name: 'Conversion Rate', type: 'conversion', goal_type: 'increase', primary: true }
  ]);

  useEffect(() => {
    if (idea) {
      setFormData({
        ...formData,
        name: idea.title
      });
    }
  }, [idea]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ideaId) return;

    // Validate traffic allocation
    const totalTraffic = variants.reduce((sum, v) => sum + v.traffic_percentage, 0);
    if (totalTraffic !== 100) {
      alert('Variant traffic percentages must sum to 100%');
      return;
    }

    try {
      await createExecution({
        idea_id: ideaId,
        ...formData,
        variants,
        metrics
      }).unwrap();
      onClose();
    } catch (error) {
      console.error('Failed to create test execution:', error);
    }
  };

  const addVariant = () => {
    const newVariants = [...variants];
    const variantCount = newVariants.filter(v => !v.is_control).length;
    newVariants.push({
      name: `Variant ${String.fromCharCode(65 + variantCount)}`,
      description: '',
      traffic_percentage: 0,
      is_control: false,
      configuration: {}
    });
    setVariants(newVariants);
  };

  const removeVariant = (index: number) => {
    if (variants[index].is_control) return;
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, updates: Partial<Variant>) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], ...updates };
    setVariants(newVariants);
  };

  const addMetric = () => {
    setMetrics([...metrics, {
      name: '',
      type: 'custom',
      goal_type: 'increase',
      primary: false
    }]);
  };

  const removeMetric = (index: number) => {
    setMetrics(metrics.filter((_, i) => i !== index));
  };

  const updateMetric = (index: number, updates: Partial<Metric>) => {
    const newMetrics = [...metrics];
    newMetrics[index] = { ...newMetrics[index], ...updates };
    setMetrics(newMetrics);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Create Test Execution</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Test Name *
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  Test Type *
                </label>
                <select
                  id="type"
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'ab' | 'multivariate' | 'split' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="ab">A/B Test</option>
                  <option value="multivariate">Multivariate</option>
                  <option value="split">Split Test</option>
                </select>
              </div>

              <div>
                <label htmlFor="traffic" className="block text-sm font-medium text-gray-700 mb-2">
                  Traffic Allocation (%)
                </label>
                <input
                  type="number"
                  id="traffic"
                  required
                  min="0"
                  max="100"
                  value={formData.traffic_allocation}
                  onChange={(e) => setFormData({ ...formData, traffic_allocation: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Variants */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Variants</h3>
              <button
                type="button"
                onClick={addVariant}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Variant
              </button>
            </div>

            <div className="space-y-3">
              {variants.map((variant, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 grid grid-cols-3 gap-3">
                      <input
                        type="text"
                        required
                        placeholder="Variant name"
                        value={variant.name}
                        onChange={(e) => updateVariant(index, { name: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Description"
                        value={variant.description}
                        onChange={(e) => updateVariant(index, { description: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          required
                          min="0"
                          max="100"
                          placeholder="Traffic %"
                          value={variant.traffic_percentage}
                          onChange={(e) => updateVariant(index, { traffic_percentage: parseInt(e.target.value) })}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <span className="text-sm text-gray-500">%</span>
                      </div>
                    </div>
                    {!variant.is_control && (
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="ml-3 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {variant.is_control && (
                    <span className="text-xs text-gray-500">Control Variant</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Metrics */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Success Metrics</h3>
              <button
                type="button"
                onClick={addMetric}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Metric
              </button>
            </div>

            <div className="space-y-3">
              {metrics.map((metric, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Metric name"
                      value={metric.name}
                      onChange={(e) => updateMetric(index, { name: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <select
                      value={metric.type}
                      onChange={(e) => updateMetric(index, { type: e.target.value as Metric['type'] })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="conversion">Conversion</option>
                      <option value="revenue">Revenue</option>
                      <option value="engagement">Engagement</option>
                      <option value="custom">Custom</option>
                    </select>
                    <select
                      value={metric.goal_type}
                      onChange={(e) => updateMetric(index, { goal_type: e.target.value as 'increase' | 'decrease' })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="increase">Increase</option>
                      <option value="decrease">Decrease</option>
                    </select>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={metric.primary}
                        onChange={(e) => updateMetric(index, { primary: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Primary</span>
                    </label>
                    {metrics.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMetric(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Create Test'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
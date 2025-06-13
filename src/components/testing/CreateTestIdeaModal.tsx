import { useState } from 'react';
import { X } from 'lucide-react';
import { useCreateTestIdeaMutation } from '@/store/api/testingApi';

interface CreateTestIdeaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateTestIdeaModal({ isOpen, onClose }: CreateTestIdeaModalProps) {
  const [createIdea, { isLoading }] = useCreateTestIdeaMutation();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    hypothesis: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    category: '',
    expected_impact: '',
    created_by: 'user@company.com' // This should come from auth context
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createIdea(formData).unwrap();
      onClose();
      // Reset form
      setFormData({
        title: '',
        description: '',
        hypothesis: '',
        priority: 'medium',
        category: '',
        expected_impact: '',
        created_by: 'user@company.com'
      });
    } catch (error) {
      console.error('Failed to create test idea:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Create New Test Idea</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Homepage CTA Button Color Test"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe what you want to test and why"
            />
          </div>

          {/* Hypothesis */}
          <div>
            <label htmlFor="hypothesis" className="block text-sm font-medium text-gray-700 mb-2">
              Hypothesis *
            </label>
            <textarea
              id="hypothesis"
              required
              rows={3}
              value={formData.hypothesis}
              onChange={(e) => setFormData({ ...formData, hypothesis: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Changing the CTA button from blue to green will increase click-through rate by 15%"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <input
                type="text"
                id="category"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., UI/UX, Email Marketing"
              />
            </div>

            {/* Priority */}
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                Priority *
              </label>
              <select
                id="priority"
                required
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'high' | 'medium' | 'low' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Expected Impact */}
          <div>
            <label htmlFor="expected_impact" className="block text-sm font-medium text-gray-700 mb-2">
              Expected Impact *
            </label>
            <input
              type="text"
              id="expected_impact"
              required
              value={formData.expected_impact}
              onChange={(e) => setFormData({ ...formData, expected_impact: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 15-20% CTR increase"
            />
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
              {isLoading ? 'Creating...' : 'Create Test Idea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
import { 
  AlertCircle, 
  Clock, 
  Play, 
  CheckCircle2, 
  Archive,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Beaker
} from 'lucide-react';
import { TestIdea } from '@/types/testing';

interface TestIdeasTableProps {
  ideas: TestIdea[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onCreateTest: (ideaId: string) => void;
}

export default function TestIdeasTable({
  ideas,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  onCreateTest
}: TestIdeasTableProps) {
  const getStatusIcon = (status: TestIdea['status']) => {
    switch (status) {
      case 'draft':
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
      case 'ready':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'running':
        return <Play className="w-4 h-4 text-green-500" />;
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-purple-500" />;
      case 'archived':
        return <Archive className="w-4 h-4 text-gray-400" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: TestIdea['status']) => {
    const labels = {
      draft: 'Draft',
      ready: 'Ready',
      running: 'Running',
      completed: 'Completed',
      archived: 'Archived'
    };
    return labels[status] || status;
  };

  const getPriorityColor = (priority: TestIdea['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading test ideas...</p>
        </div>
      </div>
    );
  }

  if (ideas.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <Beaker className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No test ideas found</h3>
        <p className="text-gray-600">Create your first test idea to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expected Impact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ideas.map((idea) => (
              <tr key={idea.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(idea.status)}
                    <span className="text-sm text-gray-900">
                      {getStatusLabel(idea.status)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {idea.title}
                    </div>
                    <div className="text-sm text-gray-500 line-clamp-1">
                      {idea.description}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{idea.category}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(idea.priority)}`}>
                    {idea.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{idea.expected_impact}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">
                    {formatDate(idea.created_at)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {(idea.status === 'ready' || idea.status === 'draft') && (
                      <button
                        onClick={() => onCreateTest(idea.id)}
                        className="text-sm text-blue-600 hover:text-blue-900 font-medium"
                      >
                        Create Test
                      </button>
                    )}
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
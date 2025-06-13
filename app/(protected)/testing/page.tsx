'use client';

import { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  ChevronDown, 
  Play, 
  Pause, 
  BarChart3,
  TrendingUp,
  FlaskConical,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useGetTestIdeasQuery, useGetActiveTestsQuery } from '@/store/api/testingApi';
import TestIdeasTable from '@/components/testing/TestIdeasTable';
import ActiveTestsSection from '@/components/testing/ActiveTestsSection';
import TestStatistics from '@/components/testing/TestStatistics';
import CreateTestIdeaModal from '@/components/testing/CreateTestIdeaModal';
import CreateTestExecutionModal from '@/components/testing/CreateTestExecutionModal';

// Status and Priority Options
const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'draft', label: 'Draft' },
  { value: 'ready', label: 'Ready' },
  { value: 'running', label: 'Running' },
  { value: 'completed', label: 'Completed' },
  { value: 'archived', label: 'Archived' }
];

const priorityOptions = [
  { value: 'all', label: 'All Priority' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' }
];

export default function TestingPage() {
  // State for filters and modals
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateIdeaModalOpen, setIsCreateIdeaModalOpen] = useState(false);
  const [isCreateExecutionModalOpen, setIsCreateExecutionModalOpen] = useState(false);
  const [selectedIdeaForExecution, setSelectedIdeaForExecution] = useState<string | null>(null);

  // Fetch test ideas
  const { data: ideasData, isLoading: isLoadingIdeas } = useGetTestIdeasQuery({
    page: currentPage,
    pageSize: 10,
    status: selectedStatus !== 'all' ? selectedStatus : undefined,
    priority: selectedPriority !== 'all' ? selectedPriority : undefined,
    search: searchTerm || undefined
  });

  // Fetch active tests
  const { data: activeTestsData, isLoading: isLoadingActiveTests } = useGetActiveTestsQuery();

  // Statistics from ideas data
  const stats = ideasData?.stats;

  const handleCreateTest = (ideaId: string) => {
    setSelectedIdeaForExecution(ideaId);
    setIsCreateExecutionModalOpen(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
      case 'ready':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'running':
        return <Play className="w-4 h-4 text-green-500" />;
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-purple-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">A/B Testing</h1>
        <p className="text-gray-600">
          Create, manage, and analyze your A/B tests to optimize performance
        </p>
      </div>

      {/* Statistics Cards */}
      <TestStatistics stats={stats} />

      {/* Active Tests Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Active Tests
          </h2>
          <span className="text-sm text-gray-500">
            {activeTestsData?.data.length || 0} running tests
          </span>
        </div>
        <ActiveTestsSection 
          activeTests={activeTestsData?.data || []} 
          isLoading={isLoadingActiveTests}
        />
      </div>

      {/* Test Ideas Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <FlaskConical className="w-5 h-5" />
            Test Ideas
          </h2>
          <button
            onClick={() => setIsCreateIdeaModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Test Idea
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search test ideas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

            {/* Priority Filter */}
            <div className="relative">
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
              >
                {priorityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

            {/* Clear Filters */}
            {(searchTerm || selectedStatus !== 'all' || selectedPriority !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedStatus('all');
                  setSelectedPriority('all');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Test Ideas Table */}
        <TestIdeasTable
          ideas={ideasData?.data || []}
          isLoading={isLoadingIdeas}
          currentPage={currentPage}
          totalPages={ideasData?.totalPages || 1}
          onPageChange={setCurrentPage}
          onCreateTest={handleCreateTest}
        />
      </div>

      {/* Modals */}
      <CreateTestIdeaModal
        isOpen={isCreateIdeaModalOpen}
        onClose={() => setIsCreateIdeaModalOpen(false)}
      />

      <CreateTestExecutionModal
        isOpen={isCreateExecutionModalOpen}
        onClose={() => {
          setIsCreateExecutionModalOpen(false);
          setSelectedIdeaForExecution(null);
        }}
        ideaId={selectedIdeaForExecution}
      />
    </div>
  );
}
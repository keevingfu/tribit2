import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../index';
import { TestIdea, TestExecution, TestStats } from '@/types/testing';

interface TestIdeasResponse {
  data: TestIdea[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  stats: {
    totalIdeas: number;
    activeTests: number;
    completedTests: number;
    averageImprovement: number;
  };
}

interface TestExecutionsResponse {
  data: TestExecution[];
}

interface GetTestIdeasParams {
  page?: number;
  pageSize?: number;
  status?: string;
  priority?: string;
  search?: string;
}

interface GetTestExecutionsParams {
  status?: string;
  ideaId?: string;
}

interface CreateTestIdeaParams {
  title: string;
  description: string;
  hypothesis: string;
  status?: 'draft' | 'ready' | 'running' | 'completed' | 'archived';
  priority: 'high' | 'medium' | 'low';
  created_by: string;
  category: string;
  expected_impact: string;
}

interface CreateTestExecutionParams {
  idea_id: string;
  name: string;
  type: 'ab' | 'multivariate' | 'split';
  status?: 'draft' | 'running' | 'paused' | 'completed';
  variants: Array<{
    name: string;
    description: string;
    traffic_percentage: number;
    is_control: boolean;
    configuration: Record<string, any>;
  }>;
  metrics: Array<{
    name: string;
    type: 'conversion' | 'revenue' | 'engagement' | 'custom';
    goal_type: 'increase' | 'decrease';
    primary: boolean;
  }>;
  traffic_allocation?: number;
  start_date?: string;
}

export const testingApi = createApi({
  reducerPath: 'testingApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/testing',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['TestIdea', 'TestExecution'],
  endpoints: (builder) => ({
    // Get test ideas
    getTestIdeas: builder.query<TestIdeasResponse, GetTestIdeasParams>({
      query: (params) => ({
        url: '',
        params
      }),
      providesTags: ['TestIdea']
    }),

    // Get test idea by ID
    getTestIdeaById: builder.query<TestIdea, string>({
      query: (id) => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'TestIdea', id }]
    }),

    // Create test idea
    createTestIdea: builder.mutation<TestIdea, CreateTestIdeaParams>({
      query: (body) => ({
        url: '',
        method: 'POST',
        body
      }),
      invalidatesTags: ['TestIdea']
    }),

    // Update test idea
    updateTestIdea: builder.mutation<TestIdea, { id: string; updates: Partial<TestIdea> }>({
      query: ({ id, updates }) => ({
        url: `/${id}`,
        method: 'PATCH',
        body: updates
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'TestIdea', id }, 'TestIdea']
    }),

    // Get test executions
    getTestExecutions: builder.query<TestExecutionsResponse, GetTestExecutionsParams>({
      query: (params) => ({
        url: '/executions',
        params
      }),
      providesTags: ['TestExecution']
    }),

    // Get active tests
    getActiveTests: builder.query<TestExecutionsResponse, void>({
      query: () => '/active',
      providesTags: ['TestExecution']
    }),

    // Get test execution by ID
    getTestExecutionById: builder.query<TestExecution, string>({
      query: (id) => `/executions/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'TestExecution', id }]
    }),

    // Create test execution
    createTestExecution: builder.mutation<TestExecution, CreateTestExecutionParams>({
      query: (body) => ({
        url: '/executions',
        method: 'POST',
        body
      }),
      invalidatesTags: ['TestExecution', 'TestIdea']
    }),

    // Update test execution
    updateTestExecution: builder.mutation<TestExecution, { id: string; updates: Partial<TestExecution> }>({
      query: ({ id, updates }) => ({
        url: `/executions/${id}`,
        method: 'PATCH',
        body: updates
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'TestExecution', id }, 'TestExecution']
    }),

    // Start test
    startTest: builder.mutation<TestExecution, string>({
      query: (id) => ({
        url: `/executions/${id}/start`,
        method: 'POST'
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'TestExecution', id }, 'TestExecution']
    }),

    // Stop test
    stopTest: builder.mutation<TestExecution, string>({
      query: (id) => ({
        url: `/executions/${id}/stop`,
        method: 'POST'
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'TestExecution', id }, 'TestExecution']
    })
  })
});

export const {
  useGetTestIdeasQuery,
  useGetTestIdeaByIdQuery,
  useCreateTestIdeaMutation,
  useUpdateTestIdeaMutation,
  useGetTestExecutionsQuery,
  useGetActiveTestsQuery,
  useGetTestExecutionByIdQuery,
  useCreateTestExecutionMutation,
  useUpdateTestExecutionMutation,
  useStartTestMutation,
  useStopTestMutation
} = testingApi;
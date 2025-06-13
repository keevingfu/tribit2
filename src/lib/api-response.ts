import { NextResponse } from 'next/server';
import { ApiResponse, ApiError, PaginatedApiResponse } from '@/types/api';

/**
 * Create a successful API response
 */
export function successResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      data,
      success: true,
      message,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

/**
 * Create a paginated API response
 */
export function paginatedResponse<T>(
  data: T[],
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  },
  message?: string,
  additionalData?: Record<string, any>
): NextResponse<PaginatedApiResponse<T>> {
  return NextResponse.json({
    data,
    success: true,
    message,
    pagination: {
      ...pagination,
      totalPages: Math.ceil(pagination.total / pagination.pageSize),
    },
    timestamp: new Date().toISOString(),
    ...additionalData,
  });
}

/**
 * Create an error API response
 */
export function errorResponse(
  error: string,
  code?: string,
  details?: any,
  status: number = 500
): NextResponse<ApiError> {
  return NextResponse.json(
    {
      error,
      code,
      details,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

/**
 * Handle API errors consistently
 */
export function handleApiError(error: unknown): NextResponse<ApiError> {
  console.error('API Error:', error);

  if (error instanceof Error) {
    // Handle specific error types
    if (error.message.includes('ENOENT')) {
      return errorResponse('Database not found', 'DB_NOT_FOUND', null, 503);
    }
    
    if (error.message.includes('SQLITE_BUSY')) {
      return errorResponse('Database is busy', 'DB_BUSY', null, 503);
    }

    return errorResponse(error.message, 'INTERNAL_ERROR', null, 500);
  }

  return errorResponse('An unexpected error occurred', 'UNKNOWN_ERROR', null, 500);
}
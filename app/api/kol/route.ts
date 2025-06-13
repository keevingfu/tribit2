import { NextRequest } from 'next/server';
import { KOLService } from '@/services/database/KOLService';
import { kolListSchema } from '@/lib/validations/api';
import { paginatedResponse, errorResponse, handleApiError } from '@/lib/api-response';

export const dynamic = "force-dynamic";

const kolService = new KOLService();

export async function GET(request: NextRequest) {
  try {
    // Parse and validate query parameters
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const validationResult = kolListSchema.safeParse(searchParams);

    if (!validationResult.success) {
      return errorResponse(
        'Invalid query parameters',
        'VALIDATION_ERROR',
        validationResult.error.flatten(),
        400
      );
    }

    const { page, pageSize, q, search, platform, region } = validationResult.data;

    // Search if query provided
    if (q || search) {
      const searchTerm = q || search || '';
      const results = await kolService.searchKOLAccounts(searchTerm);
      
      // Apply pagination to search results
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedResults = results.slice(startIndex, endIndex);

      return paginatedResponse(
        paginatedResults,
        {
          page,
          pageSize,
          total: results.length,
        },
        'KOL search results'
      );
    }

    // Get paginated KOL list
    const result = await kolService.getAllKOLAccounts({
      platform,
      region,
      page,
      pageSize,
    });

    return paginatedResponse(
      result.data,
      {
        page: result.page,
        pageSize: result.pageSize,
        total: result.total,
      },
      'KOL list retrieved successfully'
    );
  } catch (error) {
    return handleApiError(error);
  }
}
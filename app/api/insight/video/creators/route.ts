import { NextRequest } from 'next/server';
import { InsightVideoCreatorService } from '@/services/database/InsightVideoService';
import { videoCreatorsSchema } from '@/lib/validations/api';
import { paginatedResponse, successResponse, errorResponse, handleApiError } from '@/lib/api-response';

export const dynamic = "force-dynamic";

const creatorService = new InsightVideoCreatorService();

export async function GET(request: NextRequest) {
  try {
    // Parse and validate query parameters
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const validationResult = videoCreatorsSchema.safeParse(searchParams);

    if (!validationResult.success) {
      return errorResponse(
        'Invalid query parameters',
        'VALIDATION_ERROR',
        validationResult.error.flatten(),
        400
      );
    }

    const {
      page,
      pageSize,
      q,
      search,
      minFollowers,
      maxFollowers,
      minSales,
      maxSales,
      creatorType,
      mcn,
    } = validationResult.data;

    // Handle search queries
    if (q || search) {
      const searchTerm = q || search || '';
      const results = await creatorService.searchCreators(searchTerm, {
        limit: pageSize,
        offset: (page - 1) * pageSize,
      });

      // Get total count for pagination
      const allResults = await creatorService.searchCreators(searchTerm);
      
      return paginatedResponse(
        results,
        {
          page,
          pageSize,
          total: allResults.length,
        },
        'Creator search results'
      );
    }

    // Use advanced search for filtered queries
    const result = await creatorService.advancedSearch({
      minFollowers,
      maxFollowers,
      minSales,
      maxSales,
      creatorType,
      mcn,
      page,
      pageSize,
    });

    // Get additional analytics data
    const [typeStats, mcnStats, topByFollowers, topBySales, highGrowth] = await Promise.all([
      creatorService.getCreatorTypeStats(),
      creatorService.getMCNStats(),
      creatorService.getTopCreatorsByFollowers(5),
      creatorService.getTopCreatorsBySales(5),
      creatorService.getHighGrowthCreators(5),
    ]);

    return paginatedResponse(
      result.data,
      {
        page: result.page,
        pageSize: result.pageSize,
        total: result.total,
      },
      'Video creators retrieved successfully',
      {
        analytics: {
          creatorTypes: typeStats,
          mcnDistribution: mcnStats.slice(0, 10),
          topCreators: {
            byFollowers: topByFollowers,
            bySales: topBySales,
            highGrowth: highGrowth,
          },
        },
      }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
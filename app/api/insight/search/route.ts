import { NextRequest } from 'next/server';
import { InsightSearchService } from '@/services/database/InsightSearchService';
import { insightSearchSchema } from '@/lib/validations/api';
import { paginatedResponse, errorResponse, handleApiError } from '@/lib/api-response';

export const dynamic = "force-dynamic";

const insightSearchService = new InsightSearchService();

export async function GET(request: NextRequest) {
  try {
    // Parse and validate query parameters
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const validationResult = insightSearchSchema.safeParse(searchParams);

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
      keyword,
      region,
      language,
      minVolume,
      maxVolume,
      minCPC,
      maxCPC,
    } = validationResult.data;

    // Use advanced search for complex queries
    const result = await insightSearchService.advancedSearch({
      keywords: keyword ? [keyword] : undefined,
      regions: region ? [region] : undefined,
      languages: language ? [language] : undefined,
      minVolume,
      maxVolume,
      minCPC,
      maxCPC,
      page,
      pageSize,
    });

    // Get additional statistics if no specific filters
    let additionalData = {};
    if (!keyword && !region && !language) {
      const [regionStats, languageStats, modifierStats] = await Promise.all([
        insightSearchService.getSearchVolumeByRegion(),
        insightSearchService.getKeywordCountByLanguage(),
        insightSearchService.getModifierStats(),
      ]);

      additionalData = {
        statistics: {
          byRegion: regionStats.slice(0, 5),
          byLanguage: languageStats.slice(0, 5),
          topModifiers: modifierStats.slice(0, 10),
        },
      };
    }

    return paginatedResponse(
      result.data,
      {
        page: result.page,
        pageSize: result.pageSize,
        total: result.total,
      },
      'Search insights retrieved successfully',
      additionalData
    );
  } catch (error) {
    return handleApiError(error);
  }
}
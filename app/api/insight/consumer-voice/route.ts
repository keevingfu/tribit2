import { NextRequest } from 'next/server';
import { InsightConsumerVoiceService } from '@/services/database/InsightConsumerVoiceService';
import { consumerVoiceSchema } from '@/lib/validations/api';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';

export const dynamic = "force-dynamic";

const consumerVoiceService = new InsightConsumerVoiceService();

export async function GET(request: NextRequest) {
  try {
    // Parse and validate query parameters
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const validationResult = consumerVoiceSchema.safeParse(searchParams);

    if (!validationResult.success) {
      return errorResponse(
        'Invalid query parameters',
        'VALIDATION_ERROR',
        validationResult.error.flatten(),
        400
      );
    }

    const { region, language, category } = validationResult.data;

    // Get all consumer voice data in parallel
    const [
      consumerNeeds,
      searchIntent,
      trendingTopics,
      consumerInsights,
      productDemandInsights,
      priceSensitivity,
      regionalPreferences,
    ] = await Promise.all([
      consumerVoiceService.getConsumerNeeds(region, language),
      consumerVoiceService.analyzeSearchIntent(region),
      consumerVoiceService.getTrendingTopics(20),
      consumerVoiceService.getConsumerInsights({ region, language, category }),
      consumerVoiceService.getProductDemandInsights(),
      consumerVoiceService.getPriceSensitivityAnalysis(),
      consumerVoiceService.getRegionalPreferences(),
    ]);

    // Structure the response data
    const responseData = {
      overview: {
        totalNeeds: consumerNeeds.length,
        totalInsights: consumerInsights.length,
        topTrendingTopics: trendingTopics.slice(0, 5),
      },
      consumerNeeds: consumerNeeds.slice(0, 10),
      searchIntent: searchIntent,
      insights: consumerInsights,
      productDemand: {
        topCategories: productDemandInsights.slice(0, 10),
        summary: {
          totalCategories: productDemandInsights.length,
          averageDemandScore: productDemandInsights.reduce((acc, item) => acc + item.demand_score, 0) / productDemandInsights.length || 0,
        },
      },
      priceSensitivity: {
        analysis: priceSensitivity.slice(0, 20),
        distribution: {
          high: priceSensitivity.filter(p => p.price_sensitivity === 'high').length,
          medium: priceSensitivity.filter(p => p.price_sensitivity === 'medium').length,
          low: priceSensitivity.filter(p => p.price_sensitivity === 'low').length,
        },
      },
      regionalPreferences: regionalPreferences.slice(0, 10),
      metadata: {
        filters: {
          region: region || 'all',
          language: language || 'all',
          category: category || 'all',
        },
        generatedAt: new Date().toISOString(),
      },
    };

    return successResponse(
      responseData,
      'Consumer voice analysis retrieved successfully'
    );
  } catch (error) {
    return handleApiError(error);
  }
}
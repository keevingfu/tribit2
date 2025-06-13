import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { privateService } from '@/services/database/PrivateService';

export const dynamic = "force-dynamic";

// Validation schema for query parameters
const querySchema = z.object({
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  channel: z.enum(['EDM', 'LinkedIn', 'Shopify', 'WeChat', 'WhatsApp']).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  segment: z.string().optional(),
  type: z.enum(['edm', 'linkedin', 'shopify', 'lifecycle', 'stats']).optional()
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const rawParams = Object.fromEntries(searchParams.entries());
    
    // Validate query parameters
    const validatedParams = querySchema.parse(rawParams);
    const { type = 'stats', ...filterParams } = validatedParams;

    // Route to appropriate service method based on type
    switch (type) {
      case 'edm':
        const edmData = await privateService.getEDMCampaigns(filterParams);
        return NextResponse.json(edmData);

      case 'linkedin':
        const linkedInData = await privateService.getLinkedInMetrics(filterParams);
        return NextResponse.json(linkedInData);

      case 'shopify':
        const shopifyData = await privateService.getShopifyAnalytics(filterParams);
        return NextResponse.json(shopifyData);

      case 'lifecycle':
        const lifecycleData = await privateService.getCustomerLifecycle(filterParams);
        return NextResponse.json({ data: lifecycleData });

      case 'stats':
      default:
        const statsData = await privateService.getChannelStats();
        return NextResponse.json({ data: statsData });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Private API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { privateService } from '@/services/database/PrivateService';

export const dynamic = "force-dynamic";

const querySchema = z.object({
  days: z.coerce.number().min(1).max(365).optional()
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const rawParams = Object.fromEntries(searchParams.entries());
    
    const validatedParams = querySchema.parse(rawParams);
    const trends = await privateService.getEmailTrends(validatedParams);
    
    return NextResponse.json({ data: trends });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Private trends API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
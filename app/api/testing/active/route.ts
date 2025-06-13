import { NextRequest, NextResponse } from 'next/server';
import { testingService } from '@/services/database';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get active tests
    const activeTests = await testingService.getActiveTests();

    return NextResponse.json({ data: activeTests });
  } catch (error) {
    console.error('Error fetching active tests:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
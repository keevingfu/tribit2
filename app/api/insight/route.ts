import { NextRequest, NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Insight operations are handled through specific service endpoints
    // This endpoint is kept for compatibility
    return NextResponse.json({ 
      message: 'Insight API endpoint - use specific service endpoints instead',
      status: 'ok',
      endpoints: [
        '/api/insight/search',
        '/api/insight/consumer-voice',
        '/api/insight/video/creators'
      ]
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // TODO: Migrate specific insight POST logic here
    return NextResponse.json({ message: 'insight POST endpoint', data: body });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Database operations are handled through service classes
    // This endpoint is kept for compatibility
    return NextResponse.json({ 
      message: 'Database API endpoint - use specific service endpoints instead',
      status: 'ok'
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
    // TODO: Migrate specific database POST logic here
    return NextResponse.json({ message: 'database POST endpoint', data: body });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
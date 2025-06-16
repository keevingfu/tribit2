import { NextResponse } from 'next/server';
import DatabaseConnection from '@/services/database/connection';

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = DatabaseConnection.getInstance();
    
    // Test basic query
    const result = await db.query('SELECT 1 as test');
    
    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      turso: process.env.TURSO_DATABASE_URL ? 'enabled' : 'disabled',
      timestamp: new Date().toISOString(),
      test: result
    });
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      database: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
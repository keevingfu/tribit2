import { NextResponse } from 'next/server';
import DatabaseConnection from '@/services/database/connection';

export async function GET() {
  try {
    // Test database connection
    const db = DatabaseConnection.getInstance();
    const result = db.queryOne<{ count: number }>('SELECT COUNT(*) as count FROM sqlite_master');
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: result ? 'connected' : 'disconnected',
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '0.0.1'
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 503 });
  }
}
import { NextResponse } from 'next/server';
import DatabaseConnection from '@/services/database/connection';

export async function GET() {
  try {
    const dbConnection = DatabaseConnection.getInstance();
    const db = dbConnection.getDatabase();
    
    // Check if Turso is being used
    const isTurso = !!(process.env.TURSO_DATABASE_URL && (process.env.NODE_ENV === 'production' || process.env.VERCEL || process.env.USE_TURSO === 'true'));
    
    // Test database connection
    let dbStatus = 'unknown';
    let tableCount = 0;
    
    try {
      const tables = await dbConnection.query<{ name: string }>(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
      );
      tableCount = tables.length;
      dbStatus = 'connected';
    } catch (error) {
      dbStatus = 'error';
      console.error('Database connection error:', error);
    }
    
    return NextResponse.json({
      status: 'healthy',
      database: {
        type: isTurso ? 'turso' : 'sqlite',
        status: dbStatus,
        tableCount,
        tursoUrl: isTurso ? process.env.TURSO_DATABASE_URL : null
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        vercel: !!process.env.VERCEL,
        tursoConfigured: !!(process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN)
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
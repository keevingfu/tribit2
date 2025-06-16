import { createClient } from '@libsql/client';
import Database from 'better-sqlite3';
import path from 'path';

class DatabaseConnection {
  private static instance: DatabaseConnection;
  private db: any;
  private readonly dbPath: string;
  private tursoClient: any;

  private constructor() {
    this.dbPath = path.join(process.cwd(), 'data', 'tribit.db');
    
    // Check environment
    if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
      // Use Turso in production/Vercel
      this.initializeTurso();
    } else {
      // Use local SQLite in development
      this.initializeLocal();
    }
  }

  private initializeTurso() {
    try {
      this.tursoClient = createClient({
        url: process.env.TURSO_DATABASE_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN,
      });
      
      // Create a wrapper to match better-sqlite3 API
      this.db = {
        prepare: (sql: string) => ({
          all: async (...params: any[]) => {
            const result = await this.tursoClient.execute({
              sql,
              args: params.flat()
            });
            return result.rows;
          },
          get: async (...params: any[]) => {
            const result = await this.tursoClient.execute({
              sql,
              args: params.flat()
            });
            return result.rows[0];
          },
          run: async (...params: any[]) => {
            const result = await this.tursoClient.execute({
              sql,
              args: params.flat()
            });
            return {
              changes: result.rowsAffected || 0,
              lastInsertRowid: result.lastInsertRowid
            };
          }
        }),
        exec: async (sql: string) => {
          await this.tursoClient.execute(sql);
        },
        pragma: () => {}, // Turso handles this automatically
        close: () => this.tursoClient.close(),
        transaction: (fn: Function) => {
          // Turso supports transactions
          return async () => {
            await this.tursoClient.execute('BEGIN');
            try {
              const result = await fn();
              await this.tursoClient.execute('COMMIT');
              return result;
            } catch (error) {
              await this.tursoClient.execute('ROLLBACK');
              throw error;
            }
          };
        }
      };
      
      console.log('Connected to Turso database');
    } catch (error) {
      console.error('Turso connection error:', error);
      throw error;
    }
  }

  private initializeLocal() {
    try {
      this.db = new Database(this.dbPath, { 
        readonly: true,
        fileMustExist: true,
        verbose: process.env.NODE_ENV === 'development' ? console.log : undefined
      });
      
      // Enable foreign keys and set timeout
      this.db.pragma('foreign_keys = ON');
      this.db.pragma('busy_timeout = 5000');
      
      console.log('Connected to local SQLite database');
    } catch (error) {
      console.error('Local database connection error:', error);
      throw error;
    }
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public getDatabase(): any {
    return this.db;
  }

  // Make all methods async to support both local and Turso
  public async query<T>(sql: string, params?: any[]): Promise<T[]> {
    const stmt = this.db.prepare(sql);
    const result = await stmt.all(...(params || []));
    return result as T[];
  }

  public async queryOne<T>(sql: string, params?: any[]): Promise<T | undefined> {
    const stmt = this.db.prepare(sql);
    const result = await stmt.get(...(params || []));
    return result as T | undefined;
  }

  public async execute(sql: string, params?: any[]): Promise<any> {
    const stmt = this.db.prepare(sql);
    return await stmt.run(...(params || []));
  }

  public async close(): Promise<void> {
    if (this.db) {
      await this.db.close();
    }
  }
}

export default DatabaseConnection;
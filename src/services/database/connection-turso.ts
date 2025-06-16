import Database from 'better-sqlite3';
import { createClient, Client } from '@libsql/client';
import path from 'path';

// Adapter to make Turso client compatible with better-sqlite3 API
class TursoAdapter {
  private client: Client;

  constructor(url: string, authToken?: string) {
    this.client = createClient({
      url,
      authToken,
    });
  }

  prepare(sql: string) {
    const client = this.client;
    return {
      all: async (...params: any[]) => {
        try {
          const result = await client.execute({
            sql,
            args: params.flat()
          });
          return result.rows;
        } catch (error) {
          console.error('Turso query error:', error);
          throw error;
        }
      },
      
      get: async (...params: any[]) => {
        try {
          const result = await client.execute({
            sql,
            args: params.flat()
          });
          return result.rows[0];
        } catch (error) {
          console.error('Turso query error:', error);
          throw error;
        }
      },
      
      run: async (...params: any[]) => {
        try {
          const result = await client.execute({
            sql,
            args: params.flat()
          });
          return {
            changes: result.rowsAffected || 0,
            lastInsertRowid: result.lastInsertRowid
          };
        } catch (error) {
          console.error('Turso query error:', error);
          throw error;
        }
      }
    };
  }

  pragma(sql: string) {
    // Turso handles pragmas automatically
    return;
  }

  exec(sql: string) {
    return this.client.execute(sql);
  }

  close() {
    this.client.close();
  }

  transaction(fn: Function) {
    // Simplified transaction support
    return async () => {
      try {
        await this.client.execute('BEGIN');
        const result = await fn();
        await this.client.execute('COMMIT');
        return result;
      } catch (error) {
        await this.client.execute('ROLLBACK');
        throw error;
      }
    };
  }
}

class DatabaseConnection {
  private static instance: DatabaseConnection;
  private db: Database.Database | TursoAdapter;
  private readonly dbPath: string;
  private readonly isProduction: boolean;
  private readonly useTurso: boolean;

  private constructor() {
    this.dbPath = path.join(process.cwd(), 'data', 'tribit.db');
    this.isProduction = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;
    this.useTurso = !!(process.env.TURSO_DATABASE_URL && (this.isProduction || process.env.USE_TURSO === 'true'));
    
    if (this.useTurso) {
      // Use Turso
      console.log('Using Turso database');
      this.db = new TursoAdapter(
        process.env.TURSO_DATABASE_URL!,
        process.env.TURSO_AUTH_TOKEN
      );
    } else if (this.isProduction) {
      // Use in-memory database for production without Turso
      console.log('Using in-memory database (Turso not configured)');
      this.db = new Database(':memory:', {
        readonly: false
      });
      this.initializeInMemoryDatabase();
    } else {
      // Use local SQLite in development
      console.log('Using local SQLite database');
      try {
        this.db = new Database(this.dbPath, { 
          readonly: true,
          fileMustExist: true,
          verbose: process.env.NODE_ENV === 'development' ? console.log : undefined
        });
        
        // Enable foreign keys and set timeout for local SQLite
        (this.db as Database.Database).pragma('foreign_keys = ON');
        (this.db as Database.Database).pragma('busy_timeout = 5000');
      } catch (error) {
        console.error('Local database error:', error);
        // Fallback to in-memory
        this.db = new Database(':memory:', {
          readonly: false
        });
        this.initializeInMemoryDatabase();
      }
    }
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public getDatabase(): Database.Database | TursoAdapter {
    return this.db;
  }

  public close(): void {
    if (this.db) {
      this.db.close();
    }
  }

  // Make all methods async to support both local and Turso
  public async query<T>(sql: string, params?: any[]): Promise<T[]> {
    const stmt = this.db.prepare(sql);
    if (this.useTurso) {
      return await stmt.all(...(params || [])) as T[];
    } else {
      return stmt.all(...(params || [])) as T[];
    }
  }

  public async queryOne<T>(sql: string, params?: any[]): Promise<T | undefined> {
    const stmt = this.db.prepare(sql);
    if (this.useTurso) {
      return await stmt.get(...(params || [])) as T | undefined;
    } else {
      return stmt.get(...(params || [])) as T | undefined;
    }
  }

  public async execute(sql: string, params?: any[]): Promise<Database.RunResult> {
    const stmt = this.db.prepare(sql);
    if (this.useTurso) {
      return await stmt.run(...(params || []));
    } else {
      return stmt.run(...(params || []));
    }
  }

  public async transaction<T>(fn: () => T | Promise<T>): Promise<T> {
    if (this.useTurso) {
      const transaction = (this.db as TursoAdapter).transaction(fn);
      return await transaction();
    } else {
      const transaction = (this.db as Database.Database).transaction(fn);
      return transaction();
    }
  }

  // Batch insert
  public async batchInsert(tableName: string, data: any[]): Promise<void> {
    if (data.length === 0) return;
    
    const columns = Object.keys(data[0]);
    const placeholders = columns.map(() => '?').join(', ');
    const sql = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`;
    
    if (this.useTurso) {
      // Turso batch insert
      for (const item of data) {
        await this.execute(sql, columns.map(col => item[col]));
      }
    } else {
      // Local SQLite batch insert
      const stmt = (this.db as Database.Database).prepare(sql);
      const insertMany = (this.db as Database.Database).transaction((items: any[]) => {
        for (const item of items) {
          stmt.run(...columns.map(col => item[col]));
        }
      });
      insertMany(data);
    }
  }

  // Initialize in-memory database with sample data
  private initializeInMemoryDatabase(): void {
    // ... (keep the existing implementation)
  }
}

export default DatabaseConnection;
import Database from 'better-sqlite3';
import path from 'path';

class DatabaseConnection {
  private static instance: DatabaseConnection;
  private db: Database.Database;
  private readonly dbPath: string;

  private constructor() {
    // 使用相对于项目根目录的路径
    this.dbPath = path.join(process.cwd(), 'data', 'tribit.db');
    
    // 在生产环境中处理数据库文件缺失的情况
    try {
      // Check if we're in Vercel environment
      if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
        console.log('Running in production/Vercel environment, using in-memory database');
        this.db = new Database(':memory:', {
          readonly: false
        });
        this.initializeInMemoryDatabase();
      } else {
        this.db = new Database(this.dbPath, { 
          readonly: true,
          fileMustExist: false,
          verbose: process.env.NODE_ENV === 'development' ? console.log : undefined
        });
      }
    } catch (error) {
      console.error('Database connection error:', error);
      // 创建一个内存数据库作为后备
      this.db = new Database(':memory:', {
        readonly: false
      });
      this.initializeInMemoryDatabase();
      console.warn('Using in-memory database as fallback');
    }
    
    // 启用外键约束
    this.db.pragma('foreign_keys = ON');
    
    // 设置查询超时
    this.db.pragma('busy_timeout = 5000');
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public getDatabase(): Database.Database {
    return this.db;
  }

  public close(): void {
    if (this.db) {
      this.db.close();
    }
  }

  // 执行查询
  public query<T>(sql: string, params?: any[]): T[] {
    const stmt = this.db.prepare(sql);
    return stmt.all(...(params || [])) as T[];
  }

  // 执行单条查询
  public queryOne<T>(sql: string, params?: any[]): T | undefined {
    const stmt = this.db.prepare(sql);
    return stmt.get(...(params || [])) as T | undefined;
  }

  // 执行命令（插入、更新、删除）
  public execute(sql: string, params?: any[]): Database.RunResult {
    const stmt = this.db.prepare(sql);
    return stmt.run(...(params || []));
  }

  // 事务处理
  public transaction<T>(fn: () => T): T {
    const transaction = this.db.transaction(fn);
    return transaction();
  }

  // 批量插入
  public batchInsert(tableName: string, data: any[]): void {
    if (data.length === 0) return;
    
    const columns = Object.keys(data[0]);
    const placeholders = columns.map(() => '?').join(', ');
    const sql = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`;
    
    const stmt = this.db.prepare(sql);
    const insertMany = this.db.transaction((items: any[]) => {
      for (const item of items) {
        stmt.run(...columns.map(col => item[col]));
      }
    });
    
    insertMany(data);
  }

  // Initialize in-memory database with sample data
  private initializeInMemoryDatabase(): void {
    try {
      // Create essential tables for the app to function
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS kol_tribit_2024 (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          channel_name TEXT,
          Youtuber TEXT,
          video_count INTEGER,
          total_views INTEGER,
          avg_views INTEGER,
          CPM REAL,
          platform TEXT DEFAULT 'youtube'
        );

        CREATE TABLE IF NOT EXISTS insight_search (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          suggestion TEXT,
          search_volume INTEGER,
          competition TEXT,
          competition_index INTEGER,
          cost_per_click REAL,
          bid_low REAL,
          bid_high REAL
        );

        -- Insert sample data
        INSERT INTO kol_tribit_2024 (channel_name, Youtuber, video_count, total_views, avg_views, CPM, platform) VALUES
        ('Demo Channel 1', 'Demo Creator 1', 10, 100000, 10000, 5.0, 'youtube'),
        ('Demo Channel 2', 'Demo Creator 2', 20, 200000, 10000, 6.0, 'youtube');

        INSERT INTO insight_search (suggestion, search_volume, competition, competition_index, cost_per_click, bid_low, bid_high) VALUES
        ('tribit speaker', 1000, 'MEDIUM', 50, 0.5, 0.3, 0.8),
        ('bluetooth speaker', 5000, 'HIGH', 80, 1.2, 0.8, 1.8);
      `);

      console.log('In-memory database initialized with sample data');
    } catch (error) {
      console.error('Failed to initialize in-memory database:', error);
    }
  }
}

export default DatabaseConnection;
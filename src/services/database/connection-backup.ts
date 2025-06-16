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
      if (process.env.VERCEL) {
        console.log('Running in Vercel environment, using in-memory database');
        this.db = new Database(':memory:', {
          readonly: false
        });
        this.initializeInMemoryDatabase();
      } else {
        // In development or non-Vercel production, use the actual database
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
        -- KOL Tables
        CREATE TABLE IF NOT EXISTS kol_tribit_total (
          "No." INTEGER PRIMARY KEY,
          Region TEXT,
          Platform TEXT,
          kol_account TEXT,
          kol_url TEXT
        );

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

        CREATE TABLE IF NOT EXISTS kol_tribit_india (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          Region TEXT,
          Platform TEXT,
          kol_account TEXT,
          kol_url TEXT
        );

        CREATE TABLE IF NOT EXISTS kol_ytb_video (
          rank INTEGER,
          Youtuber TEXT,
          subscribers INTEGER,
          "video views" INTEGER,
          category TEXT,
          Title TEXT,
          uploads INTEGER,
          Country TEXT,
          channel_type TEXT,
          created_year INTEGER
        );

        -- Insight Tables
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

        CREATE TABLE IF NOT EXISTS insight_consumer_voice (
          id INTEGER PRIMARY KEY,
          query TEXT,
          intent TEXT,
          sentiment TEXT,
          volume INTEGER,
          trend TEXT
        );

        CREATE TABLE IF NOT EXISTS insight_video_tk_creator (
          "达人ID" TEXT,
          "达人名称" TEXT,
          "达人类型" TEXT,
          "达人粉丝数" INTEGER,
          "视频数" INTEGER
        );

        CREATE TABLE IF NOT EXISTS insight_video_tk_product (
          "关联商品" TEXT,
          "商品销量" INTEGER,
          "商品销售额" REAL,
          "关联视频数" INTEGER,
          "关联达人数" INTEGER
        );

        -- Insert sample KOL data
        INSERT INTO kol_tribit_total ("No.", Region, Platform, kol_account, kol_url) VALUES
        (1, 'North America', 'YouTube', 'MrBeast', 'https://www.youtube.com/watch?v=_7iXfXX7tIA'),
        (2, 'Europe', 'YouTube', 'PewDiePie', 'https://www.youtube.com/watch?v=PHgc8Q6qTjc'),
        (3, 'Asia', 'YouTube', 'T-Series', 'https://www.youtube.com/watch?v=BBAyRBTfsOU'),
        (4, 'North America', 'YouTube', 'Dude Perfect', 'https://www.youtube.com/watch?v=3a7cHPy04s8'),
        (5, 'Europe', 'YouTube', 'DanTDM', 'https://www.youtube.com/watch?v=jfKfPfyJRdk'),
        (6, 'Asia', 'YouTube', 'SET India', 'https://www.youtube.com/watch?v=3CNhK90D6fU'),
        (7, 'North America', 'YouTube', 'Markiplier', 'https://www.youtube.com/watch?v=UCmvSTTOHKs'),
        (8, 'Europe', 'YouTube', 'Jacksepticeye', 'https://www.youtube.com/watch?v=5kD2aIGeblE'),
        (9, 'Asia', 'YouTube', 'CarryMinati', 'https://www.youtube.com/watch?v=GOFQN8otiYs'),
        (10, 'North America', 'YouTube', 'Smosh', 'https://www.youtube.com/watch?v=aYrLUSBrawI'),
        (11, 'North America', 'Instagram', 'Kylie Jenner', 'https://instagram.com/kyliejenner'),
        (12, 'Europe', 'TikTok', 'Khaby Lame', 'https://tiktok.com/@khaby.lame');

        -- Insert sample YouTube video data
        INSERT INTO kol_ytb_video (rank, Youtuber, subscribers, "video views", category, Title, uploads, Country, channel_type, created_year) VALUES
        (1, 'T-Series', 245000000, 228000000000, 'Music', 'T-Series', 20082, 'India', 'Music', 2006),
        (2, 'SET India', 159000000, 148000000000, 'Entertainment', 'SET India', 64867, 'India', 'Entertainment', 2006),
        (3, 'MrBeast', 172000000, 125000000000, 'Entertainment', 'MrBeast', 741, 'United States', 'Entertainment', 2012),
        (4, 'PewDiePie', 111000000, 110000000000, 'Gaming', 'PewDiePie', 4700, 'Sweden', 'Gaming', 2010),
        (5, 'Kids Diana Show', 112000000, 95000000000, 'Entertainment', 'Kids Diana Show', 1050, 'United States', 'Entertainment', 2015),
        (6, 'Like Nastya', 106000000, 90000000000, 'Entertainment', 'Like Nastya', 821, 'Russia', 'Entertainment', 2016),
        (7, 'WWE', 96000000, 77000000000, 'Sports', 'WWE', 70000, 'United States', 'Sports', 2007),
        (8, '5-Minute Crafts', 80000000, 75000000000, 'Howto', '5-Minute Crafts', 6000, 'Cyprus', 'Howto', 2016),
        (9, 'Zee Music', 95000000, 65000000000, 'Music', 'Zee Music Company', 8500, 'India', 'Music', 2014),
        (10, 'Cocomelon', 162000000, 164000000000, 'Education', 'Cocomelon - Nursery Rhymes', 898, 'United States', 'Education', 2006);

        -- Insert search insights data
        INSERT INTO insight_search (suggestion, search_volume, competition, competition_index, cost_per_click, bid_low, bid_high) VALUES
        ('tribit speaker', 1000, 'MEDIUM', 50, 0.5, 0.3, 0.8),
        ('bluetooth speaker', 5000, 'HIGH', 80, 1.2, 0.8, 1.8),
        ('portable speaker', 3000, 'HIGH', 75, 1.0, 0.6, 1.5),
        ('waterproof speaker', 2000, 'MEDIUM', 60, 0.8, 0.5, 1.2),
        ('tribit stormbox', 800, 'LOW', 30, 0.3, 0.2, 0.5);

        -- Insert consumer voice data
        INSERT INTO insight_consumer_voice (id, query, intent, sentiment, volume, trend) VALUES
        (1, 'best bluetooth speaker', 'purchase', 'positive', 5000, 'up'),
        (2, 'tribit sound quality', 'research', 'neutral', 800, 'stable'),
        (3, 'waterproof speaker review', 'comparison', 'positive', 1200, 'up');

        -- Insert TikTok creator data
        INSERT INTO insight_video_tk_creator ("达人ID", "达人名称", "达人类型", "达人粉丝数", "视频数") VALUES
        ('tk001', 'Tech Reviewer', 'Technology', 500000, 150),
        ('tk002', 'Music Lover', 'Music', 800000, 300),
        ('tk003', 'Outdoor Adventure', 'Lifestyle', 1200000, 450);

        -- Insert TikTok product data
        INSERT INTO insight_video_tk_product ("关联商品", "商品销量", "商品销售额", "关联视频数", "关联达人数") VALUES
        ('Tribit StormBox', 5000, 250000, 50, 20),
        ('Tribit XSound Go', 3000, 120000, 30, 15),
        ('Tribit MaxSound Plus', 2000, 100000, 25, 10);
      `);

      console.log('In-memory database initialized with comprehensive sample data');
    } catch (error) {
      console.error('Failed to initialize in-memory database:', error);
    }
  }
}

export default DatabaseConnection;
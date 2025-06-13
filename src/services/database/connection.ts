import Database from 'better-sqlite3';
import path from 'path';

class DatabaseConnection {
  private static instance: DatabaseConnection;
  private db: Database.Database;
  private readonly dbPath: string;

  private constructor() {
    // 使用相对于项目根目录的路径
    this.dbPath = path.join(process.cwd(), 'data', 'tribit.db');
    this.db = new Database(this.dbPath, { 
      readonly: true,
      fileMustExist: true,
      verbose: process.env.NODE_ENV === 'development' ? console.log : undefined
    });
    
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
}

export default DatabaseConnection;
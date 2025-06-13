import DatabaseConnection from './connection';

/**
 * 数据库查询工具函数
 */

/**
 * 格式化日期为SQLite格式
 */
export function formatDateForSQLite(date: Date | string): string {
  if (typeof date === 'string') {
    return date;
  }
  return date.toISOString().split('T')[0];
}

/**
 * 解析SQLite日期
 */
export function parseSQLiteDate(dateStr: string | null): Date | null {
  if (!dateStr) return null;
  return new Date(dateStr);
}

/**
 * 转义SQL特殊字符
 */
export function escapeSQLString(str: string): string {
  return str.replace(/'/g, "''");
}

/**
 * 构建WHERE子句
 */
export function buildWhereClause(conditions: Record<string, any>): {
  clause: string;
  params: any[];
} {
  const clauses: string[] = [];
  const params: any[] = [];

  Object.entries(conditions).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {
      if (value.length > 0) {
        const placeholders = value.map(() => '?').join(',');
        clauses.push(`${key} IN (${placeholders})`);
        params.push(...value);
      }
    } else if (typeof value === 'object' && value.min !== undefined && value.max !== undefined) {
      clauses.push(`${key} BETWEEN ? AND ?`);
      params.push(value.min, value.max);
    } else if (typeof value === 'string' && value.includes('%')) {
      clauses.push(`${key} LIKE ?`);
      params.push(value);
    } else {
      clauses.push(`${key} = ?`);
      params.push(value);
    }
  });

  return {
    clause: clauses.length > 0 ? clauses.join(' AND ') : '1=1',
    params
  };
}

/**
 * 批量执行查询（用于事务）
 */
export async function batchExecute(queries: Array<{ sql: string; params?: any[] }>): Promise<void> {
  const db = DatabaseConnection.getInstance();
  
  db.transaction(() => {
    queries.forEach(({ sql, params }) => {
      db.execute(sql, params);
    });
  });
}

/**
 * 获取表结构信息
 */
export async function getTableSchema(tableName: string): Promise<Array<{
  cid: number;
  name: string;
  type: string;
  notnull: number;
  dflt_value: any;
  pk: number;
}>> {
  const db = DatabaseConnection.getInstance();
  return db.query(`PRAGMA table_info(${tableName})`);
}

/**
 * 检查表是否存在
 */
export async function tableExists(tableName: string): Promise<boolean> {
  const db = DatabaseConnection.getInstance();
  const result = db.queryOne<{ count: number }>(
    `SELECT COUNT(*) as count FROM sqlite_master WHERE type='table' AND name=?`,
    [tableName]
  );
  return (result?.count || 0) > 0;
}

/**
 * 获取数据库统计信息
 */
export async function getDatabaseStats(): Promise<{
  tables: Array<{ name: string; rowCount: number }>;
  totalSize: number;
}> {
  const db = DatabaseConnection.getInstance();
  
  // 获取所有表
  const tables = db.query<{ name: string }>(
    `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'`
  );

  // 获取每个表的行数
  const tableStats = await Promise.all(
    tables.map(async (table) => {
      const result = db.queryOne<{ count: number }>(
        `SELECT COUNT(*) as count FROM ${table.name}`
      );
      return {
        name: table.name,
        rowCount: result?.count || 0
      };
    })
  );

  // 获取数据库大小（页数 * 页大小）
  const pageCount = db.queryOne<{ page_count: number }>('PRAGMA page_count');
  const pageSize = db.queryOne<{ page_size: number }>('PRAGMA page_size');
  const totalSize = (pageCount?.page_count || 0) * (pageSize?.page_size || 0);

  return {
    tables: tableStats,
    totalSize
  };
}

/**
 * 清理和验证输入参数
 */
export function sanitizeParams(params: Record<string, any>): Record<string, any> {
  const cleaned: Record<string, any> = {};
  
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }
    
    if (typeof value === 'string') {
      cleaned[key] = value.trim();
    } else {
      cleaned[key] = value;
    }
  });
  
  return cleaned;
}

/**
 * 分页参数验证
 */
export function validatePaginationParams(page?: number, pageSize?: number): {
  page: number;
  pageSize: number;
  offset: number;
} {
  const validPage = Math.max(1, page || 1);
  const validPageSize = Math.min(100, Math.max(1, pageSize || 20));
  const offset = (validPage - 1) * validPageSize;
  
  return {
    page: validPage,
    pageSize: validPageSize,
    offset
  };
}

/**
 * 构建排序子句
 */
export function buildOrderByClause(
  sortField?: string,
  sortOrder?: 'ASC' | 'DESC',
  defaultField?: string,
  defaultOrder: 'ASC' | 'DESC' = 'DESC'
): string {
  const field = sortField || defaultField;
  const order = sortOrder || defaultOrder;
  
  if (!field) return '';
  
  // 防止SQL注入，只允许字母数字和下划线
  const safeField = field.replace(/[^a-zA-Z0-9_]/g, '');
  return `ORDER BY ${safeField} ${order}`;
}

/**
 * 执行带超时的查询
 */
export async function queryWithTimeout<T>(
  sql: string,
  params: any[],
  timeoutMs: number = 5000
): Promise<T[]> {
  const db = DatabaseConnection.getInstance();
  
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Query timeout after ${timeoutMs}ms`));
    }, timeoutMs);
    
    try {
      const result = db.query<T>(sql, params);
      clearTimeout(timer);
      resolve(result);
    } catch (error) {
      clearTimeout(timer);
      reject(error);
    }
  });
}
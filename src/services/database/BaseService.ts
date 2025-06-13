import DatabaseConnection from './connection';
import { QueryParams, PaginatedResult } from '@/types/database';
import { QueryValue } from '@/types/database/query';

export class BaseService<T> {
  protected db: DatabaseConnection;
  protected tableName: string;

  constructor(tableName: string) {
    this.db = DatabaseConnection.getInstance();
    this.tableName = tableName;
  }

  /**
   * 获取所有记录
   */
  async getAll(params?: QueryParams): Promise<T[]> {
    let sql = `SELECT * FROM ${this.tableName}`;
    const queryParams: QueryValue[] = [];

    // 添加排序
    if (params?.orderBy) {
      sql += ` ORDER BY ${params.orderBy} ${params.order || 'ASC'}`;
    }

    // 添加分页
    if (params?.limit) {
      sql += ` LIMIT ? OFFSET ?`;
      queryParams.push(params.limit, params.offset || 0);
    }

    return this.db.query<T>(sql, queryParams);
  }

  /**
   * 根据ID获取单条记录
   */
  async getById(id: number | string, idField: string = 'id'): Promise<T | undefined> {
    const sql = `SELECT * FROM ${this.tableName} WHERE ${idField} = ?`;
    return this.db.queryOne<T>(sql, [id]);
  }

  /**
   * 获取记录总数
   */
  async getCount(whereClause?: string, params?: QueryValue[]): Promise<number> {
    let sql = `SELECT COUNT(*) as count FROM ${this.tableName}`;
    if (whereClause) {
      sql += ` WHERE ${whereClause}`;
    }
    const result = await this.db.queryOne<{ count: number }>(sql, params);
    return result?.count || 0;
  }

  /**
   * 分页查询
   */
  async getPaginated(
    page: number = 1,
    pageSize: number = 20,
    whereClause?: string,
    whereParams?: QueryValue[],
    orderBy?: string
  ): Promise<PaginatedResult<T>> {
    const offset = (page - 1) * pageSize;
    let sql = `SELECT * FROM ${this.tableName}`;
    const params: QueryValue[] = [];

    if (whereClause) {
      sql += ` WHERE ${whereClause}`;
      if (whereParams) {
        params.push(...whereParams);
      }
    }

    if (orderBy) {
      sql += ` ORDER BY ${orderBy}`;
    }

    sql += ` LIMIT ? OFFSET ?`;
    params.push(pageSize, offset);

    const data = await this.db.query<T>(sql, params);
    const total = await this.getCount(whereClause, whereParams);
    const totalPages = Math.ceil(total / pageSize);

    return {
      data,
      total,
      page,
      pageSize,
      totalPages
    };
  }

  /**
   * 自定义查询
   */
  async query<R = T>(sql: string, params?: QueryValue[]): Promise<R[]> {
    return this.db.query<R>(sql, params);
  }

  /**
   * 查询单条记录
   */
  async queryOne<R = T>(sql: string, params?: QueryValue[]): Promise<R | null> {
    const results = await this.db.query<R>(sql, params);
    return results.length > 0 ? results[0] : null;
  }

  /**
   * 执行聚合查询
   */
  async aggregate(
    aggregateFunction: string,
    column: string,
    whereClause?: string,
    params?: QueryValue[]
  ): Promise<any> {
    let sql = `SELECT ${aggregateFunction}(${column}) as result FROM ${this.tableName}`;
    if (whereClause) {
      sql += ` WHERE ${whereClause}`;
    }
    const result = await this.db.queryOne<{ result: any }>(sql, params);
    return result?.result;
  }

  /**
   * 分组查询
   */
  async groupBy<R>(
    groupByColumn: string,
    selectColumns: string,
    whereClause?: string,
    params?: QueryValue[],
    having?: string
  ): Promise<R[]> {
    let sql = `SELECT ${selectColumns} FROM ${this.tableName}`;
    
    if (whereClause) {
      sql += ` WHERE ${whereClause}`;
    }
    
    sql += ` GROUP BY ${groupByColumn}`;
    
    if (having) {
      sql += ` HAVING ${having}`;
    }
    
    return this.db.query<R>(sql, params);
  }

  /**
   * 搜索功能（LIKE查询）
   */
  async search(searchFields: string[], searchTerm: string, params?: QueryParams): Promise<T[]> {
    const whereClause = searchFields
      .map(field => `${field} LIKE ?`)
      .join(' OR ');
    
    const searchParams = searchFields.map(() => `%${searchTerm}%`);
    
    let sql = `SELECT * FROM ${this.tableName} WHERE ${whereClause}`;
    
    if (params?.orderBy) {
      sql += ` ORDER BY ${params.orderBy} ${params.order || 'ASC'}`;
    }
    
    if (params?.limit) {
      sql += ` LIMIT ? OFFSET ?`;
      searchParams.push(String(params.limit), String(params.offset || 0));
    }
    
    return this.db.query<T>(sql, searchParams);
  }

  /**
   * 批量查询（IN查询）
   */
  async getByIds(ids: (number | string)[], idField: string = 'id'): Promise<T[]> {
    if (ids.length === 0) return [];
    
    const placeholders = ids.map(() => '?').join(',');
    const sql = `SELECT * FROM ${this.tableName} WHERE ${idField} IN (${placeholders})`;
    
    return this.db.query<T>(sql, ids);
  }

  /**
   * 获取唯一值列表
   */
  async getDistinct<R>(column: string, whereClause?: string, params?: QueryValue[]): Promise<R[]> {
    let sql = `SELECT DISTINCT ${column} FROM ${this.tableName}`;
    
    if (whereClause) {
      sql += ` WHERE ${whereClause}`;
    }
    
    sql += ` ORDER BY ${column}`;
    
    return this.db.query<R>(sql, params);
  }

}
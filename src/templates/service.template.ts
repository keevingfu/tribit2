import { BaseService } from '@/services/database/BaseService';

export interface TemplateModel {
  id: number;
  // Add your model properties here
  name?: string;
  createdAt?: string;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class TemplateService extends BaseService<TemplateModel> {
  constructor() {
    super('your_table_name');
  }

  async getPaginatedData(params: QueryParams): Promise<PaginatedResponse<any>> {
    const { page = 1, limit = 20, search, sortBy = 'created_at', sortOrder = 'desc' } = params;
    const offset = (page - 1) * limit;

    try {
      // Build WHERE clause
      const whereConditions: string[] = [];
      const whereParams: any[] = [];

      if (search) {
        whereConditions.push('(name LIKE ? OR description LIKE ?)');
        whereParams.push(`%${search}%`, `%${search}%`);
      }

      const whereClause = whereConditions.length > 0 
        ? `WHERE ${whereConditions.join(' AND ')}` 
        : '';

      // Get total count
      const countSql = `SELECT COUNT(*) as total FROM ${this.tableName} ${whereClause}`;
      const { total } = this.db.prepare(countSql).get(...whereParams) as { total: number };

      // Get paginated data
      const dataSql = `
        SELECT * FROM ${this.tableName} 
        ${whereClause}
        ORDER BY ${sortBy} ${sortOrder}
        LIMIT ? OFFSET ?
      `;
      const data = this.db.prepare(dataSql).all(...whereParams, limit, offset);

      return {
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Service error:', error);
      throw new Error('Failed to fetch data');
    }
  }

  async getById(id: string | number): Promise<any> {
    const sql = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    return this.db.prepare(sql).get(id);
  }

  async create(data: any): Promise<any> {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const placeholders = fields.map(() => '?').join(', ');

    const sql = `
      INSERT INTO ${this.tableName} (${fields.join(', ')})
      VALUES (${placeholders})
    `;

    const result = this.db.prepare(sql).run(...values);
    return { id: result.lastInsertRowid, ...data };
  }

  async update(id: string | number, data: any): Promise<any> {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const setClause = fields.map(field => `${field} = ?`).join(', ');

    const sql = `
      UPDATE ${this.tableName}
      SET ${setClause}
      WHERE id = ?
    `;

    this.db.prepare(sql).run(...values, id);
    return this.getById(id);
  }

  async delete(id: string | number): Promise<boolean> {
    const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
    const result = this.db.prepare(sql).run(id);
    return result.changes > 0;
  }
}
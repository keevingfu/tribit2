// Mock database implementation that simulates real database behavior
export class MockDatabaseImpl {
  private data: Map<string, any[]> = new Map();

  setData(tableName: string, data: any[]): void {
    this.data.set(tableName, data);
  }

  query(sql: string, params?: any[]): any[] {
    // Extract table name from SQL
    const tableMatch = sql.match(/FROM\s+(\w+)/i);
    if (!tableMatch) return [];
    
    const tableName = tableMatch[1];
    let data = this.data.get(tableName) || [];
    
    // Handle WHERE clause
    if (sql.includes('WHERE')) {
      data = this.applyWhereClause(data, sql, params);
    }
    
    // Handle ORDER BY
    if (sql.includes('ORDER BY')) {
      data = this.applyOrderBy(data, sql);
    }
    
    // Handle LIMIT/OFFSET
    if (sql.includes('LIMIT')) {
      data = this.applyLimitOffset(data, sql, params);
    }
    
    // Handle COUNT(*)
    if (sql.includes('COUNT(*)')) {
      return [{ count: data.length }];
    }
    
    // Handle DISTINCT
    if (sql.includes('DISTINCT')) {
      data = this.applyDistinct(data, sql);
    }
    
    return data;
  }

  queryOne(sql: string, params?: any[]): any {
    const results = this.query(sql, params);
    return results.length > 0 ? results[0] : null;
  }

  private applyWhereClause(data: any[], sql: string, params?: any[]): any[] {
    // Simple WHERE clause parsing
    const whereMatch = sql.match(/WHERE\s+(.+?)(?:\s+ORDER\s+BY|\s+LIMIT|$)/i);
    if (!whereMatch) return data;
    
    const whereClause = whereMatch[1];
    let filtered = [...data];
    
    // Handle LIKE queries
    if (whereClause.includes('LIKE')) {
      const likeMatches = whereClause.matchAll(/(\w+)\s+LIKE\s+\?/g);
      let paramIndex = 0;
      
      for (const match of likeMatches) {
        const field = match[1];
        const pattern = params?.[paramIndex++]?.toString() || '';
        const searchTerm = pattern.replace(/%/g, '');
        
        filtered = filtered.filter(item => 
          item[field]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
    }
    
    // Handle = queries
    if (whereClause.includes('=') && !whereClause.includes('LIKE')) {
      const equalMatches = whereClause.matchAll(/(\w+)\s*=\s*\?/g);
      let paramIndex = whereClause.includes('LIKE') ? whereClause.match(/LIKE/g)?.length || 0 : 0;
      
      for (const match of equalMatches) {
        const field = match[1];
        const value = params?.[paramIndex++];
        
        filtered = filtered.filter(item => item[field] === value);
      }
    }
    
    // Handle IN queries
    if (whereClause.includes('IN')) {
      const inMatch = whereClause.match(/(\w+)\s+IN\s+\(([^)]+)\)/);
      if (inMatch) {
        const field = inMatch[1];
        const placeholders = inMatch[2].split(',').length;
        const values = params?.slice(-placeholders);
        
        filtered = filtered.filter(item => values?.includes(item[field]));
      }
    }
    
    return filtered;
  }

  private applyOrderBy(data: any[], sql: string): any[] {
    const orderMatch = sql.match(/ORDER\s+BY\s+`?(\w+)`?\s*(ASC|DESC)?/i);
    if (!orderMatch) return data;
    
    const field = orderMatch[1];
    const order = orderMatch[2]?.toUpperCase() || 'ASC';
    
    return [...data].sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];
      
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      
      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return order === 'DESC' ? -comparison : comparison;
    });
  }

  private applyLimitOffset(data: any[], sql: string, params?: any[]): any[] {
    const limitMatch = sql.match(/LIMIT\s+(\?|\d+)(?:\s+OFFSET\s+(\?|\d+))?/i);
    if (!limitMatch) return data;
    
    let limit: number;
    let offset = 0;
    
    // Find limit and offset values from params or SQL
    if (limitMatch[1] === '?') {
      // Count number of ? before LIMIT to find param index
      const beforeLimit = sql.substring(0, sql.indexOf('LIMIT'));
      const paramCount = (beforeLimit.match(/\?/g) || []).length;
      limit = params?.[paramCount] || 0;
      
      if (limitMatch[2] === '?') {
        offset = params?.[paramCount + 1] || 0;
      }
    } else {
      limit = parseInt(limitMatch[1]);
      offset = limitMatch[2] ? parseInt(limitMatch[2]) : 0;
    }
    
    return data.slice(offset, offset + limit);
  }

  private applyDistinct(data: any[], sql: string): any[] {
    const distinctMatch = sql.match(/SELECT\s+DISTINCT\s+(\w+)/i);
    if (!distinctMatch) return data;
    
    const field = distinctMatch[1];
    const seen = new Set();
    
    return data.filter(item => {
      const value = item[field];
      if (seen.has(value)) return false;
      seen.add(value);
      return true;
    });
  }
}
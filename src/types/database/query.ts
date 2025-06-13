/**
 * Database query parameter types
 */

// Basic types that can be used as query parameters
export type QueryValue = string | number | boolean | null | Date;

// Array of query values for parameterized queries
export type QueryParams = QueryValue[];

// Object-based query parameters for more complex queries
export interface QueryOptions {
  where?: Record<string, QueryValue>;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
  limit?: number;
  offset?: number;
  groupBy?: string[];
  having?: string;
}

// Search operators
export type SearchOperator = '=' | '!=' | '>' | '<' | '>=' | '<=' | 'LIKE' | 'IN' | 'NOT IN' | 'BETWEEN';

// Complex where clause
export interface WhereCondition {
  field: string;
  operator: SearchOperator;
  value: QueryValue | QueryValue[];
}

// Result types
export interface QueryResult<T> {
  rows: T[];
  rowCount: number;
}

// Aggregate result
export interface AggregateResult {
  count?: number;
  sum?: number;
  avg?: number;
  min?: number;
  max?: number;
}
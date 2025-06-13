import { MockDatabaseImpl } from '../__tests__/helpers/mockDatabaseImpl';

// Mock Database Connection for testing
export class MockDatabaseConnection {
  private static instance: MockDatabaseConnection;
  private mockDb: any;
  private mockResults: Map<string, any> = new Map();
  private mockImpl: MockDatabaseImpl;

  constructor() {
    this.mockImpl = new MockDatabaseImpl();
    this.mockDb = {
      query: jest.fn((sql: string, params?: any[]) => this.mockImpl.query(sql, params)),
      queryOne: jest.fn((sql: string, params?: any[]) => this.mockImpl.queryOne(sql, params)),
      exec: jest.fn(),
      close: jest.fn(),
    };
  }

  static getInstance(): MockDatabaseConnection {
    if (!MockDatabaseConnection.instance) {
      MockDatabaseConnection.instance = new MockDatabaseConnection();
    }
    return MockDatabaseConnection.instance;
  }

  static resetInstance(): void {
    MockDatabaseConnection.instance = null as any;
  }

  // Methods to set up mock returns
  setMockResult(key: string, result: any): void {
    this.mockResults.set(key, result);
  }

  setMockData(tableName: string, data: any[]): void {
    this.mockResults.set(tableName, data);
    this.mockImpl.setData(tableName, data);
  }

  setQueryResult(result: any[]): void {
    this.mockDb.query.mockResolvedValue(result);
  }

  setQueryOneResult(result: any): void {
    this.mockDb.queryOne.mockResolvedValue(result);
  }

  // Database methods
  query<T>(sql: string, params?: any[]): T[] {
    return this.mockDb.query(sql, params);
  }

  queryOne<T>(sql: string, params?: any[]): T | null {
    return this.mockDb.queryOne(sql, params);
  }

  exec(sql: string): void {
    this.mockDb.exec(sql);
  }

  close(): void {
    this.mockDb.close();
  }

  // Helper methods for testing
  clearMocks(): void {
    this.mockDb.query.mockClear();
    this.mockDb.queryOne.mockClear();
    this.mockDb.exec.mockClear();
    this.mockDb.close.mockClear();
    this.mockResults.clear();
  }

  getMockCalls(): {
    query: any[];
    queryOne: any[];
    exec: any[];
    close: any[];
  } {
    return {
      query: this.mockDb.query.mock.calls,
      queryOne: this.mockDb.queryOne.mock.calls,
      exec: this.mockDb.exec.mock.calls,
      close: this.mockDb.close.mock.calls,
    };
  }
}

export default MockDatabaseConnection;
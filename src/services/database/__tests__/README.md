# Database Services Unit Tests

This directory contains comprehensive unit tests for the database service layer.

## Test Coverage

- **KOL2024Service**: Complete test coverage including all public methods, error handling, and edge cases
- **InsightSearchService**: Full test coverage for search, aggregation, and filtering functionality

## Running Tests

### Run all database service tests:
```bash
npm test src/services/database/__tests__
```

### Run specific service tests:
```bash
# KOL2024Service tests
npm test src/services/database/__tests__/KOL2024Service.complete.test.ts

# InsightSearchService tests
npm test src/services/database/__tests__/InsightSearchService.test.ts
```

### Run tests with coverage:
```bash
# Using the provided script
./src/services/database/__tests__/run-coverage.sh

# Or manually
npm test -- --coverage --collectCoverageFrom='src/services/database/*.ts' src/services/database/__tests__
```

## Test Structure

### Mock Database Connection
- Located in `src/services/database/__mocks__/connection.ts`
- Provides in-memory mock implementation of database operations
- Supports custom query mocks for specific test scenarios

### Test Files
1. **KOL2024Service.complete.test.ts**
   - Tests all public methods of KOL2024Service
   - Covers pagination, filtering, sorting, and aggregation
   - Includes error handling and edge cases
   - Expected coverage: >80%

2. **InsightSearchService.test.ts**
   - Tests search functionality with various filters
   - Covers aggregation methods (by region, language)
   - Tests advanced search with multiple parameters
   - Includes performance and concurrency tests
   - Expected coverage: >80%

## Key Testing Patterns

### Setting up Mock Data
```typescript
const mockData = [/* your test data */];
mockDb.setMockData('table_name', mockData);
```

### Custom Query Mocks
```typescript
mockDb.setQueryMock('SQL_PATTERN', jest.fn((sql, params) => {
  // Custom mock logic
  return filteredData;
}));
```

### Testing Async Methods
```typescript
it('should handle async operations', async () => {
  const result = await service.someAsyncMethod();
  expect(result).toBeDefined();
});
```

### Error Handling Tests
```typescript
it('should handle errors gracefully', async () => {
  mockDb.setQueryMock('SELECT', jest.fn(() => {
    throw new Error('Database error');
  }));
  
  await expect(service.method()).rejects.toThrow('Database error');
});
```

## Coverage Goals

- Line Coverage: >80%
- Branch Coverage: >80%
- Function Coverage: >80%
- Statement Coverage: >80%

## Notes

- Tests use Jest with TypeScript support
- Mock implementation simulates SQLite behavior
- All database calls are mocked - no actual database connection required
- Tests are isolated and can run in parallel
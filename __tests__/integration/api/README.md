# API Integration Tests

This directory contains integration tests for the Tribit Content Marketing Platform API endpoints.

## Test Structure

The integration tests are organized by module:

- **kol.test.ts** - Tests for KOL (Key Opinion Leader) management endpoints
- **insight.test.ts** - Tests for consumer insights and search analytics endpoints
- **testing.test.ts** - Tests for A/B testing module endpoints
- **ads.test.ts** - Tests for advertisement analytics endpoints
- **private.test.ts** - Tests for private domain analytics endpoints (EDM, LinkedIn, Shopify, etc.)

## Test Helpers

The `test-helpers.ts` file provides common utilities:

- `createMockRequest()` - Creates mock Next.js request objects
- `parseResponse()` - Parses response bodies
- `fixtures` - Test data fixtures for each module
- `expectedStructures` - Expected response structures for assertions
- `assertions` - Common assertion helpers
- `mockDatabaseConnection()` - Mocks the database connection for testing

## Running Tests

### Run all API integration tests:
```bash
npm test __tests__/integration/api
```

### Run tests for a specific module:
```bash
# KOL module tests
npm test __tests__/integration/api/kol.test.ts

# Insight module tests
npm test __tests__/integration/api/insight.test.ts

# Testing module tests
npm test __tests__/integration/api/testing.test.ts

# Ads module tests
npm test __tests__/integration/api/ads.test.ts

# Private module tests
npm test __tests__/integration/api/private.test.ts
```

### Run tests with coverage:
```bash
npm run test:coverage -- __tests__/integration/api
```

## Test Coverage

Each test file covers:

1. **Normal Request Scenarios**
   - Default parameters
   - Query parameter handling
   - Filtering and search
   - Pagination

2. **Error Scenarios**
   - Invalid parameters
   - Missing required fields
   - Validation errors
   - Database connection errors

3. **Edge Cases**
   - Empty results
   - Large page sizes
   - Invalid JSON
   - Concurrent requests

## Writing New Tests

When adding new API endpoints, follow this pattern:

```typescript
describe('Module API Integration Tests', () => {
  describe('GET /api/module/endpoint', () => {
    it('should handle normal request', async () => {
      const request = createMockRequest('/api/module/endpoint', {
        searchParams: { key: 'value' }
      });
      const response = await getEndpoint(request);
      const body = await parseResponse(response);
      
      expect(response.status).toBe(200);
      assertions.isSuccessResponse(body);
    });
    
    it('should handle errors', async () => {
      // Test error scenarios
    });
  });
});
```

## Mock Data

The tests use mocked database connections to avoid dependencies on the actual SQLite database. This ensures:

- Tests run quickly
- No side effects on real data
- Consistent test results
- Tests can run in CI/CD environments

## Future Improvements

Some tests include `.skip` blocks for endpoints that are planned but not yet implemented:

- Advanced filtering and analytics endpoints
- Cross-module data aggregation
- Real-time metrics endpoints
- Webhook and notification endpoints

These can be enabled once the corresponding API endpoints are implemented.

## Debugging Tests

To debug a specific test:

1. Add `console.log` statements in the test
2. Run the test in watch mode: `npm run test:watch`
3. Use VS Code's Jest extension for debugging breakpoints
4. Check the mock implementations if tests are failing unexpectedly

## Best Practices

1. **Isolation**: Each test should be independent and not rely on other tests
2. **Mocking**: Always mock external dependencies (database, APIs)
3. **Assertions**: Use the provided assertion helpers for consistency
4. **Error Testing**: Always test both success and error scenarios
5. **Performance**: Keep tests fast by avoiding real network/database calls
6. **Documentation**: Comment complex test scenarios for clarity
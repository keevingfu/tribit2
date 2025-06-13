# Testing Guide

## Overview

This project uses Jest as the testing framework with React Testing Library for component testing. The setup includes TypeScript support, MSW for API mocking, and custom utilities for Redux integration.

## Test Structure

```
__tests__/
├── unit/              # Unit tests for individual functions/components
├── integration/       # Integration tests for feature workflows
├── e2e/              # End-to-end tests (if needed)
├── utils/            # Test utilities and helpers
│   ├── test-utils.tsx    # Custom render with Redux
│   └── mock-data.ts      # Mock data generators
└── mocks/            # Mock implementations
    ├── handlers.ts       # MSW API handlers
    ├── server.ts        # MSW server setup
    └── database.ts      # Database mocking utilities
```

Component-specific tests are co-located:
```
src/
├── components/
│   └── __tests__/    # Component tests
├── services/
│   └── __tests__/    # Service tests
├── hooks/
│   └── __tests__/    # Hook tests
├── store/
│   └── __tests__/    # Redux tests
└── utils/
    └── __tests__/    # Utility tests
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode
npm run test:ci
```

## Writing Tests

### Component Tests

```typescript
import { render, screen, fireEvent } from '@/__tests__/utils/test-utils'
import MyComponent from './MyComponent'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })

  it('should handle user interaction', async () => {
    render(<MyComponent />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(await screen.findByText('Updated Text')).toBeInTheDocument()
  })
})
```

### Redux Integration Tests

```typescript
import { render, screen } from '@/__tests__/utils/test-utils'
import { mockAuthState } from '@/__tests__/utils/mock-data'
import MyReduxComponent from './MyReduxComponent'

describe('MyReduxComponent', () => {
  it('should work with preloaded state', () => {
    render(<MyReduxComponent />, {
      preloadedState: {
        auth: mockAuthState,
      },
    })
    
    expect(screen.getByText('testuser')).toBeInTheDocument()
  })
})
```

### Service Tests

```typescript
import { setupDatabaseMock, mockDatabaseResults } from '@/__tests__/mocks/database'
import MyService from '@/services/myService'

jest.mock('@/lib/db', () => ({
  DatabaseConnection: {
    getInstance: () => ({
      getDb: () => mockDb
    })
  }
}))

describe('MyService', () => {
  it('should fetch data correctly', async () => {
    setupDatabaseMock('my_table', 'all', mockDatabaseResults.myData)
    
    const service = new MyService()
    const result = await service.getAll()
    
    expect(result).toEqual(mockDatabaseResults.myData)
  })
})
```

### API Tests with MSW

```typescript
import { render, screen, waitFor } from '@/__tests__/utils/test-utils'
import { server } from '@/__tests__/mocks/server'
import { http, HttpResponse } from 'msw'
import MyApiComponent from './MyApiComponent'

describe('MyApiComponent', () => {
  it('should handle API errors', async () => {
    // Override the default handler for this test
    server.use(
      http.get('/api/data', () => {
        return HttpResponse.json({ error: 'Server Error' }, { status: 500 })
      })
    )
    
    render(<MyApiComponent />)
    
    await waitFor(() => {
      expect(screen.getByText('Error loading data')).toBeInTheDocument()
    })
  })
})
```

## Best Practices

1. **Test Structure**: Use the AAA pattern (Arrange, Act, Assert)
2. **Test Naming**: Use descriptive names that explain what is being tested
3. **Mock Data**: Use centralized mock data from `__tests__/utils/mock-data.ts`
4. **Async Testing**: Always use `waitFor` or `findBy` queries for async operations
5. **Component Testing**: Focus on user behavior, not implementation details
6. **Service Testing**: Mock database connections, not the entire service
7. **Coverage**: Aim for high coverage but prioritize meaningful tests

## Debugging Tests

```bash
# Run tests with Node debugger
node --inspect-brk node_modules/.bin/jest --runInBand

# Run a specific test file
npm test -- MyComponent.test.tsx

# Run tests matching a pattern
npm test -- --testNamePattern="should render"
```

## Coverage Reports

Coverage reports are generated in the `coverage/` directory. Open `coverage/lcov-report/index.html` in a browser to view the detailed coverage report.

## Common Issues

1. **Module Resolution**: Ensure path aliases are correctly configured in `jest.config.js`
2. **Async Errors**: Use `waitFor` or `findBy` queries for elements that appear asynchronously
3. **Redux State**: Always provide required state when testing Redux-connected components
4. **MSW Handlers**: Remember to reset handlers between tests to avoid test pollution
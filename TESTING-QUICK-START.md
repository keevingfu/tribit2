# Testing Quick Start Guide

## Running Tests

### Quick Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (recommended for development)
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test auth.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="should login"

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

### Test Organization

```
src/
├── __tests__/
│   ├── unit/           # Unit tests for services, utils
│   ├── integration/    # Integration tests
│   └── components/     # Component tests
├── components/
│   └── Button/
│       ├── Button.tsx
│       └── Button.test.tsx  # Co-located component tests
e2e/
└── *.spec.ts          # E2E tests with Playwright
```

## Writing Your First Test

### 1. Component Test

```typescript
// Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('should render with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });
});
```

### 2. API Test

```typescript
// api-test.ts
import { testApiHandler } from 'next-test-api-route-handler';
import * as handler from '@/app/api/kol/route';

describe('/api/kol', () => {
  it('should return KOL list', async () => {
    await testApiHandler({
      handler,
      test: async ({ fetch }) => {
        const res = await fetch({ method: 'GET' });
        const data = await res.json();
        expect(res.status).toBe(200);
        expect(data).toHaveProperty('data');
      },
    });
  });
});
```

### 3. E2E Test

```typescript
// kol.spec.ts
import { test, expect } from '@playwright/test';

test('should display KOL dashboard', async ({ page }) => {
  await page.goto('/kol');
  await expect(page.locator('h1')).toContainText('KOL Management');
  await expect(page.locator('[data-testid="kol-table"]')).toBeVisible();
});
```

## Test Patterns

### Testing Async Operations

```typescript
it('should load data', async () => {
  render(<DataComponent />);
  
  // Wait for loading to finish
  await waitFor(() => {
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });
  
  // Check data is displayed
  expect(screen.getByText('Data loaded')).toBeInTheDocument();
});
```

### Testing User Interactions

```typescript
it('should handle form submission', async () => {
  const user = userEvent.setup();
  const onSubmit = jest.fn();
  
  render(<Form onSubmit={onSubmit} />);
  
  await user.type(screen.getByLabelText(/name/i), 'John Doe');
  await user.click(screen.getByRole('button', { name: /submit/i }));
  
  expect(onSubmit).toHaveBeenCalledWith({ name: 'John Doe' });
});
```

### Testing with Redux

```typescript
import { renderWithProviders } from '@/tests/utils';

it('should dispatch action', async () => {
  const { store } = renderWithProviders(<MyComponent />);
  
  const button = screen.getByRole('button');
  await userEvent.click(button);
  
  const state = store.getState();
  expect(state.mySlice.value).toBe('updated');
});
```

## Common Testing Utilities

### Custom Render Function

```typescript
// tests/utils.tsx
export function renderWithProviders(
  ui: React.ReactElement,
  { preloadedState = {}, ...renderOptions } = {}
) {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState,
  });

  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
```

### Mock Data Factories

```typescript
// tests/factories.ts
export const createMockKOL = (overrides = {}) => ({
  id: '1',
  name: 'Test Influencer',
  platform: 'youtube',
  followers: 100000,
  engagement_rate: 5.5,
  ...overrides,
});

// Usage
const kol = createMockKOL({ platform: 'instagram' });
```

### API Mocking with MSW

```typescript
// tests/mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/kol', (req, res, ctx) => {
    return res(ctx.json({
      data: [createMockKOL()],
      pagination: { page: 1, total: 1 },
    }));
  }),
];
```

## Debugging Tests

### Debug Mode

```bash
# Run tests in debug mode
node --inspect-brk node_modules/.bin/jest --runInBand

# Then open chrome://inspect in Chrome
```

### Console Debugging

```typescript
it('should work', () => {
  render(<Component />);
  
  // Debug the DOM
  screen.debug();
  
  // Debug specific element
  screen.debug(screen.getByRole('button'));
  
  // Log all available queries
  console.log(screen.getByRole('button'));
});
```

### VS Code Debugging

Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "${relativeFile}"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

## Best Practices

### ✅ DO

- Write tests that describe user behavior
- Test edge cases and error states
- Use data-testid for E2E tests
- Keep tests independent and isolated
- Use descriptive test names
- Mock external dependencies

### ❌ DON'T

- Test implementation details
- Use arbitrary waits (setTimeout)
- Share state between tests
- Test third-party libraries
- Write brittle selectors
- Ignore flaky tests

## Coverage Goals

Current targets (gradually increasing):
- Statements: 25%
- Branches: 20%
- Functions: 25%
- Lines: 25%

Check coverage:
```bash
npm run test:coverage
open coverage/lcov-report/index.html
```

## Troubleshooting

### Common Issues

1. **"Cannot find module" errors**
   - Check path aliases in jest.config.js
   - Ensure TypeScript paths match

2. **"ReferenceError: window is not defined"**
   - Add to jest.setup.js or mock the browser API

3. **Async test timeouts**
   - Increase timeout: `jest.setTimeout(10000)`
   - Check for missing awaits

4. **Flaky tests**
   - Use waitFor instead of fixed delays
   - Mock time-dependent operations
   - Ensure proper cleanup

## Resources

- [Testing Library Docs](https://testing-library.com/docs/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [MSW Documentation](https://mswjs.io/docs/)
- Test templates in `/src/templates/test-templates/`
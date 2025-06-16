# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Claude AI Interaction Rules

### 1. Language Rules

- **Communication Language**: Use Chinese for all dialogue and communication with users
- **Code Language**: All code generation must use English, including comments, variable names, function names, etc.
- **CRITICAL RULE**: Code generation MUST be 100% in English. NO Chinese characters in code! Everything must be in English, including:
  - Variable names, function names, class names
  - Code comments
  - UI text, button labels, form labels
  - Error messages, notifications, alerts
  - Placeholder text
  - Any text displayed to users

### 2. Interaction Principles

- **Critical Thinking**: Always examine user input with a critical eye, carefully analyzing potential issues
- **Proactive Suggestions**: Point out potential problems users may have and provide innovative suggestions beyond the user's thinking framework
- **Constructive Feedback**: Directly point out unreasonable aspects in a professional and respectful manner, and provide specific improvement solutions

## Project Overview

Tribit Content Marketing Platform - A comprehensive analytics platform for content marketing across multiple social media platforms (YouTube, TikTok, Instagram) with modules for consumer insights, KOL management, A/B testing, and advertisement optimization.

## Technology Stack

- **Framework**: Next.js 14.2.30 (App Router)
- **Language**: TypeScript 5.7.2
- **UI**: React 18.3.1 + Tailwind CSS 3.4.17
- **State Management**: Redux Toolkit 2.8.2 + RTK Query
- **Database**: 
  - Development: SQLite (read-only) with better-sqlite3 11.5.0
  - Production: Turso distributed database with @libsql/client 0.15.9
- **Charts**: ECharts 5.5.1 + echarts-for-react 3.0.2
- **Validation**: Zod 3.23.8 + React Hook Form 7.54.2
- **Testing**: Jest 30.0.0, Playwright 1.53.0, MSW 2.10.2 (current coverage: ~25%, target: 80%+)

## Development Commands

```bash
# Install dependencies
npm install

# Development
npm run dev           # Start Next.js dev server (http://localhost:3000)

# Production
npm run build         # Build for production
npm run start         # Start production server

# Code Quality
npm run lint          # Run ESLint with Next.js config
npm run type-check    # TypeScript type checking
npm run format        # Format code with Prettier

# Testing
npm run test          # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Generate coverage report
npm run test:e2e      # Run E2E tests with Playwright
npm run test:unit     # Run unit tests only
npm run test:integration # Run integration tests only

# Clean
npm run clean         # Clean .next, dist, and node_modules
```

## High-Level Architecture

### Data Flow Pattern

```
User Action → Redux Action → RTK Query → API Route → Database Service → SQLite/Turso → Response → Redux State → UI Update
```

### Key Architectural Patterns

1. **State Management**
   - Redux Toolkit with feature-based slices
   - RTK Query for server state management with automatic caching (15-minute default)
   - Redux Persist for auth and UI state only
   - Optimistic updates and tag-based cache invalidation

2. **Database Access**
   - Development: Read-only SQLite database at `data/tribit.db`
   - Production: Turso distributed database with edge locations
   - Service layer pattern with BaseService<T> generic abstract class
   - Direct parameterized SQL queries with QueryValue type safety
   - DatabaseConnection singleton with environment-aware driver selection

3. **API Structure**
   - Next.js API routes under `/app/api/`
   - Feature-based organization (insight, kol, ads, testing, private)
   - Consistent error handling with api-response utilities
   - Zod validation for all endpoints
   - Standard response format: `{ success: boolean, data?: T, error?: ErrorObject }`

4. **Authentication & Authorization**
   - JWT-based authentication (demo implementation)
   - Next.js middleware for route protection
   - Role-based access control (admin, user, viewer)
   - HTTP-only cookies for token storage

### Module Organization

Each feature module follows this pattern:
- **Pages**: Route components in `/app/(protected)/[module]/`
- **Components**: UI components in `/src/components/[module]/`
- **Services**: Database logic in `/src/services/database/[Module]Service.ts`
- **Store**: Redux slice in `/src/store/slices/[module]Slice.ts`
- **API**: RTK Query in `/src/store/api/[module]Api.ts`
- **Types**: TypeScript interfaces in `/src/types/[module].ts`

## Key Development Patterns

### Service Layer Pattern with Generic BaseService

```typescript
// All services extend BaseService<T>
class MyService extends BaseService<MyEntity> {
  constructor() {
    super('my_table');
  }
  
  // Inherited methods: findAll, findById, search, count, etc.
  // Custom methods with SQL queries
  async getCustomData(params: QueryValue[]): Promise<MyEntity[]> {
    const sql = `SELECT * FROM ${this.tableName} WHERE column = ?`;
    return this.getAll<MyEntity>(sql, params);
  }
}
```

### RTK Query Pattern

```typescript
// API endpoints with automatic caching and tag invalidation
export const myApi = createApi({
  reducerPath: 'myApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/my' }),
  tagTypes: ['MyData'],
  endpoints: (builder) => ({
    getMyData: builder.query({
      query: (params) => ({ url: '', params }),
      providesTags: ['MyData']
    }),
    updateMyData: builder.mutation({
      query: (data) => ({ url: '', method: 'PUT', body: data }),
      invalidatesTags: ['MyData']
    })
  })
});
```

### TypeScript Path Aliases

```typescript
@/              → src/
@components/    → src/components/
@services/      → src/services/
@hooks/         → src/hooks/
@types/         → src/types/
@store/         → src/store/
@utils/         → src/utils/
```

## Important Database Notes

### Database Tables (with actual record counts)

- `insight_search` - Search analytics and keyword insights (4,675 records)
- `insight_consumer_voice` - Consumer voice analysis
- `insight_video_tk_creator` - TikTok creator video insights (76 creators)
- `insight_video_tk_product` - TikTok product data (1,000 products)
- `kol_tribit_2024` - 2024 KOL performance data (107 records)
- `kol_tribit_total` - Aggregated KOL statistics (189 records)
- `kol_tribit_india` - India market KOL data (189 records)
- `selfkoc_ins`, `selfkoc_ytb` - Self-operated KOC accounts
- `selkoc_tk` - TikTok self-operated accounts
- `ad_audience_detail` - Advertisement audience analytics
- `testing_ideas`, `testing_execution` - A/B testing data

### Critical: Chinese Column Names

Many tables use Chinese column names (legacy data structure). Examples:
- `达人名称` (creator name)
- `达人粉丝数` (follower count)
- `视频标题` (video title)
- `产品名称` (product name)

**Always check actual column names before writing SQL queries using database service files as reference.**

### Database Connection Handling

```typescript
// DatabaseConnection automatically selects the right driver
const db = DatabaseConnection.getInstance();

// Synchronous methods (SQLite)
const results = db.prepare(sql).all(params);

// Asynchronous methods (Turso)
const results = await db.executeAsync({ sql, args: params });
```

## Performance Optimizations

- Virtual scrolling implemented with react-window for large datasets
- Dynamic imports for code splitting
- RTK Query caching with 15-minute default TTL
- LRU cache for frequently accessed database queries
- React.memo on frequently re-rendered components
- Batch queries supported in BaseService

## Authentication

- **Demo Users**:
  - `demo@example.com` / `demo123` (admin)
  - `admin@example.com` / `admin123` (admin)
- **Token Storage**: HTTP-only cookies
- **Route Protection**: Next.js middleware checks JWT validity

## Environment Requirements

- **Node.js**: 22.12.0 (specified in .nvmrc)
- **npm**: >= 9.0.0
- **Playwright**: Requires browser installation (`npx playwright install`)

## Before E2E Testing

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run E2E tests on custom port
PLAYWRIGHT_BASE_URL=http://localhost:3001 npm run test:e2e
```

## Current Project Status

- **Completion**: 95% - All modules implemented with mock data
- **Next Step**: Replace mock data with real database queries
- **Test Coverage**: ~25% (target: 80%+)
- **Known Issues**: 
  - Dev server may run on port 3001 if 3000 is occupied
  - Chinese column names in database require careful SQL query construction
  - Some tables have inconsistent naming conventions
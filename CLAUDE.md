# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Claude AI Interaction Rules

### 1. Language Rules

- **Communication Language**: Use Chinese for all dialogue and communication with users
- **Code Language**: All code generation must use English, including comments, variable names, function names, etc.
- **CRITICAL RULE**: Code generation MUST be 100% in English. NO Chinese characters in pages! Everything must be in English, including:
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
- **Database**: SQLite (read-only access) with better-sqlite3 11.5.0
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

# Clean
npm run clean         # Clean .next, dist, and node_modules
```

## High-Level Architecture

### Data Flow Pattern

```
User Action → Redux Action → RTK Query → API Route → Database Service → SQLite → Response → Redux State → UI Update
```

### Key Architectural Patterns

1. **State Management**
   - Redux Toolkit with feature-based slices
   - RTK Query for server state management with automatic caching
   - Redux Persist for auth and UI state only

2. **Database Access**
   - Read-only SQLite database at `data/tribit.db`
   - Service layer pattern with BaseService abstract class
   - Direct parameterized SQL queries with QueryValue type safety
   - DatabaseConnection singleton with connection pooling

3. **API Structure**
   - Next.js API routes under `/app/api/`
   - Feature-based organization (insight, kol, ads, testing, private)
   - Consistent error handling with api-response utilities
   - Zod validation for all endpoints

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

## Key Development Patterns

### Service Layer Pattern

```typescript
// All services extend BaseService
class MyService extends BaseService {
  constructor() {
    super('my_table');
  }
  
  // Custom methods with SQL queries
  async getCustomData(params: QueryValue[]) {
    const sql = `SELECT * FROM ${this.tableName} WHERE column = ?`;
    return this.db.prepare(sql).all(params);
  }
}
```

### RTK Query Pattern

```typescript
// API endpoints with automatic caching
export const myApi = createApi({
  reducerPath: 'myApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/my' }),
  tagTypes: ['MyData'],
  endpoints: (builder) => ({
    getMyData: builder.query({
      query: () => '',
      providesTags: ['MyData']
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

- Many tables use Chinese column names (legacy data structure)
- Example: `insight_video_tk_creator` uses fields like `达人名称` (creator name), `达人粉丝数` (follower count)
- Always check actual column names before writing SQL queries
- Use parameterized queries with `QueryValue[]` type for safety

### Common Database Tables

- `insight_search` - Search analytics and keyword insights
- `insight_consumer_voice` - Consumer voice analysis
- `insight_video_tk_creator` - TikTok creator video insights (76 creators)
- `insight_video_tk_product` - TikTok product data (1,000 products)
- `kol_tribit_2024` - 2024 KOL performance data
- `kol_tribit_total` - Aggregated KOL statistics
- `selfkoc_ins`, `selfkoc_ytb` - Self-operated KOC accounts
- `ad_audience_detail` - Advertisement audience analytics
- `testing_ideas`, `testing_execution` - A/B testing data

## Current Project Status

- **Completion**: 95% - All modules implemented with mock data
- **Next Step**: Replace mock data with real database queries
- **Test Coverage**: ~25% (target: 80%+)
- **Known Issues**: Dev server typically runs on port 3001, Chinese column names in database

## Performance Optimizations

- Virtual scrolling implemented with react-window
- Dynamic imports for code splitting
- RTK Query caching (15-minute default)
- LRU cache for database queries
- React.memo on frequently used components

## Authentication

- **Demo Users**:
  - `demo@example.com` / `demo123` (admin)
  - `admin@example.com` / `admin123` (admin)
- **Token Storage**: HTTP-only cookies
- **Route Protection**: Next.js middleware

## Environment Requirements

- **Node.js**: 22.12.0 (specified in .nvmrc)
- **npm**: >= 9.0.0
- **Playwright**: Requires browser installation (`npx playwright install`)

## Before E2E Testing

```bash
# Install Playwright browsers
npx playwright install

# Run on custom port
PLAYWRIGHT_BASE_URL=http://localhost:3001 npm run test:e2e
```
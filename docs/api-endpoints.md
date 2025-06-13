# API Endpoints Documentation

## Overview

All API endpoints follow a standardized response format and include proper error handling with Zod validation.

### Response Format

#### Success Response
```json
{
  "data": <response data>,
  "success": true,
  "message": "Optional success message",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### Paginated Response
```json
{
  "data": [<array of items>],
  "success": true,
  "message": "Optional success message",
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 100,
    "totalPages": 5
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### Error Response
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": <optional error details>,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Core API Endpoints

### 1. KOL List
**GET** `/api/kol`

Retrieve a paginated list of KOLs with optional filtering and search.

#### Query Parameters
- `page` (number, default: 1) - Page number
- `pageSize` (number, default: 20, max: 100) - Items per page
- `q` or `search` (string) - Search query for KOL accounts
- `platform` (string) - Filter by platform (YouTube, TikTok, etc.)
- `region` (string) - Filter by region

#### Example Requests
```bash
# Basic list
GET /api/kol

# With pagination
GET /api/kol?page=2&pageSize=10

# With search
GET /api/kol?q=fashion&page=1

# With filters
GET /api/kol?platform=YouTube&region=US
```

### 2. KOL Details
**GET** `/api/kol/[id]`

Retrieve detailed information about a specific KOL.

#### Path Parameters
- `id` (string) - KOL account identifier

#### Response Includes
- KOL basic information
- Recent videos (up to 10)
- Related statistics
- Platform and region distribution

#### Example Request
```bash
GET /api/kol/fashionista123
```

### 3. Search Insights
**GET** `/api/insight/search`

Retrieve search insights with advanced filtering options.

#### Query Parameters
- `page` (number, default: 1) - Page number
- `pageSize` (number, default: 20) - Items per page
- `keyword` (string) - Filter by keyword
- `region` (string) - Filter by region
- `language` (string) - Filter by language
- `minVolume` (number) - Minimum search volume
- `maxVolume` (number) - Maximum search volume
- `minCPC` (number) - Minimum cost per click
- `maxCPC` (number) - Maximum cost per click

#### Additional Data (when no filters applied)
- Search volume by region (top 5)
- Keyword count by language (top 5)
- Top modifiers (top 10)

#### Example Requests
```bash
# Basic search insights
GET /api/insight/search

# With keyword filter
GET /api/insight/search?keyword=marketing

# With advanced filters
GET /api/insight/search?region=US&language=en&minVolume=1000&maxVolume=10000
```

### 4. Video Creators Analysis
**GET** `/api/insight/video/creators`

Retrieve TikTok creator analytics and insights.

#### Query Parameters
- `page` (number, default: 1) - Page number
- `pageSize` (number, default: 20) - Items per page
- `q` or `search` (string) - Search creator names/accounts
- `minFollowers` (number) - Minimum follower count
- `maxFollowers` (number) - Maximum follower count
- `minSales` (number) - Minimum sales amount
- `maxSales` (number) - Maximum sales amount
- `creatorType` (string) - Filter by creator type
- `mcn` (number) - Filter by MCN ID

#### Analytics Data Included
- Creator type statistics
- MCN distribution (top 10)
- Top creators by followers, sales, and growth

#### Example Requests
```bash
# All creators with analytics
GET /api/insight/video/creators

# Search creators
GET /api/insight/video/creators?q=fashion

# Filter by metrics
GET /api/insight/video/creators?minFollowers=100000&creatorType=fashion
```

### 5. Consumer Voice Analysis
**GET** `/api/insight/consumer-voice`

Comprehensive consumer insights and market analysis.

#### Query Parameters
- `region` (string) - Filter by region
- `language` (string) - Filter by language
- `category` (string) - Filter by category

#### Response Data
- Overview statistics
- Consumer needs analysis
- Search intent distribution
- Consumer insights by category
- Product demand insights
- Price sensitivity analysis
- Regional preferences

#### Example Requests
```bash
# Full consumer voice analysis
GET /api/insight/consumer-voice

# Regional analysis
GET /api/insight/consumer-voice?region=US

# Filtered analysis
GET /api/insight/consumer-voice?region=US&language=en&category=technology
```

## Error Codes

- `VALIDATION_ERROR` - Invalid request parameters
- `NOT_FOUND` - Resource not found
- `MISSING_ID` - Required ID parameter missing
- `DB_NOT_FOUND` - Database file not found
- `DB_BUSY` - Database is busy
- `INTERNAL_ERROR` - Internal server error
- `UNKNOWN_ERROR` - Unexpected error

## Rate Limiting

Currently, no rate limiting is implemented. All endpoints use `force-dynamic` rendering.

## Authentication

Authentication is not yet implemented for these endpoints. They are currently public.

## Testing

Use the provided test utility:
```bash
npx tsx src/lib/api-test.ts
```
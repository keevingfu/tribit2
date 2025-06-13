# Advertisement Analytics Module

## Overview

The Advertisement Analytics module provides comprehensive insights into advertising campaigns across multiple platforms including Facebook, Google, TikTok, Instagram, and YouTube.

## Features

### 1. Campaign Overview Dashboard
- **Metrics Cards**: Display total spend, impressions, clicks, conversions with trend indicators
- **Real-time Updates**: Automatic data refresh functionality
- **Date Range Selection**: Flexible date filtering (Today, Last 7/30/90 days, Custom range)

### 2. Campaign Performance Table
- **Multi-column Sorting**: Sort by name, platform, status, spend, metrics
- **Platform Badges**: Visual indicators for different ad platforms
- **Status Indicators**: Active, Paused, Completed, Draft campaigns
- **Budget Progress**: Visual representation of budget utilization
- **Export Functionality**: Download campaign data as CSV

### 3. Performance Visualizations

#### Spend vs Performance Chart
- Line chart showing trends over time
- Metrics: Spend, Impressions, Clicks, Conversions, ROAS
- Dual Y-axis for better visualization
- Smooth animations and interactions

#### Platform Comparison Chart
- Bar and line combination chart
- Compare performance across platforms
- Key metrics: Spend, Impressions, Conversions, ROAS
- Platform-wise breakdown

### 4. Audience Insights

#### Demographic Analysis
- **Age Distribution**: Bar chart showing impressions by age group
- **Gender Split**: Pie chart with male/female breakdown
- **Device Usage**: Distribution across Mobile, Desktop, Tablet

#### Top Insights Cards
- Primary age group with percentage
- Gender split percentages
- Most used device type

### 5. Geographic Performance

#### Geographic Heatmap
- Country-wise performance visualization
- Spend-based horizontal bar chart
- Color coding by conversion rate
- Regional summary table with key metrics

### 6. Creative Performance

#### Creative Performance Table
- Top performing creatives by type (Image, Video, Carousel, Text)
- Performance metrics: CTR, Conversion Rate
- Visual performance score indicators
- Creative type icons for easy identification
- Performance tips based on data

## Technical Implementation

### API Endpoints

```typescript
GET /api/ads                 // Get campaigns with filters
GET /api/ads/metrics         // Get overall metrics
GET /api/ads/platforms       // Get platform comparison
GET /api/ads/performance     // Get performance over time
GET /api/ads/audience        // Get audience insights
GET /api/ads/creatives       // Get creative performance
```

### Data Models

#### AdCampaign
```typescript
{
  id: number
  name: string
  platform: string
  status: string
  budget: number
  spent: number
  impressions: number
  clicks: number
  conversions: number
  ctr: number
  cpc: number
  cpm: number
  roas: number
  roi: number
}
```

#### AdMetrics
```typescript
{
  totalSpend: number
  totalImpressions: number
  totalClicks: number
  totalConversions: number
  averageCTR: number
  averageCPC: number
  averageCPM: number
  averageROAS: number
  averageROI: number
}
```

### State Management

Uses Redux Toolkit with RTK Query for:
- Automatic caching
- Request deduplication
- Optimistic updates
- Background refetching

### Components Structure

```
/src/components/ads/Dashboard/
├── AdsDashboard.tsx           // Main dashboard container
├── MetricsCards.tsx           // Overview metrics display
├── CampaignTable.tsx          // Campaign performance table
├── PerformanceChart.tsx       // Time series visualization
├── PlatformComparisonChart.tsx // Platform comparison
├── AudienceInsights.tsx       // Demographic analysis
├── GeographicHeatmap.tsx      // Geographic performance
├── CreativePerformanceTable.tsx // Creative analysis
└── DateRangeSelector.tsx      // Date filtering component
```

## Usage

### Access the Dashboard
Navigate to `/ads` in the application to access the advertisement analytics dashboard.

### Filter Campaigns
1. Use the date range selector to filter by time period
2. Click on table headers to sort campaigns
3. Use platform/status filters (if enabled)

### Export Data
1. Click the "Export" button in the campaign table
2. Data will be downloaded as CSV file
3. Includes all visible columns and applied filters

### Refresh Data
- Click the "Refresh" button to manually update all data
- Data automatically caches for 15 minutes

## Performance Optimizations

1. **Dynamic Imports**: Charts loaded on-demand using Next.js dynamic imports
2. **Data Caching**: RTK Query caches API responses
3. **Virtual Scrolling**: For large campaign lists (when implemented)
4. **Memoization**: React.memo and useMemo for expensive computations
5. **Debounced Filters**: Prevent excessive API calls during filtering

## Future Enhancements

1. **Advanced Filtering**
   - Multi-select platform and status filters
   - Campaign name search
   - Performance threshold filters

2. **Additional Visualizations**
   - Conversion funnel analysis
   - Hour-of-day performance heatmap
   - Creative A/B test results

3. **Automation Features**
   - Automated campaign pausing based on performance
   - Budget reallocation suggestions
   - Scheduled report generation

4. **Integration Enhancements**
   - Direct platform API integration
   - Real-time data streaming
   - Cross-platform campaign management

## Troubleshooting

### No Data Displayed
- Check if the date range is correctly set
- Verify API endpoints are accessible
- Check browser console for errors

### Charts Not Loading
- Ensure ECharts is properly installed
- Check for JavaScript errors in console
- Try refreshing the page

### Export Not Working
- Check browser popup blocker settings
- Ensure sufficient data is available
- Verify CSV generation logic
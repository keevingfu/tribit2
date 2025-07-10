# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Tribit Social Media Analytics Dashboard** project consisting of standalone HTML files that visualize social media performance metrics for Tribit, likely an audio/electronics brand. The dashboards track Key Opinion Leader (KOL) and self-generated content performance across multiple platforms.

### Project Status
- **Development Stage**: Production-ready
- **Last Updated**: July 2025
- **Git Repository**: https://github.com/keevingfu/tribit3
- **Deployment**: Ready for Vercel deployment

## Architecture & Structure

The project contains 8 primary dashboard files:

1. **index.html** - Main portal page with navigation menu and iframe-based content loading
2. **tribit-selfkoc_week_overview.html** - Weekly overview dashboard for self-generated KOC (Key Opinion Consumer) content
3. **tribit-selfkoc_week_content.html** - Video performance analysis dashboard with quarterly/weekly comparisons
4. **tribit-selfkoc_week_youtube.html** - YouTube-specific performance metrics with Shorts video preview
5. **tribit-selfkoc_week_tiktok.html** - TikTok-specific performance metrics with native video embeds
6. **tribit-selfkoc_week_instagram.html** - Instagram-specific performance metrics with official embed integration
7. **tribit_kol_india.html** - India region KOL (Key Opinion Leader) performance dashboard
8. **tribit-koc-overview.html** - Global KOC performance dashboard with multi-regional analytics

### Additional Reference Files
- **preview_ytb.html** - YouTube video preview implementation reference
- **prieview_tk.html** - TikTok video preview implementation reference

### Configuration Files
- **vercel.json** - Vercel deployment configuration
- **.vercelignore** - Files to exclude from Vercel deployment

### Technology Stack

- **Frontend Only**: Pure HTML/CSS/JavaScript dashboards
- **Charting Libraries**: 
  - ECharts (5.4.3) - Used in selfkoc dashboards
  - Chart.js - Used in India KOL dashboard
- **CSS Framework**: Bootstrap 5.3.0 (India KOL dashboard only)
- **Icons**: Bootstrap Icons 1.10.3 (India KOL dashboard)
- **Styling**: Custom CSS with glassmorphism effects and gradient themes

### Key Features

- Real-time data visualization with animated charts
- Platform-specific metrics (YouTube, TikTok, Instagram, Amazon, Facebook)
- KPI cards with achievement indicators
- Responsive grid layouts
- Dark theme with gradient backgrounds (selfkoc dashboards)
- Light theme with material design (India KOL dashboard)
- Blue gradient theme (KOC overview dashboard)
- **Video Preview Functionality**:
  - YouTube: Modal-based preview with thumbnail lazy loading, 9:16 aspect ratio for Shorts
  - TikTok: Native iframe embeds using TikTok's embed v2 API
  - Instagram: Official blockquote embeds with Instagram's embed.js
  - KOC Overview: Video grid with 3-column layout and performance metrics
- **Portal Navigation**: Centralized access through index.html with keyboard shortcuts
- **Insights & Recommendations**: Each dashboard includes data-driven insights and actionable recommendations in English
- **Multi-Regional Support**: Global KOC tracking across Europe, US, and India regions

## Development Notes

### File Naming Convention
- `tribit-selfkoc_week_*.html` - Self-generated content weekly dashboards
- `tribit_kol_*.html` - KOL performance dashboards by region

### Color Schemes
- YouTube: `#FF0000` / `#ff4444`
- Instagram: `#E1306C` / Gradient: `#833AB4, #FD1D1D, #FCAF45`
- TikTok: Platform-specific colors used in respective files
- Tribit Brand: Primary `#0066cc`, Secondary `#ff6600`

### Common Patterns
- All dashboards use animation effects (fadeIn, fadeInUp, fadeInDown)
- Hover effects on cards with transform and shadow transitions
- Glassmorphism design with `backdrop-filter: blur()` effects
- Grid-based responsive layouts
- Platform-specific embed implementations:
  - YouTube: `https://www.youtube.com/embed/{videoId}`
  - TikTok: `https://www.tiktok.com/embed/v2/{videoId}`
  - Instagram: Blockquote with `data-instgrm-permalink`

## Important Considerations

1. **No Build Process**: These are standalone HTML files with inline CSS and JavaScript
2. **CDN Dependencies**: All external libraries loaded via CDN links
3. **Data Source**: Currently uses hardcoded data within script tags - consider implementing dynamic data loading
4. **Browser Compatibility**: Modern browser features used (CSS Grid, backdrop-filter, gradient text)
5. **Video Embedding**: 
   - YouTube embeds require proper video IDs
   - TikTok embeds may be blocked by some browsers/networks
   - Instagram embeds require the official embed.js script
6. **Performance**: Video embeds are lazy-loaded to improve initial page load

## Video Preview Implementation Details

### YouTube (tribit-selfkoc_week_youtube.html)
- Uses modal-based preview system with thumbnails
- Implements 9:16 aspect ratio for Shorts format
- Features lazy loading for performance
- Grid layout: 3 videos per row (responsive to 1 on mobile)

### TikTok (tribit-selfkoc_week_tiktok.html)
- Direct iframe embeds using TikTok's official embed v2 API
- Error handling with fallback to external TikTok links
- Loading indicators during embed initialization
- Maintains TikTok's native 9:16 aspect ratio

### Instagram (tribit-selfkoc_week_instagram.html)
- Official Instagram blockquote embed method
- Requires Instagram's embed.js script
- 3 videos per row layout with responsive design
- Preserves Instagram's native styling and interactions

## Insights and Recommendations Feature

All dashboard pages now include comprehensive insights sections that provide:
- **Data-driven analysis** of performance metrics
- **Actionable recommendations** for improvement
- **Critical alerts** for urgent issues
- **Strategic guidance** for content optimization

Each insight section follows a consistent structure:
- Icon-based headers for visual hierarchy
- Bullet-pointed insights for easy scanning
- Highlighted recommendation boxes with specific actions
- All content in English for international accessibility

### Dashboards with Full Insights Implementation:
1. **Weekly Overview** - Platform performance and efficiency analysis
2. **Content Analysis** - Quarterly vs weekly performance gaps
3. **YouTube Dashboard** - Shorts performance and trend analysis
4. **TikTok Dashboard** - Engagement and creator portfolio insights
5. **Instagram Dashboard** - Reel performance and recovery strategies
6. **KOC Overview** - Global creator network analysis

## Recent Updates (July 2025)

1. **Added tribit-koc-overview.html** - Global KOC performance dashboard with:
   - Multi-regional analytics (Europe, US, India)
   - Video performance grid with preview functionality
   - Comprehensive insights for all analysis sections

2. **Enhanced All Dashboards** with:
   - Data-driven insights and recommendations
   - Executive summaries with critical alerts
   - Platform-specific optimization strategies
   - Consistent English-only content

3. **Improved Video Preview Features**:
   - YouTube Shorts vertical format (9:16)
   - TikTok native embeds with error handling
   - Instagram official embed integration
   - Video performance analytics

## Future Enhancement Opportunities

- Consolidate common styles into shared CSS file
- Implement dynamic data loading from APIs
- Add date range selectors for time-based filtering
- Enhance portal navigation with search functionality
- Consider converting to a framework-based SPA for better maintainability
- Add export functionality for insights and reports
- Implement real-time data updates
- Add user authentication for personalized dashboards
- Integrate with Tribit's backend analytics system
- Add multi-language support beyond English
- Implement A/B testing for content recommendations
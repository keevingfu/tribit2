# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Tribit Social Media Analytics Dashboard** - a collection of standalone HTML files that visualize social media performance metrics for Tribit (audio/electronics brand). The dashboards track Key Opinion Leader (KOL) and self-generated content performance across YouTube, TikTok, Instagram, and advertising platforms.

### Key Characteristics
- **Architecture**: Static HTML files with inline CSS/JavaScript (no build process)
- **Data**: Hardcoded within `<script>` tags in each HTML file
- **Libraries**: ECharts 5.4.3 (primary), Chart.js (India KOL dashboard)
- **Deployment**: Vercel static hosting
- **Git Repositories**: 
  - Primary: https://github.com/keevingfu/tribit2
  - Mirror: https://github.com/keevingfu/tribit3

## Commands

### Development
```bash
# Run locally (no build process required)
open index.html

# Deploy to Vercel
vercel

# Git operations
git push origin main              # Push to primary repo (tribit2)
git push tribit3 main            # Push to mirror repo
git push origin main && git push tribit3 main  # Push to both
```

### Testing
- Open HTML files directly in modern browsers (Chrome 90+, Firefox 88+, Safari 14+)
- Test video embeds with valid YouTube, TikTok, and Instagram IDs
- Verify chart rendering and data visualization

## Architecture Overview

### Portal System (index.html)
- Hierarchical navigation menu with 5 main categories
- Iframe-based content loading for dashboard switching
- Keyboard shortcuts for quick navigation
- Categories:
  1. Performance Reports (weekly/trend analysis)
  2. Self-KOC Analytics (platform-specific)
  3. Quarterly Analysis (Q1/Q2 2025)
  4. KOL/KOC Network (global/regional)
  5. Advertising Campaigns (multi-platform)

### Dashboard Structure
```
tribit3/
├── index.html                    # Portal navigation
├── tribit-selfkoc-*.html        # Self-generated content dashboards
├── tribit-kol-*.html            # KOL performance dashboards
├── tribit-ads-*.html            # Advertising campaign dashboards
├── data/                        # CSV data files (not actively used)
├── vercel.json                  # Deployment configuration
└── push_to_github.sh           # Git push helper script
```

## Key Implementation Patterns

### Chart Initialization (ECharts)
```javascript
const chart = echarts.init(document.getElementById('chartId'));
chart.setOption({
    // Standard configuration includes:
    title: { text: 'Chart Title', textStyle: { color: '#fff' } },
    tooltip: { trigger: 'axis' },
    legend: { data: ['Series1', 'Series2'] },
    // Data arrays embedded directly
});
```

### Video Embed Patterns
- **YouTube**: `<iframe src="https://www.youtube.com/embed/{videoId}">`
- **TikTok**: `<iframe src="https://www.tiktok.com/embed/v2/{videoId}">`
- **Instagram**: `<blockquote class="instagram-media" data-instgrm-permalink="...">`

### Common CSS Patterns
- Glassmorphism: `backdrop-filter: blur(10px); background: rgba(255,255,255,0.1);`
- Gradient text: `background: linear-gradient(...); -webkit-background-clip: text;`
- Card hover: `transform: translateY(-5px); box-shadow: 0 10px 30px rgba(...);`
- Animations: `fadeIn`, `fadeInUp`, `fadeInDown` classes

## Critical Development Notes

### Data Management
- All data is **hardcoded** in `<script>` tags within each HTML file
- No API integration or dynamic data loading
- CSV files in `data/` directory exist but are not actively used
- To update data: Edit the JavaScript arrays directly in each HTML file

### Platform-Specific Considerations
- **YouTube**: Shorts use 9:16 aspect ratio, require valid video IDs
- **TikTok**: Embeds may be blocked by some networks/browsers
- **Instagram**: Must include `<script async src="//www.instagram.com/embed.js"></script>`
- **All platforms**: Test embeds with real video IDs before deployment

### Performance Optimization
- Video embeds use lazy loading
- Charts render on page load (no dynamic updates)
- Large datasets may impact initial load time

## Dashboard Categories & Features

### 1. Performance Reports
- Weekly trend analysis (10-week periods)
- Week-over-week comparison reports
- Target achievement tracking
- Performance heatmaps

### 2. Self-KOC Analytics
- Platform-specific dashboards (YouTube, TikTok, Instagram)
- Video preview functionality with platform-specific embeds
- Engagement metrics and creator analytics
- Quarterly vs weekly performance comparisons

### 3. KOL/KOC Network
- Global performance tracking
- Regional analysis (India, Europe, US)
- Creator portfolio management
- Network growth metrics

### 4. Advertising Campaigns
- Multi-platform ad performance (Amazon SBV, Meta, YouTube Shorts)
- Shopify e-commerce integration
- ROI and conversion tracking
- Campaign efficiency metrics

### 5. Insights & Recommendations
- Data-driven analysis sections in each dashboard
- Actionable recommendations
- Critical alerts for performance issues
- All content in English




## Brand Guidelines

### Color Palette
- **Tribit Brand**: Primary `#0066cc`, Secondary `#ff6600`
- **YouTube**: `#FF0000` / `#ff4444`
- **Instagram**: `#E1306C` / Gradient: `#833AB4, #FD1D1D, #FCAF45`
- **TikTok**: Platform-specific colors
- **Dark Theme**: Background `#0a0a0a`, Cards `rgba(22, 33, 62, 0.6)`

### Design System
- **Typography**: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto
- **Effects**: Glassmorphism with `backdrop-filter: blur(10px)`
- **Animations**: fadeIn (0.8s), fadeInUp (0.8s, 50px), fadeInDown (0.8s, -50px)
- **Grid Layout**: Responsive 3-column to 1-column on mobile
- **Card Hover**: `translateY(-5px)` with enhanced shadow

## Quick Reference

### Adding a New Dashboard
1. Copy an existing dashboard HTML file as template
2. Update the title and navigation in index.html
3. Replace data arrays in `<script>` tags
4. Modify chart configurations as needed
5. Update insights and recommendations sections
6. Test all interactive elements and embeds
7. Deploy using `vercel`

### Updating Data
1. Locate the dashboard HTML file
2. Find the `<script>` section with data arrays
3. Update the JavaScript objects directly
4. Test chart rendering
5. Commit and push changes

### Common Issues
- **Charts not rendering**: Check element IDs match initialization code
- **Video embeds broken**: Verify video IDs are valid and platforms accessible
- **Styling issues**: Ensure CDN links are loading (check network tab)
- **Portal navigation**: Verify iframe src paths in index.html
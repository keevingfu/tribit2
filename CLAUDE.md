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
open index.html                    # macOS
python -m http.server 8000        # Python local server (then visit localhost:8000)
npx http-server                   # Node.js local server

# Deploy to Vercel
vercel                            # Deploy to production
vercel --prod                     # Force production deployment

# Git operations
git push origin main              # Push to primary repo (tribit2)
git push tribit3 main            # Push to mirror repo
git push origin main && git push tribit3 main  # Push to both
./push_to_github.sh              # Use helper script (requires PAT setup)
```

### Testing
```bash
# No automated tests - manual testing required
# Browser compatibility check
open index.html           # Test in Chrome 90+, Firefox 88+, Safari 14+

# Verify core functionality:
# 1. Portal navigation and iframe loading
# 2. Chart rendering (ECharts/Chart.js)
# 3. Video embeds (YouTube/TikTok/Instagram)
# 4. Responsive design breakpoints
# 5. Keyboard shortcuts in portal
```

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

### Data Structure Pattern
```javascript
// Standard video data structure used across dashboards
const videoData = [
    {
        no: 1,                    // Sequential number
        channel: 'youtube',       // Platform: youtube, tiktok, instagram
        account: '@username',     // Creator account
        url: 'https://...',      // Full URL to video
        likes: 103,              // Engagement metrics
        comments: 0,
        views: 33000,
        date: '2025/4/4',        // YYYY/M/D format
        videoId: 'xxx'           // Platform-specific ID for embedding
    }
];
```

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
- **Instagram**: Enhanced implementation with loading states (see Instagram Video Preview section below)

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
- **Instagram**: Enhanced implementation with loading placeholders and progressive display
- **All platforms**: Test embeds with real video IDs before deployment

### Instagram Video Preview Implementation
**Standard Pattern** (Updated January 2025):
```html
<!-- HTML Structure -->
<div class="loading-placeholder">
    <div class="spinner"></div>
    <div>Loading Instagram Reel...</div>
</div>
<div class="instagram-embed-container" style="display: none;">
    <blockquote class="instagram-media" 
        data-instgrm-captioned 
        data-instgrm-permalink="{url}?utm_source=ig_embed&utm_campaign=loading" 
        data-instgrm-version="14"
        style="background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);">
    </blockquote>
</div>
```

**Required CSS**:
```css
.instagram-media {
    background: white;
    border: 0;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    margin: 0 !important;
    max-width: 100% !important;
    min-width: 100% !important;
    padding: 0;
}

.instagram-embed-container {
    position: relative;
    width: 100%;
    padding-bottom: 125%; /* Approximate Instagram embed ratio */
    overflow: hidden;
}

.loading-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    color: #ccc;
}

.loading-placeholder .spinner {
    width: 50px;
    height: 50px;
    border: 3px solid rgba(255, 255, 255, 0.2);
    border-top: 3px solid #e1306c;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 20px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
    .instagram-embed-container {
        padding-bottom: 150%;
    }
}
```

**JavaScript Initialization**:
```javascript
function loadInstagramEmbeds() {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.instagram.com/embed.js';
    document.body.appendChild(script);
    
    script.onload = () => {
        if (window.instgrm) {
            window.instgrm.Embeds.process();
            
            // Hide loading placeholders and show embeds
            document.querySelectorAll('.video-card').forEach(card => {
                const placeholder = card.querySelector('.loading-placeholder');
                const embedContainer = card.querySelector('.instagram-embed-container');
                
                if (placeholder && embedContainer) {
                    setTimeout(() => {
                        placeholder.style.display = 'none';
                        embedContainer.style.display = 'block';
                    }, 1000);
                }
            });
        }
    };
}
```

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

## Current Project Status (January 2025)

### Repository Synchronization
- **Last Update**: January 21, 2025
- **Current Branch**: main
- **Latest Commit**: Updated Instagram video preview implementation and navigation structure
- **Sync Status**: ⚠️ Pending sync to both repositories
  - Primary: https://github.com/keevingfu/tribit2
  - Mirror: https://github.com/keevingfu/tribit3
- **Files Modified**: 6 files (5 dashboard HTML files + index.html)

### File Inventory (23 files total)
- **Dashboard HTML Files**: 21 files
  - Performance Reports: 3 files
  - Self-KOC Analytics: 5 files (all updated with new Instagram embeds)
  - Quarterly Analysis: 5 files (2 updated with new Instagram embeds)
  - KOL/KOC Network: 2 files
  - Advertising Campaigns: 5 files
  - Portal: 1 file (index.html - navigation structure updated)
- **Data Files**: 3 CSV files in `data/` directory
- **Configuration**: vercel.json
- **Documentation**: README.md, CLAUDE.md, GITHUB_PUSH_INSTRUCTIONS.md
- **Scripts**: push_to_github.sh

### Files Updated (January 21, 2025)
1. `index.html` - Navigation menu reorganized with 3-tier hierarchy
2. `tribit-selfkoc-ins-April-July-2025.html` - Instagram embeds updated
3. `tribit-selfkoc-overview-q1.html` - Instagram embeds updated
4. `tribit-selfkoc-overview-april-july-2025.html` - Instagram embeds updated
5. `tribit-selfkoc-ins-q1.html` - Instagram embeds updated
6. `tribit-selfkoc-weekly-report-July11-16-2025.html` - Instagram embeds updated

### Recent Changes
- **January 21, 2025**: Updated Instagram video preview implementation across all dashboards
  - Added loading placeholders with spinner animations
  - Implemented progressive display (loading state → content)
  - Enhanced responsive behavior for mobile devices
  - Standardized Instagram embed patterns across 5 dashboard files
- **January 21, 2025**: Reorganized navigation menu in index.html
  - Implemented 3-tier hierarchical menu structure for Self-KOC section
  - Added category grouping by platform and time dimensions
  - Fixed navigation link for Instagram Apr-Jul 2025 dashboard
- **January 17, 2025**: Restructured CLAUDE.md for better developer experience
- Consolidated documentation into practical sections
- Added quick reference guides for common tasks
- Improved command documentation with executable examples
- Streamlined content to focus on essential information

### Deployment Status
- **Platform**: Vercel (static hosting)
- **Configuration**: vercel.json configured for static file serving
- **Ready for Deployment**: Yes - run `vercel` command
- **Alternative**: GitHub Desktop GUI for repository management

### Data Status
- All dashboards use hardcoded data (no external API dependencies)
- Data last updated: July 2025 (based on dashboard content)
- CSV files present but not actively used by dashboards




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
- **Local development CORS**: Use a local server (not file://) for proper iframe loading
- **Git push authentication**: Configure Personal Access Token for GitHub CLI access
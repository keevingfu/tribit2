import { test, expect } from '@playwright/test';

test.describe('KOL Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/kol/dashboard');
  });

  test('should load the dashboard page', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Tribit Content Marketing Platform/);
    
    // Check main heading
    await expect(page.locator('h1')).toContainText('KOL Dashboard');
  });

  test('should display statistics cards', async ({ page }) => {
    // Wait for statistics to load
    await page.waitForSelector('[data-testid="statistics-card"], .bg-white.rounded-lg.shadow.p-6', { 
      timeout: 10000 
    });

    // Check if all 4 statistics cards are displayed
    const statsCards = page.locator('.bg-white.rounded-lg.shadow.p-6').filter({
      has: page.locator('.text-3xl.font-semibold')
    });
    
    await expect(statsCards).toHaveCount(4);

    // Check specific statistics labels
    await expect(page.locator('text=Total KOLs')).toBeVisible();
    await expect(page.locator('text=2024 KOLs')).toBeVisible();
    await expect(page.locator('text=India KOLs')).toBeVisible();
    await expect(page.locator('text=Platforms')).toBeVisible();

    // Check that statistics have values (not just '-')
    const totalKOLsValue = await page.locator('.bg-white.rounded-lg.shadow.p-6').first().locator('.text-3xl').textContent();
    expect(totalKOLsValue).not.toBe('-');
  });

  test('should display charts', async ({ page }) => {
    // Wait for charts to load
    await page.waitForTimeout(2000);

    // Check Platform Distribution chart
    await expect(page.locator('text=Platform Distribution')).toBeVisible();
    const platformChart = page.locator('text=Platform Distribution').locator('..').locator('canvas, svg');
    await expect(platformChart).toBeVisible();

    // Check Region Distribution chart
    await expect(page.locator('text=Region Distribution (Top 10)')).toBeVisible();
    const regionChart = page.locator('text=Region Distribution (Top 10)').locator('..').locator('canvas, svg');
    await expect(regionChart).toBeVisible();

    // Check Data Sources Overview chart
    await expect(page.locator('text=Data Sources Overview')).toBeVisible();
    const dataSourceChart = page.locator('text=Data Sources Overview').locator('..').locator('canvas, svg');
    await expect(dataSourceChart).toBeVisible();
  });

  test('should have refresh functionality', async ({ page }) => {
    // Check refresh button exists
    const refreshButton = page.locator('button:has-text("Refresh")');
    await expect(refreshButton).toBeVisible();
    
    // Click refresh and check if it's disabled during loading
    await refreshButton.click();
    await expect(refreshButton).toBeDisabled();
    
    // Wait for refresh to complete
    await page.waitForTimeout(1000);
    await expect(refreshButton).toBeEnabled();
  });

  test('should display video preview section', async ({ page }) => {
    // Wait for video preview to load
    await page.waitForSelector('text=KOL Video Preview', { timeout: 10000 });

    // Check video preview heading
    await expect(page.locator('text=KOL Video Preview')).toBeVisible();
    
    // Check if video list is displayed
    await expect(page.locator('text=Recent KOL Videos')).toBeVisible();
    
    // Check if there are video items
    const videoItems = page.locator('.p-3.border.rounded-lg.cursor-pointer');
    const videoCount = await videoItems.count();
    expect(videoCount).toBeGreaterThan(0);

    // Check video platform indicators
    const platformIndicators = page.locator('.w-10.h-10.rounded-full');
    await expect(platformIndicators.first()).toBeVisible();
  });

  test('should allow video selection and preview', async ({ page }) => {
    // Wait for videos to load
    await page.waitForSelector('.p-3.border.rounded-lg.cursor-pointer', { timeout: 10000 });

    // Get the first video item
    const firstVideo = page.locator('.p-3.border.rounded-lg.cursor-pointer').first();
    
    // Click on the first video
    await firstVideo.click();
    
    // Check if video is selected (has blue border/background)
    await expect(firstVideo).toHaveClass(/border-blue-500|bg-blue-50/);
    
    // Check if preview area shows content
    const previewArea = page.locator('.bg-gray-100.rounded-lg.p-4').last();
    await expect(previewArea).toBeVisible();
    
    // Check for iframe or link to external video
    const iframe = previewArea.locator('iframe');
    const externalLink = previewArea.locator('a[target="_blank"]');
    
    // Either iframe or external link should be present
    const hasIframe = await iframe.isVisible().catch(() => false);
    const hasLink = await externalLink.isVisible().catch(() => false);
    
    expect(hasIframe || hasLink).toBeTruthy();
  });

  test('should close and reopen video preview', async ({ page }) => {
    // Wait for video preview section
    await page.waitForSelector('text=KOL Video Preview', { timeout: 10000 });
    
    // Find close button
    const closeButton = page.locator('button[aria-label="Close"], button:has(svg.w-5.h-5)').first();
    
    if (await closeButton.isVisible()) {
      // Close video preview
      await closeButton.click();
      
      // Check if preview is hidden
      await expect(page.locator('text=KOL Video Preview')).not.toBeVisible();
      
      // Check if show button appears
      const showButton = page.locator('button:has-text("Show Video Preview")');
      await expect(showButton).toBeVisible();
      
      // Click to show again
      await showButton.click();
      
      // Check if preview is visible again
      await expect(page.locator('text=KOL Video Preview')).toBeVisible();
    }
  });

  test('should make API calls with real data', async ({ page }) => {
    // Intercept API calls
    const statisticsResponse = page.waitForResponse('**/api/kol/total/statistics');
    const platformResponse = page.waitForResponse('**/api/kol/total/distribution?type=platform');
    const regionResponse = page.waitForResponse('**/api/kol/total/distribution?type=region');
    const videosResponse = page.waitForResponse('**/api/kol/total/videos*');

    // Reload page to capture requests
    await page.reload();

    // Check API responses
    const [stats, platform, region, videos] = await Promise.all([
      statisticsResponse,
      platformResponse,
      regionResponse,
      videosResponse
    ]);

    // Verify successful responses
    expect(stats.status()).toBe(200);
    expect(platform.status()).toBe(200);
    expect(region.status()).toBe(200);
    expect(videos.status()).toBe(200);

    // Check response data
    const statsData = await stats.json();
    expect(statsData.success).toBe(true);
    expect(statsData.data).toHaveProperty('total_kols');
    expect(statsData.data).toHaveProperty('kols_2024');
    expect(statsData.data).toHaveProperty('india_kols');
    expect(statsData.data).toHaveProperty('platforms');
  });

  test('should display data from real database tables', async ({ page }) => {
    // Wait for data to load
    await page.waitForTimeout(2000);

    // Check if statistics show non-zero values
    const statsValues = await page.locator('.text-3xl.font-semibold').allTextContents();
    
    // At least some statistics should have non-zero values
    const hasNonZeroValues = statsValues.some(value => {
      const num = parseInt(value.replace(/,/g, ''));
      return !isNaN(num) && num > 0;
    });
    
    expect(hasNonZeroValues).toBeTruthy();

    // Check if charts have rendered with data
    const charts = await page.locator('canvas, svg[class*="echarts"]').count();
    expect(charts).toBeGreaterThan(0);
  });

  test('should be responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    // Check if content is still visible
    await expect(page.locator('h1:has-text("KOL Dashboard")')).toBeVisible();
    
    // Statistics cards should stack vertically
    const firstCard = page.locator('.bg-white.rounded-lg.shadow.p-6').first();
    const secondCard = page.locator('.bg-white.rounded-lg.shadow.p-6').nth(1);
    
    const firstBox = await firstCard.boundingBox();
    const secondBox = await secondCard.boundingBox();
    
    // On mobile, cards should stack (second card Y position > first card Y position + height)
    if (firstBox && secondBox) {
      expect(secondBox.y).toBeGreaterThan(firstBox.y + firstBox.height - 10);
    }

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);
    
    // Charts should be side by side on desktop
    const platformChartBox = await page.locator('text=Platform Distribution').locator('..').boundingBox();
    const regionChartBox = await page.locator('text=Region Distribution (Top 10)').locator('..').boundingBox();
    
    if (platformChartBox && regionChartBox) {
      // On desktop, charts should be side by side (similar Y position)
      expect(Math.abs(platformChartBox.y - regionChartBox.y)).toBeLessThan(50);
    }
  });
});

test.describe('KOL Dashboard Performance', () => {
  test('should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('http://localhost:3000/kol/dashboard');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
    
    // Check if main content is visible
    await expect(page.locator('h1:has-text("KOL Dashboard")')).toBeVisible();
  });
});
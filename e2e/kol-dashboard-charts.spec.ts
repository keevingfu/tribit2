import { test, expect } from '@playwright/test';

test.describe('KOL Dashboard Charts', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/kol/dashboard', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
  });

  test('should display all charts correctly', async ({ page }) => {
    // Wait for page to load
    await expect(page.locator('h1:has-text("KOL Dashboard")')).toBeVisible();
    
    // Check if statistics cards are loaded
    await expect(page.locator('text=/Total KOLs/i')).toBeVisible();
    await expect(page.locator('text=/2024 KOLs/i')).toBeVisible();
    await expect(page.locator('text=/India KOLs/i')).toBeVisible();
    await expect(page.locator('text=/Platforms/i')).toBeVisible();
    
    // Wait for charts to render
    await page.waitForTimeout(2000);
    
    // Check Platform Distribution chart
    const platformChart = page.locator('h3:has-text("Platform Distribution")').locator('..').locator('canvas, svg').first();
    await expect(platformChart).toBeVisible();
    
    // Check Region Distribution chart
    const regionChart = page.locator('h3:has-text("Region Distribution")').locator('..').locator('canvas, svg').first();
    await expect(regionChart).toBeVisible();
    
    // Check Data Sources Overview chart
    const dataSourceChart = page.locator('h3:has-text("Data Sources Overview")').locator('..').locator('canvas, svg').first();
    await expect(dataSourceChart).toBeVisible();
  });

  test('should verify API data integrity', async ({ page }) => {
    // Test platform distribution API
    const platformResponse = await page.request.get('http://localhost:3000/api/kol/total/distribution?type=platform');
    expect(platformResponse.status()).toBe(200);
    const platformData = await platformResponse.json();
    
    expect(platformData.success).toBe(true);
    expect(platformData.data).toBeInstanceOf(Array);
    expect(platformData.data.length).toBeGreaterThan(0);
    
    // Check that all items have correct structure
    platformData.data.forEach((item: any) => {
      expect(item).toHaveProperty('platform');
      expect(item).toHaveProperty('count');
      expect(item).toHaveProperty('source');
      expect(typeof item.platform).toBe('string');
      expect(typeof item.count).toBe('number');
      expect(['kol_total', 'kol_2024', 'kol_india']).toContain(item.source);
    });
    
    // Test region distribution API
    const regionResponse = await page.request.get('http://localhost:3000/api/kol/total/distribution?type=region');
    expect(regionResponse.status()).toBe(200);
    const regionData = await regionResponse.json();
    
    expect(regionData.success).toBe(true);
    expect(regionData.data).toBeInstanceOf(Array);
    expect(regionData.data.length).toBeGreaterThan(0);
    
    // Check that all items have correct structure
    regionData.data.forEach((item: any) => {
      expect(item).toHaveProperty('Region');
      expect(item).toHaveProperty('count');
      expect(typeof item.Region).toBe('string');
      expect(typeof item.count).toBe('number');
    });
  });

  test('should have interactive charts', async ({ page }) => {
    // Wait for charts to render
    await page.waitForTimeout(2000);
    
    // Check if ECharts instances are created
    const hasCharts = await page.evaluate(() => {
      const canvasElements = document.querySelectorAll('canvas');
      return canvasElements.length >= 3; // Should have at least 3 charts
    });
    
    expect(hasCharts).toBe(true);
  });

  test('should refresh data when clicking refresh button', async ({ page }) => {
    // Find and click refresh button
    const refreshButton = page.locator('button:has-text("Refresh")');
    await expect(refreshButton).toBeVisible();
    
    // Click refresh and wait for loading
    await refreshButton.click();
    
    // Check if loading spinner appears
    const spinner = page.locator('svg.animate-spin');
    await expect(spinner).toBeVisible();
    
    // Wait for loading to complete
    await expect(spinner).not.toBeVisible({ timeout: 10000 });
    
    // Charts should still be visible after refresh
    await expect(page.locator('h3:has-text("Platform Distribution")')).toBeVisible();
    await expect(page.locator('h3:has-text("Region Distribution")')).toBeVisible();
    await expect(page.locator('h3:has-text("Data Sources Overview")')).toBeVisible();
  });

  test('should display video preview section', async ({ page }) => {
    // Check if video preview section exists
    const videoSection = page.locator('h3:has-text("KOL Video Preview")');
    
    // It might be hidden initially, so check for show button
    const showVideoButton = page.locator('button:has-text("Show Video Preview")');
    
    if (await showVideoButton.count() > 0) {
      await showVideoButton.click();
      await expect(videoSection).toBeVisible();
    } else {
      await expect(videoSection).toBeVisible();
    }
    
    // Check if videos are displayed
    await page.waitForTimeout(1000);
    const videoElements = page.locator('[class*="video"], iframe, [data-video]');
    expect(await videoElements.count()).toBeGreaterThan(0);
  });
});
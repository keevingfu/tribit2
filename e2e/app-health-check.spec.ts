import { test, expect } from '@playwright/test';

test.describe('Application Health Check', () => {
  test('should load the home page', async ({ page }) => {
    const response = await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    expect(response?.status()).toBeLessThan(400);
    await expect(page).toHaveTitle(/Tribit/i);
  });

  test('should load the dashboard page', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('should load the KOL dashboard', async ({ page }) => {
    await page.goto('http://localhost:3000/kol/dashboard', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Check if statistics cards are loaded
    await expect(page.locator('text=/总KOL数|Total KOLs/i').first()).toBeVisible();
    await expect(page.locator('text=/平台分布|Platform Distribution/i').first()).toBeVisible();
  });

  test('should load the insight videos page with TikTok data', async ({ page }) => {
    await page.goto('http://localhost:3000/insight/videos', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Check if page title is visible
    await expect(page.locator('text=/病毒视频洞察|Viral Video Insights/i')).toBeVisible();
    
    // Check if platform filter exists
    const platformFilter = page.locator('select').first();
    await expect(platformFilter).toBeVisible();
    
    // Select TikTok platform
    await platformFilter.selectOption('tiktok');
    
    // Wait for TikTok data to load
    await page.waitForTimeout(2000);
    
    // Check if TikTok analytics button appears
    const tiktokButton = page.locator('text=/TikTok.*分析/i');
    if (await tiktokButton.count() > 0) {
      await tiktokButton.click();
      await page.waitForTimeout(1000);
      
      // Check if TikTok analytics modal/section is visible
      await expect(page.locator('text=/TikTok.*深度/i')).toBeVisible();
    }
  });

  test('should check API endpoints', async ({ page }) => {
    // Test KOL statistics API
    const kolStatsResponse = await page.request.get('http://localhost:3000/api/kol/total/statistics');
    expect(kolStatsResponse.status()).toBe(200);
    const kolStatsData = await kolStatsResponse.json();
    expect(kolStatsData).toHaveProperty('success', true);
    
    // Test TikTok stats API
    const tiktokStatsResponse = await page.request.get('http://localhost:3000/api/insight/video/tiktok/stats');
    expect(tiktokStatsResponse.status()).toBe(200);
    const tiktokStatsData = await tiktokStatsResponse.json();
    expect(tiktokStatsData).toHaveProperty('success', true);
    
    // Test TikTok videos API
    const tiktokVideosResponse = await page.request.get('http://localhost:3000/api/insight/video/tiktok/videos?pageSize=10');
    expect(tiktokVideosResponse.status()).toBe(200);
    const tiktokVideosData = await tiktokVideosResponse.json();
    expect(tiktokVideosData).toHaveProperty('success', true);
    expect(tiktokVideosData).toHaveProperty('data');
  });

  test('should verify search insights page', async ({ page }) => {
    await page.goto('http://localhost:3000/insight/search', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Check if search insights table is visible
    await expect(page.locator('table').first()).toBeVisible();
    await expect(page.locator('text=/关键词|Keyword/i').first()).toBeVisible();
  });

  test('should check responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3000/kol/dashboard');
    
    // Navigation should still be accessible
    await expect(page.locator('nav, header').first()).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await expect(page.locator('nav, header').first()).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload();
    await expect(page.locator('nav, header').first()).toBeVisible();
  });

  test('should verify video preview functionality', async ({ page }) => {
    await page.goto('http://localhost:3000/insight/videos', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Switch to grid view
    const gridButton = page.locator('button:has-text("网格")');
    if (await gridButton.count() > 0) {
      await gridButton.click();
      await page.waitForTimeout(1000);
      
      // Check if video grid is displayed
      const videoGrid = page.locator('[class*="grid"]').first();
      await expect(videoGrid).toBeVisible();
    }
  });
});

test.describe('Data Integrity Check', () => {
  test('should verify TikTok creator data', async ({ page }) => {
    const response = await page.request.get('http://localhost:3000/api/insight/video/tiktok/creators?pageSize=5');
    const data = await response.json();
    
    expect(data.success).toBe(true);
    expect(data.data).toBeInstanceOf(Array);
    expect(data.total).toBeGreaterThan(0);
    
    // Check first creator structure
    if (data.data.length > 0) {
      const creator = data.data[0];
      expect(creator).toHaveProperty('name');
      expect(creator).toHaveProperty('account');
      expect(creator).toHaveProperty('follower_count');
    }
  });

  test('should verify TikTok product data', async ({ page }) => {
    const response = await page.request.get('http://localhost:3000/api/insight/video/tiktok/products?pageSize=5');
    const data = await response.json();
    
    expect(data.success).toBe(true);
    expect(data.data).toBeInstanceOf(Array);
    expect(data.total).toBe(1000); // We know there are 1000 products
    
    // Check first product structure
    if (data.data.length > 0) {
      const product = data.data[0];
      expect(product).toHaveProperty('product_name');
      expect(product).toHaveProperty('sales_revenue');
      expect(product).toHaveProperty('rating');
    }
  });
});
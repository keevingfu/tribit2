import { test, expect } from '@playwright/test';

test.describe('Chinese Content Check', () => {
  // Helper function to check for Chinese characters
  const containsChinese = (text: string) => {
    return /[\u4e00-\u9fa5]/.test(text);
  };

  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'demo@example.com');
    await page.fill('input[name="password"]', 'demo123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('Dashboard page should not contain Chinese', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    const bodyText = await page.textContent('body');
    const chineseMatches = bodyText?.match(/[\u4e00-\u9fa5]+/g) || [];
    
    if (chineseMatches.length > 0) {
      console.log('Found Chinese text in Dashboard:', chineseMatches);
    }
    
    expect(chineseMatches.length).toBe(0);
  });

  test('KOL Dashboard should not contain Chinese', async ({ page }) => {
    await page.goto('/kol/dashboard');
    await page.waitForLoadState('networkidle');
    
    const bodyText = await page.textContent('body');
    const chineseMatches = bodyText?.match(/[\u4e00-\u9fa5]+/g) || [];
    
    if (chineseMatches.length > 0) {
      console.log('Found Chinese text in KOL Dashboard:', chineseMatches);
    }
    
    expect(chineseMatches.length).toBe(0);
  });

  test('Insight Search page should not contain Chinese', async ({ page }) => {
    await page.goto('/insight/search');
    await page.waitForLoadState('networkidle');
    
    const bodyText = await page.textContent('body');
    const chineseMatches = bodyText?.match(/[\u4e00-\u9fa5]+/g) || [];
    
    if (chineseMatches.length > 0) {
      console.log('Found Chinese text in Insight Search:', chineseMatches);
    }
    
    expect(chineseMatches.length).toBe(0);
  });

  test('Testing Ideation page should not contain Chinese', async ({ page }) => {
    await page.goto('/testing/ideation');
    await page.waitForLoadState('networkidle');
    
    const bodyText = await page.textContent('body');
    const chineseMatches = bodyText?.match(/[\u4e00-\u9fa5]+/g) || [];
    
    if (chineseMatches.length > 0) {
      console.log('Found Chinese text in Testing Ideation:', chineseMatches);
    }
    
    expect(chineseMatches.length).toBe(0);
  });

  test('Ads Dashboard should not contain Chinese', async ({ page }) => {
    await page.goto('/ads');
    await page.waitForLoadState('networkidle');
    
    const bodyText = await page.textContent('body');
    const chineseMatches = bodyText?.match(/[\u4e00-\u9fa5]+/g) || [];
    
    if (chineseMatches.length > 0) {
      console.log('Found Chinese text in Ads Dashboard:', chineseMatches);
    }
    
    expect(chineseMatches.length).toBe(0);
  });

  test('Private Domain page should not contain Chinese', async ({ page }) => {
    await page.goto('/private');
    await page.waitForLoadState('networkidle');
    
    const bodyText = await page.textContent('body');
    const chineseMatches = bodyText?.match(/[\u4e00-\u9fa5]+/g) || [];
    
    if (chineseMatches.length > 0) {
      console.log('Found Chinese text in Private Domain:', chineseMatches);
    }
    
    expect(chineseMatches.length).toBe(0);
  });

  test('All main navigation links should work', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Check Dashboard link
    await page.click('a[href="/dashboard"]');
    await expect(page).toHaveURL('/dashboard');
    
    // Check KOL Marketing link
    await page.click('text=KOL Marketing');
    await expect(page).toHaveURL(/\/kol/);
    
    // Check Content Insights link
    await page.click('text=Content Insights');
    await expect(page).toHaveURL(/\/insight/);
    
    // Check A/B Testing link
    await page.click('text=A/B Testing');
    await expect(page).toHaveURL(/\/testing/);
    
    // Check Ads Analytics link
    await page.click('text=Ads Analytics');
    await expect(page).toHaveURL('/ads');
    
    // Check Private Domain link
    await page.click('text=Private Domain');
    await expect(page).toHaveURL('/private');
  });

  test('API endpoints should return English content', async ({ page }) => {
    // Test KOL API
    const kolResponse = await page.request.get('/api/kol/statistics');
    expect(kolResponse.ok()).toBeTruthy();
    const kolData = await kolResponse.json();
    const kolText = JSON.stringify(kolData);
    expect(containsChinese(kolText)).toBeFalsy();
    
    // Test Insight API
    const insightResponse = await page.request.get('/api/insight/search?keyword=test');
    expect(insightResponse.ok()).toBeTruthy();
    const insightData = await insightResponse.json();
    const insightText = JSON.stringify(insightData);
    expect(containsChinese(insightText)).toBeFalsy();
  });

  test('Check all pages for functionality', async ({ page }) => {
    const pages = [
      '/dashboard',
      '/kol/dashboard',
      '/kol/overview',
      '/kol/conversion',
      '/insight/search',
      '/insight/consumer-voice',
      '/insight/videos',
      '/insight/viral-analysis',
      '/testing/ideation',
      '/testing/performance',
      '/testing/refinement',
      '/ads',
      '/private'
    ];

    for (const url of pages) {
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      
      // Check page loads without errors
      const title = await page.title();
      expect(title).toBeTruthy();
      
      // Check for console errors
      page.on('console', msg => {
        if (msg.type() === 'error') {
          console.error(`Console error on ${url}:`, msg.text());
        }
      });
      
      // Check main content is visible
      const mainContent = await page.locator('main, .main-content, [role="main"]').first();
      await expect(mainContent).toBeVisible();
    }
  });
});
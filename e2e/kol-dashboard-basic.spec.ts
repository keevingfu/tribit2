import { test, expect } from '@playwright/test';

test.describe('KOL Dashboard Basic Check', () => {
  test('should access the dashboard', async ({ page }) => {
    // Try to go to the page
    const response = await page.goto('http://localhost:3000/kol/dashboard', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });
    
    console.log('Response status:', response?.status());
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'kol-dashboard-screenshot.png' });
    
    // Check if page loaded
    expect(response?.status()).toBe(200);
    
    // Wait for any content
    await page.waitForTimeout(2000);
    
    // Check page content
    const content = await page.content();
    console.log('Page title:', await page.title());
    console.log('Has h1?', content.includes('<h1'));
    console.log('Has KOL Dashboard text?', content.includes('KOL Dashboard'));
    
    // Basic checks
    await expect(page).toHaveTitle(/Tribit/i);
  });
});
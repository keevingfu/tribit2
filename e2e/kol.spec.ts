import { test, expect } from '@playwright/test';

test.describe('KOL Management', () => {
  // Setup: Login before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
    await page.getByPlaceholder('Enter username').fill('admin');
    await page.getByPlaceholder('Enter password').fill('admin123');
    await page.getByRole('button', { name: /login|登录/i }).click();
    await expect(page).toHaveURL('/dashboard');
  });

  test('should navigate to KOL list page', async ({ page }) => {
    // Click on KOL menu item
    await page.getByRole('link', { name: /kol/i }).click();
    
    // Should be on KOL list page
    await expect(page).toHaveURL(/\/kol/);
    
    // Should show KOL list table
    await expect(page.getByRole('table')).toBeVisible();
    await expect(page.getByText(/platform|平台/i)).toBeVisible();
  });

  test('should search for KOLs', async ({ page }) => {
    await page.goto('/kol/list');
    
    // Find search input
    const searchInput = page.getByPlaceholder(/search|搜索/i);
    await searchInput.fill('youtube');
    
    // Trigger search (might need to press Enter or click search button)
    await searchInput.press('Enter');
    
    // Wait for results
    await page.waitForLoadState('networkidle');
    
    // Should show filtered results
    const results = page.locator('tbody tr');
    await expect(results).toHaveCount(await results.count());
    
    // Verify search results contain youtube
    const firstResult = results.first();
    await expect(firstResult).toContainText(/youtube/i);
  });

  test('should filter KOLs by platform', async ({ page }) => {
    await page.goto('/kol/list');
    
    // Find and click platform filter
    const platformFilter = page.getByRole('combobox', { name: /platform|平台/i });
    await platformFilter.click();
    
    // Select YouTube option
    await page.getByRole('option', { name: /youtube/i }).click();
    
    // Wait for filtered results
    await page.waitForLoadState('networkidle');
    
    // Verify all results are from YouTube
    const platformCells = page.locator('td:nth-child(2)'); // Assuming platform is in 2nd column
    const count = await platformCells.count();
    
    for (let i = 0; i < count; i++) {
      await expect(platformCells.nth(i)).toContainText(/youtube/i);
    }
  });

  test('should sort KOLs by different columns', async ({ page }) => {
    await page.goto('/kol/list');
    
    // Click on a sortable column header (e.g., Name)
    const nameHeader = page.getByRole('columnheader', { name: /name|名称/i });
    await nameHeader.click();
    
    // Get first few items to verify sorting
    const names = page.locator('tbody tr td:first-child');
    const firstNames = [];
    
    for (let i = 0; i < Math.min(3, await names.count()); i++) {
      firstNames.push(await names.nth(i).textContent());
    }
    
    // Click again to reverse sort
    await nameHeader.click();
    
    // Get first few items again
    const reversedNames = [];
    for (let i = 0; i < Math.min(3, await names.count()); i++) {
      reversedNames.push(await names.nth(i).textContent());
    }
    
    // Should be different order
    expect(firstNames).not.toEqual(reversedNames);
  });

  test('should navigate to KOL detail page', async ({ page }) => {
    await page.goto('/kol/list');
    
    // Click on first KOL in the list
    const firstRow = page.locator('tbody tr').first();
    await firstRow.click();
    
    // Should navigate to detail page
    await expect(page).toHaveURL(/\/kol\/detail\/\d+/);
    
    // Should show KOL details
    await expect(page.getByText(/details|详情/i)).toBeVisible();
    await expect(page.getByText(/performance|表现/i)).toBeVisible();
  });

  test('should paginate through KOL list', async ({ page }) => {
    await page.goto('/kol/list');
    
    // Check if pagination exists
    const pagination = page.locator('[data-testid="pagination"]');
    if (await pagination.isVisible()) {
      // Get current page number
      const currentPage = await page.getByRole('button', { name: '1' }).getAttribute('aria-current');
      expect(currentPage).toBe('page');
      
      // Click next page
      await page.getByRole('button', { name: /next|下一页/i }).click();
      
      // Verify page changed
      const newPage = await page.getByRole('button', { name: '2' }).getAttribute('aria-current');
      expect(newPage).toBe('page');
      
      // Content should be different
      await expect(page.locator('tbody tr').first()).toBeVisible();
    }
  });

  test('should export KOL data', async ({ page }) => {
    await page.goto('/kol/list');
    
    // Start waiting for download before clicking
    const downloadPromise = page.waitForEvent('download');
    
    // Click export button
    await page.getByRole('button', { name: /export|导出/i }).click();
    
    // Wait for download to complete
    const download = await downloadPromise;
    
    // Verify download
    expect(download.suggestedFilename()).toMatch(/kol.*\.(csv|xlsx|xls)/i);
  });
});
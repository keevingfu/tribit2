import { test, expect, Page } from '@playwright/test';

// Test configuration
test.describe.configure({ mode: 'parallel' });

// Helper functions
async function login(page: Page, username: string, password: string) {
  await page.goto('/login');
  await page.fill('[data-testid="username-input"]', username);
  await page.fill('[data-testid="password-input"]', password);
  await page.click('[data-testid="login-button"]');
  await page.waitForURL('/dashboard');
}

async function waitForDataLoad(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.waitForSelector('[data-testid="loading-spinner"]', { state: 'hidden' });
}

// Feature test suite
test.describe('Feature Name', () => {
  // Shared setup
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await login(page, 'testuser@example.com', 'password123');
    
    // Navigate to feature page
    await page.goto('/feature-path');
    
    // Wait for initial data load
    await waitForDataLoad(page);
  });

  test.describe('Basic Functionality', () => {
    test('should display feature correctly', async ({ page }) => {
      // Check page title
      await expect(page).toHaveTitle(/Feature Name/);
      
      // Check main elements are visible
      await expect(page.locator('[data-testid="feature-header"]')).toBeVisible();
      await expect(page.locator('[data-testid="feature-content"]')).toBeVisible();
      
      // Check data is loaded
      const dataRows = page.locator('[data-testid="data-row"]');
      await expect(dataRows).toHaveCount(10);
    });

    test('should handle search functionality', async ({ page }) => {
      // Type in search box
      const searchBox = page.locator('[data-testid="search-input"]');
      await searchBox.fill('test query');
      
      // Submit search
      await page.keyboard.press('Enter');
      
      // Wait for results
      await waitForDataLoad(page);
      
      // Verify URL updated
      await expect(page).toHaveURL(/search=test\+query/);
      
      // Verify results displayed
      await expect(page.locator('[data-testid="search-results"]')).toContainText('test query');
      await expect(page.locator('[data-testid="result-count"]')).toContainText(/\d+ results/);
    });

    test('should filter data correctly', async ({ page }) => {
      // Open filter panel
      await page.click('[data-testid="filter-button"]');
      
      // Select filters
      await page.selectOption('[data-testid="category-filter"]', 'category1');
      await page.fill('[data-testid="date-from"]', '2024-01-01');
      await page.fill('[data-testid="date-to"]', '2024-12-31');
      
      // Apply filters
      await page.click('[data-testid="apply-filters"]');
      
      // Wait for filtered results
      await waitForDataLoad(page);
      
      // Verify filters are applied
      const filterTags = page.locator('[data-testid="active-filter"]');
      await expect(filterTags).toHaveCount(3);
      
      // Verify data is filtered
      const dataRows = page.locator('[data-testid="data-row"]');
      for (const row of await dataRows.all()) {
        await expect(row).toContainText('category1');
      }
    });
  });

  test.describe('User Interactions', () => {
    test('should create new item', async ({ page }) => {
      // Click create button
      await page.click('[data-testid="create-button"]');
      
      // Fill form
      await page.fill('[data-testid="name-input"]', 'New Item');
      await page.fill('[data-testid="description-input"]', 'Test description');
      await page.selectOption('[data-testid="type-select"]', 'type1');
      
      // Submit form
      await page.click('[data-testid="submit-button"]');
      
      // Wait for success message
      await expect(page.locator('[data-testid="success-toast"]')).toContainText('Created successfully');
      
      // Verify item appears in list
      await page.goto('/feature-path');
      await expect(page.locator('[data-testid="data-row"]').first()).toContainText('New Item');
    });

    test('should edit existing item', async ({ page }) => {
      // Click edit on first item
      await page.click('[data-testid="data-row"]:first-child [data-testid="edit-button"]');
      
      // Modify form
      await page.fill('[data-testid="name-input"]', 'Updated Item');
      
      // Save changes
      await page.click('[data-testid="save-button"]');
      
      // Verify success
      await expect(page.locator('[data-testid="success-toast"]')).toContainText('Updated successfully');
      
      // Verify changes reflected
      await expect(page.locator('[data-testid="data-row"]').first()).toContainText('Updated Item');
    });

    test('should delete item with confirmation', async ({ page }) => {
      // Get initial count
      const initialCount = await page.locator('[data-testid="data-row"]').count();
      
      // Click delete on first item
      await page.click('[data-testid="data-row"]:first-child [data-testid="delete-button"]');
      
      // Confirm deletion
      await expect(page.locator('[data-testid="confirm-dialog"]')).toBeVisible();
      await page.click('[data-testid="confirm-delete"]');
      
      // Verify item removed
      await waitForDataLoad(page);
      const newCount = await page.locator('[data-testid="data-row"]').count();
      expect(newCount).toBe(initialCount - 1);
    });
  });

  test.describe('Data Export', () => {
    test('should export data as CSV', async ({ page, context }) => {
      // Start waiting for download
      const downloadPromise = page.waitForEvent('download');
      
      // Click export button
      await page.click('[data-testid="export-button"]');
      await page.click('[data-testid="export-csv"]');
      
      // Wait for download
      const download = await downloadPromise;
      
      // Verify download
      expect(download.suggestedFilename()).toMatch(/export.*\.csv$/);
      
      // Save and verify content
      const path = await download.path();
      expect(path).toBeTruthy();
    });

    test('should export data as PDF', async ({ page }) => {
      const downloadPromise = page.waitForEvent('download');
      
      await page.click('[data-testid="export-button"]');
      await page.click('[data-testid="export-pdf"]');
      
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toMatch(/export.*\.pdf$/);
    });
  });

  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async ({ page, context }) => {
      // Simulate network failure
      await context.route('**/api/**', route => route.abort());
      
      // Try to load data
      await page.reload();
      
      // Should show error message
      await expect(page.locator('[data-testid="error-message"]')).toContainText('Failed to load data');
      
      // Should show retry button
      await expect(page.locator('[data-testid="retry-button"]')).toBeVisible();
    });

    test('should handle validation errors', async ({ page }) => {
      // Open create form
      await page.click('[data-testid="create-button"]');
      
      // Submit empty form
      await page.click('[data-testid="submit-button"]');
      
      // Should show validation errors
      await expect(page.locator('[data-testid="name-error"]')).toContainText('Name is required');
      await expect(page.locator('[data-testid="description-error"]')).toContainText('Description is required');
    });

    test('should handle session timeout', async ({ page, context }) => {
      // Simulate unauthorized response
      await context.route('**/api/**', route => 
        route.fulfill({ status: 401, json: { error: 'Unauthorized' } })
      );
      
      // Trigger API call
      await page.click('[data-testid="refresh-button"]');
      
      // Should redirect to login
      await page.waitForURL('/login');
      await expect(page.locator('[data-testid="session-expired"]')).toBeVisible();
    });
  });

  test.describe('Performance', () => {
    test('should load page within performance budget', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/feature-path');
      await waitForDataLoad(page);
      
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(3000); // 3 seconds
    });

    test('should handle large datasets efficiently', async ({ page }) => {
      // Navigate to page with large dataset
      await page.goto('/feature-path?limit=1000');
      
      // Should use virtual scrolling
      await expect(page.locator('[data-testid="virtual-list"]')).toBeVisible();
      
      // Should only render visible items
      const visibleRows = await page.locator('[data-testid="data-row"]').count();
      expect(visibleRows).toBeLessThan(50); // Only visible rows rendered
      
      // Scroll performance
      const scrollStart = Date.now();
      await page.evaluate(() => window.scrollTo(0, 10000));
      const scrollTime = Date.now() - scrollStart;
      expect(scrollTime).toBeLessThan(100); // Smooth scrolling
    });
  });

  test.describe('Accessibility', () => {
    test('should be keyboard navigable', async ({ page }) => {
      // Tab through interactive elements
      await page.keyboard.press('Tab'); // Focus search
      await expect(page.locator('[data-testid="search-input"]')).toBeFocused();
      
      await page.keyboard.press('Tab'); // Focus filter
      await expect(page.locator('[data-testid="filter-button"]')).toBeFocused();
      
      // Activate with keyboard
      await page.keyboard.press('Enter');
      await expect(page.locator('[data-testid="filter-panel"]')).toBeVisible();
      
      // Close with Escape
      await page.keyboard.press('Escape');
      await expect(page.locator('[data-testid="filter-panel"]')).not.toBeVisible();
    });

    test('should have proper ARIA labels', async ({ page }) => {
      // Check main landmarks
      await expect(page.locator('nav[aria-label="Main navigation"]')).toBeVisible();
      await expect(page.locator('main[aria-label="Main content"]')).toBeVisible();
      
      // Check interactive elements
      const searchInput = page.locator('[data-testid="search-input"]');
      await expect(searchInput).toHaveAttribute('aria-label', /search/i);
      
      // Check live regions
      await page.click('[data-testid="refresh-button"]');
      await expect(page.locator('[aria-live="polite"]')).toContainText(/loading|updated/i);
    });
  });

  test.describe('Mobile Responsiveness', () => {
    test.use({ viewport: { width: 375, height: 667 } });
    
    test('should work on mobile devices', async ({ page }) => {
      await page.goto('/feature-path');
      
      // Mobile menu should be visible
      await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeVisible();
      
      // Desktop menu should be hidden
      await expect(page.locator('[data-testid="desktop-menu"]')).not.toBeVisible();
      
      // Open mobile menu
      await page.click('[data-testid="mobile-menu-button"]');
      await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
      
      // Table should be scrollable
      const table = page.locator('[data-testid="data-table"]');
      await expect(table).toHaveCSS('overflow-x', 'auto');
    });
  });

  test.describe('Visual Regression', () => {
    test('should match visual snapshot', async ({ page }) => {
      await page.goto('/feature-path');
      await waitForDataLoad(page);
      
      // Take screenshot
      await expect(page).toHaveScreenshot('feature-page.png', {
        fullPage: true,
        animations: 'disabled',
      });
      
      // Component-level screenshots
      await expect(page.locator('[data-testid="feature-header"]')).toHaveScreenshot('header.png');
      await expect(page.locator('[data-testid="data-table"]')).toHaveScreenshot('table.png');
    });
  });
});
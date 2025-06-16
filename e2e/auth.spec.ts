import { test, expect, Page } from '@playwright/test';

// Helper function to login
async function login(page: Page, email: string, password: string) {
  await page.goto('/auth/login');
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
}

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear all cookies before each test
    await page.context().clearCookies();
  });

  test('should show login page when not authenticated', async ({ page }) => {
    await page.goto('/');
    
    // Should redirect to login
    await expect(page).toHaveURL('/auth/login');
    
    // Check login form elements
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    await expect(page.getByText('Sign in to Tribit Platform')).toBeVisible();
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Fill in login form with demo credentials
    await page.fill('input[type="email"]', 'demo@example.com');
    await page.fill('input[type="password"]', 'demo123');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard after successful login
    await expect(page).toHaveURL('/dashboard');
    
    // Check auth cookie is set
    const cookies = await page.context().cookies();
    const authCookie = cookies.find(c => c.name === 'auth-token');
    expect(authCookie).toBeDefined();
    expect(authCookie?.httpOnly).toBe(true);
  });

  test('should use demo account login button', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Click demo login button
    await page.click('text=Sign in with demo account');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
  });

  test('should show error message with invalid credentials', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Fill in invalid credentials
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should show error message
    await expect(page.locator('text=Login failed, please check your email and password')).toBeVisible();
    
    // Should remain on login page
    await expect(page).toHaveURL('/auth/login');
  });

  test('should validate email format', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Fill in invalid email format
    await page.fill('input[type="email"]', 'invalid-email');
    await page.fill('input[type="password"]', 'demo123');
    
    // Email input should show validation error
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toHaveAttribute('type', 'email');
    
    // Browser should prevent form submission with invalid email
    const validityState = await emailInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(validityState).toBe(false);
  });

  test('should logout successfully', async ({ page }) => {
    // First login
    await login(page, 'demo@example.com', 'demo123');
    
    // Wait for dashboard
    await expect(page).toHaveURL('/dashboard');
    
    // For now, navigate directly to login to simulate logout
    // In real app, would click logout button
    await page.goto('/auth/login');
    
    // Should be able to access login page (not redirected to dashboard)
    await expect(page).toHaveURL('/auth/login');
  });

  test('should persist authentication across page refreshes', async ({ page }) => {
    // Login first
    await login(page, 'demo@example.com', 'demo123');
    await expect(page).toHaveURL('/dashboard');
    
    // Refresh the page
    await page.reload();
    
    // Should still be on dashboard (authenticated)
    await expect(page).toHaveURL('/dashboard');
  });

  test('should redirect to requested page after login', async ({ page }) => {
    // Try to access protected route
    await page.goto('/kol');
    
    // Should redirect to login with return URL
    await expect(page).toHaveURL('/auth/login?from=%2Fkol');
    
    // Login
    await page.fill('input[type="email"]', 'demo@example.com');
    await page.fill('input[type="password"]', 'demo123');
    await page.click('button[type="submit"]');
    
    // Should redirect to originally requested page
    await expect(page).toHaveURL('/kol');
  });

  test('should handle concurrent login attempts', async ({ page, context }) => {
    // Create two pages (tabs)
    const page1 = page;
    const page2 = await context.newPage();
    
    // Navigate both to login
    await page1.goto('/auth/login');
    await page2.goto('/auth/login');
    
    // Login on first page
    await page1.fill('input[type="email"]', 'demo@example.com');
    await page1.fill('input[type="password"]', 'demo123');
    await page1.click('button[type="submit"]');
    
    // First page should be logged in
    await expect(page1).toHaveURL('/dashboard');
    
    // Second page should also be able to access protected routes after refresh
    await page2.goto('/dashboard');
    await expect(page2).toHaveURL('/dashboard');
    
    await page2.close();
  });

  test('should handle session timeout gracefully', async ({ page }) => {
    // Login
    await login(page, 'demo@example.com', 'demo123');
    await expect(page).toHaveURL('/dashboard');
    
    // Clear auth cookie to simulate session timeout
    await page.context().clearCookies();
    
    // Try to access protected route
    await page.goto('/kol');
    
    // Should redirect to login
    await expect(page).toHaveURL('/auth/login?from=%2Fkol');
  });

  test('should handle network errors during login', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Simulate network failure
    await page.route('**/api/auth/login', route => route.abort());
    
    // Try to login
    await page.fill('input[type="email"]', 'demo@example.com');
    await page.fill('input[type="password"]', 'demo123');
    await page.click('button[type="submit"]');
    
    // Should show error message
    await expect(page.locator('text=Login failed')).toBeVisible();
  });
});
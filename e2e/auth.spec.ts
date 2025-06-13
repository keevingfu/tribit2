import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should show login page when not authenticated', async ({ page }) => {
    await page.goto('/');
    
    // Should redirect to login
    await expect(page).toHaveURL('/auth/login');
    
    // Check login form elements
    await expect(page.getByPlaceholder('Enter username')).toBeVisible();
    await expect(page.getByPlaceholder('Enter password')).toBeVisible();
    await expect(page.getByRole('button', { name: /login|登录/i })).toBeVisible();
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Fill in login form
    await page.getByPlaceholder('Enter username').fill('admin');
    await page.getByPlaceholder('Enter password').fill('admin123');
    
    // Submit form
    await page.getByRole('button', { name: /login|登录/i }).click();
    
    // Should redirect to dashboard after successful login
    await expect(page).toHaveURL('/dashboard');
    
    // Should show user info or logout button
    await expect(page.getByText(/admin/i)).toBeVisible();
  });

  test('should show error message with invalid credentials', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Fill in invalid credentials
    await page.getByPlaceholder('Enter username').fill('invalid');
    await page.getByPlaceholder('Enter password').fill('wrong');
    
    // Submit form
    await page.getByRole('button', { name: /login|登录/i }).click();
    
    // Should show error message
    await expect(page.getByText(/invalid credentials|用户名或密码错误/i)).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // First login
    await page.goto('/auth/login');
    await page.getByPlaceholder('Enter username').fill('admin');
    await page.getByPlaceholder('Enter password').fill('admin123');
    await page.getByRole('button', { name: /login|登录/i }).click();
    
    // Wait for dashboard
    await expect(page).toHaveURL('/dashboard');
    
    // Click logout button (might be in a dropdown or menu)
    const logoutButton = page.getByRole('button', { name: /logout|退出/i });
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
    } else {
      // Try to find it in a user menu
      await page.getByText(/admin/i).click();
      await page.getByRole('button', { name: /logout|退出/i }).click();
    }
    
    // Should redirect back to login
    await expect(page).toHaveURL('/auth/login');
  });
});
import { test, expect } from '@playwright/test';

test.describe('KOL Dashboard Enhanced Video Preview', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/kol/dashboard', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
  });

  test('should display enhanced video preview section', async ({ page }) => {
    // Check if video preview section exists or show button
    const showVideoButton = page.locator('button:has-text("Show Video Preview")');
    
    if (await showVideoButton.count() > 0) {
      await showVideoButton.click();
      await page.waitForTimeout(500);
    }
    
    // Check if video preview section is visible
    const videoSection = page.locator('h3:has-text("KOL Video Preview")');
    await expect(videoSection).toBeVisible();
    
    // Check if video cards are displayed
    const videoCards = page.locator('[class*="group"][class*="cursor-pointer"]');
    const videoCount = await videoCards.count();
    expect(videoCount).toBeGreaterThan(0);
    
    // Check first video card elements
    const firstCard = videoCards.first();
    
    // Check platform badge
    await expect(firstCard.locator('[class*="rounded-full"][class*="text-white"]')).toBeVisible();
    
    // Check title
    await expect(firstCard.locator('h3')).toBeVisible();
    
    // Check creator info
    const creatorInfo = firstCard.locator('p:has-text("粉丝")');
    if (await creatorInfo.count() > 0) {
      await expect(creatorInfo).toBeVisible();
    }
  });

  test('should open video modal on click', async ({ page }) => {
    // Ensure video preview is visible
    const showVideoButton = page.locator('button:has-text("Show Video Preview")');
    if (await showVideoButton.count() > 0) {
      await showVideoButton.click();
      await page.waitForTimeout(500);
    }
    
    // Click on first video card
    const firstVideoCard = page.locator('[class*="group"][class*="cursor-pointer"]').first();
    await firstVideoCard.click();
    
    // Check if modal is opened
    await expect(page.locator('[class*="fixed"][class*="inset-0"][class*="z-50"]')).toBeVisible();
    
    // Check modal elements
    const modal = page.locator('[class*="bg-white"][class*="rounded-lg"][class*="shadow-2xl"]');
    await expect(modal).toBeVisible();
    
    // Check close button
    const closeButton = modal.locator('button[title="Close"]');
    await expect(closeButton).toBeVisible();
    
    // Check platform indicator in modal
    await expect(modal.locator('[class*="rounded-full"][class*="text-white"]')).toBeVisible();
  });

  test('should close modal when clicking close button', async ({ page }) => {
    // Open video modal
    const showVideoButton = page.locator('button:has-text("Show Video Preview")');
    if (await showVideoButton.count() > 0) {
      await showVideoButton.click();
      await page.waitForTimeout(500);
    }
    
    const firstVideoCard = page.locator('[class*="group"][class*="cursor-pointer"]').first();
    await firstVideoCard.click();
    
    // Wait for modal to appear
    await expect(page.locator('[class*="fixed"][class*="inset-0"][class*="z-50"]')).toBeVisible();
    
    // Click close button
    const closeButton = page.locator('button[title="Close"]');
    await closeButton.click();
    
    // Check if modal is closed
    await expect(page.locator('[class*="fixed"][class*="inset-0"][class*="z-50"]')).not.toBeVisible();
  });

  test('should display video stats on cards', async ({ page }) => {
    // Ensure video preview is visible
    const showVideoButton = page.locator('button:has-text("Show Video Preview")');
    if (await showVideoButton.count() > 0) {
      await showVideoButton.click();
      await page.waitForTimeout(500);
    }
    
    // Check first video card for stats
    const firstCard = page.locator('[class*="group"][class*="cursor-pointer"]').first();
    
    // Check for view count icon and text
    const viewStats = firstCard.locator('svg[class*="w-4"][class*="h-4"]').first();
    if (await viewStats.count() > 0) {
      await expect(viewStats).toBeVisible();
      // Check if numbers are formatted (K, M)
      const statsText = await firstCard.locator('[class*="text-gray-500"] span').first().textContent();
      expect(statsText).toMatch(/^\d+(\.\d+)?[KM]?$/);
    }
  });

  test('should handle YouTube videos properly', async ({ page }) => {
    // Ensure video preview is visible
    const showVideoButton = page.locator('button:has-text("Show Video Preview")');
    if (await showVideoButton.count() > 0) {
      await showVideoButton.click();
      await page.waitForTimeout(500);
    }
    
    // Find a YouTube video card
    const youtubeCard = page.locator('[class*="group"][class*="cursor-pointer"]').filter({
      has: page.locator('text=/youtube/i')
    }).first();
    
    if (await youtubeCard.count() > 0) {
      await youtubeCard.click();
      
      // Wait for modal
      await expect(page.locator('[class*="fixed"][class*="inset-0"][class*="z-50"]')).toBeVisible();
      
      // Check for YouTube embed or fallback message
      const modal = page.locator('[class*="bg-white"][class*="rounded-lg"][class*="shadow-2xl"]');
      
      // YouTube videos should show iframe or error message
      const iframe = modal.locator('iframe');
      const fallbackMessage = modal.locator('text=/无法加载视频|YouTube/');
      
      const hasContent = (await iframe.count() > 0) || (await fallbackMessage.count() > 0);
      expect(hasContent).toBeTruthy();
    }
  });

  test('should handle TikTok/Instagram videos with external link', async ({ page }) => {
    // Ensure video preview is visible
    const showVideoButton = page.locator('button:has-text("Show Video Preview")');
    if (await showVideoButton.count() > 0) {
      await showVideoButton.click();
      await page.waitForTimeout(500);
    }
    
    // Find a TikTok or Instagram video card
    const socialCard = page.locator('[class*="group"][class*="cursor-pointer"]').filter({
      has: page.locator('text=/tiktok|instagram/i')
    }).first();
    
    if (await socialCard.count() > 0) {
      await socialCard.click();
      
      // Wait for modal
      await expect(page.locator('[class*="fixed"][class*="inset-0"][class*="z-50"]')).toBeVisible();
      
      // Check for external link button
      const externalLinkButton = page.locator('a:has-text(/在.*中打开/)');
      if (await externalLinkButton.count() > 0) {
        await expect(externalLinkButton).toBeVisible();
        await expect(externalLinkButton).toHaveAttribute('target', '_blank');
        await expect(externalLinkButton).toHaveAttribute('rel', 'noopener noreferrer');
      }
    }
  });

  test('should toggle fullscreen mode', async ({ page }) => {
    // Open a video modal
    const showVideoButton = page.locator('button:has-text("Show Video Preview")');
    if (await showVideoButton.count() > 0) {
      await showVideoButton.click();
      await page.waitForTimeout(500);
    }
    
    const firstVideoCard = page.locator('[class*="group"][class*="cursor-pointer"]').first();
    await firstVideoCard.click();
    
    // Wait for modal
    await expect(page.locator('[class*="fixed"][class*="inset-0"][class*="z-50"]')).toBeVisible();
    
    // Find fullscreen button
    const fullscreenButton = page.locator('button[title="Fullscreen"]');
    if (await fullscreenButton.count() > 0) {
      // Get initial modal class
      const modal = page.locator('[class*="bg-white"][class*="rounded-lg"]');
      const initialClass = await modal.getAttribute('class');
      
      // Click fullscreen
      await fullscreenButton.click();
      
      // Check if modal class changed (should include full width/height classes)
      const fullscreenClass = await modal.getAttribute('class');
      expect(fullscreenClass).not.toBe(initialClass);
      
      // Toggle back
      const exitFullscreenButton = page.locator('button[title="Exit fullscreen"]');
      await expect(exitFullscreenButton).toBeVisible();
    }
  });
});
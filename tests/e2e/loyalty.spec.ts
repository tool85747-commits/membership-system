import { test, expect } from '@playwright/test';

test.describe('Loyalty Homepage E2E Tests', () => {
  test('should complete signup flow', async ({ page }) => {
    await page.goto('/card');
    
    // Fill signup form
    await page.fill('input[id="name"]', 'John Doe');
    await page.fill('input[type="tel"]', '+1234567890');
    await page.check('input[id="consent"]');
    
    // Submit form
    await page.click('button:has-text("Join Now")');
    
    // Should redirect to loyalty card
    await expect(page.locator('text=Hi John')).toBeVisible();
    await expect(page.locator('text=Token:')).toBeVisible();
  });

  test('should show loading states on buttons', async ({ page }) => {
    await page.goto('/admin');
    
    // Test quick action button loading state
    await page.fill('input[id="token"]', 'TEST123');
    await page.selectOption('select[id="action"]', 'addStamp');
    
    const submitButton = page.locator('button:has-text("Execute Action")');
    await submitButton.click();
    
    // Should show loading state
    await expect(submitButton).toContainText('Loading...');
    await expect(submitButton).toBeDisabled();
  });

  test('should handle errors gracefully', async ({ page }) => {
    await page.goto('/card');
    
    // Try to submit empty form
    await page.click('button:has-text("Join Now")');
    
    // Form should not submit and show validation
    await expect(page.locator('button:has-text("Join Now")')).toBeDisabled();
  });

  test('should copy token to clipboard', async ({ page }) => {
    // Mock clipboard API
    await page.addInitScript(() => {
      Object.assign(navigator, {
        clipboard: {
          writeText: () => Promise.resolve(),
        },
      });
    });

    await page.goto('/card');
    
    // Complete signup first
    await page.fill('input[id="name"]', 'Jane Doe');
    await page.fill('input[type="tel"]', '+1987654321');
    await page.check('input[id="consent"]');
    await page.click('button:has-text("Join Now")');
    
    // Wait for loyalty card to load
    await expect(page.locator('text=Hi Jane')).toBeVisible();
    
    // Click copy button
    await page.click('button[aria-label="Copy token"]');
    
    // Should show success state
    await expect(page.locator('svg')).toBeVisible(); // Check icon
  });

  test('admin search should work', async ({ page }) => {
    await page.goto('/admin');
    
    // Search for customer
    await page.fill('input[placeholder*="Search by token"]', 'TEST');
    
    // Should show search results or no results message
    await page.waitForTimeout(500); // Wait for debounced search
  });

  test('gamified map should animate', async ({ page }) => {
    await page.goto('/card');
    
    // Complete signup
    await page.fill('input[id="name"]', 'Test User');
    await page.fill('input[type="tel"]', '+1555123456');
    await page.check('input[id="consent"]');
    await page.click('button:has-text("Join Now")');
    
    // Should see gamified map
    await expect(page.locator('text=Your Journey')).toBeVisible();
    
    // Should see progress indicators
    await expect(page.locator('[class*="rounded-full"]')).toBeVisible();
  });

  test('hero section should display', async ({ page }) => {
    await page.goto('/card');
    
    // Complete signup to see hero
    await page.fill('input[id="name"]', 'Hero Test');
    await page.fill('input[type="tel"]', '+1555987654');
    await page.check('input[id="consent"]');
    await page.click('button:has-text("Join Now")');
    
    // Should see hero section
    await expect(page.locator('text=Welcome to')).toBeVisible();
  });

  test('template switching should work in admin', async ({ page }) => {
    await page.goto('/admin');
    
    // Go to designer tab
    await page.click('button:has-text("Designer")');
    
    // Should see template options
    await expect(page.locator('text=Templates')).toBeVisible();
    await expect(page.locator('text=Classic Progress')).toBeVisible();
    await expect(page.locator('text=Map Journey')).toBeVisible();
  });

  test('async buttons should show proper states', async ({ page }) => {
    await page.goto('/admin');
    
    // Test publish button
    await page.click('button:has-text("Designer")');
    
    const publishButton = page.locator('button:has-text("Publish Changes")');
    await publishButton.click();
    
    // Should show loading state
    await expect(publishButton).toContainText('Loading...');
    await expect(publishButton).toBeDisabled();
  });
});
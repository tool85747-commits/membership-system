import { test, expect } from '@playwright/test';

test.describe('Loyalty System E2E Tests', () => {
  test('should complete signup flow', async ({ page }) => {
    await page.goto('/card');
    
    // Fill signup form
    await page.fill('input[id="name"]', 'John Doe');
    await page.fill('input[type="tel"]', '+1234567890');
    await page.check('input[id="consent"]');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should redirect to loyalty card
    await expect(page.locator('text=Hi John')).toBeVisible();
    await expect(page.locator('text=Token:')).toBeVisible();
  });

  test('should show loading states on buttons', async ({ page }) => {
    await page.goto('/admin');
    
    // Test quick action button loading state
    await page.fill('input[id="token"]', 'TEST123');
    await page.selectOption('select[id="action"]', 'addStamp');
    
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    
    // Should show loading state
    await expect(submitButton).toContainText('Processing...');
    await expect(submitButton).toBeDisabled();
  });

  test('should handle errors gracefully', async ({ page }) => {
    await page.goto('/card');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Form should not submit and show validation
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
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
    await page.click('button[type="submit"]');
    
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
});
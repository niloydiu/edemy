import { test, expect } from '@playwright/test';

test.describe('Edemy Platform Core E2E Tests', () => {
  
  test('should load landing page operational parameters', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Empower Your Mind');
    await expect(page.locator('a:has-text("BROWSE CATALOG")')).toBeVisible();
  });

  test('should successfully bypass authentication via student dev profile', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Select student demo shortcut
    const studentBtn = page.locator('button:has-text("STUDENT DEV")');
    await expect(studentBtn).toBeVisible();
    await studentBtn.click();
    
    // Verify redirection to student dashboard
    await page.waitForURL('**/dashboard/student');
    await expect(page.locator('h3')).toContainText('Enrolled Curriculums');
  });

  test('should successfully bypass authentication via tutor dev profile', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Select tutor demo shortcut
    const tutorBtn = page.locator('button:has-text("TUTOR DEV")');
    await expect(tutorBtn).toBeVisible();
    await tutorBtn.click();
    
    // Verify redirection to tutor dashboard
    await page.waitForURL('**/dashboard/tutor');
    await expect(page.locator('h2')).toContainText('Course Administrator');
  });

  test('should successfully bypass authentication via parent dev profile', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Select parent demo shortcut
    const parentBtn = page.locator('button:has-text("PARENT DEV")');
    await expect(parentBtn).toBeVisible();
    await parentBtn.click();
    
    // Verify redirection to parent dashboard
    await page.waitForURL('**/dashboard/parent');
    await expect(page.locator('h3:has-text("Connected Children")')).toBeVisible();
  });

  test('should successfully bypass authentication via admin dev profile and load CRUD', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Select admin demo shortcut
    const adminBtn = page.locator('button:has-text("ADMIN DEV")');
    await expect(adminBtn).toBeVisible();
    await adminBtn.click();
    
    // Verify redirection to admin dashboard
    await page.waitForURL('**/dashboard/admin');
    await expect(page.locator('button:has-text("Users CRUD")')).toBeVisible();
  });

});

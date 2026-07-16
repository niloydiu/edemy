import { test, expect } from '@playwright/test';

test.describe('Verify Vercel Deployments & Seeding Counts', () => {
  test('should display courses, live classes, and workshops correctly on vercel', async ({ page }) => {
    console.log('Navigating to Vercel courses page...');
    await page.goto('https://ndemy-frontend.vercel.app/courses', { waitUntil: 'networkidle' });
    
    // Wait for the loader to disappear or dynamic content to be in DOM
    await page.waitForTimeout(3000);
    
    const courseCount = await page.locator('.course-card').count();
    console.log(`Total courses found on Vercel: ${courseCount}`);
    
    console.log('Navigating to Vercel live classes page...');
    await page.goto('https://ndemy-frontend.vercel.app/live-classes', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    const liveClassesCount = await page.locator('.course-card').count();
    console.log(`Total live classes found on Vercel: ${liveClassesCount}`);
    
    console.log('Navigating to Vercel workshops page...');
    await page.goto('https://ndemy-frontend.vercel.app/workshops', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    const workshopsCount = await page.locator('.course-card').count();
    console.log(`Total workshops found on Vercel: ${workshopsCount}`);
    
    // Asserts
    expect(courseCount).toBeGreaterThanOrEqual(200);
    expect(liveClassesCount).toBeGreaterThanOrEqual(100);
    expect(workshopsCount).toBeGreaterThanOrEqual(100);
  });
});

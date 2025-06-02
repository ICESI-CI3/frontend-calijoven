import { API_ROUTES } from './../../../src/lib/constants/api';
import { test, expect } from '@playwright/test';
import { generateStorageState, TEST_USERS } from '../../helper/auth';
import { ROUTES } from '@/lib/constants/routes';
import { buildApiRegex, waitForPageReady } from '../../helper/util';
import { PublicationFactory } from '../../mock/publication-factory';

test.use({ storageState: generateStorageState(TEST_USERS.USER) });

test.describe('Public Publications View', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the publications page
    await page.goto(ROUTES.PUBLICATIONS.LIST.PATH);
    
    // Mock the API response
    await page.route(buildApiRegex(API_ROUTES.PUBLICATIONS.BASE), (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: PublicationFactory.createMany(6),
          total: 6,
        }),
      });
    });

    await page.route(buildApiRegex(API_ROUTES.PUBLICATIONS.BY_ID('*')), (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(PublicationFactory.create()),
      });
    });

    // Wait for the page to be ready
    await waitForPageReady(page);
  });

  test.describe('Publication Filtering', () => {
    test('should filter publications by type', async ({ page }) => {
      // Wait for the page to load completely
      await page.waitForLoadState('networkidle');

      // Find the publication type filter
      const typeFilter = page
        .getByText('Tipo de Publicación')
        .locator('..')
        .locator('select, [role="combobox"]');

      if (await typeFilter.isVisible()) {
        // Select a specific type (e.g: Events)
        await typeFilter.selectOption({ label: 'Evento' });

        // Wait for the list to update
        await page.waitForTimeout(2000);

        // Verify that the filter is applied
        const publicationCards = page.locator('[data-testid="publication-card"]');
        const cards = await publicationCards.all();
        
        for (const card of cards) {
          const type = await card.getAttribute('data-type');
          expect(type).toBe('event');
        }
      }
    });

    test('should filter publications by organization', async ({ page }) => {
      // Find the organization filter
      const orgFilter = page
        .getByText('Organización')
        .locator('..')
        .locator('select, [role="combobox"]');

      if (await orgFilter.isVisible()) {
        // Select a specific organization
        await orgFilter.selectOption({ index: 1 });

        // Wait for the list to update
        await page.waitForTimeout(2000);

        // Verify that the filter is applied
        const publicationCards = page.locator('[data-testid="publication-card"]');
        await expect(publicationCards).toBeVisible();
      }
    });
  });

  test.describe('Pagination', () => {
    test('should navigate through pages', async ({ page }) => {
      // Wait for the page to load
      await page.waitForLoadState('networkidle');

      // Find pagination controls
      const pagination = page.locator('[aria-label="pagination"], .pagination, [data-testid="pagination"]');

      if (await pagination.isVisible()) {
        // Click next page
        const nextButton = page.getByRole('button', { name: /siguiente|next/i });
        if (await nextButton.isVisible()) {
          await nextButton.click();
          await page.waitForTimeout(1000);
          
          // Verify that the page changed
          const currentPage = page.locator('[aria-current="page"]');
          await expect(currentPage).toHaveText('2');
        }
      }
    });
  });
});
import { test, expect } from '@playwright/test';

test.describe('CDJ Página Pública', () => {
  test.beforeEach(async ({ page }) => {
    // Mock de organizaciones (CDJ)
    await page.route('**/organizations**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: 123,
              name: 'Consejo Distrital de Juventud',
              description: 'CDJ de Santiago de Cali',
            }
          ]
        }),
      });
    });

    // Mock de documentos del CDJ
    await page.route('**document/organization/123**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 1,
            title: 'Acta de Constitución',
            type: { description: 'Acta' },
            file_url: '/docs/acta.pdf',
            date: '2024-01-01'
          }
        ]),
      });
    });

    // Mock de publicaciones de la organización
    await page.route('**/publications**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: 1,
              title: 'Primera publicación',
              description: 'Descripción de la publicación',
              createdAt: '2024-01-01T00:00:00Z'
            }
          ],
          meta: { total: 1, page: 1, limit: 10 }
        }),
      });
    });

    await page.goto('/cdj');
    await page.waitForLoadState('networkidle');
  });

  test('debe mostrar el hero y secciones principales', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Consejo Distrital de Juventud' })).toBeVisible();
    await expect(page.getByText('Representando y defendiendo los intereses de los jóvenes de Santiago de Cali', { exact: false })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Sobre Nosotros' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Documentos' }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Publicaciones', exact: false }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Publicaciones del CDJ', exact: false })).toBeVisible();
  });

  test('debe mostrar los documentos del CDJ', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Documentos', exact: false }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Documentos Importantes', exact: false })).toBeVisible();
  });

  test('debe mostrar publicaciones del CDJ', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Publicaciones', exact: false }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Publicaciones del CDJ', exact: false })).toBeVisible();
  });

  test('debe mostrar la información de contacto', async ({ page }) => {
    const contactSection = page.locator('section', { hasText: 'Contacto' });
    await expect(contactSection.getByText('Centro Administrativo Municipal CAM', { exact: false })).toBeVisible();
    await expect(contactSection.getByText('cdj@cali.gov.co', { exact: false })).toBeVisible();
    await expect(contactSection.getByText('(602) 885-6000', { exact: false })).toBeVisible();
    await expect(contactSection.getByText('+57 316 123 4567', { exact: false })).toBeVisible();
  });
});
import { test, expect } from '@playwright/test';

test.describe('Publications Page', () => {
  test.beforeEach(async ({ page }) => {
    // Mockear la ruta de sesión para simular un usuario autenticado
    await page.route('**/api/auth/session', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            id: 1,
            name: 'Test User',
            email: 'test@example.com',
            roles: ['ADMIN']
          },
          valid: true,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        }),
      });
    });

    // Mockear la ruta de callback de autenticación
    await page.route('**/api/auth/callback/credentials', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            id: 1,
            name: 'Test User',
            email: 'test@example.com',
            roles: ['ADMIN']
          }
        }),
      });
    });

    // Mockear las rutas de la API
    await page.route('**/publication*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [],
          meta: {
            total: 0,
            page: 1,
            limit: 3
          }
        }),
      });
    });

    await page.route('**/api/banners*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    // Navegar a la página de publicaciones antes de cada test
    await page.goto('/publicaciones', { waitUntil: 'networkidle' });
    
    // Debug: Verificar que la página se cargó correctamente
    const title = await page.title();
    
    // Debug: Verificar la URL actual
    const url = page.url();
    
    // Debug: Verificar si hay errores en la red
    page.on('requestfailed', request => {
      console.log('Failed request:', request.url(), request.failure()?.errorText);
    });

    // Esperar a que la página esté completamente cargada
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('networkidle');

    // Si estamos en la página de login, esperar a que se complete la redirección
    if (url.includes('/login')) {
      await page.waitForURL('**/publications', { timeout: 10000 });
    }
  });

  test('should load the publications page', async ({ page }) => {
    // Verificar que estamos en la página correcta
    await expect(page).toHaveURL(/.*\/publicaciones/);
    
    // Verificar que el título de la página es correcto
    const title = await page.title();
    expect(title).toBeTruthy();
    
    // Verificar que el body está presente
    const body = await page.locator('body');
    await expect(body).toBeVisible();
    
    // Debug: Imprimir todos los elementos con texto
    const elements = await page.evaluate(() => {
      const allElements = document.querySelectorAll('*');
      return Array.from(allElements)
        .filter(el => el.textContent?.trim())
        .map(el => ({
          tag: el.tagName,
          text: el.textContent?.trim(),
          visible: el.getBoundingClientRect().height > 0,
          classes: el.className
        }));
    });
  });

  test('should display the publications header', async ({ page }) => {
    // Primero verificar que el elemento existe en el DOM
    const headerExists = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      return Array.from(elements).some(el => 
        el.textContent?.includes('Descubre eventos, noticias y oportunidades para jóvenes')
      );
    });

    // Luego intentar encontrarlo con el selector
    const headerText = page.getByText('Descubre eventos, noticias y oportunidades para jóvenes', { exact: false });
    await expect(headerText).toBeVisible({ timeout: 10000 });
  });

}); 
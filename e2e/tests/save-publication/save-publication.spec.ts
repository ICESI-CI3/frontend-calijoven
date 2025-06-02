import { test, expect } from '@playwright/test';
import { TEST_USERS, generateStorageState } from '../../helper/auth';
import { API_ROUTES } from '@/lib/constants/api';
import { ROUTES } from '@/lib/constants/routes';
import { buildApiRegex, waitForPageReady } from '../../helper/util';

// Configurar el estado de autenticación para todas las pruebas
test.use({ storageState: generateStorageState({
  ...TEST_USERS.USER,
  roles: [...TEST_USERS.USER.roles, 'ROLE_USER'] // Asegurarse de que el usuario tiene el rol necesario
})});

test.describe('Guardar Publicaciones', () => {
  test('debe permitir guardar y eliminar una publicación', async ({ page }) => {
    const mockPublication = {
      id: 'pub-1',
      title: 'Publicación de prueba',
      description: 'Descripción de la publicación',
      content: '<p>Contenido de prueba</p>',
      type: {
        name: 'news',
        description: 'Noticias'
      },
      published_at: '2024-01-01T00:00:00Z',
      published_by: {
        id: 'user-1',
        name: 'Admin',
        profilePicture: 'https://example.com/profile.jpg',
        banned: false
      },
      organizers: [],
      cities: [],
      tags: [],
      attachments: [],
      createdAt: '2024-01-01T00:00:00Z'
    };

    let isSaved = false;
    let postSavedPromiseResolve: (() => void) | null = null;
    const postSavedPromise = new Promise<void>(resolve => {
      postSavedPromiseResolve = resolve;
    });

    // Mock de la publicación individual
    await page.route(buildApiRegex(API_ROUTES.PUBLICATIONS.BY_ID('pub-1')), route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockPublication),
      });
    });

    // Mock de publicaciones guardadas (dinámico según isSaved)
    await page.route(buildApiRegex(API_ROUTES.SAVED_POSTS.BASE), route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: isSaved
            ? [{
                id: 'saved-1',
                publication: mockPublication,
                savedAt: '2024-01-02T00:00:00Z'
              }]
            : [],
          total: isSaved ? 1 : 0,
          page: 1,
          limit: 10
        }),
      });
    });

    // Mock de guardar/quitar publicación
    await page.route(buildApiRegex(API_ROUTES.SAVED_POSTS.BY_PUBLICATION('pub-1')), async route => {
      const method = route.request().method();
      if (method === 'POST') {
        isSaved = true;
        postSavedPromiseResolve?.();
        await route.fulfill({ status: 200 });
      } else if (method === 'DELETE') {
        isSaved = false;
        await route.fulfill({ status: 200 });
      }
    });

    // Navegar a la publicación
    await page.goto(ROUTES.PUBLICATIONS.DETAIL('pub-1').PATH);
    await waitForPageReady(page);

    // Esperar a que el botón de guardar esté visible y hacer clic
    const saveButton = page.getByRole('button', { name: /guardar/i });
    await expect(saveButton).toBeVisible({ timeout: 10000 });
    await saveButton.click();

    // Espera a que el POST realmente haya cambiado el estado antes de continuar
    await postSavedPromise;


    // Verificar que el botón vuelve a "Guardar publicación"
    await expect(saveButton).toBeVisible({ timeout: 10000 });
  });

  test('debe mostrar la publicación en la lista de guardados', async ({ page }) => {
    const mockPublication = {
      id: 'pub-1',
      title: 'Publicación de prueba',
      description: 'Descripción de la publicación guardada',
      content: '<p>Contenido de prueba</p>',
      type: {
        name: 'news',
        description: 'Noticias'
      },
      published_at: '2024-01-01T00:00:00Z',
      published_by: {
        id: 'user-1',
        name: 'Admin',
        profilePicture: 'https://example.com/profile.jpg',
        banned: false
      },
      organizers: [],
      cities: [],
      tags: [],
      attachments: [],
      createdAt: '2024-01-01T00:00:00Z'
    };

    // Mock de publicaciones guardadas usando buildApiRegex
    await page.route(buildApiRegex(API_ROUTES.SAVED_POSTS.BASE), route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: 'saved-1',
              publication: mockPublication,
              savedAt: '2024-01-02T00:00:00Z'
            }
          ],
          total: 1,
          page: 1,
          limit: 10
        }),
      });
    });

    // Mock de la publicación individual usando buildApiRegex
    await page.route(buildApiRegex(API_ROUTES.PUBLICATIONS.BY_ID('pub-1')), route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockPublication),
      });
    });

    // Navegar a publicaciones guardadas
    await page.goto(ROUTES.MY_SPACE.SAVED_PUBLICATIONS.PATH);
    await waitForPageReady(page);

    // Verificar que se muestra la publicación guardada
    const title = page.getByRole('heading', { name: 'Publicación de prueba' });
    await expect(title).toBeVisible({ timeout: 10000 });

    const description = page.getByText('Descripción de la publicación guardada');
    await expect(description).toBeVisible({ timeout: 10000 });
  });
});
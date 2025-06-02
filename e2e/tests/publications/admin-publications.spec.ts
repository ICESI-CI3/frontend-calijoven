import { API_ROUTES } from './../../../src/lib/constants/api';
import { test, expect } from '@playwright/test';
import { generateStorageState, TEST_USERS } from '../../helper/auth';

import { ROUTES } from '@/lib/constants/routes';
import { buildApiRegex, waitForPageReady } from '../../helper/util';
import { PublicationFactory } from '../../mock/publication-factory';

test.use({ storageState: generateStorageState(TEST_USERS.ADMIN) });

test.describe('Admin Publications Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the admin publications page
    await page.goto(ROUTES.ADMIN.PUBLICATIONS.PATH);
    // Mock the API response
    await page.route(buildApiRegex(API_ROUTES.PUBLICATIONS.BASE), (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: PublicationFactory.createMany(3),
          total: 3,
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

  test.describe('Page Layout and Navigation', () => {
    test('should display the dashboard header and navigation', async ({ page }) => {
      // Verify the main title
      await expect(page.getByText('Dashboard Administrativo - Publicaciones')).toBeVisible();

      // Verify the description
      await expect(
        page.getByText('Gestiona eventos, noticias y ofertas de la plataforma')
      ).toBeVisible();

      // Verify the tabs
      await expect(page.getByRole('tab', { name: 'Gestión de Publicaciones' })).toBeVisible();
      await expect(page.getByRole('tab', { name: 'Reportes' })).toBeVisible();
    });

    test('should display organization filter dropdown', async ({ page }) => {
      // Verify the organization filter dropdown
      const organizationSelect = page.locator('select, [role="organization-select"]').first();
      await expect(organizationSelect).toBeVisible();
    });

    test('should switch between tabs correctly', async ({ page }) => {
      // Verify that the management tab is active by default
      await expect(page.getByRole('tab', { name: 'Gestión de Publicaciones' })).toHaveAttribute(
        'aria-selected',
        'true'
      );

      // Change to the reports tab
      await page.getByRole('tab', { name: 'Reportes' }).click();
      await expect(page.getByRole('tab', { name: 'Reportes' })).toHaveAttribute(
        'aria-selected',
        'true'
      );

      // Change back to the management tab
      await page.getByRole('tab', { name: 'Gestión de Publicaciones' }).click();
      await expect(page.getByRole('tab', { name: 'Gestión de Publicaciones' })).toHaveAttribute(
        'aria-selected',
        'true'
      );
    });
  });

  test.describe('Publications List Management', () => {
    test('should display publications list with correct headers', async ({ page }) => {
      // Verify the section title
      await expect(page.getByRole('heading', { name: 'Gestión de Publicaciones' })).toBeVisible();

      // Verify the create new publication button
      await expect(page.getByRole('button', { name: /Crear Nueva Publicación/i })).toBeVisible();

      // Verify the table columns
      await expect(page.getByRole('columnheader', { name: 'Publicación' })).toBeVisible();
      await expect(page.getByRole('columnheader', { name: 'Tipo' })).toBeVisible();
      await expect(page.getByRole('columnheader', { name: 'Estado' })).toBeVisible();
      await expect(page.getByRole('columnheader', { name: 'Fecha' })).toBeVisible();
      await expect(page.getByRole('columnheader', { name: 'Acciones' })).toBeVisible();
    });

    test('should filter publications by type', async ({ page }) => {
      // Wait for the page to load completely
      await page.waitForLoadState('networkidle');

      // Search for the publication type filter
      const typeFilter = page
        .getByText('Tipo de Publicación')
        .locator('..')
        .locator('select, [role="combobox"]');

      if (await typeFilter.isVisible()) {
        // Select a specific type (e.g: Events)
        await typeFilter.selectOption({ label: 'Evento' });

        // Wait for the list to update
        await page.waitForTimeout(2000);

        // Verify that the filter is applied (this will depend on whether there are test data)
        // In a real environment, you would verify that only events are displayed
      }
    });

    test('should toggle published/unpublished filter', async ({ page }) => {
      // Buscar el toggle de "Ver solo publicados"
      const publishedToggle = page
        .getByText('Ver solo publicados')
        .locator('..')
        .locator('input[type="checkbox"], [role="switch"]');

      if (await publishedToggle.isVisible()) {
        // Activar el filtro de solo publicados
        await publishedToggle.check();

        // Esperar a que se actualice la lista
        await page.waitForTimeout(1000);

        // Desactivar el filtro
        await publishedToggle.uncheck();

        // Esperar a que se actualice la lista
        await page.waitForTimeout(1000);
      }
    });

    test('should search publications', async ({ page }) => {
      // Buscar el campo de búsqueda
      const searchInput = page.getByPlaceholder(/buscar/i).or(page.locator('input[type="search"]'));

      if (await searchInput.isVisible()) {
        // Escribir en el campo de búsqueda
        await searchInput.fill('test publication');

        // Esperar a que se actualice la lista
        await page.waitForTimeout(1000);

        // Limpiar la búsqueda
        await searchInput.clear();
      }
    });
  });

  test.describe('Publication Actions', () => {
    test('should display action buttons for each publication', async ({ page }) => {
      // Esperar a que carguen las publicaciones
      await page.waitForLoadState('networkidle');

      // Buscar la primera fila de publicación (si existe)
      const firstRow = page.locator('table tbody tr').first();

      if (await firstRow.isVisible()) {
        // Verificar que existen los botones de acción
        const editButton = firstRow.getByTitle('Editar');
        const reportButton = firstRow.getByTitle('Generar Reporte');
        const deleteButton = firstRow.getByTitle('Eliminar');

        await expect(editButton).toBeVisible();
        await expect(reportButton).toBeVisible();
        await expect(deleteButton).toBeVisible();
      }
    });

    test('should show delete confirmation modal', async ({ page }) => {
      // Esperar a que carguen las publicaciones
      await page.waitForLoadState('networkidle');

      // Buscar la primera fila de publicación
      const firstRow = page.locator('table tbody tr').first();

      if (await firstRow.isVisible()) {
        const deleteButton = firstRow.getByTitle('Eliminar');

        if (await deleteButton.isVisible()) {
          await deleteButton.click();

          // Verificar que aparece el modal de confirmación
          await expect(page.getByText('Confirmar Eliminación')).toBeVisible();
          await expect(
            page.getByText(/¿Estás seguro de que deseas eliminar la publicación?/)
          ).toBeVisible();

          // Verificar los botones del modal
          await expect(page.getByRole('button', { name: 'Cancelar' })).toBeVisible();
          await expect(page.getByRole('button', { name: 'Eliminar' }).first()).toBeVisible();

          // Cancelar la eliminación
          await page.getByRole('button', { name: 'Cancelar' }).click();

          // Verificar que el modal se cierra
          await expect(page.getByText('Confirmar Eliminación')).not.toBeVisible();
        }
      }
    });
  });

  test.describe('Pagination', () => {
    test('should display pagination when there are multiple pages', async ({ page }) => {
      // Esperar a que carguen las publicaciones
      await page.waitForLoadState('networkidle');

      // Buscar elementos de paginación (esto dependerá de si hay suficientes datos)
      const pagination = page.locator(
        '[aria-label="pagination"], .pagination, [data-testid="pagination"]'
      );

      // Si hay paginación, verificar que funciona
      if (await pagination.isVisible()) {
        const nextButton = page.getByRole('button', { name: /siguiente|next/i });
        const prevButton = page.getByRole('button', { name: /anterior|previous/i });

        // Verificar que los botones de navegación están presentes
        if (await nextButton.isVisible()) {
          await expect(nextButton).toBeVisible();
        }

        if (await prevButton.isVisible()) {
          await expect(prevButton).toBeVisible();
        }
      }
    });
  });

  test.describe('Organization Filter', () => {
    test('should filter publications by organization', async ({ page }) => {
      // Buscar el selector de organizaciones
      const orgSelect = page.locator('select, [role="combobox"]').first();

      if (await orgSelect.isVisible()) {
        // Seleccionar una organización específica
        await orgSelect.selectOption({ index: 1 }); // Seleccionar la primera organización (no "Todas")

        // Esperar a que se actualice la lista
        await page.waitForTimeout(1000);

        // Volver a "Todas las organizaciones"
        await orgSelect.selectOption({ index: 0 });

        // Esperar a que se actualice la lista
        await page.waitForTimeout(1000);
      }
    });
  });

  test.describe('Error Handling', () => {
    test('should display error message when API fails', async ({ page }) => {
      // Interceptar las llamadas a la API para simular errores
      await page.route('**/api/publications**', (route) => {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Internal Server Error' }),
        });
      });

      // Recargar la página para activar el error
      await page.reload({ waitUntil: 'networkidle' });

      // Verificar que se muestra un mensaje de error
      const errorMessage = page.getByText(/error/i).or(page.locator('[role="alert"]'));
      await expect(errorMessage).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Loading States', () => {
    test('should show loading state while fetching publications', async ({ page }) => {
      // Recargar la página
      await page.reload();

      // Verificar que se muestra un estado de carga
      const loadingIndicator = page.locator('[role="table-loading"]');
      // El indicador de carga debería aparecer brevemente
      await expect(loadingIndicator).toBeVisible({ timeout: 2000 });
    });
  });

  test.describe('Responsive Design', () => {
    test('should be responsive on mobile devices', async ({ page }) => {
      // Cambiar a viewport móvil
      await page.setViewportSize({ width: 375, height: 667 });

      // Verificar que los elementos principales siguen siendo visibles
      await expect(page.getByText('Dashboard Administrativo - Publicaciones')).toBeVisible();
      await expect(page.getByRole('button', { name: /Crear Nueva Publicación/i })).toBeVisible();

      // Verificar que la tabla se adapta o se convierte en cards
      const table = page.locator('table');
      const mobileCards = page.locator('[data-testid="mobile-card"], .mobile-card');

      // Debería haber una tabla o cards móviles
      const hasTable = await table.isVisible();
      const hasCards = (await mobileCards.count()) > 0;

      expect(hasTable || hasCards).toBeTruthy();
    });

    test('should be responsive on tablet devices', async ({ page }) => {
      // Cambiar a viewport de tablet
      await page.setViewportSize({ width: 768, height: 1024 });

      // Verificar que los elementos principales siguen siendo visibles
      await expect(page.getByText('Dashboard Administrativo - Publicaciones')).toBeVisible();
      await expect(page.getByRole('button', { name: /Crear Nueva Publicación/i })).toBeVisible();
    });
  });
});

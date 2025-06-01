import { test, expect } from '@playwright/test';

test.describe('Save Publications', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar a la página de publicaciones
    await page.goto('/publicaciones');
  });

  test('should save a publication', async ({ page }) => {
    // Encontrar una publicación y guardarla
    const firstPublication = await page.getByTestId('publication-card').first();
    const saveButton = await firstPublication.getByRole('button', { name: 'Guardar publicación' });
    
    await saveButton.click();
    
    // Verificar que el botón cambió a "guardado"
    await expect(firstPublication.getByRole('button', { name: 'Quitar de guardados' })).toBeVisible();
  });

  test('should unsave a publication', async ({ page }) => {
    // Primero guardar una publicación
    const firstPublication = await page.getByTestId('publication-card').first();
    const saveButton = await firstPublication.getByRole('button', { name: 'Guardar publicación' });
    await saveButton.click();
    
    // Luego quitarla de guardados
    const unsaveButton = await firstPublication.getByRole('button', { name: 'Quitar de guardados' });
    await unsaveButton.click();
    
    // Verificar que volvió al estado inicial
    await expect(firstPublication.getByRole('button', { name: 'Guardar publicación' })).toBeVisible();
  });

  test('should show saved publications in my space', async ({ page }) => {
    // Obtener el título de la primera publicación
    const titleElement = await page.getByTestId('publication-card').first().getByTestId('publication-title');
    await expect(titleElement).toBeVisible();
    const publicationTitle = await titleElement.textContent();
    expect(publicationTitle).toBeTruthy();

    // Guardar la publicación
    const saveButton = await page.getByTestId('publication-card').first().getByRole('button', { name: 'Guardar publicación' });
    await saveButton.click();
    
    // Ir a publicaciones guardadas
    await page.goto('/mi-espacio/publicaciones-guardadas');
    
    // Verificar que la publicación aparece en la lista
    await expect(page.getByText(publicationTitle!)).toBeVisible();
  });

  test('should persist saved publications after page reload', async ({ page }) => {
    // Guardar una publicación
    const firstPublication = await page.getByTestId('publication-card').first();
    const saveButton = await firstPublication.getByRole('button', { name: 'Guardar publicación' });
    await saveButton.click();
    
    // Recargar la página
    await page.reload();
    
    // Verificar que la publicación sigue guardada
    await expect(firstPublication.getByRole('button', { name: 'Quitar de guardados' })).toBeVisible();
  });
}); 
import { test, expect } from '@playwright/test';

test.describe('Política de Juventud (PDJ) Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar a la página de PDJ
    await page.goto('/pdj');
  });

  test('should display hero section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Plataforma Distrital de Juventudes' })).toBeVisible();
    await expect(page.getByText('Trabajando por y para los jóvenes de Santiago de Cali')).toBeVisible();
  });

  test('should display "Sobre Nosotros" section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Sobre Nosotros' })).toBeVisible();
    const pdjCard = page.getByRole('heading', { name: '¿Qué es la PDJ?' }).locator('..').locator('..');
    await expect(pdjCard).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Misión' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Visión' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Valores' })).toBeVisible();
    const valoresSection = page.getByRole('heading', { name: 'Valores' }).locator('..').locator('ul');
    await expect(valoresSection.getByText('Participación')).toBeVisible();
    await expect(valoresSection.getByText('Inclusión')).toBeVisible();
    await expect(valoresSection.getByText('Transparencia')).toBeVisible();
    await expect(valoresSection.getByText('Compromiso')).toBeVisible();
  });

  test('should display committees section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Nuestros Comités' })).toBeVisible();
    const committees = page.getByTestId('committee-card');
    const count = await committees.count();
    if (count > 0) {
      const firstCommittee = committees.first();
      await expect(firstCommittee.getByTestId('committee-name')).toBeVisible();
      await expect(firstCommittee.getByTestId('committee-members')).toBeVisible();
    } else {
      await expect(page.getByText('No hay comités disponibles en este momento.')).toBeVisible();
    }
  });

  
});
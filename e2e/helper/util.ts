import { Page } from "@playwright/test";
import "../../src/lib/api/envConfig";

/**
 * Espera a que Zustand termine de hidratarse
 * Esto evita que los tests fallen por el spinner de carga inicial
 */
export async function waitForZustandHydration(page: Page, timeout = 10000) {
  try {
    // Esperar a que el estado de hidratación sea true
    await page.waitForFunction(
      () => {
        // Verificar si Zustand está disponible y hidratado
        const authStorage = localStorage.getItem('auth-storage');
        if (!authStorage) return true; // Si no hay storage, consideramos que está hidratado

        // Verificar si el spinner de hidratación ya no está visible
        const spinner = document.querySelector('[role="page-loading"]');
        return !spinner;
      },
      { timeout }
    );
  } catch (error) {
    console.warn('error', error);
    console.warn('Timeout waiting for Zustand hydration, continuing anyway');
  }
}

/**
 * Espera a que la página esté completamente cargada y Zustand hidratado
 */
export async function waitForPageReady(page: Page) {
  // Esperar a que la página cargue
  await page.waitForLoadState('domcontentloaded');

  // Esperar a que Zustand se hidrate
  await waitForZustandHydration(page);

  // Esperar un poco más para asegurar que todo esté listo
  await page.waitForTimeout(500);
}

export function buildApiRegex(route: string) {
  const baseUrl = process.env.BACKEND_URL || 'http://localhost:4000';
  return `**${baseUrl}${route}*`;
}

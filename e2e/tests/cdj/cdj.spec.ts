import { test, expect } from '@playwright/test';
import { TEST_USERS } from '../../helper/auth';
import { API_ROUTES } from '@/lib/constants/api';

test.describe('CDJ Page', () => {
  test.beforeEach(async ({ page, context }) => {
    // Configurar el estado de autenticación
    await context.addInitScript(() => {
      window.localStorage.setItem('auth-storage', JSON.stringify({
        state: {
          user: TEST_USERS.ADMIN,
          token: 'mock-token'
        },
        version: 0
      }));
    });

    // Mockear la ruta de organizaciones
    await page.route(`**${API_ROUTES.ORGANIZATIONS.BASE}**`, route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [{
            id: TEST_USERS.ADMIN.organizations[0].id,
            name: 'Consejo Distrital de Juventud',
            acronym: 'CDJ',
            public: true,
            description: 'El Consejo Distrital de Juventud (CDJ) de Santiago de Cali es el máximo órgano de representación juvenil en la ciudad.'
          }],
          total: 1
        }),
      });
    });

    // Mockear la ruta de documentos
    await page.route(`**${API_ROUTES.DOCUMENTS.BY_ORGANIZATION(TEST_USERS.ADMIN.organizations[0].id)}**`, route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'doc-1',
            title: 'Reglamento Interno',
            file_url: 'https://example.com/reglamento.pdf',
            date: '2024-01-01',
            type: {
              id: 'type-1',
              name: 'Reglamento',
              description: 'Documento normativo'
            }
          }
        ]),
      });
    });

    // Mockear la ruta principal de publicaciones
    await page.route(`**${API_ROUTES.PUBLICATIONS.BASE}**`, route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: 'pub-1',
              title: 'Primera Sesión del Año',
              description: 'Sesión inaugural del CDJ para el año 2024',
              content: '<p>El Consejo Distrital de Juventud realizará su primera sesión del año 2024...</p>',
              type: {
                name: 'event',
                description: 'Eventos'
              },
              published_at: '2024-01-01T00:00:00Z',
              published_by: {
                id: 'user-1',
                name: 'Administrador CDJ',
                profilePicture: 'https://example.com/profile.jpg',
                banned: false
              },
              organizers: [
                {
                  id: TEST_USERS.ADMIN.organizations[0].id,
                  name: 'Consejo Distrital de Juventud',
                  acronym: 'CDJ',
                  public: true
                }
              ],
              cities: [
                {
                  id: 'city-1',
                  name: 'Santiago de Cali',
                  departmentId: 76
                }
              ],
              tags: [
                {
                  id: 'tag-1',
                  name: 'Sesión',
                  description: 'Sesiones oficiales del CDJ'
                },
                {
                  id: 'tag-2',
                  name: '2024',
                  description: 'Eventos del año 2024'
                }
              ],
              attachments: [
                {
                  id: 'att-1',
                  name: 'agenda.pdf',
                  format: 'application/pdf',
                  url: 'https://example.com/agenda.pdf'
                }
              ],
              createdAt: '2023-12-15T00:00:00Z',
              event: {
                date: '2024-01-15T14:00:00Z',
                location: 'Sede Principal CDJ, Cali',
                registrationLink: 'https://example.com/registro-sesion'
              }
            },
            {
              id: 'pub-2',
              title: 'Convocatoria para Comités',
              description: 'Abierta convocatoria para participar en los comités del CDJ',
              content: '<p>El CDJ abre convocatoria para jóvenes interesados en participar...</p>',
              type: {
                name: 'news',
                description: 'Noticias'
              },
              published_at: '2024-01-02T00:00:00Z',
              published_by: {
                id: 'user-1',
                name: 'Administrador CDJ',
                profilePicture: 'https://example.com/profile.jpg',
                banned: false
              },
              organizers: [
                {
                  id: TEST_USERS.ADMIN.organizations[0].id,
                  name: 'Consejo Distrital de Juventud',
                  acronym: 'CDJ',
                  public: true
                }
              ],
              cities: [
                {
                  id: 'city-1',
                  name: 'Santiago de Cali',
                  departmentId: 76
                }
              ],
              tags: [
                {
                  id: 'tag-3',
                  name: 'Convocatoria',
                  description: 'Convocatorias y oportunidades'
                }
              ],
              createdAt: '2024-01-02T00:00:00Z',
              news: {
                author: 'Equipo de Comunicaciones CDJ'
              }
            }
          ],
          meta: {
            total: 2,
            page: 1,
            limit: 10
          }
        }),
      });
    });

    // Mockear la ruta de publicaciones guardadas
    await page.route(`**${API_ROUTES.SAVED_POSTS.BASE}**`, route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [],
          total: 0
        }),
      });
    });

    // Debug: Verificar si hay errores en la red
    page.on('requestfailed', request => {
      console.log('Failed request:', request.url(), request.failure()?.errorText);
    });

    // Navegar a la página CDJ
    await page.goto('/cdj', { waitUntil: 'networkidle' });

    // Debug: Verificar que la página se cargó correctamente
    const title = await page.title();
    console.log('Page title:', title);

    // Debug: Verificar la URL actual
    const url = page.url();
    console.log('Current URL:', url);

    // Esperar a que la página esté completamente cargada
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('networkidle');
  });

  test('should load the CDJ page', async ({ page }) => {
    await expect(page).toHaveURL(/.*\/cdj/);
    const title = await page.title();
    expect(title).toBeTruthy();
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
    console.log('Elementos visibles:', elements);
  });

  test('should display CDJ page title and description', async ({ page }) => {
    const headerText = page.getByRole('heading', { name: 'Consejo Distrital de Juventud', exact: true });
    await expect(headerText).toBeVisible();

    const descriptionText = page.getByText(/Representando y defendiendo los intereses de los jóvenes de Santiago de Cali/i);
    await expect(descriptionText).toBeVisible();
  });

  test('should display "Sobre Nosotros" section', async ({ page }) => {
    const aboutTitle = page.getByRole('heading', { name: 'Sobre Nosotros', exact: true });
    await expect(aboutTitle).toBeVisible();

    const whatIsCDJ = page.getByRole('heading', { name: '¿Qué es el CDJ?', exact: true });
    await expect(whatIsCDJ).toBeVisible();

    const description = page.getByText(/El Consejo Distrital de Juventud \(CDJ\) de Santiago de Cali es el máximo órgano/i);
    await expect(description).toBeVisible();
  });

  test('should display documents section', async ({ page }) => {
    const documentsTitle = page.getByRole('heading', { name: 'Documentos', exact: true });
    await expect(documentsTitle).toBeVisible();

    // Usa expresión regular para tolerar diferencias menores en el texto
    const documentTitle = page.getByText(/Reglamento Interno/i);
    await expect(documentTitle).toBeVisible();

    const downloadLink = page.getByRole('link', { name: /Descargar documento/i });
    await expect(downloadLink).toBeVisible();
    await expect(downloadLink).toHaveAttribute('href', 'https://example.com/reglamento.pdf');
  });

  test('should display publications section', async ({ page }) => {
    const publicationsTitle = page.getByRole('heading', { name: 'Publicaciones', exact: true });
    await expect(publicationsTitle).toBeVisible();

    const publicationTitle = page.getByText(/Primera Sesión del Año/i);
    await expect(publicationTitle).toBeVisible();

    const publicationDescription = page.getByText(/Sesión inaugural del CDJ para el año 2024/i);
    await expect(publicationDescription).toBeVisible();
  });

});
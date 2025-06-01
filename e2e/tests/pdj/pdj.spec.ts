import { test, expect } from '@playwright/test';
import { TEST_USERS } from '../../helper/auth';
import { API_ROUTES } from '@/lib/constants/api';

test.describe('PDJ Page', () => {
  test.beforeEach(async ({ page, context }) => {
    // Mock explícito para /organization/:id
    await page.route('**/organization/*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: TEST_USERS.ADMIN.organizations[0].id,
          name: 'Plataforma Distrital de Juventudes',
          acronym: 'PDJ',
          public: true,
          description: 'Trabajando por y para los jóvenes de Santiago de Cali',
          committees: [
            {
              id: 'committee-1',
              name: 'Comité de Comunicaciones',
              description: 'Comité encargado de la comunicación',
              members: [
                {
                  id: 'member-1',
                  name: 'Juan Pérez',
                  role: 'Coordinador'
                }
              ]
            }
          ]
        }),
      });
    });

    // Mock explícito para /document/organization/:id
    await page.route('**/document/organization/*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'doc-1',
            title: 'Plan de Acción 2024',
            file_url: 'https://example.com/plan.pdf',
            date: '2024-01-01',
            type: {
              id: 'type-1',
              name: 'Plan',
              description: 'Plan de trabajo'
            }
          }
        ]),
      });
    });

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

    // Mockear la ruta de organizaciones (por si acaso)
    await page.route(`**${API_ROUTES.ORGANIZATIONS.BASE}**`, route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [{
            id: TEST_USERS.ADMIN.organizations[0].id,
            name: 'Plataforma Distrital de Juventudes',
            acronym: 'PDJ',
            public: true,
            committees: [
              {
                id: 'committee-1',
                name: 'Comité de Comunicaciones',
                description: 'Comité encargado de la comunicación',
                members: [
                  {
                    id: 'member-1',
                    name: 'Juan Pérez',
                    role: 'Coordinador'
                  }
                ]
              }
            ]
          }],
          total: 1
        }),
      });
    });

    // Mockear la ruta de documentos (por si acaso)
    await page.route(`**${API_ROUTES.DOCUMENTS.BY_ORGANIZATION(TEST_USERS.ADMIN.organizations[0].id)}**`, route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'doc-1',
            title: 'Plan de Acción 2024',
            file_url: 'https://example.com/plan.pdf',
            date: '2024-01-01',
            type: {
              id: 'type-1',
              name: 'Plan',
              description: 'Plan de trabajo'
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
              title: 'Convocatoria Comités PDJ',
              description: 'Participa en los comités de la Plataforma Distrital de Juventudes',
              content: '<p>La PDJ abre convocatoria para participar en sus comités temáticos...</p>',
              type: {
                name: 'event',
                description: 'Eventos'
              },
              published_at: '2024-01-01T00:00:00Z',
              published_by: {
                id: 'user-1',
                name: 'Administrador PDJ',
                profilePicture: 'https://example.com/profile.jpg',
                banned: false
              },
              organizers: [
                {
                  id: TEST_USERS.ADMIN.organizations[0].id,
                  name: 'Plataforma Distrital de Juventudes',
                  acronym: 'PDJ',
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
                  name: 'Comités',
                  description: 'Comités de trabajo PDJ'
                },
                {
                  id: 'tag-2',
                  name: 'Participación',
                  description: 'Oportunidades de participación'
                }
              ],
              attachments: [
                {
                  id: 'att-1',
                  name: 'convocatoria.pdf',
                  format: 'application/pdf',
                  url: 'https://example.com/convocatoria.pdf'
                }
              ],
              createdAt: '2023-12-15T00:00:00Z',
              event: {
                date: '2024-01-15T14:00:00Z',
                location: 'Sede Principal PDJ, Cali',
                registrationLink: 'https://example.com/registro-comites'
              }
            }
          ],
          meta: {
            total: 1,
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

    // Navegar a la página PDJ
    await page.goto('/pdj', { waitUntil: 'networkidle' });
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('networkidle');
  });

  test('should load the PDJ page', async ({ page }) => {
    await expect(page).toHaveURL(/.*\/pdj/);
    const title = await page.title();
    expect(title).toBeTruthy();
    const body = await page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should display PDJ page title and description', async ({ page }) => {
    const headerText = page.getByRole('heading', { name: 'Plataforma Distrital de Juventudes', exact: true });
    await expect(headerText).toBeVisible();

    const descriptionText = page.getByText('Trabajando por y para los jóvenes de Santiago de Cali');
    await expect(descriptionText).toBeVisible();
  });

  test('should display committees section', async ({ page }) => {
    const committeesTitle = page.getByRole('heading', { name: 'Nuestros Comités', exact: true });
    await expect(committeesTitle).toBeVisible();

    const committeeCard = page.getByText('Comité de Comunicaciones');
    await expect(committeeCard).toBeVisible();

    const memberName = page.getByText('Juan Pérez');
    await expect(memberName).toBeVisible();
  });

  test('should display documents section', async ({ page }) => {
    const documentsTitle = page.getByRole('heading', { name: 'Documentos', exact: true });
    await expect(documentsTitle).toBeVisible();

    const documentTitle = page.getByText('Plan de Acción 2024');
    await expect(documentTitle).toBeVisible();
    
    const downloadLink = page.getByRole('link', { name: 'Descargar documento' });
    await expect(downloadLink).toBeVisible();
    await expect(downloadLink).toHaveAttribute('href', 'https://example.com/plan.pdf');
  });

});
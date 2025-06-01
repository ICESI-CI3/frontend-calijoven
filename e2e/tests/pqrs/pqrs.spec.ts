import { test, expect } from '@playwright/test';

// Aumentar timeout global para todos los tests en este archivo
test.setTimeout(60000);

test.describe('PQRS - Usuario Normal', () => {
  test.beforeEach(async ({ page }) => {
    // Debug: Agregar listeners para peticiones y respuestas
    page.on('request', request => {
      console.log('🌐 Request:', request.url(), request.method());
    });
    page.on('response', async response => {
      console.log('📥 Response:', response.url(), response.status());
      if (response.status() !== 200) {
        console.log('Response error:', await response.text());
      }
    });
    page.on('console', msg => {
      console.log('🌍 Browser console:', msg.text());
    });

    // Mock de autenticación
    await page.route('**/auth/login', route => {
      console.log('🔐 Interceptando auth/login');
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            id: 1,
            name: 'Test User',
            email: 'test@example.com',
            roles: ['USER']
          },
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IlRlc3QgVXNlciIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsInJvbGVzIjpbIlVTRVIiXX0.test-token'
        })
      });
    });

    await page.route('**/auth/me', route => {
      console.log('🔐 Interceptando auth/me');
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
          roles: ['USER']
        })
      });
    });

    // Asegurarse de que la sesión se mantenga activa
    await page.route('**/api/auth/session', route => {
      console.log('🔐 Interceptando api/auth/session');
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            id: 1,
            name: 'Test User',
            email: 'test@example.com',
            roles: ['USER']
          },
          valid: true,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        })
      });
    });

    // Mock de tipos de PQRS
    await page.route('**/typesPqrs**', route => {
      console.log('📋 Interceptando typesPqrs');
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: '1', name: 'Petición' },
          { id: '2', name: 'Queja' },
          { id: '3', name: 'Reclamo' },
          { id: '4', name: 'Sugerencia' }
        ])
      });
    });

    // Mock de estados de PQRS
    await page.route('**/types**', route => {
      console.log('📋 Interceptando types');
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 'pending', description: 'Pendiente' },
          { id: 'in_progress', description: 'En Proceso' },
          { id: 'resolved', description: 'Resuelto' }
        ])
      });
    });

    // Mock de listado de PQRS
    await page.route('**/pqrs**', route => {
      const url = route.request().url();
      const method = route.request().method();
      console.log('📋 Interceptando pqrs:', method, url);

      // Si es una petición GET con filtros
      if (method === 'GET' && url.includes('?')) {
        const params = new URLSearchParams(url.split('?')[1]);
        const typeId = params.get('typeId');

        if (typeId === '2') {
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              items: [
                {
                  id: '3',
                  title: 'Una queja',
                  description: 'Descripción de la queja',
                  typeId: '2',
                  type: { id: '2', name: 'Queja' },
                  status: { description: 'Pendiente' },
                  createdAt: '2024-01-02T00:00:00Z'
                }
              ],
              total: 1,
              page: 1,
              limit: 10,
              totalPages: 1
            })
          });
          return;
        }
      }

      // Para peticiones GET normales
      if (method === 'GET') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            items: [
              {
                id: '1',
                title: 'Mi primera PQRS',
                description: 'Descripción de la PQRS',
                typeId: '1',
                type: { id: '1', name: 'Petición' },
                status: { description: 'Pendiente' },
                createdAt: '2024-01-01T00:00:00Z'
              }
            ],
            total: 1,
            page: 1,
            limit: 10,
            totalPages: 1
          })
        });
      }

      // Para peticiones POST
      if (method === 'POST') {
        route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            id: '2',
            title: 'Nueva PQRS',
            description: 'Descripción de prueba',
            typeId: '1',
            type: { id: '1', name: 'Petición' },
            status: { description: 'Pendiente' },
            createdAt: new Date().toISOString()
          })
        });
      }
    });

    // Iniciar sesión
    console.log('🚀 Iniciando proceso de login');
    await page.goto('/login');

    console.log('📄 HTML actual (pre-login):', await page.content());
    
    await page.waitForSelector('input[type="email"]');
    await page.waitForSelector('input[type="password"]');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.waitForSelector('button[type="submit"]');
    await page.click('button[type="submit"]');

    // Esperar a que la navegación se complete
    console.log('⏳ Esperando redirección post-login...');
    
    // Primero esperar a que el login se procese
    await page.waitForResponse(response => 
      response.url().includes('/auth/login') && response.status() === 200
    );

    // Luego esperar a que la redirección se complete
    await Promise.race([
      page.waitForURL('**/mi-espacio/pqrs'),
      page.waitForURL('**/mi-espacio'),
      page.waitForURL('/'),
      page.waitForTimeout(5000) // Timeout de seguridad
    ]);

    // Navegar explícitamente a la página de PQRS
    await page.goto('/mi-espacio/pqrs');
    
    // Esperar a que la página esté completamente cargada
    await page.waitForLoadState('networkidle');
    console.log('📍 URL después de login:', page.url());
    console.log('✅ Carga inicial completada');
  });

  test('debe mostrar la página principal de PQRS', async ({ page }) => {
    console.log('🧪 Test: debe mostrar la página principal de PQRS');
    await page.goto('/mi-espacio/pqrs');
    await page.waitForLoadState('networkidle');
    console.log('📍 URL actual:', page.url());
    console.log('📄 HTML actual:', await page.content());

    // Verificar elementos de la página con timeouts aumentados
    await expect(page.getByRole('heading', { name: /mis pqrs/i })).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/gestiona tus peticiones/i)).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole('button', { name: /crear nueva pqrs/i })).toBeVisible({ timeout: 15000 });
  });

  test('debe mostrar y usar el modal de creación de PQRS', async ({ page }) => {
    console.log('🧪 Test: debe mostrar y usar el modal de creación de PQRS');
    await page.goto('/mi-espacio/pqrs');
    await page.waitForLoadState('networkidle');
    console.log('📍 URL actual:', page.url());
    console.log('📄 HTML actual:', await page.content());

    // Abrir el modal
    const botonCrear = page.getByRole('button', { name: /crear nueva pqrs/i });
    await expect(botonCrear).toBeVisible({ timeout: 15000 });
    await botonCrear.click();
    
    // Verificar elementos del modal
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole('heading', { name: /crear nueva pqrs/i })).toBeVisible({ timeout: 15000 });

    // Llenar y enviar el formulario
    await page.fill('input[name="title"]', 'Nueva PQRS');
    await page.fill('textarea[name="description"]', 'Descripción de prueba');
    await page.selectOption('select', { label: 'Petición' });
    await page.click('button[type="submit"]');

    // Verificar resultado
    await expect(page.getByText(/pqrs creada exitosamente/i)).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 15000 });
  });

  test('debe mostrar el listado de PQRS del usuario', async ({ page }) => {
    console.log('🧪 Test: debe mostrar el listado de PQRS del usuario');
    await page.goto('/mi-espacio/pqrs');
    await page.waitForLoadState('networkidle');
    console.log('📍 URL actual:', page.url());
    console.log('📄 HTML actual:', await page.content());

    // Verificar que se muestra el listado
    await expect(page.getByText(/mi primera pqrs/i)).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/descripción de la pqrs/i)).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/petición/i)).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/pendiente/i)).toBeVisible({ timeout: 15000 });
  });

  test('debe mostrar mensaje cuando no hay PQRS', async ({ page }) => {
    console.log('🧪 Test: debe mostrar mensaje cuando no hay PQRS');
    // Mock de listado vacío
    await page.route('**/pqrs**', route => {
      if (route.request().method() === 'GET') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            items: [],
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 0
          })
        });
      }
    });

    await page.goto('/mi-espacio/pqrs');
    await page.waitForLoadState('networkidle');
    console.log('📍 URL actual:', page.url());
    console.log('📄 HTML actual:', await page.content());

    // Verificar mensaje de no hay PQRS
    await expect(page.getByText(/no hay pqrs registradas/i)).toBeVisible({ timeout: 15000 });
  });
});


  
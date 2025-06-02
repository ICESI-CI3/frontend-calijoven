import { test, expect } from '@playwright/test';
import { TEST_USERS, generateStorageState } from '../../helper/auth';
import { API_ROUTES } from '@/lib/constants/api';
import { ROUTES } from '@/lib/constants/routes';
import { buildApiRegex, waitForPageReady } from '../../helper/util';

// Configurar el estado de autenticación para todas las pruebas
test.use({ storageState: generateStorageState({
  ...TEST_USERS.USER,
  roles: [...TEST_USERS.USER.roles, 'ROLE_USER']
})});

test.describe('PQRS', () => {
  test('debe mostrar la lista de PQRS y permitir crear una nueva', async ({ page }) => {
    // --- LOGS DE ERRORES DE CONSOLA Y RED ---
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      if (type === 'error') {
        console.error('🔴 ERROR EN CONSOLA:', text);
      } else if (type === 'warning') {
        console.warn('🟡 ADVERTENCIA EN CONSOLA:', text);
      } else {
        console.log(`🔵 LOG (${type}):`, text);
      }
    });

    page.on('pageerror', error => {
      console.error('🔴 ERROR EN PÁGINA:', error);
    });

    page.on('requestfailed', request => {
      console.error('🔴 FALLO DE PETICIÓN:', {
        url: request.url(),
        failure: request.failure(),
        headers: request.headers(),
        method: request.method()
      });
    });

    // Log de peticiones de red
    page.on('request', request => {
      console.log('📡 PETICIÓN:', {
        url: request.url(),
        method: request.method(),
        headers: request.headers()
      });
    });

    page.on('response', response => {
      console.log('📥 RESPUESTA:', {
        url: response.url(),
        status: response.status(),
        headers: response.headers()
      });
    });

    // Mock de tipos de PQRS
    const mockPQRSTypes = [
      { id: 'type-1', name: 'Petición' },
      { id: 'type-2', name: 'Queja' },
      { id: 'type-3', name: 'Reclamo' }
    ];

    // Mock de estados de PQRS
    const mockPQRSStatus = [
      { name: 'pending', description: 'Pendiente' },
      { name: 'in_progress', description: 'En Proceso' },
      { name: 'resolved', description: 'Resuelto' }
    ];

    // Estado simulado de la lista de PQRS
    const pqrsList = {
      items: [
        {
          id: 'pqrs-1',
          title: 'Mi primera PQRS',
          description: 'Descripción de la PQRS',
          type: mockPQRSTypes[0],
          typeId: mockPQRSTypes[0].id,
          status: mockPQRSStatus[0],
          priority: 'medium',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          userId: TEST_USERS.USER.id,
          user: {
            id: TEST_USERS.USER.id,
            name: TEST_USERS.USER.name,
            profilePicture: TEST_USERS.USER.profilePicture,
            banned: TEST_USERS.USER.banned
          }
        }
      ],
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1
    };

    // Mock de tipos de PQRS
    await page.route(buildApiRegex(API_ROUTES.PQRS.TYPES), route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockPQRSTypes)
      });
    });

    // Mock de estados de PQRS
    await page.route(buildApiRegex('/pqrs/status'), route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockPQRSStatus)
      });
    });

    // Mock de estado específico de PQRS
    await page.route(buildApiRegex('/pqrs/status/*'), route => {
      const statusName = route.request().url().split('/').pop();
      const status = mockPQRSStatus.find(s => s.name === statusName);
      if (status) {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(status)
        });
      } else {
        route.fulfill({ status: 404 });
      }
    });

    // Mock de usuario autenticado
    await page.route(buildApiRegex(API_ROUTES.AUTH.ME), route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ...TEST_USERS.USER,
          roles: [...TEST_USERS.USER.roles, 'ROLE_USER']
        })
      });
    });

    // Mock de preferencias de notificación
    await page.route(buildApiRegex(API_ROUTES.USER.NOTIFICATION_PREFERENCES), route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          email: true,
          push: true,
          pqrs: true
        })
      });
    });

    // Mock de tipo específico de PQRS
    await page.route(buildApiRegex('/pqrs/types/*'), route => {
      const typeId = route.request().url().split('/').pop();
      const type = mockPQRSTypes.find(t => t.id === typeId);
      if (type) {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(type)
        });
      } else {
        route.fulfill({ status: 404 });
      }
    });

    // Mock combinado para GET y POST de la lista de PQRS
    await page.route(buildApiRegex(API_ROUTES.PQRS.BASE), async route => {
      const method = route.request().method();
      if (method === 'GET') {
        const url = route.request().url();
        const params = new URLSearchParams(url.split('?')[1]);
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            ...pqrsList,
            page: Number(params.get('page')) || 1,
            limit: Number(params.get('limit')) || 10
          })
        });
      } else if (method === 'POST') {
        const requestBody = JSON.parse(await route.request().postData() || '{}');
        const selectedType = mockPQRSTypes.find(t => t.id === requestBody.typeId) || mockPQRSTypes[0];
        const newPQRS = {
          id: 'new-pqrs-1',
          title: requestBody.title,
          description: requestBody.description,
          type: selectedType,
          typeId: requestBody.typeId,
          status: mockPQRSStatus[0], // pending
          priority: requestBody.priority || 'medium',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: TEST_USERS.USER.id,
          user: {
            id: TEST_USERS.USER.id,
            name: TEST_USERS.USER.name,
            profilePicture: TEST_USERS.USER.profilePicture,
            banned: TEST_USERS.USER.banned
          }
        };
        pqrsList.items.push(newPQRS);
        pqrsList.total += 1;
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(newPQRS)
        });
      }
    });

    // Navegar a la página de PQRS
    console.log('🚀 Navegando a la página de PQRS...');
    await page.goto(ROUTES.MY_SPACE.PQRS.PATH);
    await waitForPageReady(page);
    console.log('✅ Página cargada');

    // Verificar que se muestra el título principal
    console.log('🔍 Buscando título principal...');
    const title = page.getByRole('heading', { name: /mis pqrs/i });
    await expect(title).toBeVisible();
    console.log('✅ Título principal visible');

    // Verificar que se muestra la PQRS existente
    console.log('🔍 Buscando PQRS existente...');
    const existingPQRS = page.getByText('Mi primera PQRS');
    await expect(existingPQRS).toBeVisible();
    console.log('✅ PQRS existente visible');

    // Abrir el modal de creación
    console.log('🔍 Buscando botón de crear...');
    const createButton = page.getByRole('button', { name: /crear nueva pqrs/i });
    await expect(createButton).toBeVisible();
    console.log('✅ Botón de crear visible');
    console.log('🖱️ Haciendo clic en botón de crear...');
    await createButton.click();
    console.log('✅ Clic realizado');

    // Esperar a que el modal y su overlay estén presentes
    console.log('🔍 Buscando elementos del modal...');
    const modalOverlay = page.locator('[id^="headlessui-dialog-overlay"]');
    const modalPanel = page.locator('[id^="headlessui-dialog-panel"]');
    
    // Verificar estado inicial del modal
    const isOverlayVisible = await modalOverlay.isVisible();
    const isPanelVisible = await modalPanel.isVisible();
    console.log('📊 Estado inicial del modal:', {
      overlay: {
        visible: isOverlayVisible,
        count: await modalOverlay.count(),
        html: isOverlayVisible ? await modalOverlay.innerHTML() : 'no visible'
      },
      panel: {
        visible: isPanelVisible,
        count: await modalPanel.count(),
        html: isPanelVisible ? await modalPanel.innerHTML() : 'no visible'
      }
    });
    
    // Esperar a que el panel esté visible
    console.log('⏳ Esperando visibilidad del modal...');
    await expect(modalPanel).toBeVisible({ timeout: 10000 });
    console.log('✅ Modal visible');

    // Esperar a que el título del modal sea visible
    console.log('🔍 Buscando título del modal...');
    const modalTitle = page.getByRole('heading', { name: /crear nueva pqrs/i, level: 2 });
    await expect(modalTitle).toBeVisible({ timeout: 10000 });
    console.log('✅ Título del modal visible');

    // Esperar y verificar que el formulario y sus campos estén visibles
    console.log('🔍 Buscando campos del formulario...');
    const tituloInput = page.getByRole('textbox', { name: /título/i });
    let descripcionInput;
    try {
      console.log('🔍 Intentando encontrar descripción por role...');
      descripcionInput = page.getByRole('textbox', { name: /descrip/i });
      await expect(descripcionInput).toBeVisible({ timeout: 10000 });
      console.log('✅ Campo descripción encontrado por role');
    } catch (error) {
      console.log('⚠️ No se encontró descripción por role, intentando por placeholder...');
      descripcionInput = page.getByPlaceholder(/descrip/i);
      await expect(descripcionInput).toBeVisible({ timeout: 10000 });
      console.log('✅ Campo descripción encontrado por placeholder');
    }

    // Interactuar con el campo "Tipo" (HeadlessUI Listbox)
    console.log('🔍 Buscando botón de tipo...');
    const tipoLabel = modalPanel.getByText('Tipo');
    const tipoButton = tipoLabel.locator('..').locator('button');
    await expect(tipoButton).toBeVisible({ timeout: 10000 });
    await tipoButton.click();
    console.log('✅ Botón de tipo abierto');

    // Seleccionar la opción "Petición"
    const opcionPeticion = page.getByRole('option', { name: /petición/i });
    await expect(opcionPeticion).toBeVisible({ timeout: 10000 });
    await opcionPeticion.click();
    console.log('✅ Opción "Petición" seleccionada');

    // Esperar a que todos los campos estén visibles
    console.log('⏳ Verificando visibilidad final de todos los campos...');
    await Promise.all([
      expect(tituloInput).toBeVisible({ timeout: 10000 }),
      expect(descripcionInput).toBeVisible({ timeout: 10000 }),
      expect(tipoButton).toBeVisible({ timeout: 10000 })
    ]);
    console.log('✅ Todos los campos están visibles');

    // Rellenar el formulario
    console.log('✏️ Rellenando formulario...');
    await tituloInput.fill('Nueva PQRS de prueba');
    await descripcionInput.fill('Esta es una PQRS de prueba');
    // El tipo ya fue seleccionado arriba
    console.log('✅ Formulario rellenado');

    // Enviar el formulario
    const submitButton = page.getByRole('button', { name: /enviar/i });
    await expect(submitButton).toBeVisible({ timeout: 10000 });
    await submitButton.click();

    // Verificar que se cerró el modal
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 10000 });
  });

   test('debe mostrar la lista de PQRS', async ({ page }) => {
    // Mock de tipos de PQRS
    const mockPQRSTypes = [
      { id: 'type-1', name: 'Petición' },
      { id: 'type-2', name: 'Queja' },
      { id: 'type-3', name: 'Reclamo' }
    ];

    // Mock de estados de PQRS
    const mockPQRSStatus = [
      { name: 'pending', description: 'Pendiente' },
      { name: 'in_progress', description: 'En Proceso' },
      { name: 'resolved', description: 'Resuelto' }
    ];

    // Estado simulado de la lista de PQRS
    const pqrsList = {
      items: [
        {
          id: 'pqrs-1',
          title: 'Mi primera PQRS',
          description: 'Descripción de la PQRS',
          type: mockPQRSTypes[0],
          typeId: mockPQRSTypes[0].id,
          status: mockPQRSStatus[0],
          priority: 'medium',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          userId: TEST_USERS.USER.id,
          user: {
            id: TEST_USERS.USER.id,
            name: TEST_USERS.USER.name,
            profilePicture: TEST_USERS.USER.profilePicture,
            banned: TEST_USERS.USER.banned
          }
        }
      ],
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1
    };

    // Mocks de red
    await page.route(buildApiRegex(API_ROUTES.PQRS.TYPES), route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockPQRSTypes)
      });
    });

    await page.route(buildApiRegex('/pqrs/status'), route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockPQRSStatus)
      });
    });

    await page.route(buildApiRegex(API_ROUTES.AUTH.ME), route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ...TEST_USERS.USER,
          roles: [...TEST_USERS.USER.roles, 'ROLE_USER']
        })
      });
    });

    await page.route(buildApiRegex(API_ROUTES.PQRS.BASE), async route => {
      const method = route.request().method();
      if (method === 'GET') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(pqrsList)
        });
      }
    });

    // Navegar a la página de PQRS
    await page.goto(ROUTES.MY_SPACE.PQRS.PATH);
    await waitForPageReady(page);

    // Verificar que se muestra el título principal
    const title = page.getByRole('heading', { name: /mis pqrs/i });
    await expect(title).toBeVisible();

    // Verificar que se muestra la PQRS existente
    const existingPQRS = page.getByText('Mi primera PQRS');
    await expect(existingPQRS).toBeVisible();

    // Verificar que se muestra la descripción
    const pqrsDescription = page.getByText('Descripción de la PQRS');
    await expect(pqrsDescription).toBeVisible();
  });
});
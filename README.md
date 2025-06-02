[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/vUZkoXSC)

# Cali Joven - Portal de la Alcaldía de Cali para Jóvenes

## Índice

1. [Descripción](#descripción)
2. [Características](#características)
3. [Tecnologías](#tecnologías)
4. [Instalación](#instalación)
5. [Desarrollo Local](#desarrollo-local)
6. [Despliegue](#despliegue)
7. [Autenticación y Autorización](#autenticación-y-autorización)
8. [Gestión del Estado](#gestión-del-estado)
9. [Testing](#testing)
10. [Integrantes](#integrantes)

## Descripción

Cali Joven es una plataforma web desarrollada para el Consejo Distrital de Juventudes (CDJ) y la Plataforma Distrital de Juventudes (PDJ), diseñada específicamente para conectar a los jóvenes de la ciudad con oportunidades, eventos, noticias y recursos relevantes. La plataforma sirve como un punto central para que los jóvenes accedan a información sobre programas gubernamentales, eventos culturales, oportunidades educativas y laborales.

## Características

- Sistema de autenticación y autorización robusto
- Gestión de publicaciones (eventos, noticias, ofertas)
- Sistema de PQRS (Peticiones, Quejas, Reclamos y Sugerencias)
- Panel de administración para gestión de contenido
- Sistema de registro a eventos
- Gestión de organizaciones
- Sistema de banners promocionales
- Interfaz responsive y moderna

## Tecnologías

- **Frontend**: Next.js 15.3.2
- **UI**: React 19, TailwindCSS
- **Estado**: Zustand, React Query
- **Formularios**: React Hook Form, Zod
- **Testing**: Jest, Playwright
- **Iconos**: Heroicons
- **Componentes UI**: Headless UI

## Instalación

### Prerrequisitos

- Node.js (versión LTS recomendada)
- Yarn
- Git

### Pasos de instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/ICESI-CI3/frontend-calijoven
cd frontend-calijoven
```

2. Instalar dependencias:

```bash
yarn install
```

3. Configurar variables de entorno:

```bash
.env
```

Editar `.env` con las variables necesarias.

## Desarrollo Local

1. Iniciar el servidor de desarrollo:

```bash
yarn dev
```

2. Ejecutar tests:

```bash
# Tests unitarios
yarn test:unit

# Tests e2e
yarn test:e2e

# Todos los tests
yarn test
```

3. Linting y formateo:

```bash
# Linting
yarn lint

# Formateo
yarn format
```

## Despliegue

La aplicación está desplegada en [URL_DEL_DEPLOY]

Para construir la aplicación para producción:

```bash
yarn build
```

Para iniciar la versión de producción:

```bash
yarn start
```

## Autenticación y Autorización

La plataforma implementa un sistema de autenticación y autorización robusto que garantiza la seguridad de los datos y el acceso controlado a las diferentes funcionalidades. El sistema está diseñado para manejar múltiples roles de usuario (administradores, organizaciones, usuarios regulares) y proteger las rutas y recursos según los permisos de cada usuario.

### Implementación

El sistema de autenticación y autorización está implementado con un enfoque robusto y seguro:

#### Autenticación

- **JWT (JSON Web Tokens)**:

  - Implementación de tokens JWT para la gestión de sesiones
  - Validación automática de tokens mediante el servicio `tokenService`
  - Extracción y validación del payload del token para obtener roles y permisos
  - Manejo de expiración de tokens con validación periódica
- **Gestión de Sesión**:

  - Persistencia de sesión mediante Zustand con almacenamiento en localStorage
  - Sincronización de estado entre pestañas del navegador
  - Manejo de hidratación del estado para evitar problemas de SSR
  - Validación automática de tokens cada 5 minutos y al recuperar el foco de la ventana

#### Autorización

- **Sistema de Roles y Permisos**:

  - Implementación de roles basados en el payload del token JWT
  - Componente `RequireAuth` para protección de rutas basada en permisos
  - Validación de permisos mediante funciones utilitarias (`hasAnyPermission`, `hasAllPermissions`)
  - Guardia global de autenticación (`GlobalAuthGuard`) para protección de rutas
- **Protección de Rutas**:

  - Clasificación de rutas en públicas, autenticadas y administrativas
  - Redirección automática basada en el estado de autenticación
  - Manejo de URLs de callback para redirección post-autenticación
  - Validación de permisos específicos para rutas administrativas

### Características de Seguridad

- **Validación de Tokens**:

  - Verificación automática de la validez del token
  - Manejo de expiración de sesión
  - Limpieza automática de tokens inválidos
  - Sincronización de estado entre pestañas
- **Protección de Datos**:

  - Sanitización de inputs mediante Zod
  - Validación de formularios con React Hook Form
  - Manejo seguro de credenciales sin almacenamiento en estado global

## Gestión del Estado

La gestión del estado se diseñó pensando en la escalabilidad y el rendimiento de la aplicación. Se utilizó una combinación de Zustand para el estado global de la aplicación (principalmente autenticación y preferencias de usuario) y React Query para la gestión del estado del servidor (datos de publicaciones, PQRS, organizaciones, etc.). Esta arquitectura permite una separación clara de responsabilidades y un manejo eficiente de los datos.

### Zustand

La gestión del estado se implementó utilizando Zustand como solución principal:

#### Store de Autenticación

```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isHydrated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  setHydrated: (state: boolean) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
  getStoredToken: () => string | null;
}
```

#### Características del Store

- **Persistencia**:

  - Almacenamiento en localStorage mediante middleware de persistencia
  - Sincronización automática entre pestañas
  - Manejo de hidratación para SSR
  - Limpieza automática de estado inválido
- **Sincronización**:

  - Detección de cambios en localStorage entre pestañas
  - Actualización automática del estado
  - Manejo de eventos de almacenamiento
  - Recuperación de estado en nuevas pestañas

### React Query

Implementación de React Query para la gestión de estado del servidor:

#### Características

- **Caché y Revalidación**:

  - Caché automático de respuestas de API
  - Revalidación basada en tiempo y eventos
  - Invalidación selectiva de queries
  - Prefetching de datos para mejor UX
- **Manejo de Estado**:

  - Estados de carga y error integrados
  - Retry automático en fallos
  - Optimistic updates para mejor UX
  - Deduplicación de requests

#### Implementación en Módulos

- **Publicaciones**:

  ```typescript
  const { data, isLoading } = useQuery({
    queryKey: ['publications', filters, page],
    queryFn: () => PublicationService.getPublications(filters, page)
  });
  ```
- **PQRS**:

  ```typescript
  const { mutate } = useMutation({
    mutationFn: (data) => PQRSService.updatePQRS(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['pqrs'])
    }
  });
  ```
- **Organizaciones**:

  ```typescript
  const { data: organizations } = useQuery({
    queryKey: ['organizations'],
    queryFn: () => OrganizationService.getOrganizations()
  });
  ```

## Testing

La plataforma implementa una estrategia de testing integral que cubre tanto pruebas unitarias como end-to-end. Esta estrategia asegura la calidad del código y la funcionalidad de la aplicación en todos sus niveles.

### Tests Unitarios

Los tests unitarios se implementaron utilizando Jest como framework principal. Estos tests se enfocan en validar el comportamiento individual de componentes, hooks y servicios de la aplicación. Se desarrollaron tests exhaustivos para:

- **Componentes React**: Validación de renderizado, manejo de props, estados y eventos
- **Hooks Personalizados**: Pruebas de lógica de negocio, manejo de estado y efectos secundarios
- **Servicios**: Verificación de llamadas a API, manejo de errores y transformación de datos
- **Utilidades**: Tests de funciones auxiliares y helpers

Se utilizaron mocks extensivos para simular llamadas a API y dependencias externas, permitiendo probar los componentes de forma aislada. La cobertura de tests incluye casos de éxito, manejo de errores y edge cases.

### Tests E2E

Los tests end-to-end se implementaron con Playwright, permitiendo simular interacciones reales de usuario en un entorno de navegador. Estos tests validan flujos completos de la aplicación, incluyendo:

- **Flujos de Autenticación**: Registro, inicio de sesión
- **Gestión de Publicaciones**: Creación, edición, eliminación y visualización
- **Sistema PQRS**: Envío, seguimiento y gestión de peticiones
- **Panel Administrativo**: Funcionalidades de gestión y administración.

### Cobertura de Tests

- Tests unitarios: [PORCENTAJE]% de cobertura
- Tests e2e: [NÚMERO] de escenarios principales

## Integrantes

- Maria Alejandra Mantilla Coral
- Andrés David Parra García
- Silem Nabib Villa Contreras
- Gerson Hurtado Borja

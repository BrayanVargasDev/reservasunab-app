# Sistema de Control de Permisos

## Resumen

Se ha implementado un sistema completo de control de permisos que verifica si los usuarios tienen acceso a las rutas de la aplicación basándose en sus permisos configurados en el backend.

## Archivos Implementados

### 1. **PermissionsGuard** (`src/app/shared/guards/permissions-simple.guard.ts`)

Guard que se ejecuta antes de navegar a cualquier ruta protegida y verifica si el usuario tiene permisos para acceder.

**Funcionalidades:**
- Verifica permisos basados en las pantallas configuradas
- Redirige a `/acceso-denegado` si no tiene permisos
- Permite acceso completo a administradores
- Maneja casos donde las pantallas aún no se han cargado

### 2. **PermissionService** (`src/app/shared/services/permission.service.ts`)

Servicio centralizado para manejar toda la lógica de permisos.

**Métodos principales:**
- `puedeAccederARuta(ruta: string): boolean` - Verifica si puede acceder a una ruta específica
- `tienePermiso(codigo: string): boolean` - Verifica si tiene un permiso específico por código
- `obtenerPantallasAccesibles(): Pantalla[]` - Retorna todas las pantallas a las que el usuario tiene acceso

### 3. **Actualización de NavigationService**

Se simplificó el NavigationService para usar el nuevo PermissionService, centralizando la lógica de obtención de pantallas disponibles.

### 4. **Actualización de Componentes de Menú**

Se actualizaron `SideMenuComponent` y `MobileDrawerComponent` para usar el PermissionService en lugar de duplicar la lógica de permisos.

## Configuración de Rutas

Todas las rutas protegidas ahora incluyen el `PermissionsGuard`:

```typescript
{
  path: 'usuarios',
  loadChildren: () => import('@usuarios/usuarios.routes').then(m => m.usuariosRoutes),
  canActivate: [AuthGuard, PermissionsGuard],
},
```

## Flujo de Funcionamiento

1. **Autenticación**: El usuario se autentica y el `AuthGuard` verifica que esté logueado
2. **Verificación de Permisos**: El `PermissionsGuard` verifica si el usuario tiene permisos para la ruta
3. **Búsqueda de Pantalla**: Se busca una pantalla que corresponda a la ruta solicitada
4. **Validación**: Se verifica si el usuario tiene permisos para esa pantalla específica
5. **Redirección**: Si no tiene permisos, se redirige a `/acceso-denegado`

## Lógica de Búsqueda de Pantallas

El sistema busca pantallas de dos maneras:
1. **Coincidencia exacta**: Busca una pantalla cuya ruta sea exactamente igual a la ruta solicitada
2. **Coincidencia por prefijo**: Para rutas anidadas, busca pantallas cuya ruta sea un prefijo de la ruta solicitada

## Casos Especiales

### Administradores
Los usuarios con rol "Administrador" tienen acceso completo a todas las rutas sin verificaciones adicionales.

### Rutas sin Pantalla Correspondiente
Si no se encuentra una pantalla que corresponda a la ruta, se permite el acceso (por ejemplo, rutas como `/dashboard` que no requieren permisos específicos).

### Pantallas No Cargadas
Si las pantallas aún no se han cargado desde el backend, se permite el acceso temporalmente para evitar bloqueos.

## Página de Acceso Denegado

Ya existía una página de acceso denegado (`AccessDeniedPage`) en `/acceso-denegado` que se muestra cuando un usuario intenta acceder a una ruta sin permisos.

## Debugging

El guard incluye logging para facilitar el debugging:
```javascript
console.warn(`Acceso denegado a la ruta: ${rutaActual}`);
```

## Ejemplo de Uso

```typescript
// En un componente, verificar si puede acceder a una ruta
constructor(private permissionService: PermissionService) {}

verificarAcceso() {
  const puedeAcceder = this.permissionService.puedeAccederARuta('/usuarios');
  console.log('Puede acceder a usuarios:', puedeAcceder);
}

// Verificar un permiso específico por código
const tienePermisoCrear = this.permissionService.tienePermiso('USR000001');
```

## Integración con el Sistema Existente

La implementación se integra perfectamente con:
- El sistema de autenticación existente (`AuthService`)
- El manejo de pantallas del `AppService`
- Los componentes de menú existentes
- La estructura de permisos del backend

## Beneficios

1. **Seguridad**: Previene acceso no autorizado a rutas
2. **Centralización**: Toda la lógica de permisos está centralizada
3. **Mantenibilidad**: Fácil de mantener y extender
4. **Integración**: Se integra sin romper funcionalidad existente
5. **Flexibilidad**: Maneja diferentes tipos de usuarios y escenarios

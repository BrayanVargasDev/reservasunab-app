# Breadcrumbs Component - Guía de Uso

## Características

✅ **Angular 20** con signals y nuevas APIs  
✅ **DaisyUI + Tailwind** para estilos  
✅ **Navegación automática** basada en rutas  
✅ **Accesibilidad** completa (ARIA labels)  
✅ **Responsive** y con animaciones  
✅ **TypeScript** fuertemente tipado

## Uso Básico

Simplemente incluye el componente en tu template:

```html
<app-breadcrumbs></app-breadcrumbs>
```

## Configuración de Rutas

Para que los breadcrumbs funcionen correctamente, configura tus rutas con datos de breadcrumb:

### Ejemplo de configuración de rutas:

```typescript
// app.routes.ts o módulo de rutas
export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: { breadcrumb: 'Dashboard' },
  },
  {
    path: 'espacios',
    data: { breadcrumb: 'Espacios' },
    children: [
      {
        path: '',
        component: EspaciosListComponent,
        data: { breadcrumb: 'Lista' },
      },
      {
        path: ':id',
        data: { breadcrumb: 'Detalle' },
        children: [
          {
            path: 'configuracion',
            component: ConfiguracionComponent,
            data: { breadcrumb: 'Configuración' },
          },
        ],
      },
    ],
  },
  {
    path: 'usuarios',
    data: { breadcrumb: 'Usuarios' },
    children: [
      {
        path: '',
        component: UsuariosComponent,
        data: { breadcrumb: 'Lista' },
      },
      {
        path: 'crear',
        component: CrearUsuarioComponent,
        data: { breadcrumb: 'Crear Usuario' },
      },
    ],
  },
];
```

## Ejemplos de Breadcrumbs Generados

### Ruta: `/dashboard`

```
Inicio > Dashboard
```

### Ruta: `/espacios`

```
Inicio > Espacios > Lista
```

### Ruta: `/espacios/123/configuracion`

```
Inicio > Espacios > Detalle > Configuración
```

### Ruta: `/usuarios/crear`

```
Inicio > Usuarios > Crear Usuario
```

## Propiedades de Configuración

### En los datos de la ruta puedes usar:

- `breadcrumb`: Texto personalizado para el breadcrumb
- `title`: Alternativo a breadcrumb (si no hay breadcrumb, usa title)

### Ejemplo:

```typescript
{
  path: 'configuracion-avanzada',
  component: ConfigAvanzadaComponent,
  data: {
    breadcrumb: 'Configuración Avanzada',
    title: 'Config Avanzada' // Fallback si no hay breadcrumb
  }
}
```

## Integración en Layout

Úsalo típicamente en tu layout principal:

```html
<!-- app.component.html o layout principal -->
<div class="min-h-screen bg-base-100">
  <header class="navbar bg-base-300">
    <!-- Tu navbar -->
  </header>

  <main class="container mx-auto p-4">
    <!-- Breadcrumbs aquí -->
    <app-breadcrumbs class="mb-4"></app-breadcrumbs>

    <!-- Contenido de la página -->
    <router-outlet></router-outlet>
  </main>
</div>
```

## API del Componente

### Métodos públicos:

- `navigateTo(url: string)`: Navega a la URL especificada

### Signals:

- `breadcrumbs()`: Signal que contiene el array de breadcrumbs actual

### Interfaces:

```typescript
interface BreadcrumbItem {
  label: string; // Texto a mostrar
  url?: string; // URL para navegación (opcional)
  isActive?: boolean; // Si es el elemento activo
}
```

## Accesibilidad

El componente incluye:

- ✅ Navegación por teclado
- ✅ ARIA labels apropiados
- ✅ `aria-current="page"` para el elemento activo
- ✅ Roles semánticos correctos

## Responsive

- En pantallas pequeñas, los breadcrumbs se ajustan automáticamente
- Los textos largos se truncan si es necesario
- Mantiene usabilidad en todos los tamaños de pantalla

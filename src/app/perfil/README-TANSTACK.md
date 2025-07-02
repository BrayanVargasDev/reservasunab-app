# Implementación con TanStack Query - Módulo Perfil

## Resumen de Cambios

Se ha refactorizado el servicio `PerfilService` para usar **TanStack Query** (Angular Query) en lugar de manejar el estado manualmente con signals. Esto proporciona las siguientes ventajas:

### Beneficios de TanStack Query

1. **Caché Automático**: Los datos se cachean automáticamente y se reutilizan entre componentes
2. **Revalidación Inteligente**: Los datos se actualizan automáticamente cuando es necesario
3. **Estados de Carga**: Manejo automático de estados loading, error y success
4. **Optimistic Updates**: Actualizaciones optimistas del UI
5. **Background Refetching**: Actualización en segundo plano
6. **Garbage Collection**: Limpieza automática de datos no utilizados

## Cambios en el Servicio

### Antes (Implementación Manual)
```typescript
private _usuario = signal<Usuario | null>(null);
private _cargando = signal(false);

public async obtenerPerfilUsuario(): Promise<Usuario | null> {
  this._cargando.set(true);
  try {
    const { data: usuario } = await getPerfil(this.http, userId);
    this._usuario.set(usuario);
    return usuario;
  } catch (error) {
    return null;
  } finally {
    this._cargando.set(false);
  }
}
```

### Después (TanStack Query)
```typescript
public perfilQuery = injectQuery(() => ({
  queryKey: ['perfil', this.authService.usuario()?.id],
  queryFn: async () => {
    const { data: usuario } = await getPerfil(this.http, userId);
    return usuario;
  },
  enabled: computed(() => !!this.authService.usuario()?.id),
  staleTime: 5 * 60 * 1000, // 5 minutos
}));

public usuario = computed(() => this.perfilQuery.data());
public cargando = computed(() => this.perfilQuery.isLoading());
```

## Query Configuration

### Query de Perfil
```typescript
public perfilQuery = injectQuery(() => ({
  queryKey: ['perfil', this.authService.usuario()?.id],
  queryFn: async () => { /* lógica de fetch */ },
  enabled: computed(() => !!this.authService.usuario()?.id),
  staleTime: 5 * 60 * 1000, // 5 minutos
  gcTime: 10 * 60 * 1000, // 10 minutos
}));
```

**Parámetros importantes:**
- `queryKey`: Clave única para identificar la query en el cache
- `queryFn`: Función que ejecuta la petición HTTP
- `enabled`: Computed que determina cuándo ejecutar la query
- `staleTime`: Tiempo que los datos se consideran "frescos"
- `gcTime`: Tiempo antes de eliminar datos del cache

### Mutation de Actualización
```typescript
public actualizarPerfilMutation = injectMutation(() => ({
  mutationFn: async (datosUsuario: Usuario) => {
    return await saveUsuario(this.http, datosUsuario, true, false);
  },
  onSuccess: (data, variables) => {
    // Invalidar cache para refrescar datos
    this.queryClient.invalidateQueries({ queryKey: ['perfil'] });
    
    // Actualizar cache directamente (optimistic update)
    this.queryClient.setQueryData(['perfil', variables.id], variables);
  },
  onError: (error) => {
    console.error('Error al actualizar:', error);
  }
}));
```

## Uso en Componentes

### Acceso a Datos Reactivos
```typescript
export class PerfilMainPage {
  public perfilService = inject(PerfilService);

  ngOnInit() {
    // Effect que reacciona cuando los datos cambian
    effect(() => {
      const usuario = this.perfilService.usuario();
      if (usuario) {
        this.cargarDatosEnFormulario(usuario);
      }
    });
  }
}
```

### Template Reactivo
```html
@if (perfilService.usuario(); as usuario) {
  <span>{{ usuario.nombre }} {{ usuario.apellido }}</span>
} @else if (perfilService.cargando()) {
  <span>Cargando...</span>
} @else if (perfilService.error()) {
  <span>Error al cargar datos</span>
}

<button 
  [disabled]="perfilForm.invalid || perfilService.cargando()"
  (click)="guardarCambios()">
  @if (perfilService.cargando()) {
    <span class="loading loading-spinner"></span>
  }
  Guardar
</button>
```

### Guardar Cambios
```typescript
async guardarCambios() {
  const datosActualizados = {
    ...this.perfilService.usuario(),
    ...this.perfilForm.value,
  };

  try {
    // Usar mutation directamente
    await this.perfilService.actualizarPerfilMutation.mutateAsync(datosActualizados);
    // El éxito se maneja automáticamente en onSuccess
  } catch (error) {
    // El error se maneja automáticamente en onError
  }
}
```

## Ventajas de esta Implementación

1. **Menos Código Boilerplate**: No necesitas manejar estados de carga manualmente
2. **Cache Inteligente**: Los datos se reutilizan automáticamente
3. **Sincronización Automática**: Múltiples componentes se sincronizan automáticamente
4. **Mejor UX**: Estados de carga y error manejados de manera consistente
5. **Performance**: Menos peticiones HTTP innecesarias
6. **DevTools**: Herramientas de desarrollo para depuración

## Métodos de Utilidad

```typescript
// Invalidar cache manualmente
perfilService.invalidarPerfil();

// Refrescar datos manualmente
await perfilService.refrescarPerfil();

// Verificar estados
const isLoading = perfilService.cargando();
const hasError = perfilService.error();
const userData = perfilService.usuario();
```

## Consideraciones Importantes

1. **Query Keys**: Deben ser únicos y descriptivos
2. **Invalidación**: Invalidar queries relacionadas después de mutations
3. **Error Handling**: Manejar errores en onError de mutations
4. **Loading States**: Usar los estados proporcionados por TanStack Query
5. **Cache Times**: Configurar staleTime y gcTime según las necesidades

Esta implementación sigue las mejores prácticas de TanStack Query y proporciona una base sólida y escalable para el manejo de estado del servidor.

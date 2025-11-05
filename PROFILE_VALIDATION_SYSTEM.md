# Sistema de Validación de Perfil Completado

Este sistema implementa una validación robusta que asegura que los usuarios completen su perfil antes de poder navegar por la aplicación. **Todas las validaciones se realizan contra la base de datos**, garantizando integridad y consistencia.

## Componentes del Sistema

### 1. ProfileCompletionGuard
**Ubicación:** `src/app/shared/guards/profile-completion.guard.ts`

**Funcionalidad:**
- Verifica si el usuario está autenticado
- Consulta la base de datos para validar términos aceptados
- Consulta la base de datos para verificar perfil completado
- Redirige según el estado del usuario

**Lógica de flujo:**
1. Si no está autenticado → Permite que `AuthGuard` maneje la redirección
2. Si está en ruta de perfil/auth/términos → Permite acceso
3. **Consulta BD**: ¿Aceptó términos? → Si no: redirige a `/auth/terms-conditions`
4. **Consulta BD**: ¿Perfil completo? → Si no: redirige a `/perfil?completeProfile=true`
5. Si todo está completo → Permite navegación

### 2. Validación de Estados desde Base de Datos

#### **Términos y Condiciones**
- **Endpoint**: `GET /usuarios/terminos-condiciones`
- **Response**: `{ data: { terminos_condiciones: boolean } }`
- **Acción**: `POST /usuarios/terminos-condiciones`

#### **Perfil Completado**
- **Endpoint**: `GET /usuarios/perfil-completo`
- **Response**: `{ data: { perfil_completo: boolean } }`
- **Validación**: El backend verifica todos los campos obligatorios

### 3. Gestión de Estado
**Sin localStorage**: Todas las validaciones se realizan en tiempo real contra la base de datos, eliminando inconsistencias y problemas de sincronización.

## Rutas Protegidas

### Con ProfileCompletionGuard:
- `/dashboard`
- `/home`
- `/usuarios`
- `/pagos`
- `/permisos`
- `/espacios`
- `/reservas`
- `/config`

### Sin ProfileCompletionGuard (acceso libre):
- `/auth/*` - Rutas de autenticación (sin header)
- `/perfil` - Para completar perfil (con header, sin sidebar)
- `/terms-conditions` - Términos y condiciones (con header, sin sidebar)

## Flujo de Usuario Nuevo

1. **Primer acceso:**
   - Usuario se autentica exitosamente
   - Sistema no mantiene estados locales

2. **Intenta navegar a cualquier ruta protegida:**
   - Guard consulta BD: `GET /usuarios/terminos-condiciones`
   - Si `terminos_condiciones: false` → Redirige a términos

3. **Acepta términos:**
   - Ejecuta: `POST /usuarios/terminos-condiciones`
   - Guard consulta BD: `GET /usuarios/perfil-completo`
   - Si `perfil_completo: false` → Redirige a perfil

4. **Completa perfil:**
   - Al guardar: Backend actualiza estado del perfil
   - Próxima navegación: Guard detecta perfil completo
   - Usuario puede navegar libremente

## Ventajas de la Implementación

### **Integridad de Datos:**
- **Fuente única de verdad**: Base de datos
- **Sin desincronización**: No hay estados duplicados en frontend
- **Consistencia multi-dispositivo**: Mismo estado en cualquier dispositivo

### **Seguridad:**
- **No bypass posible**: Cada navegación valida contra BD
- **Estados inmutables**: Usuario no puede manipular localStorage
- **Validación en tiempo real**: Siempre datos actualizados

### **Casos de Edge manejados:**
- **Usuario sin datos**: BD retorna estados por defecto
- **Errores de red**: Guard redirige a términos por seguridad
- **Sesiones concurrentes**: Estados consistentes entre pestañas

## APIs del Backend Requeridas

### 1. Verificar Términos Aceptados
```typescript
GET /usuarios/terminos-condiciones
Response: {
  success: boolean,
  data: {
    terminos_condiciones: boolean
  }
}
```

### 2. Aceptar Términos
```typescript
POST /usuarios/terminos-condiciones
Response: {
  success: boolean,
  message: string
}
```

### 3. Verificar Perfil Completado
```typescript
GET /usuarios/perfil-completo
Response: {
  success: boolean,
  data: {
    perfil_completo: boolean
  }
}
```

## Mantenimiento

### Para agregar nueva ruta protegida:
```typescript
{
  path: 'nueva-ruta',
  canActivate: [AuthGuard, ProfileCompletionGuard],
  loadChildren: () => import('./nueva-ruta.routes')
}
```

### Para excluir una ruta de la validación:
```typescript
// En profile-completion.guard.ts
if (state.url.includes('/ruta-excluida')) {
  return true;
}
```

### Para modificar validaciones de perfil:
- **Frontend**: No requiere cambios (solo consume API)
- **Backend**: Actualizar lógica en endpoint `/usuarios/perfil-completo`

## Testing

### Casos de prueba recomendados:
1. Usuario nuevo sin términos → Debe ir a términos
2. Usuario con términos pero sin perfil → Debe ir a perfil  
3. Usuario con perfil completo → Debe navegar libremente
4. Acceso directo por URL → Debe redirigir apropiadamente
5. **Errores de API**: Debe manejar timeouts y errores 500
6. **Estados inconsistentes**: BD como fuente de verdad

## Consideraciones de Performance

- **Cache de consultas**: Considerar implementar cache en TanStack Query para reducir llamadas a BD
- **Tiempo de respuesta**: Guard es asíncrono, puede impactar navegación
- **Fallback strategy**: En caso de error de red, el sistema es conservador (redirige a términos)

## Consideraciones de UX

### **Header Disponible en Flujo Restringido:**
- **Términos y Condiciones**: Muestra header con opción de logout (sin sidebar)
- **Completar Perfil**: Muestra header con opción de logout (sin sidebar)
- **Beneficio**: Usuario puede cerrar sesión si necesita cambiar de cuenta

### **Navegación Fluida:**
- **Loading states**: Mostrar indicadores durante validación asíncrona
- **Redirecciones fluidas**: `returnUrl` preserva destino deseado
- **Mensajes claros**: Informar al usuario por qué es redirigido
- **Progreso visual**: Indicar pasos completados vs pendientes
- **Flexibilidad de sesión**: Opción de logout disponible durante flujo restrictivo
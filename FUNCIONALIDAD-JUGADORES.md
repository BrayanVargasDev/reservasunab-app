# Funcionalidad: Agregar Jugadores a Reservas

## Resumen
Se ha implementado la funcionalidad para agregar jugadores a reservas pagadas cuando el espacio permite la opción `agregar_jugadores`.

## Archivos Modificados

### 1. Interfaces
- **`src/app/reservas/interfaces/resumen-reserva.interface.ts`**
  - Agregado: `jugadores?: JugadorReserva[]` a `ResumenReserva`
  - Nueva interfaz: `JugadorReserva`

### 2. Acciones HTTP
- **`src/app/reservas/actions/buscar-jugadores.action.ts`** (Nuevo)
  - Función para buscar jugadores por término de búsqueda
  - Endpoint: `GET /usuarios/buscar-jugadores`

- **`src/app/reservas/actions/agregar-jugadores-reserva.action.ts`** (Nuevo)
  - Función para agregar jugadores a una reserva
  - Endpoint: `POST /reservas/{id}/agregar-jugadores`

- **`src/app/reservas/actions/index.ts`**
  - Exporta las nuevas acciones

### 3. Servicio DreservasService
- **`src/app/reservas/services/dreservas.service.ts`**
  - Nuevas señales para manejar estado de jugadores:
    - `_mostrarJugadores`
    - `_termino_busqueda_jugadores`
    - `_jugadoresSeleccionados`
  - Nueva query: `jugadoresQuery` con TanStack Query
  - Métodos públicos para manejar jugadores:
    - `setMostrarJugadores()`
    - `setTerminoBusquedaJugadores()`
    - `agregarJugadorSeleccionado()`
    - `removerJugadorSeleccionado()`
    - `limpiarJugadoresSeleccionados()`
    - `agregarJugadores()`

### 4. Componente Modal Dreservas
- **`src/app/reservas/components/modal-dreservas/modal-dreservas.component.ts`**
  - Nuevo computed: `puedeAgregarJugadores()`
  - Métodos para manejar jugadores:
    - `mostrarAgregarJugadores()`
    - `onBuscarJugadores()`
    - `agregarJugador()`
    - `removerJugador()`
    - `esJugadorSeleccionado()`
    - `cancelarAgregarJugadores()`
    - `confirmarAgregarJugadores()`

- **`src/app/reservas/components/modal-dreservas/modal-dreservas.component.html`**
  - Nueva sección completa para agregar jugadores
  - Input de búsqueda con debounce automático
  - Lista de jugadores encontrados
  - Lista de jugadores seleccionados
  - Botón "Agregar Jugadores" en el modal action

### 5. Componente Info Reserva
- **`src/app/reservas/components/info-reserva/info-reserva.component.html`**
  - Nueva sección para mostrar jugadores agregados a la reserva
  - Se muestra después del precio y antes del mensaje de éxito

## Flujo de Funcionamiento

### 1. Condiciones para mostrar botón
- La reserva debe estar pagada (`estado === 'pagada'`)
- El espacio debe permitir agregar jugadores (`agrega_jugadores === true`)

### 2. Proceso de agregar jugadores
1. Usuario hace clic en "Agregar Jugadores"
2. Se muestra interface de búsqueda
3. Usuario escribe término de búsqueda (nombre, email o documento)
4. Se ejecuta query automáticamente con TanStack Query
5. Se muestran resultados de búsqueda
6. Usuario selecciona jugadores deseados
7. Se muestran jugadores seleccionados
8. Usuario confirma selección
9. Se envía petición HTTP para agregar jugadores
10. Se actualiza la reserva con los nuevos jugadores
11. Se vuelve a mostrar el resumen de reserva actualizado

### 3. Visualización en resumen
- Los jugadores agregados se muestran en una sección separada
- Información mostrada: Nombre completo, email y documento
- Se muestra el total de jugadores agregados

## Características Técnicas

### TanStack Query
- La búsqueda de jugadores usa TanStack Query para cache automático
- `staleTime: 30 * 1000` (30 segundos de cache)
- Query se ejecuta solo cuando hay término de búsqueda y modal está abierto

### Manejo de Estado
- Estado reactivo con Angular signals
- Estado se limpia automáticamente al cerrar modal
- Validaciones en tiempo real para evitar duplicados

### UX/UI
- Búsqueda en tiempo real mientras el usuario escribe
- Indicadores de carga durante búsqueda y confirmación
- Feedback visual claro para jugadores ya seleccionados
- Contador de jugadores seleccionados
- Alertas de éxito y error con posicionamiento consistente

## Endpoints del Backend (Esperados)

### Buscar Jugadores
```
GET /usuarios/buscar-jugadores?search={termino}
```
**Respuesta esperada:**
```json
{
  "data": [
    {
      "id": 1,
      "nombre": "Juan",
      "apellido": "Pérez",
      "email": "juan@example.com",
      "documento": "12345678"
    }
  ]
}
```

### Agregar Jugadores a Reserva
```
POST /reservas/{id}/agregar-jugadores
```
**Body:**
```json
{
  "jugadores": [1, 2, 3]
}
```
**Respuesta esperada:**
```json
{
  "data": {
    // ResumenReserva actualizada con jugadores agregados
    "jugadores": [
      {
        "id": 1,
        "nombre": "Juan",
        "apellido": "Pérez",
        "email": "juan@example.com",
        "documento": "12345678"
      }
    ]
  }
}
```

## Notas Importantes
1. La funcionalidad solo está disponible para reservas pagadas
2. Solo funciona si el espacio tiene habilitada la opción `agrega_jugadores`
3. El estado se gestiona de forma reactiva usando signals de Angular
4. Se usa TanStack Query para optimizar las búsquedas y cache
5. La UI es completamente responsiva y accesible

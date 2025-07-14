# Página de Redirección de Pagos

## Descripción
Esta página permite visualizar la información completa de los pagos realizados, especialmente diseñada para mostrar el resultado de las transacciones de pago después de una redirección desde un gateway de pago externo.

## Ruta
La página está disponible en la ruta: `/pagos/reservas?codigo=CODIGO_PAGO`

## Funcionalidades

### 1. Estados de Pago
- **Completado**: Pago procesado exitosamente
- **Pendiente**: Pago en proceso de verificación
- **Procesando**: Pago siendo procesado en tiempo real
- **Rechazado**: Pago rechazado por el gateway

### 2. Información Mostrada
- **Datos del Pago**: Código, monto, método de pago, referencia, fecha
- **Información de Transacción**: ID, número de transacción, fecha, mensaje
- **Datos de la Reserva**: Código, servicio, descripción, fecha, hora
- **Información del Usuario**: Nombre, email, documento

### 3. Componentes Principales

#### PagoRedirectPage
- Página principal que maneja la lógica de obtención de datos
- Gestiona estados de carga, error y éxito
- Ubicación: `src/app/pagos/pages/pago-redirect/`

#### PagoInfoCardComponent
- Componente reutilizable para mostrar la información del pago
- Diseño responsivo y modular
- Ubicación: `src/app/pagos/components/pago-info-card/`

#### LoadingSpinnerComponent
- Componente de carga con animaciones atractivas
- Ubicación: `src/app/pagos/components/loading-spinner/`

#### ErrorDisplayComponent
- Componente para mostrar errores con opciones de acción
- Ubicación: `src/app/pagos/components/error-display/`

### 4. Servicios y Actions

#### PagosService
- Servicio principal para manejar la lógica de pagos
- Incluye métodos de formateo y obtención de datos
- Ubicación: `src/app/pagos/services/pagos.service.ts`

#### getPagoInfo Action
- Action para realizar peticiones HTTP al backend
- Obtiene información del pago por código
- Ubicación: `src/app/pagos/actions/get-pago-info.action.ts`

## Uso

### Parámetros de Query
- `codigo`: Código único del pago (requerido)

### Ejemplos de URL
```
/pagos/reservas?codigo=PAY_123456789
/pagos/reservas?codigo=TXN_987654321
```

### Flujo de Funcionamiento
1. El usuario accede a la URL con el código de pago
2. Se extrae el código de los query parameters
3. Se realiza una petición al backend para obtener la información
4. Se muestra la información formateada según el estado del pago
5. Se proporcionan acciones para actualizar o volver al inicio

## Estilos y UX

### Diseño Responsivo
- Adaptado para móviles, tablets y desktop
- Grid system para organización de información
- Tipografía clara y legible

### Estados Visuales
- Colores diferenciados por estado de pago
- Iconografía intuitiva
- Animaciones suaves para transiciones

### Accesibilidad
- Contraste adecuado de colores
- Navegación por teclado
- Textos descriptivos para lectores de pantalla

## Configuración del Backend

### Endpoint Esperado
```
GET /api/pagos/info?codigo=CODIGO_PAGO
```

### Respuesta Esperada
```typescript
interface PagoInfo {
  id: string;
  codigo: string;
  monto: number;
  estado: 'pendiente' | 'completado' | 'rechazado' | 'procesando';
  fechaCreacion: string;
  fechaActualizacion: string;
  metodoPago: string;
  referencia: string;
  reserva: {
    id: string;
    codigo: string;
    usuario: {
      nombre: string;
      email: string;
      documento: string;
    };
    servicio: {
      nombre: string;
      descripcion: string;
    };
    fecha: string;
    hora: string;
  };
  transaccion?: {
    id: string;
    numeroTransaccion: string;
    fecha: string;
    mensaje?: string;
  };
}
```

## Características Técnicas

### Framework
- Angular 17+ con Ionic
- Standalone Components
- TypeScript

### Patrones Utilizados
- Action Pattern para HTTP requests
- Service Pattern para lógica de negocio
- Component Composition

### Dependencias
- @angular/common
- @angular/router
- @ionic/angular
- RxJS

## Futuras Mejoras
- Implementar cache para evitar peticiones repetidas
- Agregar opción de descarga de comprobante
- Notificaciones push para actualizaciones de estado
- Soporte para múltiples idiomas

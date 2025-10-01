// Constantes de códigos de permisos basadas en la lista final del sistema

// Dashboard (id_pantalla = 1)
export const PERMISOS_DASHBOARD = {
  DESCARGAR_RESERVAS_MES: 'DSB000001',
  DESCARGAR_RECAUDO_MES: 'DSB000002',
} as const;

// Usuarios (id_pantalla = 2)
export const PERMISOS_USUARIOS = {
  CREAR_USUARIOS: 'USR000001',
  EDITAR_USUARIOS: 'USR000002',
  CAMBIAR_ROL_USUARIOS: 'USR000003',
  DESACTIVAR_USUARIOS: 'USR000004',
} as const;

// Permisos (id_pantalla = 3)
export const PERMISOS_PERMISOS = {
  CREAR_ROLES: 'PER000001',
  EDITAR_ROLES: 'PER000002',
} as const;

// Espacios (id_pantalla = 4)
export const PERMISOS_ESPACIOS = {
  CREAR_ESPACIOS: 'ESP000001',
  DESACTIVAR_ESPACIOS: 'ESP000002',
  EDITAR_ESPACIOS: 'ESP000003',
  CREAR_FRANJAS_HORARIAS: 'ESP000004',
  EDITAR_FRANJAS_HORARIAS: 'ESP000005',
  ELIMINAR_FRANJAS_HORARIAS: 'ESP000006',
  CREAR_CONFIGURACION_TIPO_USUARIO: 'ESP000007',
  EDITAR_CONFIGURACION_TIPO_USUARIO: 'ESP000008',
  DESACTIVAR_CONFIGURACION_TIPO_USUARIO: 'ESP000009',
  CREAR_NOVEDADES_ESPACIO: 'ESP000010',
  EDITAR_NOVEDADES_ESPACIO: 'ESP000011',
  DESACTIVAR_NOVEDADES_ESPACIO: 'ESP000012',
  CONFIGURAR_ESPACIOS: 'ESP000013',
} as const;

// Pagos (id_pantalla = 5)
export const PERMISOS_PAGOS = {
  VER_PAGOS: 'PAG000001',
  ACCESO_PAGOS: 'PAG000002',
} as const;

// Reservas (id_pantalla = 6)
export const PERMISOS_RESERVAS = {
  ADMINISTRAR_RESERVAS: 'RES000001',
  CANCELAR_RESERVAS: 'RES000002',
} as const;

// Configuración (id_pantalla = 7)
export const PERMISOS_CONFIGURACION = {
  CREAR_CATEGORIAS: 'CFG000001',
  EDITAR_CATEGORIAS: 'CFG000002',
  DESACTIVAR_CATEGORIAS: 'CFG000003',
  CREAR_GRUPOS: 'CFG000004',
  EDITAR_GRUPOS: 'CFG000005',
  DESACTIVAR_GRUPOS: 'CFG000006',
  CREAR_ELEMENTOS: 'CFG000007',
  EDITAR_ELEMENTOS: 'CFG000008',
  DESACTIVAR_ELEMENTOS: 'CFG000009',
} as const;

// Exportar todos los permisos en un objeto único para acceso fácil
export const PERMISOS_CODIGOS = {
  ...PERMISOS_DASHBOARD,
  ...PERMISOS_USUARIOS,
  ...PERMISOS_PERMISOS,
  ...PERMISOS_ESPACIOS,
  ...PERMISOS_PAGOS,
  ...PERMISOS_RESERVAS,
  ...PERMISOS_CONFIGURACION,
} as const;

// Tipos para TypeScript
export type PermisoDashboard =
  (typeof PERMISOS_DASHBOARD)[keyof typeof PERMISOS_DASHBOARD];
export type PermisoUsuarios =
  (typeof PERMISOS_USUARIOS)[keyof typeof PERMISOS_USUARIOS];
export type PermisoPermisos =
  (typeof PERMISOS_PERMISOS)[keyof typeof PERMISOS_PERMISOS];
export type PermisoEspacios =
  (typeof PERMISOS_ESPACIOS)[keyof typeof PERMISOS_ESPACIOS];
export type PermisoPagos = (typeof PERMISOS_PAGOS)[keyof typeof PERMISOS_PAGOS];
export type PermisoReservas =
  (typeof PERMISOS_RESERVAS)[keyof typeof PERMISOS_RESERVAS];
export type PermisoConfiguracion =
  (typeof PERMISOS_CONFIGURACION)[keyof typeof PERMISOS_CONFIGURACION];
export type PermisoCodigo =
  (typeof PERMISOS_CODIGOS)[keyof typeof PERMISOS_CODIGOS];

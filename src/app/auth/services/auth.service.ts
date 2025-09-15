import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';

import {
  injectMutation,
  QueryClient,
  injectQuery,
} from '@tanstack/angular-query-experimental';

import {
  loginAction,
  registroAction,
  getUser,
  logoutAction,
  checkTermsAccepted,
  checkProfileCompleted,
  intercambiarTokenAction,
  refreshTokenAction,
} from '../actions';
import { Registro, UsuarioLogueado } from '../interfaces';
import { CredencialesLogin } from '@auth/interfaces';
import { GeneralResponse } from '@shared/interfaces';
import { Rol } from '@permisos/interfaces';
import { STORAGE_KEYS, AUTH_CONFIG } from '../constants/storage.constants';
import { ValidationCacheService } from './validation-cache.service';
import { IndexedDbService } from '@shared/services/indexed-db.service';

// Servicio de logging para autenticación
class AuthLogger {
  private static instance: AuthLogger;
  private logs: string[] = [];
  private readonly MAX_LOGS = 100;

  static getInstance(): AuthLogger {
    if (!AuthLogger.instance) {
      AuthLogger.instance = new AuthLogger();
    }
    return AuthLogger.instance;
  }

  log(level: 'debug' | 'info' | 'warn' | 'error', message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

    if (data) {
      console[level](logEntry, data);
    } else {
      console[level](logEntry);
    }

    // Mantener logs en memoria para debugging
    this.logs.push(logEntry);
    if (this.logs.length > this.MAX_LOGS) {
      this.logs.shift();
    }
  }

  getLogs(): string[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}

type EstadoAutenticacion = 'autenticado' | 'noAutenticado' | 'chequeando';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private qc = inject(QueryClient);
  private router = inject(Router);
  private validationCache = inject(ValidationCacheService);
  private idb = inject(IndexedDbService);
  private logger = AuthLogger.getInstance();
  private _estadoAutenticacion = signal<EstadoAutenticacion>('chequeando');
  private _usuario = signal<UsuarioLogueado | null>(null);
  // Access token sólo en memoria: nunca persistido en navegador
  private _accessToken = signal<string | null>(null);
  private _isLoading = signal<boolean>(false);
  private _lastActivityMs: number | null = null;
  private _refreshInFlight: Promise<boolean> | null = null;
  private _hasRefreshToken = false;
  // URL actual como signal para reaccionar a cambios de ruta
  private _currentUrl = signal<string>('');

  constructor() {
    this.logger.log('info', 'AuthService initialized');

    // Carga inicial basada en refresh token + usuario en IndexedDB
    void this.loadFromIndexedDb();
    // Sincronización entre pestañas usando BroadcastChannel del servicio IndexedDB
    this.setupCrossTabSync();
    // Inicializar y escuchar cambios de navegación para reactividad de ruta
    this._currentUrl.set(this.router.url);
    this.router.events.subscribe(ev => {
      if (ev instanceof NavigationEnd) {
        this._currentUrl.set(ev.urlAfterRedirects || ev.url);
      }
    });
  }

  estadoAutenticacion = computed<EstadoAutenticacion>(() => {
    this._usuario();
    if (this._estadoAutenticacion() === 'chequeando') return 'chequeando';

    if (this._usuario()) {
      return 'autenticado';
    }

    return 'noAutenticado';
  });

  usuario = computed<UsuarioLogueado | null>(() => this._usuario());
  token = computed(() => this._accessToken());

  public estaAutenticado = computed(() => {
    return this.estadoAutenticacion() === 'autenticado';
  });

  private esRutaPublica = computed(() => {
    const url = this._currentUrl();
    const rutasPublicas = [
      '/auth/login',
      '/auth/registro',
      '/auth/reset-password',
      '/acceso-denegado',
      '/404',
      '/pagos/reservas',
    ];
    return rutasPublicas.some(ruta => url.includes(ruta));
  });

  userQuery = injectQuery(() => ({
    queryKey: ['user'],
    queryFn: () => getUser(this.http),
    retry: 0,
    // Habilitar si la sesión es válida (hay refresh+usuario) y no estamos en rutas públicas.
    // El interceptor se encargará de refrescar el access token si aún no existe en memoria.
    enabled: this.isSessionValid() && !this.esRutaPublica(),
    staleTime: AUTH_CONFIG.CACHE_DURATION,
    select: (response: GeneralResponse<UsuarioLogueado>) => {
      const user = response.data;
      if (user) {
        // Persistir usuario sin tokens (por seguridad)
        this.saveUserToStorage(user);
        this.updateLastActivity();
        this._usuario.set(user);
        // No persistimos access token. Mantenemos el de memoria si ya existe.
        this._estadoAutenticacion.set('autenticado');
      }
      return user || null;
    },
    onError: (error: any) => {
      console.error('Error en userQuery:', error);
      // No limpiar sesión automáticamente: el flujo de 401/refresh lo maneja el interceptor.
    },
  }));

  public onSuccessLogin(user: UsuarioLogueado) {
    if (!user) {
      return;
    }
    this.validationCache.limpiarEstadosValidacion();

    // Guardar usuario y refresh token en IndexedDB; access token solo en memoria
    this.saveUserToStorage(user);
    this._usuario.set(user);
    void this.setRefreshToken(user.refresh_token);
    this.setToken(user.access_token);
    this.updateLastActivity();
    this._accessToken.set(user.access_token);
    this._estadoAutenticacion.set('autenticado');
    // this.qc.setQueryData(['user'], user);
  }

  logoutMutation = injectMutation(() => ({
    mutationKey: ['logout'],
    mutationFn: () => logoutAction(this.http),
  }));

  setLoading(loading: boolean): void {
    this._isLoading.set(loading);
  }

  // Access token sólo se guarda en memoria
  setToken(token: string | null): void {
    this._accessToken.set(token);
  }

  private async setRefreshToken(refresh: string | null): Promise<void> {
    if (refresh) {
      await this.idb.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh);
      this._hasRefreshToken = true;
    } else {
      await this.idb.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      this._hasRefreshToken = false;
    }
  }

  get isLoading(): boolean {
    return this._isLoading();
  }

  login(email: string, password: string) {
    return loginAction(this.http, { email, password });
  }

  logout() {
    return logoutAction(this.http);
  }

  clearSession(): void {
    // Limpiar tokens persistidos (compatibilidad: TOKEN antiguo y REFRESH_TOKEN actual)
    void this.idb.removeItem(STORAGE_KEYS.TOKEN);
    void this.idb.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    void this.idb.removeItem(STORAGE_KEYS.USER);
    void this.idb.removeItem(STORAGE_KEYS.LAST_ACTIVITY);
    void this.idb.removeItem(STORAGE_KEYS.TERMS_ACCEPTED);
    void this.idb.removeItem(STORAGE_KEYS.PROFILE_COMPLETED);

    void this.validationCache.limpiarEstadosValidacion();

    this._accessToken.set(null);
    this._estadoAutenticacion.set('noAutenticado');

    this.qc.setQueryData(['user'], null);
    this.qc.removeQueries({ queryKey: ['user'] });
  }

  isAuthenticated(): boolean {
    return this.estadoAutenticacion() === 'autenticado';
  }

  getToken(): string | null {
    return this._accessToken();
  }

  public setUser(usuario: UsuarioLogueado | null): void {
    this._usuario.set(usuario);
  }

  public registro(params: Registro) {
    return registroAction(this.http, params);
  }

  private async loadFromIndexedDb(): Promise<void> {
    try {
      const [refreshToken, user, lastActivity] = await Promise.all([
        this.idb.getItem(STORAGE_KEYS.REFRESH_TOKEN),
        this.idb.getJSON<UsuarioLogueado>(STORAGE_KEYS.USER),
        this.idb.getItem(STORAGE_KEYS.LAST_ACTIVITY),
      ]);

      if (lastActivity) this._lastActivityMs = parseInt(lastActivity);

      if (refreshToken && user) {
        this._hasRefreshToken = true;
        // Establecer usuario en memoria; la validez se basa en refresh+usuario
        this._usuario.set(user);
        this._estadoAutenticacion.set('autenticado');

        // Intentar obtener un nuevo access token en segundo plano (no bloqueante)
        void this.refreshAccessToken().catch(error => {
          console.warn('Background token refresh failed:', error);
        });
      } else if (refreshToken) {
        this._hasRefreshToken = true;
        // Tenemos refresh sin usuario: intentamos obtener el usuario con timeout
        const refreshPromise = this.refreshAccessToken();
        const timeoutPromise = new Promise<boolean>((resolve) => {
          setTimeout(() => resolve(false), 5000); // 5 segundos timeout
        });

        const refreshed = await Promise.race([refreshPromise, timeoutPromise]);

        if (refreshed) {
          try {
            await this.userQuery.refetch();
            this._estadoAutenticacion.set('autenticado');
          } catch (error) {
            console.warn('Failed to fetch user after token refresh:', error);
            this._estadoAutenticacion.set('noAutenticado');
          }
        } else {
          console.warn('Token refresh timed out or failed');
          this._estadoAutenticacion.set('noAutenticado');
        }
      } else {
        this._hasRefreshToken = false;
        this._estadoAutenticacion.set('noAutenticado');
      }
    } catch (error) {
      console.error('Error loading from IndexedDB:', error);
      this._hasRefreshToken = false;
      this._estadoAutenticacion.set('noAutenticado');
    }
  }

  private setupCrossTabSync(): void {
    this.idb.listen(({ key, newValue }) => {
      if (key === STORAGE_KEYS.REFRESH_TOKEN) {
        // Si se elimina el refresh token en otra pestaña, invalidar sesión local
        if (!newValue) {
          console.debug('Refresh token removed in another tab, clearing local session');
          this._hasRefreshToken = false;
          this._accessToken.set(null);
          this._usuario.set(null);
          this._estadoAutenticacion.set('noAutenticado');
        } else {
          console.debug('Refresh token added in another tab');
          this._hasRefreshToken = true;
          // Si aparece un refresh token, intentar refrescar access token (con debounce)
          setTimeout(() => {
            if (this._hasRefreshToken && !this._accessToken()) {
              void this.refreshAccessToken().catch(error => {
                console.warn('Cross-tab token refresh failed:', error);
              });
            }
          }, 100); // Pequeño delay para evitar race conditions
        }
      } else if (key === STORAGE_KEYS.USER) {
        try {
          const parsedUser = newValue ? (JSON.parse(newValue) as UsuarioLogueado) : null;
          this._usuario.set(parsedUser);
          console.debug('User updated from another tab');
        } catch (error) {
          console.error('Error parsing user from cross-tab sync:', error);
          this._usuario.set(null);
        }
      } else if (key === STORAGE_KEYS.LAST_ACTIVITY) {
        this._lastActivityMs = newValue ? parseInt(newValue) : null;
      }
    });
  }

  private async saveUserToStorage(user: UsuarioLogueado): Promise<void> {
    // Persiste sólo información del usuario necesaria. Se excluyen tokens por seguridad.
    const { access_token: _a, refresh_token: _r, ...safeUser } = user as any;
    try {
      await this.idb.setItem(STORAGE_KEYS.USER, JSON.stringify(safeUser));
    } catch (error) {
      console.error('Error guardando usuario en IndexedDB:', error);
    }
  }

  public getUserFromStorage(): UsuarioLogueado | null {
    // Devuelve el usuario en memoria; la carga inicial proviene de IndexedDB
    return this._usuario();
  }

  private updateLastActivity(): void {
    try {
      const now = Date.now();
      this._lastActivityMs = now;
      void this.idb.setItem(STORAGE_KEYS.LAST_ACTIVITY, now.toString());
    } catch (error) {
      console.error('Error actualizando última actividad:', error);
    }
  }

  public tienePermisos(codigo: string): boolean {
    const usuario = this._usuario();
    if (!usuario || !usuario.permisos) {
      return false;
    }

    if (usuario.rol.nombre?.toLowerCase() === 'administrador') {
      return true;
    }

    return usuario.permisos.some(permiso => permiso.codigo === codigo);
  }

  public verificarYSincronizarUsuario(): void {
    const token = this.getToken();
    if (!token) {
      this.clearSession();
      return;
    }

    this.qc.invalidateQueries({ queryKey: ['user'] });
  }

  public getUsuarioActual(): UsuarioLogueado | null {
    const usuarioEnMemoria = this._usuario();
    if (usuarioEnMemoria) {
      return usuarioEnMemoria;
    }

    const usuarioGuardado = this.getUserFromStorage();
    if (usuarioGuardado && this.getToken()) {
      this._usuario.set(usuarioGuardado);
      return usuarioGuardado;
    }

    return null;
  }

  public isSessionValid(): boolean {
    try {
      // Definición solicitada: sesión activa si existen refresh token y usuario
      // y no hay inactividad excesiva.
      // El access token en memoria puede ser nulo; se renovará cuando sea necesario.

      // Usuario en memoria o en IndexedDB
      const user = this._usuario() || this.getUserFromStorage();
      if (!user) {
        console.debug('Session invalid: no user found');
        return false;
      }

      if (!this._hasRefreshToken) {
        console.debug('Session invalid: no refresh token');
        return false;
      }

      const lastActivityTime = this._lastActivityMs ?? null;
      if (lastActivityTime) {
        const now = Date.now();
        const timeDiff = now - lastActivityTime;
        const maxInactiveTime = 8 * 60 * 60 * 1000; // 8 horas

        if (timeDiff > maxInactiveTime) {
          console.debug('Session expired due to inactivity');
          this.clearSession();
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error validating session:', error);
      return false;
    }
  }

  public refreshTokenIfNeeded(): void {
    if (this.isSessionValid() && !this._accessToken() && !this._refreshInFlight) {
      void this.refreshAccessToken().catch(error => {
        console.warn('Background token refresh failed:', error);
      });
    }
  }

  public isRefreshInProgress(): boolean {
    return this._refreshInFlight !== null;
  }

  public forceResolveAuthState(): void {
    const currentState = this.estadoAutenticacion();
    if (currentState === 'chequeando') {
      // Forzar resolución del estado si está atascado
      if (this.isSessionValid()) {
        this._estadoAutenticacion.set('autenticado');
      } else {
        this._estadoAutenticacion.set('noAutenticado');
      }
    }
  }

  // Realiza refresh del access token usando el refresh token persistido
  public async refreshAccessToken(): Promise<boolean> {
    if (this._refreshInFlight) {
      return this._refreshInFlight;
    }

    this._refreshInFlight = this.performTokenRefresh();
    return this._refreshInFlight;
  }

  private async performTokenRefresh(): Promise<boolean> {
    try {
      const refresh = await this.idb.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      if (!refresh) {
        console.warn('No refresh token available for refresh');
        return false;
      }

      const resp = await refreshTokenAction(this.http, refresh);
      const newAccess = resp.data.access_token;

      if (!newAccess) {
        console.error('Refresh token response did not contain access token');
        return false;
      }

      this.setToken(newAccess);
      this.updateLastActivity();
      return true;
    } catch (error: any) {
      console.error('Error al refrescar access token:', error);

      // Si el error es 401/403, el refresh token es inválido
      if (error?.status === 401 || error?.status === 403) {
        console.warn('Refresh token is invalid, clearing session');
        this.clearSession();
      }

      this.setToken(null);
      return false;
    } finally {
      this._refreshInFlight = null;
    }
  }

  public async checkTerminosAceptados(): Promise<boolean> {
    try {
      const response = await checkTermsAccepted(this.http);
      const termsAccepted = response.data.terminos_condiciones;

      this.validationCache.setTerminosAceptados(termsAccepted);

      return termsAccepted;
    } catch (error) {
      console.error('Error verificando términos aceptados:', error);
      return false;
    }
  }

  public async checkPerfilCompletado(): Promise<boolean> {
    try {
      const response = await checkProfileCompleted(this.http);
      const profileCompleted = response.data.perfil_completo;

      this.validationCache.setPerfilCompletado(profileCompleted);

      return profileCompleted;
    } catch (error) {
      console.error('Error verificando perfil completo:', error);
      return false;
    }
  }

  public async intercambiarToken(code: string): Promise<boolean> {
    try {
      const response = await intercambiarTokenAction(this.http, code);
      const { access_token, refresh_token } = response.data;

      // Persistir refresh y poner access en memoria
      await this.setRefreshToken(refresh_token);
      this.setToken(access_token);

      // Obtener usuario actualizado y establecer estado autenticado
      await this.userQuery.refetch();
      this._estadoAutenticacion.set('autenticado');
      return true;
    } catch (error) {
      console.error('Error intercambiando token:', error);
      return false;
    }
  }

  public async postLoginRedirect(): Promise<string> {
    // Devuelve la ruta a donde se debe redirigir tras login/callback
    try {
      this.logger.log('debug', 'Checking post-login redirect conditions');

      const termsAccepted = await this.checkTerminosAceptados();
      if (!termsAccepted) {
        this.logger.log('debug', 'Redirecting to terms and conditions');
        return '/auth/terms-conditions';
      }

      const profileCompleted = await this.checkPerfilCompletado();
      if (!profileCompleted) {
        this.logger.log('debug', 'Redirecting to profile completion');
        return '/perfil';
      }

      this.logger.log('debug', 'Redirecting to home/dashboard');
      return '/'; // Será resuelto por RedirectComponent hacia primera pantalla disponible
    } catch (error) {
      this.logger.log('error', 'Error in post-login redirect', error);
      return '/';
    }
  }

  // Métodos públicos para debugging y monitoreo
  public getDebugLogs(): string[] {
    return this.logger.getLogs();
  }

  public clearDebugLogs(): void {
    this.logger.clearLogs();
  }

  public getAuthStatus(): {
    estado: EstadoAutenticacion;
    hasUser: boolean;
    hasToken: boolean;
    hasRefreshToken: boolean;
    isSessionValid: boolean;
    lastActivity: number | null;
  } {
    return {
      estado: this._estadoAutenticacion(),
      hasUser: !!this._usuario(),
      hasToken: !!this._accessToken(),
      hasRefreshToken: this._hasRefreshToken,
      isSessionValid: this.isSessionValid(),
      lastActivity: this._lastActivityMs
    };
  }
}

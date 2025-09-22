import { computed, inject, Injectable, signal, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
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
import { StorageService } from '@shared/services/storage.service';
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

type EstadoAutenticacion = 'authenticated' | 'unauthenticated' | 'loading';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private routerSubscription?: Subscription;
  private http = inject(HttpClient);
  private qc = inject(QueryClient);
  private router = inject(Router);
  private validationCache = inject(ValidationCacheService);
  private storage = inject(StorageService);
  private idb = inject(IndexedDbService);
  private logger = AuthLogger.getInstance();
  private _estadoAutenticacion = signal<EstadoAutenticacion>('loading');
  private _usuario = signal<UsuarioLogueado | null>(null);
  // Access token sólo en memoria: nunca persistido en navegador
  private _accessToken = signal<string | null>(null);
  private _isLoading = signal<boolean>(false);
  private _lastActivityMs: number | null = null;
  private _hasRefreshToken = false;
  // URL actual como signal para reaccionar a cambios de ruta
  private _currentUrl = signal<string>('');

  constructor() {
    this.logger.log('info', 'AuthService initialized');

    // Carga inicial basada en datos en localStorage
    void this.loadFromStorage();
    // Inicializar y escuchar cambios de navegación para reactividad de ruta
    this._currentUrl.set(this.router.url);
    this.routerSubscription = this.router.events.subscribe(ev => {
      if (ev instanceof NavigationEnd) {
        this._currentUrl.set(ev.urlAfterRedirects || ev.url);
      }
    });
  }

  estadoAutenticacion = computed<EstadoAutenticacion>(() => {
    return this._usuario() ? 'authenticated' : 'unauthenticated';
  });

  usuario = computed<UsuarioLogueado | null>(() => this._usuario());
  token = computed(() => this._accessToken());

  public estaAutenticado = computed(() => {
    return this.estadoAutenticacion() === 'authenticated';
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
        this._estadoAutenticacion.set('authenticated');
      }
      return user || null;
    },
    onError: (error: any) => {
      // Silent error handling - interceptor manages 401 responses
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
    this._estadoAutenticacion.set('authenticated');
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

  private setRefreshToken(refresh: string | null): void {
    if (refresh) {
      this.storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh);
      this._hasRefreshToken = true;
    } else {
      this.storage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
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

  clearSession(fromLogout: boolean = false): void {
    // Limpiar tokens persistidos
    this.storage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    this.storage.removeItem(STORAGE_KEYS.USER);
    this.storage.removeItem(STORAGE_KEYS.LAST_ACTIVITY);

    if (fromLogout) {
      this.storage.removeItem(STORAGE_KEYS.PROFILE_COMPLETED);
      this.storage.removeItem(STORAGE_KEYS.TERMS_ACCEPTED);
    }

    // Mantener validaciones en IndexedDB ya que son datos de cache
    void this.idb.removeItem(STORAGE_KEYS.TERMS_ACCEPTED);
    void this.idb.removeItem(STORAGE_KEYS.PROFILE_COMPLETED);

    void this.validationCache.limpiarEstadosValidacion();

    this._accessToken.set(null);
    this._estadoAutenticacion.set('unauthenticated');

    this.qc.setQueryData(['user'], null);
    this.qc.removeQueries({ queryKey: ['user'] });
  }

  isAuthenticated(): boolean {
    return this.estadoAutenticacion() === 'authenticated';
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

  private async loadFromStorage(): Promise<void> {
    try {
      const refreshToken = this.storage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      const user = this.storage.getJSON<UsuarioLogueado>(STORAGE_KEYS.USER);
      const lastActivity = this.storage.getItem(STORAGE_KEYS.LAST_ACTIVITY);

      if (lastActivity) this._lastActivityMs = parseInt(lastActivity);

      if (refreshToken && user) {
        this._hasRefreshToken = true;
        // Establecer usuario en memoria; la validez se basa en refresh+usuario
        this._usuario.set(user);
        this._estadoAutenticacion.set('authenticated');
      } else {
        this._hasRefreshToken = !!refreshToken;
        this._estadoAutenticacion.set('unauthenticated');
      }
    } catch (error) {
      // Silent fail for localStorage errors - not critical
      this._hasRefreshToken = false;
      this._estadoAutenticacion.set('unauthenticated');
    }
  }

  private saveUserToStorage(user: UsuarioLogueado): void {
    // Persiste sólo información del usuario necesaria. Se excluyen tokens por seguridad.
    const { access_token: _a, refresh_token: _r, ...safeUser } = user as any;
    try {
      this.storage.setJSON(STORAGE_KEYS.USER, safeUser);
    } catch (error) {
      console.error('Error guardando usuario en localStorage:', error);
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
      this.storage.setItem(STORAGE_KEYS.LAST_ACTIVITY, now.toString());
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

  // Realiza refresh del access token usando el refresh token persistido
  public async refreshAccessToken(): Promise<boolean> {
    return this.performTokenRefresh();
  }

  private async performTokenRefresh(): Promise<boolean> {
    try {
      const refresh = this.storage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      if (!refresh) {
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
      // Si el error es 401/403, el refresh token es inválido
      if (error?.status === 401 || error?.status === 403) {
        this.clearSession();
      }

      this.setToken(null);
      return false;
    }
  }

  public async checkTerminosAceptados(): Promise<boolean> {
    try {
      const response = await checkTermsAccepted(this.http);
      const termsAccepted = response.data.terminos_condiciones;

      this.validationCache.setTerminosAceptados(termsAccepted);

      return termsAccepted;
    } catch (error) {
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

      // Obtener usuario actualizado y establecer estado authenticated
      await this.userQuery.refetch();
      this._estadoAutenticacion.set('authenticated');
      return true;
    } catch (error) {
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

  ngOnDestroy() {
    this.routerSubscription?.unsubscribe();
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
      lastActivity: this._lastActivityMs,
    };
  }
}

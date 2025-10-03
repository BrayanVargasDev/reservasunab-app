import { computed, inject, Injectable, signal, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { from, BehaviorSubject, Observable } from 'rxjs';
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
  checkStatus,
} from '../actions';
import { Registro, UsuarioLogueado } from '../interfaces';
import { CredencialesLogin } from '@auth/interfaces';
import { GeneralResponse } from '@shared/interfaces';
import { Rol } from '@permisos/interfaces';
import { STORAGE_KEYS, AUTH_CONFIG } from '../constants/storage.constants';
import { ValidationCacheService } from './validation-cache.service';
import { StorageService } from '@shared/services/storage.service';
import { IndexedDbService } from '@shared/services/indexed-db.service';
import { GlobalLoaderService } from '@shared/services/global-loader.service';
import { rxResource } from '@angular/core/rxjs-interop';

type EstadoAutenticacion = 'authenticated' | 'unauthenticated' | 'loading';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private http = inject(HttpClient);
  private qc = inject(QueryClient);
  private router = inject(Router);
  private globalLoader = inject(GlobalLoaderService);
  private storage = inject(StorageService);
  private _estadoAutenticacion = signal<EstadoAutenticacion>('loading');
  private _usuario = signal<UsuarioLogueado | null>(null);

  private _accessToken = signal<string | null>(
    localStorage.getItem(STORAGE_KEYS.TOKEN),
  );

  private _isLoading = signal<boolean>(false);
  private _lastActivityMs: number | null = null;
  private _hasRefreshToken = false;
  private _currentUrl = signal<string>('');

  constructor() {
    this.loadFromStorage();
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
        this.guardarUsuarioStorage(user);
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
    this.storage.setItem(STORAGE_KEYS.TOKEN, user.access_token || '');
    this.storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, user.refresh_token || '');
    this.storage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    this.storage.setItem(
      STORAGE_KEYS.LAST_ACTIVITY,
      user.token_expires_at || '',
    );

    this._usuario.set(user);
    this._accessToken.set(user.access_token || null);
    this._hasRefreshToken = !!user.refresh_token;
    this._estadoAutenticacion.set('authenticated');
  }

  setLoading(loading: boolean): void {
    this._isLoading.set(loading);
  }

  setToken(token: string | null): void {
    this._accessToken.set(token);
  }

  get isLoading(): boolean {
    return this._isLoading();
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      const { data, status, message } = await loginAction(this.http, {
        email,
        password,
      });

      if (status !== 'success') {
        throw new Error(message);
      }

      this.onSuccessLogin(data);
      this.globalLoader.show(
        'Iniciando sesión',
        'Verificando términos y condiciones...',
      );
      return true;
    } catch (error) {
      throw error;
    }
  }

  async logout(fromLogin: boolean = false) {
    await logoutAction(this.http);
    this.clearSession(fromLogin);
    window.location.href = '/auth/login';
  }

  clearSession(fromLogout: boolean = false): void {
    this.storage.removeItem(STORAGE_KEYS.TOKEN);
    this.storage.removeItem(STORAGE_KEYS.USER);

    if (fromLogout) {
      this.storage.removeItem(STORAGE_KEYS.PROFILE_COMPLETED);
      this.storage.removeItem(STORAGE_KEYS.TERMS_ACCEPTED);
      this.storage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      this.storage.removeItem(STORAGE_KEYS.LAST_ACTIVITY);
    }

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
        this._usuario.set(user);
        this._estadoAutenticacion.set('authenticated');
      } else {
        this._hasRefreshToken = !!refreshToken;
        this._estadoAutenticacion.set('unauthenticated');
      }
    } catch (error) {
      this._hasRefreshToken = false;
      this._estadoAutenticacion.set('unauthenticated');
    }
  }

  private guardarUsuarioStorage(user: UsuarioLogueado): void {
    const { access_token: _a, refresh_token: _r, ...safeUser } = user as any;
    try {
      this.storage.setItem(STORAGE_KEYS.USER, JSON.stringify(safeUser));
    } catch (error) {
      console.error('Error guardando usuario en localStorage:', error);
    }
  }

  public obtenerUsuarioStorage(): UsuarioLogueado | null {
    return JSON.parse(this.storage.getItem(STORAGE_KEYS.USER) || 'null');
  }

  public tienePermisos(codigo: string): boolean {
    const usuario = this._usuario();
    if (!usuario || !usuario.permisos) {
      return false;
    }

    if (usuario.rol?.nombre?.toLowerCase() === 'administrador') {
      return true;
    }

    return usuario.permisos.some(permiso => permiso.codigo === codigo);
  }

  public isSessionValid(): boolean {
    try {
      const user = this._usuario() || this.obtenerUsuarioStorage();
      if (!user || !this._hasRefreshToken) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error validando sesión:', error);
      return false;
    }
  }

  public async checkTerminosAceptados(): Promise<boolean> {
    try {
      const response = await checkTermsAccepted(this.http);
      const termsAccepted = response.data.terminos_condiciones;

      if (termsAccepted) {
        this.globalLoader.updateText(
          'Términos y condiciones aceptados',
          'Verificando datos de perfil...',
        );
      }

      return termsAccepted;
    } catch (error) {
      return false;
    }
  }

  public async checkPerfilCompletado(): Promise<boolean> {
    try {
      const response = await checkProfileCompleted(this.http);
      const profileCompleted = response.data.perfil_completo;

      if (profileCompleted) {
        this.globalLoader.updateText(
          'Perfil completo',
          'Cargando configuración...',
        );
      }

      return profileCompleted;
    } catch (error) {
      return false;
    }
  }

  public async intercambiarToken(code: string): Promise<boolean> {
    try {
      const response = await intercambiarTokenAction(this.http, code);
      const data = response.data;

      if (response.status !== 'success' || !data) {
        throw new Error('Error intercambiando token');
      }

      this.onSuccessLogin(data);
      return true;
    } catch (error) {
      return false;
    }
  }

  public async validarTerminosYPerfil(): Promise<string> {
    try {
      const termsAccepted = await this.checkTerminosAceptados();
      if (!termsAccepted) {
        return '/auth/terms-conditions';
      }

      const profileCompleted = await this.checkPerfilCompletado();
      if (!profileCompleted) {
        return '/perfil';
      }

      return '/';
    } catch (error) {
      return '/';
    }
  }

  async checkStatus() {
    const token = this.storage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    if (!token) {
      this.logout();
    }

    try {
      const { data, status, message } = await checkStatus(this.http, token);

      if (status !== 'success') {
        throw new Error('Ocurrió un error al validar la sesión: ' + message);
      }

      this.onSuccessLogin(data);
    } catch (error) {
      console.error(error);
      this.logout(true);
    }
  }

  ngOnDestroy() {}
}

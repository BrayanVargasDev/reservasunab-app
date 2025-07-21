import { computed, inject, Injectable, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import {
  injectMutation,
  QueryClient,
  injectQuery,
} from '@tanstack/angular-query-experimental';

import { loginAction, registroAction, getUser, logoutAction } from '../actions';
import { Registro, UsuarioLogueado } from '../interfaces';
import { CredencialesLogin } from '@auth/interfaces';
import { GeneralResponse } from '@shared/interfaces';
import { Rol } from '@permisos/interfaces';
import { STORAGE_KEYS, AUTH_CONFIG } from '../constants/storage.constants';

type EstadoAutenticacion = 'autenticado' | 'noAutenticado' | 'chequeando';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private qc = inject(QueryClient);
  private router = inject(Router);
  private _estadoAutenticacion = signal<EstadoAutenticacion>('chequeando');
  private _usuario = signal<UsuarioLogueado | null>(null);
  private _token = signal<string | null>(null);
  private _isLoading = signal<boolean>(false);

  constructor() {
    this.initializeFromStorage();
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
  token = computed(() => this._token());

  public estaAutenticado = computed(() => {
    return this.estadoAutenticacion() === 'autenticado';
  });

  private esRutaPublica = computed(() => {
    const url = this.router.url;
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
    enabled: !!this.getToken() && !this.esRutaPublica(),
    staleTime: AUTH_CONFIG.CACHE_DURATION,
    select: (response: GeneralResponse<UsuarioLogueado>) => {
      const user = response.data;
      if (user) {
        this.saveUserToStorage(user);
        this.updateLastActivity();
        this._usuario.set(user);
        this._token.set(user.token || this.getToken());
        this._estadoAutenticacion.set('autenticado');
      }
      return user || null;
    },
    onError: (error: any) => {
      console.error('Error en userQuery:', error);
      this.clearSession();
    },
  }));

  loginMutation = injectMutation(() => ({
    mutationKey: ['login'],
    mutationFn: (creds: CredencialesLogin) => loginAction(this.http, creds),
    onSuccess: response => {
      const user = response.data;
      if (user) {
        this.saveUserToStorage(user);
        this.setToken(user.token);
        this.updateLastActivity();
        this._usuario.set(user);
        this._token.set(user.token);
        this._estadoAutenticacion.set('autenticado');
        this.qc.setQueryData(['user'], user);
      }
    },
  }));

  logoutMutation = injectMutation(() => ({
    mutationKey: ['logout'],
    mutationFn: () => logoutAction(this.http),
    onSuccess: () => {
      this.clearSession();
    },
    onError: () => {
      this.clearSession();
    },
  }));

  setLoading(loading: boolean): void {
    this._isLoading.set(loading);
  }

  setToken(token: string | null): void {
    if (token) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      this._token.set(token);
    } else {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      this._token.set(null);
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
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.LAST_ACTIVITY);

    this._usuario.set(null);
    this._token.set(null);
    this._estadoAutenticacion.set('noAutenticado');

    this.qc.setQueryData(['user'], null);
    this.qc.removeQueries({ queryKey: ['user'] });
  }

  isAuthenticated(): boolean {
    return this.estadoAutenticacion() === 'autenticado';
  }

  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  public setUser(usuario: UsuarioLogueado | null): void {
    this._usuario.set(usuario);
  }

  public registro(params: Registro) {
    return registroAction(this.http, params);
  }

  private initializeFromStorage(): void {
    const token = this.getToken();
    const savedUser = this.getUserFromStorage();

    if (token && savedUser) {
      this._token.set(token);
      this._usuario.set(savedUser);
      this._estadoAutenticacion.set('autenticado');

      setTimeout(() => {
        if (this._estadoAutenticacion() === 'chequeando') {
          this._estadoAutenticacion.set('noAutenticado');
          this.clearSession();
        }
      }, AUTH_CONFIG.TOKEN_CHECK_TIMEOUT);
    } else if (token) {
      this._token.set(token);

      setTimeout(() => {
        if (this._estadoAutenticacion() === 'chequeando') {
          this._estadoAutenticacion.set('noAutenticado');
          this.clearSession();
        }
      }, AUTH_CONFIG.TOKEN_CHECK_TIMEOUT);
    } else {
      this._estadoAutenticacion.set('noAutenticado');
    }
  }

  private saveUserToStorage(user: UsuarioLogueado): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Error guardando usuario en localStorage:', error);
    }
  }

  public getUserFromStorage(): UsuarioLogueado | null {
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.USER);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error obteniendo usuario de localStorage:', error);
      return null;
    }
  }

  private updateLastActivity(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY, Date.now().toString());
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
    const token = this.getToken();
    if (!token) return false;

    const user = this.getUserFromStorage();
    if (!user) return false;

    const lastActivity = localStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY);
    if (lastActivity) {
      const lastActivityTime = parseInt(lastActivity);
      const now = Date.now();
      const timeDiff = now - lastActivityTime;

      if (timeDiff > 8 * 60 * 60 * 1000) {
        this.clearSession();
        return false;
      }
    }

    return true;
  }

  public refreshTokenIfNeeded(): void {
    if (this.isSessionValid()) {
      this.verificarYSincronizarUsuario();
    }
  }
}

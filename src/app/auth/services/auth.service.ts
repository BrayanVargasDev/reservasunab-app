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
    this.checkStoredToken();

    effect(() => {
      const usuario = this._usuario();
      if (usuario) {
        this._estadoAutenticacion.set('autenticado');
      } else if (this._estadoAutenticacion() !== 'chequeando') {
        this._estadoAutenticacion.set('noAutenticado');
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
    ];
    return rutasPublicas.some(ruta => url.includes(ruta));
  });

  userQuery = injectQuery(() => ({
    queryKey: ['user'],
    queryFn: () => getUser(this.http),
    retry: 0,
    enabled: !this.esRutaPublica(),
    select: (response: GeneralResponse<UsuarioLogueado>) => {
      const user = response.data;
      this._usuario.set(user);
      this._token.set(user?.token || null);
      this._estadoAutenticacion.set('autenticado');
      return user || null;
    },
  }));

  loginMutation = injectMutation(() => ({
    mutationKey: ['login'],
    mutationFn: (creds: CredencialesLogin) => loginAction(this.http, creds),
    onSuccess: user => {
      this._usuario.set(user.data || null);
      this._token.set(user.data?.token || null);
      this._estadoAutenticacion.set('autenticado');
      this.qc.setQueryData(['user'], user.data);
    },
  }));

  logoutMutation = injectMutation(() => ({
    mutationKey: ['logout'],
    mutationFn: () => logoutAction(this.http),
    onSuccess: () => {
      this.qc.setQueryData(['user'], null);
    },
  }));

  setLoading(loading: boolean): void {
    this._isLoading.set(loading);
  }

  setToken(token: string | null): void {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    this._token.set(token);
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

  isAuthenticated(): boolean {
    return this.estadoAutenticacion() === 'autenticado';
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  public setUser(usuario: UsuarioLogueado | null): void {
    this._usuario.set(usuario);
  }

  public registro(params: Registro) {
    return registroAction(this.http, params);
  }

  private checkStoredToken(): void {
    const token = this.getToken();
    if (token) {
      this._token.set(token);
      // Si hay token, el userQuery se ejecutará automáticamente
      // y actualizará el estado cuando se resuelva
    } else {
      this._estadoAutenticacion.set('noAutenticado');
    }
  }
}

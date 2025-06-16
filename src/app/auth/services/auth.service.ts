import { computed, inject, Injectable, signal } from '@angular/core';

import { loginAction } from '../actions';

export interface User {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  tipo: string;
  avatar?: string;
  permisos: string[];
}

type EstadoAutenticacion = 'autenticado' | 'noAutenticado' | 'chequeando';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _estadoAutenticacion = signal<EstadoAutenticacion>('chequeando');
  private _usuario = signal<User | null>(null);
  private _token = signal<string | null>(null);
  private _isLoading = signal<boolean>(false);

  estadoAutenticacion = computed<EstadoAutenticacion>(() => {
    if (this._estadoAutenticacion() === 'chequeando') return 'chequeando';

    if (this._usuario()) {
      return 'autenticado';
    }

    return 'noAutenticado';
  });

  usuario = computed<User | null>(() => this._usuario());
  token = computed(() => this._token());

  setLoading(loading: boolean): void {
    this._isLoading.set(loading);
  }

  get isLoading(): boolean {
    return this._isLoading();
  }

  login(email: string, password: string) {
    return loginAction({ email, password });
  }

  logout(): void {}

  isAuthenticated(): boolean {
    // const currentUser = this.currentUserValue;
    // const token = localStorage.getItem('token');
    // return !!currentUser && !!token;
    return true;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}

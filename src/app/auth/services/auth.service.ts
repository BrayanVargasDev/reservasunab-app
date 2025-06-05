import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

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
  private apiUrl = environment.apiUrl;

  private http = inject(HttpClient);

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
    return this.http.post(`${this.apiUrl}/auth/login`, {
      email: email,
      password: password,
    });
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

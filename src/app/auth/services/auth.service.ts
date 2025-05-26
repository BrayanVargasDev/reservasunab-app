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

  login(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/auth/login`, {
      email: email,
      password: password,
    });
  }

  logout(): void {}

  // hasPermission(permission: string): boolean {
  //   const user = this.currentUserValue;
  //   if (!user) return false;

  //   if (user.rol === 'admin') return true;

  //   return user.permisos.includes(permission);
  // }

  /**
   * Verificar si el usuario está autenticado
   * @returns boolean indicando si está autenticado
   */
  isAuthenticated(): boolean {
    // const currentUser = this.currentUserValue;
    // const token = localStorage.getItem('token');
    // return !!currentUser && !!token;
    return true;
  }

  /**
   * Obtener el token JWT actual
   * @returns string con el token o null
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}

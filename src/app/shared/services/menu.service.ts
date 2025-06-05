import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface MenuItem {
  id: number;
  title: string;
  url: string;
  icon: string;
  permissions?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  /**
   * Obtiene los elementos del menú desde el backend
   * @returns Observable con los elementos del menú
   */
  getMenuItems(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(`${this.apiUrl}/menu`);
  }

  /**
   * Método de respaldo para desarrollo que devuelve elementos de menú simulados
   * @returns Observable con elementos de menú de ejemplo
   */
  getMockMenuItems(): Observable<MenuItem[]> {
    const mockItems: MenuItem[] = [
      {
        id: 1,
        title: 'Home',
        url: '/dashboard',
        icon: 'bar-chart-outline',
      },
      {
        id: 2,
        title: 'Perfil',
        url: '/perfil',
        icon: 'person-outline',
      },
      {
        id: 3,
        title: 'Usuarios',
        url: '/usuarios',
        icon: 'people-outline',
        permissions: ['admin'],
      },
      {
        id: 4,
        title: 'Pagos',
        url: '/pagos',
        icon: 'card-outline',
      },
      {
        id: 5,
        title: 'Permisos',
        url: '/permisos',
        icon: 'key-outline',
        permissions: ['admin'],
      },
    ];

    return of(mockItems);
  }
}

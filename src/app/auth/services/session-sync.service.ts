import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { STORAGE_KEYS } from '../constants/storage.constants';

@Injectable({
  providedIn: 'root'
})
export class SessionSyncService {
  private authService = inject(AuthService);
  private syncInterval: any;
  private readonly SYNC_INTERVAL = 30000; // 30 segundos

  constructor() {
    this.startSync();
    this.setupStorageListener();
  }

  private startSync(): void {
    this.syncInterval = setInterval(() => {
      this.syncSession();
    }, this.SYNC_INTERVAL);
  }

  public stopSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  private syncSession(): void {
    const token = this.authService.getToken();
    const isAuthenticated = this.authService.estaAutenticado();

    if (token && isAuthenticated) {
      this.updateLastActivity();

      if (this.authService.isSessionValid()) {
        const lastCheck = localStorage.getItem('last_token_check');
        const now = Date.now();

        if (!lastCheck || (now - parseInt(lastCheck)) > 5 * 60 * 1000) {
          localStorage.setItem('last_token_check', now.toString());
          this.authService.refreshTokenIfNeeded();
        }
      }
    }
  }

  private updateLastActivity(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY, Date.now().toString());
    } catch (error) {
      console.error('Error actualizando última actividad:', error);
    }
  }

  private setupStorageListener(): void {
    window.addEventListener('storage', (event) => {
      if (event.key === STORAGE_KEYS.TOKEN) {
        if (!event.newValue) {
          this.authService.clearSession();
        } else {
          const usuario = this.authService.getUserFromStorage();
          if (usuario) {
            this.authService.setUser(usuario);
          }
        }
      }
    });
  }
}

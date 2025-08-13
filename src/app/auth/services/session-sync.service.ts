import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { STORAGE_KEYS } from '../constants/storage.constants';
import { IndexedDbService } from '@shared/services/indexed-db.service';

@Injectable({
  providedIn: 'root'
})
export class SessionSyncService {
  private authService = inject(AuthService);
  private idb = inject(IndexedDbService);
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
  const isAuthenticated = this.authService.estaAutenticado();
  // La sesión activa depende de refresh token + usuario. Refrescamos access token si procede.
  if (isAuthenticated) {
      this.updateLastActivity();

      if (this.authService.isSessionValid()) {
        void (async () => {
          const lastCheck = await this.idb.getItem('last_token_check');
          const now = Date.now();
          if (!lastCheck || now - parseInt(lastCheck) > 5 * 60 * 1000) {
            await this.idb.setItem('last_token_check', now.toString());
      this.authService.refreshTokenIfNeeded();
          }
        })();
      }
    }
  }

  private updateLastActivity(): void {
    try {
      void this.idb.setItem(STORAGE_KEYS.LAST_ACTIVITY, Date.now().toString());
    } catch (error) {
      console.error('Error actualizando última actividad:', error);
    }
  }

  private setupStorageListener(): void {
    window.addEventListener('storage', (event) => {
      if (event.key === STORAGE_KEYS.REFRESH_TOKEN) {
        if (!event.newValue) {
          this.authService.clearSession();
        }
      }
    });
  }
}

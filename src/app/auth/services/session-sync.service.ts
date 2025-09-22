import { Injectable, inject, OnDestroy } from '@angular/core';
import { AuthService } from './auth.service';
import { STORAGE_KEYS } from '../constants/storage.constants';
import { IndexedDbService } from '@shared/services/indexed-db.service';

@Injectable({
  providedIn: 'root'
})
export class SessionSyncService implements OnDestroy {
  private authService = inject(AuthService);
  private idb = inject(IndexedDbService);
  private syncInterval: any;
  private storageListener?: (event: StorageEvent) => void;
  private readonly SYNC_INTERVAL = 30000; // 30 segundos

  constructor() {
    this.startSync();
    this.setupStorageListener();
  }

  ngOnDestroy() {
    this.stopSync();
    if (this.storageListener) {
      window.removeEventListener('storage', this.storageListener);
    }
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
    if (isAuthenticated) {
      this.updateLastActivity();
    }
  }

  private updateLastActivity(): void {
    // Ya no necesitamos actualizar actividad aquí, se hace en AuthService
  }

  private setupStorageListener(): void {
    this.storageListener = (event: StorageEvent) => {
      if (event.key === STORAGE_KEYS.REFRESH_TOKEN) {
        if (!event.newValue) {
          this.authService.clearSession();
        }
      }
    };
    window.addEventListener('storage', this.storageListener);
  }
}

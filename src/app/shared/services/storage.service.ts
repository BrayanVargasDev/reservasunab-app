import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';

export interface StorageChangeEvent {
  key: string;
  oldValue: string | null;
  newValue: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private changes$ = new BehaviorSubject<StorageChangeEvent | null>(null);
  private isNative = Capacitor.isNativePlatform();

  constructor() {
    // Solo escuchar cambios en localStorage si estamos en web
    if (!this.isNative) {
      window.addEventListener('storage', event => {
        if (event.key && event.storageArea === localStorage) {
          this.changes$.next({
            key: event.key,
            oldValue: event.oldValue,
            newValue: event.newValue,
          });
        }
      });
    }
  }

  // Métodos síncronos para compatibilidad (principalmente web)
  getItem(key: string): string | null {
    try {
      if (this.isNative) {
        console.warn('getItem síncrono en móvil puede no funcionar, considera usar getItemAsync');
        return null;
      }
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error reading from storage:', error);
      return null;
    }
  }

  setItem(key: string, value: string): void {
    try {
      const oldValue = this.getItem(key);
      
      if (this.isNative) {
        // Para móvil, usar async en background
        Preferences.set({ key, value }).catch(error => 
          console.error('Error setting item in native storage:', error)
        );
      } else {
        localStorage.setItem(key, value);
      }
      
      this.changes$.next({
        key,
        oldValue,
        newValue: value,
      });
    } catch (error) {
      console.error('Error writing to storage:', error);
    }
  }

  removeItem(key: string): void {
    try {
      const oldValue = this.getItem(key);
      
      if (this.isNative) {
        Preferences.remove({ key }).catch(error => 
          console.error('Error removing item from native storage:', error)
        );
      } else {
        localStorage.removeItem(key);
      }
      
      this.changes$.next({
        key,
        oldValue,
        newValue: null,
      });
    } catch (error) {
      console.error('Error removing from storage:', error);
    }
  }

  getJSON<T>(key: string): T | null {
    const value = this.getItem(key);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch (error) {
      console.error('Error parsing JSON from storage:', error);
      return null;
    }
  }

  setJSON(key: string, value: unknown): void {
    try {
      this.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error serializing JSON to storage:', error);
    }
  }

  // Métodos async para compatibilidad total con móvil
  async getItemAsync(key: string): Promise<string | null> {
    try {
      if (this.isNative) {
        const result = await Preferences.get({ key });
        return result.value;
      } else {
        return localStorage.getItem(key);
      }
    } catch (error) {
      console.error('Error reading from storage:', error);
      return null;
    }
  }

  async setItemAsync(key: string, value: string): Promise<void> {
    try {
      const oldValue = await this.getItemAsync(key);
      
      if (this.isNative) {
        await Preferences.set({ key, value });
      } else {
        localStorage.setItem(key, value);
      }
      
      this.changes$.next({
        key,
        oldValue,
        newValue: value,
      });
    } catch (error) {
      console.error('Error writing to storage:', error);
    }
  }

  async removeItemAsync(key: string): Promise<void> {
    try {
      const oldValue = await this.getItemAsync(key);
      
      if (this.isNative) {
        await Preferences.remove({ key });
      } else {
        localStorage.removeItem(key);
      }
      
      this.changes$.next({
        key,
        oldValue,
        newValue: null,
      });
    } catch (error) {
      console.error('Error removing from storage:', error);
    }
  }

  // Observable para cambios en storage
  get changes() {
    return this.changes$.asObservable();
  }

  // Método para escuchar cambios específicos
  onChange(key: string, callback: (event: StorageChangeEvent) => void) {
    return this.changes.subscribe(event => {
      if (event && event.key === key) {
        callback(event);
      }
    });
  }
}

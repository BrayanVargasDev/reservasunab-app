import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface StorageChangeEvent {
  key: string;
  oldValue: string | null;
  newValue: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private changes$ = new BehaviorSubject<StorageChangeEvent | null>(null);

  constructor() {
    // Escuchar cambios en localStorage de otras pestañas
    window.addEventListener('storage', (event) => {
      if (event.key && event.storageArea === localStorage) {
        this.changes$.next({
          key: event.key,
          oldValue: event.oldValue,
          newValue: event.newValue
        });
      }
    });
  }

  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  setItem(key: string, value: string): void {
    try {
      const oldValue = this.getItem(key);
      localStorage.setItem(key, value);
      this.changes$.next({
        key,
        oldValue,
        newValue: value
      });
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }

  removeItem(key: string): void {
    try {
      const oldValue = this.getItem(key);
      localStorage.removeItem(key);
      this.changes$.next({
        key,
        oldValue,
        newValue: null
      });
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }

  getJSON<T>(key: string): T | null {
    const value = this.getItem(key);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch (error) {
      console.error('Error parsing JSON from localStorage:', error);
      return null;
    }
  }

  setJSON(key: string, value: unknown): void {
    try {
      this.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error serializing JSON to localStorage:', error);
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

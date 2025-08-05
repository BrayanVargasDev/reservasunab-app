import { Injectable } from '@angular/core';
import { STORAGE_KEYS } from '@auth/constants/storage.constants';

/**
 * Servicio para manejar el cache de validaciones en localStorage
 * Evita peticiones innecesarias al backend para términos y perfil completado
 */
@Injectable({
  providedIn: 'root',
})
export class ValidationCacheService {
  setPerfilCompletado(completed: boolean): void {
    try {
      localStorage.setItem(
        STORAGE_KEYS.PROFILE_COMPLETED,
        JSON.stringify(completed),
      );
    } catch (error) {
      console.error('Error guardando estado del perfil:', error);
    }
  }

  obtenerPerfilCompletado(): boolean | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PROFILE_COMPLETED);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error obteniendo estado del perfil:', error);
      return null;
    }
  }

  /**
   * Guarda el estado de términos aceptados en localStorage
   */
  setTerminosAceptados(accepted: boolean): void {
    try {
      localStorage.setItem(
        STORAGE_KEYS.TERMS_ACCEPTED,
        JSON.stringify(accepted),
      );
    } catch (error) {
      console.error('Error guardando estado de términos:', error);
    }
  }

  /**
   * Obtiene el estado de términos aceptados desde localStorage
   */
  getTerminosAceptados(): boolean | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TERMS_ACCEPTED);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error obteniendo estado de términos:', error);
      return null;
    }
  }

  /**
   * Verifica si el usuario viene de login (no hay estados guardados)
   */
  isComingFromLogin(): boolean {
    const profileStored = this.obtenerPerfilCompletado();
    const termsStored = this.getTerminosAceptados();
    return profileStored === null && termsStored === null;
  }

  limpiarEstadosValidacion(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.PROFILE_COMPLETED);
      localStorage.removeItem(STORAGE_KEYS.TERMS_ACCEPTED);
    } catch (error) {
      console.error('Error limpiando estados de validación:', error);
    }
  }

  tieneEstadosValidos(): boolean {
    const profileStored = this.obtenerPerfilCompletado();
    const termsStored = this.getTerminosAceptados();
    return profileStored !== null && termsStored !== null;
  }
}

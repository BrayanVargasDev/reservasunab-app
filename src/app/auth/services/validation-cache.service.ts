import { Injectable, inject } from '@angular/core';
import { STORAGE_KEYS } from '@auth/constants/storage.constants';
import { IndexedDbService } from '@shared/services/indexed-db.service';

/**
 * Servicio para manejar el cache de validaciones en localStorage
 * Evita peticiones innecesarias al backend para términos y perfil completado
 */
@Injectable({
  providedIn: 'root',
})
export class ValidationCacheService {
  private idb = inject(IndexedDbService);

  async setPerfilCompletado(completed: boolean): Promise<void> {
    try {
      await this.idb.setJSON(STORAGE_KEYS.PROFILE_COMPLETED, completed);
    } catch (error) {
      console.error('Error guardando estado del perfil:', error);
    }
  }

  async obtenerPerfilCompletado(): Promise<boolean | null> {
    try {
      return await this.idb.getJSON<boolean>(STORAGE_KEYS.PROFILE_COMPLETED);
    } catch (error) {
      console.error('Error obteniendo estado del perfil:', error);
      return null;
    }
  }

  /**
   * Guarda el estado de términos aceptados en localStorage
   */
  async setTerminosAceptados(accepted: boolean): Promise<void> {
    try {
      await this.idb.setJSON(STORAGE_KEYS.TERMS_ACCEPTED, accepted);
    } catch (error) {
      console.error('Error guardando estado de términos:', error);
    }
  }

  /**
   * Obtiene el estado de términos aceptados desde localStorage
   */
  async getTerminosAceptados(): Promise<boolean | null> {
    try {
      return await this.idb.getJSON<boolean>(STORAGE_KEYS.TERMS_ACCEPTED);
    } catch (error) {
      console.error('Error obteniendo estado de términos:', error);
      return null;
    }
  }

  /**
   * Verifica si el usuario viene de login (no hay estados guardados)
   */
  async isComingFromLogin(): Promise<boolean> {
    const [profileStored, termsStored] = await Promise.all([
      this.obtenerPerfilCompletado(),
      this.getTerminosAceptados(),
    ]);
    return profileStored === null && termsStored === null;
  }

  async limpiarEstadosValidacion(): Promise<void> {
    try {
      await Promise.all([
        this.idb.removeItem(STORAGE_KEYS.PROFILE_COMPLETED),
        this.idb.removeItem(STORAGE_KEYS.TERMS_ACCEPTED),
      ]);
    } catch (error) {
      console.error('Error limpiando estados de validación:', error);
    }
  }

  async tieneEstadosValidos(): Promise<boolean> {
    const [profileStored, termsStored] = await Promise.all([
      this.obtenerPerfilCompletado(),
      this.getTerminosAceptados(),
    ]);
    return profileStored !== null && termsStored !== null;
  }
}

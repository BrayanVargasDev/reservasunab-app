import { Injectable, inject } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { FileOpener } from '@capacitor-community/file-opener';

export interface DownloadOptions {
  filename: string;
  mimeType: string;
  data: Blob;
}

@Injectable({
  providedIn: 'root',
})
export class FileDownloadService {
  private platform = inject(Platform);

  /**
   * Descarga un archivo de manera multiplataforma
   * @param options Opciones de descarga
   */
  async downloadFile(options: DownloadOptions): Promise<void> {
    const { filename, mimeType, data } = options;

    if (Capacitor.isNativePlatform()) {
      await this.downloadFileNative(filename, mimeType, data);
    } else {
      this.downloadFileWeb(filename, data);
    }
  }

  /**
   * Descarga archivo en plataforma web usando el método tradicional
   */
  private downloadFileWeb(filename: string, data: Blob): void {
    const url = window.URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  /**
   * Descarga archivo en plataformas nativas usando Capacitor plugins
   */
  private async downloadFileNative(
    filename: string,
    mimeType: string,
    data: Blob,
  ): Promise<void> {
    try {
      const base64Data = await this.blobToBase64(data);

      const result = await Filesystem.writeFile({
        path: filename,
        data: base64Data,
        directory: Directory.Documents,
      });

      await FileOpener.open({
        filePath: result.uri,
        contentType: mimeType,
        openWithDefault: true,
      });
    } catch (error) {
      console.error('Error al descargar archivo en plataforma nativa:', error);
      throw error;
    }
  }

  /**
   * Convierte un Blob a base64
   */
  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Verifica si estamos en una plataforma nativa
   */
  isNativePlatform(): boolean {
    return Capacitor.isNativePlatform();
  }

  /**
   * Obtiene el directorio de descargas apropiado para la plataforma
   */
  getDownloadDirectory(): Directory {
    if (this.platform.is('ios')) {
      return Directory.Documents;
    }
    return Directory.Documents; // Para Android también usamos Documents
  }
}

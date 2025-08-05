import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GlobalLoaderService {
  private _isLoading = signal<boolean>(false);
  private _title = signal<string>('Cargando...');
  private _message = signal<string>(
    'Por favor espera mientras procesamos tu información',
  );

  public isLoading = this._isLoading.asReadonly();
  public title = this._title.asReadonly();
  public message = this._message.asReadonly();

  show(title?: string, message?: string): void {
    if (title) this._title.set(title);
    if (message) this._message.set(message);
    this._isLoading.set(true);
  }

  hide(): void {
    this._isLoading.set(false);
  }

  updateText(title: string, message?: string): void {
    this._title.set(title);
    if (message) this._message.set(message);
  }
}

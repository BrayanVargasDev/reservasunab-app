import { inject, Injectable, signal } from '@angular/core';
import { Platform } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private platform = inject(Platform);
  private _esMovil = signal(false);
  private _apiUrl = signal(environment.apiUrl || 'https://api.example.com');
  private _samlUrl = signal(
    environment.samlUrl || 'https://saml.example.com/login',
  );
  private _tenantId = signal(environment.tenantId || 'default-tenant-id');

  constructor() {
    this.checkIfMobile();
  }

  private checkIfMobile(): void {
    this._esMovil.set(this.platform.is('ios') || this.platform.is('android'));
  }

  get apiUrl() {
    return this._apiUrl();
  }

  get samlUrl() {
    return this._samlUrl();
  }

  get tenantId() {
    return this._tenantId();
  }

  get esMovil() {
    return this._esMovil;
  }
}

import { inject, Injectable, signal, computed } from '@angular/core';
import { Platform } from '@ionic/angular';

import { environment } from '@environments/environment';
import { injectQuery } from '@tanstack/angular-query-experimental';

import { getTiposDocumentos, getPantallas } from '@shared/actions';
import { getRoles } from '@permisos/actions';
import { getSedes, getCategorias } from '@shared/actions';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private platform = inject(Platform);
  private _esMovil = signal(false);
  private _apiUrl = signal(environment.apiUrl || 'https://api.example.com');
  private _samlUrl = signal(
    environment.baseUrl || 'https://saml.example.com/login',
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

  public tipoDocQuery = injectQuery(() => ({
    queryKey: ['tipoDocumento'],
    queryFn: () => getTiposDocumentos(),
  }));

  public pantallasQuery = injectQuery(() => ({
    queryKey: ['pantallas'],
    queryFn: () => getPantallas(),
  }));

  public rolesQuery = injectQuery(() => ({
    queryKey: ['roles'],
    queryFn: () => getRoles(),
  }));

  public sedesQuery = injectQuery(() => ({
    queryKey: ['sedes'],
    queryFn: () => getSedes(),
  }));

  public categoriasQuery = injectQuery(() => ({
    queryKey: ['categorias'],
    queryFn: () => getCategorias(),
  }));

  private _editando = signal(false);
  public editando = computed(() => this._editando());

  public setEditando(value: boolean): void {
    this._editando.set(value);
  }
}

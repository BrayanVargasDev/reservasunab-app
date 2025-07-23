import { inject, Injectable, signal, computed } from '@angular/core';
import { Platform } from '@ionic/angular';

import { environment } from '@environments/environment';
import { injectQuery } from '@tanstack/angular-query-experimental';

import { getTiposDocumentos, getPantallas, getGrupos } from '@shared/actions';
import { getRoles } from '@permisos/actions';
import { getSedes, getCategorias } from '@shared/actions';
import {
  GeneralResponse,
  Grupo,
  TipoDocumento,
  Sede,
} from '@shared/interfaces';
import { HttpClient } from '@angular/common/http';
import { Rol } from '@permisos/interfaces';
import { AuthService } from '@auth/services/auth.service';
import { Categoria } from '@shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private platform = inject(Platform);
  private authService = inject(AuthService);
  private http = inject(HttpClient);
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
    queryFn: () => getTiposDocumentos(this.http),
    select: (response: GeneralResponse<TipoDocumento[]>) => response.data,
    enabled: this.authService.estaAutenticado(),
  }));

  public pantallasQuery = injectQuery(() => ({
    queryKey: ['pantallas'],
    queryFn: () => getPantallas(this.http),
    enabled: this.authService.estaAutenticado(),
  }));

  public rolesQuery = injectQuery(() => ({
    queryKey: ['roles'],
    queryFn: () => getRoles(this.http),
    select: (response: GeneralResponse<Rol[]>) => response.data,
    enabled: this.authService.estaAutenticado(),
  }));

  public sedesQuery = injectQuery(() => ({
    queryKey: ['sedes'],
    queryFn: () => getSedes(this.http),
    select: (response: GeneralResponse<Sede[]>) => response.data,
    enabled: this.authService.estaAutenticado(),
  }));

  public categoriasQuery = injectQuery(() => ({
    queryKey: ['categorias'],
    queryFn: () => getCategorias(this.http),
    select: (response: GeneralResponse<Categoria[]>) => response.data,
    enabled: this.authService.estaAutenticado(),
  }));

  public gruposQuery = injectQuery(() => ({
    queryKey: ['grupos'],
    queryFn: () => getGrupos(this.http),
    select: (response: GeneralResponse<Grupo[]>) => response.data,
    enabled: this.authService.estaAutenticado(),
  }));

  private _editando = signal(false);
  public editando = computed(() => this._editando());
  private _guardando = signal(false);
  public guardando = computed(() => this._guardando());

  public setEditando(value: boolean): void {
    this._editando.set(value);
  }

  public setGuardando(value: boolean): void {
    this._guardando.set(value);
  }
}

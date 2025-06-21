import { Injectable, signal, inject, ViewContainerRef } from '@angular/core';

import { injectQuery, QueryClient } from '@tanstack/angular-query-experimental';

import { getEspacioPorId, updateGeneralEspacio } from '@espacios/actions';
import { GeneralResponse } from '@shared/interfaces/general-response.interface';
import { updateEstadoTipoConfig } from '../actions/update-estado-tipo-usuario-config.action';
import {
  createTipoUsuarioConfig,
  updateTipoUsuarioConfig,
} from '@espacios/actions';
import {
  EspacioParaConfig,
  FormEspacio,
  TipoUsuarioConfig,
} from '@espacios/interfaces';

@Injectable({
  providedIn: 'root',
})
export class EspaciosConfigService {
  private _idEspacio = signal<number | null>(null);
  private _queryClient = inject(QueryClient);
  private _pestana = signal<'general' | 'base' | 'tipoUsuario' | 'fecha'>(
    'general',
  );
  private _alertaEspacioConfigRef = signal<ViewContainerRef | null>(null);
  private _modoEdicionGeneral = signal<boolean>(false);
  private _imagen = signal<string>('');
  private _modoCreacionTipoConfig = signal<boolean>(false);
  private _filaConfigEditando = signal<{ [id: number]: boolean }>({});

  public alertaEspacioConfigRef = this._alertaEspacioConfigRef.asReadonly();
  public modoEdicionGeneral = this._modoEdicionGeneral.asReadonly();
  public pestana = this._pestana.asReadonly();
  public imagen = this._imagen.asReadonly();
  public modoCreacionTipoConfig = this._modoCreacionTipoConfig.asReadonly();
  public filaConfigEditando = this._filaConfigEditando.asReadonly();
  public espacioQuery = injectQuery(() => ({
    queryKey: ['espacio', this._idEspacio()],
    queryFn: () => getEspacioPorId(this._idEspacio() ?? 0),
    select: (response: GeneralResponse<EspacioParaConfig>) => {
      return response.data;
    },
    enabled: this._idEspacio() !== null,
    staleTime: 1000 * 60 * 5,
  }));

  public setIdEspacio(id: number | null) {
    this._idEspacio.set(id);
  }

  public setPestana(pestana: 'general' | 'base' | 'tipoUsuario' | 'fecha') {
    this._pestana.set(pestana);
  }

  public setAlertaEspacioConfigRef(
    alertaEspacioConfigRef: ViewContainerRef | null,
  ) {
    this._alertaEspacioConfigRef.set(alertaEspacioConfigRef);
  }

  public setModoEdicionGeneral(estado: boolean) {
    this._modoEdicionGeneral.set(estado);
  }

  public setImagen(imagen: string) {
    this._imagen.set(imagen);
  }

  public setModoCreacionTipoConfig(estado: boolean) {
    this._modoCreacionTipoConfig.set(estado);
  }

  public setEditandoFilaConfig(id: number, estado: boolean) {
    this._filaConfigEditando.set({
      ...this._filaConfigEditando(),
      [id]: estado,
    });
  }

  public prefetchEspacio(id: number) {
    this._queryClient.prefetchQuery({
      queryKey: ['espacio', id],
      queryFn: () => getEspacioPorId(id ?? 0),
      staleTime: 1000 * 60 * 5,
    });
  }

  public actualizarGeneral(espacio: FormEspacio, idEspacio: number) {
    return updateGeneralEspacio(espacio, idEspacio);
  }

  public async crearTipoUsuarioCofig(
    tipoUsuarioConfig: Partial<TipoUsuarioConfig>,
  ) {
    return createTipoUsuarioConfig(tipoUsuarioConfig);
  }

  public async actualizarTipoUsuarioConfig(
    id: number,
    tipoUsurioConfig: TipoUsuarioConfig,
  ) {
    return updateTipoUsuarioConfig(tipoUsurioConfig, id);
  }

  public cambiarEstadoTipoConfig(id: number, estado: string) {
    return updateEstadoTipoConfig(id, estado);
  }

  public resetAll() {
    this._modoEdicionGeneral.set(false);
    this._modoCreacionTipoConfig.set(false);
    this._filaConfigEditando.set({});
  }
}

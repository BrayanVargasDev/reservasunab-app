import { Injectable, signal, inject, ViewContainerRef } from '@angular/core';

import { injectQuery, QueryClient } from '@tanstack/angular-query-experimental';

import { getEspacioPorId, updateGeneralEspacio } from '@espacios/actions';
import { GeneralResponse } from '@shared/interfaces/general-response.interface';
import { EspacioParaConfig, FormEspacio } from '@espacios/interfaces';

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

  public alertaEspacioConfigRef = this._alertaEspacioConfigRef.asReadonly();
  public modoEdicionGeneral = this._modoEdicionGeneral.asReadonly();
  public pestana = this._pestana.asReadonly();
  public imagen = this._imagen.asReadonly();
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
}

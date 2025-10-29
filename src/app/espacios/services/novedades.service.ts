import { Injectable, signal, inject, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  injectQuery,
  injectMutation,
  injectQueryClient,
} from '@tanstack/angular-query-experimental';
import { PaginationState } from '@tanstack/angular-table';
import { Novedad } from '../interfaces/novedad.interface';
import { getNovedades } from '../actions/get-novedades.action';
import { crearNovedad } from '../actions/crear-novedad.action';
import { actualizarNovedad } from '../actions/actualizar-novedad.action';
import { eliminarNovedad } from '../actions/eliminar-novedad.action';
import { EspaciosConfigService } from './espacios-config.service';
import {
  type Meta,
  PaginatedResponse,
} from '@shared/interfaces/paginatd-response.interface';

@Injectable({
  providedIn: 'root',
})
export class NovedadesService {
  private http = inject(HttpClient);
  private queryClient = injectQueryClient();
  private espacioConfigService = inject(EspaciosConfigService);

  private _modoCreacion = signal<boolean>(false);
  private _filaEditando = signal<Record<number, boolean>>({});
  private _novedadSeleccionada = signal<Novedad | null>(null);
  private _paginacion = signal<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  private _datosPaginador = signal<Meta | null>(null);

  public modoCreacion = computed(() => this._modoCreacion());
  public filaEditando = computed(() => this._filaEditando());
  public novedadSeleccionada = computed(() => this._novedadSeleccionada());
  public paginacion = computed(() => this._paginacion());
  public datosPaginador = computed(() => this._datosPaginador());

  public novedadesQuery = injectQuery(() => ({
    queryKey: ['novedades', this.espacioConfigService.idEspacio(), this.paginacion()],
    queryFn: () =>
      getNovedades(this.http, this.espacioConfigService.idEspacio(), this.paginacion()),
    enabled: this.espacioConfigService.idEspacio() !== null,
    select: (response: PaginatedResponse<Novedad>) => {
      this._datosPaginador.set(response.meta);
      return response.data;
    },
  }));

  public crearNovedadMutation = injectMutation(() => ({
    mutationFn: (novedad: Partial<Novedad>) => crearNovedad(this.http, novedad),
    onSuccess: () => {
      this.queryClient.invalidateQueries({
        queryKey: ['novedades', this.espacioConfigService.idEspacio()],
      });
    },
  }));

  public actualizarNovedadMutation = injectMutation(() => ({
    mutationFn: ({ id, novedad }: { id: number; novedad: Partial<Novedad> }) =>
      actualizarNovedad(this.http, id, novedad),
    onSuccess: () => {
      this.queryClient.invalidateQueries({
        queryKey: ['novedades', this.espacioConfigService.idEspacio()],
      });
    },
  }));

  public eliminarNovedadMutation = injectMutation(() => ({
    mutationFn: ({ id, estado }: { id: number; estado: string }) =>
      eliminarNovedad(this.http, id, estado),
    onSuccess: () => {
      this.queryClient.invalidateQueries({
        queryKey: ['novedades', this.espacioConfigService.idEspacio()],
      });
    },
  }));

  public setModoCreacion(modo: boolean) {
    this._modoCreacion.set(modo);
  }

  public setEditandoFila(id: number, editando: boolean) {
    this._filaEditando.update(current => ({
      ...current,
      [id]: editando,
    }));
  }

  public setNovedadSeleccionada(novedad: Novedad | null) {
    this._novedadSeleccionada.set(novedad);
  }

  public setPaginacion(paginacion: PaginationState) {
    this._paginacion.set(paginacion);
  }

  public iniciarCrearNovedad() {
    this.setModoCreacion(true);
    this.setEditandoFila(0, true);
  }

  public async crearNovedad(novedad: Partial<Novedad>) {
    const idEspacio = this.espacioConfigService.idEspacio();
    if (idEspacio === null) {
      throw new Error('No se ha seleccionado un espacio');
    }

    const novedadCompleta = {
      ...novedad,
      id_espacio: idEspacio,
    };

    return crearNovedad(this.http, novedadCompleta);
  }

  public async actualizarNovedad(id: number, novedad: Novedad) {
    return actualizarNovedad(this.http, id, novedad);
  }

  public cambiarEstadoNovedad(id: number, estado: string): Promise<Novedad> {
    return this.eliminarNovedadMutation.mutateAsync({ id, estado });
  }

  public invalidarQueries() {
    this.queryClient.invalidateQueries({
      queryKey: ['novedades', this.espacioConfigService.idEspacio()],
    });
  }

  // Método para resetear el estado
  public resetAll() {
    this._modoCreacion.set(false);
    this._filaEditando.set({});
    this._novedadSeleccionada.set(null);
    this._paginacion.set({
      pageIndex: 0,
      pageSize: 10,
    });
    this._datosPaginador.set(null);
  }
}

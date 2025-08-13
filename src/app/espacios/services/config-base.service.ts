import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  injectQuery,
  injectMutation,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { getConfigsBase, saveConfigBase } from '../actions';
import { GeneralResponse } from '@shared/interfaces';
import { Configuracion } from '@espacios/interfaces';
import { EspaciosConfigService } from '@espacios/services/espacios-config.service';

@Injectable({
  providedIn: 'root',
})
export class ConfigBaseService {
  private http = inject(HttpClient);
  private queryClient = inject(QueryClient);
  private espacioConfigService = inject(EspaciosConfigService);

  configsQuery = injectQuery(() => ({
    queryKey: ['config-base', this.espacioConfigService.idEspacio()],
    queryFn: () =>
      getConfigsBase(this.http, this.espacioConfigService.idEspacio()),
    select: (response: GeneralResponse<Configuracion[]>) => response.data,
  }));

  saveConfigMutation = injectMutation(() => ({
    mutationFn: (configuracion: Configuracion) =>
      saveConfigBase(this.http, configuracion),
    onSuccess: () => {
      this.queryClient.invalidateQueries({ queryKey: ['config-base'] });
    },
  }));
}

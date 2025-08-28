import { Injectable, computed, inject, signal } from '@angular/core';
import {
  QueryClient,
  injectMutation,
  injectQuery,
} from '@tanstack/angular-query-experimental';
import { HttpClient } from '@angular/common/http';
import {
  createBeneficiario,
  deleteBeneficiario,
  getBeneficiarios,
} from '../actions';
import { Beneficiario } from '../interfaces/beneficiario.interface';

@Injectable({ providedIn: 'root' })
export class BeneficiariosService {
  private http = inject(HttpClient);
  private queryClient = inject(QueryClient);

  public beneficiariosQuery = injectQuery(() => ({
    queryKey: ['beneficiarios'],
    queryFn: () => getBeneficiarios(this.http),
    select: (res: any) => (res?.data ?? []) as Beneficiario[],
    staleTime: 5 * 60 * 1000,
  }));

  public crearMutation = injectMutation(() => ({
    mutationFn: async (payload: Omit<Beneficiario, 'id' | 'creadoEn'>) => {
      return await createBeneficiario(this.http, payload);
    },
    onSuccess: res => {
      // Invalidate and refetch list
      this.queryClient.invalidateQueries({ queryKey: ['beneficiarios'] });
    },
  }));

  public eliminarMutation = injectMutation(() => ({
    mutationFn: async (id: number) => {
      return await deleteBeneficiario(this.http, id);
    },
    onSuccess: () => {
      this.queryClient.invalidateQueries({ queryKey: ['beneficiarios'] });
    },
  }));

  public lista = computed<Beneficiario[] | undefined>(() =>
    this.beneficiariosQuery.data(),
  );
  public isLoading = computed(() => this.beneficiariosQuery.isLoading());
  public isFetching = computed(() => this.beneficiariosQuery.isFetching());
  public error = computed(() => this.beneficiariosQuery.error());

  public restantes = computed(() =>
    Math.max(0, 5 - (this.lista()?.length ?? 0)),
  );
}

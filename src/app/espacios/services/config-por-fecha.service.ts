import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FranjaHoraria } from '../interfaces/franja-horaria.interface';
import { Configuracion } from '@espacios/interfaces';
import { getConfigPorFecha } from '../actions/get-config-por-fecha.action';
import { EspaciosConfigService } from '@espacios/services/espacios-config.service';

@Injectable({
  providedIn: 'root',
})
export class ConfigPorFechaService {
  private http = inject(HttpClient);
  private _fecha = signal<string | null>(null);
  public fecha = this._fecha.asReadonly();
  private espacioConfigService = inject(EspaciosConfigService);

  public setFechaSeleccionada(fecha: string | null) {
    this._fecha.set(fecha);
  }

  public obtenerConfiguracionPorFecha() {
    return getConfigPorFecha(
      this.http,
      this.espacioConfigService.idEspacio(),
      this._fecha(),
    );
  }
}

import { Injectable, signal } from '@angular/core';
import { FranjaHoraria } from '../interfaces/franja-horaria.interface';

@Injectable({
  providedIn: 'root',
})
export class ConfigPorFechaService {
  private _nuevasFranjas = signal<FranjaHoraria[] | null>(null);

  public nuevasFranja = this._nuevasFranjas.asReadonly();

  public setNuevaFranja(franja: FranjaHoraria): void {
    this._nuevasFranjas.update(franjas => {
      if (franjas) {
        return [...franjas, franja];
      } else {
        return [franja];
      }
    });
  }

  public eliminarFranja(franja: FranjaHoraria): void {
    this._nuevasFranjas.update(franjas => {
      if (franjas) {
        return franjas.filter(f => f.id !== franja.id);
      }
      return null;
    });
  }

  public limpiarFranjas(): void {
    this._nuevasFranjas.set(null);
  }

  public obtenerFranjas(): FranjaHoraria[] {
    return this._nuevasFranjas() || [];
  }
}

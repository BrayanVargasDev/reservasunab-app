import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatearDuracion',
  standalone: true
})
export class FormatearDuracionPipe implements PipeTransform {
  /**
   * Convierte la duración en minutos a un formato legible
   * @param minutos - Duración en minutos
   * @returns String formateado (ej: "1 hora", "1h 30min", "45 minutos")
   */
  transform(minutos: number | undefined | null): string {
    if (!minutos || minutos === 0) {
      return '0 minutos';
    }

    if (minutos < 60) {
      return `${minutos} minuto${minutos === 1 ? '' : 's'}`;
    }

    const horas = Math.floor(minutos / 60);
    const minutosRestantes = minutos % 60;

    if (minutosRestantes === 0) {
      return `${horas} hora${horas === 1 ? '' : 's'}`;
    }

    return `${horas}h ${minutosRestantes}min`;
  }
}

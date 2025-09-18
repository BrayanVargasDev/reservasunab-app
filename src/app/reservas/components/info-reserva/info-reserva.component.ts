import {
  Component,
  input,
  ChangeDetectionStrategy,
  computed,
  inject,
} from '@angular/core';
import { ResumenReserva } from '../../interfaces/resumen-reserva.interface';
import { CommonModule } from '@angular/common';
import { WebIconComponent } from '@shared/components/web-icon/web-icon.component';
import { FormatearDuracionPipe } from '@shared/pipes';
import { AuthService } from '@auth/services/auth.service';
import { TipoUsuario } from '@shared/enums/usuarios.enum';
import { Elemento } from '@shared/interfaces';
import { Pago, Movimiento } from '@pagos/interfaces';

interface InfoPago {
  codigoPago: string;
  estado: string;
  valorPagado: number;
}

@Component({
  selector: 'dreservas-info-reserva',
  imports: [CommonModule, WebIconComponent, FormatearDuracionPipe],
  templateUrl: './info-reserva.component.html',
  styleUrl: './info-reserva.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  host: {
    class: 'bg-base-200 rounded-lg p-2 md:p-4',
  },
})
export class InfoReservaComponent {
  resumen = input<ResumenReserva | null>();

  private authService = inject(AuthService);

  public precioElemento = (el: Elemento): number => {
    const tipo = this.authService.usuario()?.tipo_usuario?.[0] as
      | TipoUsuario
      | undefined;

    const tipoTmp = `valor_${tipo?.toLowerCase()}` as keyof Elemento;
    return (el[tipoTmp] as number) ?? el.valor ?? 0;
  };

  public obtenerInfoPago(): InfoPago | null {
    if (!this.resumen() || !this.resumen()?.pago) {
      return null;
    }

    const pago = this.resumen()!.pago!;

    const pagosDict: Record<string, string> = {
      CREATED: 'Creado',
      PENDING: 'Pendiente',
      OK: 'Completado',
      FAILED: 'Fallido',
      EXPIRED: 'Expirado',
      NOT_AUTHORIZED: 'No Autorizado',
    };

    if ('codigo' in pago && 'estado' in pago) {
      return {
        codigoPago: pago.codigo,
        estado: pagosDict[pago.estado] || pago.estado,
        valorPagado: parseFloat(pago.valor),
      };
    } else if ('id' in pago) {
      return {
        codigoPago: `Movimiento #${pago.id}`,
        estado: 'OK',
        valorPagado: parseFloat(pago.valor),
      };
    }

    return null;
  }
}

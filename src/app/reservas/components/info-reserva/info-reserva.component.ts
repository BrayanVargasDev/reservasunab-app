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

  public precioElemento = (el: Elemento) => {
    const tipo = this.authService.usuario()?.tipo_usuario?.[0] as
      | TipoUsuario
      | undefined;

    switch (tipo) {
      case TipoUsuario.Estudiante:
        return el.valor_estudiante ?? 0;
      case TipoUsuario.Egresado:
        return el.valor_egresado ?? 0;
      case TipoUsuario.Administrativo:
        return el.valor_administrativo ?? 0;
      case TipoUsuario.Externo:
      default:
        return el.valor_externo ?? 0;
    }
  };
}

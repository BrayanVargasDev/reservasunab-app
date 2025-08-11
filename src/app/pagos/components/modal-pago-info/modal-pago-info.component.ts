import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal, viewChild, ElementRef } from '@angular/core';
import { PagoInfo } from '@pagos/interfaces';
import { PagoInfoCardComponent } from '@pagos/components/pago-info-card/pago-info-card.component';
import { PagosService } from '@pagos/services/pagos.service';

@Component({
  selector: 'modal-pago-info',
  standalone: true,
  imports: [CommonModule, PagoInfoCardComponent],
  templateUrl: './modal-pago-info.component.html',
  styleUrl: './modal-pago-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalPagoInfoComponent {
  private pagosService = inject(PagosService);

  abierto = input<boolean>(false);
  cargando = input<boolean>(false);
  error = input<string | null>(null);
  pagoInfo = input<PagoInfo | null>(null);

  cerrar = output<void>();
  recargar = output<void>();

  dialogRef = viewChild<ElementRef<HTMLDialogElement>>('dialogPagoInfo');

  constructor() {
    effect(() => {
      const dialog = this.dialogRef()?.nativeElement;
      if (!dialog) return;
      if (this.abierto()) {
        if (!dialog.open) dialog.showModal();
      } else if (dialog.open) {
        dialog.close();
      }
    });
  }

  onCerrar() {
    this.cerrar.emit();
  }

  onRecargar() {
    this.recargar.emit();
  }

  formatearMonto = this.pagosService.formatearMonto.bind(this.pagosService);
  formatearFecha = this.pagosService.formatearFecha.bind(this.pagosService);
  obtenerMensajeEstado = this.pagosService.obtenerMensajeEstado.bind(this.pagosService);
}

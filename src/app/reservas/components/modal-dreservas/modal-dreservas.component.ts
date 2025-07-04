import {
  Component,
  inject,
  Injector,
  effect,
  viewChild,
  ElementRef,
} from '@angular/core';
import { DreservasService } from '@reservas/services/dreservas.service';
import { CommonModule } from '@angular/common';
import { environment } from '@environments/environment';
import { WebIconComponent } from "../../../shared/components/web-icon/web-icon.component";

@Component({
  selector: 'modal-dreservas',
  imports: [CommonModule, WebIconComponent],
  templateUrl: './modal-dreservas.component.html',
  styleUrl: './modal-dreservas.component.scss',
})
export class ModalDreservasComponent {
  private injector = inject(Injector);
  private environment = environment;
  public dreservasService = inject(DreservasService);
  public dreservasModal =
    viewChild<ElementRef<HTMLDialogElement>>('dreservasModal');

  ngOnInit() {
    effect(
      () => {
        const modal = this.dreservasModal()?.nativeElement;
        if (!modal) return;
        if (this.dreservasService.modalAbierta()) this.abrirModal(modal);
        else this.cerrarModal(modal);
      },
      { injector: this.injector },
    );
  }
  private abrirModal(modal: HTMLDialogElement) {
    modal.showModal();
  }

  private cerrarModal(modal: HTMLDialogElement) {
    modal.close();
    this.dreservasService.cerrarModal();
  }

  public get espacioDetallesQuery() {
    return this.dreservasService.espacioDetallesQuery.data();
  }

  public getImagenUrl(ubicacion: string | undefined): string {
    if (!ubicacion) return '';
    return `${environment.apiUrl}${ubicacion}`;
  }
}

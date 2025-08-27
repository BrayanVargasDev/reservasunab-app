import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { InfoReservaComponent } from '../info-reserva/info-reserva.component';
import { ResumenReserva } from '../../interfaces/resumen-reserva.interface';
import { getMiReserva } from '../../actions/get-mi-reserva.action';
import { WebIconComponent } from '@shared/components/web-icon/web-icon.component';

@Component({
  selector: 'modal-ver-reserva',
  standalone: true,
  imports: [CommonModule, InfoReservaComponent, WebIconComponent],
  templateUrl: './modal-ver-reserva.component.html',
  styleUrl: './modal-ver-reserva.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalVerReservaComponent {
  private http = inject(HttpClient);

  public dialogRef = viewChild<ElementRef<HTMLDialogElement>>('dialog');

  public cargando = signal(false);
  public resumen = signal<ResumenReserva | null>(null);
  public error = signal<string | null>(null);

  async open(idReserva: number) {
    const dialog = this.dialogRef()?.nativeElement;
    if (!dialog) return;

    this.cargando.set(true);
    this.error.set(null);
    this.resumen.set(null);
    dialog.showModal();

    try {
      const resp = await getMiReserva(this.http, idReserva);
      this.resumen.set(resp.data ?? null);
      if (!resp.data) {
        this.error.set('No se encontraron detalles de la reserva.');
      }
    } catch (e) {
      this.error.set('Error al cargar los detalles de la reserva.');
    } finally {
      this.cargando.set(false);
    }
  }

  close() {
    const dialog = this.dialogRef()?.nativeElement;
    if (!dialog) return;
    dialog.close();
    this.resumen.set(null);
    this.error.set(null);
    this.cargando.set(false);
  }
}

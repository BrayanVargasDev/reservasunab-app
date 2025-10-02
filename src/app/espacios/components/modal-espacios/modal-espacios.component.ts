import {
  Component,
  inject,
  signal,
  viewChild,
  ElementRef,
  ViewContainerRef,
  Injector,
  effect,
  OnInit,
  ChangeDetectionStrategy,
  output,
} from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AlertasService } from '@shared/services/alertas.service';
import { FormUtils } from '@shared/utils/form.utils';
import { AppService } from '@app/app.service';
import { EspaciosService } from '@espacios/services/espacios.service';
import { Espacio, FormEspacio } from '@espacios/interfaces';
import { GeneralResponse } from '@shared/interfaces';
import { WebIconComponent } from '@shared/components/web-icon/web-icon.component';

@Component({
  selector: 'modal-espacios',
  imports: [CommonModule, ReactiveFormsModule, WebIconComponent],
  templateUrl: './modal-espacios.component.html',
  styleUrl: './modal-espacios.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalEspaciosComponent implements OnInit {
  private fb = inject(FormBuilder);
  private injector = inject(Injector);
  private alertaService = inject(AlertasService);
  private estilosAlerta = signal(
    'flex justify-center p-4 transition-all ease-in-out w-full',
  ).asReadonly();

  public guardadoExitoso = output<boolean>();

  public espaciosService = inject(EspaciosService);
  public appService = inject(AppService);
  public formUtils = FormUtils;
  public espacioForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    categoria: ['', [Validators.required]],
    sede: ['', [Validators.required]],
    permitirJugadores: [false],
    permitirExternos: [false],
    minimoJugadores: [0],
    maximoJugadores: [0],
  });

  public modalEspacios =
    viewChild<ElementRef<HTMLDialogElement>>('espaciosModal');
  public alertaFormEspacio = viewChild.required('alertaFormEspacio', {
    read: ViewContainerRef,
  });

  ngOnInit() {
    effect(
      () => {
        const modal = this.modalEspacios()?.nativeElement;
        if (!modal) return;
        if (this.espaciosService.modalAbierta()) this.abrirModal(modal);
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
    this.espaciosService.cerrarModal();
    this.espacioForm.get('minimoJugadores')?.clearValidators();
    this.espacioForm.get('maximoJugadores')?.clearValidators();
    this.espacioForm.reset();
  }

  public onPermitirJugadoresChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const minimoControl = this.espacioForm.get('minimoJugadores');
    const maximoControl = this.espacioForm.get('maximoJugadores');

    if (checkbox.checked) {
      minimoControl?.setValidators([Validators.required, Validators.min(1)]);
      maximoControl?.setValidators([Validators.required, Validators.min(1)]);
    } else {
      minimoControl?.clearValidators();
      maximoControl?.clearValidators();
    }

    minimoControl?.updateValueAndValidity();
    minimoControl?.markAsTouched();
    maximoControl?.updateValueAndValidity();
    maximoControl?.markAsTouched();
  }

  public enviarFormulario() {
    this.espacioForm.markAllAsTouched();
    if (this.espacioForm.invalid) {
      this.alertaService.error(
        'Por favor, completa todos los campos requeridos.',
        5000,
        this.alertaFormEspacio(),
        this.estilosAlerta(),
      );
      return;
    }

    const espacio = this.espacioForm.value as FormEspacio;
    if (!espacio.minimoJugadores) espacio.minimoJugadores = 0;
    if (!espacio.maximoJugadores) espacio.maximoJugadores = 0;
    espacio.permitirJugadores = espacio.permitirJugadores || false;
    espacio.permitirExternos = espacio.permitirExternos || false;

    this.espaciosService
      .guardarEsapacio(espacio)
      .then((response: GeneralResponse<Espacio>) => {
        this.espaciosService.espaciosQuery.refetch();
        this.cerrarModal(this.modalEspacios()?.nativeElement!);
        this.guardadoExitoso.emit(true);
      })
      .catch((error: GeneralResponse<Espacio>) => {
        if (this.alertaFormEspacio()) {
          const errorMessages = Object.values(error.errors!);

          this.alertaService.error(
            `Error al crear el espacio: ${errorMessages.join(', ')}`,
            5000,
            this.alertaFormEspacio(),
            this.estilosAlerta(),
          );
        }
      });
  }
}

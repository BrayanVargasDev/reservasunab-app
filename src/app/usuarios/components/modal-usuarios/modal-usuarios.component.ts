import {
  computed,
  inject,
  output,
  Component,
  OnInit,
  viewChild,
  ElementRef,
  ChangeDetectionStrategy,
  effect,
  Injector,
  ViewContainerRef,
  signal,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import Pikaday from 'pikaday';
import moment from 'moment';

import { WebIconComponent } from '@shared/components/web-icon/web-icon.component';
import { FormUtils } from '@shared/utils/form.utils';
import { UsuariosService } from '@usuarios/services/usuarios.service';
import { AppService } from '@app/app.service';
import { InputSoloNumerosDirective } from '@shared/directives/input-solo-numeros.directive';
import { AlertasService } from '@shared/services/alertas.service';
import { SaveUsuarioResponse } from '../../intefaces/save-usuario-response.interface';

@Component({
  selector: 'usuarios-gestion-modal',
  templateUrl: './modal-usuarios.component.html',
  styleUrls: ['./modal-usuarios.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    WebIconComponent,
    ReactiveFormsModule,
    InputSoloNumerosDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {},
})
export class ModalUsuariosComponent implements AfterViewInit, OnDestroy {
  private fb = inject(FormBuilder);
  private alertaService = inject(AlertasService);
  private estilosAlerta = signal(
    'flex justify-center p-4 transition-all ease-in-out w-full',
  ).asReadonly();
  private pikaday!: Pikaday;

  guardadoExitoso = output<boolean>();

  public usuarioService = inject(UsuariosService);
  public appService = inject(AppService);
  public formUtils = FormUtils;
  public usuarioForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required]],
    apellido: ['', [Validators.required]],
    email: [
      '',
      [Validators.required, Validators.pattern(FormUtils.patronEmail)],
      [FormUtils.validarRespuestaServidor],
    ],
    telefono: [
      '',
      [
        Validators.required,
        Validators.pattern(FormUtils.patronSoloNumeros),
        Validators.minLength(10),
      ],
    ],
    direccion: [''],
    imagen: [''],
    fechaNacimiento: [''],
    // rol: ['', [Validators.required]],
    tipoUsuario: ['externo'],
    documento: [
      '',
      [
        Validators.required,
        Validators.pattern(FormUtils.patronSoloNumeros),
        Validators.minLength(7),
      ],
    ],
    tipoDocumento: ['', [Validators.required]],
  });
  public usuariosModal =
    viewChild<ElementRef<HTMLDialogElement>>('usuariosModal');
  public alertaFormUsuario = viewChild.required('alertaFormUsuario', {
    read: ViewContainerRef,
  });
  public fechaNacimientoPicker = viewChild.required<
    ElementRef<HTMLInputElement>
  >('fechaNacimientoPicker');
  public contenedorCalendario = viewChild.required<ElementRef>(
    'contenedorCalendario',
  );

  ngAfterViewInit() {
    setTimeout(() => {
      this.initializePikaday();
    }, 0);
  }

  private initializePikaday() {
    this.pikaday = new Pikaday({
      field: this.fechaNacimientoPicker()?.nativeElement,
      container: this.contenedorCalendario()?.nativeElement,
      yearRange: [1950, moment().year() - 16],
      i18n: {
        previousMonth: 'Mes Anterior',
        nextMonth: 'Mes Siguiente',
        months: [
          'Enero',
          'Febrero',
          'Marzo',
          'Abril',
          'Mayo',
          'Junio',
          'Julio',
          'Agosto',
          'Septiembre',
          'Octubre',
          'Noviembre',
          'Diciembre',
        ],
        weekdays: [
          'Domingo',
          'Lunes',
          'Martes',
          'Miércoles',
          'Jueves',
          'Viernes',
          'Sábado',
        ],
        weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
      },
      format: 'DD/MM/YYYY',
      onSelect: (date: Date) => {
        const fechaFormateada = moment(date).format('DD/MM/YYYY');
        this.usuarioForm.get('fechaNacimiento')?.setValue(fechaFormateada);
      },
    });

    this.usuarioForm.get('fechaNacimiento')?.valueChanges.subscribe(value => {
      if (value) {
        const date = moment(value, 'DD/MM/YYYY');
        this.pikaday.setMoment(date, true);
      } else {
        this.pikaday.setDate(null);
      }
    });
  }

  constructor() {
    effect(() => {
      const modal = this.usuariosModal()?.nativeElement;
      if (!modal) return;
      if (this.usuarioService.modalAbierta()) this.abrirModal(modal);
      else this.cerrarModal(modal);
    });
  }

  private abrirModal(modal: HTMLDialogElement) {
    modal.showModal();

    if (this.usuarioService.modoEdicion()) {
      const usuarioAEditar = this.usuarioService.usuarioAEditar();
      if (usuarioAEditar) {
        const fechaFormateada = moment(
          usuarioAEditar.fechaNacimiento,
          'YYYY-DD-MM',
        ).format('DD/MM/YYYY');
        this.usuarioForm.patchValue({
          ...usuarioAEditar,
          fechaNacimiento: fechaFormateada,
        });

        // Sincronizar la fecha con Pikaday si está disponible
        if (this.pikaday && fechaFormateada) {
          const date = moment(fechaFormateada, 'DD/MM/YYYY');
          this.pikaday.setMoment(date, true);
        }

        this.usuarioForm
          .get('email')
          ?.removeAsyncValidators([FormUtils.validarRespuestaServidor]);
        this.usuarioForm.get('email')?.disable();
      }
    }
  }

  private cerrarModal(modal: HTMLDialogElement) {
    modal.close();
    this.usuarioService.cerrarModal();
    this.usuarioForm.get('email')?.enable();
    this.usuarioForm
      .get('email')
      ?.addAsyncValidators(FormUtils.validarRespuestaServidor);
    this.usuarioForm.reset();
  }

  public enviarFormulario() {
    console.log('Formulario enviado:', this.usuarioForm.value);
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      return;
    }

    let usuario = null;

    if (this.usuarioService.modoEdicion()) {
      usuario = {
        ...this.usuarioService.usuarioAEditar(),
        ...this.usuarioForm.value,
        fechaNacimiento: moment(
          this.usuarioForm.value.fechaNacimiento,
          'DD/MM/YYYY',
        ).format('YYYY-DD-MM'),
      };
    } else {
      usuario = this.usuarioForm.value;
    }

    this.usuarioService
      .guardarUsuario(usuario)
      .then((response: SaveUsuarioResponse) => {
        this.usuarioService.queryUsuarios.refetch();
        this.cerrarModal(this.usuariosModal()?.nativeElement!);
        this.guardadoExitoso.emit(true);
      })
      .catch((error: SaveUsuarioResponse) => {
        if (this.alertaFormUsuario()) {
          const errorMessages = Object.values(error.errors);

          this.alertaService.error(
            `Error al ${
              this.usuarioService.modoEdicion() ? 'editar' : 'crear'
            } el usuario: ${errorMessages.join(', ')}`,
            3000,
            this.alertaFormUsuario(),
            this.estilosAlerta(),
          );
        }
      });
  }

  ngOnDestroy() {
    if (this.pikaday) {
      this.pikaday.destroy();
    }
  }
}

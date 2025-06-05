import {
  computed,
  inject,
  Component,
  OnInit,
  viewChild,
  ElementRef,
  ChangeDetectionStrategy,
  effect,
  Injector,
  ViewContainerRef,
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { WebIconComponent } from '@shared/components/web-icon/web-icon.component';
import { FormUtils } from '@shared/utils/form.utils';
import { UsuariosService } from '@usuarios/services/usuarios.service';
import { AppService } from '@app/app.service';
import { InputSoloNumerosDirective } from '@shared/directives/input-solo-numeros.directive';
import { AlertasService } from '@shared/services/alertas.service';
import { signal } from '@angular/core';

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
export class ModalUsuariosComponent implements OnInit {
  private fb = inject(FormBuilder);
  private alertaService = inject(AlertasService);
  private estilosAlerta = signal(
    'flex justify-center p-4 transition-all ease-in-out w-full',
  ).asReadonly();

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

  ngOnInit() {}

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
        this.usuarioForm.patchValue({
          ...usuarioAEditar,
          fechaNacimiento: usuarioAEditar.fechaNacimiento
            ? new Date(usuarioAEditar.fechaNacimiento)
            : null,
        });

        console.log('Usuario a editar:', this.usuarioForm);
        this.usuarioForm.get('email')?.disable();
      }
    }
  }

  private cerrarModal(modal: HTMLDialogElement) {
    modal.close();
    this.usuarioService.cerrarModal();
    this.usuarioForm.get('email')?.enable();
    this.usuarioForm.reset();
  }

  public enviarFormulario() {
    console.log('Formulario enviado:', this.usuarioForm.value);
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      return;
    }

    const usuario = this.usuarioForm.value;
    this.usuarioService
      .guardarUsuario(usuario)
      .then(response => {
        this.usuarioService.queryUsuarios.refetch();
        this.cerrarModal(this.usuariosModal()?.nativeElement!);
      })
      .catch(error => {
        console.error('Error al guardar el usuario:', error);
        if (this.alertaFormUsuario()) {
          this.alertaService.error(
            `Error al ${
              this.usuarioService.modoEdicion() ? 'editar' : 'crear'
            } el usuario: ${error.message}`,
            3000,
            this.alertaFormUsuario(),
            this.estilosAlerta(),
          );
        }
      });
  }
}

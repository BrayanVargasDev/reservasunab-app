import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  viewChild,
  ElementRef,
  ViewContainerRef,
  AfterViewInit,
  signal,
  effect,
  Injector,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import Pikaday from 'pikaday';
import moment from 'moment';

import { PerfilService } from '@app/perfil/services/perfil.service';
import { AppService } from '@app/app.service';
import { FormUtils } from '@shared/utils/form.utils';
import { AlertasService } from '@shared/services/alertas.service';
import { InputSoloNumerosDirective } from '@shared/directives/input-solo-numeros.directive';

@Component({
  selector: 'app-perfil-main',
  templateUrl: './perfil-main.page.html',
  styleUrls: ['./perfil-main.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    InputSoloNumerosDirective,
  ],
  host: {
    class: 'flex flex-col grow w-full h-full',
  },
})
export class PerfilMainPage implements OnInit, OnDestroy, AfterViewInit {
  private fb = inject(FormBuilder);
  private injector = inject(Injector);
  private destroy$ = new Subject<void>();
  private alertaService = inject(AlertasService);
  private pikaday!: Pikaday;

  public perfilService = inject(PerfilService);
  public appService = inject(AppService);
  public formUtils = FormUtils;
  public avatarUrl = signal<string>('');

  public perfilForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required]],
    apellido: ['', [Validators.required]],
    email: [
      '',
      [Validators.required, Validators.pattern(FormUtils.patronEmail)],
    ],
    telefono: [
      '',
      [
        Validators.required,
        Validators.pattern(FormUtils.patronSoloNumeros),
        Validators.minLength(10),
      ],
    ],
    direccion: ['', [Validators.required]],
    fechaNacimiento: [''],
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

  public fechaNacimientoPicker = viewChild.required<
    ElementRef<HTMLInputElement>
  >('fechaNacimientoPicker');
  public contenedorCalendario = viewChild.required<ElementRef>(
    'contenedorCalendario',
  );
  public alertaPerfil = viewChild.required('alertaPerfil', {
    read: ViewContainerRef,
  });
  public inputAvatar =
    viewChild.required<ElementRef<HTMLInputElement>>('inputAvatar');

  ngOnInit() {
    effect(
      () => {
        const usuario = this.perfilService.usuario();
        if (usuario) {
          this.cargarDatosEnFormulario(usuario);
        }
      },
      {
        injector: this.injector,
      },
    );
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initializePikaday();
    }, 0);
  }

  private initializePikaday() {
    this.pikaday = new Pikaday({
      field: this.fechaNacimientoPicker()?.nativeElement,
      yearRange: [1950, moment().year() - 16],
      maxDate: moment().subtract(16, 'years').toDate(),
      i18n: this.perfilService.i18nDatePicker(),
      format: 'DD/MM/YYYY',
      onSelect: (date: Date) => {
        const fechaFormateada = moment(date).format('DD/MM/YYYY');
        this.perfilForm.get('fechaNacimiento')?.setValue(fechaFormateada);
      },
    });

    this.perfilForm.get('fechaNacimiento')?.valueChanges.subscribe(value => {
      if (value) {
        const date = moment(value, 'DD/MM/YYYY');
        this.pikaday.setMoment(date, true);
      } else {
        this.pikaday.setDate(null);
      }
    });
  }

  private cargarDatosEnFormulario(usuario: any) {
    let fechaFormateada = '';
    if (usuario.fechaNacimiento) {
      const fechaTmp = usuario.fechaNacimiento.split('T')[0];
      fechaFormateada = moment(fechaTmp, 'YYYY-MM-DD').format('DD/MM/YYYY');
    }

    this.perfilForm.patchValue({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      telefono: usuario.telefono,
      direccion: usuario.direccion,
      documento: usuario.documento,
      tipoDocumento: usuario.tipoDocumento,
      fechaNacimiento: fechaFormateada,
    });

    this.perfilForm.controls['email'].disable();

    if (usuario.documento) {
      this.perfilForm.controls['documento'].disable();
    }

    if (usuario.tipoDocumento) {
      this.perfilForm.controls['tipoDocumento'].disable();
    }

    if (this.pikaday && fechaFormateada) {
      const date = moment(fechaFormateada, 'DD/MM/YYYY');
      this.pikaday.setMoment(date, true);
    }
  }

  async guardarCambios() {
    if (this.perfilForm.invalid) {
      this.perfilForm.markAllAsTouched();
      return;
    }

    const fechaNacimiento = this.perfilForm.value.fechaNacimiento
      ? moment(this.perfilForm.value.fechaNacimiento, 'DD/MM/YYYY').format(
          'YYYY-MM-DD',
        )
      : '';

    const datosActualizados = {
      ...this.perfilService.usuario(),
      ...this.perfilForm.value,
      fechaNacimiento,
    };

    try {
      await this.perfilService.actualizarPerfilMutation.mutateAsync(
        datosActualizados,
      );

      this.alertaService.success(
        'Perfil actualizado exitosamente.',
        5000,
        this.alertaPerfil(),
        'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
      );
    } catch (error) {
      console.error('Error al guardar cambios:', error);
      this.alertaService.error(
        'Error al actualizar el perfil. Por favor, inténtalo de nuevo.',
        5000,
        this.alertaPerfil(),
        'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
      );
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();

    if (this.pikaday) {
      this.pikaday.destroy();
    }
  }
}

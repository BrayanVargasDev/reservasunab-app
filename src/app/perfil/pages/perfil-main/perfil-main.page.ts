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
  computed,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Subject,
  takeUntil,
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
} from 'rxjs';
import Pikaday from 'pikaday';
import moment from 'moment';
import { injectQuery } from '@tanstack/angular-query-experimental';

import { PerfilService } from '@app/perfil/services/perfil.service';
import { AppService } from '@app/app.service';
import { FormUtils } from '@shared/utils/form.utils';
import { AlertasService } from '@shared/services/alertas.service';
import { InputSoloNumerosDirective } from '@shared/directives/input-solo-numeros.directive';
import { Ciudad } from '@shared/interfaces';
import { WebIconComponent } from '@shared/components/web-icon/web-icon.component';
import { Usuario } from '@usuarios/intefaces';
import { UpperFirstPipe } from '@shared/pipes/upper-first.pipe';

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
    WebIconComponent,
    UpperFirstPipe,
  ],
  host: {
    class: 'flex flex-col grow w-full h-full',
  },
})
export class PerfilMainPage implements OnInit, OnDestroy, AfterViewInit {
  private fb = inject(FormBuilder);
  private injector = inject(Injector);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();
  private alertaService = inject(AlertasService);
  private pikaday!: Pikaday;
  private http = inject(HttpClient);

  public perfilService = inject(PerfilService);
  public appService = inject(AppService);
  public formUtils = FormUtils;
  public avatarUrl = signal<string>('');

  // Verificar si está en modo completar perfil
  public isCompleteProfileMode = computed(() => {
    return this.route.snapshot.queryParams['completeProfile'] === 'true';
  });

  // Control de pestañas
  public selectedTab = signal<string>('perfil');

  // Estados para el autocomplete de ciudades
  public ciudadTerminoBusqueda = signal<string>('');
  public ciudadesFiltradas = signal<Ciudad[]>([]);
  public mostrarOpcionesCiudades = signal<boolean>(false);
  public ciudadSeleccionada = signal<Ciudad | null>(null);
  public indiceOpcionSeleccionada = signal<number>(-1);
  private ciudadSearchSubject = new Subject<string>();

  // Estados para el autocomplete de ciudad de residencia
  public ciudadResidenciaTerminoBusqueda = signal<string>('');
  public ciudadesResidenciaFiltradas = signal<Ciudad[]>([]);
  public mostrarOpcionesCiudadesResidencia = signal<boolean>(false);
  public ciudadResidenciaSeleccionada = signal<Ciudad | null>(null);
  public indiceOpcionSeleccionadaResidencia = signal<number>(-1);
  private ciudadResidenciaSearchSubject = new Subject<string>();

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
    // Nuevos campos para facturación
    digitoVerificacion: [''],
    ciudadExpedicion: ['', [Validators.required]],
    ciudadResidencia: ['', [Validators.required]],
    tipoPersona: ['', [Validators.required]],
    regimenTributario: ['', [Validators.required]],
  });

  // Formulario para cambio de contraseña
  public passwordForm: FormGroup = this.fb.group(
    {
      currentPassword: ['', [Validators.required]],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(FormUtils.patronContrasena),
        ],
      ],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: [
        FormUtils.sonCamposIguales('newPassword', 'confirmPassword'),
      ],
    },
  );

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

  // Getters para estados de carga
  get cargando() {
    return this.perfilService.cargando();
  }

  get cambiandoPassword() {
    return this.perfilService.cambiarPasswordMutation.isPending();
  }

  ngOnInit() {
    this.configurarAutocompleteCiudades();

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

  private configurarAutocompleteCiudades() {
    // Configurar el debounce para la búsqueda de ciudades de expedición
    this.ciudadSearchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(termino => {
        this.filtrarCiudades(termino);
      });

    // Configurar el debounce para la búsqueda de ciudades de residencia
    this.ciudadResidenciaSearchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(termino => {
        this.filtrarCiudadesResidencia(termino);
      });

    // Inicializar con todas las ciudades usando el servicio del perfil
    effect(
      () => {
        const todasLasCiudades = this.perfilService.ciudades();
        if (todasLasCiudades && todasLasCiudades.length > 0) {
          this.ciudadesFiltradas.set(todasLasCiudades);
          this.ciudadesResidenciaFiltradas.set(todasLasCiudades);
        }
      },
      { injector: this.injector },
    );
  }

  private filtrarCiudades(termino: string) {
    const ciudadesFiltradas = this.perfilService.filtrarCiudades(termino);
    this.ciudadesFiltradas.set(ciudadesFiltradas);
  }

  private filtrarCiudadesResidencia(termino: string) {
    const ciudadesFiltradas = this.perfilService.filtrarCiudades(termino);
    this.ciudadesResidenciaFiltradas.set(ciudadesFiltradas);
  }

  public onCiudadInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const valor = input.value;

    this.ciudadTerminoBusqueda.set(valor);
    this.mostrarOpcionesCiudades.set(true);
    this.indiceOpcionSeleccionada.set(-1);
    this.ciudadSearchSubject.next(valor);

    const ciudadActual = this.ciudadSeleccionada();
    if (!ciudadActual || ciudadActual.nombre !== valor) {
      this.perfilForm.get('ciudadExpedicion')?.setValue('');
      this.ciudadSeleccionada.set(null);
    }
  }

  public onCiudadKeyDown(event: KeyboardEvent) {
    const ciudades = this.ciudadesFiltradas();
    const indiceActual = this.indiceOpcionSeleccionada();

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        const siguienteIndice =
          indiceActual < ciudades.length - 1 ? indiceActual + 1 : 0;
        this.indiceOpcionSeleccionada.set(siguienteIndice);
        break;

      case 'ArrowUp':
        event.preventDefault();
        const anteriorIndice =
          indiceActual > 0 ? indiceActual - 1 : ciudades.length - 1;
        this.indiceOpcionSeleccionada.set(anteriorIndice);
        break;

      case 'Enter':
        event.preventDefault();
        if (indiceActual >= 0 && ciudades[indiceActual]) {
          this.seleccionarCiudad(ciudades[indiceActual]);
        }
        break;

      case 'Escape':
        this.mostrarOpcionesCiudades.set(false);
        this.indiceOpcionSeleccionada.set(-1);
        break;
    }
  }

  public onCiudadResidenciaInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const valor = input.value;

    this.ciudadResidenciaTerminoBusqueda.set(valor);
    this.mostrarOpcionesCiudadesResidencia.set(true);
    this.indiceOpcionSeleccionadaResidencia.set(-1);
    this.ciudadResidenciaSearchSubject.next(valor);

    const ciudadActual = this.ciudadResidenciaSeleccionada();
    if (!ciudadActual || ciudadActual.nombre !== valor) {
      this.perfilForm.get('ciudadResidencia')?.setValue('');
      this.ciudadResidenciaSeleccionada.set(null);
    }
  }

  public onCiudadResidenciaKeyDown(event: KeyboardEvent) {
    const ciudades = this.ciudadesResidenciaFiltradas();
    const indiceActual = this.indiceOpcionSeleccionadaResidencia();

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        const siguienteIndice =
          indiceActual < ciudades.length - 1 ? indiceActual + 1 : 0;
        this.indiceOpcionSeleccionadaResidencia.set(siguienteIndice);
        break;

      case 'ArrowUp':
        event.preventDefault();
        const anteriorIndice =
          indiceActual > 0 ? indiceActual - 1 : ciudades.length - 1;
        this.indiceOpcionSeleccionadaResidencia.set(anteriorIndice);
        break;

      case 'Enter':
        event.preventDefault();
        if (indiceActual >= 0 && ciudades[indiceActual]) {
          this.seleccionarCiudadResidencia(ciudades[indiceActual]);
        }
        break;

      case 'Escape':
        this.mostrarOpcionesCiudadesResidencia.set(false);
        this.indiceOpcionSeleccionadaResidencia.set(-1);
        break;
    }
  }
  public seleccionarCiudad(ciudad: Ciudad) {
    this.ciudadSeleccionada.set(ciudad);
    this.ciudadTerminoBusqueda.set(ciudad.nombre);
    this.mostrarOpcionesCiudades.set(false);
    this.indiceOpcionSeleccionada.set(-1);
    this.perfilForm.get('ciudadExpedicion')?.setValue(ciudad.id);
  }

  public seleccionarCiudadResidencia(ciudad: Ciudad) {
    this.ciudadResidenciaSeleccionada.set(ciudad);
    this.ciudadResidenciaTerminoBusqueda.set(ciudad.nombre);
    this.mostrarOpcionesCiudadesResidencia.set(false);
    this.indiceOpcionSeleccionadaResidencia.set(-1);
    this.perfilForm.get('ciudadResidencia')?.setValue(ciudad.id);
  }

  public ocultarOpcionesCiudades() {
    setTimeout(() => {
      this.mostrarOpcionesCiudades.set(false);
      this.indiceOpcionSeleccionada.set(-1);
    }, 150);
  }

  public ocultarOpcionesCiudadesResidencia() {
    setTimeout(() => {
      this.mostrarOpcionesCiudadesResidencia.set(false);
      this.indiceOpcionSeleccionadaResidencia.set(-1);
    }, 150);
  }

  public limpiarAutocomplete() {
    this.ciudadTerminoBusqueda.set('');
    this.ciudadSeleccionada.set(null);
    this.mostrarOpcionesCiudades.set(false);
    this.indiceOpcionSeleccionada.set(-1);
    this.perfilForm.get('ciudadExpedicion')?.setValue('');

    this.ciudadResidenciaTerminoBusqueda.set('');
    this.ciudadResidenciaSeleccionada.set(null);
    this.mostrarOpcionesCiudadesResidencia.set(false);
    this.indiceOpcionSeleccionadaResidencia.set(-1);
    this.perfilForm.get('ciudadResidencia')?.setValue('');
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

  get ciudades() {
    return this.perfilService.ciudades();
  }

  private cargarDatosEnFormulario(usuario: Usuario) {
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
      // Nuevos campos de facturación
      digitoVerificacion: usuario.digitoVerificacion || '',
      ciudadExpedicion: usuario.ciudadExpedicion || '',
      ciudadResidencia: usuario.ciudadResidencia || '',
      tipoPersona: usuario.tipoPersona || '',
      regimenTributario: usuario.regimenTributario || '',
    });

    if (usuario.ciudadExpedicion) {
      const ciudadEncontrada = this.perfilService.buscarCiudadPorId(
        usuario.ciudadExpedicion,
      );
      if (ciudadEncontrada) {
        this.ciudadSeleccionada.set(ciudadEncontrada);
        this.ciudadTerminoBusqueda.set(ciudadEncontrada.nombre);
      }
    }

    if (usuario.ciudadResidencia) {
      const ciudadResidenciaEncontrada = this.perfilService.buscarCiudadPorId(
        usuario.ciudadResidencia,
      );
      if (ciudadResidenciaEncontrada) {
        this.ciudadResidenciaSeleccionada.set(ciudadResidenciaEncontrada);
        this.ciudadResidenciaTerminoBusqueda.set(
          ciudadResidenciaEncontrada.nombre,
        );
      }
    }

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

      // Si está en modo completar perfil, redirigir al dashboard
      if (this.isCompleteProfileMode()) {
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 2000);
      }
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

  cambiarTab(tab: string | number) {
    this.selectedTab.set(tab.toString());
  }

  async cambiarPassword() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const datosPassword = {
      currentPassword: this.passwordForm.value.currentPassword,
      newPassword: this.passwordForm.value.newPassword,
    };

    try {
      const success = await this.perfilService.cambiarPassword(datosPassword);

      if (success) {
        this.alertaService.success(
          'Contraseña actualizada exitosamente.',
          5000,
          this.alertaPerfil(),
          'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
        );

        this.passwordForm.reset();
      }
    } catch (error: any) {
      console.error('Error al cambiar contraseña:', error);

      // Mostrar el mensaje de error específico del servidor o un mensaje genérico
      const mensajeError =
        error?.message ||
        'Error al cambiar la contraseña. Por favor, inténtalo de nuevo.';

      this.alertaService.error(
        mensajeError,
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

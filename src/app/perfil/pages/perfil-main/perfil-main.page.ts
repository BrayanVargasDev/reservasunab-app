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
import { format, parse } from 'date-fns';
import { injectQuery } from '@tanstack/angular-query-experimental';

import { PerfilService } from '@app/perfil/services/perfil.service';
import { AppService } from '@app/app.service';
import { FormUtils } from '@shared/utils/form.utils';
import { AlertasService } from '@shared/services/alertas.service';
import { NavigationService } from '@shared/services/navigation.service';
import { ValidationCacheService } from '@auth/services/validation-cache.service';
import { InputSoloNumerosDirective } from '@shared/directives/input-solo-numeros.directive';
import { Ciudad } from '@shared/interfaces';
import { WebIconComponent } from '@shared/components/web-icon/web-icon.component';
import { Usuario } from '@usuarios/intefaces';
import { UpperFirstPipe } from '@shared/pipes/upper-first.pipe';
import { BeneficiariosComponent } from '@app/perfil/components/beneficiarios/beneficiarios.component';
import { TipoUsuario } from '@shared/enums';

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
    BeneficiariosComponent,
  ],
  host: {
    class: 'flex flex-col grow w-full h-full overflow-y-auto',
  },
})
export class PerfilMainPage implements OnInit, OnDestroy, AfterViewInit {
  private fb = inject(FormBuilder);
  private injector = inject(Injector);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();
  private alertaService = inject(AlertasService);
  private navigationService = inject(NavigationService);
  private validationCache = inject(ValidationCacheService);
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

  // Estados para el autocomplete de ciudades en la sección de facturación (expedición y residencia)
  public ciudadFactTerminoBusquedaExpedicion = signal<string>('');
  public ciudadesFactFiltradasExpedicion = signal<Ciudad[]>([]);
  public mostrarOpcionesCiudadesFactExpedicion = signal<boolean>(false);
  public ciudadFactSeleccionadaExpedicion = signal<Ciudad | null>(null);
  public indiceOpcionSeleccionadaFactExpedicion = signal<number>(-1);
  private ciudadFactExpedicionSearchSubject = new Subject<string>();

  // Autocomplete facturación - Ciudad de Residencia
  public ciudadFactTerminoBusquedaResidencia = signal<string>('');
  public ciudadesFactFiltradasResidencia = signal<Ciudad[]>([]);
  public mostrarOpcionesCiudadesFactResidencia = signal<boolean>(false);
  public ciudadFactSeleccionadaResidencia = signal<Ciudad | null>(null);
  public indiceOpcionSeleccionadaFactResidencia = signal<number>(-1);
  private ciudadFactResidenciaSearchSubject = new Subject<string>();

  public esEgresado = computed(() => {
    const usuario = this.perfilService.usuario();
    return usuario ? usuario.tipoUsuario.includes(TipoUsuario.Egresado) : false;
  });

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
    // Control para mostrar/ocultar sección de facturación y grupo anidado
    usaFacturacionDiferente: [false],
    facturacion: this.fb.group({
      nombre: [''],
      apellido: [''],
      email: ['', [Validators.pattern(FormUtils.patronEmail)]],
      telefono: [
        '',
        [
          Validators.pattern(FormUtils.patronSoloNumeros),
          Validators.minLength(10),
        ],
      ],
      documento: [
        '',
        [
          Validators.pattern(FormUtils.patronSoloNumeros),
          Validators.minLength(7),
        ],
      ],
      tipoDocumento: [''],
      digitoVerificacion: [''],
      ciudadExpedicion: [''],
      direccion: [''],
      ciudadResidencia: [''],
      tipoPersona: [''],
      regimenTributario: [''],
    }),
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

    // Validaciones condicionales para el grupo de facturación
    this.perfilForm
      .get('usaFacturacionDiferente')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((usa: boolean) => {
        const factGroup = this.perfilForm.get('facturacion') as FormGroup;
        const setReq = (ctrl: string, validators: any[]) => {
          const c = factGroup.get(ctrl);
          if (!c) return;
          c.setValidators(usa ? validators : []);
          c.updateValueAndValidity({ emitEvent: false });
        };

        setReq('nombre', [Validators.required]);
        setReq('apellido', [Validators.required]);
        setReq('email', [
          Validators.required,
          Validators.pattern(FormUtils.patronEmail),
        ]);
        setReq('telefono', [
          Validators.required,
          Validators.pattern(FormUtils.patronSoloNumeros),
          Validators.minLength(10),
        ]);
        // fechaNacimiento se mantiene opcional como en el formulario principal
        setReq('documento', [
          Validators.required,
          Validators.pattern(FormUtils.patronSoloNumeros),
          Validators.minLength(7),
        ]);
        setReq('tipoDocumento', [Validators.required]);
        setReq('ciudadExpedicion', [Validators.required]);
        // Nuevos requeridos en facturación
        setReq('direccion', [Validators.required]);
        setReq('ciudadResidencia', [Validators.required]);
        setReq('ciudadResidencia', [Validators.required]);
        setReq('tipoPersona', [Validators.required]);
        setReq('regimenTributario', [Validators.required]);

        if (!usa) {
          factGroup.reset();
        }
      });

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
    this.ciudadSearchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(termino => {
        this.filtrarCiudades(termino);
      });

    this.ciudadResidenciaSearchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(termino => {
        this.filtrarCiudadesResidencia(termino);
      });

    // Facturación - expedición
    this.ciudadFactExpedicionSearchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(termino => {
        const ciudadesFiltradas = this.perfilService.filtrarCiudades(termino);
        this.ciudadesFactFiltradasExpedicion.set(ciudadesFiltradas);
      });

    // Facturación - ciudad de residencia
    this.ciudadFactResidenciaSearchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(termino => {
        const ciudadesFiltradas = this.perfilService.filtrarCiudades(termino);
        this.ciudadesFactFiltradasResidencia.set(ciudadesFiltradas);
      });

    effect(
      () => {
        const todasLasCiudades = this.perfilService.ciudades();
        if (todasLasCiudades && todasLasCiudades.length > 0) {
          this.ciudadesFiltradas.set(todasLasCiudades);
          this.ciudadesResidenciaFiltradas.set(todasLasCiudades);
          this.ciudadesFactFiltradasExpedicion.set(todasLasCiudades);
          this.ciudadesFactFiltradasResidencia.set(todasLasCiudades);
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

  // Autocomplete Facturación - Expedición
  public onCiudadFactExpedicionInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const valor = input.value;
    this.ciudadFactTerminoBusquedaExpedicion.set(valor);
    this.mostrarOpcionesCiudadesFactExpedicion.set(true);
    this.indiceOpcionSeleccionadaFactExpedicion.set(-1);
    this.ciudadFactExpedicionSearchSubject.next(valor);

    const ciudadActual = this.ciudadFactSeleccionadaExpedicion();
    if (!ciudadActual || ciudadActual.nombre !== valor) {
      this.perfilForm.get('facturacion.ciudadExpedicion')?.setValue('');
      this.ciudadFactSeleccionadaExpedicion.set(null);
    }
  }

  public onCiudadFactExpedicionKeyDown(event: KeyboardEvent) {
    const ciudades = this.ciudadesFactFiltradasExpedicion();
    const indiceActual = this.indiceOpcionSeleccionadaFactExpedicion();
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.indiceOpcionSeleccionadaFactExpedicion.set(
          indiceActual < ciudades.length - 1 ? indiceActual + 1 : 0,
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.indiceOpcionSeleccionadaFactExpedicion.set(
          indiceActual > 0 ? indiceActual - 1 : ciudades.length - 1,
        );
        break;
      case 'Enter':
        event.preventDefault();
        if (indiceActual >= 0 && ciudades[indiceActual]) {
          this.seleccionarCiudadFactExpedicion(ciudades[indiceActual]);
        }
        break;
      case 'Escape':
        this.mostrarOpcionesCiudadesFactExpedicion.set(false);
        this.indiceOpcionSeleccionadaFactExpedicion.set(-1);
        break;
    }
  }

  public seleccionarCiudadFactExpedicion(ciudad: Ciudad) {
    this.ciudadFactSeleccionadaExpedicion.set(ciudad);
    this.ciudadFactTerminoBusquedaExpedicion.set(ciudad.nombre);
    this.mostrarOpcionesCiudadesFactExpedicion.set(false);
    this.indiceOpcionSeleccionadaFactExpedicion.set(-1);
    this.perfilForm.get('facturacion.ciudadExpedicion')?.setValue(ciudad.id);
  }

  public ocultarOpcionesCiudadesFactExpedicion() {
    setTimeout(() => {
      this.mostrarOpcionesCiudadesFactExpedicion.set(false);
      this.indiceOpcionSeleccionadaFactExpedicion.set(-1);
    }, 150);
  }

  // Autocomplete Facturación - Ciudad de Residencia
  public onCiudadFactResidenciaInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const valor = input.value;
    this.ciudadFactTerminoBusquedaResidencia.set(valor);
    this.mostrarOpcionesCiudadesFactResidencia.set(true);
    this.indiceOpcionSeleccionadaFactResidencia.set(-1);
    this.ciudadFactResidenciaSearchSubject.next(valor);

    const ciudadActual = this.ciudadFactSeleccionadaResidencia();
    if (!ciudadActual || ciudadActual.nombre !== valor) {
      this.perfilForm.get('facturacion.ciudadResidencia')?.setValue('');
      this.ciudadFactSeleccionadaResidencia.set(null);
    }
  }

  public onCiudadFactResidenciaKeyDown(event: KeyboardEvent) {
    const ciudades = this.ciudadesFactFiltradasResidencia();
    const indiceActual = this.indiceOpcionSeleccionadaFactResidencia();
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.indiceOpcionSeleccionadaFactResidencia.set(
          indiceActual < ciudades.length - 1 ? indiceActual + 1 : 0,
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.indiceOpcionSeleccionadaFactResidencia.set(
          indiceActual > 0 ? indiceActual - 1 : ciudades.length - 1,
        );
        break;
      case 'Enter':
        event.preventDefault();
        if (indiceActual >= 0 && ciudades[indiceActual]) {
          this.seleccionarCiudadFactResidencia(ciudades[indiceActual]);
        }
        break;
      case 'Escape':
        this.mostrarOpcionesCiudadesFactResidencia.set(false);
        this.indiceOpcionSeleccionadaFactResidencia.set(-1);
        break;
    }
  }

  public seleccionarCiudadFactResidencia(ciudad: Ciudad) {
    this.ciudadFactSeleccionadaResidencia.set(ciudad);
    this.ciudadFactTerminoBusquedaResidencia.set(ciudad.nombre);
    this.mostrarOpcionesCiudadesFactResidencia.set(false);
    this.indiceOpcionSeleccionadaFactResidencia.set(-1);
    this.perfilForm.get('facturacion.ciudadResidencia')?.setValue(ciudad.id);
  }

  public ocultarOpcionesCiudadesFactResidencia() {
    setTimeout(() => {
      this.mostrarOpcionesCiudadesFactResidencia.set(false);
      this.indiceOpcionSeleccionadaFactResidencia.set(-1);
    }, 150);
  }

  // Bloquear el carácter ';' y sanear inputs de dirección
  public bloquearPuntoYComa(event: KeyboardEvent) {
    if (event.key === ';') {
      event.preventDefault();
    }
  }

  public sanearDireccionInput(controlPath: string) {
    const ctrl = this.perfilForm.get(controlPath);
    if (!ctrl) return;
    const val: string = ctrl.value || '';
    if (val.includes(';')) {
      ctrl.setValue(val.replace(/;/g, ''), { emitEvent: false });
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

    this.ciudadFactTerminoBusquedaExpedicion.set('');
    this.ciudadFactSeleccionadaExpedicion.set(null);
    this.mostrarOpcionesCiudadesFactExpedicion.set(false);
    this.indiceOpcionSeleccionadaFactExpedicion.set(-1);
    this.perfilForm.get('facturacion.ciudadExpedicion')?.setValue('');

    this.ciudadFactTerminoBusquedaResidencia.set('');
    this.ciudadFactSeleccionadaResidencia.set(null);
    this.mostrarOpcionesCiudadesFactResidencia.set(false);
    this.indiceOpcionSeleccionadaFactResidencia.set(-1);
    this.perfilForm.get('facturacion.ciudadResidencia')?.setValue('');
  }

  private initializePikaday() {
    this.pikaday = new Pikaday({
      field: this.fechaNacimientoPicker()?.nativeElement,
      yearRange: [1950, new Date().getFullYear() - 16],
      maxDate: new Date(
        new Date().getFullYear() - 16,
        new Date().getMonth(),
        new Date().getDate(),
      ),
      i18n: this.perfilService.i18nDatePicker(),
      format: 'DD/MM/YYYY',
      onSelect: (date: Date) => {
        const fechaFormateada = format(date, 'dd/MM/yyyy');
        this.perfilForm.get('fechaNacimiento')?.setValue(fechaFormateada);
      },
    });

    this.perfilForm.get('fechaNacimiento')?.valueChanges.subscribe(value => {
      if (value) {
        const date = parse(value, 'dd/MM/yyyy', new Date());
        this.pikaday.setDate(date, true);
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
      fechaFormateada = format(
        parse(fechaTmp, 'yyyy-MM-dd', new Date()),
        'dd/MM/yyyy',
      );
    }

    let factTemp = null;
    // validar que no sea null y que el objeto no venga vacío {}
    if (
      usuario.facturacion !== null &&
      Object.keys(usuario.facturacion).length > 0
    ) {
      const [email, direccion] = usuario.facturacion.direccion.split(';');

      factTemp = {
        nombre: `${usuario.facturacion.primer_nombre} ${
          usuario.facturacion.segundo_nombre ?? ''
        }`.trim(),
        apellido: `${usuario.facturacion.primer_apellido} ${
          usuario.facturacion.segundo_apellido ?? ''
        }`.trim(),
        email: email || '',
        telefono: usuario.facturacion.celular || '',
        documento: usuario.facturacion.numero_documento || '',
        tipoDocumento: usuario.facturacion.tipo_documento_id || '',
        ciudadExpedicion: usuario.facturacion.ciudad_expedicion_id || '',
        direccion: direccion || '',
        ciudadResidencia:
          (usuario.facturacion as any).ciudad_residencia_id || '',
        digitoVerificacion:
          (usuario.facturacion as any).digito_verificacion || '',
        tipoPersona: usuario.facturacion.tipo_persona || '',
        regimenTributario: usuario.facturacion.regimen_tributario_id || '',
      };
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
      facturacion: factTemp,
    });

    if (
      usuario.facturacion &&
      usuario.facturacion.es_persona_facturacion &&
      usuario.facturacion.persona_facturacion_id
    ) {
      this.perfilForm.get('usaFacturacionDiferente')?.setValue(true);
    }

    if (usuario.ciudadExpedicion) {
      const ciudadEncontrada = this.perfilService.buscarCiudadPorId(
        usuario.ciudadExpedicion,
      );
      if (ciudadEncontrada) {
        this.ciudadSeleccionada.set(ciudadEncontrada);
        this.ciudadTerminoBusqueda.set(ciudadEncontrada.nombre);
      }
    }

    if (usuario.facturacion?.ciudad_expedicion_id) {
      const ciudadExpedicionEncontrada = this.perfilService.buscarCiudadPorId(
        usuario.facturacion.ciudad_expedicion_id,
      );
      if (ciudadExpedicionEncontrada) {
        this.ciudadFactSeleccionadaExpedicion.set(ciudadExpedicionEncontrada);
        this.ciudadFactTerminoBusquedaExpedicion.set(
          ciudadExpedicionEncontrada.nombre,
        );
      }
    }

    if (
      usuario.facturacion &&
      (usuario.facturacion as any).ciudad_residencia_id
    ) {
      const ciudadDirEncontrada = this.perfilService.buscarCiudadPorId(
        (usuario.facturacion as any).ciudad_residencia_id,
      );
      if (ciudadDirEncontrada) {
        this.ciudadFactSeleccionadaResidencia.set(ciudadDirEncontrada);
        this.ciudadFactTerminoBusquedaResidencia.set(
          ciudadDirEncontrada.nombre,
        );
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
      const date = parse(fechaFormateada, 'dd/MM/yyyy', new Date());
      this.pikaday.setDate(date, true);
    }
  }

  get facturacionForm(): FormGroup {
    return this.perfilForm.get('facturacion') as FormGroup;
  }

  async guardarCambios() {
    if (this.perfilForm.invalid) {
      this.perfilForm.markAllAsTouched();
      return;
    }

    const fechaNacimiento = this.perfilForm.value.fechaNacimiento
      ? format(
          parse(
            this.perfilForm.value.fechaNacimiento,
            'dd/MM/yyyy',
            new Date(),
          ),
          'yyyy-MM-dd',
        )
      : '';

    let fechaNacimientoFacturacion = '';
    const usaFacturacion = this.perfilForm.get(
      'usaFacturacionDiferente',
    )?.value;
    const facturacion = (this.perfilForm.get('facturacion') as FormGroup)
      .value as any;
    if (usaFacturacion && facturacion?.fechaNacimiento) {
      fechaNacimientoFacturacion = format(
        parse(facturacion.fechaNacimiento, 'dd/MM/yyyy', new Date()),
        'yyyy-MM-dd',
      );
    }

    const datosActualizados = {
      ...this.perfilService.usuario(),
      ...this.perfilForm.value,
      fechaNacimiento,
      facturacion: usaFacturacion ? facturacion : null,
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

      if (!this.isCompleteProfileMode()) {
        return;
      }

      this.validationCache.setPerfilCompletado(true);

      await new Promise(resolve => setTimeout(resolve, 100));

      try {
        await this.navigationService.navegarAPrimeraPaginaDisponible();

        setTimeout(() => {
          const currentUrl = this.router.url.split('?')[0]; // Solo la ruta, sin query params
          this.router.navigateByUrl(currentUrl, { replaceUrl: true });
        }, 100);
      } catch (error) {
        const navegandoFallback = await this.router.navigate(['/reservas']);
      }
    } catch (error) {
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

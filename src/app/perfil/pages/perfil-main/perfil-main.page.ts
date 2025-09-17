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
  private inicializandoFormulario = false;

  public perfilService = inject(PerfilService);
  public appService = inject(AppService);
  public formUtils = FormUtils;
  public avatarUrl = signal<string>('');

  public isCompleteProfileMode = computed(() => {
    return this.route.snapshot.queryParams['completeProfile'] === 'true';
  });

  public selectedTab = signal<string>('perfil');

  public ciudadTerminoBusqueda = signal<string>('');
  public ciudadesFiltradas = signal<Ciudad[]>([]);
  public mostrarOpcionesCiudades = signal<boolean>(false);
  public ciudadSeleccionada = signal<Ciudad | null>(null);
  public indiceOpcionSeleccionada = signal<number>(-1);
  private ciudadSearchSubject = new Subject<string>();

  public ciudadResidenciaTerminoBusqueda = signal<string>('');
  public ciudadesResidenciaFiltradas = signal<Ciudad[]>([]);
  public mostrarOpcionesCiudadesResidencia = signal<boolean>(false);
  public ciudadResidenciaSeleccionada = signal<Ciudad | null>(null);
  public indiceOpcionSeleccionadaResidencia = signal<number>(-1);
  private ciudadResidenciaSearchSubject = new Subject<string>();

  public ciudadFactTerminoBusquedaExpedicion = signal<string>('');
  public ciudadesFactFiltradasExpedicion = signal<Ciudad[]>([]);
  public mostrarOpcionesCiudadesFactExpedicion = signal<boolean>(false);
  public ciudadFactSeleccionadaExpedicion = signal<Ciudad | null>(null);
  public indiceOpcionSeleccionadaFactExpedicion = signal<number>(-1);
  private ciudadFactExpedicionSearchSubject = new Subject<string>();

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
    digitoVerificacion: [''],
    ciudadExpedicion: ['', [Validators.required]],
    ciudadResidencia: ['', [Validators.required]],
    tipoPersona: ['', [Validators.required]],
    regimenTributario: ['', [Validators.required]],
    usaFacturacionDiferente: [false],
    facturacion: this.fb.group({
      nombre: [''],
      apellido: [''],
      email: [''],
      telefono: [''],
      documento: [''],
      tipoDocumento: [''],
      digitoVerificacion: [''],
      ciudadExpedicion: [''],
      direccion: [''],
      ciudadResidencia: [''],
      tipoPersona: [''],
      regimenTributario: [''],
    }),
  });

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

  get cargando() {
    return this.perfilService.cargando();
  }

  get cambiandoPassword() {
    return this.perfilService.cambiarPasswordMutation.isPending();
  }

  ngOnInit() {
    this.configurarAutocompleteCiudades();

    this.perfilForm
      .get('usaFacturacionDiferente')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((usa: boolean) => {
        const factGroup = this.facturacionForm;

        Object.values(factGroup.controls).forEach(ctrl => {
          ctrl.clearValidators();
          ctrl.updateValueAndValidity({ emitEvent: false });
        });

        if (usa) {
          factGroup.enable({ emitEvent: false });
          factGroup.get('nombre')?.addValidators([Validators.required]);
          factGroup.get('apellido')?.addValidators([Validators.required]);
          factGroup
            .get('email')
            ?.addValidators([
              Validators.required,
              Validators.pattern(FormUtils.patronEmail),
            ]);
          factGroup
            .get('telefono')
            ?.addValidators([
              Validators.required,
              Validators.pattern(FormUtils.patronSoloNumeros),
              Validators.minLength(10),
            ]);
          factGroup
            .get('documento')
            ?.addValidators([
              Validators.required,
              Validators.pattern(FormUtils.patronSoloNumeros),
              Validators.minLength(7),
            ]);
          factGroup.get('tipoDocumento')?.addValidators([Validators.required]);
          factGroup
            .get('ciudadExpedicion')
            ?.addValidators([Validators.required]);
          factGroup.get('direccion')?.addValidators([Validators.required]);
          factGroup
            .get('ciudadResidencia')
            ?.addValidators([Validators.required]);
          factGroup.get('tipoPersona')?.addValidators([Validators.required]);
          factGroup
            .get('regimenTributario')
            ?.addValidators([Validators.required]);

          Object.values(factGroup.controls).forEach(c =>
            c.updateValueAndValidity({ emitEvent: false }),
          );
        } else {
          factGroup.reset();
          factGroup.disable({ emitEvent: false });
        }
      });

    if (!this.perfilForm.get('usaFacturacionDiferente')?.value) {
      this.facturacionForm.disable({ emitEvent: false });
    }

    this.perfilForm
      .get('tipoDocumento')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.actualizarValidacionesPerfilDocumento();
      });

    this.perfilForm
      .get('facturacion.tipoDocumento')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.actualizarValidacionesFacturacionDocumento();
      });

    this.actualizarValidacionesPerfilDocumento();
    this.actualizarValidacionesFacturacionDocumento();

    this.facturacionForm
      .get('documento')
      ?.valueChanges.pipe(
        startWith(''),
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
      )
      .subscribe(async (doc: string) => {
        if (this.inicializandoFormulario) return;
        const usa = this.perfilForm.get('usaFacturacionDiferente')?.value;
        const tipoDoc = this.facturacionForm.get('tipoDocumento')?.value;

        if (!usa || !tipoDoc) return;

        if (this.facturacionForm.disabled) return;

        const docCtrl = this.facturacionForm.get('documento');
        if (!docCtrl || !docCtrl.dirty) return;

        if (!doc || String(doc).trim().length < 7) return;
        try {
          const persona = await this.perfilService.buscarPersonaFact({
            tipo_documento_id: parseInt(tipoDoc, 10),
            numero_documento: String(doc),
          });
          if (!persona) return;

          const tipos: any[] =
            (this.appService.tipoDocQuery.data() as any) || [];
          const td = tipos.find(
            t => parseInt(t.id, 10) === parseInt(tipoDoc, 10),
          );
          const codigoDoc = td?.codigo || '';

          const confirmado = await this.alertaService.confirmacion({
            tipo: 'question',
            titulo: 'Cargar datos de facturación',
            mensaje: `Se encontraron datos de facturación para el documento <strong>${codigoDoc} ${persona.numero_documento} ${persona.primer_nombre} ${persona.primer_apellido}</strong>. ¿Deseas cargarlos y bloquear el formulario?`,
            referencia: this.alertaPerfil(),
            botones: [
              { texto: 'Cancelar', tipo: 'cancelar', estilo: 'btn-ghost' },
              { texto: 'Aceptar', tipo: 'confirmar', estilo: 'btn-secondary' },
            ],
          });

          if (!confirmado) {
            // Limpiar solo los campos autocompletados, manteniendo el documento
            const documentoActual = this.facturacionForm.get('documento')?.value;
            const tipoDocumentoActual = this.facturacionForm.get('tipoDocumento')?.value;

            this.facturacionForm.patchValue({
              nombre: '',
              apellido: '',
              email: '',
              telefono: '',
              // documento: mantener el valor actual
              // tipoDocumento: mantener el valor actual
              digitoVerificacion: '',
              ciudadExpedicion: '',
              direccion: '',
              ciudadResidencia: '',
              tipoPersona: '',
              regimenTributario: '',
            }, { emitEvent: false });

            // Restaurar los valores que queremos mantener
            this.facturacionForm.get('documento')?.setValue(documentoActual, { emitEvent: false });
            this.facturacionForm.get('tipoDocumento')?.setValue(tipoDocumentoActual, { emitEvent: false });

            // Limpiar estados de ciudades seleccionadas
            this.ciudadFactSeleccionadaExpedicion.set(null);
            this.ciudadFactTerminoBusquedaExpedicion.set('');
            this.ciudadFactSeleccionadaResidencia.set(null);
            this.ciudadFactTerminoBusquedaResidencia.set('');
            return;
          }

          const nombre = `${persona.primer_nombre} ${
            persona.segundo_nombre ?? ''
          }`.trim();
          const apellido = `${persona.primer_apellido} ${
            persona.segundo_apellido ?? ''
          }`.trim();

          const ciudadExp = this.perfilService.buscarCiudadPorId(
            persona.ciudad_expedicion_id,
          );
          const ciudadRes = this.perfilService.buscarCiudadPorId(
            persona.ciudad_residencia_id,
          );

          let email: string, direccion: string;
          if (persona.es_persona_facturacion) {
            [email, direccion] = persona.direccion.split(';');
          } else {
            email = persona.usuario?.email || '';
            direccion = persona.direccion || '';
          }

          this.facturacionForm.patchValue(
            {
              nombre,
              apellido,
              documento: persona.numero_documento,
              tipoDocumento: persona.tipo_documento_id,
              direccion: direccion || '',
              email: email || '',
              telefono: persona.celular || '',
              ciudadExpedicion: persona.ciudad_expedicion_id || '',
              ciudadResidencia: persona.ciudad_residencia_id || '',
              tipoPersona: persona.tipo_persona || '',
              regimenTributario: persona.regimen_tributario_id || '',
              digitoVerificacion: persona.digito_verificacion || '',
            },
            { emitEvent: false },
          );

          if (ciudadExp) {
            this.ciudadFactSeleccionadaExpedicion.set(ciudadExp);
            this.ciudadFactTerminoBusquedaExpedicion.set(ciudadExp.nombre);
          }
          if (ciudadRes) {
            this.ciudadFactSeleccionadaResidencia.set(ciudadRes);
            this.ciudadFactTerminoBusquedaResidencia.set(ciudadRes.nombre);
          }

          this.facturacionForm
            .get('ciudadExpedicion')
            ?.disable({ emitEvent: false });
          this.facturacionForm
            .get('ciudadResidencia')
            ?.disable({ emitEvent: false });
          this.facturacionForm.disable({ emitEvent: false });
          this.actualizarValidacionesFacturacionDocumento();
        } catch (err) {}
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

    this.ciudadFactExpedicionSearchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(termino => {
        const ciudadesFiltradas = this.perfilService.filtrarCiudades(termino);
        this.ciudadesFactFiltradasExpedicion.set(ciudadesFiltradas);
      });

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

    // Anunciar cambios a lectores de pantalla
    this.anunciarCambioAutocompletado('ciudad', valor);
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
        this.anunciarSeleccionCiudad(ciudades[siguienteIndice]);
        break;

      case 'ArrowUp':
        event.preventDefault();
        const anteriorIndice =
          indiceActual > 0 ? indiceActual - 1 : ciudades.length - 1;
        this.indiceOpcionSeleccionada.set(anteriorIndice);
        this.anunciarSeleccionCiudad(ciudades[anteriorIndice]);
        break;

      case 'Enter':
        event.preventDefault();
        if (indiceActual >= 0 && ciudades[indiceActual]) {
          this.seleccionarCiudad(ciudades[indiceActual]);
          this.anunciarSeleccionCiudad(ciudades[indiceActual], true);
        }
        break;

      case 'Escape':
        event.preventDefault();
        this.mostrarOpcionesCiudades.set(false);
        this.indiceOpcionSeleccionada.set(-1);
        this.anunciarCambioAutocompletado('ciudad', 'Lista cerrada');
        break;

      case 'Home':
        event.preventDefault();
        if (ciudades.length > 0) {
          this.indiceOpcionSeleccionada.set(0);
          this.anunciarSeleccionCiudad(ciudades[0]);
        }
        break;

      case 'End':
        event.preventDefault();
        if (ciudades.length > 0) {
          this.indiceOpcionSeleccionada.set(ciudades.length - 1);
          this.anunciarSeleccionCiudad(ciudades[ciudades.length - 1]);
        }
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

    // Anunciar cambios a lectores de pantalla
    this.anunciarCambioAutocompletado('ciudad-residencia', valor);
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
        this.anunciarSeleccionCiudad(ciudades[siguienteIndice]);
        break;

      case 'ArrowUp':
        event.preventDefault();
        const anteriorIndice =
          indiceActual > 0 ? indiceActual - 1 : ciudades.length - 1;
        this.indiceOpcionSeleccionadaResidencia.set(anteriorIndice);
        this.anunciarSeleccionCiudad(ciudades[anteriorIndice]);
        break;

      case 'Enter':
        event.preventDefault();
        if (indiceActual >= 0 && ciudades[indiceActual]) {
          this.seleccionarCiudadResidencia(ciudades[indiceActual]);
          this.anunciarSeleccionCiudad(ciudades[indiceActual], true);
        }
        break;

      case 'Escape':
        event.preventDefault();
        this.mostrarOpcionesCiudadesResidencia.set(false);
        this.indiceOpcionSeleccionadaResidencia.set(-1);
        this.anunciarCambioAutocompletado('ciudad-residencia', 'Lista cerrada');
        break;

      case 'Home':
        event.preventDefault();
        if (ciudades.length > 0) {
          this.indiceOpcionSeleccionadaResidencia.set(0);
          this.anunciarSeleccionCiudad(ciudades[0]);
        }
        break;

      case 'End':
        event.preventDefault();
        if (ciudades.length > 0) {
          this.indiceOpcionSeleccionadaResidencia.set(ciudades.length - 1);
          this.anunciarSeleccionCiudad(ciudades[ciudades.length - 1]);
        }
        break;
    }
  }

  public onCiudadFactExpedicionInputChange(event: Event) {
    if (this.facturacionForm.disabled) return;
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

    // Anunciar cambios a lectores de pantalla
    this.anunciarCambioAutocompletado('ciudad-fact-expedicion', valor);
  }

  public onCiudadFactExpedicionKeyDown(event: KeyboardEvent) {
    const ciudades = this.ciudadesFactFiltradasExpedicion();
    const indiceActual = this.indiceOpcionSeleccionadaFactExpedicion();
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        const siguienteIndice = indiceActual < ciudades.length - 1 ? indiceActual + 1 : 0;
        this.indiceOpcionSeleccionadaFactExpedicion.set(siguienteIndice);
        this.anunciarSeleccionCiudad(ciudades[siguienteIndice]);
        break;
      case 'ArrowUp':
        event.preventDefault();
        const anteriorIndice = indiceActual > 0 ? indiceActual - 1 : ciudades.length - 1;
        this.indiceOpcionSeleccionadaFactExpedicion.set(anteriorIndice);
        this.anunciarSeleccionCiudad(ciudades[anteriorIndice]);
        break;
      case 'Enter':
        event.preventDefault();
        if (indiceActual >= 0 && ciudades[indiceActual]) {
          this.seleccionarCiudadFactExpedicion(ciudades[indiceActual]);
          this.anunciarSeleccionCiudad(ciudades[indiceActual], true);
        }
        break;
      case 'Escape':
        event.preventDefault();
        this.mostrarOpcionesCiudadesFactExpedicion.set(false);
        this.indiceOpcionSeleccionadaFactExpedicion.set(-1);
        this.anunciarCambioAutocompletado('ciudad-fact-expedicion', 'Lista cerrada');
        break;
      case 'Home':
        event.preventDefault();
        if (ciudades.length > 0) {
          this.indiceOpcionSeleccionadaFactExpedicion.set(0);
          this.anunciarSeleccionCiudad(ciudades[0]);
        }
        break;
      case 'End':
        event.preventDefault();
        if (ciudades.length > 0) {
          this.indiceOpcionSeleccionadaFactExpedicion.set(ciudades.length - 1);
          this.anunciarSeleccionCiudad(ciudades[ciudades.length - 1]);
        }
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

  public onCiudadFactResidenciaInputChange(event: Event) {
    if (this.facturacionForm.disabled) return;
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

    // Anunciar cambios a lectores de pantalla
    this.anunciarCambioAutocompletado('ciudad-fact-residencia', valor);
  }

  public onCiudadFactResidenciaKeyDown(event: KeyboardEvent) {
    const ciudades = this.ciudadesFactFiltradasResidencia();
    const indiceActual = this.indiceOpcionSeleccionadaFactResidencia();
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        const siguienteIndice = indiceActual < ciudades.length - 1 ? indiceActual + 1 : 0;
        this.indiceOpcionSeleccionadaFactResidencia.set(siguienteIndice);
        this.anunciarSeleccionCiudad(ciudades[siguienteIndice]);
        break;
      case 'ArrowUp':
        event.preventDefault();
        const anteriorIndice = indiceActual > 0 ? indiceActual - 1 : ciudades.length - 1;
        this.indiceOpcionSeleccionadaFactResidencia.set(anteriorIndice);
        this.anunciarSeleccionCiudad(ciudades[anteriorIndice]);
        break;
      case 'Enter':
        event.preventDefault();
        if (indiceActual >= 0 && ciudades[indiceActual]) {
          this.seleccionarCiudadFactResidencia(ciudades[indiceActual]);
          this.anunciarSeleccionCiudad(ciudades[indiceActual], true);
        }
        break;
      case 'Escape':
        event.preventDefault();
        this.mostrarOpcionesCiudadesFactResidencia.set(false);
        this.indiceOpcionSeleccionadaFactResidencia.set(-1);
        this.anunciarCambioAutocompletado('ciudad-fact-residencia', 'Lista cerrada');
        break;
      case 'Home':
        event.preventDefault();
        if (ciudades.length > 0) {
          this.indiceOpcionSeleccionadaFactResidencia.set(0);
          this.anunciarSeleccionCiudad(ciudades[0]);
        }
        break;
      case 'End':
        event.preventDefault();
        if (ciudades.length > 0) {
          this.indiceOpcionSeleccionadaFactResidencia.set(ciudades.length - 1);
          this.anunciarSeleccionCiudad(ciudades[ciudades.length - 1]);
        }
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
    this.inicializandoFormulario = true;
    try {
      let fechaFormateada = '';
      if (usuario.fechaNacimiento) {
        const fechaTmp = usuario.fechaNacimiento.split('T')[0];
        fechaFormateada = format(
          parse(fechaTmp, 'yyyy-MM-dd', new Date()),
          'dd/MM/yyyy',
        );
      }

      let factTemp = null;

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
        this.perfilForm
          .get('usaFacturacionDiferente')
          ?.setValue(true, { emitEvent: false });
        this.facturacionForm.disable({ emitEvent: false });
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

      this.actualizarValidacionesPerfilDocumento();
      this.actualizarValidacionesFacturacionDocumento();
    } finally {
      this.inicializandoFormulario = false;
    }
  }

  get facturacionForm(): FormGroup {
    return this.perfilForm.get('facturacion') as FormGroup;
  }

  async guardarCambios() {
    if (this.perfilForm.invalid) {
      this.perfilForm.markAllAsTouched();
      this.anunciarValidacion('Formulario', false, 'contiene campos requeridos sin completar');

      // Mover foco al primer campo con error
      const primerCampoError = this.encontrarPrimerCampoConError();
      if (primerCampoError) {
        this.manejarFocoEnError(primerCampoError);
      }
      return;
    }

    this.anunciarEstadoCarga('Guardando cambios del perfil...', 'loading');

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
    const facturacion = (
      this.perfilForm.get('facturacion') as FormGroup
    ).getRawValue() as any;
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

      this.anunciarEstadoCarga('Perfil actualizado exitosamente', 'success');

      this.alertaService.success(
        'Perfil actualizado exitosamente.',
        5000,
        this.alertaPerfil(),
        'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
      );

      // Mover foco al botón de guardar para confirmar la acción
      this.manejarFocoPostAccion('boton-guardar', 500);

      if (!this.isCompleteProfileMode()) {
        return;
      }

      this.validationCache.setPerfilCompletado(true);

      await new Promise(resolve => setTimeout(resolve, 100));

      try {
        await this.navigationService.navegarAPrimeraPaginaDisponible();

        setTimeout(() => {
          const currentUrl = this.router.url.split('?')[0];
          this.router.navigateByUrl(currentUrl, { replaceUrl: true });
        }, 100);
      } catch (error) {
        const navegandoFallback = await this.router.navigate(['/reservas']);
      }
    } catch (error) {
      this.anunciarEstadoCarga('Error al guardar los cambios', 'error');
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
      this.anunciarValidacion('Formulario de contraseña', false, 'contiene campos requeridos sin completar');
      return;
    }

    this.anunciarEstadoCarga('Cambiando contraseña...', 'loading');

    const datosPassword = {
      currentPassword: this.passwordForm.value.currentPassword,
      newPassword: this.passwordForm.value.newPassword,
    };

    try {
      const success = await this.perfilService.cambiarPassword(datosPassword);

      if (success) {
        this.anunciarEstadoCarga('Contraseña actualizada exitosamente', 'success');
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

      const mensajeError =
        error?.message ||
        'Error al cambiar la contraseña. Por favor, inténtalo de nuevo.';

      this.anunciarEstadoCarga('Error al cambiar la contraseña', 'error');
      this.alertaService.error(
        mensajeError,
        5000,
        this.alertaPerfil(),
        'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
      );
    }
  }

  // Métodos de accesibilidad
  private anunciarCambioAutocompletado(tipo: string, mensaje: string) {
    const liveRegion = document.getElementById('accesibilidad-live-region');
    if (liveRegion) {
      liveRegion.textContent = mensaje;
    }
  }

  private anunciarSeleccionCiudad(ciudad: Ciudad, seleccionada: boolean = false) {
    const mensaje = seleccionada
      ? `${ciudad.nombre} seleccionada`
      : `${ciudad.nombre}`;
    this.anunciarCambioAutocompletado('ciudad', mensaje);
  }

  private anunciarEstadoCarga(mensaje: string, tipo: 'loading' | 'success' | 'error' = 'loading') {
    const liveRegion = document.getElementById('estado-live-region');
    if (liveRegion) {
      liveRegion.setAttribute('aria-live', tipo === 'error' ? 'assertive' : 'polite');
      liveRegion.textContent = mensaje;
    }
  }

  private manejarFocoPostAccion(elementoId: string, retraso: number = 100) {
    setTimeout(() => {
      const elemento = document.getElementById(elementoId);
      if (elemento) {
        elemento.focus();
        // Anunciar el cambio de foco para lectores de pantalla
        this.anunciarCambioAutocompletado('navegacion', `Enfocado en ${elemento.getAttribute('aria-label') || elementoId}`);
      }
    }, retraso);
  }

  private manejarFocoEnError(campoId: string) {
    const campo = document.getElementById(campoId);
    if (campo) {
      campo.focus();
      campo.scrollIntoView({ behavior: 'smooth', block: 'center' });
      this.anunciarValidacion(campoId, false, 'Campo con error, requiere atención');
    }
  }

  private encontrarPrimerCampoConError(): string | null {
    const camposIds = [
      'nombre', 'apellido', 'telefono', 'fechaNacimiento',
      'tipoDocumento', 'documento', 'ciudadExpedicion',
      'email', 'direccion', 'ciudadResidencia',
      'tipoPersona', 'regimenTributario'
    ];

    for (const campoId of camposIds) {
      const control = this.perfilForm.get(campoId);
      if (control && control.invalid && control.touched) {
        return campoId;
      }
    }

    // Verificar campos de facturación si están habilitados
    if (this.perfilForm.get('usaFacturacionDiferente')?.value) {
      const camposFacturacionIds = [
        'facturacion.nombre', 'facturacion.apellido', 'facturacion.telefono',
        'facturacion.email', 'facturacion.documento', 'facturacion.direccion'
      ];

      for (const campoId of camposFacturacionIds) {
        const control = this.perfilForm.get(campoId);
        if (control && control.invalid && control.touched) {
          return campoId.replace('facturacion.', 'f');
        }
      }
    }

    return null;
  }

  private anunciarValidacion(campo: string, esValido: boolean, mensaje?: string) {
    const liveRegion = document.getElementById('validacion-live-region');
    if (liveRegion) {
      const texto = esValido
        ? `${campo} válido`
        : `${campo}: ${mensaje || 'contiene errores'}`;
      liveRegion.textContent = texto;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();

    if (this.pikaday) {
      this.pikaday.destroy();
    }
  }

  public esNitPerfil(): boolean {
    const tipoId = parseInt(this.perfilForm.get('tipoDocumento')?.value, 10);
    if (!tipoId) return false;
    const tipo = this.appService.tipoDocQuery
      .data()
      ?.find(t => parseInt(t.id, 10) === tipoId);
    return !!tipo && tipo.codigo?.toUpperCase() === 'NT';
  }

  public esNitFacturacion(): boolean {
    const tipoId = parseInt(
      this.perfilForm.get('facturacion.tipoDocumento')?.value,
      10,
    );
    if (!tipoId) return false;
    const tipo = this.appService.tipoDocQuery
      .data()
      ?.find(t => parseInt(t.id, 10) === tipoId);
    return !!tipo && tipo.codigo?.toUpperCase() === 'NT';
  }

  private actualizarValidacionesPerfilDocumento() {
    const esNit = this.esNitPerfil();
    const dvCtrl = this.perfilForm.get('digitoVerificacion');
    if (dvCtrl) {
      dvCtrl.clearValidators();
      dvCtrl.updateValueAndValidity({ emitEvent: false });
    }
  }

  private actualizarValidacionesFacturacionDocumento() {
    const esNit = this.esNitFacturacion();
    const factGroup = this.perfilForm.get('facturacion') as FormGroup;
    if (!factGroup) return;
    if (
      !this.perfilForm.get('usaFacturacionDiferente')?.value ||
      factGroup.disabled
    ) {
      const dv = factGroup.get('digitoVerificacion');
      dv?.clearValidators();
      dv?.updateValueAndValidity({ emitEvent: false });
      return;
    }
    const dvCtrl = factGroup.get('digitoVerificacion');
    if (dvCtrl) {
      if (esNit) {
        dvCtrl.setValidators([
          Validators.required,
          Validators.pattern(FormUtils.patronSoloNumeros),
          Validators.minLength(1),
          Validators.maxLength(1),
        ]);
      } else {
        dvCtrl.clearValidators();
        dvCtrl.setValue('', { emitEvent: false });
      }
      dvCtrl.updateValueAndValidity({ emitEvent: false });
    }
  }
}

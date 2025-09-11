import {
  Component,
  inject,
  Injector,
  signal,
  viewChild,
  ElementRef,
  ViewContainerRef,
  ChangeDetectionStrategy,
  OnInit,
  AfterViewInit,
  effect,
  OnDestroy,
  ViewEncapsulation,
  CUSTOM_ELEMENTS_SCHEMA,
  computed,
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import {
  ContentChange,
  QuillEditorComponent,
  QuillViewHTMLComponent,
} from 'ngx-quill';
import Quill from 'quill';

import { EspaciosService } from '@espacios/services/espacios.service';
import { EspaciosConfigService } from '@espacios/services/espacios-config.service';
import { FormEspacio, Espacio, EspacioParaConfig } from '@espacios/interfaces';
import { AlertasService } from '@shared/services/alertas.service';
import { FormUtils } from '@shared/utils/form.utils';
import { GeneralResponse } from '@shared/interfaces';
import { AppService } from '@app/app.service';
import { ImagenDropComponent } from '../imagen-drop/imagen-drop.component';
import { environment } from '@environments/environment';
import { AuthService } from '@auth/services/auth.service';
import { ConfigBaseService } from '@espacios/services/config-base.service';
import { tr } from 'date-fns/locale';

@Component({
  selector: 'espacio-general',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ImagenDropComponent,
    QuillEditorComponent,
    QuillViewHTMLComponent,
  ],
  templateUrl: './espacio-general.component.html',
  styleUrl: './espacio-general.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class EspacioGeneralComponent implements AfterViewInit, OnDestroy {
  private fb = inject(FormBuilder);
  private injector = inject(Injector);
  private alertaService = inject(AlertasService);
  private estilosAlerta = signal(
    'fixed bottom-10 right-10 p-4 transition-all ease-in-out max-w-sm',
  ).asReadonly();
  private file = signal<File | null>(null);
  private enviroment = environment;
  private configBaseService = inject(ConfigBaseService);

  public authService = inject(AuthService);
  public espaciosService = inject(EspaciosService);
  public espacioConfigService = inject(EspaciosConfigService);
  public appService = inject(AppService);
  public formUtils = FormUtils;
  public espacioForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    categoria: ['', [Validators.required]],
    sede: ['', [Validators.required]],
    permitirJugadores: [false],
    permitirExternos: [false],
    aprobarReservas: [false],
    limiteTiempoReserva: [null, [Validators.required, Validators.min(0)]],
    despuesHora: [false],
    codigoEdificio: [null, [Validators.required]],
    codigoEspacio: [
      null,
      [Validators.required, Validators.pattern('[0-9A-Za-z ]+')],
    ],
    minimoJugadores: [''],
    maximoJugadores: [''],
    reservasSimultaneas: [1, [Validators.min(1)]],
    pagoMensualidad: [false],
    valorMensualidad: [{ value: null, disabled: true }, [Validators.min(0)]],
  });
  public tiltuloImagen = signal<{ nombre: string; peso: string } | null>(null);
  public edificios = computed(() => this.espaciosService.edificiosQuery.data());
  // Configuración del editor Quill sin imágenes ni elementos binarios
  public quillConfig = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'], // toggled buttons
      ['blockquote', 'code-block'],

      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
      [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
      [{ direction: 'rtl' }], // text direction

      [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],

      ['clean'], // remove formatting button
      ['link'], // link button (sin imagen)
    ],
    modules: {
      // Deshabilitar el módulo de imágenes explícitamente
      imageResize: false,
      imageCompress: false,
    },
  };

  public modalEspacios =
    viewChild<ElementRef<HTMLDialogElement>>('espaciosModal');
  public espacioImagenRef =
    viewChild<ElementRef<HTMLImageElement>>('espacioImagenRef');
  public editor = viewChild<QuillEditorComponent>('editor');

  ngAfterViewInit() {
    effect(
      () => {
        const espacio = this.espacioConfigService.espacioQuery.data();
        const isLoading = this.espacioConfigService.espacioQuery.isLoading();
        const isError = this.espacioConfigService.espacioQuery.isError();

        if (isError) {
          this.alertaService.error(
            'No se pudo cargar el espacio. Por favor, inténtalo de nuevo más tarde.',
            5000,
            this.espacioConfigService.alertaEspacioConfigRef()!,
            this.estilosAlerta(),
          );
          return;
        }

        if (!isLoading && espacio) {
          this.cargarDatosEspacio(espacio);
        }
      },
      { injector: this.injector },
    );

    this.configurarEditorQuill();
  }

  private configurarEditorQuill() {
    setTimeout(() => {
      const editorComponent = this.editor();
      if (editorComponent && editorComponent.quillEditor) {
        const quill = editorComponent.quillEditor;

        quill.clipboard.addMatcher(
          Node.ELEMENT_NODE,
          (node: any, delta: any) => {
            const ops = delta.ops || [];
            const filteredOps = ops.filter((op: any) => {
              if (
                op.insert &&
                typeof op.insert === 'object' &&
                op.insert.image
              ) {
                return false;
              }
              return true;
            });

            const Delta = Quill.import('delta');
            return new Delta(filteredOps);
          },
        );

        const editorContainer = quill.container;
        editorContainer.addEventListener('drop', (e: DragEvent) => {
          const files = e.dataTransfer?.files;
          if (files && files.length > 0) {
            e.preventDefault();
            e.stopPropagation();
            this.alertaService.error(
              'No se permite insertar archivos en el editor de texto.',
              3000,
              this.espacioConfigService.alertaEspacioConfigRef()!,
              this.estilosAlerta(),
            );
          }
        });
      }
    }, 100);
  }

  get imagen() {
    return this.espacioConfigService.imagen();
  }

  private cargarDatosEspacio(espacio: EspacioParaConfig) {
    try {
      this.espacioForm.patchValue({
        nombre: espacio?.nombre || '',
        descripcion: espacio?.descripcion || '',
        categoria: espacio?.categoria?.id || '',
        sede: espacio?.sede?.id || '',
        permitirJugadores: espacio?.agregar_jugadores || false,
        permitirExternos: espacio?.permite_externos || false,
        aprobarReservas: espacio?.aprobar_reserva ?? false,
        limiteTiempoReserva: espacio?.tiempo_limite_reserva || null,
        despuesHora: espacio.despues_hora || false,
        codigoEdificio: espacio?.id_edificio || '',
        codigoEspacio: espacio?.codigo || '',
        minimoJugadores: espacio?.minimo_jugadores || '',
        maximoJugadores: espacio?.maximo_jugadores || '',
        reservasSimultaneas: espacio?.reservas_simultaneas || 1,
        pagoMensualidad: espacio?.pago_mensual || false,
        valorMensualidad: espacio?.valor_mensualidad ?? null,
      });

      if (espacio.imagen) {
        this.espacioConfigService.setImagen(
          `${this.enviroment.apiUrl}${espacio.imagen.ubicacion}`,
        );
        this.tiltuloImagen.set({
          nombre: espacio.imagen.titulo,
          peso: '',
        });
      }

      if (espacio?.agregar_jugadores) {
        const minimoControl = this.espacioForm.get('minimoJugadores');
        const maximoControl = this.espacioForm.get('maximoJugadores');

        minimoControl?.setValidators([Validators.required, Validators.min(1)]);
        maximoControl?.setValidators([Validators.required, Validators.min(1)]);
        minimoControl?.updateValueAndValidity();
        maximoControl?.updateValueAndValidity();
      }

      const pagoMensualidadCtrl = this.espacioForm.get('pagoMensualidad');
      const valorMensualidadCtrl = this.espacioForm.get('valorMensualidad');
      const enEdicion = this.espacioConfigService.modoEdicionGeneral();

      if (enEdicion && pagoMensualidadCtrl?.value) {
        valorMensualidadCtrl?.enable({ emitEvent: false });
        valorMensualidadCtrl?.setValidators([
          Validators.required,
          Validators.min(0),
        ]);
      } else {
        valorMensualidadCtrl?.disable({ emitEvent: false });
        valorMensualidadCtrl?.clearValidators();
      }

      valorMensualidadCtrl?.updateValueAndValidity({ emitEvent: false });

      if (!this.espacioConfigService.modoEdicionGeneral()) {
        this.espacioForm.disable();
      }
    } catch (error) {
      console.error('Error al cargar datos del espacio:', error);
      this.alertaService.error(
        'Error al cargar los datos del espacio.',
        5000,
        this.espacioConfigService.alertaEspacioConfigRef()!,
        this.estilosAlerta(),
      );
    }
  }

  public async onAprobarReservasChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      // Mostrar confirmación
      const confirmado = await this.alertaService.confirmacion({
        referencia: this.espacioConfigService.alertaEspacioConfigRef()!,
        titulo: 'Confirmar cambio',
        tipo: 'warning',
        mensaje:
          'Este cambio hará que <strong>todas las franjas horarias</strong> de este espacio (base y futuras) tengan <strong>valor 0</strong>. Para revertirlo tendrás que reconfigurar manualmente las franjas horarias. ¿Deseas continuar?',
        botones: [
          { texto: 'Cancelar', tipo: 'cancelar', estilo: 'btn-ghost' },
          {
            texto: 'Confirmar',
            tipo: 'confirmar',
            estilo: 'btn-warning',
          },
        ],
      });

      if (!confirmado) {
        this.espacioForm.get('aprobarReservas')?.setValue(false, {
          emitEvent: false,
        });
        return;
      }
    } else {
      // Si se desmarca no se pide confirmación, simplemente queda false
    }
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
        this.espacioConfigService.alertaEspacioConfigRef()!,
        this.estilosAlerta(),
      );
      return;
    }

    const espacio = {
      ...this.espacioForm.value,
      imagen: this.file(),
    };

    this.espacioConfigService
      .actualizarGeneral(
        espacio,
        this.espacioConfigService.espacioQuery.data()?.id || 0,
      )
      .then((response: GeneralResponse<Espacio>) => {
        this.alertaService.success(
          'Espacio actualizado exitosamente.',
          5000,
          this.espacioConfigService.alertaEspacioConfigRef()!,
          this.estilosAlerta(),
        );
        this.espacioConfigService.espacioQuery.refetch();
        this.espaciosService.espaciosQuery.refetch();
        this.configBaseService.configsQuery.refetch();
        this.cancelarEditar();
      })
      .catch((error: GeneralResponse<Espacio>) => {
        console.error('Error al actualizar espacio:', error);

        let errorMessage = 'Error al actualizar el espacio.';

        if (error?.errors) {
          const errorMessages = Object.values(error.errors);
          errorMessage = `Error al actualizar el espacio: ${errorMessages.join(
            ', ',
          )}`;
        } else if (error?.message) {
          errorMessage = `Error al actualizar el espacio: ${error.message}`;
        }

        this.alertaService.error(
          errorMessage,
          5000,
          this.espacioConfigService.alertaEspacioConfigRef()!,
          this.estilosAlerta(),
        );
      });
  }

  public onPagoMensualidadChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const valorMensualidadCtrl = this.espacioForm.get('valorMensualidad');
    if (checkbox.checked) {
      valorMensualidadCtrl?.enable();
      valorMensualidadCtrl?.setValidators([
        Validators.required,
        Validators.min(0),
      ]);
    } else {
      valorMensualidadCtrl?.clearValidators();
      valorMensualidadCtrl?.setValue(null);
      valorMensualidadCtrl?.disable();
    }
    valorMensualidadCtrl?.updateValueAndValidity();
  }

  public editarGeneral() {
    this.espacioConfigService.setModoEdicionGeneral(true);
    this.appService.setEditando(true);
    this.espacioForm.enable();
    // Al entrar en edición, aplicar la lógica condicional para valorMensualidad
    const pagoMensualidadCtrl = this.espacioForm.get('pagoMensualidad');
    const valorMensualidadCtrl = this.espacioForm.get('valorMensualidad');
    if (pagoMensualidadCtrl?.value) {
      valorMensualidadCtrl?.enable();
      valorMensualidadCtrl?.setValidators([
        Validators.required,
        Validators.min(0),
      ]);
    } else {
      valorMensualidadCtrl?.clearValidators();
      valorMensualidadCtrl?.disable();
    }
    valorMensualidadCtrl?.updateValueAndValidity();
    this.espacioForm.markAsPristine();
  }

  public cancelarEditar() {
    this.espacioConfigService.setModoEdicionGeneral(false);
    this.appService.setEditando(false);
    this.espacioForm.disable();
  }

  public onImagenDrop(event: File) {
    if (!event) {
      this.alertaService.error(
        'No se ha seleccionado ningún archivo.',
        5000,
        this.espacioConfigService.alertaEspacioConfigRef()!,
        this.estilosAlerta(),
      );
      return;
    }

    this.file.set(event);

    const tiposPermitidos = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
    ];
    if (!tiposPermitidos.includes(event.type)) {
      this.alertaService.error(
        'Formato de imagen no válido. Solo se permiten archivos JPEG, PNG y WebP.',
        5000,
        this.espacioConfigService.alertaEspacioConfigRef()!,
        this.estilosAlerta(),
      );
      return;
    }

    const tamaximoMaximo = 5 * 1024 * 1024;
    if (event.size > tamaximoMaximo) {
      this.alertaService.error(
        'La imagen es demasiado grande. El tamaño máximo permitido es 5MB.',
        5000,
        this.espacioConfigService.alertaEspacioConfigRef()!,
        this.estilosAlerta(),
      );
      return;
    }

    // Si todas las validaciones pasan, procesar la imagen
    const reader = new FileReader();
    reader.onload = e => {
      const imageUrl = e.target?.result as string;
      this.espacioConfigService.setImagen(imageUrl);
      this.tiltuloImagen.set({
        nombre: event.name,
        peso: (event.size / 1024).toFixed(2) + ' KB',
      });

      this.alertaService.success(
        'Imagen cargada correctamente.',
        3000,
        this.espacioConfigService.alertaEspacioConfigRef()!,
        this.estilosAlerta(),
      );
    };

    reader.onerror = () => {
      this.alertaService.error(
        'Error al cargar la imagen.',
        5000,
        this.espacioConfigService.alertaEspacioConfigRef()!,
        this.estilosAlerta(),
      );
    };

    reader.readAsDataURL(event);
  }

  public borrarImagen() {
    this.espacioConfigService.setImagen('');
    this.tiltuloImagen.set(null);
    this.file.set(null);
    this.alertaService.success(
      'Imagen eliminada correctamente.',
      3000,
      this.espacioConfigService.alertaEspacioConfigRef()!,
      this.estilosAlerta(),
    );
  }

  ngOnDestroy() {
    this.espacioConfigService.setAlertaEspacioConfigRef(null);
  }
}

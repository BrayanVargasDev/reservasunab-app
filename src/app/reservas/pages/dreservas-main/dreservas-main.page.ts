import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  effect,
  viewChild,
  computed,
  ElementRef,
  Injector,
  inject,
  ChangeDetectionStrategy,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { combineLatest, startWith, debounceTime } from 'rxjs';
import Pikaday from 'pikaday';
import { format, parse } from 'date-fns';
import { formatInBogota } from '@shared/utils/timezone';

import { WebIconComponent } from '@shared/components/web-icon/web-icon.component';
import { i18nDatePicker } from '@shared/constants/lenguaje.constant';
import { EspacioParaConfig, Espacio } from '@espacios/interfaces';
import { DreservasService } from '@reservas/services/dreservas.service';
import { EspaciosConfigService } from '@espacios/services/espacios-config.service';

import { AppService } from '@app/app.service';
import { EspacioBookingItemComponent } from '@reservas/components/espacio-booking-item/espacio-booking-item.component';
import { environment } from '@environments/environment';
import { Imagen } from '@espacios/interfaces/imagen.interface';
import { ModalDreservasComponent } from '@reservas/components/modal-dreservas/modal-dreservas.component';
import { AuthService } from '@auth/services/auth.service';
import { PERMISOS_RESERVAS } from '@shared/constants';

@Component({
  selector: 'app-dreservas-main',
  templateUrl: './dreservas-main.page.html',
  styleUrls: ['./dreservas-main.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    WebIconComponent,
    ReactiveFormsModule,
    EspacioBookingItemComponent,
    ModalDreservasComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col h-full w-full sm:pl-3 overflow-y-auto',
  },
})
export default class DreservasMainPage implements OnInit, OnDestroy {
  private injector = inject(Injector);
  // private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private dreservasService = inject(DreservasService);
  private espacioConfigService = inject(EspaciosConfigService);
  public appService = inject(AppService);

  public authService = inject(AuthService);

  public readonly environment = environment;
  private readonly DEFAULT_IMAGE = '';
  readonly permisos = PERMISOS_RESERVAS;

  public readonly filtrosForm = new FormGroup({
    fecha: new FormControl<string>(''),
    sede: new FormControl<string>(''),
    grupo: new FormControl<string>(''),
    categoria: new FormControl<string>(''),
  });

  public readonly filtros = toSignal(
    this.filtrosForm.valueChanges.pipe(
      startWith(this.filtrosForm.value),
      debounceTime(300),
    ),
    {
      initialValue: this.filtrosForm.value,
      equal: (a, b) => {
        return JSON.stringify(a) === JSON.stringify(b);
      },
    },
  );

  private pikaday?: Pikaday;
  public readonly fechaPicker =
    viewChild.required<ElementRef<HTMLInputElement>>('fechaPicker');

  public readonly espacios = computed(
    () => this.dreservasService.allEspaciosQuery.data() ?? [],
  );

  public readonly isLoadingEspacios = computed(() =>
    this.dreservasService.allEspaciosQuery.isPending(),
  );

  public readonly espacioFull = computed(
    () => this.espacioConfigService.espacioQuery.data() ?? null,
  );

  public readonly hasFilters = computed(() => {
    const filtros = this.filtros();
    return !!(filtros?.sede || filtros?.grupo || filtros?.categoria);
  });

  public readonly filtrosActivos = computed(() => {
    const filtros = this.filtros();
    const activos = [];
    if (filtros?.sede) activos.push('Sede');
    if (filtros?.grupo) activos.push('Grupo');
    if (filtros?.categoria) activos.push('Categoría');
    return activos;
  });

  ngOnInit(): void {
    this.initializePikaday();
    this.setupFiltersEffect();
  }

  private setupFiltersEffect(): void {
    effect(
      () => {
        const filtros = this.filtros();

        this.dreservasService.setFiltros({
          fecha: filtros?.fecha
            ? format(
                parse(filtros.fecha, 'dd/MM/yyyy', new Date()),
                'yyyy-MM-dd',
              )
            : null,
          idGrupo: filtros?.grupo ? Number(filtros.grupo) : null,
          idSede: filtros?.sede ? Number(filtros.sede) : null,
          idCategoria: filtros?.categoria ? Number(filtros.categoria) : null,
        });
      },
      {
        injector: this.injector,
      },
    );
  }

  private initializePikaday(): void {
    const fechaHoy = formatInBogota(new Date(), 'dd/MM/yyyy');
    this.filtrosForm.controls.fecha.setValue(fechaHoy);

    this.pikaday = new Pikaday({
      field: this.fechaPicker()?.nativeElement,
      // Fijar hoy según Bogotá para evitar desfases por zona del dispositivo
      minDate: parse(
        formatInBogota(new Date(), 'yyyy-MM-dd'),
        'yyyy-MM-dd',
        new Date(),
      ),
      i18n: i18nDatePicker,
      format: 'DD/MM/YYYY',
      setDefaultDate: true,
      defaultDate: parse(
        formatInBogota(new Date(), 'yyyy-MM-dd'),
        'yyyy-MM-dd',
        new Date(),
      ),
      onSelect: (date: Date) => {
        this.filtrosForm.controls.fecha.setValue(format(date, 'dd/MM/yyyy'));
      },
    });
  }

  public limpiarFecha(): void {
    this.pikaday?.setDate(null);
    this.filtrosForm.controls.fecha.setValue('');
  }

  public limpiarUbicacion(): void {
    this.filtrosForm.controls.sede.setValue('');
  }

  public limpiarCategoria(): void {
    this.filtrosForm.controls.categoria.setValue('');
  }

  public limpiarGrupo(): void {
    this.filtrosForm.controls.grupo.setValue('');
  }

  public limpiarTodosFiltros(): void {
    this.filtrosForm.patchValue({
      sede: '',
      categoria: '',
      grupo: '',
    });
  }

  public getImagenUrl(imagen: string | null): string {
    return imagen ? `${environment.apiUrl}${imagen}` : this.DEFAULT_IMAGE;
  }

  public trackByEspacioId(index: number, espacio: any): number {
    return espacio.id;
  }

  public abrirEspacio(espacioId: number): void {
    this.dreservasService.abrirModal();
    this.dreservasService.setIdEspacio(espacioId);
  }

  public navegarMisReservas(): void {
    this.router.navigate(['reservas', 'mis-reservas']);
  }

  public navegarAdminReservas(): void {
    this.router.navigate(['reservas', 'admin']);
  }

  public ngOnDestroy(): void {
    this.pikaday?.destroy();
  }
}

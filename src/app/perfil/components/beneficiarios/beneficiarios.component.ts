import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BeneficiariosService } from '../../services/beneficiarios.service';
import { AppService } from '@app/app.service';
import { FormUtils } from '@shared/utils/form.utils';
import { InputSoloNumerosDirective } from '@shared/directives/input-solo-numeros.directive';
import { WebIconComponent } from '@app/shared/components/web-icon/web-icon.component';

@Component({
  selector: 'app-beneficiarios',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    InputSoloNumerosDirective,
    WebIconComponent,
  ],
  template: `
    <div class="flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold"></h3>
        <div class="text-sm opacity-80">
          Puedes agregar {{ restantes() }} beneficiarios más
        </div>
      </div>

      @if (mostrandoFormulario()) {
      <div class="card bg-base-100 shadow-sm">
        <div class="card-body p-3">
          <form
            [formGroup]="form"
            (ngSubmit)="guardar()"
            class="grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            <div class="flex flex-col">
              <label class="label text-sm font-[600]"
                >Nombre <span class="text-error">*</span></label
              >
              <input
                type="text"
                formControlName="nombre"
                [ngClass]="{
                  'input input-bordered h-11 rounded-box': true,
                  'input-error': esInvalido('nombre')
                }"
              />
              @if (esInvalido('nombre')) {
              <div class="text-xs text-error">
                {{ formUtils.obtenerErrorDelCampo(form, 'nombre') }}
              </div>
              }
            </div>

            <div class="flex flex-col">
              <label class="label text-sm font-[600]"
                >Apellido <span class="text-error">*</span></label
              >
              <input
                type="text"
                formControlName="apellido"
                [ngClass]="{
                  'input input-bordered h-11 rounded-box': true,
                  'input-error': esInvalido('apellido')
                }"
              />
              @if (esInvalido('apellido')) {
              <div class="text-xs text-error">
                {{ formUtils.obtenerErrorDelCampo(form, 'apellido') }}
              </div>
              }
            </div>

            <div class="flex flex-col">
              <label class="label text-sm font-[600]"
                >Tipo Doc. <span class="text-error">*</span></label
              >
              <select
                formControlName="tipoDocumento"
                [ngClass]="{
                  'select input-bordered h-11 rounded-box': true,
                  'input-error': esInvalido('tipoDocumento')
                }"
              >
                <option value="" disabled selected>Seleccione</option>
                @for (td of appService.tipoDocQuery.data(); track $index) {
                <option [value]="td.id">
                  {{ td.codigo }} - {{ td.nombre }}
                </option>
                }
              </select>
              @if (esInvalido('tipoDocumento')) {
              <div class="text-xs text-error">
                {{ formUtils.obtenerErrorDelCampo(form, 'tipoDocumento') }}
              </div>
              }
            </div>

            <div class="flex flex-col">
              <label class="label text-sm font-[600]"
                >Documento <span class="text-error">*</span></label
              >
              <input
                type="text"
                inputSoloNumeros
                formControlName="documento"
                [ngClass]="{
                  'input input-bordered h-11 rounded-box': true,
                  'input-error': esInvalido('documento')
                }"
              />
              @if (esInvalido('documento')) {
              <div class="text-xs text-error">
                {{ formUtils.obtenerErrorDelCampo(form, 'documento') }}
              </div>
              }
            </div>

            <div class="flex flex-col md:col-span-2">
              <label class="label text-sm font-[600]"
                >Parentesco <span class="text-error">*</span></label
              >
              <select
                formControlName="parentesco"
                [ngClass]="{
                  'select input-bordered h-11 rounded-box': true,
                  'input-error': esInvalido('parentesco')
                }"
              >
                <option value="" disabled selected>Seleccione</option>
                <optgroup label="Primer grado">
                  <option value="padre">Padre</option>
                  <option value="madre">Madre</option>
                  <option value="hijo">Hijo(a)</option>
                </optgroup>
                <optgroup label="Segundo grado">
                  <option value="hermano">Hermano(a)</option>
                  <option value="abuelo">Abuelo(a)</option>
                  <option value="nieto">Nieto(a)</option>
                </optgroup>
              </select>
              @if (esInvalido('parentesco')) {
              <div class="text-xs text-error">
                {{ formUtils.obtenerErrorDelCampo(form, 'parentesco') }}
              </div>
              }
            </div>

            <div class="md:col-span-2 flex justify-end gap-2">
              <button
                type="button"
                class="btn max-sm:btn-sm btn-ghost sm:h-11"
                (click)="cancelar()"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="btn max-sm:btn-sm btn-primary sm:h-11"
                [disabled]="form.invalid || creando()"
              >
                @if (creando()) {
                <span class="loading loading-spinner loading-sm mr-1"></span>
                } Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
      }
      <div class="flex justify-end mb-2">
        <button
          class="btn btn-primary max-sm:btn-sm sm:h-11"
          (click)="mostrandoFormulario() ? cancelar() : abrirFormulario()"
          [disabled]="restantes() === 0"
        >
          {{ mostrandoFormulario() ? 'Cerrar' : 'Crear beneficiario' }}
        </button>
      </div>

      <div class="sm:hidden">
        @if (cargando()) {
        <div class="flex items-center justify-center py-6">
          <span class="loading loading-spinner loading-sm mr-2"></span>
          Cargando...
        </div>
        } @else if ((lista()?.length ?? 0) === 0) {
        <div class="text-center py-6">No hay beneficiarios</div>
        } @else {
        <div class="space-y-3">
          @for (b of lista(); track $index) {
          <div class="card bg-base-100 shadow-sm">
            <div class="card-body p-3">
              <div class="flex justify-between items-start gap-3">
                <div class="flex-1 space-y-1">
                  <div class="text-sm">
                    <span class="opacity-70">Nombre: </span>
                    <span class="font-medium break-words">{{ b.nombre }}</span>
                  </div>
                  <div class="text-sm">
                    <span class="opacity-70">Apellido: </span>
                    <span class="font-medium break-words">{{
                      b.apellido
                    }}</span>
                  </div>
                  <div class="text-sm">
                    <span class="opacity-70">Tipo Doc.: </span>
                    <span class="font-semibold">{{
                      b.tipo_documento.codigo
                    }}</span>
                  </div>
                  <div class="text-sm">
                    <span class="opacity-70">Documento: </span>
                    <span class="font-semibold break-all">{{
                      b.documento
                    }}</span>
                  </div>
                  <div class="text-sm">
                    <span class="opacity-70">Parentesco: </span>
                    <span class="capitalize">{{ b.parentesco }}</span>
                  </div>
                </div>
                <div class="flex items-center">
                  <button
                    class="btn btn-error btn-soft btn-xs btn-square"
                    (click)="eliminar(b.id)"
                    [disabled]="eliminandoId() === b.id"
                  >
                    @if (eliminandoId() === b.id) {
                    <span
                      class="loading loading-spinner loading-sm mr-1"
                    ></span>
                    }
                    <app-web-icon
                      nombreIcono="trash-outline"
                      estilos="w-5 h-5"
                    ></app-web-icon>
                  </button>
                </div>
              </div>
            </div>
          </div>
          }
        </div>
        }
      </div>

      <div class="hidden sm:block">
        <table class="table table-fixed w-full">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Tipo Doc.</th>
              <th>Documento</th>
              <th>Parentesco</th>
              <th class="text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            @if (cargando()) {
            <tr>
              <td colspan="6" class="text-center">
                <span class="loading loading-spinner loading-sm"></span>
                Cargando...
              </td>
            </tr>
            } @if (!cargando() && (lista()?.length ?? 0) === 0) {
            <tr>
              <td colspan="6" class="text-center">No hay beneficiarios</td>
            </tr>
            } @for (b of lista(); track $index) {
            <tr>
              <td class="whitespace-normal break-words">{{ b.nombre }}</td>
              <td class="whitespace-normal break-words">{{ b.apellido }}</td>
              <td class="whitespace-normal font-semibold">
                {{ b.tipo_documento.codigo }}
              </td>
              <td class="whitespace-normal font-semibold break-all">
                {{ b.documento }}
              </td>
              <td class="whitespace-normal capitalize">{{ b.parentesco }}</td>
              <td class="text-right whitespace-normal">
                <button
                  class="btn btn-error btn-soft btn-xs btn-square"
                  (click)="eliminar(b.id)"
                  [disabled]="eliminandoId() === b.id"
                >
                  @if (eliminandoId() === b.id) {
                  <span class="loading loading-spinner loading-sm mr-1"></span>
                  }
                  <app-web-icon
                    nombreIcono="trash-outline"
                    estilos="w-5 h-5"
                  ></app-web-icon>
                </button>
              </td>
            </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class BeneficiariosComponent {
  private fb = inject(FormBuilder);
  public svc = inject(BeneficiariosService);
  public appService = inject(AppService);
  public formUtils = FormUtils;

  public mostrandoFormulario = signal(false);
  public eliminandoId = signal<number | null>(null);

  public form = this.fb.group({
    nombre: ['', [Validators.required]],
    apellido: ['', [Validators.required]],
    tipoDocumento: ['', [Validators.required]],
    documento: [
      '',
      [
        Validators.required,
        Validators.pattern(FormUtils.patronSoloNumeros),
        Validators.minLength(7),
      ],
    ],
    parentesco: ['', [Validators.required]],
  });

  get lista() {
    return this.svc.lista;
  }
  get cargando() {
    return this.svc.isFetching;
  }
  get restantes() {
    return this.svc.restantes;
  }
  get creando() {
    return this.svc.crearMutation.isPending;
  }

  esInvalido(ctrl: string) {
    return this.formUtils.esCampoInvalido(this.form, ctrl);
  }

  abrirFormulario() {
    this.mostrandoFormulario.set(true);
  }
  cancelar() {
    this.mostrandoFormulario.set(false);
    this.form.reset();
  }

  tdCodigo(idOrCode: any) {
    const tipos: any[] = (this.appService.tipoDocQuery.data() as any) || [];
    const found = tipos.find(
      (t: any) => t.id === idOrCode || t.codigo === idOrCode,
    );
    return found ? `${found.codigo}` : idOrCode;
  }

  async guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.restantes() === 0) {
      return;
    }
    const payload = this.form.value as any;
    try {
      await this.svc.crearMutation.mutateAsync(payload);
      this.cancelar();
    } catch (e) {}
  }

  async eliminar(id: number) {
    this.eliminandoId.set(id);
    try {
      await this.svc.eliminarMutation.mutateAsync(id);
    } finally {
      this.eliminandoId.set(null);
    }
  }
}

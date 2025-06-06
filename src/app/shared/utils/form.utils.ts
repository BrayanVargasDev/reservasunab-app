import { validarEmailTomado } from '../actions/validar-email.action';
import {
  AbstractControl,
  FormArray,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';

async function sleep() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, 2500);
  });
}

export class FormUtils {
  static patronNombre = '([a-zA-Z]+) ([a-zA-Z]+)';
  static patronEmail = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  static patronSoloAlfanumerico = '^[a-zA-Z0-9]+$';
  static patronSoloNumeros = '^[0-9]+$';

  static obtenerTextoDelError(errors: ValidationErrors) {
    const opcionesErrerores: { [key: string]: any } = {
      required: 'Este campo es requerido',
      minlength: `Mínimo de ${errors['minlength']?.requiredLength} caracteres.`,
      min: `Valor mínimo de ${errors['min']?.min}`,
      email: `El valor ingresado no es un correo electrónico`,
      emailTomado: `El correo electrónico ya está siendo usado por otro usuario`,
      pattern: () => this.obtenerMensajePatron(errors['pattern']),
    };

    for (const key of Object.keys(errors)) {
      if (!(key in opcionesErrerores)) {
        return `Error de validación no controlado ${key}`;
      }

      if (key === 'pattern') {
        return opcionesErrerores[key]();
      }

      return opcionesErrerores[key];
    }

    return null;
  }

  static esCampoInvalido(form: FormGroup, fieldName: string): boolean | null {
    return (
      !!form.controls[fieldName].errors && form.controls[fieldName].touched
    );
  }

  static obtenerErrorDelCampo(
    form: FormGroup,
    fieldName: string,
  ): string | null {
    if (!form.controls[fieldName]) return null;

    const errors = form.controls[fieldName].errors ?? {};

    return FormUtils.obtenerTextoDelError(errors);
  }

  // ! Esto es para validar campos dentro de un FormArray
  // static isValidFieldInArray(formArray: FormArray, index: number) {
  //   return (
  //     formArray.controls[index].errors && formArray.controls[index].touched
  //   );
  // }

  // static getFieldErrorInArray(
  //   formArray: FormArray,
  //   index: number,
  // ): string | null {
  //   if (formArray.controls.length === 0) return null;

  //   const errors = formArray.controls[index].errors ?? {};

  //   return FormUtils.getTextError(errors);
  // }

  static sonCamposIguales(campo1: string, campo2: string) {
    return (formGroup: AbstractControl) => {
      const valorCampo1 = formGroup.get(campo1)?.value;
      const valorCampo2 = formGroup.get(campo2)?.value;

      return valorCampo1 === valorCampo2 ? null : { camposNoIguales: true };
    };
  }

  static async validarRespuestaServidor(
    control: AbstractControl,
  ): Promise<ValidationErrors | null> {
    const valorFormulario = control.value;

    const estaDisponible = await validarEmailTomado(valorFormulario.trim());

    if (!estaDisponible) {
      return {
        emailTomado: true,
      };
    }

    return null;
  }

  static obtenerMensajePatron(patron: any) {
    switch (patron.requiredPattern) {
      case FormUtils.patronNombre:
        return 'El nombre debe contener al menos un nombre y un apellido';
      case FormUtils.patronEmail:
        return 'El correo electrónico no es válido';
      case FormUtils.patronSoloAlfanumerico:
        return 'El campo solo puede contener letras y números';
      case FormUtils.patronSoloNumeros:
        return 'El campo solo puede contener números';
      default:
        return 'El valor ingresado no es válido';
    }
  }
}

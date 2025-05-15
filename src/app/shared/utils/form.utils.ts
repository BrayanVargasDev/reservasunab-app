import {
  AbstractControl,
  FormArray,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';

async function sleep() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 2500);
  });
}

export class FormUtils {
  static patronNombre = '([a-zA-Z]+) ([a-zA-Z]+)';
  static patronEmail = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  static patronSoloAlfanumerico = '^[a-zA-Z0-9]+$';

  static obtenerTextoDelError(errors: ValidationErrors) {
    console.log('Errores', errors);

    const opcionesErrerores: { [key: string]: any } = {
      required: 'Este campo es requerido',
      minlength: `Mínimo de ${errors['minlength']?.requiredLength} caracteres.`,
      min: `Valor mínimo de ${errors['min']?.min}`,
      email: `El valor ingresado no es un correo electrónico`,
      emailTomado: `El correo electrónico ya está siendo usado por otro usuario`,
      pattern: () =>
        errors['pattern']?.requiredPattern === FormUtils.patronEmail
          ? 'El valor ingresado no luce como un correo electrónico'
          : 'Error de patrón contra expresión regular',
    };

    for (const key of Object.keys(errors)) {
      console.log(key);
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

  static esCampoValido(form: FormGroup, fieldName: string): boolean | null {
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
    console.log('Validando contra servidor');
    // TODO: Cambiar esto por una llamada a la API
    await sleep(); // 2 segundos y medio

    const valorFormulario = control.value;

    if (valorFormulario === 'hola@mundo.com') {
      return {
        emailTaken: true,
      };
    }

    return null;
  }
}

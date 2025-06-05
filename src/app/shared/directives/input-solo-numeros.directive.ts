import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[inputSoloNumeros]',
})
export class InputSoloNumerosDirective {
  @HostListener('input', ['$event'])
  onInput(event: InputEvent) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedInput: string =
      event.clipboardData?.getData('text/plain') ?? '';
    const numericInput = pastedInput.replace(/[^0-9]/g, '');
    document.execCommand('insertText', false, numericInput);
  }
}

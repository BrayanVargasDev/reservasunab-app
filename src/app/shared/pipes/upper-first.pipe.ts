import { Pipe, type PipeTransform, Injectable } from '@angular/core';

@Pipe({
  name: 'upperFirst',
  pure: true,
  standalone: true,
})
@Injectable({ providedIn: 'root' })
export class UpperFirstPipe implements PipeTransform {
  transform(value: string | undefined): string | undefined {
    if (!value) return value;
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
}

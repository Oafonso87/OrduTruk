import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'quienesSomos',
  standalone: false
})
export class QuienesSomosPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}

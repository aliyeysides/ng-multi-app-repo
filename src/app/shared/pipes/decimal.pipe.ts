import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decimal'
})
export class DecimalPipe implements PipeTransform {

  transform(num: string): any {
    return parseFloat(num).toFixed(2);
  }

}

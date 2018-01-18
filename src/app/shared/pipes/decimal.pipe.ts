import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decimal'
})
export class DecimalPipe implements PipeTransform {

  transform(num: string): any {
    if (!isNaN(parseFloat(num))) {
      return parseFloat(num).toFixed(2);
    } else {
      return 'N/A';
    }
  }

}

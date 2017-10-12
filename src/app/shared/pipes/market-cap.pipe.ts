import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'marketCap'
})
export class MarketCapPipe implements PipeTransform {

  transform(num: any): any {
    return ( +parseFloat(num).toFixed(0) / 1000 );
  }

}

import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {

  transform(array, orderBy, asc = true) {

    if (!orderBy || orderBy.trim() == '') {
      if (asc == true) {
        return array;
      }
      if (asc == false) {
        return array.reverse();
      }
    }

    //ascending
    if (asc) {
      return Array.from(array).sort((item1: any, item2: any) => {
        // in order to compare neutral plus/minus:
        if (orderBy == 'PGR' && item1['PGR'] == 3 && item2['PGR'] == 3) return this.orderByComparator(item1['raw_PGR'], item2['raw_PGR']);
        return this.orderByComparator(item1[orderBy], item2[orderBy]);
      });
    }
    else {
      //not asc
      return Array.from(array).sort((item1: any, item2: any) => {
        if (orderBy == 'PGR' && item1['PGR'] == 3 && item2['PGR'] == 3) return this.orderByComparator(item2['raw_PGR'], item1['raw_PGR']);
        return this.orderByComparator(item2[orderBy], item1[orderBy]);
      });
    }

  }

  orderByComparator(a: any, b: any): number {
    if ((isNaN(parseFloat(a)) || !isFinite(a)) || (isNaN(parseFloat(b)) || !isFinite(b))) {
      //Isn't a number so lowercase the string to properly compare
      if (a.toLowerCase() < b.toLowerCase()) return -1;
      if (a.toLowerCase() > b.toLowerCase()) return 1;
    }
    else {
      //Parse strings as numbers to compare properly
      if (parseFloat(a) < parseFloat(b)) return -1;
      if (parseFloat(a) > parseFloat(b)) return 1;
    }

    return 0; //equal each other

  }

}

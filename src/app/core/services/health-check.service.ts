import {Injectable} from '@angular/core';
import {UtilService} from './util.service';

@Injectable()
export class HealthCheckService {

  private apiHost = this.utilService.getApiHostName();
  private calculationParams: URLSearchParams;

  constructor(private utilService: UtilService) {
    this.calculationParams = new URLSearchParams;
  }
  //
  // public getDiscoveryResultLists(ticker: string): Observable<object> {
  //   const url = `${this.apiHost}/CPTRestSecure/app/midTier/getDiscoveryResultLists?`;
  //   this.discoveryResultListsParams.set('stock', ticker);
  //   return this.utilService.getJson(url, this.discoveryResultListsParams);
  // }

  public getChaikinCalculations(listId: string) {
    const url = `${this.apiHost}/CPTRestSecure/app/phcService/getChaikinCalculations?`;
    this.calculationParams.set('calc', 'ClosePriceChange');
    this.calculationParams.set('responseType', 'PHC');
    // this.calculationParams.set('startDate', )
    // this.calculationParams.set('endDate', )
    this.calculationParams.set('listID', listId);
  }

}

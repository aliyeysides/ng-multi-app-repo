import {Injectable} from '@angular/core';
import {UtilService} from './util.service';

@Injectable()
export class HealthCheckService {

  private apiHost = this.utilService.getApiHostName();
  private calculationParams: URLSearchParams;
  private authorizedListsParams: URLSearchParams;

  constructor(private utilService: UtilService) {
    this.calculationParams = new URLSearchParams;
    this.authorizedListsParams = new URLSearchParams;
  }

  public getChaikinCalculations(listId: string, startDate, endDate) {
    const url = `${this.apiHost}/CPTRestSecure/app/phcService/getChaikinCalculations?`;
    this.calculationParams.set('calc', 'ClosePriceChange');
    this.calculationParams.set('responseType', 'PHC');
    this.calculationParams.set('startDate', startDate);
    this.calculationParams.set('endDate', endDate);
    this.calculationParams.set('listID', listId);
  }

  public getAuthorizedLists(uid: string) {
    const url = `${this.apiHost}/CPTRestSecure/app/portfolio/getAuthorizedLists?`;
    this.authorizedListsParams.set('uid', uid);
    this.authorizedListsParams.set('rank', 'false');
    this.authorizedListsParams.set('responseType', 'custom');
    return this.utilService.getJson(url, this.authorizedListsParams);
  }

}

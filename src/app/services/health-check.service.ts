import {Injectable} from '@angular/core';
import {UtilService} from './util.service';
import {Http, URLSearchParams} from '@angular/http';

@Injectable()
export class HealthCheckService {

  private apiHost = this.utilService.getApiHostName();
  private calculationParams: URLSearchParams;
  private authorizedListsParams: URLSearchParams;
  private stockStatusParams: URLSearchParams;

  constructor(private utilService: UtilService,
              private http: Http) {
    this.calculationParams = new URLSearchParams;
    this.authorizedListsParams = new URLSearchParams;
    this.stockStatusParams = new URLSearchParams;
  }

  public getChaikinCalculations(listId: string, startDate, endDate) {
    const url = `${this.apiHost}/CPTRestSecure/app/phcService/getChaikinCalculations?`;
    this.calculationParams.set('calc', 'ClosePriceChange');
    this.calculationParams.set('responseType', 'PHC');
    this.calculationParams.set('startDate', startDate);
    this.calculationParams.set('endDate', endDate);
    this.calculationParams.set('listID', listId);
    return this.utilService.getJson(url, this.calculationParams);
  }

  public getAuthorizedLists(uid: string) {
    const url = `${this.apiHost}/CPTRestSecure/app/portfolio/getAuthorizedLists?`;
    this.authorizedListsParams.set('uid', uid);
    this.authorizedListsParams.set('rank', 'false');
    this.authorizedListsParams.set('responseType', 'custom');
    this.authorizedListsParams.set('environment', 'desktop');
    this.authorizedListsParams.set('version', '1.3.4');
    return this.utilService.getJson(url, this.authorizedListsParams);
  }

  public getUserPortfolioStockStatus(listId: string, startDate, endDate) {
    const url = `${this.apiHost}/CPTRestSecure/app/phcService/getUserPortfolioStocksStatus?`;
    this.stockStatusParams.set('listId', listId);
    this.stockStatusParams.set('startDate', startDate);
    this.stockStatusParams.set('endDate', endDate);
    return this.utilService.getJson(url, this.stockStatusParams);
  }
}

import {Injectable} from '@angular/core';
import {UtilService} from './util.service';
import {Http, URLSearchParams} from '@angular/http';

@Injectable()
export class HealthCheckService {

  private apiHost = this.utilService.getApiHostName();
  private calculationParams: URLSearchParams;
  private authorizedListsParams: URLSearchParams;
  private stockStatusParams: URLSearchParams;
  private pgrWeeklyChangeParams: URLSearchParams;
  private earningsSurpriseParams: URLSearchParams;
  private analystRevisionsParams: URLSearchParams;
  private phcParams: URLSearchParams;
  private earningsReportParams: URLSearchParams;

  constructor(private utilService: UtilService,
              private http: Http) {
    this.calculationParams = new URLSearchParams;
    this.authorizedListsParams = new URLSearchParams;
    this.stockStatusParams = new URLSearchParams;
    this.pgrWeeklyChangeParams = new URLSearchParams;
    this.earningsSurpriseParams = new URLSearchParams;
    this.analystRevisionsParams = new URLSearchParams;
    this.earningsReportParams = new URLSearchParams;
    this.phcParams = new URLSearchParams;
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

  public getPGRWeeklyChangeDAta(listId: string, startDate, endDate) {
    const url = `${this.apiHost}/CPTRestSecure/app/phcService/getPGRWeeklyChangeData?`;
    this.pgrWeeklyChangeParams.set('listId', listId);
    this.pgrWeeklyChangeParams.set('startDate', startDate);
    this.pgrWeeklyChangeParams.set('endDate', endDate);
    return this.utilService.getJson(url, this.pgrWeeklyChangeParams);
  }

  public getEarningsSurprise(listId: string, startDate, endDate) {
    const url = `${this.apiHost}/CPTRestSecure/app/phcService/getEarningsSurprise?`;
    this.earningsSurpriseParams.set('listId', listId);
    this.earningsSurpriseParams.set('startDate', startDate);
    this.earningsSurpriseParams.set('endDate', endDate);
    return this.utilService.getJson(url, this.earningsSurpriseParams);
  }

  public getAnalystRevisions(listId: string, date) {
    const url = `${this.apiHost}/CPTRestSecure/app/phcService/getAnalystRevisions?`;
    this.analystRevisionsParams.set('listId', listId);
    this.analystRevisionsParams.set('date', date);
    return this.utilService.getJson(url, this.analystRevisionsParams);
  }

  public getExpectedEarningsReportsWithPGRValues(uid: string, listId: string, startDate, endDate) {
    const url = `${this.apiHost}/CPTRestSecure/app/phcService/getExpectedEarningReportsWithPGRValues?`;
    this.earningsReportParams.set('uid', uid);
    this.earningsReportParams.set('listId', listId);
    this.earningsReportParams.set('startDate', startDate);
    this.earningsReportParams.set('endDate', endDate);
    return this.utilService.getJson(url, this.earningsReportParams);
  }


  public getPHCGridData(listId: string) {
    const url = `${this.apiHost}/CPTRestSecure/app/phcService/getPHCGridData?`;
    this.phcParams.set('listId', listId);
    return this.utilService.getJson(url, this.phcParams);
  }
}

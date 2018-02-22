import {Injectable} from '@angular/core';
import {UtilService} from './util.service';
import {ListSymbolObj, PGRChanges, PortfolioStatus, PrognosisData, StockStatus} from '../shared/models/health-check';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Http} from '@angular/http';

@Injectable()
export class HealthCheckService {

  private apiHost = this.utilService.getApiHostName();

  private _portfolioStatus: Subject<PortfolioStatus> = new Subject<PortfolioStatus>();
  private _currentUserList: BehaviorSubject<string> = new BehaviorSubject<string>('My Stocks');
  private _toggleOptions: BehaviorSubject<string> = new BehaviorSubject<string>('All');
  private _updateMyStocksList: Subject<void> = new Subject<void>();
  private _userStocks: BehaviorSubject<Array<StockStatus | ListSymbolObj>> = new BehaviorSubject<Array<StockStatus | ListSymbolObj>>(undefined as Array<StockStatus | ListSymbolObj>);

  constructor(private utilService: UtilService) {
  }

  public setPortfolioStatus(val: PortfolioStatus) {
    this._portfolioStatus.next(val);
  }

  public getPortfolioStatus() {
    return this._portfolioStatus;
  }

  public set currentList(val: string) {
    this._currentUserList.next(val);
  }

  public get currentList(): string {
    return this._currentUserList.getValue();
  }

  public setToggleOptions(val) {
    this._toggleOptions.next(val);
  }

  public getToggleOptions() {
    return this._toggleOptions;
  }

  public updateMyStocksList() {
    this._updateMyStocksList.next();
  }

  public getMyStocksSubject() {
    return this._updateMyStocksList;
  }

  public setUserStocks(val: Array<StockStatus | ListSymbolObj>) {
    this._userStocks.next(val);
  }

  public getUserStocks() {
    return this._userStocks;
  }

  public getPrognosisData(listId: string): Observable<PrognosisData> {
    const url = `${this.apiHost}/CPTRestSecure/app/phcService/getPrognosisData?`;
    const params = {'listId': listId};
    return this.utilService.getJson(url, { params, withCredentials: true })
  }

  public getChaikinCalculations(listId: string, startDate, endDate) {
    const url = `${this.apiHost}/CPTRestSecure/app/phcService/getChaikinCalculations?`;
    const params = {
      'calc': 'ClosePriceChange',
      'responseType': 'PHC',
      'startDate': startDate,
      'endDate': endDate,
      'listId': listId
    };
    return this.utilService.getJson(url, { params, withCredentials: true });
  }

  public getAuthorizedLists(uid: string) {
    const url = `${this.apiHost}/CPTRestSecure/app/portfolio/getAuthorizedLists?`;
    const params = {
      'uid': uid,
      'rank': 'false',
      'responseType': 'custom',
      'environment': 'desktop',
      'version': '1.3.4'
    };
    return this.utilService.getJson(url, { params, withCredentials: true });
  }

  public getListSymbols(listId: string, uid: string): Observable<Array<object>> {
    const url = `${this.apiHost}/CPTRestSecure/app/portfolio/getListSymbols?`;
    const params = {'listId': listId, 'uid': uid};
    return this.utilService.getJson(url, { params, withCredentials: true });
  }

  public getUserPortfolioStockStatus(listId: string, startDate, endDate): Observable<PortfolioStatus> {
    const url = `${this.apiHost}/CPTRestSecure/app/phcService/getUserPortfolioStocksStatus?`;
    const params = {
      'listId': listId,
      'startDate': startDate,
      'endDate': endDate
    };
    return this.utilService.getJson(url, { params, withCredentials: true });
  }

  public getPGRWeeklyChangeData(listId: string, startDate?, endDate?): Observable<PGRChanges> {
    const url = `${this.apiHost}/CPTRestSecure/app/phcService/getCurrentWeekPGRChangeData?`;
    const params = {
      'listId': listId,
      'startDate': startDate,
      'endDate': endDate
    };
    return this.utilService.getJson(url, { params, withCredentials: true });
  }

  public getEarningsSurprise(listId: string, startDate, endDate) {
    const url = `${this.apiHost}/CPTRestSecure/app/phcService/getEarningsSurprise?`;
    const params = {
      'listId': listId,
      'startDate': startDate,
      'endDate': endDate
    };
    return this.utilService.getJson(url, { params, withCredentials: true });
  }

  public getAnalystRevisions(listId: string, date) {
    const url = `${this.apiHost}/CPTRestSecure/app/phcService/getAnalystRevisions?`;
    const params = {'listId': listId, 'date': date};
    return this.utilService.getJson(url, { params, withCredentials: true });
  }

  public getExpectedEarningsReportsWithPGRValues(uid: string, listId: string, startDate, endDate) {
    const url = `${this.apiHost}/CPTRestSecure/app/phcService/getExpectedEarningReportsWithPGRValues?`;
    const params = {
      'uid': uid,
      'listId': listId,
      'startDate': startDate,
      'endDate': endDate
    };
    return this.utilService.getJson(url, { params, withCredentials: true });
  }

  public getPHCGridData(listId: string) {
    const url = `${this.apiHost}/CPTRestSecure/app/phcService/getPHCGridData?`;
    const params = {'listId': listId};
    return this.utilService.getJson(url, { params, withCredentials: true });
  }

}

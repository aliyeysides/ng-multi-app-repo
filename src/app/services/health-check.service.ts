import {Injectable, OnInit} from '@angular/core';
import {UtilService} from './util.service';
import {URLSearchParams} from '@angular/http';
import {ListSymbolObj, PGRChanges, PortfolioStatus, PrognosisData, StockStatus} from '../shared/models/health-check';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class HealthCheckService {

  private apiHost = this.utilService.getApiHostName();
  private prognosisParams: URLSearchParams;
  private calculationParams: URLSearchParams;
  private authorizedListsParams: URLSearchParams;
  private stockStatusParams: URLSearchParams;
  private pgrWeeklyChangeParams: URLSearchParams;
  private earningsSurpriseParams: URLSearchParams;
  private analystRevisionsParams: URLSearchParams;
  private phcParams: URLSearchParams;
  private earningsReportParams: URLSearchParams;
  private listSymbolsParams: URLSearchParams;

  private _portfolioStatus: Subject<PortfolioStatus> = new Subject<PortfolioStatus>();
  private _currentUserList: BehaviorSubject<string> = new BehaviorSubject<string>('My Stocks');
  // private _defaultToggle: string = localStorage.getItem('stock_toggle_option') || 'All';
  private _toggleOptions: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private _updateMyStocksList: Subject<void> = new Subject<void>();
  private _userStocks: BehaviorSubject<Array<StockStatus | ListSymbolObj>> = new BehaviorSubject<Array<StockStatus | ListSymbolObj>>(undefined as Array<StockStatus | ListSymbolObj>);

  constructor(private utilService: UtilService) {
    this.prognosisParams = new URLSearchParams;
    this.calculationParams = new URLSearchParams;
    this.authorizedListsParams = new URLSearchParams;
    this.stockStatusParams = new URLSearchParams;
    this.pgrWeeklyChangeParams = new URLSearchParams;
    this.earningsSurpriseParams = new URLSearchParams;
    this.analystRevisionsParams = new URLSearchParams;
    this.earningsReportParams = new URLSearchParams;
    this.phcParams = new URLSearchParams;
    this.listSymbolsParams = new URLSearchParams;

    console.log('constructed');
    const _defaultToggle: string = localStorage.getItem('stock_toggle_option') || 'All';
    this._toggleOptions.next(_defaultToggle);
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
    console.log('setToggleOptions', val);
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
    this.prognosisParams.set('listId', listId);
    return this.utilService.getJson(url, this.prognosisParams)
  }

  public getChaikinCalculations(listId: string, startDate, endDate) {
    const url = `${this.apiHost}/CPTRestSecure/app/phcService/getChaikinCalculations?`;
    this.calculationParams.set('calc', 'ClosePriceChange');
    this.calculationParams.set('responseType', 'PHC');
    this.calculationParams.set('startDate', startDate);
    this.calculationParams.set('endDate', endDate);
    this.calculationParams.set('listId', listId);
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

  public getListSymbols(listId: string, uid: string): Observable<Array<object>> {
    const listSymbolsUrl = `${this.apiHost}/CPTRestSecure/app/portfolio/getListSymbols?`;
    this.listSymbolsParams.set('listId', listId);
    this.listSymbolsParams.set('uid', uid);
    return this.utilService.getJson(listSymbolsUrl, this.listSymbolsParams);
  }

  public getUserPortfolioStockStatus(listId: string, startDate, endDate): Observable<PortfolioStatus> {
    const url = `${this.apiHost}/CPTRestSecure/app/phcService/getUserPortfolioStocksStatus?`;
    this.stockStatusParams.set('listId', listId);
    this.stockStatusParams.set('startDate', startDate);
    this.stockStatusParams.set('endDate', endDate);
    return this.utilService.getJson(url, this.stockStatusParams);
  }

  public getPGRWeeklyChangeData(listId: string, startDate?, endDate?): Observable<PGRChanges> {
    const url = `${this.apiHost}/CPTRestSecure/app/phcService/getCurrentWeekPGRChangeData?`;
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

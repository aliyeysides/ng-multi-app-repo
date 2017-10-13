import {Injectable} from '@angular/core';
import {Http, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {UtilService} from './util.service';
import {IdeaList} from '../../shared/models/idea';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import {NotificationsService} from 'angular2-notifications/dist';

@Injectable()
export class IdeasService {

  private apiHostName = this.utilService.getApiHostName();
  private ideaListsParams: URLSearchParams;
  private listSymbolsParams: URLSearchParams;
  private stockCardParams: URLSearchParams;
  private headlinesParams: URLSearchParams;
  private addStockIntoListParams: URLSearchParams;
  private deleteSymbolFromListParams: URLSearchParams;

  private defaultList = {
    "list_type": "mid-tier",
    "is_extendable": false,
    "is_bullish_or_bearish": "Bearish",
    "associated_product": "Bear",
    "is_active": false,
    "list_id": 1246724,
    "name": "Best Bear Ideas",
    "list_order": 1,
    "pgr_rating_order": 0,
    "power_Bar": "38,2,0",
    "ideas_or_themes_list": "Ideas"
  };

  private _selectedList: BehaviorSubject<IdeaList> = new BehaviorSubject<IdeaList>(this.defaultList);
  selectedList = this._selectedList.asObservable();

  setSelectedList(list: IdeaList) {
    this._selectedList.next(list);
  }

  constructor(private utilService: UtilService,
              private toast: NotificationsService,
              private http: Http) {
    this.ideaListsParams = new URLSearchParams();
    this.listSymbolsParams = new URLSearchParams();
    this.stockCardParams = new URLSearchParams();
    this.headlinesParams = new URLSearchParams();
    this.addStockIntoListParams = new URLSearchParams();
    this.deleteSymbolFromListParams = new URLSearchParams();
  }

  public getIdeasList(uid: string, product: string): Observable<Array<object>> {
    const ideaListLookupUrl = `${this.apiHostName}/CPTRestSecure/app/portfolio/getMidTierUserLists?`;
    this.ideaListsParams.set('uid', uid);
    this.ideaListsParams.set('productName', product);
    return this.utilService.getJson(ideaListLookupUrl, this.ideaListsParams);
  }

  public getListSymbols(listId: string, uid: string): Observable<Array<object>> {
    const listSymbolsUrl = `${this.apiHostName}/CPTRestSecure/app/midTier/getListSymbols?`;
    this.listSymbolsParams.set('listId', listId);
    this.listSymbolsParams.set('uid', uid);
    return this.utilService.getJson(listSymbolsUrl, this.listSymbolsParams);
  }

  public getStockCardData(symbol: string) {
    const getStockCardDataUrl = `${this.apiHostName}/CPTRestSecure/app/midTier/getStockCardData?`;
    this.stockCardParams.set('symbol', symbol);
    return this.utilService.getJson(getStockCardDataUrl, this.stockCardParams);
  }

  public getHeadlines(symbol: string) {
    const getHeadlinesUrl = `${this.apiHostName}/CPTRestSecure/app/xigniteNews/getHeadlines?`;
    this.headlinesParams.set('symbol', symbol);
    return this.utilService.getJson(getHeadlinesUrl, this.headlinesParams);
  }

  public addStockIntoList(listId: string, symbol: string) {
    const addStockIntoListUrl = `${this.apiHostName}/CPTRestSecure/app/portfolio/addStockIntoList?`;
    this.addStockIntoListParams.set('listId', listId);
    this.addStockIntoListParams.set('symbol', symbol);
    return this.http.get(addStockIntoListUrl, {
      search: this.addStockIntoListParams,
      withCredentials: true
    }).map(res => {
      const result = res.json();
      Object.keys(result).forEach((key) => {
        this.toast.success('Success!', 'Successfully added ' + key);
      });
      return res.json()
    })
  }

  public deleteSymbolFromList(listId: string, symbol: string) {
    const deleteSymbolFromListUrl = `${this.apiHostName}/CPTRestSecure/app/portfolio/deleteSymbolFromList?`;
    this.deleteSymbolFromListParams.set('symbol', symbol);
    this.deleteSymbolFromListParams.set('listId', listId);
    return this.http.get(deleteSymbolFromListUrl, {
      search: this.deleteSymbolFromListParams,
      withCredentials: true
    }).map(res => {
      const result = res.json();
      this.toast.success('Success!', 'Successfully removed from list');
      return res.json()
    })
  }

}

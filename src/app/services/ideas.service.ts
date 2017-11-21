import {Injectable} from '@angular/core';
import {Http, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {UtilService} from './util.service';
import {IdeaList} from '../shared/models/idea';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {NotificationsService} from 'angular2-notifications/dist';
import {Subject} from 'rxjs/Subject';
import {AuthService} from './auth.service';

declare let gtag: Function;

@Injectable()
export class IdeasService {

  private apiHostName = this.utilService.getApiHostName();
  private ideaListsParams: URLSearchParams;
  private listSymbolsParams: URLSearchParams;
  private stockCardParams: URLSearchParams;
  private headlinesParams: URLSearchParams;
  private addStockIntoListParams: URLSearchParams;
  private deleteSymbolFromListParams: URLSearchParams;

  private _selectedList: BehaviorSubject<IdeaList> = new BehaviorSubject<IdeaList>({name: 'default'} as IdeaList);
  selectedList = this._selectedList.asObservable();

  private _updateAlerts: Subject<void> = new Subject<void>();
  updateAlerts$ = this._updateAlerts.asObservable();

  setSelectedList(list: IdeaList) {
    this._selectedList.next(list);
  }

  constructor(private utilService: UtilService,
              private toast: NotificationsService,
              private http: Http,
              private authService: AuthService) {
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
    const allowed = 30;
    const addStockIntoListUrl = `${this.apiHostName}/CPTRestSecure/app/portfolio/addStockIntoList?`;
    this.addStockIntoListParams.set('listId', listId);
    this.addStockIntoListParams.set('symbol', symbol);

    return this.authService
      .currentUser$
      .filter(x => x != undefined)
      .map(usr => usr['UID'])
      .flatMap(uid => this.getListSymbols(listId, uid))
      .do(res => gtag('event', 'add_to_user_list_clicked', {
        'event_category': 'engagement',
        'event_label': symbol
      }))
      .map(res => res['symbols'].length < allowed)
      .flatMap(allowed => {
        if (allowed) {

          return this.http.get(addStockIntoListUrl, {
            search: this.addStockIntoListParams,
            withCredentials: true
          }).map(res => {
            const result = res.json();
            Object.keys(result).forEach((key) => {
              this.toast.success('Success!', 'Successfully added ' + key);
              this._updateAlerts.next();
            });
            return result as Observable<any>;
          }).catch((err) => Observable.throw(err))

        } else {
          this.toast.error('Oops...', "You have reached the 30 stock limit for what can be added to your user list. To add a stock, you must first remove something from your list.");
          return Observable.throw("You have reached the 30 stock limit for what can be added to your user list. To add a stock, you must first remove something from your list.")
        }
      });
  }

  public deleteSymbolFromList(listId: string, symbol: string) {
    const deleteSymbolFromListUrl = `${this.apiHostName}/CPTRestSecure/app/portfolio/deleteSymbolFromList?`;
    this.deleteSymbolFromListParams.set('symbol', symbol);
    this.deleteSymbolFromListParams.set('listId', listId);
    gtag('event', 'remove_from_user_list_clicked', {
      'event_category': 'engagement',
      'event_label': symbol
    });
    return this.http.get(deleteSymbolFromListUrl, {
      search: this.deleteSymbolFromListParams,
      withCredentials: true
    }).map(res => {
      this._updateAlerts.next();
      return res.json();
    })
      .catch(res => res.json())
  }


}

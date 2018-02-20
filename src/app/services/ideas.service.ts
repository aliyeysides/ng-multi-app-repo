import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {UtilService} from './util.service';
import {IdeaList} from '../shared/models/idea';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {NotificationsService} from 'angular2-notifications/dist';
import {Subject} from 'rxjs/Subject';
import {AuthService} from './auth.service';
import {HttpClient} from "@angular/common/http";

declare let gtag: Function;

@Injectable()
export class IdeasService {

  private apiHostName = this.utilService.getApiHostName();

  private _selectedList: BehaviorSubject<IdeaList> = new BehaviorSubject<IdeaList>({name: 'default'} as IdeaList);
  selectedList = this._selectedList.asObservable();

  private _selectedStock: BehaviorSubject<string> = new BehaviorSubject<string>('');
  selectedStock$ = this._selectedStock.asObservable();

  private _updateAlerts: Subject<void> = new Subject<void>();
  updateAlerts$ = this._updateAlerts.asObservable();

  constructor(private utilService: UtilService,
              private toast: NotificationsService,
              private http: HttpClient,
              private authService: AuthService) {
  }

  get selectedStock() {
    return this._selectedStock.getValue();
  }

  set selectedStock(val) {
    this._selectedStock.next(val);
  }

  setSelectedList(list: IdeaList) {
    this._selectedList.next(list);
  }

  public getIdeasList(uid: string, product: string): Observable<Array<object>> {
    const ideaListLookupUrl = `${this.apiHostName}/CPTRestSecure/app/portfolio/getMidTierUserLists?`;
    const params = {
      'uid': uid,
      'productName': product,
    };
    return this.utilService.getJson(ideaListLookupUrl, { params, withCredentials: true });
  }

  public getListSymbols(listId: string, uid: string): Observable<Array<object>> {
    const listSymbolsUrl = `${this.apiHostName}/CPTRestSecure/app/midTier/getListSymbols?`;
    const params = {
      'uid': uid,
      'listId': listId
    };
    return this.utilService.getJson(listSymbolsUrl, { params, withCredentials: true });
  }

  public getStockCardData(symbol: string) {
    const getStockCardDataUrl = `${this.apiHostName}/CPTRestSecure/app/midTier/getStockCardData?`;
    const params = {'symbol': symbol};
    return this.utilService.getJson(getStockCardDataUrl, { params, withCredentials: true });
  }

  public getHeadlines(symbol: string) {
    const getHeadlinesUrl = `${this.apiHostName}/CPTRestSecure/app/xigniteNews/getHeadlines?`;
    const params = {'symbol': symbol};
    return this.utilService.getJson(getHeadlinesUrl, { params, withCredentials: true });
  }

  public addStockIntoList(listId: string, symbol: string) {
    const allowed = 1000;
    const addStockIntoListUrl = `${this.apiHostName}/CPTRestSecure/app/portfolio/addStockIntoList?`;
    const params = {
      'listId': listId,
      'symbol': symbol,
    };

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
          return this.http.get(addStockIntoListUrl, { params, withCredentials: true }).map(res => {
            Object.keys(res).forEach((key) => {
              this.toast.success('Success!', 'Successfully added ' + key);
              this._updateAlerts.next();
            });
            return res as Observable<any>;
          }).catch((err) => Observable.throw(err))

        } else {
          this.toast.error('Oops...', "You have reached the 30 stock limit for what can be added to your user list. To add a stock, you must first remove something from your list.");
          return Observable.throw("You have reached the 30 stock limit for what can be added to your user list. To add a stock, you must first remove something from your list.")
        }
      });
  }

  public deleteSymbolFromList(listId: string, symbol: string) {
    const deleteSymbolFromListUrl = `${this.apiHostName}/CPTRestSecure/app/portfolio/deleteSymbolFromList?`;
    const params = {
      'symbol': symbol,
      'listId': listId,
    };

    gtag('event', 'remove_from_user_list_clicked', {
      'event_category': 'engagement',
      'event_label': symbol
    });

    return this.http.get(deleteSymbolFromListUrl, { params, withCredentials: true }).map(res => {
      this._updateAlerts.next();
      return res;
    })
      .catch(err => err)
  }


}

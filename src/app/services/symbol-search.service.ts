import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {UtilService} from './util.service';
import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class SymbolSearchService {
  private _isOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isOpen$ = this._isOpen.asObservable();

  private _addStock: Subject<void> = new Subject<void>();
  addStock$ = this._addStock.asObservable();

  emitAddToList() {
    this._addStock.next();
  }

  setSearchOpen(val: boolean) {
    this._isOpen.next(val);
  }

  public apiHostName = this.utilService.getApiHostName();

  constructor(private utilService: UtilService) {
  }

  public symbolLookup(query: string, mode?: string): Observable<Array<object>> {
    const symbolLookupUrl = `${this.apiHostName}/CPTRestSecure/app/stocks/symbol-lookupV1?`;
    const params = {
      'q': query,
      'searchColumn': 'symbol',
      'mode': mode ? mode : null
    };
    return this.utilService.getJson(symbolLookupUrl, { params, withCredentials: true });
  }

}

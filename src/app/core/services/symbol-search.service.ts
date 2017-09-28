import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {UtilService} from './util.service';
import {URLSearchParams} from '@angular/http';

@Injectable()
export class SymbolSearchService {
  public apiHostName = this.utilService.getApiHostName();
  public symbolLookupParams: URLSearchParams;

  constructor(private utilService: UtilService) {
    this.symbolLookupParams = new URLSearchParams();
  }

  public symbolLookup(query: string): Observable<Array<object>> {
    const symbolLookupUrl = `${this.apiHostName}/CPTRestSecure/app/stocks/symbol-lookupV1?`;
    this.symbolLookupParams.set('q', query);
    this.symbolLookupParams.set('searchColumn', 'symbol');
    return this.utilService.getJson(symbolLookupUrl, this.symbolLookupParams);
  }

}

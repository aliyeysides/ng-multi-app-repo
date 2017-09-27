import {Injectable} from '@angular/core';
import {URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {UtilService} from './util.service';

@Injectable()
export class MarketsSummaryService {

  apiHostName = this.utilService.getApiHostName();
  private apiPrependText = '/CPTRestSecure/app';
  private symbolLookupParams: URLSearchParams;

  constructor(private utilService: UtilService) {
    this.symbolLookupParams = new URLSearchParams();
  }

  public initialMarketSectorData(query): Observable<Array<object>> {
    const symbolLookupUrl = `${this.apiHostName}${this.apiPrependText}/midTier/getInitialData?`;
    this.symbolLookupParams.set('components', query.components);
    return this.utilService.getJson(symbolLookupUrl, this.symbolLookupParams);
  }
}

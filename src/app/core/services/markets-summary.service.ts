import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs/Observable';
import {UtilService} from './util.service';

@Injectable()
export class MarketsSummaryService {

  apiHostName = environment.envProtocol + '://' + environment.envHostName;
  private apiPrependText = '/CPTRestSecure/app';
  private symbolLookupParams: URLSearchParams;

  constructor(private utilService: UtilService) {
    this.symbolLookupParams = new URLSearchParams();
  }

  // https://dev.chaikinanalytics.com/CPTRestSecure/app/midTier/getInitialData?&components=majorMarketIndices,sectors

  public initialMarketSectorData(query): Observable<Array<object>> {
    const symbolLookupUrl = `${this.apiHostName}${this.apiPrependText}/midTier/getInitialData?`;
    this.symbolLookupParams.set('components', query.components);
    return this.utilService.getJson(symbolLookupUrl, this.symbolLookupParams);
  }
}

import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {UtilService} from './util.service';

@Injectable()
export class MarketsSummaryService {

  apiHostName = this.utilService.getApiHostName();
  private apiPrependText = '/CPTRestSecure/app';

  constructor(private utilService: UtilService) {
  }

  public initialMarketSectorData(query): Observable<Array<object>> {
    const symbolLookupUrl = `${this.apiHostName}${this.apiPrependText}/midTier/getInitialData?`;
    const params = {'components': query.components};
    return this.utilService.getJson(symbolLookupUrl, { params, withCredentials: true });
  }
}

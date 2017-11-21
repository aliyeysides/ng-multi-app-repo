import {Injectable} from '@angular/core';
import {URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {UtilService} from './util.service';

@Injectable()
export class DiscoveryService {

  private apiHost = this.utilService.getApiHostName();
  private discoveryResultListsParams: URLSearchParams;

  constructor(private utilService: UtilService) {
    this.discoveryResultListsParams = new URLSearchParams;
  }

  public getDiscoveryResultLists(ticker: string): Observable<object> {
    const url = `${this.apiHost}/CPTRestSecure/app/midTier/getDiscoveryResultLists?`;
    this.discoveryResultListsParams.set('stock', ticker);
    return this.utilService.getJson(url, this.discoveryResultListsParams);
  }
}

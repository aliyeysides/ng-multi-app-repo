import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {UtilService} from './util.service';

@Injectable()
export class DiscoveryService {

  private apiHost = this.utilService.getApiHostName();

  constructor(private utilService: UtilService) {
  }

  public getDiscoveryResultLists(ticker: string): Observable<object> {
    const url = `${this.apiHost}/CPTRestSecure/app/midTier/getDiscoveryResultLists?`;
    const params = {'stock': ticker};
    return this.utilService.getJson(url, { params, withCredentials: true });
  }
}

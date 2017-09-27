import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http} from '@angular/http';
import {environment} from '../../../environments/environment';

@Injectable()
export class UtilService {

  protected apiHostName = environment.envProtocol + '://' + environment.envHostName;

  constructor(private http: Http) { }

  public getApiHostName() {
    return this.apiHostName;
  }

  public getJson(url, params): Observable<Array<object>> {
    return this.http.get(url, {
      search: params,
      withCredentials: true
    }).map(res => res.json())
      .catch(this.handleError);
  }

  public handleError(err: any) {
    const errMsg = (err.message) ? err.message :
      err.status ? `${err.status} - ${err.statusText}` : 'Server error';
    return Observable.throw(errMsg);
  }

}

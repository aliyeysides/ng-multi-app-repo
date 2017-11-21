import {Injectable} from '@angular/core';
import {UtilService} from './util.service';
import {Http, RequestOptions, Headers} from '@angular/http';

@Injectable()
export class HealthCheckService {

  private apiHost = this.utilService.getApiHostName();
  private calculationParams: URLSearchParams;
  private authorizedListsParams: URLSearchParams;

  constructor(private utilService: UtilService,
              private http: Http) {
    this.calculationParams = new URLSearchParams;
    this.authorizedListsParams = new URLSearchParams;
  }

  public getChaikinCalculations(listId: string, startDate, endDate) {
    const url = `${this.apiHost}/CPTRestSecure/app/phcService/getChaikinCalculations?`;
    this.calculationParams.set('calc', 'ClosePriceChange');
    this.calculationParams.set('responseType', 'PHC');
    this.calculationParams.set('startDate', startDate);
    this.calculationParams.set('endDate', endDate);
    this.calculationParams.set('listID', listId);
  }

  public getAuthorizedLists(uid: string) {
    const url = `${this.apiHost}/CPTRestSecure/app/portfolio/getAuthorizedLists?`;
    this.authorizedListsParams.set('uid', uid);
    this.authorizedListsParams.set('rank', 'false');
    this.authorizedListsParams.set('responseType', 'custom');

    // let headers = new Headers({
    //   'Content-Type': 'application/json',
    //   'Accept': 'application/json',
    //   'Access-Control-Allow-Headers': 'Content-Type',
    // });
    // headers.append('environment', 'desktop');
    // headers.append('version', '1.3.4');

    // let options = new RequestOptions({headers: headers, params: this.authorizedListsParams});

    return this.http.get(url, {
      search: this.authorizedListsParams,
      withCredentials: true
    }).map(res => res.json())
      .catch(this.utilService.handleError);

    // return this.utilService.getJson(url, this.authorizedListsParams);

    // let headers = new Headers();
    // headers.append('Content-Type', 'application/json');
    // headers.append('authentication', `${student.token}`);
    //
    // let options = new RequestOptions({ headers: headers });
    // return this.http
    //   .put(url, JSON.stringify(student), options)
  }

}

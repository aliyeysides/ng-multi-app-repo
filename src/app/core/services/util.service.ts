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

  public checkIfBullList(listName) {
    switch (listName) {
      case 'Bulls of the Week':
      case 'Best Growth Stocks':
      case 'Best of the Large Caps':
      case 'Best of the NASDAQ':
      case 'Best of the Small Caps':
      case 'Buy the Dips':
      case 'Best Under $10':
      case 'Best Value Stocks':
      case 'Insider Confidence':
      case 'Money Makers':
      case 'Relative Strength Champs':
      case 'Money Flow Champs':
      case 'Analyst Darlings':
      case 'Power Gauge Rating Upgrades':
      case 'Best of the Dow':
      case 'Earnings Champs':
      case 'Upcoming Earnings Bulls':
        return true;
      default:
        return false;
    }
  }

  public checkIfBearList(listName) {
    switch (listName) {
      case 'Best Bear Ideas':
      case 'Sell the Rallies':
      case 'Large Cap Bears':
      case 'Small Cap Bears':
      case 'Bears of the Week':
      case 'Power Gauge Downgrades':
      case 'Don\'t Fight the Shorts':
      case 'Dogs of the Dow':
      case 'Upcoming Earnings Bears':
        return true;
      default:
        return false;
    }
  }

  public checkIfUserList(listName) {
    switch (listName) {
      case 'Ideas for You':
      case 'Holding':
      case 'Watching':
        return true;
      default:
        return false;
    }
  }

  public checkIfThemeList(listName) {
    switch (listName) {
      case 'Big Data':
      case 'China Shops':
      case 'Cybersecurity':
      case 'Disruptors':
      case 'E-Payments':
      case 'Gold Standards':
      case 'Internet Innovators':
      case 'Social Butterflies':
      case 'Video Games':
      case 'Fashion & Luxury':
      case 'Defense Titans':
      case 'Earth-Friendly':
      case 'Sin City':
      case 'Health & Fitness':
      case 'Cloud Computing':
      case 'Upwardly Mobile':
        return true;
      default:
        return false;
    }
  }


}

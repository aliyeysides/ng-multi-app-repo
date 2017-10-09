import {Injectable} from '@angular/core';
import {URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {UtilService} from './util.service';

@Injectable()
export class IdeasService {

  private apiHostName = this.utilService.getApiHostName();
  private ideaListsParams: URLSearchParams;
  private listSymbolsParams: URLSearchParams;
  private stockCardParams: URLSearchParams;

  constructor(private utilService: UtilService) {
    this.ideaListsParams = new URLSearchParams();
    this.listSymbolsParams = new URLSearchParams();
    this.stockCardParams = new URLSearchParams();
  }

  public getIdeasList(uid: string, product: string): Observable<Array<object>> {
    const ideaListLookupUrl = `${this.apiHostName}/CPTRestSecure/app/portfolio/getMidTierUserLists?`;
    this.ideaListsParams.set('uid', uid);
    this.ideaListsParams.set('productName', product);
    return this.utilService.getJson(ideaListLookupUrl, this.ideaListsParams);
  }

  public getListSymbols(listId: string, uid: string): Observable<Array<object>> {
    const listSymbolsUrl = `${this.apiHostName}/CPTRestSecure/app/midTier/getListSymbols?`;
    this.listSymbolsParams.set('listId', listId);
    this.listSymbolsParams.set('uid', uid);
    return this.utilService.getJson(listSymbolsUrl, this.listSymbolsParams);
  }

  public getStockCardData(symbol: string) {
    const getStockCardDataUrl = `${this.apiHostName}/CPTRestSecure/app/midTier/getStockCardData?`;
    this.stockCardParams.set('symbol', symbol);
    return this.utilService.getJson(getStockCardDataUrl, this.stockCardParams);
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
      case 'Sell the Rallies':
      case 'Bears of the Week':
      case 'Power Gauge Rating Downgrades':
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

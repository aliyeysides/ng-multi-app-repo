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

  public getIdeasList(uid: string): Observable<Array<object>> {
    const ideaListLookupUrl = `${this.apiHostName}/CPTRestSecure/app/portfolio/getMidTierUserLists?`;
    this.ideaListsParams.set('uid', uid);
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

}

import { Injectable } from '@angular/core';
import {UtilService} from './util.service';
import {URLSearchParams} from '@angular/http';

@Injectable()
export class ReportService {

  private apiHost = this.utilService.getApiHostName();
  private symbolDataParams: URLSearchParams;

  constructor(private utilService: UtilService) { }

  public getSymbolData(symbol: string) {
    const url = `${this.apiHost}/CPTRestSecure/app/portfolio/getSymbolData?`;
    this.symbolDataParams = new URLSearchParams();
    this.symbolDataParams.set('symbol', symbol);
    this.symbolDataParams.set('components', 'pgr,metaInfo,fundamentalData,EPSData');
    return this.utilService.getJson(url, this.symbolDataParams);
  }

}

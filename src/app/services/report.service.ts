import { Injectable } from '@angular/core';
import {UtilService} from './util.service';
import {URLSearchParams} from '@angular/http';

@Injectable()
export class ReportService {

  private _apiHost = this.utilService.getApiHostName();
  private _symbolDataParams: URLSearchParams;
  private _contextParams: URLSearchParams;

  constructor(private utilService: UtilService) { }

  public getSymbolData(symbol: string) {
    const url = `${this._apiHost}/CPTRestSecure/app/portfolio/getSymbolData?`;
    this._symbolDataParams = new URLSearchParams();
    this._symbolDataParams.set('symbol', symbol);
    this._symbolDataParams.set('components', 'pgr,metaInfo,fundamentalData,EPSData');
    return this.utilService.getJson(url, this._symbolDataParams);
  }

  public getPgrDataAndContextSummary(symbol: string, industry: string) {
    const url = `${this._apiHost}/CPTRestSecure/app/researchReportServices/getPgrDataAndContextSummary?`;
    this._contextParams = new URLSearchParams();
    this._contextParams.set('symbol', symbol);
    this._contextParams.set('industry', industry);
    return this.utilService.getJson(url, this._contextParams);
  }

}

import { Injectable } from '@angular/core';
import {UtilService} from './util.service';

@Injectable()
export class ReportService {

  private _apiHost = this.utilService.getApiHostName();

  constructor(private utilService: UtilService) { }

  public getSymbolData(symbol: string) {
    const url = `${this._apiHost}/CPTRestSecure/app/portfolio/getSymbolData?`;
    const params = {
      'symbol': symbol,
      'components': 'pgr,metaInfo,fundamentalData,EPSData'
    };
    return this.utilService.getJson(url, { params, withCredentials: true });
  }

  public getPgrDataAndContextSummary(symbol: string, industry: string) {
    const url = `${this._apiHost}/CPTRestSecure/app/researchReportServices/getPgrDataAndContextSummary?`;
    const params = {
      'symbol': symbol,
      'industry': industry
    };
    return this.utilService.getJson(url, { params, withCredentials: true });
  }

  public getTickerCompetitors(symbol: string) {
    const url = `${this._apiHost}/CPTRestSecure/app/researchReportServices/getTickerCompetitors?`;
    const params = {'symbol': symbol};
    return this.utilService.getJson(url, { params, withCredentials: true });
  }

  public getResearchReportData(symbol: string) {
    const url = `${this._apiHost}/CPTRestSecure/app/researchReportServices/getResearchReportData?`;
    const params = {'symbol': symbol};
    return this.utilService.getJson(url, { params, withCredentials: true });
  }

  public getStockSummaryData(symbol: string, components?: string) {
    const url = `${this._apiHost}/CPTRestSecure/app/stockSummary/getStockSummaryData?`;
    const params = {
      'symbol': symbol,
      'components': components ? components : 'stockSummaryData,oneYearChartData,fiveYearChartData,oneYearPgrData,fiveYearPgrData'
    };
    return this.utilService.getJson(url, { params, withCredentials: true });
  }

  public getStockDataPoints(query: object) {
    const url = `${this._apiHost}/CPTRestSecure/app/chart/getStockDataPoints`;
    const params = {
      'symbol': query['symbol'],
      'interval': query['interval'],
      'dataComponents': query['dataComponents'],
      'numBars': query['numBars'],
      'version': '1.1'
    };
    return this.utilService.getJson(url, { params, withCredentials: true });
  }

  public getPHCReportforListId(listId: string, uid: string) {
    const url = `${this._apiHost}/CPTRestSecure/app/phc/getPHCReportForListID?`;
    const params = {
      'listId': listId,
      'uid': uid,
      'phcVersion': '1.3',
      'additionalSymbols': 'SPY',
      '_': '1513675654286'
    };
    return this.utilService.getJson(url, { params, withCredentials: true });
  }

  public getPDFStockReport(symbol: string) {
    const url = `${this._apiHost}/CPTRestSecure/app/pdf/fetchReport?`;
    const params = {'symbol': symbol};
    return this.utilService.getJson(url, { params, withCredentials: true });
  }
}

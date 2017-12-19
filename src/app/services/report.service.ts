import { Injectable } from '@angular/core';
import {UtilService} from './util.service';
import {URLSearchParams} from '@angular/http';

@Injectable()
export class ReportService {

  private _apiHost = this.utilService.getApiHostName();
  private _symbolDataParams: URLSearchParams;
  private _contextParams: URLSearchParams;
  private _competitorsParams: URLSearchParams;
  private _researchDataParams: URLSearchParams;
  private _summaryDataParams: URLSearchParams;
  private _stockDataPointsParams: URLSearchParams;
  private _phcPdfParams: URLSearchParams;
  private _stockPdfParams: URLSearchParams;

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

  public getTickerCompetitors(symbol: string) {
    const url = `${this._apiHost}/CPTRestSecure/app/researchReportServices/getTickerCompetitors?`;
    this._competitorsParams = new URLSearchParams();
    this._competitorsParams.set('symbol', symbol);
    return this.utilService.getJson(url, this._competitorsParams);
  }

  public getResearchReportData(symbol: string) {
    const url = `${this._apiHost}/CPTRestSecure/app/researchReportServices/getResearchReportData?`;
    this._researchDataParams = new URLSearchParams();
    this._researchDataParams.set('symbol', symbol);
    return this.utilService.getJson(url, this._researchDataParams);
  }

  public getStockSummaryData(symbol: string) {
    const url = `${this._apiHost}/CPTRestSecure/app/stockSummary/getStockSummaryData?`;
    this._summaryDataParams = new URLSearchParams();
    this._summaryDataParams.set('symbol', symbol);
    this._summaryDataParams.set('components', 'stockSummaryData,oneYearChartData,fiveYearChartData,oneYearPgrData,fiveYearPgrData');
    return this.utilService.getJson(url, this._summaryDataParams);
  }

  public getStockDataPoints(query: object) {
    const url = `${this._apiHost}/CPTRestSecure/app/chart/getStockDataPoints`;
    this._stockDataPointsParams = new URLSearchParams();
    this._stockDataPointsParams.set('symbol', query['symbol']);
    this._stockDataPointsParams.set('interval', query['interval']);
    this._stockDataPointsParams.set('dataComponents', query['dataComponents']);
    this._stockDataPointsParams.set('numBars', query['numBars']);
    this._stockDataPointsParams.set('version', '1.1');
    return this.utilService.getJson(url, this._stockDataPointsParams);
  }

  public getPHCReportforListId(listId: string, uid: string) {
  // &additionalSymbols=SPY&phcVersion=1.3&_=1513675654286
    const url = `${this._apiHost}/CPTRestSecure/app/phc/getPHCReportForListID?`;
    this._phcPdfParams = new URLSearchParams();
    this._phcPdfParams.set('listID', listId);
    this._phcPdfParams.set('uid', uid);
    // this._phcPdfParams.set('response', 'file');
    this._phcPdfParams.set('phcVersion', '1.3');
    this._phcPdfParams.set('additionalSymbols', 'SPY');
    this._phcPdfParams.set('_', '1513675654286');
    return this.utilService.getJson(url, this._phcPdfParams);
  }

  public getPDFStockReport(symbol: string) {
    const url = `${this._apiHost}/CPTRestSecure/app/pdf/fetchReport?`;
    this._stockPdfParams = new URLSearchParams();
    this._stockPdfParams.set('symbol', symbol);
    this._stockPdfParams.set('response', 'file');
    return this.utilService.getJson(url, this._stockPdfParams);
  }
}

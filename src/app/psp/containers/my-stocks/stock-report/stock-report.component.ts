import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
  SimpleChanges, ViewChild
} from '@angular/core';
import {ReportService} from '../../../../services/report.service';
import {Subject} from 'rxjs/Subject';
import {SignalService} from '../../../../services/signal.service';
import {IdeasService} from '../../../../services/ideas.service';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {ZingChart} from '../../../../shared/models/zingchart';
import {Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {UtilService} from '../../../../services/util.service';
import {ListSymbolObj} from '../../../../shared/models/health-check';
import {AuthService} from '../../../../services/auth.service';
import {SymbolSearchService} from '../../../../services/symbol-search.service';
import {Location} from '@angular/common';

declare var zingchart: any;
declare var gtag: Function;

@Component({
  selector: 'cpt-psp-stock-report',
  template: `
    <div class="component--stockview"
         [ngClass]="{
          'open': show, 
         'bearish': symbolData ? symbolData['metaInfo'][0]['PGR'] < 3 && symbolData['metaInfo'][0]['PGR'] >= 1 : null,
         'neutral': symbolData ? symbolData['metaInfo'][0]['PGR'] == 3 : null, 
         'bullish': symbolData ? symbolData['metaInfo'][0]['PGR'] > 3 : null,
         'none': symbolData ? symbolData['metaInfo'][0]['PGR'] <= 0 : null }">

      <!-- STOCK VIEW HEADER -->
      <div (click)="jumpToFragment(top, 'Top');$event.stopPropagation()" class="stockview__header">
        <div (click)="closeReport()" class="header__button header__button--left">
          <img class="align-absolute" src="./assets/imgs/icon_back-arrow--white.svg">
        </div>
        <div class="header__stock">
          <h1 class="ticker">{{ stock }}</h1>
          <p *ngIf="!is_etf" class="company-name">{{ symbolData ? symbolData['metaInfo'][0]['name'] : null }}</p>
        </div>
        <div tooltip="Add stock to list" placement="auto" *ngIf="!resultInUserList(userStocks, stock) && !is_etf"
             (click)="addStock(stock);$event.stopPropagation()"
             class="header__button header__button--right">
          <img class="align-absolute" src="./assets/imgs/ux__plus--circle.svg">
        </div>
        <div tooltip="Remove stock from list" placement="auto" *ngIf="resultInUserList(userStocks, stock)"
             (click)="removeStock(stock);$event.stopPropagation()"
             class="header__button header__button--right">
          <img class="align-absolute" src="./assets/imgs/ux__minus--circle.svg">
        </div>
        <div *ngIf="!is_etf" class="header__button header__button--pdf">
          <button tooltip="Download Report PDF" placement="bottom" class="align-absolute"
                  (click)="getPDFStockReport(stock)"><i class="fal fa-file-pdf" aria-hidden="true"></i></button>
        </div>
        <div class="header__button header__button--anchors">
          <div tooltip="Jump to Financials" placement="auto" class="anchor"
               (click)="jumpToFragment(financials, 'Financials');$event.stopPropagation()"><i
            class="far fa-university" aria-hidden="true"></i></div>
          <div tooltip="Jump to Earnings" placement="auto" class="anchor"
               (click)="jumpToFragment(earnings, 'Earnings');$event.stopPropagation()"><i
            class="far fa-usd" aria-hidden="true"></i></div>
          <div tooltip="Jump to Technicals" placement="auto" class="anchor"
               (click)="jumpToFragment(technicals, 'Technicals');$event.stopPropagation()"><i
            class="far fa-line-chart" aria-hidden="true"></i></div>
          <div tooltip="Jump to Experts" placement="auto" class="anchor"
               (click)="jumpToFragment(experts, 'Experts');$event.stopPropagation()"><i
            class="far fa-users" aria-hidden="true"></i></div>
        </div>
      </div>

      <!-- STOCK VIEW CONTENTS -->
      <div [class.blur-me]="is_etf || !stock" class="container-fluid stockview__contents">
        <div #top class="row justify-content-center">
          <div class="col-12 hidden-md-up">
            <div class="tab--slide"></div>
          </div>

          <div class="col-12 col-md-7 col-xl-5 align-self-center">
            <!-- STOCK VIEW TOP -->
            <div class="row no-gutters stock-info stock-info--main-rating">
              <ng-template #toolTipTemp>
                <div [innerHtml]="link"></div>
              </ng-template>
              <div class="col-12 stockview__main-rating">
                <p class="label">Power Gauge Rating &nbsp;<a><i [tooltip]="toolTipTemp" class="fas fa-info-circle"
                                                                placement="bottom" triggers="click"></i></a></p>
                <p class="rating">
                  <img src="{{ appendPGRImage(symbolData) }}">
                  <span>{{ appendPGRText(symbolData) }}</span>
                </p>
              </div>
              <div class="col-12 stockview__PGR">
                <ul *ngIf="stock" class="pgr__sliders">
                  <li>
                    <div class="row justify-content-center sliderBar-container">
                      <div class="col-4 pgr__label">
                        <p>Financials</p>
                      </div>
                      <div class="col-5 col-md-6 col-lg-5 col-xl-6 sliderProgress">
                        <div
                          [ngClass]="appendSliderClass(symbolData ? symbolData['pgr'][1]['Financials'][0]['Value'] : null)"></div>
                        <div class="sliderBar"
                             [ngClass]="appendSliderBarClass(symbolData ? symbolData['pgr'][1]['Financials'][0]['Value'] : null)"
                             role="progressbar" aria-valuemin="0" aria-valuemax="100">
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div class="row justify-content-center  sliderBar-container">
                      <div class="col-4 pgr__label">
                        <p>Earnings</p>
                      </div>
                      <div class="col-5 col-md-6 col-lg-5 col-xl-6 sliderProgress">
                        <div
                          [ngClass]="appendSliderClass(symbolData ? symbolData['pgr'][2]['Earnings'][0]['Value'] : null)"></div>
                        <div class="sliderBar"
                             [ngClass]="appendSliderBarClass(symbolData ? symbolData['pgr'][2]['Earnings'][0]['Value'] : null)"
                             role="progressbar" aria-valuemin="0" aria-valuemax="100">
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div class="row justify-content-center sliderBar-container">
                      <div class="col-4 pgr__label">
                        <p>Technicals</p>
                      </div>
                      <div class="col-5 col-md-6 col-lg-5 col-xl-6 sliderProgress">
                        <div
                          [ngClass]="appendSliderClass(symbolData ? symbolData['pgr'][3]['Technicals'][0]['Value'] : null)"></div>
                        <div class="sliderBar"
                             [ngClass]="appendSliderBarClass(symbolData ? symbolData['pgr'][3]['Technicals'][0]['Value'] : null)"
                             role="progressbar" aria-valuemin="0" aria-valuemax="100">
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div class="row justify-content-center sliderBar-container">
                      <div class="col-4 pgr__label">
                        <p>Experts</p>
                      </div>
                      <div class="col-5 col-md-6 col-lg-5 col-xl-6 sliderProgress">
                        <div
                          [ngClass]="appendSliderClass(symbolData ? symbolData['pgr'][4]['Experts'][0]['Value'] : null)"></div>
                        <div class="sliderBar"
                             [ngClass]="appendSliderBarClass(symbolData ? symbolData['pgr'][4]['Experts'][0]['Value'] : null)"
                             role="progressbar" aria-valuemin="0" aria-valuemax="100">
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div class="row">
              <div class="col-12 hidden-md-up">
                <div class="divider__long"></div>
              </div>
            </div>
          </div>

          <div class="col-12 col-md-5 col-xl-5 align-self-center">
            <!-- STOCK VIEW PRICE -->
            <div class="row no-gutters stock-info stock-info--price">
              <div class="col-12">
                <p class="current-price"
                   [ngClass]="{'green': symbolData ? symbolData['metaInfo'][0]['Change']>0:null, 'red': symbolData ? symbolData['metaInfo'][0]['Change']<0:null}">
                  <sub>$</sub>{{ symbolData ? (symbolData['metaInfo'][0]['Last'] | decimal ) : null }}</p>
                <p class="label">Current</p>
              </div>
              <div class="col-6">
                <p class="data"
                   [ngClass]="{'green': symbolData ? symbolData['metaInfo'][0]['Change']>0:null, 'red': symbolData ? symbolData['metaInfo'][0]['Change']<0:null}">
                  {{ symbolData ? (symbolData['metaInfo'][0]['Change'] | decimal ) : null }}</p>
                <p class="label">$ CHG</p>
              </div>
              <div class="col-6">
                <p class="data"
                   [ngClass]="{'green': symbolData ? symbolData['metaInfo'][0]['Change']>0:null, 'red': symbolData ? symbolData['metaInfo'][0]['Change']<0:null}">
                  {{ symbolData ? (symbolData['metaInfo'][0]['Percentage '] | decimal ) : null
                  }}<sub>%</sub></p>
                <p class="label">% CHG</p>
              </div>
            </div>
            <div class="row">
              <div class="col-12 hidden-md-up">
                <div class="divider__long"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- STOCK VIEW CHART HEADER -->
        <div class="row no-gutters stock-info stock-info--chart-toggle justify-content-center">
          <div class="col-12 hidden-md-down">
            <div class="divider__long"></div>
          </div>
          <div class="col-12">
            <p class="chart-header__breakdown">
              <span class="bold">{{ symbolData ? symbolData['metaInfo'][0]['name'] : null }}</span> was
              <span class="bold green" *ngIf="timespanPerChange>0">up</span>
              <span class="bold greyed-out" *ngIf="timespanPerChange==0">unch</span>
              <span class="bold red" *ngIf="timespanPerChange<0">down</span>
              <span class="bold"
                    [ngClass]="{ 'green': timespanPerChange>0, 'red': timespanPerChange<0}">{{ timespanPriceChange | decimal
                }} &nbsp;({{ timespanPerChange | decimal
                }}%)</span> over the last:
            </p>
          </div>
          <div (click)="toggleChartTime('1W')" class="col-2">
            <p class="date-select" [ngClass]="{'selected': current == '1W' }">1W</p>
          </div>
          <div (click)="toggleChartTime('1M')" class="col-2">
            <p class="date-select" [ngClass]="{'selected': current == '1M' }">1M</p>
          </div>
          <div (click)="toggleChartTime('6M')" class="col-2">
            <p class="date-select" [ngClass]="{'selected': current == '6M' }">6M</p>
          </div>
          <div (click)="toggleChartTime('1Y')" class="col-2">
            <p class="date-select" [ngClass]="{'selected': current == '1Y' }">1Y</p>
          </div>
          <div (click)="getFiveYearChart()" class="col-2">
            <p class="date-select" [ngClass]="{'selected': current == '5Y' }">5Y</p>
          </div>
        </div>

        <!-- STOCK VIEW MAIN CHART -->
        <div class="row stock-info stock-info--chart">
          <div class="col-12 main-chart">
            <cpt-zingchart [ngBusy]="loading" [chart]="mainChart"></cpt-zingchart>
          </div>

          <div class="col-12">
            <div class="divider__full"></div>
          </div>
        </div>

        <!-- STOCK VIEW STATS -->
        <div class="row stock-info stock-info--stats">
          <div class="col-12">
            <h2><b>{{ stock }}</b> Stats</h2>
          </div>
          <div class="col-4">
            <p class="data data--large">
              {{ (symbolData ? symbolData['fundamentalData']['Mkt Capitalization'] : null) | marketCap | number:'.2-2'
              }}B</p>
            <p class="label">MKT CAP</p>
          </div>
          <div class="col-4">
            <p class="data data--large">{{ (symbolData ? symbolData['fundamentalData']['Yield'] : null) }}%</p>
            <p class="label">YIELD</p>
          </div>
          <div class="col-4">
            <p class="data data--large">
              {{ (symbolData ? symbolData['fundamentalData']['Revenue'] : null) / 1000 | number:'.2-2' }}B</p>
            <p class="label">REVENUE</p>
          </div>
          <div class="col-12">
            <div class="divider__long"></div>
          </div>
          <div class="col-12 col-lg-6 stock-industry">
            <p class="data">{{ research ? research['Details']['Sector'] : null }}</p>
            <p class="label">SECTOR</p>
          </div>
          <div class="col-12 col-lg-6 stock-industry">
            <p class="data">{{ symbolData ? symbolData['metaInfo'][0]['industry_name'] : null }}</p>
            <p class="label">INDUSTRY</p>
          </div>

          <div class="col-12">
            <div class="divider__full"></div>
          </div>
        </div>

        <!-- STOCK VIEW NEWS -->
        <div class="row stock-info stock-info--news">
          <div class="col-12">
            <h2>Recent News</h2>
          </div>
          <div (click)="scrollLeft()" *ngIf="headlines?.length" class="col-1 chevron-slider chevron-slider--left">
            <img class="align-absolute" src="./assets/imgs/ux__scroll--left.svg">
          </div>
          <ul *ngIf="!headlines?.length" class="col-10 news-panel__container">
            <p class="news__none">There are currently no headlines for this symbol</p>
          </ul>
          <ul #newsList *ngIf="headlines?.length" class="col-10 news__slider">
            <li *ngFor="let headline of headlines" class="headline__container">
              <div class="row">
                <div (click)="goToHeadline(headline)" class="col-12">
                  <p class="headline">{{ headline.title }}&nbsp;→</p>
                </div>
                <div class="col-6">
                  <p class="source">{{ headline.source }}</p>
                </div>
                <div class="col-6">
                  <p class="date">{{ headline.headline_last_updated }}</p>
                </div>
              </div>
            </li>
          </ul>
          <div (click)="scrollRight()" *ngIf="headlines?.length" class="col-1 chevron-slider chevron-slider--right">
            <img class="align-absolute" src="./assets/imgs/ux__scroll--right.svg">
          </div>

          <div class="col-12">
            <div class="divider__full"></div>
          </div>
        </div>

        <!-- STOCK VIEW BREAKDOWN -->
        <div class="row justify-content-center stock-info stock-info--overall-breakdown">
          <div class="col-12">
            <h2><span class="hidden-sm-down">Power Gauge</span> Rating Overview</h2>
          </div>

          <div class="col-12 col-lg-10 copy-block">
            <p class="rating"><span>{{ stock?.toUpperCase() }}</span> is
              <span>{{ summary ? summary['pgrContextSummary'][0]['status'] : null }}</span></p>
            <p class="paragraph"><span>{{ symbolData ? symbolData['metaInfo'][0]['name'] : null }}:</span>
              {{ summary ? summary['pgrContextSummary'][0]['mainSentenceTM'] : null }}</p>
            <p class="paragraph"> {{ summary ? summary['pgrContextSummary'][0]['additonalSentence'] : null }}</p>
            <p class="paragraph"> {{ summary ? summary['pgrContextSummary'][0]['neutralSentence'] : null }}</p>
          </div>
          <div class="col-12">
            <div class="divider__long"></div>
          </div>
        </div>

        <!-- BREAKDOWN - FINANCIALS -->
        <div #financials class="row justify-content-center stock-info stock-info--breakdown">
          <div class="pgr-section__icon col-12">
            <img class="align-absolute" src="./assets/imgs/icon__H1-Financials.svg">
          </div>
          <div class="col-12">
            <h1>Financials:
              <span>{{ summary ? summary['financialContextSummary'][0]['status'] : null }}</span>
            </h1>
          </div>

          <div class="col-12 col-lg-6 col-xl-5 stockview__PGR ">
            <ul *ngIf="stock" class="pgr__sliders">
              <li>
                <div class="row justify-content-center justify-content-xl-start sliderBar-container">
                  <div class="col-6 col-sm-4 col-md-4 col-lg-5 col-xl-5 pgr__label">
                    <p>LT Debt to Equity</p>
                  </div>
                  <div class="col-5 col-sm-6 col-md-5 col-lg-5 col-xl-6 sliderProgress">
                    <div
                      [ngClass]="appendSliderClass(symbolData ? symbolData['pgr'][1]['Financials'][1]['LT Debt to Equity'] : null)"></div>
                    <div class="sliderBar"
                         [ngClass]="appendSliderBarClass(symbolData ? symbolData['pgr'][1]['Financials'][1]['LT Debt to Equity'] : null)"
                         role="progressbar" aria-valuemin="0" aria-valuemax="100">
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div class="row justify-content-center justify-content-xl-start sliderBar-container">
                  <div class="col-6 col-sm-4 col-lg-5 col-xl-5 pgr__label">
                    <p>Price to Book</p>
                  </div>
                  <div class="col-5 col-sm-6 col-md-5 col-lg-5 col-xl-6 sliderProgress">
                    <div
                      [ngClass]="appendSliderClass(symbolData ? symbolData['pgr'][1]['Financials'][2]['Price to Book'] : null)"></div>
                    <div class="sliderBar"
                         [ngClass]="appendSliderBarClass(symbolData ? symbolData['pgr'][1]['Financials'][2]['Price to Book'] : null)"
                         role="progressbar" aria-valuemin="0" aria-valuemax="100">
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div class="row justify-content-center justify-content-xl-start sliderBar-container">
                  <div class="col-6 col-sm-4 col-lg-5 col-xl-5 pgr__label">
                    <p>Return on Equity</p>
                  </div>
                  <div class="col-5 col-sm-6 col-md-5 col-lg-5 col-xl-6 sliderProgress">
                    <div
                      [ngClass]="appendSliderClass(symbolData ? symbolData['pgr'][1]['Financials'][3]['Return on Equity'] : null)"></div>
                    <div class="sliderBar"
                         [ngClass]="appendSliderBarClass(symbolData ? symbolData['pgr'][1]['Financials'][3]['Return on Equity'] : null)"
                         role="progressbar" aria-valuemin="0" aria-valuemax="100">
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div class="row justify-content-center justify-content-xl-start sliderBar-container">
                  <div class="col-6 col-sm-4 col-lg-5 col-xl-5 pgr__label">
                    <p>Price to Sales</p>
                  </div>
                  <div class="col-5 col-sm-6 col-md-5 col-lg-5 col-xl-6 sliderProgress">
                    <div
                      [ngClass]="appendSliderClass(symbolData ? symbolData['pgr'][1]['Financials'][4]['Price to Sales'] : null)"></div>
                    <div class="sliderBar"
                         [ngClass]="appendSliderBarClass(symbolData ? symbolData['pgr'][1]['Financials'][4]['Price to Sales'] : null)"
                         role="progressbar" aria-valuemin="0" aria-valuemax="100">
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div class="row justify-content-center justify-content-xl-start sliderBar-container">
                  <div class="col-6 col-sm-4 col-lg-5 col-xl-5 pgr__label">
                    <p>Free Cash Flow</p>
                  </div>
                  <div class="col-5 col-sm-6 col-md-5 col-lg-5 col-xl-6 sliderProgress">
                    <div
                      [ngClass]="appendSliderClass(symbolData ? symbolData['pgr'][1]['Financials'][5]['Free Cash Flow'] : null)"></div>
                    <div class="sliderBar"
                         [ngClass]="appendSliderBarClass(symbolData ? symbolData['pgr'][1]['Financials'][5]['Free Cash Flow'] : null)"
                         role="progressbar" aria-valuemin="0" aria-valuemax="100">
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <ng-container *ngIf="collapse['financials'] == true">
            <div class="col-12 hidden-lg-up">
              <div class="divider__long"></div>
            </div>
            <div class="col-12 col-lg-6 col-xl-5 copy-block">
              <p class="paragraph">
                {{ summary ? summary['financialContextSummary'][0]['generalSentence'] : null }}</p>
              <p class="paragraph">{{ summary ? summary['financialContextSummary'][0]['explanatorySentence'] : null
                }}</p>
            </div>
            <div class="col-12 col-xl-10 data-table">
              <div class="row">
                <div class="col-6 col-sm-3 col-md-6 col-lg-3">
                  <table>
                    <th colspan="2">Assets &amp; Liabilities</th>
                    <tr>
                      <td class="label">Current Ratio</td>
                      <td class="data">
                        {{ research ? (research['Assets and Liabilities']['Current Ratio'] | number:'.2-2' ) : null }}
                      </td>
                    </tr>
                    <tr>
                      <td class="label">LT Debt/ Equity</td>
                      <td class="data">
                        {{ research ? (research['Assets and Liabilities']['LT Debt/Equity'] | number:'.2-2' ) : null
                        }}
                      </td>
                    </tr>
                    <tr>
                      <td class="label">% Earn on Eqty</td>
                      <td class="data">{{ research ? (research['Returns']['Return on Equity'] | number:'.2-2' ) : null
                        }}
                      </td>
                    </tr>
                    <tr>
                      <td class="label">Book Value</td>
                      <td class="data">{{ research ? (research['Valuation']['Price/Book'] | number:'.2-2' ) : null }}
                      </td>
                    </tr>
                  </table>
                </div>
                <div class="col-6 col-sm-3 col-md-6 col-lg-3">
                  <table>
                    <th colspan="2">Valuation</th>
                    <tr>
                      <td class="label">Price/Earnings</td>
                      <td class="data">{{ symbolData ? (symbolData['fundamentalData']['P/E'] | decimal ) : null }}
                      </td>
                    </tr>
                    <tr>
                      <td class="label">PEG</td>
                      <td class="data">{{ competitors ? (competitors[0]['PEG'] | decimal ) : null }}</td>
                    </tr>
                    <tr>
                      <td class="label">Price to Book</td>
                      <td class="data">{{ research ? (research['Valuation']['Price/Book'] | decimal ) : null }}</td>
                    </tr>
                    <tr>
                      <td class="label">Price to Sales</td>
                      <td class="data">{{ research ? (research['Valuation']['Price/Sales'] | decimal ) : null }}</td>
                    </tr>
                  </table>
                </div>
                <div class="col-6 col-sm-3 col-md-6 col-lg-3">
                  <table>
                    <th colspan="2">Dividends</th>
                    <tr>
                      <td class="label">Div per Share</td>
                      <td class="data">
                        $ {{ symbolData ? (symbolData['fundamentalData']['dividend_per_share'] | decimal ) : null }}
                      </td>
                    </tr>
                    <tr>
                      <td class="label">Payout</td>
                      <td class="data">
                        {{ symbolData ? ((symbolData['fundamentalData']['payout']) * 100 | decimal ) : null }}%
                      </td>
                    </tr>
                    <tr>
                      <td class="label">Yield</td>
                      <td class="data">{{ symbolData ? (symbolData['fundamentalData']['Yield'] | decimal ) : null }}%
                      </td>
                    </tr>
                    <tr>
                      <td class="label">5Y Growth Rate</td>
                      <td class="data">
                        {{ symbolData ? ((symbolData['fundamentalData']['growth_rate']) * 100 | decimal ) : null
                        }}%
                      </td>
                    </tr>
                  </table>
                </div>
                <div class="col-6 col-sm-3 col-md-6 col-lg-3">
                  <table>
                    <th colspan="2">Returns</th>
                    <tr>
                      <td class="label">On Investment</td>
                      <td class="data">{{ research ? (research['Returns']['Return on Invest'] | decimal ) : null }}
                      </td>
                    </tr>
                    <tr>
                      <td class="label">On Equity</td>
                      <td class="data">{{ research ? (research['Returns']['Return on Equity'] | decimal ) : null }}
                      </td>
                    </tr>
                    <tr>
                      <td class="label">1 Month Return</td>
                      <td class="data">
                        {{ research ? (research['PriceActivity2']['% Change Price - 4 Weeks'] | decimal ) : null }}
                      </td>
                    </tr>
                    <tr>
                      <td class="label">3 Month Return</td>
                      <td class="data">
                        {{ research ? (research['PriceActivity2']['% Change Price - 24 Weeks'] | decimal ) : null }}
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
          </ng-container>

          <div *ngIf="collapse['financials'] == true" (click)="toggleCollapse('financials')"
               class="col-12 hidden-lg-up expand-collapse">
            <img src="./assets/imgs/ux__collapse--circle.svg">
            <p>Collapse</p>
          </div>
          <div *ngIf="collapse['financials'] == false" (click)="toggleCollapse('financials')"
               class="col-12 hidden-lg-up expand-collapse">
            <img src="./assets/imgs/ux__expand--dots.svg">
            <p>Expand for details</p>
          </div>

          <div class="col-12">
            <div class="divider__long"></div>
          </div>
        </div>

        <!-- BREAKDOWN - EARNINGS -->
        <div #earnings class="row justify-content-center stock-info stock-info--breakdown">
          <div class="pgr-section__icon col-12">
            <img class="align-absolute" src="./assets/imgs/icon__H1-Earnings.svg">
          </div>
          <div class="col-12">
            <h1>Earnings: <span class="">{{ summary ? summary['earningsContextSummary'][0]['status'] : null
              }}</span></h1>
          </div>

          <div class="col-12 col-lg-6 col-xl-5 stockview__PGR">
            <ul *ngIf="stock" class="pgr__sliders">
              <li>
                <div class="row justify-content-center justify-content-xl-start sliderBar-container">
                  <div class="col-6 col-sm-4 col-lg-5 col-xl-5 pgr__label">
                    <p>Earnings Growth</p>
                  </div>
                  <div class="col-5 col-sm-6 col-md-5 col-lg-5 col-xl-6  sliderProgress">
                    <div
                      [ngClass]="appendSliderClass(symbolData ? symbolData['pgr'][2]['Earnings'][1]['Earnings Growth'] : null)"></div>
                    <div class="sliderBar"
                         [ngClass]="appendSliderBarClass(symbolData ? symbolData['pgr'][2]['Earnings'][1]['Earnings Growth'] : null)"
                         role="progressbar" aria-valuemin="0" aria-valuemax="100">
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div class="row justify-content-center justify-content-xl-start sliderBar-container">
                  <div class="col-6 col-sm-4 col-lg-5 col-xl-5  pgr__label">
                    <p>Earnings Surprise</p>
                  </div>
                  <div class="col-5 col-sm-6 col-md-5 col-lg-5 col-xl-6 sliderProgress">
                    <div
                      [ngClass]="appendSliderClass(symbolData ? symbolData['pgr'][2]['Earnings'][2]['Earnings Surprise'] : null)"></div>
                    <div class="sliderBar"
                         [ngClass]="appendSliderBarClass(symbolData ? symbolData['pgr'][2]['Earnings'][2]['Earnings Surprise'] : null)"
                         role="progressbar" aria-valuemin="0" aria-valuemax="100">
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div class="row justify-content-center justify-content-xl-start sliderBar-container">
                  <div class="col-6 col-sm-4 col-lg-5 col-xl-5 pgr__label">
                    <p>Earnings Trend</p>
                  </div>
                  <div class="col-5 col-sm-6 col-md-5 col-lg-5 col-xl-6 sliderProgress">
                    <div
                      [ngClass]="appendSliderClass(symbolData ? symbolData['pgr'][2]['Earnings'][3]['Earnings Trend'] : null)"></div>
                    <div class="sliderBar"
                         [ngClass]="appendSliderBarClass(symbolData ? symbolData['pgr'][2]['Earnings'][3]['Earnings Trend'] : null)"
                         role="progressbar" aria-valuemin="0" aria-valuemax="100">
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div class="row justify-content-center justify-content-xl-start sliderBar-container">
                  <div class="col-6 col-sm-4 col-lg-5 col-xl-5 pgr__label">
                    <p>Projected P/E</p>
                  </div>
                  <div class="col-5 col-sm-6 col-md-5 col-lg-5 col-xl-6 sliderProgress">
                    <div
                      [ngClass]="appendSliderClass(symbolData ? symbolData['pgr'][2]['Earnings'][4]['Projected P/E'] : null)"></div>
                    <div class="sliderBar"
                         [ngClass]="appendSliderBarClass(symbolData ? symbolData['pgr'][2]['Earnings'][4]['Projected P/E'] : null)"
                         role="progressbar" aria-valuemin="0" aria-valuemax="100">
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div class="row justify-content-center justify-content-xl-start sliderBar-container">
                  <div class="col-6 col-sm-4 col-lg-5 col-xl-5 pgr__label">
                    <p>Earnings Consistency</p>
                  </div>
                  <div class="col-5 col-sm-6 col-md-5 col-lg-5 col-xl-6 sliderProgress">
                    <div
                      [ngClass]="appendSliderClass(symbolData ? symbolData['pgr'][2]['Earnings'][5]['Earnings Consistency'] : null)"></div>
                    <div class="sliderBar"
                         [ngClass]="appendSliderBarClass(symbolData ? symbolData['pgr'][2]['Earnings'][5]['Earnings Consistency'] : null)"
                         role="progressbar" aria-valuemin="0" aria-valuemax="100">
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <ng-container *ngIf="collapse['earnings']">
            <div class="col-12 hidden-lg-up">
              <div class="divider__long"></div>
            </div>

            <div class="col-12 col-lg-6 col-xl-5 copy-block">
              <p class="paragraph">
                {{ summary ? summary['earningsContextSummary'][0]['generalSentence'] : null }}</p>
              <p class="paragraph">{{ summary ? summary['earningsContextSummary'][0]['explanatorySentence'] : null
                }}</p>
            </div>

            <div class="col-12 col-lg-6 col-xl-5 section__chart">
              <div class="chart__header">
                <h3>Annual EPS</h3>
              </div>
              <div *ngIf="(annualEPSChart['data']['graphset'][0] | json) != '{}'" class="chart">
                <cpt-zingchart [chart]="annualEPSChart"></cpt-zingchart>
                <p class="chart-caption">
                  {{ research && research['EPS Quarterly Results'].hasOwnProperty('label') ? research['EPS Quarterly Results']['label'][0] : ''
                  }}</p>
              </div>
              <p class="empty-chart" *ngIf="(annualEPSChart['data']['graphset'][0] | json) === '{}'">No Data
                Available.</p>
            </div>

            <div class="col-12 col-lg-6 col-xl-5 section__chart">
              <div class="chart__header">
                <h3>Quarterly EPS</h3>
              </div>
              <div *ngIf="(qrtEPSChart['data']['graphset'][0] | json) != '{}'" class="chart">
                <cpt-zingchart [chart]="qrtEPSChart"></cpt-zingchart>
                <p class="chart-caption">
                  {{ research && research['EPS Quarterly Results'].hasOwnProperty('label') ? research['EPS Quarterly Results']['label'][0] : ''
                  }}</p>
              </div>
              <p class="empty-chart" *ngIf="(qrtEPSChart['data']['graphset'][0] | json) === '{}'">No Data Available.</p>
            </div>

            <div class="col-12 col-lg-6 col-xl-5 section__chart">
              <div class="chart__header">
                <h3>Earnings Announcement</h3>
              </div>
              <div *ngIf="(epsSurprisesChart['data']['graphset'][0] | json) != '{}'" class="chart">
                <cpt-zingchart [chart]="epsSurprisesChart"></cpt-zingchart>
                <p class="chart-caption">Next report: {{ symbolData ? symbolData['EPSData']['next_report_date'] : ''
                  }}</p>
              </div>
              <p class="empty-chart" *ngIf="(epsSurprisesChart['data']['graphset'][0] | json) === '{}'">No Data
                Available.</p>
            </div>

            <div class="col-12 col-lg-6 col-xl-5 section__chart">
              <div class="chart__header">
                <h3>Annual Revenue</h3>
              </div>
              <div *ngIf="(annualRevenueChart['data']['graphset'][0] | json) != '{}'" class="chart">
                <cpt-zingchart [chart]="annualRevenueChart"></cpt-zingchart>
              </div>
              <p class="empty-chart" *ngIf="(annualRevenueChart['data']['graphset'][0] | json) === '{}'">No Data
                Available.</p>
            </div>
          </ng-container>

          <div *ngIf="collapse['earnings'] == true" (click)="toggleCollapse('earnings')"
               class="col-12 hidden-lg-up expand-collapse">
            <img src="./assets/imgs/ux__collapse--circle.svg">
            <p>Collapse</p>
          </div>
          <div *ngIf="collapse['earnings'] == false" (click)="toggleCollapse('earnings')"
               class="col-12 hidden-lg-up expand-collapse">
            <img src="./assets/imgs/ux__expand--dots.svg">
            <p>Expand for details</p>
          </div>

          <div class="col-12">
            <div class="divider__long"></div>
          </div>
        </div>

        <!-- BREAKDOWN - TECHNICALS -->
        <div #technicals class="row justify-content-center stock-info stock-info--breakdown">
          <div class="pgr-section__icon col-12">
            <img class="align-absolute" src="./assets/imgs/icon__H1-Technicals.svg">
          </div>
          <div class="col-12">
            <h1>Technicals: <span>{{ summary ? summary['priceVolumeContextSummary'][0]['status'] : null }}</span></h1>
          </div>
          <div class="col-12 col-lg-6 col-xl-5 stockview__PGR">
            <ul *ngIf="stock" class="pgr__sliders">
              <li>
                <div class="row justify-content-center justify-content-xl-start sliderBar-container">
                  <div class="col-6 col-sm-4 col-lg-5 col-xl-5 pgr__label">
                    <p>Rel Strength vs Mrkt</p>
                  </div>
                  <div class="col-5 col-sm-6 col-md-5 col-lg-5 col-xl-6 sliderProgress">
                    <div
                      [ngClass]="appendSliderClass(symbolData ? symbolData['pgr'][3]['Technicals'][1]['Rel Strength vs Market'] : null)"></div>
                    <div class="sliderBar"
                         [ngClass]="appendSliderBarClass(symbolData ? symbolData['pgr'][3]['Technicals'][1]['Rel Strength vs Market'] : null)"
                         role="progressbar" aria-valuemin="0" aria-valuemax="100">
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div class="row justify-content-center justify-content-xl-start sliderBar-container">
                  <div class="col-6 col-sm-4 col-lg-5 col-xl-5 pgr__label">
                    <p>Chaikin Money Flow</p>
                  </div>
                  <div class="col-5 col-sm-6 col-md-5 col-lg-5 col-xl-6 sliderProgress">
                    <div
                      [ngClass]="appendSliderClass(symbolData ? symbolData['pgr'][3]['Technicals'][2]['Chaikin Money Flow'] : null)"></div>
                    <div class="sliderBar"
                         [ngClass]="appendSliderBarClass(symbolData ? symbolData['pgr'][3]['Technicals'][2]['Chaikin Money Flow'] : null)"
                         role="progressbar" aria-valuemin="0" aria-valuemax="100">
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div class="row justify-content-center justify-content-xl-start sliderBar-container">
                  <div class="col-6 col-sm-4 col-lg-5 col-xl-5 pgr__label">
                    <p>Price Strength</p>
                  </div>
                  <div class="col-5 col-sm-6 col-md-5 col-lg-5 col-xl-6 sliderProgress">
                    <div
                      [ngClass]="appendSliderClass(symbolData ? symbolData['pgr'][3]['Technicals'][3]['Price Strength'] : null)"></div>
                    <div class="sliderBar"
                         [ngClass]="appendSliderBarClass(symbolData ? symbolData['pgr'][3]['Technicals'][3]['Price Strength'] : null)"
                         role="progressbar" aria-valuemin="0" aria-valuemax="100">
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div class="row justify-content-center justify-content-xl-start sliderBar-container">
                  <div class="col-6 col-sm-4 col-lg-5 col-xl-5 pgr__label">
                    <p>Price Trend ROC</p>
                  </div>
                  <div class="col-5 col-sm-6 col-md-5 col-lg-5 col-xl-6 sliderProgress">
                    <div
                      [ngClass]="appendSliderClass(symbolData ? symbolData['pgr'][3]['Technicals'][4]['Price Trend ROC'] : null)"></div>
                    <div class="sliderBar"
                         [ngClass]="appendSliderBarClass(symbolData ? symbolData['pgr'][3]['Technicals'][4]['Price Trend ROC'] : null)"
                         role="progressbar" aria-valuemin="0" aria-valuemax="100">
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div class="row justify-content-center justify-content-xl-start sliderBar-container">
                  <div class="col-6 col-sm-4 col-lg-5 col-xl-5 pgr__label">
                    <p>Volume Trend</p>
                  </div>
                  <div class="col-5 col-sm-6 col-md-5 col-lg-5 col-xl-6 sliderProgress">
                    <div
                      [ngClass]="appendSliderClass(symbolData ? symbolData['pgr'][3]['Technicals'][5]['Volume Trend'] : null)"></div>
                    <div class="sliderBar"
                         [ngClass]="appendSliderBarClass(symbolData ? symbolData['pgr'][3]['Technicals'][5]['Volume Trend'] : null)"
                         role="progressbar" aria-valuemin="0" aria-valuemax="100">
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <ng-container *ngIf="collapse['technicals']">
            <div class="col-12 hidden-lg-up">
              <div class="divider__long"></div>
            </div>

            <div class="col-12 col-lg-6 col-xl-5 copy-block">
              <p class="paragraph">{{ summary ? summary['priceVolumeContextSummary'][0]['generalSentence'] : null
                }}</p>
              <p class="paragraph">{{ summary ? summary['priceVolumeContextSummary'][0]['explanatorySentence'] : null
                }}</p>
            </div>

            <div class="col-12 col-xl-10 stock-info">
              <div class="row data-table">
                <div class="col-6 col-sm-3 col-md-6 col-lg-3">
                  <table>
                    <th colspan="2">Price Activity</th>
                    <tr>
                      <td class="label">52 wk high</td>
                      <td class="data">{{ symbolData ? (symbolData['fundamentalData']['52 Wk Hi'] | decimal ) : null
                        }}
                      </td>
                    </tr>
                    <tr>
                      <td class="label">52 wk low</td>
                      <td class="data">{{ symbolData ? (symbolData['fundamentalData']['52 Wk Lo'] | decimal ) : null
                        }}
                      </td>
                    </tr>
                  </table>
                </div>
                <div class="col-6 col-sm-3 col-md-6 col-lg-3">
                  <table>
                    <th colspan="2">Price % Chg</th>
                    <tr>
                      <td class="label">% chg 4 wk rel S&amp;P</td>
                      <td class="data">
                        {{ research ? (research['PriceActivity2']['% Change Price - 4 Wks Rel to S&P'] | decimal ) : null
                        }}
                      </td>
                    <tr>
                      <td class="label">% chg 24 wk rel S&amp;P</td>
                      <td class="data">
                        {{ research ? (research['PriceActivity2']['% Change Price - 24 Wks Rel to S&P'] | decimal ) : null
                        }}
                      </td>
                    </tr>
                  </table>
                </div>
                <div class="col-6 col-sm-3 col-md-6 col-lg-3">
                  <table>
                    <th colspan="2">Volume Activity</th>
                    <tr>
                      <td class="label">Avg. vol 20 days</td>
                      <td class="data">
                        {{ research ? research['VolumeActivity']['Average Volume 20 Days'] : null }}
                      </td>
                    </tr>
                    <tr>
                      <td class="label">Avg. vol 90 days</td>
                      <td class="data">
                        {{ research ? research['VolumeActivity']['Average Volume 90 Days'] : null }}
                      </td>
                    </tr>
                  </table>
                </div>
                <div class="col-6 col-sm-3 col-md-6 col-lg-3">
                  <table>
                    <th colspan="2">Volatility Rel to Mkt</th>
                    <tr>
                      <td class="label">Beta</td>
                      <td class="data">
                        {{ research ? (symbolData['fundamentalData']['beta'] | decimal ) : null }}
                      </td>
                    </tr>
                    <tr>
                      <td class="label">Rel. Volatility</td>
                      <td class="data">
                        <span *ngIf="symbolData ? symbolData['fundamentalData']['beta'] < 1 : null">
                          Less Volatile
                        </span>
                        <span *ngIf="symbolData ? symbolData['fundamentalData']['beta'] == 1 : null">
                          Equally Volatile
                        </span>
                        <span *ngIf="symbolData ? symbolData['fundamentalData']['beta'] > 1 : null">
                          More Volatile
                        </span>
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
          </ng-container>

          <div *ngIf="collapse['technicals'] == true" (click)="toggleCollapse('technicals')"
               class="col-12 hidden-lg-up expand-collapse">
            <img src="./assets/imgs/ux__collapse--circle.svg">
            <p>Collapse</p>
          </div>
          <div *ngIf="collapse['technicals'] == false" (click)="toggleCollapse('technicals')"
               class="col-12 hidden-lg-up expand-collapse">
            <img src="./assets/imgs/ux__expand--dots.svg">
            <p>Expand for details</p>
          </div>

          <div class="col-12">
            <div class="divider__long"></div>
          </div>
        </div>

        <!-- BREAKDOWN - EXPERTS -->
        <div #experts class="row justify-content-center stock-info stock-info--breakdown">
          <div class="pgr-section__icon col-12">
            <img class="align-absolute" src="./assets/imgs/icon__H1-Experts.svg">
          </div>
          <div class="col-12">
            <h1>Experts: <span>{{ summary ? summary['expertOpnionsContextSummary'][0]['status'] : null }}</span></h1>
          </div>

          <div class="col-12 col-lg-6 col-xl-5 stockview__PGR">
            <ul *ngIf="stock" class="pgr__sliders">
              <li>
                <div class="row justify-content-center justify-content-xl-start sliderBar-container">
                  <div class="col-6 col-sm-4 col-lg-5 col-xl-5 pgr__label">
                    <p>Estimate Trend</p>
                  </div>
                  <div class="col-5 col-sm-6 col-md-5 col-lg-5 col-xl-6 sliderProgress">
                    <div
                      [ngClass]="appendSliderClass(symbolData ? symbolData['pgr'][4]['Experts'][1]['Estimate Trend'] : null)"></div>
                    <div class="sliderBar"
                         [ngClass]="appendSliderBarClass(symbolData ? symbolData['pgr'][4]['Experts'][1]['Estimate Trend'] : null)"
                         role="progressbar" aria-valuemin="0" aria-valuemax="100">
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div class="row justify-content-center justify-content-xl-start sliderBar-container">
                  <div class="col-6 col-sm-4 col-lg-5 col-xl-5 pgr__label">
                    <p>Short Interest</p>
                  </div>
                  <div class="col-5 col-sm-6 col-md-5 col-lg-5 col-xl-6 sliderProgress">
                    <div
                      [ngClass]="appendSliderClass(symbolData ? symbolData['pgr'][4]['Experts'][2]['Short Interest'] : null)"></div>
                    <div class="sliderBar"
                         [ngClass]="appendSliderBarClass(symbolData ? symbolData['pgr'][4]['Experts'][2]['Short Interest'] : null)"
                         role="progressbar" aria-valuemin="0" aria-valuemax="100">
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div class="row justify-content-center justify-content-xl-start sliderBar-container">
                  <div class="col-6 col-sm-4 col-lg-5 col-xl-5 pgr__label">
                    <p>Insider Activity</p>
                  </div>
                  <div class="col-5 col-sm-6 col-md-5 col-lg-5 col-xl-6 sliderProgress">
                    <div
                      [ngClass]="appendSliderClass(symbolData ? symbolData['pgr'][4]['Experts'][3]['Insider Activity'] : null)"></div>
                    <div class="sliderBar"
                         [ngClass]="appendSliderBarClass(symbolData ? symbolData['pgr'][4]['Experts'][3]['Insider Activity'] : null)"
                         role="progressbar" aria-valuemin="0" aria-valuemax="100">
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div class="row justify-content-center justify-content-xl-start sliderBar-container">
                  <div class="col-6 col-sm-4 col-lg-5 col-xl-5 pgr__label">
                    <p>Analyst Rating Trend</p>
                  </div>
                  <div class="col-5 col-sm-6 col-md-5 col-lg-5 col-xl-6 sliderProgress">
                    <div
                      [ngClass]="appendSliderClass(symbolData ? symbolData['pgr'][4]['Experts'][4]['Analyst Rating Trend'] : null)"></div>
                    <div class="sliderBar"
                         [ngClass]="appendSliderBarClass(symbolData ? symbolData['pgr'][4]['Experts'][4]['Analyst Rating Trend'] : null)"
                         role="progressbar" aria-valuemin="0" aria-valuemax="100">
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div class="row justify-content-center justify-content-xl-start sliderBar-container">
                  <div class="col-6 col-sm-4 col-lg-5 col-xl-5 pgr__label">
                    <p>Industry Rel Strength</p>
                  </div>
                  <div class="col-5 col-sm-6 col-md-5 col-lg-5 col-xl-6 sliderProgress">
                    <div
                      [ngClass]="appendSliderClass(symbolData ? symbolData['pgr'][4]['Experts'][5]['Industry Rel Strength'] : null)"></div>
                    <div class="sliderBar"
                         [ngClass]="appendSliderBarClass(symbolData ? symbolData['pgr'][4]['Experts'][5]['Industry Rel Strength'] : null)"
                         role="progressbar" aria-valuemin="0" aria-valuemax="100">
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <ng-container *ngIf="collapse['experts']">
            <div class="col-12 hidden-lg-up">
              <div class="divider__long"></div>
            </div>

            <div class="col-12 col-lg-6 col-xl-5 copy-block">
              <p class="paragraph">{{ summary ? summary['expertOpnionsContextSummary'][0]['generalSentence'] : null
                }}</p>
              <p class="paragraph">
                {{ summary ? summary['expertOpnionsContextSummary'][0]['explanatorySentence'] : null
                }}</p>
            </div>

            <div class="col-12 col-xl-10">
              <div class="row justify-content-center data-table">
                <div class="col-12 col-sm-6">
                  <table>
                    <th colspan="4">Earnings Estimate Revisions</th>
                    <tr>
                      <td class="label"></td>
                      <td class="label text-center">Current</td>
                      <td class="label text-center">7d Ago</td>
                      <td class="label text-center">% change</td>
                    </tr>
                    <tr>
                      <td class="label text-left">Current Quarter</td>
                      <td class="data text-center">
                        {{ research ? (research['Earning Estimate Revisions']['Current Qtr'][0] | decimal ) : null }}
                      </td>
                      <td class="data text-center">
                        {{ research ? (research['Earning Estimate Revisions']['Current Qtr'][1] | decimal ) : null }}
                      </td>
                      <td class="data text-center">
                        {{ research ? (research['Earning Estimate Revisions']['Current Qtr'][2] | decimal ) : null }}
                      </td>
                    </tr>
                    <tr>
                      <td class="label text-left">Next Quarter</td>
                      <td class="data text-center">
                        {{ research ? (research['Earning Estimate Revisions']['Next Qtr'][0] | decimal ) : null }}
                      </td>
                      <td class="data text-center">
                        {{ research ? (research['Earning Estimate Revisions']['Next Qtr'][1] | decimal ) : null }}
                      </td>
                      <td class="data text-center">
                        {{ research ? (research['Earning Estimate Revisions']['Next Qtr'][2] | decimal ) : null }}
                      </td>
                    </tr>
                  </table>
                </div>
                <div class="col-5 col-sm-3">
                  <table class="table--short-interest">
                    <th colspan="1">Short Interest</th>
                    <tr>
                      <td class="greyed-out"
                          [ngClass]="{'red': symbolData ? symbolData['pgr'][4]['Experts'][2]['Short Interest'] < 3 : null, 'greyed-out': symbolData ? symbolData['pgr'][4]['Experts'][2]['Short Interest'] >= 3 : null }">
                        HIGH
                      </td>
                    </tr>
                    <tr>
                      <td class="greyed-out"
                          [ngClass]="{'neutral': symbolData ? symbolData['pgr'][4]['Experts'][2]['Short Interest'] === 3 : null, 'greyed-out': symbolData ? symbolData['pgr'][4]['Experts'][2]['Short Interest'] != 3 : null  }">
                        MED
                      </td>
                    </tr>
                    <tr>
                      <td class="greyed-out"
                          [ngClass]="{'green': symbolData ? symbolData['pgr'][4]['Experts'][2]['Short Interest'] > 3 : null, 'greyed-out': symbolData ? symbolData['pgr'][4]['Experts'][2]['Short Interest'] <= 3 : null  }">
                        LOW
                      </td>
                    </tr>
                  </table>
                </div>
                <div class="col-7 col-sm-3">
                  <table>
                    <th colspan="2">Recommendations</th>
                    <tr>
                      <td class="label">This week</td>
                      <td class="data">{{ research ? research['Analyst Recommendations']['Mean this Week'] : null }}
                      </td>
                    </tr>
                    <tr>
                      <td class="label">Last Week</td>
                      <td class="data">{{ research ? research['Analyst Recommendations']['Mean Last Week'] : null }}
                      </td>
                    </tr>
                    <tr>
                      <td class="label">5 Weeks Ago</td>
                      <td class="data">{{ research ? research['Analyst Recommendations']['Mean 5 Weeks Ago'] : null }}
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
          </ng-container>

          <!-- COLLAPSE -->
          <div *ngIf="collapse['experts'] == true" (click)="toggleCollapse('experts')"
               class="col-12 hidden-lg-up expand-collapse">
            <img src="./assets/imgs/ux__collapse--circle.svg">
            <p>Collapse</p>
          </div>
          <div *ngIf="collapse['experts'] == false" (click)="toggleCollapse('experts')"
               class="col-12 hidden-lg-up expand-collapse">
            <img src="./assets/imgs/ux__expand--dots.svg">
            <p>Expand for details</p>
          </div>

          <div class="col-12">
            <div class="divider__full"></div>
          </div>

        </div>

        <!-- COMPETITION -->
        <div class="row justify-content-center stock-info stock-info--competition">
          <div class="col-12">
            <h2>The Competition</h2>
          </div>

          <div class="col-12 col-md-10 col-lg-6 col-xl-5 chart-list">
            <h4>Growth Comparison</h4>
            <div class="divider"></div>
            <ul>
              <li class="row no-gutters col-headers">
                <div class="col-3">
                  <p>TICKER</p>
                </div>
                <div class="col-3">
                  <p>HIST EPS</p>
                </div>
                <div class="col-3">
                  <p>PROJ EPS</p>
                </div>
                <div class="col-3">
                  <p>PROFIT MRG</p>
                </div>
              </li>
              <li (click)="gotoReport(stock['symbol'])" *ngFor="let stock of competitors" class="row no-gutters">
                <div class="col-3 ticker">
                  <p><span><img
                    src="{{ appendPGRImageComp(stock['corrected_pgr_rate'], stock['raw_pgr_rate']) }}"></span>
                    {{ stock['symbol']
                    }}</p>
                </div>
                <div class="col-3 data">
                  <p>{{ stock['Historic EPS growth'] }}</p>
                </div>
                <div class="col-3 data">
                  <p>{{ stock['Projected EPS growth'] }}</p>
                </div>
                <div class="col-3 data">
                  <p>{{ stock['Profit Margin'] }}</p>
                </div>
              </li>
            </ul>
          </div>

          <div class="col-12 col-md-10 col-lg-6 col-xl-5 chart-list">
            <h4>Revenue Compairson</h4>
            <div class="divider"></div>
            <ul>
              <li class="row no-gutters col-headers">
                <div class="col-3">
                  <p>TICKER</p>
                </div>
                <div class="col-3">
                  <p>PEG</p>
                </div>
                <div class="col-3">
                  <p>PE</p>
                </div>
                <div class="col-3">
                  <p>REVENUE</p>
                </div>
              </li>
              <li (click)="gotoReport(stock['symbol'])" *ngFor="let stock of competitors" class="row no-gutters">
                <div class="col-3 ticker">
                  <p><span><img
                    src="{{ appendPGRImageComp(stock['corrected_pgr_rate'], stock['raw_pgr_rate']) }}"></span>
                    {{ stock['symbol']
                    }}</p>
                </div>
                <div class="col-3 data">
                  <p>{{ stock['PEG'] }}</p>
                </div>
                <div class="col-3 data">
                  <p>{{ stock['PE'] }}</p>
                </div>
                <div class="col-3 data">
                  <p class="">{{ stock['Revenue(M)'] }}</p>
                </div>
              </li>
            </ul>
          </div>
          <div class="col-12">
            <div class="divider__full"></div>
          </div>
        </div>

        <!-- COMPANY PROFILE -->
        <div class="row justify-content-center stock-info stock-info--profile">
          <div class="col-12">
            <h2>Company Profile</h2>
          </div>

          <div class="col-12 col-lg-10 copy-block">
            <p class="paragraph">{{ symbolData ? symbolData['fundamentalData']['Company Text Blurb'] : null }}</p>
          </div>
        </div>

        <!-- DISCLAIMER -->
        <div class="row justify-content-center stock-info stock-info--disclaimer">
          <div class="col-12">
            <div class="divider__full"></div>
          </div>
          <div class="col-12 col-lg-10">
            <h4>Disclaimer:</h4>
            <p class="disclaimer">Chaikin Analytics (CA) is not registered as a securities Broker/Dealer or Investment
              Advisor with either the U.S. Securities and Exchange Commission or with any state securities regulatory
              authority. The information presented in our reports does not represent a recommendation to buy or sell
              stocks or any financial instrument nor is it intended as an endorsement of any security or investment.
              The information in this report does not take into account an individual's specific financial situation.
              The user bears complete responsibility for their own investment research and should consult with their
              financial advisor before making buy/sell decisions. For more information, see <a target="_blank"
                                                                                               href="http://www.chaikinanalytics.com/disclaimer/">disclaimer.</a>
              <a target="_blank" href="http://www.chaikinanalytics.com/attributions/">See Attributions &raquo;</a></p>
          </div>
        </div>

      </div>
    </div>
    <div *ngIf="!stock" class="etf--warning unselected--warning">
      <div class="warning-box align-absolute">
        <p class="warning__text align-absolute"><i class="far fa-search"></i> &nbsp;Search for a stock to get started.
        </p>
      </div>
    </div>
    <div *ngIf="is_etf" class="etf--warning">
      <div class="warning-box align-absolute">
        <p class="warning__text align-absolute">Chaikin stock analysis not available for ETFs at this time. Please check
          back later.<br> <a (click)="goBack()"><i class="fas fa-arrow-left"></i> &nbsp;GO BACK</a>
        </p>
      </div>
    </div>
  `,
  styleUrls: ['./stock-report.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StockReportComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('top') top: ElementRef;
  @ViewChild('newsList') newsList: ElementRef;
  @ViewChild('financials') financials: ElementRef;
  @ViewChild('earnings') earnings: ElementRef;
  @ViewChild('technicals') technicals: ElementRef;
  @ViewChild('experts') experts: ElementRef;

  private _ngUnsubscribe: Subject<void> = new Subject<void>();
  private _listId: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private _userStocks: BehaviorSubject<ListSymbolObj[]> = new BehaviorSubject<ListSymbolObj[]>([] as ListSymbolObj[]);
  private _apiHostName = this.utilService.getApiHostName();

  @Input('stock') stock: string;
  @Input('show') show: boolean;

  @Input('listId')
  set listId(val: string) {
    this._listId.next(val);
  }

  get listId() {
    return this._listId.getValue();
  }

  @Input('userStocks')
  set userStocks(val: ListSymbolObj[]) {
    this._userStocks.next(val);
  }

  get userStocks() {
    return this._userStocks.getValue();
  }

  @Output('closeClicked') closeClicked: EventEmitter<void> = new EventEmitter<void>();
  @Output('addStockClicked') addStockClicked: EventEmitter<string> = new EventEmitter<string>();
  @Output('removeStockClicked') removeStockClicked: EventEmitter<string> = new EventEmitter<string>();

  symbolData;
  headlines;
  summary;
  competitors;
  research;
  data;

  toolTipText: string = "Stock rating based on a 20-factor model that produces a rating from Very Bullish (or likely to outperform the market) to Very Bearish (unlikely to perform in the short to medium term). ";
  link: string = `${this.toolTipText}<a target="_blank" href="https://www.chaikinanalytics.com/stock-rating/">Read more here.</a>`;

  current: string = '1Y';
  mainChart: ZingChart = {
    id: 'mainChart',
    data: {
      graphset: []
    },
    height: undefined,
    width: undefined
  };
  annualEPSChart: ZingChart = {
    id: 'annualEPSChart',
    data: {
      graphset: []
    },
    height: undefined,
    width: undefined
  };
  qrtEPSChart: ZingChart = {
    id: 'qrtEPSChart',
    data: {
      graphset: []
    },
    height: undefined,
    width: undefined
  };
  epsSurprisesChart: ZingChart = {
    id: 'epsSurprisesChart',
    data: {
      graphset: []
    },
    height: undefined,
    width: undefined
  };
  annualRevenueChart: ZingChart = {
    id: 'annualRevenueChart',
    data: {
      graphset: []
    },
    height: undefined,
    width: undefined
  };

  scrollLeftHeadlines: number;
  collapse: object = {
    'financials': true,
    'earnings': true,
    'technicals': true,
    'experts': true
  };
  loading: Subscription;

  timespanPerChange: number;
  timespanPriceChange: number;

  is_etf: boolean;

  constructor(private reportService: ReportService,
              private authService: AuthService,
              private signalService: SignalService,
              private ideasService: IdeasService,
              private utilService: UtilService,
              private cd: ChangeDetectorRef,
              private location: Location,
              private symbolSearchService: SymbolSearchService,
              private router: Router) {
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    if (this.stock) {
      this.symbolSearchService.symbolLookup(this.stock)
        .take(1)
        .subscribe(val => {
          val[0] ? this.is_etf = val[0]['is_etf'] : this.is_etf = true;
          if (!this.is_etf) {
            this.getReportData(this.stock);
            this.getMainChart(this.stock);
          }
          this.cd.detectChanges();
        });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['stock'] && this.loading) {
      this.loading.unsubscribe();
      this.ngOnInit();
    }
  }

  ngOnDestroy() {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

  getReportData(stock: string) {
    this.current = '1Y';
    this.reportService.getSymbolData(stock)
      .take(1)
      .filter(x => x != undefined)
      .map(res => {
        this.symbolData = res;
        this.cd.markForCheck();
      })
      .switchMap(() => {
        return Observable.combineLatest(
          this.reportService.getPgrDataAndContextSummary(stock, this.symbolData['metaInfo'][0]['industry_name']),
          this.reportService.getTickerCompetitors(stock),
          this.reportService.getResearchReportData(stock),
          this.ideasService.getHeadlines(stock)
        )
      })
      .take(1)
      .subscribe(([summary, competitors, research, headlines]) => {
        this.summary = summary;
        const sen = this.summary['pgrContextSummary'][0]['mainSentence'];
        Object.assign(this.summary['pgrContextSummary'][0], {mainSentenceTM: sen.replace(/<TRADEMARK>/, '')});

        this.competitors = competitors['compititors'];
        this.research = research;
        this.headlines = headlines['headlines'] ? headlines['headlines'].filter((item, idx) => idx < 7) : [];

        const annualEPSData = research['EPS Quarterly Results'].hasOwnProperty('quaterlyData') ? research['EPS Quarterly Results']['quaterlyData'].map(x => +x[5].slice(1)) : null;
        const annualEPSDates = research['EPS Quarterly Results'].hasOwnProperty('quaterlyData') ? research['EPS Quarterly Results']['quaterlyData'].map(x => x[0]) : null;

        const qrtEPSData = research['EPS Quarterly Results'].hasOwnProperty('quaterlyData') ?
          research['EPS Quarterly Results']['quaterlyData']
            .map(x => x.splice(1).map(x => +x.slice(1))) : null;

        this.annualEPSChart = {
          id: 'annualEPSChart',
          data: {
            layout: "vertical",
            graphset: [
              this.getAnnualEPSConfg(annualEPSDates, annualEPSData)
            ]
          },
          height: undefined,
          width: undefined
        };
        this.qrtEPSChart = {
          id: 'qrtEPSChart',
          data: {
            layout: "vertical",
            graphset: [
              this.getQrtEPSConfig(annualEPSDates, qrtEPSData)
            ]
          },
          height: undefined,
          width: undefined
        };

        const epsSurprises = research['EPS Surprises'];

        const revDates = research['Revenue&EarningsGrowth']['labels'];
        const annualRev = research['Revenue&EarningsGrowth'].hasOwnProperty('Revenue(M)') ? research['Revenue&EarningsGrowth']['Revenue(M)']
          .map(x => parseFloat(x.replace(/,/g, ''))) : null;

        this.epsSurprisesChart = {
          id: 'epsSurprisesChart',
          data: {
            layout: "vertical",
            graphset: [
              this.getEPSSurprisesConfig(epsSurprises)
            ]
          },
          height: undefined,
          width: undefined
        };
        this.annualRevenueChart = {
          id: 'annualRevenueChart',
          data: {
            layout: "vertical",
            graphset: [
              this.getAnnualRevenueConfig(revDates, annualRev)
            ]
          },
          height: undefined,
          width: undefined
        };
        this.cd.markForCheck();
      });
  }

  getMainChart(stock: string) {
    this.loading = this.reportService.getStockSummaryData(stock)
      .take(1)
      .subscribe(data => {
        this.data = data;

        let dates, closePrices, pgrData, cmf, relStr;
        this.current === '5Y' ? dates = data['five_year_chart_data']['formatted_dates'] : dates = data['one_year_chart_data']['formatted_dates'].reverse();
        this.current === '5Y' ? closePrices = data['five_year_chart_data']['close_price'].map(x => +x).reverse() : closePrices = data['one_year_chart_data']['close_price'].map(x => +x).reverse();
        this.current === '5Y' ? pgrData = data['five_year_pgr_data']['pgr_data'].map(x => +x).reverse() : pgrData = data['one_year_pgr_data']['pgr_data'].map(x => +x).reverse();
        this.current === '5Y' ? cmf = data['five_year_chart_data']['cmf'].map(x => +x).reverse() : cmf = data['one_year_chart_data']['cmf'].map(x => +x).reverse();
        this.current === '5Y' ? relStr = data['five_year_chart_data']['relative_strength'].map(x => +x).reverse() : relStr = data['one_year_chart_data']['relative_strength'].map(x => +x).reverse();

        this.timespanPerChange = this.calculatePricePerChange(closePrices[0], closePrices[closePrices.length - 1]);
        this.timespanPriceChange = this.calculatePriceChange(closePrices[0], closePrices[closePrices.length - 1]);
        this.mainChart = {
          id: 'mainChart',
          data: {
            layout: "vertical",
            graphset: [
              this.getCloseConfig(dates, closePrices),
              this.getPGRConfig(dates, pgrData),
              this.getRSIConfig(dates, relStr),
              this.getCMFConfig(dates, cmf)
            ]
          },
          height: 650,
          width: undefined
        };
        this.loading ? this.loading.unsubscribe() : null;
        this.cd.markForCheck();
      });
  }

  closeReport() {
    this.show = false;
    this.closeClicked.emit();

    const recentlyViewedString = localStorage.getItem('recentlyViewed');
    if (!recentlyViewedString) {
      let data = {
        symbols: []
      };
      data.symbols.push(this.stock);
      localStorage.setItem('recentlyViewed', JSON.stringify(data));
      return;
    }
    const recentlyViewed = JSON.parse(recentlyViewedString);
    recentlyViewed.symbols.push(this.stock);
    recentlyViewed.symbols = recentlyViewed.symbols
      .filter((val, idx) => recentlyViewed.symbols.indexOf(val) == idx);
    if (recentlyViewed.symbols.length > 3) recentlyViewed.symbols.shift();
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed))
  }

  toggleCollapse(key: string) {
    if (!this.collapse[key]) {
      this.collapse[key] = true;
      return;
    }
    this.collapse[key] = !this.collapse[key];
  }

  getFiveYearChart() {
    this.current = '5Y';
    this.loading = new Subscription();

    const closePrices = this.data['five_year_chart_data']['close_price'].map(x => +x).reverse();
    const dates = this.data['five_year_chart_data']['formatted_dates'].slice().reverse();
    const pgrData = this.data['five_year_pgr_data']['pgr_data'].map(x => +x).reverse();
    const cmf = this.data['five_year_chart_data']['cmf'].map(x => +x).reverse();
    const relStr = this.data['five_year_chart_data']['relative_strength'].map(x => +x).reverse();

    this.timespanPerChange = this.calculatePricePerChange(closePrices[0], closePrices[closePrices.length - 1]);
    this.timespanPriceChange = this.calculatePriceChange(closePrices[0], closePrices[closePrices.length - 1]);
    this.mainChart = {
      id: 'mainChart',
      data: {
        layout: "vertical",
        graphset: [
          this.getCloseConfig(dates, closePrices),
          this.getPGRConfig(dates, pgrData),
          this.getRSIConfig(dates, relStr),
          this.getCMFConfig(dates, cmf)
        ]
      },
      height: 640,
      width: undefined
    };
    this.loading ? this.loading.unsubscribe() : null;
    this.cd.detectChanges();
  }

  toggleChartTime(span: string) {
    this.current = span;
    this.loading = new Subscription();

    var cut = 0;
    switch (span) {
      case '1W':
        cut = 5;
        break;
      case '1M':
        cut = 20;
        break;
      case '6M':
        cut = 120;
        break;
      case '1Y':
        cut = 250;
        break;
    }

    const dates = this.data['one_year_chart_data']['formatted_dates'].slice(this.data['one_year_chart_data']['formatted_dates'].length - cut);
    const closePrices = this.data['one_year_chart_data']['close_price'].map(x => +x).reverse()
      .slice(this.data['one_year_chart_data']['close_price'].length - cut);
    const pgrData = this.data['one_year_pgr_data']['pgr_data'].map(x => +x).reverse()
      .slice(this.data['one_year_pgr_data']['pgr_data'].length - cut);
    const cmf = this.data['one_year_chart_data']['cmf'].map(x => +x).reverse()
      .slice(this.data['one_year_chart_data']['cmf'].length - cut);
    const relStr = this.data['one_year_chart_data']['relative_strength'].map(x => +x).reverse()
      .slice(this.data['one_year_chart_data']['relative_strength'].length - cut);

    this.timespanPerChange = this.calculatePricePerChange(closePrices[0], closePrices[closePrices.length - 1]);
    this.timespanPriceChange = this.calculatePriceChange(closePrices[0], closePrices[closePrices.length - 1]);
    this.mainChart = {
      id: 'mainChart',
      data: {
        layout: "vertical",
        graphset: [
          this.getCloseConfig(dates, closePrices),
          this.getPGRConfig(dates, pgrData),
          this.getRSIConfig(dates, relStr),
          this.getCMFConfig(dates, cmf)
        ]
      },
      height: 630,
      width: undefined
    };
    this.loading ? this.loading.unsubscribe() : null;
    this.cd.detectChanges();
    gtag('event', 'chart_timespan_toggle', {
      'event_category': 'engagement',
      'event_label': span
    });
  }

  addStock(ticker: string) {
    this.addStockClicked.emit(ticker);
  }

  removeStock(ticker: string) {
    this.removeStockClicked.emit(ticker);
  }

  appendPGRImage(symbolData) {
    if (symbolData) {
      return this.signalService.appendPGRImage(symbolData['metaInfo'][0]['PGR'], symbolData['metaInfo'][0]['raw_PGR']);
    }
  }

  appendPGRText(symbolData) {
    if (symbolData) {
      return this.signalService.appendPGRText(symbolData['metaInfo'][0]['PGR'], symbolData['metaInfo'][0]['raw_PGR']);
    }
  }

  appendPGRImageComp(pgr, rawPgr) {
    return this.signalService.appendPGRImage(pgr, rawPgr);
  }

  appendSliderClass(pgr) {
    if (pgr) {
      return this.signalService.appendSliderClass(pgr);
    }
  }

  appendSliderBarClass(pgr) {
    if (pgr) {
      return this.signalService.appendSliderBarClass(pgr);
    }
  }

  goToHeadline(headline) {
    window.open(headline.url, '_blank');
  }

  gotoReport(symbol: string) {
    this.router.navigate(['stock-analysis', symbol]);
  }

  scrollRight() {
    this.scrollLeftHeadlines = this.newsList.nativeElement.scrollLeft;
    this.newsList.nativeElement.scrollTo({left: this.scrollLeftHeadlines += 350, top: 0, behavior: 'smooth'});
  }

  scrollLeft() {
    this.scrollLeftHeadlines = this.newsList.nativeElement.scrollLeft;
    this.newsList.nativeElement.scrollTo({left: this.scrollLeftHeadlines -= 350, top: 0, behavior: 'smooth'});
  }

  getCloseConfig(dates, values) {
    return {
      type: 'mixed',
      backgroundColor: "transparent",
      borderColor: "transparent",
      height: 380,
      x: 0,
      y: 0,
      crosshairX: {
        lineWidth: 2,
        lineColor: "#444",
        alpha: 0.5,
        shared: true,
        plotLabel: {
          fontFamily: "Open Sans",
          backgroundColor: "#b9e5fb",
          text: "Close: %v",
          borderColor: "#ffffff",
          strokeWidth: "2",
          height: 25,
          borderRadius: 12,
          y: -5,
        },
        scaleLabel: {
          visible: false,
        }
      },
      title: {
        visible: false,
        text: this.stock,
      },
      plotarea: {
        margin: "25 60",
      },
      "plot": {
        midPoint: true,
        "marker": {
          "visible": false
        }
      },
      tooltip: {
        visible: false,
        text: "CLOSE: %v",
        backgroundColor: "#BBB",
        borderColor: "transparent"
      },
      scaleYN: {
        lineColor: "#fff"
      },
      scaleY: {
        maxValue: Math.max(...values),
        minValue: Math.min(...values),
        autoFit: true,
        guide: {
          visible: true,
          lineStyle: 'solid',
          lineColor: "#eee",
        },
        placement: "opposite",
        item: {
          fontColor: "#999",
          fontSize: "14",
          fontWeight: "500",
          fontFamily: "Rajdhani"
        },
        tick: {
          visible: false,
        },
      },
      scaleXN: {
        lineColor: "#fff"
      },
      scaleX: {
        offset: 0,
        guide: {
          visible: false,
          lineStyle: 'solid',
          lineColor: "#eee"
        },
        values: dates,
        transform: {
          type: 'date',
          all: '%m/%d/%y'
        },
        item: {
          fontColor: "#999",
          fontSize: "14",
          fontWeight: "500",
          fontFamily: "Rajdhani"
        },
        tick: {
          visible: false,
        },
      },
      series: [
        {
          type: "area",
          values: values,
          lineColor: "#1199ff",
          lineWidth: 2,
          backgroundColor: "#1199ff #b9e5fb",
        }
      ]
    };
  }

  getRSIConfig(dates, values) {
    if (values) {
      return {
        type: 'mixed',
        height: 130,
        x: 0,
        y: 520,
        backgroundColor: "transparent",
        plotarea: {
          margin: "25 60"
        },
        "plot": {
          midPoint: true,
          "marker": {
            "visible": false
          }
        },
        source: {
          visible: false,
        },
        tooltip: {
          visible: false,
          text: "Rel. Strength: %v",
          fontFamily: "Open Sans",
          borderColor: "transparent"
        },
        title: {
          visible: true,
          text: "RELATIVE STRENGTH",
          fontColor: "#999999",
          fontFamily: 'Rajdhani',
          fontSize: 16,
          align: 'center',
          fontWeight: "600",
        },
        crosshairX: {
          lineWidth: 2,
          lineColor: "#444",
          alpha: 0.5,
          shared: true,
          scaleLabel: {
            visible: false
          },
          plotLabel: {
            fontFamily: "Open Sans",
            backgroundColor: "#b9e5fb",
            text: "Rel. Strength: %v",
            borderColor: "#ffffff",
            strokeWidth: "4",
            height: 25,
            borderRadius: 12,
            y: -5,
          }
        },
        scaleX: {
          offset: 0,
          visible: false,
        },
        scaleY: {
          visible: false,
          refValue: 0.5
        },
        series: [
          {
            type: "area",
            values: values,
            text: "Rel. Str",
            rules: [
              {
                rule: '%v < 0.5',
                backgroundColor: "#FFF352 #FD001F",
                lineColor: "#FD001F"
              }],
            backgroundColor: "#00C04E #FFF352",
            lineColor: "#00C04E",
            lineWidth: 2
          }
        ]
      };
    }
    return {};
  }

  getCMFConfig(dates, values) {
    if (values) {
      return {
        type: 'mixed',
        height: 130,
        x: 0,
        y: 395,
        backgroundColor: "#fff",
        plotarea: {
          margin: "25 60"
        },
        "plot": {
          midPoint: true,
          "marker": {
            "visible": false
          }
        },
        source: {
          visible: "false",
        },
        tooltip: {
          visible: false,
          text: "Chaikin Money Flow: %v",
          fontFamily: "Open Sans",
          borderColor: "transparent"
        },
        title: {
          visible: true,
          text: "CHAIKIN MONEY FLOW",
          fontColor: "#999999",
          fontFamily: 'Rajdhani',
          fontSize: 16,
          align: 'center',
          fontWeight: "600",
        },
        crosshairX: {
          lineWidth: 2,
          lineColor: "#444",
          alpha: 0.5,
          shared: true,
          scaleLabel: {
            visible: false
          },
          plotLabel: {
            fontFamily: "Open Sans",
            backgroundColor: "#b9e5fb",
            text: "Chaikin Money Flow: %v",
            borderColor: "#ffffff",
            strokeWidth: "4",
            height: 25,
            borderRadius: 12,
            y: -5,
          }
        },
        scaleX: {
          offset: 0,
          visible: false,
        },
        scaleY: {
          visible: false,
          refValue: 0
        },
        series: [
          {
            type: "area",
            values: values,
            text: "Chaikin Money Flow",
            // aspect: 'stepped',
            rules: [
              {
                rule: '%v <= 0',
                backgroundColor: "#FD001F",
                lineColor: "#FD001F"
              },
            ],
            backgroundColor: "#00C04E",
            alphaArea: 0.3,
            lineColor: "#00C04E",
            lineWidth: 2
          }
        ]
      };
    }
    return {};
  }

  getPGRConfig(dates, values) {
    if (values) {
      let veryBullish = [];
      let bullish = [];
      let neutral = [];
      let bearish = [];
      let veryBearish = [];
      let pgrData = [veryBullish, bullish, neutral, bearish, veryBearish];
      values.map(pgr => {
        pgrData.forEach((arr, idx) => {
          if (pgr === 5 && idx == 0) {
            arr.push(100);
            return;
          }
          if (pgr === 4 && idx == 1) {
            arr.push(100);
            return;
          }
          if (pgr === 3 && idx == 2) {
            arr.push(100);
            return;
          }
          if (pgr === 2 && idx == 3) {
            arr.push(100);
            return;
          }
          if (pgr === 1 && idx == 4) {
            arr.push(100);
            return;
          }
          arr.push(0);
        })
      });
      return {
        "type": "mixed",
        "height": 30,
        "x": 0,
        "y": 331,
        "plot": {
          midPoint: true,
          "stacked": true,
          "hover-state": {
            "visible": false
          }
        },
        "plotarea": {
          "margin": "0 62 0 61"
        },
        "borderColor": "transparent",
        "backgroundColor": "transparent",
        "scaleX": {
          offset: 0,
          "values": dates,
          "visible": false,
          "auto-fit": true,
          "lineWidth": 0,
          "lineColor": "none",
          "label": {
            "visible": false
          },
          "tick": {
            "visible": false
          },
          "guide": {
            "visible": false
          },
          "item": {
            "font-color": "#999",
            "visible": false
          },
          "zooming": true
        },
        "scaleY": {
          "lineWidth": 0,
          "lineColor": "none",
          "min-value": 0,
          "max-value": 200,
          "step": 0.75,
          "tick": {
            "visible": false
          },
          "guide": {
            "lineStyle": "solid"
          },
          "item": {
            "font-color": "#999",
            "visible": false
          }
        },
        "zoom": {
          "shared": true
        },
        "crosshairX": {
          "shared": true,
          "lineColor": "transparent",
          "visible": false,
          "plotLabel": {
            "multiple": false,
            "visible": false,
            "borderColor": "#ffffff",
            "strokeWidth": "4",
            "height": 25,
            "borderRadius": 12,
            "fontFamily": "Open Sans",
            "backgroundColor": "#b9e5fb",
            "rules": [
              {
                "rule": "%v == 100",
                "text": "%t",
                "visible": true
              }
            ],
            "y": -10
          }
        },
        "tooltip": {
          "visible": false,
          "htmlMode": true,
          "backgroundColor": "none",
          "padding": 0,
          "placement": "node:center",
          "text": "<div class='zingchart-tooltip'><div class='scalex-value'>%kt</div><div class='scaley-value'>$%v</div></div>"
        },
        "series": [
          {
            type: "bar",
            "values": veryBullish,
            "alpha": 1,
            "text": "Power Gauge: Very Bullish",
            "backgroundColor": "#24A300",
            "hover-state": {
              "visible": false
            }
          },
          {
            type: "bar",
            "values": bullish,
            "text": "Power Gauge: Bullish",
            "alpha": 1,
            "backgroundColor": "#6ACC00",
            "hover-state": {
              "visible": false
            }
          },
          {
            type: "bar",
            "values": neutral,
            "text": "Power Gauge: Neutral",
            "alpha": 1,
            "backgroundColor": "#FF9900",
            "hover-state": {
              "visible": false
            }
          },
          {
            type: "bar",
            "values": bearish,
            "text": "Power Gauge: Bearish",
            "alpha": 1,
            "backgroundColor": "#FD4500",
            "hover-state": {
              "visible": false
            }
          },
          {
            type: "bar",
            "values": veryBearish,
            "text": "Power Gauge: Very Bearish",
            "alpha": 1,
            "backgroundColor": "#EB001C",
            "hover-state": {
              "visible": false
            }
          }
        ]
      }
    }
    return {};
  }

  getAnnualEPSConfg(dates, values) {
    if (values) {
      return {
        "type": "bar",
        height: 360,
        "background-color": "white",
        "tooltip": {
          "text": "$%v",
          "decimals": 2
        },
        "plotarea": {
          "margin": "30 30 0 30",
          "y": "15"
        },
        "plot": {
          "animation": {
            "effect": "ANIMATION_SLIDE_BOTTOM"
          }
        },
        "scale-x": {
          "line-color": "transparent",
          "labels": dates,
          item: {
            fontColor: "#999",
            fontSize: "14",
            fontWeight: "500",
            fontFamily: "Rajdhani"
          },
          "guide": {
            "visible": false
          },
          "tick": {
            "visible": false
          },
        },
        "scale-y": {
          "min-value": 0,
          "decimals": 2,
          "line-color": "transparent",
          item: {
            fontColor: "#999",
            fontSize: "14",
            fontWeight: "500",
            fontFamily: "Rajdhani"
          },
          "tick": {
            "visible": false
          },
          "guide": {
            "visible": true
          },
          "label": {
            "font-family": "Open Sans",
            "font-angle": 0,
            "bold": true,
            "font-size": "14px",
            "font-color": "#484848",
            "offset-y": "-190px",
            "offset-x": "20px"
          },
        },
        "series": [
          {
            "values": values,
            "alpha": 0.75,
            "borderRadius": 7,
            "background-color": "#19c736 #00C04E",
            "rules": [
              {
                rule: '%v < 0',
                "background-color": "#F54225 #B6355C",
              }
            ]
          }
        ]
      }
    }
    return {};
  }

  getQrtEPSConfig(dates, values) {
    if (values) {
      const seriesA = [values[0][0], values[1][0], values[2][0]];
      const seriesB = [values[0][1], values[1][1], values[2][1]];
      const seriesC = [values[0][2], values[1][2], values[2][2]];
      const seriesD = [values[0][3], values[1][3], values[2][3]];
      return {
        "type": "bar",
        "height": "360",
        "background-color": "white",
        "tooltip": {
          "text": "$%v",
          "decimals": 2
        },
        "plotarea": {
          "margin": "30 30 0 30",
          "y": "15"
        },
        "plot": {
          "animation": {
            "effect": "ANIMATION_SLIDE_BOTTOM"
          }
        },
        "scale-x": {
          "line-color": "transparent",
          "labels": dates,
          item: {
            fontColor: "#999",
            fontSize: "14",
            fontWeight: "500",
            fontFamily: "Rajdhani"
          },
          "guide": {
            "visible": false
          },
          "tick": {
            "visible": false
          },
        },
        "scale-y": {
          "decimals": 2,
          "min-value": 0,
          "line-color": "transparent",
          item: {
            fontColor: "#999",
            fontSize: "14",
            fontWeight: "500",
            fontFamily: "Rajdhani"
          },
          "guide": {
            "visible": true
          },
          "tick": {
            "visible": false
          },
          "label": {
            "font-family": "Open Sans",
            "font-angle": 0,
            "bold": true,
            "font-size": "14px",
            "font-color": "#7E7E7E",
            "offset-y": "-190px",
            "offset-x": "20px"
          },
        },
        "series": [
          {
            "values": seriesA,
            "alpha": 0.75,
            "borderRadius": 7,
            "background-color": "#19c736 #00C04E",
            "rules": [
              {
                rule: '%v < 0',
                "background-color": "#F54225 #B6355C",
              }
            ]
          },
          {
            "values": seriesB,
            "alpha": 0.75,
            "borderRadius": 7,
            "background-color": "#19c736 #00C04E",
            "rules": [
              {
                rule: '%v < 0',
                "background-color": "#F54225 #B6355C",
              }
            ]
          },
          {
            "values": seriesC,
            "alpha": 0.75,
            "borderRadius": 7,
            "background-color": "#19c736 #00C04E",
            "rules": [
              {
                rule: '%v < 0',
                "background-color": "#F54225 #B6355C",
              }
            ]
          },
          {
            "values": seriesD,
            "alpha": 0.75,
            "borderRadius": 7,
            "background-color": "#19c736 #00C04E",
            "rules": [
              {
                rule: '%v < 0',
                "background-color": "#F54225 #B6355C",
              }
            ]
          }
        ]
      }
    }
    return {};
  }

  getEPSSurprisesConfig(values) {
    if (values) {
      const est = [
        +values['3 Qtr Ago'][0].slice(1),
        +values['2 Qtr Ago'][0].slice(1),
        +values['1 Qtr Ago'][0].slice(1),
        +values['Latest Qtr'][0].slice(1)
      ];
      const act = [
        +values['3 Qtr Ago'][1].slice(1),
        +values['2 Qtr Ago'][1].slice(1),
        +values['1 Qtr Ago'][1].slice(1),
        +values['Latest Qtr'][1].slice(1)
      ];
      return {
        "type": "scatter",
        "height": "360",
        "legend": {
          adjustLayout: true,
          "offset-y": "275px",
        },
        crosshairX: {
          lineWidth: 2,
          lineColor: "#444",
          alpha: 0.5,
          plotLabel: {
            text: '%t: %v',
            "decimals": 2,
            borderWidth: 2,
            bold: true,
          }
        },
        "background-color": "white",
        "tooltip": {
          "text": "$%v",
          "decimals": 2
        },
        "plotarea": {
          "margin": "30 30 0 30",
          "y": "15px"
        },
        "plot": {
          "animation": {
            "effect": "ANIMATION_SLIDE_BOTTOM"
          }
        },
        "scale-x": {
          "line-color": "transparent",
          "values": ['3 Qtrs ago', '2 Qtrs ago', '1 Qtr ago', 'Latest Qtr'],
          item: {
            fontColor: "#999",
            fontSize: "14",
            fontWeight: "500",
            fontFamily: "Rajdhani"
          },
          "guide": {
            "visible": false
          },
          "tick": {
            "visible": false,
          },
        },
        "scale-y": {
          "decimals": 2,
          "line-color": "#transparent",
          item: {
            fontColor: "#999",
            fontSize: "14",
            fontWeight: "500",
            fontFamily: "Rajdhani"
          },
          "guide": {
            "visible": true,
          },
          "tick": {
            "visible": false,
          },
          "label": {
            "font-family": "Open Sans",
            "font-angle": 0,
            "bold": true,
            "font-size": "14px",
            "font-color": "#484848",
            "offset-y": "-190px",
            "offset-x": "20px"
          },
        },
        "series": [
          {
            "values": act,
            "text": 'Actual',
            "alpha": 1,
            "marker": {
              "type": "circle",
              "border-width": 0,
              "size": 10,
              "background-color": "#666",
              "shadow": false
            },
          },
          {
            "values": est,
            "text": 'Estimate',
            "alpha": 0.4,
            "marker": {
              "type": "circle",
              "border-width": 0,
              "size": 10,
              "background-color": "#3150C6",
              "shadow": false
            },
          }
        ]
      }
    }
    return {};
  }

  getAnnualRevenueConfig(dates, values) {
    if (values) {
      return {
        "type": "bar",
        height: 360,
        "background-color": "white",
        "tooltip": {
          "text": "$%v (M)",
          "decimals": 2,
          "thousands-separator":",",
        },
        "plotarea": {
          "margin": "30 30 0 30",
          "y": "15px"
        },
        "plot": {
          "animation": {
            "effect": "ANIMATION_SLIDE_BOTTOM"
          }
        },
        "scale-x": {
          "line-color": "transparent",
          "labels": dates,
          item: {
            fontColor: "#999",
            fontSize: "14",
            fontWeight: "500",
            fontFamily: "Rajdhani"
          },
          "guide": {
            "visible": false
          },
          "tick": {
            "visible": false
          },
        },
        "scale-y": {
          "short": true,
          "thousands-separator":",",
          "min-value": 0,
          "multiplier": true,
          "line-color": "transparent",
          "line-style": "solid",
          item: {
            fontColor: "#999",
            fontSize: "14",
            fontWeight: "500",
            fontFamily: "Rajdhani"
          },
          "tick": {
            "visible": false
          },
          "guide": {
            "visible": true
          },
          "label": {
            "font-family": "Open Sans",
            "font-angle": 0,
            "bold": true,
            "font-size": "14px",
            "font-color": "#999",
            "offset-y": "-190px",
            "offset-x": "20px"
          },
        },
        "series": [
          {
            "values": values,
            "alpha": 0.75,
            "borderRadius": 7,
            "background-color": "#19c736 #00C04E",
            "rules": [
              {
                rule: '%v < 0',
                "background-color": "#F54225 #B6355C",
              }
            ]
          }
        ]
      }
    }
    return {};
  }

  getPDFStockReport(symbol: string) {
    this.authService.currentUser$
      .filter(x => x != undefined)
      .take(1)
      .subscribe(usr => {
        window.open(`${this._apiHostName}/CPTRestSecure/app/pdf/fetchReport?symbol=${symbol}&listID=${this.listId}&uid=${usr['UID']}&response=file&token=4XC534118T00FR73S127L77QWU65GA1H`, "_blank");
      });
    gtag('event', 'stock_report_pdf_clicked', {
      'event_category': 'engagement',
      'event_label': symbol
    });
  }

  calculatePricePerChange(firstClose: number, lastClose: number): number {
    return (((lastClose - firstClose) / firstClose ) * 100);
  }

  calculatePriceChange(firstClose: number, lastClose: number): number {
    return lastClose - firstClose;
  }

  resultInUserList(arr: ListSymbolObj[], ticker: string): boolean {
    if (arr) {
      return arr.filter(x => x['symbol'] == ticker).length > 0;
    }
  }

  jumpToFragment(viewChild, label: string) {
    viewChild.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
    gtag('event', 'report_fragment_clicked', {
      'event_category': 'engagement',
      'event_label': label
    });
  }

  goBack() {
    this.location.back();
  }

}

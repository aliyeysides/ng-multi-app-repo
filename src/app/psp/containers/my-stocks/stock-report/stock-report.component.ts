import {
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

declare var zingchart: any;

@Component({
  selector: 'cpt-psp-stock-report',
  template: `
    <div [ngBusy]="loading" class="component--stockview"
         [ngClass]="{
          'open': show, 
         'bearish': symbolData ? symbolData['metaInfo'][0]['PGR'] < 3 : null, 
         'neutral': symbolData ? symbolData['metaInfo'][0]['PGR'] == 3 : null, 
         'bullish': symbolData ? symbolData['metaInfo'][0]['PGR'] > 3 : null}">

      <!-- STOCK VIEW HEADER -->
      <div class="stockview__header">
        <div (click)="closeReport()" class="header__button header__button--left">
          <img class="align-absolute" src="./assets/imgs/icon_back-arrow--white.svg">
        </div>
        <div class="header__stock">
          <h1 class="ticker">{{ stock }}</h1>
          <p class="company-name">{{ symbolData ? symbolData['metaInfo'][0]['name'] : null }}</p>
        </div>
        <div class="header__button header__button--right">
          <img class="align-absolute" src="./assets/imgs/icon_plus--white.svg">
        </div>
      </div>

      <!-- STOCK VIEW CONTENTS -->
      <div class="container-fluid stockview__contents">

        <!-- STOCK VIEW TOP -->
        <div class="row no-gutters stock-info">
          <div class="col-12 hidden-md-up">
            <div class="tab--slide"></div>
          </div>
          <div class="col-12 stockview__main-rating">
            <p class="label">Power Gauge Rating &nbsp;<a><i class="fa fa-info-circle" aria-hidden="true"></i></a>
            <p class="rating">
              <img src="{{ appendPGRImage(symbolData) }}">
              <span>{{ appendPGRText(symbolData) }}</span>
            </p>
          </div>
          <div class="col-12 stockview__PGR">
            <ul *ngIf="stock" class="pgr__sliders">
              <li>
                <div class="row sliderBar-container">
                  <div class="col-1"></div>
                  <div class="col-4 pgr__label">
                    <p>Financials</p>
                  </div>
                  <div class="col-5 sliderProgress">
                    <div
                      [ngClass]="appendSliderClass(symbolData ? symbolData['pgr'][1]['Financials'][0]['Value'] : null)"></div>
                    <div class="sliderBar"
                         [ngClass]="appendSliderBarClass(symbolData ? symbolData['pgr'][1]['Financials'][0]['Value'] : null)"
                         role="progressbar" aria-valuemin="0" aria-valuemax="100">
                    </div>
                  </div>
                  <div class="col-2"></div>
                </div>
              </li>
              <li>
                <div class="row sliderBar-container">
                  <div class="col-1"></div>
                  <div class="col-4 pgr__label">
                    <p>Earnings</p>
                  </div>
                  <div class="col-5 sliderProgress">
                    <div
                      [ngClass]="appendSliderClass(symbolData ? symbolData['pgr'][2]['Earnings'][0]['Value'] : null)"></div>
                    <div class="sliderBar"
                         [ngClass]="appendSliderBarClass(symbolData ? symbolData['pgr'][2]['Earnings'][0]['Value'] : null)"
                         role="progressbar" aria-valuemin="0" aria-valuemax="100">
                    </div>
                  </div>
                  <div class="col-2"></div>
                </div>
              </li>
              <li>
                <div class="row sliderBar-container">
                  <div class="col-1"></div>
                  <div class="col-4 pgr__label">
                    <p>Technicals</p>
                  </div>
                  <div class="col-5 sliderProgress">
                    <div
                      [ngClass]="appendSliderClass(symbolData ? symbolData['pgr'][3]['Technicals'][0]['Value'] : null)"></div>
                    <div class="sliderBar"
                         [ngClass]="appendSliderBarClass(symbolData ? symbolData['pgr'][3]['Technicals'][0]['Value'] : null)"
                         role="progressbar" aria-valuemin="0" aria-valuemax="100">
                    </div>
                  </div>
                  <div class="col-2"></div>
                </div>
              </li>
              <li>
                <div class="row sliderBar-container">
                  <div class="col-1"></div>
                  <div class="col-4 pgr__label">
                    <p>Experts</p>
                  </div>
                  <div class="col-5 sliderProgress">
                    <div
                      [ngClass]="appendSliderClass(symbolData ? symbolData['pgr'][4]['Experts'][0]['Value'] : null)"></div>
                    <div class="sliderBar"
                         [ngClass]="appendSliderBarClass(symbolData ? symbolData['pgr'][4]['Experts'][0]['Value'] : null)"
                         role="progressbar" aria-valuemin="0" aria-valuemax="100">
                    </div>
                  </div>
                  <div class="col-2"></div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="divider__long"></div>
          </div>
        </div>

        <!-- STOCK VIEW PRICE -->
        <div class="row stock-info stock-info--price">
          <div class="col-12">
            <p class="current-price">{{ symbolData ? symbolData['metaInfo'][0]['Last'] : null }}</p>
          </div>
          <!--<div class="col-4">-->
          <!--<p class="data red">1107.23</p>-->
          <!--<p class="label">OPEN</p>-->
          <!--</div>-->
          <div class="col-4">
            <p class="data">{{ symbolData ? symbolData['metaInfo'][0]['Change'] : null }}</p>
            <p class="label">$ CHG</p>
          </div>
          <div class="col-4">
            <p class="data">({{ symbolData ? symbolData['metaInfo'][0]['Percentage '] : null }})</p>
            <p class="label">% CHG</p>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="divider__long"></div>
          </div>
        </div>

        <!-- STOCK VIEW CHART HEADER -->
        <div class="row stock-info stock-info--chart-toggle">
          <div class="col-12">
            <p class="chart-header__breakdown">Down <span>-12.02 &nbsp;(-3.23%)</span> over the last&hellip;
            </p>
          </div>
          <div class="col-2">
            <p class="date-select">1D</p>
          </div>
          <div class="col-2">
            <p class="date-select">1W</p>
          </div>
          <div class="col-2">
            <p class="date-select">1M</p>
          </div>
          <div class="col-2">
            <p class="date-select selected">6M</p>
          </div>
          <div class="col-2">
            <p class="date-select">1Y</p>
          </div>
          <div class="col-2">
            <p class="date-select">5Y</p>
          </div>
        </div>

        <!-- STOCK VIEW MAIN CHART -->
        <div class="row stock-info stock-info--chart">
          <div class="col-12 main-chart bearish">
            <!-- TODO: implement main chart -->
            <cpt-zingchart [chart]="mainChart"></cpt-zingchart>
          </div>
        </div>

        <!-- STOCK VIEW MONEYFLOW -->
        <div class="row stock-info stock-info--chart">
          <div class="col-12 "></div>
        </div>

        <!-- STOCK VIEW REL STRENGTH -->
        <div class="row stock-info stock-info--chart">
          <div class="col-12 "></div>
        </div>

        <div class="row">
          <div class="col-12">
            <div class="divider__full"></div>
          </div>
        </div>

        <!-- STOCK VIEW STATS -->
        <div class="row stock-info stock-info--stats">
          <div class="col-12">
            <h2>Today's Stats</h2>
          </div>
          <div class="col-4">
            <p class="data data--large">{{ (symbolData ? symbolData['fundamentalData']['Revenue'] : null) / 1000 }}B</p>
            <p class="label">REVENUE</p>
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
        </div>

        <div class="row">
          <div class="col-12">
            <div class="divider__long"></div>
          </div>
        </div>

        <!-- STOCK VIEW STATS -->
        <div class="row stock-info stock-info--stats">
          <div class="col-12 stock-industry">
            <p class="data">{{ symbolData ? symbolData['metaInfo'][0]['industry_name'] : null }}</p>
            <p class="label">INDUSTRY</p>
          </div>
          <div class="col-12 stock-industry">
            <p class="data">{{ research ? research['Details']['Sector'] : null }}</p>
            <p class="label">SECTOR</p>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="divider__full"></div>
          </div>
        </div>

        <!-- STOCK VIEW NEWS -->
        <div class="row stock-info stock-info--news">
          <div class="col-12">
            <h2>Recent News</h2>
          </div>

          <div class="col-12">
            <div class="divider__long"></div>
          </div>
          <div (click)="scrollLeft()" *ngIf="headlines?.length" class="col-1 chevron-slider chevron-slider--left">
            <img class="align-absolute" src="./assets/imgs/ui_chevron--left.svg">
          </div>
          <ul *ngIf="!headlines?.length" class="news-panel__container">
            <p class="news__none">There are currently no headlines for this symbol</p>
          </ul>
          <ul #newsList *ngIf="headlines?.length" class="col-10 news__slider">
            <li *ngFor="let headline of headlines" class="container">
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
            <img class="align-absolute" src="./assets/imgs/ui_chevron--right.svg">
          </div>
          <div class="col-12">
            <div class="divider__long"></div>
          </div>
          <div class="col-12 news__pagination">
            <!--<p>[ <span>{{ headlinePageNumber }}</span> of <span>{{ headlines?.length }}</span> ]</p>-->
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="divider__full"></div>
          </div>
        </div>

        <!-- STOCK VIEW BREAKDOWN -->
        <div class="row stock-info stock-info--overall-breakdown">
          <div class="col-12">
            <h2>Rating <span>Breakdown</span></h2>
          </div>

          <div class="col-12 copy-block">
            <p class="rating"><span>{{ stock?.toUpperCase() }}</span> is
              <span>{{ summary ? summary['pgrContextSummary'][0]['status'] : null }}</span></p>
            <p class="paragraph"><span>{{ symbolData ? symbolData['metaInfo'][0]['name'] : null }}:</span>
              {{ summary ? summary['pgrContextSummary'][0]['mainSentence'] : null }}</p>
            <p class="paragraph"> {{ summary ? summary['pgrContextSummary'][0]['additionalSentence'] : null }}</p>
          </div>
          <div class="col-12">
            <div class="divider__full"></div>
          </div>
        </div>

        <!-- BREAKDOWN - FINANCIALS -->
        <div class="row stock-info stock-info--breakdown">
          <div class="col-12">
            <h1>Financials: <span>{{ summary ? summary['financialContextSummary'][0]['status'] : null }}</span></h1>
          </div>

          <div class="col-12 stockview__PGR">
            <ul *ngIf="stock" class="pgr__sliders">
              <li>
                <div class="row sliderBar-container">
                  <div class="col-6 pgr__label">
                    <p>LT Debt to Equity</p>
                  </div>
                  <div class="col-5 sliderProgress">
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
                <div class="row sliderBar-container">
                  <div class="col-6 pgr__label">
                    <p>Price to Book</p>
                  </div>
                  <div class="col-5 sliderProgress">
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
                <div class="row sliderBar-container">
                  <div class="col-6 pgr__label">
                    <p>Return on Equity</p>
                  </div>
                  <div class="col-5 sliderProgress">
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
                <div class="row sliderBar-container">
                  <div class="col-6 pgr__label">
                    <p>Price to Sales</p>
                  </div>
                  <div class="col-5 sliderProgress">
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
                <div class="row sliderBar-container">
                  <div class="col-6 pgr__label">
                    <p>Free Cash Flow</p>
                  </div>
                  <div class="col-5 sliderProgress">
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
          <div class="col-12">
            <div class="divider__long"></div>
          </div>

          <div class="col-12 copy-block">
            <p class="paragraph"><span>{{ stock?.toUpperCase() }}'s</span>
              {{ summary ? summary['financialContextSummary'][0]['generalSentence'] : null }}</p>
            <p class="paragraph">{{ summary ? summary['financialContextSummary'][0]['explanatorySentence'] : null }}</p>
          </div>

          <div class="col-12 data-table">
            <div class="row">
              <div class="col-6 col-md-3">
                <table>
                  <th colspan="2">Assets &amp; Liabilities</th>
                  <tr>
                    <td class="label">Current Ratio</td>
                    <td class="data">{{ research ? research['Assets and Liabilities']['Current Ratio'] : null }}</td>
                  </tr>
                  <tr>
                    <td class="label">LT Debt/ Equity</td>
                    <td class="data">{{ research ? research['Assets and Liabilities']['LT Debt/Equity'] : null }}</td>
                  </tr>
                  <tr>
                    <td class="label">% Earn on Eqty</td>
                    <td class="data">{{ research ? research['Returns']['Return on Equity'] : null }}</td>
                  </tr>
                  <tr>
                    <td class="label">Book Value</td>
                    <td class="data">{{ research ? research['Valuation']['Price/Book'] : null }}</td>
                  </tr>
                </table>
              </div>
              <div class="col-6 col-md-3">
                <table>
                  <th colspan="2">Valuation</th>
                  <tr>
                    <td class="label">Price/Earnings</td>
                    <td class="data">{{ symbolData ? symbolData['fundamentalData']['P/E'] : null }}</td>
                  </tr>
                  <tr>
                    <td class="label">PEG</td>
                    <td class="data">{{ competitors ? competitors[0]['PEG'] : null }}</td>
                  </tr>
                  <tr>
                    <td class="label">Price to Book</td>
                    <td class="data">{{ research ? research['Valuation']['Price/Book'] : null }}</td>
                  </tr>
                  <tr>
                    <td class="label">Price to Sales</td>
                    <td class="data">{{ research ? research['Valuation']['Price/Sales'] : null }}</td>
                  </tr>
                </table>
              </div>
              <div class="col-6 col-md-3">
                <table>
                  <th colspan="2">Dividends</th>
                  <tr>
                    <td class="label">Div per Share</td>
                    <td class="data">{{ symbolData ? symbolData['fundamentalData']['dividend_per_share'] : null }}</td>
                  </tr>
                  <tr>
                    <td class="label">Payout</td>
                    <td class="data">{{ symbolData ? symbolData['fundamentalData']['payout'] : null }}</td>
                  </tr>
                  <tr>
                    <td class="label">Yield</td>
                    <td class="data">{{ symbolData ? symbolData['fundamentalData']['Yield'] : null }}</td>
                  </tr>
                  <tr>
                    <td class="label">Dividend Growth Rate</td>
                    <td class="data">{{ symbolData ? symbolData['fundamentalData']['growth_rate'] : null }}</td>
                  </tr>
                </table>
              </div>
              <div class="col-6 col-md-3">
                <table>
                  <th colspan="2">Returns</th>
                  <tr>
                    <td class="label">On Investment</td>
                    <td class="data">{{ research ? research['Returns']['Return on Invest'] : null }}</td>
                  </tr>
                  <tr>
                    <td class="label">On Equity</td>
                    <td class="data">{{ research ? research['Returns']['Return on Equity'] : null }}</td>
                  </tr>
                  <tr>
                    <td class="label">1 Month Return</td>
                    <td class="data">{{ research ? research['PriceActivity2']['% Change Price - 4 Weeks'] : null }}</td>
                  </tr>
                  <tr>
                    <td class="label">3 Month Return</td>
                    <td class="data">{{ research ? research['PriceActivity2']['% Change Price - 24 Weeks'] : null }}
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>

          <div class="col-12 expand-collapse">
            <img src="./assets/imgs/icon_chevron--up.svg">
            <p>COLLAPSE</p>
          </div>

          <div class="col-12">
            <div class="divider__full"></div>
          </div>
        </div>

        <!-- BREAKDOWN - EARNINGS -->
        <div class="row stock-info stock-info--breakdown">
          <div class="col-12">
            <h1>Earnings: <span class="yellow">{{ summary ? summary['earningsContextSummary'][0]['status'] : null
              }}</span></h1>
          </div>

          <div class="col-12 stockview__PGR">
            <ul *ngIf="stock" class="pgr__sliders">
              <li>
                <div class="row sliderBar-container">
                  <div class="col-6 pgr__label">
                    <p>Earnings Growth</p>
                  </div>
                  <div class="col-5 sliderProgress">
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
                <div class="row sliderBar-container">
                  <div class="col-6 pgr__label">
                    <p>Earnings Surprise</p>
                  </div>
                  <div class="col-5 sliderProgress">
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
                <div class="row sliderBar-container">
                  <div class="col-6 pgr__label">
                    <p>Earnings Trend</p>
                  </div>
                  <div class="col-5 sliderProgress">
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
                <div class="row sliderBar-container">
                  <div class="col-6 pgr__label">
                    <p>Projected P/E</p>
                  </div>
                  <div class="col-5 sliderProgress">
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
                <div class="row sliderBar-container">
                  <div class="col-6 pgr__label">
                    <p>Earnings Consistency</p>
                  </div>
                  <div class="col-5 sliderProgress">
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

          <div class="col-12">
            <div class="divider__long"></div>
          </div>

          <div class="col-12 copy-block">
            <p class="paragraph"><span>{{ stock?.toUpperCase() }}'s:</span>
              {{ summary ? summary['earningsContextSummary'][0]['generalSentence'] : null }}</p>
            <p class="paragraph">{{ summary ? summary['earningsContextSummary'][0]['explanatorySentence'] : null }}</p>
          </div>

          <div class="col-12">
            <div class="chart__header">
              <h3>Annual EPS</h3>
            </div>
            <div class="chart">
            </div>
          </div>
          <div class="col-12">
            <div class="chart__header">
              <h3>Quarterly EPS</h3>
            </div>
            <div class="chart">
            </div>
          </div>
          <div class="col-12">
            <div class="chart__header">
              <h3>Earnings Announcement</h3>
            </div>
            <div class="chart">
            </div>
          </div>
          <div class="col-12">
            <div class="chart__header">
              <h3>Annual Revenue</h3>
            </div>
            <div class="chart">
            </div>
          </div>

          <div class="col-12 expand-collapse">
            <img src="./assets/imgs/icon_chevron--down.svg">
            <p>EXPAND</p>
          </div>

          <div class="col-12">
            <div class="divider__full"></div>
          </div>
        </div>

        <!-- BREAKDOWN - TECHNICALS -->
        <div class="row stock-info stock-info--breakdown">
          <div class="col-12">
            <h1>Technicals: <span>{{ summary ? summary['priceVolumeContextSummary'][0]['status'] : null }}</span></h1>
          </div>
          <div class="col-12 stockview__PGR">
            <ul *ngIf="stock" class="pgr__sliders">
              <li>
                <div class="row sliderBar-container">
                  <div class="col-6 pgr__label">
                    <p>Rel Strength vs Market</p>
                  </div>
                  <div class="col-5 sliderProgress">
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
                <div class="row sliderBar-container">
                  <div class="col-6 pgr__label">
                    <p>Chaikin Money Flow</p>
                  </div>
                  <div class="col-5 sliderProgress">
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
                <div class="row sliderBar-container">
                  <div class="col-6 pgr__label">
                    <p>Price Strength</p>
                  </div>
                  <div class="col-5 sliderProgress">
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
                <div class="row sliderBar-container">
                  <div class="col-6 pgr__label">
                    <p>Price Trend ROC</p>
                  </div>
                  <div class="col-5 sliderProgress">
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
                <div class="row sliderBar-container">
                  <div class="col-6 pgr__label">
                    <p>Volume Trend</p>
                  </div>
                  <div class="col-5 sliderProgress">
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
          <div class="col-12">
            <div class="divider__long"></div>
          </div>

          <div class="col-12 copy-block">
            <p class="paragraph">{{ summary ? summary['priceVolumeContextSummary'][0]['generalSentence'] : null }}</p>
            <p class="paragraph">{{ summary ? summary['priceVolumeContextSummary'][0]['explanatorySentence'] : null
              }}</p>
          </div>

          <div class="col-12 stock-info">
            <div class="row data-table">
              <div class="col-6 col-sm-3">
                <table>
                  <th colspan="2">Price Hi/Lo</th>
                  <tr>
                    <td class="label">52 wk high</td>
                    <td class="data">{{ symbolData ? symbolData['fundamentalData']['52 Wk Hi'] : null }}</td>
                  </tr>
                  <tr>
                    <td class="label">52 wk low</td>
                    <td class="data">{{ symbolData ? symbolData['fundamentalData']['52 Wk Lo'] : null }}</td>
                  </tr>
                </table>
              </div>
              <div class="col-6 col-sm-3">
                <table>
                  <th colspan="2">Price % Chg</th>
                  <tr>
                    <td class="label">% chg 4 wk rel S&amp;P</td>
                    <td class="data">
                      {{ research ? research['PriceActivity2']['% Change Price - 4 Wks Rel to S&P'] : null }}
                    </td>
                  <tr>
                    <td class="label">% chg 24 wk rel S&amp;P</td>
                    <td class="data">
                      {{ research ? research['PriceActivity2']['% Change Price - 24 Wks Rel to S&P'] : null }}
                    </td>
                  </tr>
                </table>
              </div>
              <div class="col-6 col-sm-3">
                <table>
                  <th colspan="2">Volume Activity</th>
                  <tr>
                    <td class="label">avg. vol 20 days</td>
                    <td class="data">{{ research ? research['VolumeActivity']['Average Volume 20 Days'] : null }}</td>
                  </tr>
                  <tr>
                    <td class="label">avg. vol 90 days</td>
                    <td class="data">{{ research ? research['VolumeActivity']['Average Volume 90 Days'] : null }}</td>
                  </tr>
                </table>
              </div>
              <div class="col-6 col-sm-3">
                <table>
                  <th colspan="2">Volatility Rel to Mkt</th>
                  <tr>
                    <td class="label">% Change YTD Rel S&P 500</td>
                    <td class="data">{{ research ? research['PriceActivity1']['% Change YTD Rel S&P 500'] : null }}</td>
                  </tr>
                  <tr>
                    <td class="label">Chaikin Money Flow Persistency</td>
                    <td class="data">{{ research ? research['VolumeActivity']['Chaikin Money Flow Persistency'] : null
                      }}
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>

          <div class="col-12 expand-collapse">
            <img src="./assets/imgs/icon_chevron--up.svg">
            <p>COLLAPSE</p>
          </div>
          <div class="col-12">
            <div class="divider__full"></div>
          </div>
        </div>

        <!-- BREAKDOWN - EXPERTS -->
        <div class="row stock-info stock-info--breakdown">
          <div class="col-12">
            <h1>Experts: <span>{{ summary ? summary['expertOpnionsContextSummary'][0]['status'] : null }}</span></h1>
          </div>

          <div class="col-12 stockview__PGR">
            <ul *ngIf="stock" class="pgr__sliders">
              <li>
                <div class="row sliderBar-container">
                  <div class="col-6 pgr__label">
                    <p>Estimate Trend</p>
                  </div>
                  <div class="col-5 sliderProgress">
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
                <div class="row sliderBar-container">
                  <div class="col-6 pgr__label">
                    <p>Short Interest</p>
                  </div>
                  <div class="col-5 sliderProgress">
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
                <div class="row sliderBar-container">
                  <div class="col-6 pgr__label">
                    <p>Insider Activity</p>
                  </div>
                  <div class="col-5 sliderProgress">
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
                <div class="row sliderBar-container">
                  <div class="col-6 pgr__label">
                    <p>Analyst Rating Trend</p>
                  </div>
                  <div class="col-5 sliderProgress">
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
                <div class="row sliderBar-container">
                  <div class="col-6 pgr__label">
                    <p>Industry Rel Strength</p>
                  </div>
                  <div class="col-5 sliderProgress">
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
          <div class="col-12">
            <div class="divider__long"></div>
          </div>

          <div class="col-12 copy-block">
            <p class="paragraph">{{ summary ? summary['expertOpnionsContextSummary'][0]['generalSentence'] : null }}</p>
            <p class="paragraph">{{ summary ? summary['expertOpnionsContextSummary'][0]['explanatorySentence'] : null
              }}</p>
          </div>

          <div class="col-12">
            <div class="row data-table">
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
                      {{ research ? research['Earning Estimate Revisions']['Current Qtr'][0] : null }}
                    </td>
                    <td class="data text-center">
                      {{ research ? research['Earning Estimate Revisions']['Current Qtr'][1] : null }}
                    </td>
                    <td class="data text-center">
                      {{ research ? research['Earning Estimate Revisions']['Current Qtr'][2] : null }}
                    </td>
                  </tr>
                  <tr>
                    <td class="label text-left">Next Quarter</td>
                    <td class="data text-center">
                      {{ research ? research['Earning Estimate Revisions']['Next Qtr'][0] : null }}
                    </td>
                    <td class="data text-center">
                      {{ research ? research['Earning Estimate Revisions']['Next Qtr'][1] : null }}
                    </td>
                    <td class="data text-center">
                      {{ research ? research['Earning Estimate Revisions']['Next Qtr'][2] : null }}
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
                    <td
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
                    <td class="data">{{ research ? research['Analyst Recommendations']['Mean this Week'] : null }}</td>
                  </tr>
                  <tr>
                    <td class="label">Last Week</td>
                    <td class="data">{{ research ? research['Analyst Recommendations']['Mean Last Week'] : null }}</td>
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

          <div class="col-12 expand-collapse">
            <img src="./assets/imgs/icon_chevron--down.svg">
            <p>EXPAND</p>
          </div>

          <div class="col-12">
            <div class="divider__full"></div>
          </div>
        </div>

        <div class="row stock-info stock-info--competition">
          <div class="col-12">
            <h2>The Competition</h2>
          </div>

          <div class="col-12 chart-list">
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
              <li *ngFor="let stock of competitors" class="row no-gutters">
                <div class="col-3 ticker">
                  <p><span><img
                    src="{{ appendPGRImageComp(stock['corrected_pgr_rate'], stock['raw_pgr_rate']) }}"></span>{{ stock['symbol']
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

          <div class="col-12 chart-list">
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
              <li *ngFor="let stock of competitors" class="row no-gutters">
                <div class="col-3 ticker">
                  <p><span><img
                    src="{{ appendPGRImageComp(stock['corrected_pgr_rate'], stock['raw_pgr_rate']) }}"></span>{{ stock['symbol']
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
        <div class="row stock-info stock-info--profile">
          <div class="col-12">
            <h2>Company Profile</h2>
          </div>

          <div class="col-12 copy-block">
            <p class="paragraph">{{ symbolData ? symbolData['fundamentalData']['Company Text Blurb'] : null }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./stock-report.component.scss']
})
export class StockReportComponent implements OnInit, OnChanges, OnDestroy {
  private _ngUnsubscribe: Subject<void> = new Subject<void>();
  @Input('stock') stock: string;
  @Input('show') show: boolean;
  @Output('closeClicked') closeClicked: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('newsList') newsList: ElementRef;

  symbolData;
  headlines;
  summary;
  competitors;
  research;
  data;

  mainChart: ZingChart = {
    id: 'mainChart',
    data: {
      graphset: []
    },
    height: undefined,
    width: undefined
  };

  scrollLeftHeadlines: number;
  headlinePageNumber: number = 1;
  loading: Subscription;

  constructor(private reportService: ReportService,
              private signalService: SignalService,
              private ideasService: IdeasService) {
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    if (this.stock) {
      this.loading = this.reportService.getSymbolData(this.stock)
        .takeUntil(this._ngUnsubscribe)
        .filter(x => x != undefined)
        .map(res => this.symbolData = res)
        .switchMap(() => {
          return Observable.combineLatest(
            this.reportService.getPgrDataAndContextSummary(this.stock, this.symbolData['metaInfo'][0]['industry_name']),
            this.reportService.getTickerCompetitors(this.stock),
            this.reportService.getResearchReportData(this.stock),
            this.reportService.getStockSummaryData(this.stock),
            this.ideasService.getHeadlines(this.stock),
            // this.reportService.getStockDataPoints({
            //   symbol: this.stock,
            //   interval: '1D',
            //   dataComponents: 'HLC,dema,cmf,chaikinOscillations',
            //   numBars: '250'
            // })
          )
        })
        .subscribe(([summary, competitors, research, data, headlines]) => {
          this.summary = summary;
          this.competitors = competitors['compititors'];
          this.research = research;
          this.data = data;
          this.headlines = headlines['headlines'].filter((item, idx) => idx < 7);

          const closePrices = data['five_year_chart_data']['close_price'].map(x => +x).reverse();
          const dates = data['five_year_chart_data']['formatted_dates'].reverse();
          const pgrData = data['five_year_pgr_data']['pgr_data'].map(x => +x).reverse();
          const relStr = data['five_year_chart_data']['relative_strength'].map(x => +x).reverse();
          console.log('relStr', data['five_year_chart_data']['relative_strength']);
          this.mainChart = {
            id: 'mainChart',
            data: {
              layout: "vertical",
              graphset: [
                this.getCloseConfig(dates, closePrices, '5Y'),
                // this.getPGRConfig(dates, pgrData),
                this.getRSIConfig(dates, relStr),
              ]
            },
            height: undefined,
            width: undefined
          };
        });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes) this.ngOnInit()
  }

  ngOnDestroy() {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
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

  scrollRight() {
    this.headlinePageNumber < 7 ? this.headlinePageNumber++ : null;
    this.scrollLeftHeadlines = this.newsList.nativeElement.scrollLeft;
    this.newsList.nativeElement.scrollTo({left: this.scrollLeftHeadlines += 312.5, top: 0, behavior: 'smooth'});
  }

  scrollLeft() {
    this.headlinePageNumber != 0 ? this.headlinePageNumber-- : null;
    this.scrollLeftHeadlines = this.newsList.nativeElement.scrollLeft;
    this.newsList.nativeElement.scrollTo({left: this.scrollLeftHeadlines -= 312.5, top: 0, behavior: 'smooth'});
  }

  getCloseConfig(dates, values, current) {
    return {
      type: 'area',
      backgroundColor: "#333",
      height: 420,
      x: 0,
      y: 0,
      crosshairX: {
        shared: true,
        plotLabel: {
          backgroundColor: "#bbb",
          fontColor: "#222",
          text: "Close: %v",
          fontFamily: "Open Sans",
          y: 0,
        },
        scaleLabel: {
          fontColor: "#222",
          fontFamily: "Open Sans",
          backgroundColor: "#bbb",
        }
      },
      title: {
        text: this.stock,
        fontColor: "#fff",
        fontFamily: 'Open Sans',
        fontSize: 30,
        align: 'left',
        offsetX: 10
      },
      zoom: {
        shared: true
      },
      plotarea: {
        margin: "60 50 40 50"
      },
      plot: {
        marker: {
          visible: false
        }
      },
      tooltip: {
        text: "Close: %v",
        backgroundColor: "#BBB",
        borderColor: "transparent"
      },
      scaleY: {
        guide: {
          visible: true,
          lineStyle: 'solid',
          lineColor: "#444"
        },
        // values: values,
        item: {
          fontColor: "#ddd",
          fontFamily: "Open Sans"
        }
      },
      scaleX: {
        guide: {
          visible: true,
          lineStyle: 'solid',
          lineColor: "#444"
        },
        values: dates,
        transform: {
          type: 'date',
          all: '%m/%d/%y'
        },
        zooming: {
          shared: true
        },
        item: {
          fontColor: "#ddd",
          fontFamily: "Open Sans"
        }
      },
      series: [
        {
          values: values,
          lineColor: "#feffef",
          lineWidth: 3,
          backgroundColor: "#909090 #313131"
        }
      ],
      labels: [
        {
          x: 490,
          y: 10,
          id: '1W',
          fontColor: (current === '1W') ? "#FFF" : "#777",
          fontSize: "16",
          fontFamily: "Open Sans",
          cursor: "hand",
          text: "1W"
        },
        {
          x: 530,
          y: 10,
          id: '1M',
          fontColor: (current === '1M') ? "#FFF" : "#777",
          fontSize: "16",
          fontFamily: "Open Sans",
          cursor: "hand",
          text: "1M"
        },
        {
          x: 570,
          y: 10,
          id: '6M',
          fontColor: (current === '6M') ? "#FFF" : "#777",
          fontSize: "16",
          fontFamily: "Open Sans",
          cursor: "hand",
          text: "6M"
        },
        {
          x: 610,
          y: 10,
          id: '1Y',
          fontColor: (current === '1Y') ? "#FFF" : "#777",
          fontSize: "16",
          fontFamily: "Open Sans",
          cursor: "hand",
          text: "1Y"
        },
        {
          x: 650,
          y: 10,
          id: '5Y',
          fontColor: (current === '2Y') ? "#FFF" : "#777",
          fontSize: "16",
          fontFamily: "Open Sans",
          cursor: "hand",
          text: "5Y"
        }
      ]
    };
  }

  getRSIConfig(dates, values) {
    return {
      type: 'line',
      height: 100,
      x: 0,
      y: 400,
      backgroundColor: "#333",
      plotarea: {
        margin: "20 50 20 50"
      },
      plot: {
        marker: {
          visible: false
        }
      },
      source: {
        text: "chaikinanalytics.com",
        fontColor: "#ddd",
        fontFamily: "Open Sans"
      },
      tooltip: {
        visible: false,
        text: "RSI: %v",
        fontFamily: "Open Sans",
        borderColor: "transparent"
      },
      zoom: {
        shared: true
      },
      crosshairX: {
        shared: true,
        scaleLabel: {
          visible: false
        },
        plotLabel: {
          fontFamily: "Open Sans",
          backgroundColor: "#BBB",
          text: "RSI: %v",
          y: 0
        }
      },
      scaleX: {
        visible: false,
        zooming: true
      },
      scaleY: {
        visible: false
      },
      series: [
        {
          values: values,
          text: "RSI",
          rules: [
            {
              rule: '%v < 0.5',
              backgroundColor: "#bb2634",
              lineColor: "#bb2634"
            }],
          backgroundColor: "#51bb2c",
          lineColor: "#51bb2c",
          lineWidth: 3
        }
      ]
    };
  }

  getPGRConfig(dates, values) {
    return {
      type: 'bar',
      height: 80,
      x: 0,
      y: 380,
      backgroundColor: "#333",
      plotarea: {
        margin: "20 50 20 50"
      },
      plot: {
        marker: {
          visible: false
        }
      },
      source: {
        text: "chaikinanalytics.com",
        fontColor: "#ddd",
        fontFamily: "Open Sans"
      },
      tooltip: {
        visible: false,
        text: "PGR: %v",
        fontFamily: "Open Sans",
        borderColor: "transparent"
      },
      zoom: {
        shared: true
      },
      crosshairX: {
        shared: true,
        scaleLabel: {
          visible: false
        },
        plotLabel: {
          fontFamily: "Open Sans",
          backgroundColor: "#BBB",
          text: "PGR: %v",
          y: 0
        }
      },
      scaleX: {
        visible: false,
        zooming: true
      },
      scaleY: {
        visible: false
      },
      series: [
        {
          values: values,
          text: "PGR",
          backgroundColor: "#bbb",
        }
      ]
    };
  }


}

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
import {Chart} from '../../../../shared/models/chart';

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
            <cpt-chaikin-chart [chart]="mainChart"></cpt-chaikin-chart>
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

  dates = [1403506800000, 1403593200000, 1403679600000, 1403766000000, 1403852400000, 1404111600000, 1404198000000, 1404284400000, 1404370800000, 1404716400000, 1404802800000, 1404889200000, 1404975600000, 1405062000000, 1405321200000, 1405407600000, 1405494000000, 1405580400000, 1405666800000, 1405926000000, 1406012400000, 1406098800000, 1406185200000, 1406271600000, 1406530800000, 1406617200000, 1406703600000, 1406790000000, 1406876400000, 1407135600000, 1407222000000, 1407308400000, 1407394800000, 1407481200000, 1407740400000, 1407826800000, 1407913200000, 1407999600000, 1408086000000, 1408345200000, 1408431600000, 1408518000000, 1408604400000, 1408690800000, 1408950000000, 1409036400000, 1409122800000, 1409209200000, 1409295600000, 1409641200000, 1409727600000, 1409814000000, 1409900400000, 1410159600000, 1410246000000, 1410332400000, 1410418800000, 1410505200000, 1410764400000, 1410850800000, 1410937200000, 1411023600000, 1411110000000, 1411369200000, 1411455600000, 1411542000000, 1411628400000, 1411714800000, 1411974000000, 1412060400000, 1412146800000, 1412233200000, 1412319600000, 1412578800000, 1412665200000, 1412751600000, 1412838000000, 1412924400000, 1413183600000, 1413270000000, 1413356400000, 1413442800000, 1413529200000, 1413788400000, 1413874800000, 1413961200000, 1414047600000, 1414134000000, 1414393200000, 1414479600000, 1414566000000, 1414652400000, 1414738800000, 1415001600000, 1415088000000, 1415174400000, 1415260800000, 1415347200000, 1415606400000, 1415692800000, 1415779200000, 1415865600000, 1415952000000, 1416211200000, 1416297600000, 1416384000000, 1416470400000, 1416556800000, 1416816000000, 1416902400000, 1416988800000, 1417161600000, 1417420800000, 1417507200000, 1417593600000, 1417680000000, 1417766400000, 1418025600000, 1418112000000, 1418198400000, 1418284800000, 1418371200000, 1418630400000, 1418716800000, 1418803200000, 1418889600000, 1418976000000, 1419235200000, 1419321600000, 1419408000000, 1419580800000, 1419840000000, 1419926400000, 1420012800000, 1420185600000, 1420444800000, 1420531200000, 1420617600000, 1420704000000, 1420790400000, 1421049600000, 1421136000000, 1421222400000, 1421308800000, 1421395200000, 1421740800000, 1421827200000, 1421913600000, 1422000000000, 1422259200000, 1422345600000, 1422432000000, 1422518400000, 1422604800000, 1422864000000, 1422950400000, 1423036800000, 1423123200000, 1423209600000, 1423468800000, 1423555200000, 1423641600000, 1423728000000, 1423814400000, 1424160000000, 1424246400000, 1424332800000, 1424419200000, 1424678400000, 1424764800000, 1424851200000, 1424937600000, 1425024000000, 1425283200000, 1425369600000, 1425456000000, 1425542400000, 1425628800000, 1425884400000, 1425970800000, 1426057200000, 1426143600000, 1426230000000, 1426489200000, 1426575600000, 1426662000000, 1426748400000, 1426834800000, 1427094000000, 1427180400000, 1427266800000, 1427353200000, 1427439600000, 1427698800000, 1427785200000, 1427871600000, 1427958000000, 1428303600000, 1428390000000, 1428476400000, 1428562800000, 1428649200000, 1428908400000, 1428994800000, 1429081200000, 1429167600000, 1429254000000, 1429513200000, 1429599600000, 1429686000000, 1429772400000, 1429858800000, 1430118000000, 1430204400000, 1430290800000, 1430377200000, 1430463600000, 1430722800000, 1430809200000, 1430895600000, 1430982000000, 1431068400000, 1431327600000, 1431414000000, 1431500400000, 1431586800000, 1431673200000, 1431932400000, 1432018800000, 1432105200000, 1432191600000, 1432278000000, 1432623600000, 1432710000000, 1432796400000, 1432882800000, 1433142000000, 1433228400000, 1433314800000, 1433401200000, 1433487600000, 1433746800000, 1433833200000, 1433919600000, 1434006000000, 1434092400000, 1434351600000, 1434438000000, 1434524400000, 1434610800000, 1434697200000, 1434956400000, 1435042800000, 1435129200000, 1435215600000, 1435302000000, 1435561200000, 1435647600000, 1435734000000, 1435820400000, 1436166000000, 1436252400000, 1436338800000, 1436425200000, 1436511600000, 1436770800000, 1436857200000, 1436943600000, 1437030000000, 1437116400000, 1437375600000, 1437462000000, 1437548400000, 1437634800000, 1437721200000, 1437980400000, 1438066800000, 1438153200000, 1438239600000, 1438326000000, 1438585200000, 1438671600000, 1438758000000, 1438844400000, 1438930800000, 1439190000000, 1439276400000, 1439362800000, 1439449200000, 1439535600000, 1439794800000, 1439881200000, 1439967600000, 1440054000000, 1440140400000, 1440399600000, 1440486000000, 1440572400000, 1440658800000, 1440745200000, 1441004400000, 1441090800000, 1441177200000, 1441263600000, 1441350000000, 1441695600000, 1441782000000, 1441868400000, 1441954800000, 1442214000000, 1442300400000, 1442386800000, 1442473200000, 1442559600000, 1442818800000, 1442905200000, 1442991600000, 1443078000000, 1443164400000, 1443423600000, 1443510000000, 1443596400000, 1443682800000, 1443769200000, 1444028400000, 1444114800000, 1444201200000, 1444287600000, 1444374000000, 1444633200000, 1444719600000, 1444806000000, 1444892400000, 1444978800000, 1445238000000, 1445324400000, 1445410800000, 1445497200000, 1445583600000, 1445842800000, 1445929200000, 1446015600000, 1446102000000, 1446188400000, 1446451200000, 1446537600000, 1446624000000, 1446710400000, 1446796800000, 1447056000000, 1447142400000, 1447228800000, 1447315200000, 1447401600000, 1447660800000, 1447747200000, 1447833600000, 1447920000000, 1448006400000, 1448265600000, 1448352000000, 1448438400000, 1448611200000, 1448870400000, 1448956800000, 1449043200000, 1449129600000, 1449216000000, 1449475200000, 1449561600000, 1449648000000, 1449734400000, 1449820800000, 1450080000000, 1450166400000, 1450252800000, 1450339200000, 1450425600000, 1450684800000, 1450771200000, 1450857600000, 1450944000000, 1451289600000, 1451376000000, 1451462400000, 1451548800000, 1451894400000, 1451980800000, 1452067200000, 1452153600000, 1452240000000, 1452499200000, 1452585600000, 1452672000000, 1452758400000, 1452844800000, 1453190400000, 1453276800000, 1453363200000, 1453449600000, 1453708800000, 1453795200000, 1453881600000, 1453968000000, 1454054400000, 1454313600000, 1454400000000, 1454486400000, 1454572800000, 1454659200000, 1454918400000, 1455004800000, 1455091200000, 1455177600000, 1455264000000, 1455609600000, 1455696000000, 1455782400000, 1455868800000, 1456128000000, 1456214400000, 1456300800000, 1456387200000, 1456473600000, 1456732800000, 1456819200000, 1456905600000, 1456992000000, 1457078400000, 1457337600000, 1457424000000, 1457510400000, 1457596800000, 1457683200000, 1457938800000, 1458025200000, 1458111600000, 1458198000000, 1458284400000, 1458543600000, 1458630000000, 1458716400000, 1458802800000, 1459148400000, 1459234800000, 1459321200000, 1459407600000, 1459494000000, 1459753200000, 1459839600000, 1459926000000, 1460012400000, 1460098800000, 1460358000000, 1460444400000, 1460530800000, 1460617200000, 1460703600000, 1460962800000, 1461049200000, 1461135600000, 1461222000000, 1461308400000, 1461567600000, 1461654000000, 1461740400000, 1461826800000, 1461913200000, 1462172400000, 1462258800000, 1462345200000, 1462431600000, 1462518000000, 1462777200000, 1462863600000, 1462950000000, 1463036400000, 1463122800000, 1463382000000, 1463468400000, 1463554800000, 1463641200000, 1463727600000, 1463986800000, 1464073200000, 1464159600000, 1464246000000, 1464332400000, 1464678000000, 1464764400000, 1464850800000, 1464937200000, 1465196400000, 1465282800000, 1465369200000, 1465455600000, 1465542000000, 1465801200000, 1465887600000, 1465974000000, 1466060400000, 1466146800000, 1466406000000];
  closes = [564.95, 564.62, 578.65, 576, 577.24, 575.28, 582.67, 582.335, 584.73, 582.25, 571.09, 576.08, 571.1, 579.18, 584.87, 584.78, 582.66, 573.7299, 595.08, 589.47, 594.74, 595.98, 593.35, 589.02, 590.6, 585.61, 587.42, 571.6, 566.07, 573.15, 565.07, 566.374, 563.36, 568.77, 567.88, 562.73, 574.78, 574.65, 573.48, 582.16, 586.86, 584.49, 583.37, 582.56, 580.2, 577.86, 571, 569.2, 571.6, 577.33, 577.94, 581.98, 586.08, 589.72, 581.01, 583.1, 581.35, 575.62, 573.1, 579.95, 584.77, 589.27, 596.08, 587.37, 581.13, 587.99, 575.06, 577.1, 576.36, 577.36, 568.27, 570.08, 575.28, 577.35, 563.74, 572.5, 560.88, 544.49, 533.21, 537.94, 530.03, 524.51, 511.17, 520.84, 526.54, 532.71, 543.98, 539.78, 540.77, 548.9, 549.33, 550.31, 559.08, 555.22, 554.11, 545.92, 542.04, 541.01, 547.49, 550.29, 547.31, 545.38, 544.4, 536.51, 535.03, 536.99, 534.83, 537.5, 539.27, 541.08, 540.37, 541.83, 533.8, 533.75, 531.32, 537.31, 525.26, 526.98, 533.37, 526.06, 528.34, 518.66, 513.8, 495.39, 504.89, 511.1, 516.35, 524.87, 530.59, 528.77, 534.03, 530.33, 530.42, 526.4, 524.81, 513.87, 501.96, 501.1, 502.68, 496.17, 492.55, 496.18, 500.87, 501.79, 508.08, 506.9, 518.04, 534.39, 539.95, 535.21, 518.63, 510, 510.66, 534.52, 528.48, 529.24, 522.76, 527.58, 531, 527.83, 536.94, 535.97, 542.93, 549.01, 542.84, 539.7, 542.87, 538.95, 531.91, 536.09, 543.87, 555.48, 558.4, 571.34, 573.64, 573.37, 575.33, 567.685, 568.85, 555.01, 551.18, 555.51, 547.32, 554.51, 550.84, 559.5, 557.99, 560.36, 558.81, 570.19, 558.785, 555.17, 548.34, 552.03, 548, 542.56, 535.53, 536.765, 537.02, 541.61, 540.78, 540.01, 539.17, 530.39, 532.53, 533.8, 524.05, 535.38, 533.97, 539.365, 547, 565.06, 555.37, 553.68, 549.08, 537.34, 537.9, 540.78, 530.8, 524.22, 530.7, 538.22, 535.7, 529.04, 529.62, 538.4, 533.85, 532.3, 537.36, 539.27, 542.51, 540.11, 532.32, 539.79, 539.78, 532.11, 533.99, 539.18, 540.31, 536.7, 533.33, 526.83, 526.69, 536.69, 534.61, 532.33, 527.2, 528.15, 529.26, 536.73, 536.69, 538.19, 540.48, 537.84, 535.23, 531.69, 521.52, 520.51, 521.84, 523.4, 522.86, 525.02, 516.83, 520.68, 530.13, 546.55, 561.1, 560.22, 579.85, 672.93, 663.02, 662.3, 662.1, 644.28, 623.56, 627.26, 628, 631.93, 632.59, 625.61, 631.21, 629.25, 643.78, 642.68, 635.3, 633.73, 660.78, 659.56, 656.45, 657.12, 660.87, 656.13, 660.9, 646.83, 612.48, 589.61, 582.06, 628.62, 637.61, 630.38, 618.25, 597.79, 614.34, 606.25, 600.7, 614.66, 612.72, 621.35, 625.77, 623.24, 635.14, 635.98, 642.9, 629.25, 635.44, 622.69, 622.36, 625.8, 611.97, 594.89, 594.97, 608.42, 611.29, 626.91, 641.47, 645.44, 642.36, 639.16, 643.61, 646.67, 652.3, 651.16, 661.74, 662.2, 666.1, 650.28, 642.61, 651.79, 702, 712.78, 708.49, 712.95, 716.92, 710.81, 721.11, 722.16, 728.11, 731.25, 733.76, 724.89, 728.32, 735.4, 731.23, 717, 728.96, 725.3, 740, 738.41, 756.6, 755.98, 748.28, 748.15, 750.26, 742.6, 767.04, 762.38, 752.54, 766.81, 763.25, 762.37, 751.61, 749.46, 738.87, 747.77, 743.4, 758.09, 749.43, 739.31, 747.77, 750, 750.31, 748.4, 762.51, 776.6, 771, 758.88, 741.84, 742.58, 743.62, 726.39, 714.47, 716.03, 726.07, 700.56, 714.72, 694.45, 701.79, 698.45, 706.59, 725.25, 711.67, 713.04, 699.99, 730.96, 742.95, 752, 764.65, 726.95, 708.01, 683.57, 682.74, 678.11, 684.12, 683.11, 682.4, 691, 708.4, 697.35, 700.91, 706.46, 695.85, 699.56, 705.75, 705.07, 697.77, 718.81, 718.85, 712.42, 710.89, 695.16, 693.97, 705.24, 712.82, 726.82, 730.49, 728.33, 736.09, 737.78, 737.6, 742.09, 740.75, 738.06, 735.3, 733.53, 744.77, 750.53, 744.95, 749.91, 745.29, 737.8, 745.69, 740.28, 739.15, 736.1, 743.09, 751.72, 753.2, 759, 766.61, 753.93, 752.67, 759.14, 718.77, 723.15, 708.14, 705.84, 691.02, 693.01, 698.21, 692.36, 695.7, 701.43, 711.12, 712.9, 723.18, 715.29, 713.31, 710.83, 716.49, 706.23, 706.63, 700.32, 709.74, 704.24, 720.09, 725.27, 724.12, 732.66, 735.72, 734.15, 730.4, 722.34, 716.55, 716.65, 728.28, 728.58, 719.41, 718.36, 718.27, 718.92, 710.36, 691.72, 693.71];
  volumes = [1532354, 2201002, 1961435, 1725575, 2227207, 1310062, 1444029, 1053529, 712210, 1059944, 1904121, 1111847, 1351100, 1617309, 1848917, 1618230, 1393153, 2977775, 4000578, 2056420, 1691117, 1229730, 1032015, 929755, 980623, 1343951, 1013596, 2089324, 1946815, 1422379, 1551233, 1325466, 1106395, 1490706, 1210852, 1533541, 1435281, 982814, 1514966, 1280214, 975948, 1033657, 912165, 786115, 1357175, 1634286, 1696418, 1289128, 1076718, 1574096, 1211507, 1454229, 1626806, 1426597, 1283678, 972057, 1215910, 1594177, 1593030, 1475668, 1687731, 1438201, 3724109, 1684861, 1464386, 1723438, 1918179, 1439687, 1278274, 1617320, 1441527, 1181177, 1137616, 1211113, 1902424, 1984777, 2517847, 3073334, 2565034, 2215425, 3705634, 3665434, 5522919, 2598754, 2329510, 2911235, 2341998, 1966151, 1182069, 1246198, 1762805, 1451532, 2029446, 1377090, 1236913, 2022352, 1327323, 1627870, 1129377, 961011, 1124171, 1334367, 1284981, 1720123, 1954931, 1382955, 1557095, 2217252, 1699629, 1782596, 1518835, 1145231, 2106865, 1521775, 1278091, 1389395, 2555642, 2324883, 1866851, 1716284, 1606381, 1982666, 2806300, 3946450, 2873600, 2910920, 3611980, 2722210, 2190993, 704035, 1037486, 2275392, 873644, 1367110, 1444809, 2049303, 2884479, 2053750, 3341935, 2063743, 2317278, 2365612, 2210623, 2710022, 2291530, 2222805, 2259477, 2662154, 2272098, 1538786, 1897347, 1677083, 4105168, 5588904, 2836638, 2032952, 1657900, 1843714, 1758422, 1263243, 1744529, 1372342, 1612310, 1876720, 1609871, 1448453, 986623, 1441147, 1453049, 1002313, 1820199, 2303785, 2402191, 2121542, 1696631, 1869830, 1385303, 1647702, 1059336, 1785438, 1815503, 1385657, 1697602, 1636083, 1800550, 2125596, 1192429, 2607253, 1639186, 2573339, 2144268, 1565551, 1890816, 1283210, 1583330, 1951319, 1709833, 1317628, 1299253, 1171860, 1551831, 1405136, 1640741, 2590747, 2305585, 1293690, 2143872, 1674958, 1838719, 1582956, 4129218, 4916008, 2390696, 1490735, 1696886, 2080834, 1758085, 1303830, 1380519, 1566865, 1543986, 1527181, 904465, 1633180, 1253005, 1401005, 1965088, 2001117, 1964037, 1430565, 1461431, 1175065, 2404462, 1524783, 1029764, 2590445, 1900257, 1936721, 1716836, 1346044, 1375008, 1523960, 1454172, 1813775, 1208632, 955489, 1632675, 1071728, 1269113, 1832450, 1890916, 1243535, 1196115, 1286576, 1332412, 2108629, 1935361, 2234284, 1961197, 1235773, 1278587, 1595672, 1293372, 1840155, 1954951, 2204610, 3231284, 1782264, 4559712, 11153500, 5857092, 3363342, 3707818, 3014035, 3622089, 2673801, 1713684, 1573146, 1472286, 1705286, 1301439, 1486858, 2331720, 1572150, 1403441, 1653836, 5016425, 2938651, 1807182, 1071333, 1050553, 1455664, 2132265, 2854028, 4261666, 5727282, 3521916, 4187276, 3485906, 1975818, 2172168, 3699844, 2573982, 1757851, 2087028, 2277487, 1699686, 1903334, 1372803, 1701618, 2082426, 1276250, 2259404, 5123314, 1786543, 2561551, 1470633, 2238097, 2173134, 3118693, 2310065, 2412754, 1866223, 2681241, 1802263, 2235078, 2092536, 2181990, 1648656, 1275565, 1806003, 1413798, 1832832, 1610712, 1465691, 2498077, 1792869, 3994360, 6651909, 2709292, 2232183, 2178841, 1455508, 1907732, 1885155, 1565355, 1705745, 1861100, 1510586, 2068920, 1606499, 1366611, 1836567, 2072392, 1904395, 1507449, 1683978, 1327265, 2212934, 1414640, 2333700, 1122224, 838528, 2045584, 2131827, 2196721, 2589641, 2756194, 1811336, 1829004, 2697978, 1988035, 2223284, 2417778, 2661199, 1986319, 1551087, 3140906, 1524535, 1365420, 1566723, 527223, 1515574, 1764044, 1293514, 1500129, 3271348, 1949386, 1943685, 2960578, 2449420, 2089495, 2010026, 2497086, 2225495, 3604137, 2264747, 3441642, 2411079, 2009951, 1709777, 1329141, 2175913, 2664956, 3464432, 5065235, 6340548, 6166731, 5157988, 5098357, 4241416, 3605792, 2629130, 3021587, 2138937, 2517324, 2490021, 1880306, 1585152, 1949046, 2006572, 1961258, 1640430, 2241785, 2478214, 2148608, 1629501, 1956958, 1971379, 2986064, 2075305, 1419661, 2830630, 1968164, 1717002, 1720790, 1621412, 1859562, 2982194, 1835963, 1269263, 1431130, 1570474, 1300817, 1902254, 1782278, 1718638, 1576240, 1134214, 1130817, 1052171, 1452369, 1289869, 1218789, 1349780, 1707397, 1134056, 1807062, 1557199, 2027962, 1526776, 2995094, 5949699, 1956956, 2739133, 3094905, 2859790, 2486584, 1645013, 1541297, 1692757, 1680220, 1828508, 1509892, 1568621, 1690862, 1361170, 1307559, 1316719, 1999883, 1765632, 1668887, 1825830, 1326386, 1926828, 1629790, 1573635, 1974425, 2128358, 1251468, 1340664, 1225924, 1565955, 1336348, 1583325, 987635, 1213989, 1255199, 1303808, 1213386, 1981657, 3397720, 2080645];
  // mainChart: Chart;
  stockState = {
    current: '2Y',
    dates: this.dates,
    closes: this.closes,
    volumes: this.volumes
  };
  mainChart: Chart = {
    id: 'mainChart',
    data: {
      graphset: [
        this.getCloseConfig(this.stockState.dates, this.stockState.closes, '2Y'),
        this.getVolumeConfig(this.stockState.dates, this.stockState.volumes)
      ]
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
            this.reportService.getStockDataPoints({
              symbol: this.stock,
              interval: '1D',
              dataComponents: 'HLC,dema,cmf,chaikinOscillations',
              numBars: '250'
            })
          )
        })
        .subscribe(([summary, competitors, research, data, headlines, chartData]) => {
          this.summary = summary;
          this.competitors = competitors['compititors'];
          this.research = research;
          this.data = data;
          this.headlines = headlines['headlines'].filter((item, idx) => idx < 7);
          const closePrices = chartData['HLC'].map(x => +x.split(',')[2]);
          console.log('closePrices', closePrices);
          this.mainChart = {
            id: 'mainChart',
            data: {
              graphset: [
                this.getCloseConfig(chartData['dates'], closePrices, '2Y'),
                this.getVolumeConfig(chartData['dates'], chartData['cmf'])
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
          lineColor: "#fff",
          lineWidth: 1,
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
          id: '2Y',
          fontColor: (current === '2Y') ? "#FFF" : "#777",
          fontSize: "16",
          fontFamily: "Open Sans",
          cursor: "hand",
          text: "2Y"
        }
      ]
    };
  }

  getVolumeConfig(dates, values) {
    return {
      type: 'bar',
      height: 80,
      x: 0,
      y: 400,
      backgroundColor: "#333",
      plotarea: {
        margin: "20 50 20 50"
      },
      source: {
        text: "nasdaq.com",
        fontColor: "#ddd",
        fontFamily: "Open Sans"
      },
      tooltip: {
        visible: false,
        text: "Volume: %v",
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
          text: "Volume: %v",
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
          text: "Volume",
          backgroundColor: "#bbb"
        }
      ]
    };
  }


}

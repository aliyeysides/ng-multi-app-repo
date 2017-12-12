import {
  Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
  SimpleChanges, ViewChild
} from '@angular/core';
import {ReportService} from '../../../../services/report.service';
import {Subject} from 'rxjs/Subject';
import {SignalService} from '../../../../services/signal.service';
import {IdeasService} from '../../../../services/ideas.service';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'cpt-psp-stock-report',
  template: `
    <div class="component--stockview"
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
        <div class="row stock-info">
          <div class="col-12">
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
                  <div class="col-6 pgr__label">
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
                </div>
              </li>
              <li>
                <div class="row sliderBar-container">
                  <div class="col-6 pgr__label">
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
                </div>
              </li>
              <li>
                <div class="row sliderBar-container">
                  <div class="col-6 pgr__label">
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
                </div>
              </li>
              <li>
                <div class="row sliderBar-container">
                  <div class="col-6 pgr__label">
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
            <div class="divider__long  divider__long--red"></div>
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
            <p class="data">blah</p>
            <p class="label">SECTOR</p>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="divider__long divider__long--red"></div>
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
            <p>[ <span>{{ headlinePageNumber }}</span> of <span>{{ headlines?.length }}</span> ]</p>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="divider__long divider__long--red"></div>
          </div>
        </div>

        <!-- STOCK VIEW BREAKDOWN -->
        <div class="row stock-info stock-info--overall-breakdown">
          <div class="col-12">
            <h2>Rating <span>Breakdown</span></h2>
          </div>

          <div class="col-12 copy-block">
            <p class="rating"><span>{{ stock.toUpperCase() }}</span> is
              <span>{{ summary ? summary['pgrContextSummary'][0]['status'] : null }}</span></p>
            <p class="paragraph"><span>{{ symbolData ? symbolData['metaInfo'][0]['name'] : null }}:</span>
              {{ summary ? summary['pgrContextSummary'][0]['mainSentence'] : null }}</p>
            <p class="paragraph"> {{ summary ? summary['pgrContextSummary'][0]['additionalSentence'] : null }}</p>
          </div>
          <div class="col-12">
            <div class="divider__long divider__long--red"></div>
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
            <p class="paragraph"><span>{{ stock.toUpperCase() }}'s</span>
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
                    <td class="data">1.39</td>
                  </tr>
                  <tr>
                    <td class="label">LT Debt/ Equity</td>
                    <td class="data">0.68</td>
                  </tr>
                  <tr>
                    <td class="label">% Earn on Eqty</td>
                    <td class="data">35.40%</td>
                  </tr>
                  <tr>
                    <td class="label">Book Value</td>
                    <td class="data">$6.37</td>
                  </tr>
                </table>
              </div>
              <div class="col-6 col-md-3">
                <table>
                  <th colspan="2">Valuation</th>
                  <tr>
                    <td class="label">Price/Earnings</td>
                    <td class="data">18.40</td>
                  </tr>
                  <tr>
                    <td class="label">PEG</td>
                    <td class="data">1.69</td>
                  </tr>
                  <tr>
                    <td class="label">Price to Book</td>
                    <td class="data">$6.37</td>
                  </tr>
                  <tr>
                    <td class="label">Price to Sales</td>
                    <td class="data">3.88</td>
                  </tr>
                </table>
              </div>
              <div class="col-6 col-md-3">
                <table>
                  <th colspan="2">Dividends</th>
                  <tr>
                    <td class="label">Div per Share</td>
                    <td class="data">0.68</td>
                  </tr>
                  <tr>
                    <td class="label">Payout</td>
                    <td class="data">$0.29</td>
                  </tr>
                  <tr>
                    <td class="label">Yield</td>
                    <td class="data">1.65%</td>
                  </tr>
                  <tr>
                    <td class="label">Ex-Dividend Date</td>
                    <td class="data">8/9/17</td>
                  </tr>
                </table>
              </div>
              <div class="col-6 col-md-3">
                <table>
                  <th colspan="2">Returns</th>
                  <tr>
                    <td class="label">On Investment</td>
                    <td class="data">21.94%</td>
                  </tr>
                  <tr>
                    <td class="label">On Equity</td>
                    <td class="data">35.40%</td>
                  </tr>
                  <tr>
                    <td class="label">1 Month Return</td>
                    <td class="data">0.00%</td>
                  </tr>
                  <tr>
                    <td class="label">3 Month Return</td>
                    <td class="data">0.00%</td>
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
            <div class="divider__long divider__long--red"></div>
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
            <p class="paragraph"><span>{{ stock.toUpperCase() }}'s:</span>
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
            <div class="divider__long divider__long--red"></div>
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
                    <p>Chaikin Money Flow"</p>
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
                    <td class="data">289.54</td>
                  </tr>
                  <tr>
                    <td class="label">52 wk low</td>
                    <td class="data">180.36</td>
                  </tr>
                </table>
              </div>
              <div class="col-6 col-sm-3">
                <table>
                  <th colspan="2">Price % Chg</th>
                  <tr>
                    <td class="label">% chg 4 wk rel S&amp;P</td>
                    <td class="data">11.58%</td>
                  <tr>
                    <td class="label">% chg 24 wk rel S&amp;P</td>
                    <td class="data">27.45%</td>
                  </tr>
                </table>
              </div>
              <div class="col-6 col-sm-3">
                <table>
                  <th colspan="2">Volume Activity</th>
                  <tr>
                    <td class="label">Price/Earnings</td>
                    <td class="data">18.40</td>
                  </tr>
                  <tr>
                    <td class="label">PEG</td>
                    <td class="data">1.69</td>
                  </tr>
                </table>
              </div>
              <div class="col-6 col-sm-3">
                <table>
                  <th colspan="2">Volatility Rel to Mkt</th>
                  <tr>
                    <td class="label">Dividends per Share</td>
                    <td class="data">0.68</td>
                  </tr>
                  <tr>
                    <td class="label">Payout</td>
                    <td class="data">$0.29</td>
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
            <div class="divider__long divider__long--red"></div>
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
                    <div [ngClass]="appendSliderClass(symbolData ? symbolData['pgr'][4]['Experts'][1]['Estimate Trend'] : null)"></div>
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
                    <div [ngClass]="appendSliderClass(symbolData ? symbolData['pgr'][4]['Experts'][2]['Short Interest'] : null)"></div>
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
                    <div [ngClass]="appendSliderClass(symbolData ? symbolData['pgr'][4]['Experts'][3]['Insider Activity'] : null)"></div>
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
                    <div [ngClass]="appendSliderClass(symbolData ? symbolData['pgr'][4]['Experts'][4]['Analyst Rating Trend'] : null)"></div>
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
                    <div [ngClass]="appendSliderClass(symbolData ? symbolData['pgr'][4]['Experts'][5]['Industry Rel Strength'] : null)"></div>
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
            <p class="paragraph">{{ summary ? summary['expertOpnionsContextSummary'][0]['explanatorySentence'] : null  }}</p>
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
                    <td class="data text-center">0.69</td>
                    <td class="data text-center">0.69</td>
                    <td class="data text-center">0.00%</td>
                  </tr>
                  <tr>
                    <td class="label text-left">Next Quarter</td>
                    <td class="data text-center">0.68</td>
                    <td class="data text-center">0.68</td>
                    <td class="data text-center">0.00%</td>
                  </tr>
                </table>
              </div>
              <div class="col-5 col-sm-3">
                <table class="table--short-interest">
                  <th colspan="1">Short Interest</th>
                  <tr>
                    <td class="greyed-out">HIGH</td>
                  </tr>
                  <tr>
                    <td class="greyed-out">MED</td>
                  </tr>
                  <tr>
                    <td>LOW</td>
                  </tr>
                </table>
              </div>
              <div class="col-7 col-sm-3">
                <table>
                  <th colspan="2">Recommendations</th>
                  <tr>
                    <td class="label">This week</td>
                    <td class="data">BUY</td>
                  </tr>
                  <tr>
                    <td class="label">Last Week</td>
                    <td class="data">BUY</td>
                  </tr>
                  <tr>
                    <td class="label">5 Weeks Ago</td>
                    <td class="data">HOLD</td>
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
            <div class="divider__long divider__long--red"></div>
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
              <li class="row no-gutters">
                <div class="col-3 ticker">
                  <p><span><img src="./assets/imgs/arc_Bullish.svg"></span> PGR</p>
                </div>
                <div class="col-3 data">
                  <p>7.60%</p>
                </div>
                <div class="col-3 data">
                  <p>3.12%</p>
                </div>
                <div class="col-3 data">
                  <p>3.12%</p>
                </div>
              </li>
              <li class="row no-gutters">
                <div class="col-3 ticker">
                  <p><span><img src="./assets/imgs/arc_VeryBearish.svg"></span> KPMG</p>
                </div>
                <div class="col-3 data">
                  <p>7.60%</p>
                </div>
                <div class="col-3 data">
                  <p>3.12%</p>
                </div>
                <div class="col-3 data">
                  <p>3.12%</p>
                </div>
              </li>
              <li class="row no-gutters">
                <div class="col-3 ticker">
                  <p><span><img src="./assets/imgs/arc_Bearish.svg"></span> URBN</p>
                </div>
                <div class="col-3 data">
                  <p>7.60%</p>
                </div>
                <div class="col-3 data">
                  <p>3.12%</p>
                </div>
                <div class="col-3 data">
                  <p>3.12%</p>
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
              <li class="row no-gutters">
                <div class="col-3 ticker">
                  <p><span><img src="./assets/imgs/arc_VeryBearish.svg"></span> KPMG</p>
                </div>
                <div class="col-3 data">
                  <p>2.02</p>
                </div>
                <div class="col-3 data">
                  <p>20.20</p>
                </div>
                <div class="col-3 data">
                  <p class="">80.430</p>
                </div>
              </li>
              <li class="row no-gutters">
                <div class="col-3 ticker">
                  <p><span><img src="./assets/imgs/arc_VeryBearish.svg"></span> KPMG</p>
                </div>
                <div class="col-3 data">
                  <p>2.02</p>
                </div>
                <div class="col-3 data">
                  <p>20.20</p>
                </div>
                <div class="col-3 data">
                  <p class="">80.430</p>
                </div>
              </li>
              <li class="row no-gutters">
                <div class="col-3 ticker">
                  <p><span><img src="./assets/imgs/arc_VeryBearish.svg"></span> KPMG</p>
                </div>
                <div class="col-3 data">
                  <p>2.02</p>
                </div>
                <div class="col-3 data">
                  <p>20.20</p>
                </div>
                <div class="col-3 data">
                  <p>80.430</p>
                </div>
              </li>
            </ul>
          </div>
          <div class="col-12">
            <div class="divider__long divider__long--red"></div>
          </div>
        </div>

        <!-- COMPANY PROFILE -->
        <div class="row stock-info stock-info--profile">
          <div class="col-12">
            <h2>Company Profile</h2>
          </div>

          <div class="col-12 copy-block">
            <p class="paragraph"><span>AMZN's</span> earnings performance has been strong. The company has a history of
              strong earnings growth and has outperformed analysts' earnings estimates.</p>
            <p class="paragraph">The factor rank is based on the stock having high earnings growth over the past 3-5
              years, better than expected earnings in recent quarters, and consistent earnings over the past 5 years,
              but a relatively poor yearly earnings trend, and a relatively high projected P/E ratio.</p>
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
  scrollLeftHeadlines: number;
  headlinePageNumber: number = 1;

  constructor(private reportService: ReportService,
              private signalService: SignalService,
              private ideasService: IdeasService) {
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    if (this.stock) {
      Observable.timer(0, 30 * 1000)
        .switchMap(() => this.reportService.getSymbolData(this.stock))
        .takeUntil(this._ngUnsubscribe)
        .filter(x => x != undefined)
        .map(res => this.symbolData = res)
        .switchMap(() => {
          return Observable.combineLatest(
            // this.ideasService.getHeadlines(this.stock),
            this.reportService.getPgrDataAndContextSummary(this.stock, this.symbolData['metaInfo'][0]['industry_name'])
          )
        })
        .subscribe(summary => {
          // this.headlines = headlines['headlines'].filter((item, idx) => idx < 7);
          this.summary = summary[0];
          console.log('summary', this.summary);
        });
      // .subscribe(([headlines, summary]) => {
      //   this.headlines = headlines['headlines'].filter((item, idx) => idx < 7);
      //   this.summary = summary;
      //   console.log('summary', this.summary);
      // });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes) window.scrollTo(0, 0);
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

  appendSliderClass(pgr) {
    if (pgr) {
      return this.signalService.appendSliderBarClass(pgr);
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


}

import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {SymbolSearchService} from '../../services/symbol-search.service';
import {ReportService} from '../../services/report.service';
import {SignalService} from '../../services/signal.service';
import {isUndefined} from 'ngx-bootstrap/bs-moment/utils/type-checks';

@Component({
  selector: 'cpt-pgr-widget-app',
  template: `
    <h1>{{ currentStock.getValue() }}</h1>
    <accordion>
      <accordion-group>
        <div accordion-heading class="clearfix">
          Financials
          {{ symbolData ? symbolData['pgr'][1]['Financials'][0]['Value'] : null }}
          <!--<div class="col-5 col-md-6 col-lg-5 col-xl-6 sliderProgress">-->
            <!--<div-->
              <!--[ngClass]="appendSliderClass(symbolData ? symbolData['pgr'][1]['Financials'][0]['Value'] : null)"></div>-->
            <!--<div class="sliderBar"-->
                 <!--[ngClass]="appendSliderBarClass(symbolData ? symbolData['pgr'][1]['Financials'][0]['Value'] : null)"-->
                 <!--role="progressbar" aria-valuemin="0" aria-valuemax="100">-->
            <!--</div>-->
          <!--</div>-->
        </div>
        <div class="col-12 col-lg-6 col-xl-5 stockview__PGR ">
          <ul class="pgr__sliders">
            <li>
              <div class="row justify-content-center justify-content-xl-start sliderBar-container">
                <div class="col-6 col-sm-4 col-md-4 col-lg-5 col-xl-5 pgr__label">
                  <p>LT Debt to Equity</p>
                </div>
                {{ symbolData ? symbolData['pgr'][1]['Financials'][1]['LT Debt to Equity'] : null }}
                <!--<div class="col-5 col-sm-6 col-md-5 col-lg-5 col-xl-6 sliderProgress">-->
                  <!--<div-->
                    <!--[ngClass]="appendSliderClass(symbolData ? symbolData['pgr'][1]['Financials'][1]['LT Debt to Equity'] : null)"></div>-->
                  <!--<div class="sliderBar"-->
                       <!--[ngClass]="appendSliderBarClass(symbolData ? symbolData['pgr'][1]['Financials'][1]['LT Debt to Equity'] : null)"-->
                       <!--role="progressbar" aria-valuemin="0" aria-valuemax="100">-->
                  <!--</div>-->
                <!--</div>-->
              </div>
            </li>
            <li>
              <div class="row justify-content-center justify-content-xl-start sliderBar-container">
                <div class="col-6 col-sm-4 col-lg-5 col-xl-5 pgr__label">
                  <p>Price to Book</p>
                </div>
                {{ symbolData ? symbolData['pgr'][1]['Financials'][2]['Price to Book'] : null }}
                <!--<div class="col-5 col-sm-6 col-md-5 col-lg-5 col-xl-6 sliderProgress">-->
                  <!--<div-->
                    <!--[ngClass]="appendSliderClass(symbolData ? symbolData['pgr'][1]['Financials'][2]['Price to Book'] : null)"></div>-->
                  <!--<div class="sliderBar"-->
                       <!--[ngClass]="appendSliderBarClass(symbolData ? symbolData['pgr'][1]['Financials'][2]['Price to Book'] : null)"-->
                       <!--role="progressbar" aria-valuemin="0" aria-valuemax="100">-->
                  <!--</div>-->
                <!--</div>-->
              </div>
            </li>
            <li>
              <div class="row justify-content-center justify-content-xl-start sliderBar-container">
                <div class="col-6 col-sm-4 col-lg-5 col-xl-5 pgr__label">
                  <p>Return on Equity</p>
                </div>
                {{ symbolData ? symbolData['pgr'][1]['Financials'][3]['Return on Equity'] : null }}
                <!--<div class="col-5 col-sm-6 col-md-5 col-lg-5 col-xl-6 sliderProgress">-->
                  <!--<div-->
                    <!--[ngClass]="appendSliderClass(symbolData ? symbolData['pgr'][1]['Financials'][3]['Return on Equity'] : null)"></div>-->
                  <!--<div class="sliderBar"-->
                       <!--[ngClass]="appendSliderBarClass(symbolData ? symbolData['pgr'][1]['Financials'][3]['Return on Equity'] : null)"-->
                       <!--role="progressbar" aria-valuemin="0" aria-valuemax="100">-->
                  <!--</div>-->
                <!--</div>-->
              </div>
            </li>
            <li>
              <div class="row justify-content-center justify-content-xl-start sliderBar-container">
                <div class="col-6 col-sm-4 col-lg-5 col-xl-5 pgr__label">
                  <p>Price to Sales</p>
                </div>
                {{ symbolData ? symbolData['pgr'][1]['Financials'][4]['Price to Sales'] : null }}
                <!--<div class="col-5 col-sm-6 col-md-5 col-lg-5 col-xl-6 sliderProgress">-->
                  <!--<div-->
                    <!--[ngClass]="appendSliderClass(symbolData ? symbolData['pgr'][1]['Financials'][4]['Price to Sales'] : null)"></div>-->
                  <!--<div class="sliderBar"-->
                       <!--[ngClass]="appendSliderBarClass(symbolData ? symbolData['pgr'][1]['Financials'][4]['Price to Sales'] : null)"-->
                       <!--role="progressbar" aria-valuemin="0" aria-valuemax="100">-->
                  <!--</div>-->
                <!--</div>-->
              </div>
            </li>
            <li>
              <div class="row justify-content-center justify-content-xl-start sliderBar-container">
                <div class="col-6 col-sm-4 col-lg-5 col-xl-5 pgr__label">
                  <p>Free Cash Flow</p>
                </div>
                {{ symbolData ? symbolData['pgr'][1]['Financials'][5]['Free Cash Flow'] : null }}
                <!--<div class="col-5 col-sm-6 col-md-5 col-lg-5 col-xl-6 sliderProgress">-->
                  <!--<div-->
                    <!--[ngClass]="appendSliderClass(symbolData ? symbolData['pgr'][1]['Financials'][5]['Free Cash Flow'] : null)"></div>-->
                  <!--<div class="sliderBar"-->
                       <!--[ngClass]="appendSliderBarClass(symbolData ? symbolData['pgr'][1]['Financials'][5]['Free Cash Flow'] : null)"-->
                       <!--role="progressbar" aria-valuemin="0" aria-valuemax="100">-->
                  <!--</div>-->
                <!--</div>-->
              </div>
            </li>
          </ul>
        </div>
      </accordion-group>
      <accordion-group #group>
        <div accordion-heading class="clearfix">
          Earnings
          {{ symbolData ? symbolData['pgr'][2]['Earnings'][0]['Value'] : null }}
          <!--<div class="col-5 col-md-6 col-lg-5 col-xl-6 sliderProgress">-->
            <!--<div-->
              <!--[ngClass]="appendSliderClass(symbolData ? symbolData['pgr'][2]['Earnings'][0]['Value'] : null)"></div>-->
            <!--<div class="sliderBar"-->
                 <!--[ngClass]="appendSliderBarClass(symbolData ? symbolData['pgr'][2]['Earnings'][0]['Value'] : null)"-->
                 <!--role="progressbar" aria-valuemin="0" aria-valuemax="100">-->
            <!--</div>-->
          <!--</div>-->
        </div>
        <div class="col-12 col-lg-6 col-xl-5 stockview__PGR">
          <ul class="pgr__sliders">
            <li>
              <div class="row justify-content-center justify-content-xl-start sliderBar-container">
                <div class="col-6 col-sm-4 col-lg-5 col-xl-5 pgr__label">
                  <p>Earnings Growth</p>
                </div>
                {{ symbolData ? symbolData['pgr'][2]['Earnings'][1]['Earnings Growth'] : null }}
                <!--<div class="col-5 col-sm-6 col-md-5 col-lg-5 col-xl-6  sliderProgress">-->
                  <!--<div-->
                    <!--[ngClass]="appendSliderClass(symbolData ? symbolData['pgr'][2]['Earnings'][1]['Earnings Growth'] : null)"></div>-->
                  <!--<div class="sliderBar"-->
                       <!--[ngClass]="appendSliderBarClass(symbolData ? symbolData['pgr'][2]['Earnings'][1]['Earnings Growth'] : null)"-->
                       <!--role="progressbar" aria-valuemin="0" aria-valuemax="100">-->
                  <!--</div>-->
                <!--</div>-->
              </div>
            </li>
            <li>
              <div class="row justify-content-center justify-content-xl-start sliderBar-container">
                <div class="col-6 col-sm-4 col-lg-5 col-xl-5  pgr__label">
                  <p>Earnings Surprise</p>
                </div>
                {{ symbolData ? symbolData['pgr'][2]['Earnings'][2]['Earnings Surprise'] : null }}
                <!--<div class="col-5 col-sm-6 col-md-5 col-lg-5 col-xl-6 sliderProgress">-->
                  <!--<div-->
                    <!--[ngClass]="appendSliderClass(symbolData ? symbolData['pgr'][2]['Earnings'][2]['Earnings Surprise'] : null)"></div>-->
                  <!--<div class="sliderBar"-->
                       <!--[ngClass]="appendSliderBarClass(symbolData ? symbolData['pgr'][2]['Earnings'][2]['Earnings Surprise'] : null)"-->
                       <!--role="progressbar" aria-valuemin="0" aria-valuemax="100">-->
                  <!--</div>-->
                <!--</div>-->
              </div>
            </li>
            <li>
              <div class="row justify-content-center justify-content-xl-start sliderBar-container">
                <div class="col-6 col-sm-4 col-lg-5 col-xl-5 pgr__label">
                  <p>Earnings Trend</p>
                </div>
                {{ symbolData ? symbolData['pgr'][2]['Earnings'][3]['Earnings Trend'] : null }}
                <!--<div class="col-5 col-sm-6 col-md-5 col-lg-5 col-xl-6 sliderProgress">-->
                  <!--<div-->
                    <!--[ngClass]="appendSliderClass(symbolData ? symbolData['pgr'][2]['Earnings'][3]['Earnings Trend'] : null)"></div>-->
                  <!--<div class="sliderBar"-->
                       <!--[ngClass]="appendSliderBarClass(symbolData ? symbolData['pgr'][2]['Earnings'][3]['Earnings Trend'] : null)"-->
                       <!--role="progressbar" aria-valuemin="0" aria-valuemax="100">-->
                  <!--</div>-->
                <!--</div>-->
              </div>
            </li>
            <li>
              <div class="row justify-content-center justify-content-xl-start sliderBar-container">
                <div class="col-6 col-sm-4 col-lg-5 col-xl-5 pgr__label">
                  <p>Projected P/E</p>
                </div>
                {{ symbolData ? symbolData['pgr'][2]['Earnings'][4]['Projected P/E'] : null }}
                <!--<div class="col-5 col-sm-6 col-md-5 col-lg-5 col-xl-6 sliderProgress">-->
                  <!--<div-->
                    <!--[ngClass]="appendSliderClass(symbolData ? symbolData['pgr'][2]['Earnings'][4]['Projected P/E'] : null)"></div>-->
                  <!--<div class="sliderBar"-->
                       <!--[ngClass]="appendSliderBarClass(symbolData ? symbolData['pgr'][2]['Earnings'][4]['Projected P/E'] : null)"-->
                       <!--role="progressbar" aria-valuemin="0" aria-valuemax="100">-->
                  <!--</div>-->
                <!--</div>-->
              </div>
            </li>
            <li>
              <div class="row justify-content-center justify-content-xl-start sliderBar-container">
                <div class="col-6 col-sm-4 col-lg-5 col-xl-5 pgr__label">
                  <p>Earnings Consistency</p>
                </div>
                {{ symbolData ? symbolData['pgr'][2]['Earnings'][5]['Earnings Consistency'] : null }}
                <!--<div class="col-5 col-sm-6 col-md-5 col-lg-5 col-xl-6 sliderProgress">-->
                  <!--<div-->
                    <!--[ngClass]="appendSliderClass(symbolData ? symbolData['pgr'][2]['Earnings'][5]['Earnings Consistency'] : null)"></div>-->
                  <!--<div class="sliderBar"-->
                       <!--[ngClass]="appendSliderBarClass(symbolData ? symbolData['pgr'][2]['Earnings'][5]['Earnings Consistency'] : null)"-->
                       <!--role="progressbar" aria-valuemin="0" aria-valuemax="100">-->
                  <!--</div>-->
                <!--</div>-->
              </div>
            </li>
          </ul>
        </div>
      </accordion-group>
      <accordion-group>
        <div accordion-heading class="clearfix">
          Technicals
          {{ symbolData ? symbolData['pgr'][3]['Technicals'][0]['Value'] : null }}
          <!--<div class="col-5 col-md-6 col-lg-5 col-xl-6 sliderProgress">-->
            <!--<div-->
              <!--[ngClass]="appendSliderClass(symbolData ? symbolData['pgr'][3]['Technicals'][0]['Value'] : null)"></div>-->
            <!--<div class="sliderBar"-->
                 <!--[ngClass]="appendSliderBarClass(symbolData ? symbolData['pgr'][3]['Technicals'][0]['Value'] : null)"-->
                 <!--role="progressbar" aria-valuemin="0" aria-valuemax="100">-->
            <!--</div>-->
          <!--</div>-->
        </div>
        <div class="col-12 col-lg-6 col-xl-5 stockview__PGR">
          <ul class="pgr__sliders">
            <li>
              <div class="row justify-content-center justify-content-xl-start sliderBar-container">
                <div class="col-6 col-sm-4 col-lg-5 col-xl-5 pgr__label">
                  <p>Rel Strength vs Mrkt</p>
                </div>
                {{ symbolData ? symbolData['pgr'][3]['Technicals'][1]['Rel Strength vs Market'] : null }}
                <!--<div class="col-5 col-sm-6 col-md-5 col-lg-5 col-xl-6 sliderProgress">-->
                  <!--<div-->
                    <!--[ngClass]="appendSliderClass(symbolData ? symbolData['pgr'][3]['Technicals'][1]['Rel Strength vs Market'] : null)"></div>-->
                  <!--<div class="sliderBar"-->
                       <!--[ngClass]="appendSliderBarClass(symbolData ? symbolData['pgr'][3]['Technicals'][1]['Rel Strength vs Market'] : null)"-->
                       <!--role="progressbar" aria-valuemin="0" aria-valuemax="100">-->
                  <!--</div>-->
                <!--</div>-->
              </div>
            </li>
            <li>
              <div class="row justify-content-center justify-content-xl-start sliderBar-container">
                <div class="col-6 col-sm-4 col-lg-5 col-xl-5 pgr__label">
                  <p>Chaikin Money Flow</p>
                </div>
                {{ symbolData ? symbolData['pgr'][3]['Technicals'][2]['Chaikin Money Flow'] : null }}
                <!--<div class="col-5 col-sm-6 col-md-5 col-lg-5 col-xl-6 sliderProgress">-->
                  <!--<div-->
                    <!--[ngClass]="appendSliderClass(symbolData ? symbolData['pgr'][3]['Technicals'][2]['Chaikin Money Flow'] : null)"></div>-->
                  <!--<div class="sliderBar"-->
                       <!--[ngClass]="appendSliderBarClass(symbolData ? symbolData['pgr'][3]['Technicals'][2]['Chaikin Money Flow'] : null)"-->
                       <!--role="progressbar" aria-valuemin="0" aria-valuemax="100">-->
                  <!--</div>-->
                <!--</div>-->
              </div>
            </li>
            <li>
              <div class="row justify-content-center justify-content-xl-start sliderBar-container">
                <div class="col-6 col-sm-4 col-lg-5 col-xl-5 pgr__label">
                  <p>Price Strength</p>
                </div>
                {{ symbolData ? symbolData['pgr'][3]['Technicals'][3]['Price Strength'] : null }}
                <!--<div class="col-5 col-sm-6 col-md-5 col-lg-5 col-xl-6 sliderProgress">-->
                  <!--<div-->
                    <!--[ngClass]="appendSliderClass(symbolData ? symbolData['pgr'][3]['Technicals'][3]['Price Strength'] : null)"></div>-->
                  <!--<div class="sliderBar"-->
                       <!--[ngClass]="appendSliderBarClass(symbolData ? symbolData['pgr'][3]['Technicals'][3]['Price Strength'] : null)"-->
                       <!--role="progressbar" aria-valuemin="0" aria-valuemax="100">-->
                  <!--</div>-->
                <!--</div>-->
              </div>
            </li>
            <li>
              <div class="row justify-content-center justify-content-xl-start sliderBar-container">
                <div class="col-6 col-sm-4 col-lg-5 col-xl-5 pgr__label">
                  <p>Price Trend ROC</p>
                </div>
                {{ symbolData ? symbolData['pgr'][3]['Technicals'][4]['Price Trend ROC'] : null }}
                <!--<div class="col-5 col-sm-6 col-md-5 col-lg-5 col-xl-6 sliderProgress">-->
                  <!--<div-->
                    <!--[ngClass]="appendSliderClass(symbolData ? symbolData['pgr'][3]['Technicals'][4]['Price Trend ROC'] : null)"></div>-->
                  <!--<div class="sliderBar"-->
                       <!--[ngClass]="appendSliderBarClass(symbolData ? symbolData['pgr'][3]['Technicals'][4]['Price Trend ROC'] : null)"-->
                       <!--role="progressbar" aria-valuemin="0" aria-valuemax="100">-->
                  <!--</div>-->
                <!--</div>-->
              </div>
            </li>
            <li>
              <div class="row justify-content-center justify-content-xl-start sliderBar-container">
                <div class="col-6 col-sm-4 col-lg-5 col-xl-5 pgr__label">
                  <p>Volume Trend</p>
                </div>
                {{ symbolData ? symbolData['pgr'][3]['Technicals'][5]['Volume Trend'] : null }}
                <!--<div class="col-5 col-sm-6 col-md-5 col-lg-5 col-xl-6 sliderProgress">-->
                  <!--<div-->
                    <!--[ngClass]="appendSliderClass(symbolData ? symbolData['pgr'][3]['Technicals'][5]['Volume Trend'] : null)"></div>-->
                  <!--<div class="sliderBar"-->
                       <!--[ngClass]="appendSliderBarClass(symbolData ? symbolData['pgr'][3]['Technicals'][5]['Volume Trend'] : null)"-->
                       <!--role="progressbar" aria-valuemin="0" aria-valuemax="100">-->
                  <!--</div>-->
                <!--</div>-->
              </div>
            </li>
          </ul>
        </div>
      </accordion-group>
      <accordion-group>
        <div accordion-heading class="clearfix">
          Experts
          {{ symbolData ? symbolData['pgr'][4]['Experts'][0]['Value'] : null }}
          <!--<div class="col-5 col-md-6 col-lg-5 col-xl-6 sliderProgress">-->
            <!--<div-->
              <!--[ngClass]="appendSliderClass(symbolData ? symbolData['pgr'][4]['Experts'][0]['Value'] : null)"></div>-->
            <!--<div class="sliderBar"-->
                 <!--[ngClass]="appendSliderBarClass(symbolData ? symbolData['pgr'][4]['Experts'][0]['Value'] : null)"-->
                 <!--role="progressbar" aria-valuemin="0" aria-valuemax="100">-->
            <!--</div>-->
          <!--</div>-->
        </div>
        <div class="col-12 col-lg-6 col-xl-5 stockview__PGR">
          <ul class="pgr__sliders">
            <li>
              <div class="row justify-content-center justify-content-xl-start sliderBar-container">
                <div class="col-6 col-sm-4 col-lg-5 col-xl-5 pgr__label">
                  <p>Estimate Trend</p>
                </div>
                {{ symbolData ? symbolData['pgr'][4]['Experts'][1]['Estimate Trend'] : null }}
                <!--<div class="col-5 col-sm-6 col-md-5 col-lg-5 col-xl-6 sliderProgress">-->
                  <!--<div-->
                    <!--[ngClass]="appendSliderClass(symbolData ? symbolData['pgr'][4]['Experts'][1]['Estimate Trend'] : null)"></div>-->
                  <!--<div class="sliderBar"-->
                       <!--[ngClass]="appendSliderBarClass(symbolData ? symbolData['pgr'][4]['Experts'][1]['Estimate Trend'] : null)"-->
                       <!--role="progressbar" aria-valuemin="0" aria-valuemax="100">-->
                  <!--</div>-->
                <!--</div>-->
              </div>
            </li>
            <li>
              <div class="row justify-content-center justify-content-xl-start sliderBar-container">
                <div class="col-6 col-sm-4 col-lg-5 col-xl-5 pgr__label">
                  <p>Short Interest</p>
                </div>
                {{ symbolData ? symbolData['pgr'][4]['Experts'][2]['Short Interest'] : null }}
                <!--<div class="col-5 col-sm-6 col-md-5 col-lg-5 col-xl-6 sliderProgress">-->
                  <!--<div-->
                    <!--[ngClass]="appendSliderClass(symbolData ? symbolData['pgr'][4]['Experts'][2]['Short Interest'] : null)"></div>-->
                  <!--<div class="sliderBar"-->
                       <!--[ngClass]="appendSliderBarClass(symbolData ? symbolData['pgr'][4]['Experts'][2]['Short Interest'] : null)"-->
                       <!--role="progressbar" aria-valuemin="0" aria-valuemax="100">-->
                  <!--</div>-->
                <!--</div>-->
              </div>
            </li>
            <li>
              <div class="row justify-content-center justify-content-xl-start sliderBar-container">
                <div class="col-6 col-sm-4 col-lg-5 col-xl-5 pgr__label">
                  <p>Insider Activity</p>
                </div>
                {{ symbolData ? symbolData['pgr'][4]['Experts'][3]['Insider Activity'] : null }}
                <!--<div class="col-5 col-sm-6 col-md-5 col-lg-5 col-xl-6 sliderProgress">-->
                  <!--<div-->
                    <!--[ngClass]="appendSliderClass(symbolData ? symbolData['pgr'][4]['Experts'][3]['Insider Activity'] : null)"></div>-->
                  <!--<div class="sliderBar"-->
                       <!--[ngClass]="appendSliderBarClass(symbolData ? symbolData['pgr'][4]['Experts'][3]['Insider Activity'] : null)"-->
                       <!--role="progressbar" aria-valuemin="0" aria-valuemax="100">-->
                  <!--</div>-->
                <!--</div>-->
              </div>
            </li>
            <li>
              <div class="row justify-content-center justify-content-xl-start sliderBar-container">
                <div class="col-6 col-sm-4 col-lg-5 col-xl-5 pgr__label">
                  <p>Analyst Rating Trend</p>
                </div>
                {{ symbolData ? symbolData['pgr'][4]['Experts'][4]['Analyst Rating Trend'] : null }}
                <!--<div class="col-5 col-sm-6 col-md-5 col-lg-5 col-xl-6 sliderProgress">-->
                  <!--<div-->
                    <!--[ngClass]="appendSliderClass(symbolData ? symbolData['pgr'][4]['Experts'][4]['Analyst Rating Trend'] : null)"></div>-->
                  <!--<div class="sliderBar"-->
                       <!--[ngClass]="appendSliderBarClass(symbolData ? symbolData['pgr'][4]['Experts'][4]['Analyst Rating Trend'] : null)"-->
                       <!--role="progressbar" aria-valuemin="0" aria-valuemax="100">-->
                  <!--</div>-->
                <!--</div>-->
              </div>
            </li>
            <li>
              <div class="row justify-content-center justify-content-xl-start sliderBar-container">
                <div class="col-6 col-sm-4 col-lg-5 col-xl-5 pgr__label">
                  <p>Industry Rel Strength</p>
                </div>
                {{ symbolData ? symbolData['pgr'][4]['Experts'][5]['Industry Rel Strength'] : null }}
                <!--<div class="col-5 col-sm-6 col-md-5 col-lg-5 col-xl-6 sliderProgress">-->
                  <!--<div-->
                    <!--[ngClass]="appendSliderClass(symbolData ? symbolData['pgr'][4]['Experts'][5]['Industry Rel Strength'] : null)"></div>-->
                  <!--<div class="sliderBar"-->
                       <!--[ngClass]="appendSliderBarClass(symbolData ? symbolData['pgr'][4]['Experts'][5]['Industry Rel Strength'] : null)"-->
                       <!--role="progressbar" aria-valuemin="0" aria-valuemax="100">-->
                  <!--</div>-->
                <!--</div>-->
              </div>
            </li>
          </ul>
        </div>
      </accordion-group>
    </accordion>
  `,
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  currentStock: BehaviorSubject<string> = new BehaviorSubject<string>('AAPL');
  is_etf: boolean;
  symbolData;
  research;

  constructor(private symbolSearchService: SymbolSearchService,
              private reportService: ReportService,
              private signalService: SignalService,
              private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.currentStock.subscribe(stock => {
      this.symbolSearchService.symbolLookup(stock)
        .take(1)
        .subscribe(val => {
          val[0] ? this.is_etf = val[0]['is_etf'] : this.is_etf = true;
          if (!this.is_etf) {
            this.getReportData(stock);
          }
          this.cd.detectChanges();
        });
    })
  }

  getReportData(stock: string) {
    this.reportService.getSymbolData(stock)
      .take(1)
      .filter(Boolean)
      .subscribe(data => {
        this.symbolData = data;
        console.log('symbolData', this.symbolData);
        this.cd.markForCheck();
      })

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

}

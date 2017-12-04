import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {HealthCheckService} from '../../../services/health-check.service';
import {AuthService} from '../../../services/auth.service';

import * as moment from 'moment';
import {
  EarningsAnalystRevisions,
  EarningsReportSurprises, PGRChanges, PHCGridData, PortfolioStatus, PrognosisData,
  StockStatus
} from '../../../shared/models/health-check';
import {Observable} from 'rxjs/Observable';
import {MarketsSummaryService} from '../../../services/markets-summary.service';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'cpt-health-check',
  template: `
    <!-- PANEL CONTENTS -->
    <div class="container-fluid component component--healthcheck">
      <div class="row contents">

        <!-- HEALTH-CHECK - Intro -->
        <cpt-psp-portfolio-overview [calc]="calculations" [data]="prognosisData"></cpt-psp-portfolio-overview>
        <!-- HEALTH-CHECK - Stock Movements -->
        <cpt-psp-stock-movements [calc]="calculations" [weeklyStocks]="stocksStatus"
                                 [dailyStocks]="dailySymbolList"></cpt-psp-stock-movements>

        <!-- HEALTH-CHECK - Ratings Changes -->
        <cpt-psp-rating-changes [alerts]="pgrChanges"></cpt-psp-rating-changes>

        <!-- HEALTH-CHECK - Earnings Reports -->
        <cpt-psp-earnings-report [surprises]="earningsSurprise"
                                 [revisions]="analystRevisions"
                                 [expected]="expectedEarnings"></cpt-psp-earnings-report>

        <!-- HEALTH-CHECK - Power Grid -->
        <cpt-psp-power-grid [data]="pgrGridData"></cpt-psp-power-grid>

        <!-- HEALTH-CHECK - DISCLAIMER -->
        <div class="col-12 col-lg-8 col-xl-8 float-lg-right">
          <div class="row">
            <div class="col-12">
              <div class="divider__long"
                   [ngClass]="{'divider__long--green': calculations?.avgPercentageChange>0, 'divider__long--red': calculations?.avgPercentageChange<0}"></div>
            </div>
          </div>

          <div class="row">
            <div class="col-12">
              <h4>Disclaimer</h4>
              <p class="disclaimer">Etiam vel nisi laoreet, semper felis sit amet, egestas libero. Ut quis pretium
                tortor, eget semper lacus. Sed at leo lectus. Donec imperdiet erat eu enim vestibulum, ut interdum odio
                laoreet. Nam vel tellus vel ligula posuere iaculis. Sed porta imperdiet leo sed posuere. Aenean maximus
                lacus tortor, nec interdum diam posuere non.</p>
            </div>
          </div>
        </div>

      </div>
    </div>`,
  styleUrls: ['./health-check.component.scss']
})
export class HealthCheckComponent implements OnInit {
  private _uid: string;
  private _listId: string;
  private _ngUnsubscribe: Subject<void> = new Subject<void>();

  public calculations: PortfolioStatus;
  public stocksStatus: Array<StockStatus>;
  public prognosisData: PrognosisData;
  public pgrChanges: PGRChanges;
  public earningsSurprise: EarningsReportSurprises;
  public analystRevisions: EarningsAnalystRevisions;
  public expectedEarnings;
  public pgrGridData: PHCGridData;
  public dailySymbolList;

  constructor(private authService: AuthService,
              private healthCheck: HealthCheckService,
              private marketsSummary: MarketsSummaryService,
              private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.authService.currentUser$
      .map(usr => this._uid = usr['UID'])
      .flatMap(uid => this.healthCheck.getAuthorizedLists(uid))
      .take(1)
      .map(res => this._listId = res[0]['User Lists'][0]['list_id'])
      .switchMap(listId => {
        const startDate = moment().subtract(1, 'weeks').day(-2).format('YYYY-MM-DD'),
          endDate = moment(startDate).add(7, 'days').format('YYYY-MM-DD');
        return Observable.combineLatest(
          this.healthCheck.getChaikinCalculations(listId, startDate, endDate),
          this.healthCheck.getPrognosisData(listId),
          this.healthCheck.getUserPortfolioStockStatus(listId, startDate, endDate),
          this.healthCheck.getPGRWeeklyChangeDAta(listId, moment().subtract(1, 'weeks').day(-1).format('YYYY-MM-DD'), moment().day(-1).format('YYYY-MM-DD')),
          this.healthCheck.getEarningsSurprise(listId, startDate, endDate),
          this.healthCheck.getAnalystRevisions(listId, moment().day(-2).format('YYYY-MM-DD')),
          this.healthCheck.getExpectedEarningsReportsWithPGRValues(this._uid, listId, moment().isoWeekday(1).format('YYYY-MM-DD'), moment().endOf('week').format('YYYY-MM-DD')),
          this.healthCheck.getPHCGridData(listId),
        )
      })
      .take(1)
      .map(res => {
        this.calculations = res[0][Object.keys(res[0])[0]];
        this.healthCheck.setPortfolioStatus(this.calculations);
        this.prognosisData = res[1];

        this.stocksStatus = res[2][Object.keys(res[2])[0]];
        this.stocksStatus.push(Object.assign({}, { // Push Weekly SPY into collection.
          "symbol": 'S&P 500',
          "corrected_pgr_rating": 0,
          "percentageChange": this.calculations.SPYPercentageChange,
          "companyName": 'S&P500',
          "raw_pgr_rating": 0,
          "closePrice": 0,
          "arcColor": 2
        }));

        this.pgrChanges = res[3];
        this.earningsSurprise = res[4];
        this.analystRevisions = res[5];
        this.expectedEarnings = res[6];
        this.pgrGridData = res[7];
      })
      .flatMap(() => {
        return Observable.timer(0, 5 * 1000).combineLatest(
          this.healthCheck.getListSymbols(this._listId, this._uid),
          this.marketsSummary.initialMarketSectorData({components: 'majorMarketIndices,sectors'})
        )
      })
      .subscribe(res => {
        this.dailySymbolList = [];
        this.dailySymbolList = res[1]['symbols'].filter(x => x['symbol'] != 'S&P 500');
        const indicies = res[2]['market_indices'];
        this.dailySymbolList.push(Object.assign({}, { // Push Daily SPY into collection.
            "symbol": 'S&P 500',
            "corrected_pgr_rating": 0,
            "percentageChange": indicies[0]['percent_change'],
            "companyName": 'S&P500',
            "raw_pgr_rating": 0,
            "closePrice": 0,
            "arcColor": 2
          }));
        this.dailySymbolList = this.dailySymbolList.slice(0); // hack to bypass dirty checking for non-primitives
      });
  }

}

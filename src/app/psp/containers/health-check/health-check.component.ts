import {Component, OnDestroy, OnInit} from '@angular/core';
import {HealthCheckService} from '../../../services/health-check.service';
import {AuthService} from '../../../services/auth.service';

import * as moment from 'moment';
import {
  EarningsAnalystRevisions,
  EarningsReportSurprises, ExpectedEarningsReports, ListSymbolObj, PGRChanges, PHCGridData, PortfolioStatus,
  PrognosisData,
  StockStatus
} from '../../../shared/models/health-check';
import {Observable} from 'rxjs/Observable';
import {MarketsSummaryService} from '../../../services/markets-summary.service';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';
import {ReportService} from '../../../services/report.service';

@Component({
  selector: 'cpt-health-check',
  template: `
    <!-- PANEL CONTENTS -->
    <div [ngBusy]="loading" class="container-fluid component component--healthcheck">
      <div class="row contents">
        <button (click)="getPHCReportforListId()">pdf</button>
        <!-- HEALTH-CHECK - Intro -->
        <cpt-psp-portfolio-overview (listChanged)="listChanged()" [lists]="allUserLists" [calc]="calculations" [data]="prognosisData"></cpt-psp-portfolio-overview>
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
        <div class="col-12 col-lg-8 col-xl-8 float-lg-right" id="HC--Disclaimer">
          <div class="row">
            <div class="col-12">
              <div class="divider__long"
                   [ngClass]="{'divider__long--green': calculations?.avgPercentageChange>0, 'divider__long--red': calculations?.avgPercentageChange<0}"></div>
            </div>
          </div>

          <div class="row">
            <div class="col-12">
              <h4>Disclaimer:</h4>
              <p class="disclaimer">Chaikin Analytics (CA) is not registered as a securities Broker/Dealer
                or Investment Advisor with either the U.S. Securities and Exchange Commission or with any state securities regulatory authority. The information presented in our reports does not represent a recommendation to buy or sell stocks or any financial instrument nor is it intended as an endorsement of any security or investment. The information in this report does not take into account an individual's pecific financial situation. The user bears complete responsibility for their own investment research and should consult with their financial advisor before making buy/sell decisions. For more information, see <a target="_blank" href="http://www.chaikinanalytics.com/disclaimer/">disclaimer.</a></p>
            </div>
          </div>
        </div>

      </div>
    </div>`,
  styleUrls: ['./health-check.component.scss']
})
export class HealthCheckComponent implements OnInit, OnDestroy {
  private _uid: string;
  private _listId: string;
  private _ngUnsubscribe: Subject<void> = new Subject<void>();

  public calculations: PortfolioStatus;
  public stocksStatus: Array<StockStatus>;
  public prognosisData: PrognosisData;
  public pgrChanges: PGRChanges;
  public earningsSurprise: EarningsReportSurprises;
  public analystRevisions: EarningsAnalystRevisions;
  public expectedEarnings: ExpectedEarningsReports;
  public pgrGridData: PHCGridData;
  public dailySymbolList: Array<StockStatus | ListSymbolObj>;
  public loading: Subscription;

  public allUserLists: object[];
  public currentList: string;

  constructor(private authService: AuthService,
              private healthCheck: HealthCheckService,
              private reportService: ReportService,
              private marketsSummary: MarketsSummaryService) {
  }

  ngOnInit() {
    this.loading = this.initData();

    this.healthCheck.getMyStocksSubject()
      .takeUntil(this._ngUnsubscribe)
      .subscribe(res => {
        this.updateData();
      })
  }

  ngOnDestroy() {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

  initData() {
    return this.authService.currentUser$
      .map(usr => this._uid = usr['UID'])
      .do(() => this.currentList = this.healthCheck.currentList)
      .flatMap(uid => this.healthCheck.getAuthorizedLists(uid))
      .take(1)
      .map(res => {
        this.allUserLists = res[0]['User Lists'];
        const myStocksUserList = this.allUserLists.filter(x => x['name'] === 'My Stocks')[0];
        if (this.currentList == 'My Stocks') {
          return this._listId = myStocksUserList['list_id'];
        }
        return this._listId = this.allUserLists.filter(x => x['name'] == this.currentList)[0]['list_id'];
      })
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
      .map(([calc, data, status, pgr, sups, revs, reports, grid]) => {
        this.calculations = calc[Object.keys(calc)[0]];
        this.healthCheck.setPortfolioStatus(this.calculations);
        this.prognosisData = data;

        this.stocksStatus = status[Object.keys(status)[0]];
        this.stocksStatus.push(Object.assign({}, { // Push Weekly SPY into collection.
          "symbol": 'S&P 500',
          "corrected_pgr_rating": 0,
          "percentageChange": this.calculations.SPYPercentageChange,
          "companyName": 'S&P500',
          "raw_pgr_rating": 0,
          "closePrice": 0,
          "arcColor": 2
        }));

        this.pgrChanges = pgr;
        this.earningsSurprise = sups;
        this.analystRevisions = revs;
        this.expectedEarnings = reports;
        this.pgrGridData = grid;
      })
      .subscribe(() => {
        this.loadDailyData();
      });
  }

  listChanged() {
    this.loading = this.initData();
  }

  updateData() {
    const startDate = moment().subtract(1, 'weeks').day(-2).format('YYYY-MM-DD'),
      endDate = moment(startDate).add(7, 'days').format('YYYY-MM-DD');
    return Observable.combineLatest(
      this.healthCheck.getChaikinCalculations(this._listId, startDate, endDate),
      this.healthCheck.getPrognosisData(this._listId),
      this.healthCheck.getUserPortfolioStockStatus(this._listId, startDate, endDate),
      this.healthCheck.getPGRWeeklyChangeDAta(this._listId, moment().subtract(1, 'weeks').day(-1).format('YYYY-MM-DD'), moment().day(-1).format('YYYY-MM-DD')),
      this.healthCheck.getEarningsSurprise(this._listId, startDate, endDate),
      this.healthCheck.getAnalystRevisions(this._listId, moment().day(-2).format('YYYY-MM-DD')),
      this.healthCheck.getExpectedEarningsReportsWithPGRValues(this._uid, this._listId, moment().isoWeekday(1).format('YYYY-MM-DD'), moment().endOf('week').format('YYYY-MM-DD')),
      this.healthCheck.getPHCGridData(this._listId),
    )
      .take(1)
      .map(([calc, data, status, pgr, sups, revs, reports, grid]) => {
        this.calculations = calc[Object.keys(calc)[0]];
        this.healthCheck.setPortfolioStatus(this.calculations);
        this.prognosisData = data;

        this.stocksStatus = status[Object.keys(status)[0]];
        this.stocksStatus.push(Object.assign({}, { // Push Weekly SPY into collection.
          "symbol": 'S&P 500',
          "corrected_pgr_rating": 0,
          "percentageChange": this.calculations.SPYPercentageChange,
          "companyName": 'S&P500',
          "raw_pgr_rating": 0,
          "closePrice": 0,
          "arcColor": 2
        }));

        this.pgrChanges = pgr;
        this.earningsSurprise = sups;
        this.analystRevisions = revs;
        this.expectedEarnings = reports;
        this.pgrGridData = grid;
      })
      .subscribe(() => {
        this.loadDailyData();
      });
  }

  loadDailyData() {
    Observable.timer(0, 30 * 1000)
      .switchMap(() => {
        return Observable.combineLatest(
          this.healthCheck.getListSymbols(this._listId, this._uid),
          this.marketsSummary.initialMarketSectorData({components: 'majorMarketIndices,sectors'})
        )
      })
      .takeUntil(this._ngUnsubscribe)
      .subscribe(([stocks, data]) => {
        this.dailySymbolList = stocks['symbols'].filter(x => x['symbol'] != 'S&P 500');
        this.healthCheck.setUserStocks(this.dailySymbolList);
        const indicies = data['market_indices'];
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

  getPHCReportforListId() {
    this.reportService.getPHCReportforListId(this._listId).subscribe();
  }

}

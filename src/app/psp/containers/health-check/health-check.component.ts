import {Component, OnDestroy, OnInit} from '@angular/core';
import {HealthCheckService} from '../../../services/health-check.service';
import {AuthService} from '../../../services/auth.service';

import * as moment from 'moment';

declare var gtag: Function;

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
import {IdeasService} from '../../../services/ideas.service';
import {MatSnackBar} from '@angular/material';
import {SymbolSearchService} from '../../../services/symbol-search.service';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'cpt-health-check',
  template: `
    <!-- PANEL CONTENTS -->
    <div [ngBusy]="loading" class="container-fluid component component--healthcheck">
      <div class="row justify-content-center">

        <!-- ADD BUTTON -->
        <div (click)="openSearch();$event.stopPropagation()" matTooltip="Add a stock" [matTooltipPosition]="'below'" [matTooltipShowDelay]="500" id="add-stock" class="fixed-button hidden-sm-down">
          <button mat-icon-button class="button--add" for="focus-input">
            <i class="fas fa-plus align-absolute"></i>
          </button>
        </div>

        <!-- HEALTH-CHECK - Intro -->
        <cpt-psp-portfolio-overview [listId]="listId" (listChanged)="listChanged()" [lists]="allUserLists"
                                    [calc]="calculations" [data]="prognosisData"
                                    class="col-12 HC-overview"></cpt-psp-portfolio-overview>

        <!-- HEALTH-CHECK - Stock Movements -->
        <cpt-psp-stock-movements [calc]="calculations" [weeklyStocks]="stocksStatus"
                                 (removeStockClicked)="removeStock($event)"
                                 [dailyStocks]="dailySymbolList" class="col-12 col-lg-10 HC-panel__padding"></cpt-psp-stock-movements>

        <!-- HEALTH-CHECK - Ratings Changes -->
        <cpt-psp-rating-changes [alerts]="pgrChanges" class="col-12 col-lg-10 HC-panel__padding"></cpt-psp-rating-changes>

        <!-- HEALTH-CHECK - Earnings Reports -->
        <cpt-psp-earnings-report [surprises]="earningsSurprise"
                                 [revisions]="analystRevisions"
                                 [expected]="expectedEarnings" class="col-12 col-lg-10 HC-panel__padding"></cpt-psp-earnings-report>

        <!-- HEALTH-CHECK - Power Grid -->
        <cpt-psp-power-grid [data]="pgrGridData" class="col-12 col-lg-10 HC-panel__padding"></cpt-psp-power-grid>

        <!-- HEALTH-CHECK - DISCLAIMER -->
        <div class="col-12 col-lg-10" id="HC--Disclaimer">
          <div class="row justify-content-center">

            <div class="col-12 col-xl-10">
              <h4 class="text-left">Disclaimer:</h4>
              <p class="disclaimer">Chaikin Analytics (CA) is not registered as a securities Broker/Dealer or Investment Advisor with either the U.S. Securities and Exchange Commission or with any state securities regulatory authority. The information presented in our reports does not represent a recommendation to buy or sell stocks or any financial instrument nor is it intended as an endorsement of any security or investment. The information in this report does not take into account an individual's specific financial situation. The user bears complete responsibility for their own investment research and should consult with their financial advisor before making buy/sell decisions. For more information, see <a target="_blank" href="http://www.chaikinanalytics.com/disclaimer/">disclaimer.</a> <br><a target="_blank" href="http://www.chaikinanalytics.com/attributions/">See Attributions &raquo;</a></p>
            </div>
          </div>
        </div>

      </div>
    </div>`,
  styleUrls: ['./health-check.component.scss']
})
export class HealthCheckComponent implements OnInit, OnDestroy {
  private _uid: string;
  private _ngUnsubscribe: Subject<void> = new Subject<void>();

  public listId: string;
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
              public snackBar: MatSnackBar,
              private symbolSearchService: SymbolSearchService,
              private ideasService: IdeasService,
              private healthCheck: HealthCheckService,
              private marketsSummary: MarketsSummaryService) {
  }

  ngOnInit() {
    this.loading = this.initData();

    this.healthCheck.getMyStocksSubject()
      .takeUntil(this._ngUnsubscribe)
      .subscribe(() => {
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
      .take(1)
      .map(() => {
        this.allUserLists = this.authService.userLists[0]['User Lists'];
        const myStocksUserList = this.allUserLists.filter(x => x['name'] === 'My Stocks')[0];
        if (this.currentList == 'My Stocks') {
          return this.listId = myStocksUserList['list_id'];
        }
        return this.listId = this.allUserLists.filter(x => x['name'] == this.currentList)[0]['list_id'];
      })
      .switchMap(listId => {
        return this.getAllHCData(listId);
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

  getAllHCData(listId): Observable<any> {
    const lastWeekStart = moment().subtract(1, 'weeks').day(-2).format('YYYY-MM-DD'),
      lastWeekEnd = moment(lastWeekStart).add(7, 'days').format('YYYY-MM-DD'),
      startDate = moment().isoWeekday(1).format('YYYY-MM-DD'),
      endDate = moment().endOf('week').format('YYYY-MM-DD'),
      today = moment().format('YYYY-MM-DD');
    return Observable.combineLatest(
      this.healthCheck.getChaikinCalculations(listId, lastWeekStart, lastWeekEnd),
      this.healthCheck.getPrognosisData(listId),
      this.healthCheck.getUserPortfolioStockStatus(listId, lastWeekStart, lastWeekEnd),
      this.healthCheck.getPGRWeeklyChangeData(listId, lastWeekEnd),
      this.healthCheck.getEarningsSurprise(listId, startDate, endDate),
      this.healthCheck.getAnalystRevisions(listId, lastWeekEnd),
      this.healthCheck.getExpectedEarningsReportsWithPGRValues(this._uid, listId, startDate, endDate),
      this.healthCheck.getPHCGridData(listId),
    )
  }

  updateData() {
    this.getAllHCData(this.listId)
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
    const lastWeekStart = moment().subtract(1, 'weeks').day(-2).format('YYYY-MM-DD'),
      lastWeekEnd = moment(lastWeekStart).add(7, 'days').format('YYYY-MM-DD');
    Observable.timer(0, 30 * 1000)
      .switchMap(() => {
        return Observable.combineLatest(
          this.healthCheck.getListSymbols(this.listId, this._uid),
          this.healthCheck.getPGRWeeklyChangeData(this.listId, lastWeekEnd),
          this.marketsSummary.initialMarketSectorData({components: 'majorMarketIndices,sectors'})
        )
      })
      .takeUntil(this._ngUnsubscribe)
      .subscribe(([stocks, pgr, data]) => {
        this.dailySymbolList = stocks['symbols'].filter(x => x['symbol'] != 'S&P 500');
        this.healthCheck.setUserStocks(this.dailySymbolList);
        this.pgrChanges = pgr;
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

  addStock(ticker: string) {
    this.ideasService.addStockIntoList(this.listId.toString(), ticker)
      .take(1)
      .subscribe(res => this.updateData());
    gtag('event', 'add_stock_clicked', {
      'event_category': 'engagement',
      'event_label': ticker
    });
  }

  removeStock(ticker: string) {
    this.ideasService.deleteSymbolFromList(this.listId, ticker)
      .take(1)
      .finally(() => this.openSnackBar(ticker))
      .subscribe(res => this.updateData());

    gtag('event', 'remove_stock_clicked', {
      'event_category': 'engagement',
      'event_label': ticker
    });
  }

  openSnackBar(ticker: string) {
    let snackBarRef = this.snackBar.open(ticker + ' removed', 'Undo', {
      duration: 3000
    });
    snackBarRef.onAction().subscribe(() => {
      this.addStock(ticker);
    });
  }

  openSearch() {
    this.symbolSearchService.setSearchOpen(true);
  }

}

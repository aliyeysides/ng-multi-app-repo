import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {ListSymbolObj, PortfolioStatus, StockStatus} from '../../../../shared/models/health-check';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subject} from 'rxjs/Subject';
import {SignalService} from '../../../../services/signal.service';
import {HealthCheckService} from '../../../../services/health-check.service';
import {Router} from '@angular/router';

declare var gtag: Function;

interface ToggleOptions {
  all?: FilterFunc,
  bulls?: FilterFunc,
  bears?: FilterFunc,
  neutral?: FilterFunc,
  movers?: FilterFunc
}

interface FilterFunc {
  (stock: StockStatus): boolean
}

@Component({
  selector: 'cpt-psp-stock-movements',
  template: `
    <div id="HC--Stock-Movements" class="">

      <div class="row no-gutters">
        <div class="col-12 col-xl-12">
          <div class="row section__toggle">
            <div class="col-12 toggle toggle--timespan">
              <p (click)="selectTimespan('TODAY')" [ngClass]="{'selected':this.selectedTimespan==='TODAY'}"
                 class="toggle__left">TODAY</p>
              <p (click)="selectTimespan('WEEK')" [ngClass]="{'selected':this.selectedTimespan==='WEEK'}"
                 class="toggle__right">LAST WEEK</p>
            </div>
          </div>

          <div class="row">
            <div class="col-12">
              <h2>Stock Movements</h2>
            </div>
          </div>

          <div class="row no-gutters section__summary justify-content-center">
            <div class="col-6 col-md-5 col-lg-4 col-xl-4 summary--left">
              <p><img
                src="./assets/imgs/icon_circle-movement--green.svg">{{ selectedTimespan == 'WEEK' ? upStocksWeekly : upStocksDaily
                }}</p>
            </div>
            <div class="col-6 col-md-5 col-lg-4 col-xl-4 summary--right">
              <p><img
                src="./assets/imgs/icon_circle-movement--red.svg">{{ selectedTimespan == 'WEEK' ? downStocksWeekly : downStocksDaily
                }}</p>
            </div>
          </div>

          <div class="row no-gutters">
            <div class="col-12">
              <p class="label">SHOWING:</p>
              <div class="btn-group" dropdown [autoClose]="true">
                <button dropdownToggle type="button" class="btn btn-primary">
                  {{ currentToggleOptionText$ | async }}
                </button>
                <ul *dropdownMenu class="dropdown-menu" role="menu">
                  <li (click)="selectToggleOption(toggleOptions.movers, 'Top Movers');" role="menuitem"><a
                    class="dropdown-item">Top Movers</a></li>
                  <li (click)="selectToggleOption(toggleOptions.all, 'All Stocks');" role="menuitem"><a
                    class="dropdown-item">All Stocks</a></li>
                  <li (click)="selectToggleOption(toggleOptions.bulls, 'Bulls')" role="menuitem"><a
                    class="dropdown-item">Bulls</a>
                  </li>
                  <li (click)="selectToggleOption(toggleOptions.bears, 'Bears')" role="menuitem"><a
                    class="dropdown-item">Bears</a>
                  </li>
                  <li (click)="selectToggleOption(toggleOptions.neutral, 'Neutral')" role="menuitem"><a
                    class="dropdown-item">Neutral</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-xl-12">
          <div *ngIf="!collapse" class="row">
            <div class="col-12">
              <ul class="section__chart">
                <li class="row no-gutters col-headers justify-content-center">
                  <div class="col-4 col-sm-2 col-xl-2">
                    <p class="text-left">RATING / TICKER</p>
                  </div>
                  <div class="col-8 col-sm-8 col-xl-8">
                    <p class="text-left col-header--per-chg">% CHANGE</p>
                  </div>
                </li>
                <li (click)="gotoReport(stock.symbol)"
                    *ngFor="let stock of selectedTimespan == 'WEEK' ? weeklyStockData : dailyStockData"
                    class="row no-gutters list-item__mover justify-content-center">
                  <div class="col-4 col-sm-2 col-lg-2 col-xl-2 mover__stock">
                    <p class="ticker"><img *ngIf="stock.arcColor != 2"
                                           src="{{ appendPGRImage(stock.corrected_pgr_rating, stock.raw_pgr_rating ) }}">
                      {{ stock.symbol }}</p>
                  </div>
                  <div class="col-8 col-sm-8 col-lg-8 col-xl-8 mover__data">
                    <div class="mover__bar" [style.width]="stock['barWidth']"
                         [ngClass]="{'positive':stock.percentageChange>0,'negative':stock.percentageChange<0,'indice':stock.arcColor==2}">
                      <p class="data" [ngClass]="{'data--right':stock['width']<25}">{{ stock.percentageChange | decimal
                        }}%</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="col-12">
          <div class="row">
            <div *ngIf="!collapse" (click)="toggleCollapse()" class="col-12 expand-collapse">
              <img src="./assets/imgs/ux__collapse--circle.svg">
              <p>Collapse</p>
            </div>
            <div *ngIf="collapse" (click)="toggleCollapse()" class="col-12 expand-collapse">
              <img src="./assets/imgs/ux__expand--dots.svg">
              <p>Expand for Detail</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['../health-check.component.scss'],
})
export class StockMovementsComponent implements OnInit, OnDestroy, OnChanges {
  private _ngUnsubscribe: Subject<void> = new Subject<void>();
  private _calc: BehaviorSubject<PortfolioStatus> = new BehaviorSubject<PortfolioStatus>({} as PortfolioStatus);
  private _weeklyStocks: BehaviorSubject<StockStatus[]> = new BehaviorSubject<StockStatus[]>({} as StockStatus[]);
  private _dailyStocks: BehaviorSubject<ListSymbolObj[]> = new BehaviorSubject<ListSymbolObj[]>({} as ListSymbolObj[]);

  @Input('calc')
  set calc(val: PortfolioStatus) {
    this._calc.next(val);
  }

  get calc() {
    return this._calc.getValue();
  }

  @Input('weeklyStocks')
  set weeklyStocks(val: StockStatus[]) {
    this._weeklyStocks.next(val);
  }

  get weeklyStocks() {
    return this._weeklyStocks.getValue();
  }

  @Input('dailyStocks')
  set dailyStocks(val: ListSymbolObj[]) {
    this._dailyStocks.next(val);
  }

  get dailyStocks() {
    return this._dailyStocks.getValue();
  }

  toggleOptions: ToggleOptions = {
    all(stock: StockStatus) {
      this.currentToggleOptionText$.next('All Stocks');
      return true;
    },

    bulls(stock: StockStatus) {
      this.currentToggleOptionText$.next('Bulls');
      return stock['arcColor'] >= 1;
    },

    bears(stock: StockStatus) {
      this.currentToggleOptionText$.next('Bears');
      return stock['arcColor'] === -1 || stock['arcColor'] === 2;
    },

    neutral(stock: StockStatus) {
      this.currentToggleOptionText$.next('Neutral');
      return stock['arcColor'] === 0 || stock['arcColor'] === 2;
    },

    movers(stock: StockStatus) {
      this.currentToggleOptionText$.next('Top Movers');
      return true;
    }
  };
  selectedToggleOption$: BehaviorSubject<FilterFunc> = new BehaviorSubject<FilterFunc>({} as FilterFunc);
  currentToggleOptionText$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  calculations: PortfolioStatus;
  selectedTimespan: string = 'TODAY';

  weeklyStockData: StockStatus[];
  dailyStockData;

  upStocksWeekly: number;
  upStocksDaily: number;
  downStocksWeekly: number;
  downStocksDaily: number;

  collapse: boolean = false;

  constructor(private signalService: SignalService,
              private healthCheck: HealthCheckService,
              private router: Router) {
  }

  ngOnInit() {
    this.updateData();

    this.healthCheck.getToggleOptions()
      .takeUntil(this._ngUnsubscribe)
      .subscribe(res => {
        if (res == 'Top Movers') {
          this.selectToggleOption(this.toggleOptions.movers, res);
        }
        if (res == 'All') {
          this.selectToggleOption(this.toggleOptions.all, res);
        }
        if (res == 'Bulls') {
          this.selectToggleOption(this.toggleOptions.bulls, res);
        }
        if (res == 'Neutral') {
          this.selectToggleOption(this.toggleOptions.neutral, res);
        }
        if (res == 'Bears') {
          this.selectToggleOption(this.toggleOptions.bears, res);
        }
        this.updateData();
      });

    this._calc
      .takeUntil(this._ngUnsubscribe)
      .filter(x => x != undefined)
      .subscribe(res => this.calculations = res);

  }

  ngOnDestroy() {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.updateData();
  }

  updateData() {
    this._weeklyStocks
      .filter(x => x != undefined)
      .take(1)
      .subscribe(res => {
        this.weeklyStockData = this.parseStockStatus(res);
        this.calculateBarWidth(this.weeklyStockData);
        this.upStocksWeekly = res.filter(x => x['symbol'] != 'S&P 500' && x['percentageChange'] > 0).length;
        this.downStocksWeekly = res.filter(x => x['symbol'] != 'S&P 500' && x['percentageChange'] < 0).length;
      });

    this._dailyStocks
      .filter(x => x != undefined)
      .take(1)
      .subscribe(res => {
        res.map(x => { // ListSymbolObj needs to be a StockStatus;
          if (x['symbol'] != 'S&P 500') {
            Object.assign(x, {
              symbol: x['symbol'],
              corrected_pgr_rating: x['PGR'],
              percentageChange: x['Percentage '],
              companyName: x['name'],
              raw_pgr_rating: x['raw_PGR'],
              closePrice: x['Last'],
              arcColor: this.appendArcColor(x)
            })
          }
        });
        this.dailyStockData = this.parseStockStatus(res);
        this.calculateBarWidth(this.dailyStockData);
        this.upStocksDaily = res.filter(x => x['symbol'] != 'S&P 500' && x['percentageChange'] > 0).length;
        this.downStocksDaily = res.filter(x => x['symbol'] != 'S&P 500' && x['percentageChange'] < 0).length;
      });
  }

  selectToggleOption(fn: FilterFunc, label: string) {
    this.selectedToggleOption$.next(fn);
    this.updateData();
    gtag('event', 'stock_movements_filter_clicked', {
      'event_category': 'engagement',
      'event_label': label
    });
  }

  selectTimespan(mode: string) {
    this.selectedTimespan = mode;
    this.updateData();
    gtag('event', 'stock_movements_timespan_clicked', {
      'event_category': 'engagement',
      'event_label': mode
    });
  }

  toggleCollapse() {
    this.collapse = !this.collapse;
    gtag('event', 'stock_movements_collapse_clicked', {
      'event_category': 'engagement',
      'event_label': this.collapse
    });
  }

  parseStockStatus(res) {
    let result = res
      .filter(x => this.selectedToggleOption$.getValue().call(this, x))
      .sort((x, y) => y['percentageChange'] - x['percentageChange']);

    if (this.selectedToggleOption$.getValue() === this.toggleOptions.movers) {
      const stocks = result.filter(x => x['symbol'] != 'S&P 500');
      const SPY = result.filter(x => x['symbol'] == 'S&P 500');
      if (stocks.length >= 6) {
        const upmovers = stocks.slice(0, 3);
        const downmovers = stocks.slice(stocks.length - 3, stocks.length);
        result = upmovers
          .concat(downmovers)
          .concat(SPY)
          .sort((x, y) => y['percentageChange'] - x['percentageChange']);
      }
    }
    return result;
  }

  appendPGRImage(pgr, rawPgr) {
    return this.signalService.appendPGRImage(pgr, rawPgr)
  }

  appendArcColor(stock: ListSymbolObj): number {
    if (stock['PGR'] > 3) {
      return 1;
    }
    if (stock['PGR'] === 3) {
      return 0;
    }
    if (stock['PGR'] < 3) {
      return -1;
    }
  }

  calculateBarWidth(stocks: StockStatus[]) {
    if (stocks.length) {
      const per_arr = stocks.map(x => Math.abs(x['percentageChange']));
      const max = per_arr.reduce((a, b) => {
        return Math.max(a, b);
      });
      stocks.map(x => {
        if (Math.abs(x['percentageChange']) == max) {
          return Object.assign(x, {barWidth: 100 + '%', width: 100})
        }
        const relWidth = Math.abs(x['percentageChange']) * 100 / max;
        return Object.assign(x, {barWidth: relWidth + '%', width: relWidth})
      })
    }
  }

  gotoReport(ticker: string) {
    if (ticker === 'S&P 500') return;
    this.router.navigate(['stock-analysis', ticker]);
    gtag('event', 'stock_clicked', {
      'event_category': 'engagement',
      'event_label': ticker
    });
  }

}

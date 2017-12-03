import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {PortfolioStatus, StockStatus} from '../../../../shared/models/health-check';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subject} from 'rxjs/Subject';
import {SignalService} from '../../../../services/signal.service';
import {HealthCheckService} from '../../../../services/health-check.service';
import {MarketsSummaryService} from '../../../../services/markets-summary.service';
import {MarketData} from '../../../../bear/core/market-summary/market-summary.component';

interface ListSymbolObj {
  "is_watching_stock": boolean,
  "symbol": string,
  "raw_PGR": number,
  "industry_name": string,
  "Change": number,
  "filter": number,
  "Last": number,
  "signals": string,
  "market_cap": number,
  "div_yield": number,
  "name": string,
  "list_rating": number,
  "PGR": number,
  "TechnicalRating ": number,
  "Percentage ": number,
  "industry_ListID ": number,
  "is_holding_stock": boolean,
  "SummaryRating ": number
}

interface ToggleOptions {
  currentToggleOptionText: string,
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
    <div id="HC--Stock-Movements" class="col-12 col-lg-4 col-xl-4 float-lg-left">

      <div class="row section__toggle">
        <div class="col-12 toggle toggle--timespan">
          <p (click)="selectTimespan('TODAY')" [ngClass]="{'selected':this.selectedTimespan==='TODAY'}" class="toggle__left">TODAY</p>
          <p (click)="selectTimespan('WEEK')" [ngClass]="{'selected':this.selectedTimespan==='WEEK'}" class="toggle__right">LAST WEEK</p>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <h2>Stock Movements</h2>
        </div>
      </div>

      <div class="row section__summary">
        <div class="col-6 summary--left">
          <p><img src="./assets/imgs/icon_circle-movement--green.svg">{{ upStocks?.length }}</p>
        </div>
        <div class="col-6 summary--right">
          <p><img src="./assets/imgs/icon_circle-movement--red.svg">{{ downStocks?.length }}</p>
        </div>
      </div>

      <div *ngIf="!collapse" class="row">
        <div class="col-12">
          <div class="btn-group" dropdown [autoClose]="true">
            <button dropdownToggle type="button" class="btn btn-primary dropdown-toggle">
              {{ currentToggleOptionText }} <span class="caret"></span>
            </button>
            <ul *dropdownMenu class="dropdown-menu" role="menu">
              <li (click)="selectToggleOption(toggleOptions.movers);" role="menuitem"><a
                class="dropdown-item">Top Movers</a></li>
              <li (click)="selectToggleOption(toggleOptions.all);" role="menuitem"><a
                class="dropdown-item">All</a></li>
              <li (click)="selectToggleOption(toggleOptions.bulls)" role="menuitem"><a class="dropdown-item">Bulls</a>
              </li>
              <li (click)="selectToggleOption(toggleOptions.bears)" role="menuitem"><a class="dropdown-item">Bears</a>
              </li>
              <li (click)="selectToggleOption(toggleOptions.neutral)" role="menuitem"><a class="dropdown-item">Neutral</a>
              </li>
            </ul>
          </div>
          <div class="divider__long"></div>
          <ul class="section__chart">
            <li class="row no-gutters col-headers">
              <div class="col-4">
                <p class="text-left">RATING / TICKER</p>
              </div>
              <div class="col-8">
                <p class="text-left">% CHANGE</p>
              </div>
            </li>
            <li *ngFor="let stock of allStocks" class="row no-gutters list-item__mover">
              <div class="col-4 mover__stock">
                <img *ngIf="stock.arcColor != 2"
                     src="{{ appendPGRImage(stock.corrected_pgr_rating, stock.raw_pgr_rating ) }}">
                <p class="ticker">{{ stock.symbol }}</p>
              </div>
              <div class="col-8 mover__data">
                <div class="mover__bar" [style.width]="stock['barWidth']"
                     [ngClass]="{'positive':stock.percentageChange>0,'negative':stock.percentageChange<0,'indice':stock.arcColor==2}">
                  <p class="data" [ngClass]="{'data--right':stock['width']<25}">{{ stock.percentageChange | decimal }}%</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="row">
        <div *ngIf="!collapse" (click)="toggleCollapse()" class="col-12 expand-collapse">
          <img src="./assets/imgs/icon_chevron--up.svg">
          <p>COLLAPSE</p>
        </div>
        <div *ngIf="collapse" (click)="toggleCollapse()" class="col-12 expand-collapse">
          <img src="./assets/imgs/icon_chevron--down.svg">
          <p>EXPAND</p>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['../health-check.component.scss'],
})
export class StockMovementsComponent implements OnInit, OnDestroy {
  private _ngUnsubscribe: Subject<void> = new Subject<void>();
  private _calc: BehaviorSubject<PortfolioStatus> = new BehaviorSubject<PortfolioStatus>({} as PortfolioStatus);
  private _weeklyStocks: BehaviorSubject<StockStatus[]> = new BehaviorSubject<StockStatus[]>({} as StockStatus[]);
  private _dailyStocks: BehaviorSubject<ListSymbolObj[]> = new BehaviorSubject<ListSymbolObj[]>({} as ListSymbolObj[]);

  allStocks: StockStatus[];
  upStocks: StockStatus[];
  downStocks: StockStatus[];
  collapse: boolean = false;

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
    currentToggleOptionText: 'Top Movers',
    all(stock: StockStatus) {
      // return stock['percentageChange'] != 0;
      this.currentToggleOptionText = 'All';
      return true;
    },

    bulls(stock: StockStatus) {
      this.currentToggleOptionText = 'Bulls';
      return stock['arcColor'] >= 1;
    },

    bears(stock: StockStatus) {
      this.currentToggleOptionText = 'Bears';
      return stock['arcColor'] === -1 || stock['arcColor'] === 2;
    },

    neutral(stock: StockStatus) {
      this.currentToggleOptionText = 'Neutral';
      return stock['arcColor'] === 0 || stock['arcColor'] === 2;
    },

    movers(stock: StockStatus) {
      this.currentToggleOptionText = 'Top Movers';
      return true;
    }
  };
  selectedToggleOption: Function = this.toggleOptions.movers;
  DaySPY: MarketData;
  calculations: PortfolioStatus;
  selectedTimespan: string = 'WEEK';

  constructor(private signalService: SignalService,
              private healthCheck: HealthCheckService,
              private marketsSummary: MarketsSummaryService) {
  }

  ngOnInit() {
    this.updateData();

    this.healthCheck.getToggleOptions()
      .takeUntil(this._ngUnsubscribe)
      .subscribe(res => {
        if (res == 'Top Movers') {
          this.selectedToggleOption = this.toggleOptions.movers;
          this.updateData();
        }
        if (res == 'Bulls') {
          this.selectedToggleOption = this.toggleOptions.bulls;
          this.updateData();
        }
        if (res == 'Neutral') {
          this.selectedToggleOption = this.toggleOptions.neutral;
          this.updateData();
        }
        if (res == 'Bears') {
          this.selectedToggleOption = this.toggleOptions.bears;
          this.updateData();
        }
      });

    this._calc
      .takeUntil(this._ngUnsubscribe)
      .filter(x => x != undefined)
      .subscribe(res => this.calculations = res);

    this.marketsSummary.initialMarketSectorData({components: 'majorMarketIndices,sectors'})
      .takeUntil(this._ngUnsubscribe)
      .subscribe(res => {
        const indicies = res['market_indices'];
        this.DaySPY = indicies[0];
      })
  }

  ngOnDestroy() {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

  updateData() {
    this._weeklyStocks
      .takeUntil(this._ngUnsubscribe)
      .filter(x => x != undefined)
      .subscribe(res => {
        this.allStocks = res
          .filter(x => this.selectedToggleOption(x))
          .sort((x, y) => y['percentageChange'] - x['percentageChange']);

        if (this.selectedToggleOption === this.toggleOptions.movers) {
          const stocks = this.allStocks.filter(x => x['symbol'] != 'S&P 500');
          const SPY = this.allStocks.filter(x => x['symbol'] == 'S&P 500');
          if (stocks.length >= 6) {
            const upmovers = stocks.slice(0, 3);
            const downmovers = stocks.slice(stocks.length - 3, stocks.length);
            this.allStocks = upmovers
              .concat(downmovers)
              .concat(SPY)
              .sort((x, y) => y['percentageChange'] - x['percentageChange']);
          }
        }

        this._dailyStocks
          .takeUntil(this._ngUnsubscribe)
          .subscribe(res => {
            console.log('daily', res);
              // TODO: Need market to be open
          });

        this.parseStockStatus(res);
      });
  }

  selectToggleOption(fn: FilterFunc) {
    this.selectedToggleOption = fn;
    this.updateData();
  }

  selectTimespan(mode: string) {
    this.selectedTimespan = mode;
  }

  toggleCollapse() {
    this.collapse = !this.collapse;
  }

  public parseStockStatus(stocks: StockStatus[]) {
    this.calculateBarWidth(stocks);
    this.upStocks = stocks.filter(x => x['percentageChange'] > 0);
    this.downStocks = stocks.filter(x => x['percentageChange'] < 0);
  }

  public appendPGRImage(pgr, rawPgr) {
    return this.signalService.appendPGRImage(pgr, rawPgr)
  }

  calculateBarWidth(stocks: StockStatus[]) {
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

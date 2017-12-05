import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {ListSymbolObj, PortfolioStatus, StockStatus} from '../../../../shared/models/health-check';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subject} from 'rxjs/Subject';
import {SignalService} from '../../../../services/signal.service';
import {HealthCheckService} from '../../../../services/health-check.service';

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

      <div class="row section__summary">
        <div class="col-6 summary--left">
          <p><img
            src="./assets/imgs/icon_circle-movement--green.svg">{{ selectedTimespan == 'WEEK' ? upStocksWeekly : upStocksDaily
            }}</p>
        </div>
        <div class="col-6 summary--right">
          <p><img
            src="./assets/imgs/icon_circle-movement--red.svg">{{ selectedTimespan == 'WEEK' ? downStocksWeekly : downStocksDaily
            }}</p>
        </div>
      </div>

      <div *ngIf="!collapse" class="row">
        <div class="col-12">
          <div class="btn-group" dropdown [autoClose]="true">
            <button dropdownToggle type="button" class="btn btn-primary dropdown-toggle">
              {{ currentToggleOptionText }} 
              <span>
                <svg class="align-absolute" width="38px" height="38px" viewBox="0 0 38 38" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <defs></defs>
                  <g id="Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="icon_section-h2__calendar-copy" fill-rule="nonzero" fill="#1199ff">
                      <path d="M10.6111607,14.9285714 L27.3888393,14.9285714 C28.2964286,14.9285714 28.7544643,16.03125 28.1098214,16.6674107 L19.7209821,25.0053571 C19.3223214,25.4040179 18.6861607,25.4040179 18.2875,25.0053571 L9.89866071,16.6674107 C9.24553571,16.03125 9.70357143,14.9285714 10.6111607,14.9285714 Z M38,4.07142857 L38,33.9285714 C38,36.1763393 36.1763393,38 33.9285714,38 L4.07142857,38 C1.82366071,38 0,36.1763393 0,33.9285714 L0,4.07142857 C0,1.82366071 1.82366071,0 4.07142857,0 L33.9285714,0 C36.1763393,0 38,1.82366071 38,4.07142857 Z M33.9285714,33.4196429 L33.9285714,4.58035714 C33.9285714,4.30044643 33.6995536,4.07142857 33.4196429,4.07142857 L4.58035714,4.07142857 C4.30044643,4.07142857 4.07142857,4.30044643 4.07142857,4.58035714 L4.07142857,33.4196429 C4.07142857,33.6995536 4.30044643,33.9285714 4.58035714,33.9285714 L33.4196429,33.9285714 C33.6995536,33.9285714 33.9285714,33.6995536 33.9285714,33.4196429 Z" id="Shape"></path>
                      </g>
                  </g>
                </svg>
              </span>
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
              <li (click)="selectToggleOption(toggleOptions.neutral)" role="menuitem"><a
                class="dropdown-item">Neutral</a>
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
            <li *ngFor="let stock of selectedTimespan == 'WEEK' ? weeklyStockData : dailyStockData"
                class="row no-gutters list-item__mover">
              <div class="col-4 mover__stock">
                <img *ngIf="stock.arcColor != 2"
                     src="{{ appendPGRImage(stock.corrected_pgr_rating, stock.raw_pgr_rating ) }}">
                <p class="ticker">{{ stock.symbol }}</p>
              </div>
              <div class="col-8 mover__data">
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
    currentToggleOptionText: 'Top Movers',
    all(stock: StockStatus) {
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
  calculations: PortfolioStatus;
  selectedTimespan: string = 'WEEK';

  weeklyStockData: StockStatus[];
  dailyStockData;

  upStocksWeekly: number;
  upStocksDaily: number;
  downStocksWeekly: number;
  downStocksDaily: number;

  collapse: boolean = false;

  constructor(private signalService: SignalService,
              private healthCheck: HealthCheckService) {
  }

  ngOnInit() {
    this.updateData();

    this.healthCheck.getToggleOptions()
      .takeUntil(this._ngUnsubscribe)
      .subscribe(res => {
        if (res == 'Top Movers') {
          this.selectedToggleOption = this.toggleOptions.movers;
        }
        if (res == 'Bulls') {
          this.selectedToggleOption = this.toggleOptions.bulls;
        }
        if (res == 'Neutral') {
          this.selectedToggleOption = this.toggleOptions.neutral;
        }
        if (res == 'Bears') {
          this.selectedToggleOption = this.toggleOptions.bears;
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
    // console.log('changes', changes);
    if (changes['dailyStocks']) this._dailyStocks.next(changes['dailyStocks'].currentValue);
  }

  updateData() {
    this._weeklyStocks
      .filter(x => x != undefined)
      .take(1)
      .subscribe(res => {
        this.weeklyStockData = this.parseStockStatus(res);
        this.upStocksWeekly = this.weeklyStockData.filter(x => x['symbol'] != 'S&P 500' && x['percentageChange'] > 0).length;
        this.downStocksWeekly = this.weeklyStockData.filter(x => x['symbol'] != 'S&P 500' && x['percentageChange'] < 0).length;

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
        this.upStocksDaily = this.dailyStockData.filter(x => x['symbol'] != 'S&P 500' && x['percentageChange'] > 0).length;
        this.downStocksDaily = this.dailyStockData.filter(x => x['symbol'] != 'S&P 500' && x['percentageChange'] < 0).length;
      });

  }

  selectToggleOption(fn: FilterFunc) {
    this.selectedToggleOption = fn;
    this.updateData();
  }

  selectTimespan(mode: string) {
    this.selectedTimespan = mode;
    this.updateData();
  }

  toggleCollapse() {
    this.collapse = !this.collapse;
  }

  public parseStockStatus(res) {
    let result = res
      .filter(x => this.selectedToggleOption(x))
      .sort((x, y) => y['percentageChange'] - x['percentageChange']);

    if (this.selectedToggleOption === this.toggleOptions.movers) {
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
    this.calculateBarWidth(result);
    return result;
  }

  public appendPGRImage(pgr, rawPgr) {
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

import {
  AfterViewInit,
  Component, ElementRef, Input, OnDestroy, OnInit, QueryList, ViewChildren
} from '@angular/core';
import {StockStatus} from '../../../../shared/models/health-check';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subject} from 'rxjs/Subject';
import {SignalService} from '../../../../services/signal.service';

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
          <p class="toggle__left selected">TODAY</p>
          <p class="toggle__right">LAST WEEK</p>
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

      <div class="row">
        <div class="col-12">
          <div class="btn-group" dropdown [autoClose]="true">
            <button dropdownToggle type="button" class="btn btn-primary dropdown-toggle">
              {{ currentToggleOptionText }} <span class="caret"></span>
            </button>
            <ul *dropdownMenu class="dropdown-menu" role="menu">
              <li (click)="selectToggleOption(toggleOptions.movers, $event);" role="menuitem"><a
                class="dropdown-item">Top Movers</a></li>
              <li (click)="selectToggleOption(toggleOptions.all, $event);" role="menuitem"><a
                class="dropdown-item">All</a></li>
              <li (click)="selectToggleOption(toggleOptions.bulls, $event)" role="menuitem"><a class="dropdown-item">Bulls</a>
              </li>
              <li (click)="selectToggleOption(toggleOptions.bears, $event)" role="menuitem"><a class="dropdown-item">Bears</a>
              </li>
              <li (click)="selectToggleOption(toggleOptions.neutral, $event)" role="menuitem"><a class="dropdown-item">Neutral</a>
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
                <img src="{{ appendPGRImage(stock.corrected_pgr_rating, stock.raw_pgr_rating ) }}">
                <p class="ticker">{{ stock.symbol }}</p>
              </div>
              <div class="col-8 mover__data">
                <div class="mover__bar" [style.width]="stock['barWidth']"
                     [ngClass]="{'positive':stock.percentageChange>0,'negative':stock.percentageChange<0}">
                  <p class="data" #perChange>{{ stock.percentageChange }}%</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['../health-check.component.scss'],
})
export class StockMovementsComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChildren('perChange') perChange: QueryList<ElementRef>;

  private _ngUnsubscribe: Subject<void> = new Subject<void>();
  private _stocks: BehaviorSubject<StockStatus[]> = new BehaviorSubject<StockStatus[]>({} as StockStatus[]);

  allStocks: StockStatus[];
  upStocks: StockStatus[];
  downStocks: StockStatus[];

  @Input('stocks')
  set stocks(val: StockStatus[]) {
    this._stocks.next(val);
  }

  get stocks() {
    return this._stocks.getValue();
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
      return stock['arcColor'] === 1;
    },

    bears(stock: StockStatus) {
      this.currentToggleOptionText = 'Bears';
      return stock['arcColor'] === -1;
    },

    neutral(stock: StockStatus) {
      this.currentToggleOptionText = 'Neutral';
      return stock['arcColor'] === 0;
    },

    movers(stock: StockStatus) {
      this.currentToggleOptionText = 'Top Movers';
      return true;
    }
  };
  selectedToggleOption: Function = this.toggleOptions.movers;

  constructor(private signalService: SignalService) {
  }

  ngOnInit() {
    this.updateData();
  }

  ngAfterViewInit() {
    this.perChange.changes.subscribe(el => console.log('changes sub', el));
  }

  ngOnDestroy() {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

  updateData() {
    this._stocks
      .takeUntil(this._ngUnsubscribe)
      .filter(x => x != undefined)
      .subscribe(res => {
        this.allStocks = res
          .filter(x => this.selectedToggleOption(x))
          .sort((x, y) => y['percentageChange'] - x['percentageChange']);

        if (this.selectedToggleOption === this.toggleOptions.movers) {
          const upmovers = this.allStocks.slice(0, 3);
          const downmovers = this.allStocks.slice(this.allStocks.length - 3, this.allStocks.length);
          this.allStocks = upmovers.concat(downmovers);
        }

        this.parseStockStatus(res);
      });
  }

  selectToggleOption(fn: FilterFunc, e: Event) {
    e.stopPropagation();
    this.selectedToggleOption = fn;
    this.updateData();
  }

  public parseStockStatus(stocks: StockStatus[]) {
    this.calculateBarWidth(stocks);
    this.calculatePerDisplayWidth();
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
        return Object.assign(x, {barWidth: 100 + '%'})
      }
      const relWidth = Math.abs(x['percentageChange']) * 100 / max;
      return Object.assign(x, {barWidth: relWidth + '%'})
    })
  }

  calculatePerDisplayWidth() {
    // const data = document.getElementsByClassName('percentage__change');
    // console.log('perChange', this.perChange);
    // Array.from(data).forEach(x => {
    //   console.log('x', x);
    //   console.log('percentWidth', this.percentWidth(x));
    // });
  }

  percentWidth(el) {
    const pa = el.offsetParent || el;
    return ((el.offsetWidth / pa.offsetWidth) * 100).toFixed(2) + '%';
  }

}

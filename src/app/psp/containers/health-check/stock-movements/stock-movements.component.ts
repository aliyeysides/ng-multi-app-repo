import {
  AfterViewInit,
  Component, ElementRef, Input, OnDestroy, OnInit, QueryList, ViewChildren,
  ViewEncapsulation
} from '@angular/core';
import {StockStatus} from '../../../../shared/models/health-check';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subject} from 'rxjs/Subject';
import {SignalService} from '../../../../services/signal.service';

@Component({
  selector: 'cpt-psp-stock-movements',
  template: `
    <div id="HC--Stock-Movements" class="col-12 col-lg-4 col-xl-4 float-lg-left">

      <div class="row">
        <div class="col-12">
          <h2>Stock Movements</h2>
        </div>
      </div>

      <div class="row section__summary">
        <div class="col-6 summary--left">
          <p class=""><img src="./assets/imgs/icon_circle-movement--green.svg">{{ upStocks?.length }}</p>
        </div>
        <div class="col-6 summary--right">
          <p class=""><img src="./assets/imgs/icon_circle-movement--red.svg">{{ downStocks?.length }}</p>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="divider__long"></div>
          <h3>Top Movers &nbsp;<i class="fa fa-caret-down" aria-hidden="true"></i></h3>
          <div class="divider__long"></div>
        </div>
        <ul class="col-12 section__chart">
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
  `,
  styleUrls: ['../health-check.component.scss']
})
export class StockMovementsComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChildren('perChange') perChange: QueryList<ElementRef>;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
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

  constructor(private signalService: SignalService) {
  }

  ngOnInit() {
    this._stocks
      .takeUntil(this.ngUnsubscribe)
      .filter(x => x != undefined)
      .subscribe(res => {
        this.allStocks = res
          .filter(x => x['percentageChange'] != 0 )
          .sort((x, y) => y['percentageChange'] - x['percentageChange']);
        this.parseStockStatus(res);
      });
  }

  ngAfterViewInit() {
    this.perChange.changes.subscribe(el => console.log('changes sub', el));
    // for (let item of this.perChange) {
    //   console.log('item', item);
    // }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
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

  percentWidth(el){
  const pa = el.offsetParent || el;
  return ((el.offsetWidth/pa.offsetWidth)*100).toFixed(2)+'%';
}

}

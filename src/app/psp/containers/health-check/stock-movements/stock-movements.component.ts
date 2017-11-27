import {Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {StockStatus} from '../../../../shared/models/stock-status';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'cpt-stock-movements',
  template: `
    <div class="col-12 col-md-5 col-lg-4 section section--stockmovements">

      <div class="row section__header">
        <div class="col-12">
          <h2>Stock Movements</h2>
        </div>
      </div>

      <div class="row section__summary">
        <div class="col-1"></div>
        <div class="col-5 summary--left">
          <p><img src="./assets/imgs/icon_circle-movement--green.svg"> 10</p>
        </div>
        <div class="col-5 summary--right">
          <p><img src="./assets/imgs/icon_circle-movement--red.svg"> 4</p>
        </div>
        <div class="col-1"></div>
      </div>

      <div class="row">
        <div class="col-12 chart__header">
          <h3 class="ux-blue">Top Movers &nbsp;<i class="fa fa-caret-down" aria-hidden="true"></i></h3>
          <div class="divider__long divider__long--blue"></div>
        </div>
        <ul class="col-12 section__chart">
          <li class="row no-gutters list-item__mover">
            <div class="col-4 mover__stock">
              <img src="./assets/imgs/arc_Bearish.svg">
              <p class="ticker">URBN</p>
            </div>
            <div class="col-8 mover__data">
              <div class="mover__bar positive hundredpercent">
                <p class="data">17.25%</p>
              </div>
            </div>
          </li>
          <li class="row no-gutters list-item__mover">
            <div class="col-4 mover__stock">
              <img src="./assets/imgs/arc_Bullish.svg">
              <p class="ticker">CMCSA</p>
            </div>
            <div class="col-8 mover__data">
              <div class="mover__bar positive seventypercent">
                <p class="data">13.43%</p>
              </div>
            </div>
          </li>
          <li class="row no-gutters list-item__mover">
            <div class="col-4 mover__stock">
              <img src="./assets/imgs/arc_VeryBullish.svg">
              <p class="ticker">JGW</p>
            </div>
            <div class="col-8 mover__data">
              <div class="mover__bar positive thirtypercent">
                <p class="data">3.45%</p>
              </div>
            </div>
          </li>
        </ul>
        <div class="col-12">
          <div class="divider-grey"></div>
        </div>
        <ul class="col-12 section__chart">
          <li class="row no-gutters list-item__mover">
            <div class="col-4 mover__stock">
              <img src="./assets/imgs/arc_VeryBearish.svg">
              <p class="ticker">YUM</p>
            </div>
            <div class="col-8 mover__data">
              <div class="mover__bar negative thirtypercent">
                <p class="data">-4.25%</p>
              </div>
            </div>
          </li>
          <li class="row no-gutters list-item__mover">
            <div class="col-4 mover__stock">
              <p class="ticker indice">S&P 500</p>
            </div>
            <div class="col-8 mover__data">
              <div class="mover__bar indice thirtyfivepercent">
                <p class="data">-5.31%</p>
              </div>
            </div>
          </li>
          <li class="row no-gutters list-item__mover">
            <div class="col-4 mover__stock">
              <img src="./assets/imgs/arc_Bearish.svg">
              <p class="ticker">TSLA</p>
            </div>
            <div class="col-8 mover__data">
              <div class="mover__bar negative fortypercent">
                <p class="data">-6.73%</p>
              </div>
            </div>
          </li>
          <li class="row no-gutters list-item__mover">
            <div class="col-4 mover__stock">
              <img src="./assets/imgs/arc_Neutral.svg">
              <p class="ticker">ORLY</p>
            </div>
            <div class="col-8 mover__data">
              <div class="mover__bar negative sixtypercent">
                <p class="data">-9.45%</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  `,
  styleUrls: ['../health-check.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StockMovementsComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private _stocks: BehaviorSubject<StockStatus[]> = new BehaviorSubject<StockStatus[]>({} as StockStatus[]);

  upStocks: StockStatus[];
  downStocks: StockStatus[];

  @Input('stocks')
  set stocks(val: StockStatus[]) {
    this._stocks.next(val);
  }
  get stocks() {
    return this._stocks.getValue();
  }

  constructor() { }

  ngOnInit() {
    this._stocks
      .takeUntil(this.ngUnsubscribe)
      .subscribe(res => {
        console.log(res, 'stocks in movements cmp');
        // this.parseStockStatus(res);
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public parseStockStatus(stocks: StockStatus[]) {
    this.upStocks = stocks.filter(x => x['percentageChange'] > 0 );
    this.downStocks = stocks.filter(x => x['percentageChange'] < 0 );
  }

}

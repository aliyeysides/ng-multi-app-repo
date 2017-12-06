import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {ListSymbolObj} from '../../../../shared/models/health-check';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'cpt-my-stocks-list',
  template: `
    <div class="col-12" id="list--selected">
      <h3>My Stocks</h3>
      <div class="divider__long"></div>
      <ul class="stock__list">
        <li class="row col-headers">
          <div class="col-3">
            <p>RATING</p>
          </div>
          <div class="col-3" style="padding-left:0;">
            <p class="text-left">TICKER</p>
          </div>
          <div class="col-3">
            <p>PRICE</p>
          </div>
          <div class="col-3">
            <p>CHG</p>
          </div>
        </li>
        <li *ngFor="let stock of myStocks" class="row list__entry">
          <div class="col-3 list-entry__pgr">
            <img class="align-middle" src="./assets/imgs/arc_VeryBullish.svg">
          </div>
          <div class="col-3 list-entry__info">
            <p class="ticker">{{ stock.symbol }}</p>
            <p class="company">{{ stock.name }}</p>
          </div>
          <div class="col-3 list-entry__data">
            <p class="data green">{{ stock.Last }}</p>
          </div>
          <div class="col-3 list-entry__data">
            <p class="data green">{{ stock.Change }}%</p>
          </div>
          <div (click)="toggleSlider(stock.symbol)" class="button__slide">
            <img src="./assets/imgs/ui_slide.svg">
          </div>
          <div class="col-12 list-entry__overlay" [ngClass]="{'show': sliderObj[stock.symbol], 'green': stock.Change>0, 'red': stock.Change<0 }">
            <div class="row no-gutters overlay__contents">
              <div (click)="toggleSlider(stock.symbol)" class="button__slide">
                <img src="./assets/imgs/ui_slide.svg">
              </div>
              <div class="col-2">
                <img class="align-middle" src="./assets/imgs/icon_minus.svg">
              </div>
              <div class="col-4">
                <p class="ticker">{{ stock.symbol }}</p>
              </div>
              <div class="col-2">
                <img *ngIf="stock.Change>0" class="align-middle" src="./assets/imgs/icon_arrow-up.svg">
                <img *ngIf="stock.Change<0" class="align-middle" src="./assets/imgs/icon_arrow-down.svg">
              </div>
              <div class="col-4">
                <p class="data">{{ stock.Change }}%</p>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  `,
  styleUrls: ['./my-stocks-list.component.scss']
})
export class MyStocksListComponent implements OnInit, OnDestroy {
  private _ngUnsubscribe: Subject<void> = new Subject<void>();
  private _stocks: BehaviorSubject<ListSymbolObj[]> = new BehaviorSubject<ListSymbolObj[]>({} as ListSymbolObj[]);

  @Input('stocks')
  set stocks(val: ListSymbolObj[]) {
    this._stocks.next(val);
  }

  get stocks() {
    return this._stocks.getValue();
  }

  myStocks: ListSymbolObj[];
  sliderObj: object = {};

  constructor() { }

  ngOnInit() {
    this._stocks
      .filter(x => x != undefined)
      .takeUntil(this._ngUnsubscribe)
      .subscribe(stocks => {
        this.myStocks = stocks;
        console.log('myStocks', this.myStocks);
      })
  }

  ngOnDestroy() {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

  toggleSlider(ticker: string) {
    if (!this.sliderObj[ticker]) {
      this.sliderObj = {};
      this.sliderObj[ticker] = true;
      return;
    }
    this.sliderObj[ticker] = !this.sliderObj[ticker];
  }

}

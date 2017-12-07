import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {ListSymbolObj} from '../../../../shared/models/health-check';
import {Subject} from 'rxjs/Subject';
import {SignalService} from '../../../../services/signal.service';
import {HealthCheckService} from '../../../../services/health-check.service';

@Component({
  selector: 'cpt-my-stocks-list',
  template: `
    <div class="col-12 stocklist__overview stocklist__overview--green">
      <p class="list-name">My Stocks</p>
    </div>

    <div class="stocklist__powerbar row no-gutters">
      <div class="col-4">
        <p class="label">Power Bar</p>
      </div>
      <div class="col-8 powerbar clearfix">
        <!--<div (click)="setToggleOptions('Bulls')"
          [ngClass]="{'bullish--more':prognosisData?.BullishSymbolsCount>prognosisData?.BearishSymbolsCount, 'bullish--less':prognosisData?.BullishSymbolsCount<prognosisData?.BearishSymbolsCount,'bullish--same':prognosisData?.BullishSymbolsCount==prognosisData?.BearishSymbolsCount}">
          <p>{{ prognosisData?.BullishSymbolsCount }}</p>
        </div>
        <div (click)="setToggleOptions('Neutral')" class="neutral">
          <p>{{ prognosisData?.NeutralSymbolsCount }}</p>
        </div>
        <div (click)="setToggleOptions('Bears')"
          [ngClass]="{'bearish--more':prognosisData?.BearishSymbolsCount>prognosisData?.BullishSymbolsCount, 'bearish--less':prognosisData?.BearishSymbolsCount<prognosisData?.BullishSymbolsCount,'bearish--same':prognosisData?.BearishSymbolsCount==prognosisData?.BullishSymbolsCount}">
          <p>{{ prognosisData?.BearishSymbolsCount }}</p>
        </div>-->
      </div>
    </div>

    <div class="col-12 section__list" id="list--selected">
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
        <li (click)="selectedStock(stock.symbol)" *ngFor="let stock of myStocks" class="row list__entry">
          <div class="col-3 list-entry__pgr">
            <img class="align-absolute" src="{{ appendPGRImage(stock.PGR, stock.raw_PGR) }}">
          </div>
          <div class="col-3 list-entry__info">
            <p class="ticker">{{ stock.symbol }}</p>
            <p class="company">{{ stock.name }}</p>
          </div>
          <div class="col-3 list-entry__data">
            <p class="data" [ngClass]="{'green': stock.Change>0,'red': stock.Change<0}">{{ stock.Last }}</p>
          </div>
          <div class="col-3 list-entry__data">
            <p class="data" [ngClass]="{'green': stock.Change>0,'red': stock.Change<0}">{{ stock.Change }}%</p>
          </div>
          <div (click)="toggleSlider(stock.symbol)" class="button__slide">
            <img src="./assets/imgs/ui_slide.svg">
          </div>
          <div class="col-12 list-entry__overlay"
               [ngClass]="{'show': sliderObj[stock.symbol], 'green': stock.Change>0, 'red': stock.Change<0 }">
            <div class="row no-gutters overlay__contents">
              <div (click)="toggleSlider(stock.symbol)" class="button__slide">
                <img src="./assets/imgs/ui_slide.svg">
              </div>
              <div (click)="emitRemoveStock(stock.symbol)" class="col-2">
                <img class="align-absolute" src="./assets/imgs/icon_minus.svg">
              </div>
              <div class="col-4">
                <p class="ticker">{{ stock.symbol }}</p>
              </div>
              <div class="col-2">
                <img *ngIf="stock.Change>0" class="align-absolute" src="./assets/imgs/icon_arrow-up.svg">
                <img *ngIf="stock.Change<0" class="align-absolute" src="./assets/imgs/icon_arrow-down.svg">
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

  @Output('addStockClicked') addStockClicked: EventEmitter<string> = new EventEmitter<string>();
  @Output('removeStockClicked') removeStockClicked: EventEmitter<string> = new EventEmitter<string>();
  @Output('stockClicked') stockClicked: EventEmitter<string> = new EventEmitter<string>();
  @Output('updateData') updateData: EventEmitter<void> = new EventEmitter<void>();

  @Input('stocks')
  set stocks(val: ListSymbolObj[]) {
    this._stocks.next(val);
  }

  get stocks() {
    return this._stocks.getValue();
  }

  myStocks: ListSymbolObj[];
  sliderObj: object = {};

  constructor(private signalService: SignalService,
              private healthCheck: HealthCheckService) {
  }

  ngOnInit() {
    this._stocks
      .filter(x => x != undefined)
      .takeUntil(this._ngUnsubscribe)
      .subscribe(stocks => {
        this.myStocks = stocks;
      });

    this.healthCheck.getMyStocksSubject()
      .takeUntil(this._ngUnsubscribe)
      .subscribe(res => {
        this.updateData.emit()
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

  emitAddStock(ticker: string) {
    this.addStockClicked.emit(ticker);
  }

  emitRemoveStock(ticker: string) {
    this.removeStockClicked.emit(ticker);
  }

  appendPGRImage(pgr: number, rawPgr: number) {
    return this.signalService.appendPGRImage(pgr, rawPgr);
  }

  selectedStock(ticker: string) {
    this.stockClicked.emit(ticker);
  }

}

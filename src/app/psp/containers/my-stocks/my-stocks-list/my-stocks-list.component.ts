import {Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {ListSymbolObj, PortfolioStatus} from '../../../../shared/models/health-check';
import {Subject} from 'rxjs/Subject';
import {SignalService} from '../../../../services/signal.service';
import {HealthCheckService} from '../../../../services/health-check.service';
import {ActivatedRoute} from '@angular/router';
import {OrderByPipe} from '../../../../shared/pipes/order-by.pipe';
import {SymbolSearchService} from '../../../../services/symbol-search.service';

declare var gtag: Function;

@Component({
  selector: 'cpt-my-stocks-list',
  template: `
    <div class="row no-gutters stocklist__overview"
         [ngClass]="{'stocklist__overview--green': status?.avgPercentageChange > 0,'stocklist__overview--red': status?.avgPercentageChange < 0 }">
      <div class="col-12">
        <div class="btn-group">
          <button class="btn btn-primary dropdown-toggle" mat-icon-button [matMenuTriggerFor]="appMenu">
            {{ selectedListName }}
          </button>

          <mat-menu #appMenu="matMenu">
            <button mat-menu-item class="label">My Current Lists</button>
            <button mat-menu-item (click)="selectList(list)" *ngFor="let list of userlists" role="menuitem">
              <a class="dropdown-item">{{ list['name'] }}</a>
            </button>
          </mat-menu>
        </div>
      </div>
    </div>


    <div class="row no-gutters justify-content-center stocklist__powerbar">
      <!-- <div class="col-3">
        <p class="label">Power Bar</p>
      </div> -->
      <div class="col-10 powerbar">
        <div
          [ngClass]="{'bullish--more':powerbar[2]>powerbar[0], 'bullish--less':powerbar[2]<powerbar[0],'bullish--same':powerbar[2]==powerbar[0]}">
          <p>{{ powerbar[2] }}</p>
        </div>
        <div class="neutral">
          <p>{{ powerbar[1] }}</p>
        </div>
        <div
          [ngClass]="{'bearish--more':powerbar[0]>powerbar[2], 'bearish--less':powerbar[0]<powerbar[2],'bearish--same':powerbar[0]==powerbar[2]}">
          <p>{{ powerbar[0] }}</p>
        </div>
      </div>
    </div>


    <div class="row justify-content-center no-gutters col-headers">
      <div [ngClass]="{'sorted': orderByObject['field'] === 'PGR'}" (click)="toggleOrderByObject('PGR', $event)" class="col-2">
        <p class="col--pgr">RTG</p>
      </div>
      <div [ngClass]="{'sorted': orderByObject['field'] === 'symbol'}" (click)="toggleOrderByObject('symbol', $event)" class="col-3 text-left" style="padding-left:0;">
        <p>TICKER</p>
      </div>
      <div [ngClass]="{'sorted': orderByObject['field'] === 'Last'}" (click)="toggleOrderByObject('Last', $event)" class="col-3">
        <p>PRICE</p>
      </div>
      <div [ngClass]="{'sorted': orderByObject['field'] === 'Percentage '}" (click)="toggleOrderByObject('Percentage ', $event)" class="col-3">
        <p>CHG</p>
      </div>
    </div>


    <div class="col-12 section__list" id="list--selected">
      <ul class="stock__list" *ngIf="myStocks?.length">
        <li (click)="selectStock(stock.symbol)"
            *ngFor="let stock of myStocks | orderBy:orderByObject?.field:orderByObject?.ascending; trackBy: trackStock"
            class="row justify-content-center list__entry">
          <div class="col-2 list-entry__pgr">
            <img class="align-absolute" src="{{ appendPGRImage(stock.PGR, stock.raw_PGR) }}">
          </div>
          <div class="col-3 list-entry__info">
            <p class="ticker">{{ stock.symbol }}</p>
          </div>
          <div class="col-3 list-entry__data">
            <p class="data" [ngClass]="{'green': stock.Change>0,'red': stock.Change<0}">{{ stock.Last | decimal }}</p>
          </div>
          <div class="col-3 list-entry__data">
            <p class="data" [ngClass]="{'green': stock.Change>0,'red': stock.Change<0}">
              (<span *ngIf="stock.Change>0">+</span>{{ stock['Percentage '] | decimal }}%)</p>
          </div>

          <div (click)="toggleSlider(stock.symbol);$event.stopPropagation()" class="button__slide hidden-sm-up">
            <i class="fal fa-ellipsis-v"></i>
          </div>

          <div class="col-12 list-entry__overlay"
               [ngClass]="{'show': sliderObj[stock.symbol], 'green': stock.PGR>=4, 'red': stock.PGR<=2 && stock.PGR>0, 'yellow': stock.PGR==3, 'none': stock.PGR<=0 }">
            <div class="row no-gutters overlay__contents">
              <div (click)="toggleSlider(stock.symbol);$event.stopPropagation()" class="button__slide hidden-sm-up">
                <i class="fal fa-ellipsis-v"></i>
              </div>
              <div (click)="emitRemoveStock(stock.symbol);$event.stopPropagation()" class="col-2 icon">
                <i class="fal fa-minus-circle"></i>
              </div>
              <div class="col-4">
                <p class="ticker">{{ stock.symbol }}</p>
              </div>
              <div class="col-2 icon">
                <i *ngIf="stock.Change>0" class="fal fa-arrow-up"></i>
                <i *ngIf="stock.Change<0" class="fal fa-arrow-down"></i>
              </div>
              <div class="col-4">
                <p class="data">(<span *ngIf="stock.Change>0">+</span>{{ stock['Percentage '] | decimal }}<sub>%</sub>)</p>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <ul class="stock__list stock__list--empty" *ngIf="!myStocks?.length">
        <p class="empty-chart">Search for a stock to get started.</p>
      </ul>
    </div>
  `,
  styleUrls: ['./my-stocks-list.component.scss']
})
export class MyStocksListComponent implements OnInit, OnDestroy {
  private _ngUnsubscribe: Subject<void> = new Subject<void>();
  private _stocks: BehaviorSubject<ListSymbolObj[]> = new BehaviorSubject<ListSymbolObj[]>({} as ListSymbolObj[]);
  private _powerbar: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private _userlists: BehaviorSubject<object[]> = new BehaviorSubject<object[]>({} as object[]);

  @HostListener('document:keydown', ['$event']) onKeyDown(e) {
    const valid = ['Tab', 'ArrowUp', 'ArrowDown'];
    const ordArr = this.orderBy.transform(this.myStocks, this.orderByObject['field'], this.orderByObject['ascending']);
    const indx = ordArr.map(x => x.symbol).indexOf(this.selectedStock);

    if (valid.filter(x => x === e.key).length > 0) {
      e.preventDefault();
      e.stopPropagation();
      this.symbolSearchService.setSearchOpen(false);
      if (e.key === 'Tab') {
        const next = ordArr.map(x => x.symbol).indexOf(this.selectedStock) + 1;
        if (ordArr.length > next) this.selectStock(ordArr[next].symbol);
        if (ordArr.length <= next) this.selectStock(ordArr[0].symbol);
      }
      if (e.key === "ArrowUp") {
        if (indx - 1 >= 0) this.selectStock(ordArr[indx - 1].symbol);
      }
      if (e.key === "ArrowDown") {
        if (ordArr.length > indx + 1) this.selectStock(ordArr[indx + 1].symbol);
      }
    }
  }

  @Output('addStockClicked') addStockClicked: EventEmitter<string> = new EventEmitter<string>();
  @Output('removeStockClicked') removeStockClicked: EventEmitter<string> = new EventEmitter<string>();
  @Output('stockClicked') stockClicked: EventEmitter<string> = new EventEmitter<string>();
  @Output('updateData') updateData: EventEmitter<void> = new EventEmitter<void>();
  @Output('listChanged') listChanged: EventEmitter<void> = new EventEmitter<void>();

  @Input('stocks')
  set stocks(val: ListSymbolObj[]) {
    this._stocks.next(val);
  }

  get stocks() {
    return this._stocks.getValue();
  }

  @Input('powerBar')
  set powerBar(val: string) {
    this._powerbar.next(val);
  }

  get powerBar() {
    return this._powerbar.getValue();
  }

  @Input('userLists')
  set userlists(val: object[]) {
    this._userlists.next(val);
  }

  get userlists() {
    return this._userlists.getValue();
  }


  powerbar: string[] = ['0', '0', '0'];
  status: PortfolioStatus;
  myStocks: ListSymbolObj[];
  sliderObj: object = {};
  selectedListName: string;
  selectedStock: string;
  orderByObject: object = {};

  constructor(private signalService: SignalService,
              private route: ActivatedRoute,
              private orderBy: OrderByPipe,
              private symbolSearchService: SymbolSearchService,
              private healthCheck: HealthCheckService) {
  }

  ngOnInit() {
    this._stocks
      .filter(x => x != undefined)
      .takeUntil(this._ngUnsubscribe)
      .subscribe(stocks => {
        this.myStocks = stocks;
      });

    this._powerbar
      .filter(x => x != undefined)
      .takeUntil(this._ngUnsubscribe)
      .subscribe(powerbar => {
        this.powerbar = powerbar.split(',');
      });

    this.healthCheck.getMyStocksSubject()
      .takeUntil(this._ngUnsubscribe)
      .subscribe(res => {
        this.updateData.emit()
      });

    this.healthCheck.getPortfolioStatus()
      .takeUntil(this._ngUnsubscribe)
      .subscribe(res => this.status = res);

    this.route.params
      .takeUntil(this._ngUnsubscribe)
      .subscribe(params => {
          if (params.symbol) {
            this.selectedStock = params.symbol;
            this.sliderObj = {};
            this.sliderObj[params.symbol] = true;
          } else {
            // this.selectStock = 'AAPL';
          }
        });

    this.selectedListName = this.healthCheck.currentList;
    this.orderByObject['field'] = 'PGR';
    this.orderByObject['ascending'] = false;
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

  toggleOrderByObject(val: string, e: Event) {
    e.preventDefault();
    gtag('event', 'sort_by_clicked', {'event_label': val});
    this.orderByObject['field'] = val;
    this.orderByObject['ascending'] = !this.orderByObject['ascending'];
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

  selectStock(ticker: string) {
    this.selectedStock = ticker;
    this.stockClicked.emit(ticker);
    this.toggleSlider(ticker);
  }

  selectList(list: object) {
    this.selectedListName = list['name'];
    this.healthCheck.currentList = this.selectedListName;
    this.listChanged.emit();
    gtag('event', 'list_switched', {
      'event_label': this.selectedListName
    });
  }

  trackStock(idx, stock) {
    return stock ? stock.symbol : undefined;
  }

}

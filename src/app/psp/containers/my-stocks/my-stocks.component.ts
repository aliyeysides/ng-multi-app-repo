import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {HealthCheckService} from '../../../services/health-check.service';
import {ListSymbolObj} from '../../../shared/models/health-check';
import {Subscription} from 'rxjs/Subscription';
import {IdeasService} from '../../../services/ideas.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {SignalService} from '../../../services/signal.service';

import * as moment from 'moment';

declare var gtag: Function;

@Component({
  selector: 'cpt-my-stocks',
  template: `
    <div class="container-fluid">

      <div class="row">
        <div class="col-12 col-md-4 col-xl-3 component--mystocks">
          <cpt-my-stocks-list [ngBusy]="loading" (listChanged)="ngOnInit()" (addStockClicked)="addStock($event)"
                              (removeStockClicked)="removeStock($event)"
                              (updateData)="updateData()"
                              (stockClicked)="selectStock($event)"
                              [stocks]="userStocks" [powerBar]="powerBar"
                              [userLists]="allUserLists"></cpt-my-stocks-list>
<!--           <div class="col-12">
            <h3>Recently Viewed</h3>
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
              <li (click)="selectStock(recent['meta-info']['symbol'])" *ngFor="let recent of recentlyViewed"
                  class="row list__entry">
                <div class="col-3 list-entry__pgr">
                  <img class="align-absolute"
                       src="{{ appendPGRImage(recent['pgr']['Corrected PGR Value'], recent['pgr']['PGR Value']) }}">
                </div>
                <div class="col-3" style="padding-left:0;">
                  <p class="text-left">{{ recent['meta-info']['symbol'] }}</p>
                </div>
                <div class="col-3">
                  <p>{{ recent['meta-info']['Last'] }}</p>
                </div>
                <div class="col-3">
                  <p>{{ recent['meta-info']['Percentage '] }}%</p>
                </div>
              </li>
            </ul>
          </div> -->
        </div>

        <div class="col-12 col-md-8 col-xl-9 component--stockview__container" [ngClass]="{'visible': !desktopView}">
          <cpt-psp-stock-report [userStocks]="userStocks"
                                [listId]="listId" (addStockClicked)="addStock($event)"
                                (removeStockClicked)="removeStock($event)" (closeClicked)="closeReport()"
                                [show]="!!selectedStock || desktopView"
                                [stock]="selectedStock">
          </cpt-psp-stock-report>
        </div>

      </div>

    </div>
  `,
  styleUrls: ['./my-stocks.component.scss']
})
export class MyStocksComponent implements OnInit, OnDestroy {
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    const width = event.target.innerWidth;
    if (+width <= 992) this.desktopView = false;
    if (+width > 992) {
      if (this.selectedStock) {
        this.router.navigate(['/stock-analysis', this.selectedStock]);
      }
      this.desktopView = true;
    }
  }

  private _uid: string;
  private _ngUnsubscribe: Subject<void> = new Subject<void>();

  listId: string;
  selectedStock: string | boolean;
  desktopView: boolean;
  userStocks: ListSymbolObj[];
  powerBar: string;
  loading: Subscription;
  allUserLists: object[];
  currentList: string;
  recentlyViewed: object[] = [];

  constructor(private authService: AuthService,
              private healthCheck: HealthCheckService,
              private ideasService: IdeasService,
              private route: ActivatedRoute,
              private router: Router,
              private signalService: SignalService) {
    const mobWidth = (window.screen.width);
    if (+mobWidth <= 1024) this.desktopView = false;
    if (+mobWidth > 1024) this.desktopView = true;
  }

  ngOnInit() {
    this.loading = this.authService.currentUser$
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
        const startDate = moment().subtract(1, 'weeks').day(-2).format('YYYY-MM-DD'),
          endDate = moment(startDate).add(7, 'days').format('YYYY-MM-DD');
        return Observable.combineLatest(
          this.healthCheck.getListSymbols(listId, this._uid),
          this.healthCheck.getChaikinCalculations(listId, startDate, endDate)
        )
      })
      .subscribe(([symbols, calc]) => {
        this.userStocks = symbols['symbols'];
        this.healthCheck.setUserStocks(this.userStocks);
        this.powerBar = symbols['PowerBar'];
        this.healthCheck.setPortfolioStatus(calc[Object.keys(calc)[0]]);
      });

    Observable.interval(30 * 1000)
      .takeUntil(this._ngUnsubscribe)
      .subscribe(res => this.updateData());

      this.route.params
      .takeUntil(this._ngUnsubscribe)
      .subscribe(params => {
          if (params.symbol) {
            this.selectedStock = params.symbol.slice();
          } else {
            this.selectedStock = 'AAPL';
          }
        }
      );

    const recentlyViewedString = localStorage.getItem('recentlyViewed');
    if (recentlyViewedString) {
      const viewed = JSON.parse(recentlyViewedString).symbols;
      Observable.from(viewed)
        .flatMap(ticker => this.ideasService.getStockCardData(ticker as string))
        .subscribe(res => this.recentlyViewed.push(res));
    }
  }

  ngOnDestroy() {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

  updateData() {
    this.healthCheck.getListSymbols(this.listId, this._uid)
      .filter(x => x != undefined)
      .take(1)
      .subscribe(res => {
        this.userStocks = res['symbols'];
        this.healthCheck.setUserStocks(res['symbols']);
        this.powerBar = res['PowerBar'];
        this.recentlyViewed = [];
        const recentlyViewedString = localStorage.getItem('recentlyViewed');
        if (recentlyViewedString) {
          const viewed = JSON.parse(recentlyViewedString).symbols;
          Observable.from(viewed)
            .flatMap(ticker => this.ideasService.getStockCardData(ticker as string))
            .subscribe(res => this.recentlyViewed.push(res));
        }
      })
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
      .subscribe(res => this.updateData());
    gtag('event', 'remove_stock_clicked', {
      'event_category': 'engagement',
      'event_label': ticker
    });
  }

  selectStock(ticker: string) {
    this.gotoReport(ticker);
    gtag('event', 'stock_clicked', {
      'event_category': 'engagement',
      'event_label': ticker
    });
  }

  gotoReport(ticker: string) {
    this.router.navigate(['stock-analysis', ticker]);
  }

  closeReport() {
    this.router.navigate(['stock-analysis']);
  }

  appendPGRImage(pgr, rawPgr) {
    return this.signalService.appendPGRImage(pgr, rawPgr);
  }

}

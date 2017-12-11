import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {HealthCheckService} from '../../../services/health-check.service';
import {ListSymbolObj} from '../../../shared/models/health-check';
import {Subscription} from 'rxjs/Subscription';
import {IdeasService} from '../../../services/ideas.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {Location} from '@angular/common';
import {SignalService} from '../../../services/signal.service';

@Component({
  selector: 'cpt-my-stocks',
  template: `
    <div [ngBusy]="loading" class="container-fluid component component--mystocks">
      <div class="row contents">
        <cpt-my-stocks-list (listChanged)="ngOnInit()" (addStockClicked)="addStock($event)"
                            (removeStockClicked)="removeStock($event)"
                            (updateData)="updateData()"
                            (stockClicked)="selectStock($event)"
                            [stocks]="userStocks" [powerBar]="powerBar" [userLists]="allUserLists"></cpt-my-stocks-list>
        <div class="col-12" id="list--recent">
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
            <li *ngFor="let recent of recentlyViewed" class="row col-headers">
              <div class="col-3 list-entry__pgr">
                <img class="align-absolute" src="{{ appendPGRImage(recent['pgr']['PGR Value'], recent['pgr']['Corrected PGR Value']) }}">
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
        </div>
      </div>
    </div>
    <cpt-psp-stock-report (closeClicked)="closeReport()" [show]="!!selectedStock || reportOpen"
                          [stock]="selectedStock"></cpt-psp-stock-report>
  `,
  styleUrls: ['./my-stocks.component.scss']
})
export class MyStocksComponent implements OnInit, OnDestroy {
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    const width = event.target.innerWidth;
    if (+width <= 1024) this.reportOpen = false;
    if (+width > 1024) this.reportOpen = true;
    this.router.navigate(['/my-stocks', this.userStocks[0].symbol])
  }

  private _uid: string;
  private _listId: string;
  private _ngUnsubscribe: Subject<void> = new Subject<void>();

  selectedStock: string | boolean;
  reportOpen: boolean;
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
              private location: Location,
              private signalService: SignalService) {
    const mobWidth = (window.screen.width);
    if (+mobWidth <= 1024) this.reportOpen = false;
    if (+mobWidth > 1024) this.reportOpen = true;
  }

  ngOnInit() {
    this.loading = this.authService.currentUser$
      .map(usr => this._uid = usr['UID'])
      .do(() => this.currentList = this.healthCheck.currentList)
      .flatMap(uid => this.healthCheck.getAuthorizedLists(uid))
      .take(1)
      .map(res => {
        this.allUserLists = res[0]['User Lists'];
        const myStocksUserList = this.allUserLists.filter(x => x['name'] === 'My Stocks')[0];
        if (this.currentList == 'My Stocks') {
          return this._listId = myStocksUserList['list_id'];
        }
        return this._listId = this.allUserLists.filter(x => x['name'] == this.currentList)[0]['list_id'];
      })
      .switchMap(listId => {
        return this.healthCheck.getListSymbols(listId, this._uid)
      })
      .subscribe(res => {
        this.userStocks = res['symbols'];
        this.powerBar = res['PowerBar'];
      });

    Observable.interval(30 * 1000)
      .takeUntil(this._ngUnsubscribe)
      .subscribe(res => this.updateData());

    this.route.params
      .takeUntil(this._ngUnsubscribe)
      .subscribe(params => {
          if (params.symbol) {
            this.selectedStock = params.symbol;
          } else {
            // this.selectedStock = 'AAPL';
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
    this.loading = this.healthCheck.getListSymbols(this._listId, this._uid)
      .filter(x => x != undefined)
      .take(1)
      .subscribe(res => {
        this.userStocks = res['symbols'];
        this.healthCheck.setUserStocks(res['symbols']);
        this.powerBar = res['PowerBar'];
      })
  }

  addStock(ticker: string) {
    console.log('addStock', ticker);
    this.ideasService.addStockIntoList(this._listId.toString(), ticker)
      .take(1)
      .subscribe(res => this.updateData());
  }

  removeStock(ticker: string) {
    this.ideasService.deleteSymbolFromList(this._listId, ticker)
      .take(1)
      .subscribe(res => this.updateData());
  }

  selectStock(ticker: string) {
    this.gotoReport(ticker);
  }

  gotoReport(ticker: string) {
    this.router.navigate(['my-stocks', ticker])
  }

  closeReport() {
    this.location.back();
  }

  appendPGRImage(pgr, rawPgr) {
    return this.signalService.appendPGRImage(pgr, rawPgr);
  }

}

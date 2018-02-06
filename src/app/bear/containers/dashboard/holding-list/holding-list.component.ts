import { Component, OnInit } from '@angular/core';
import {Idea, IdeaList} from '../../../../shared/models/idea';
import {Subscription} from 'rxjs/Subscription';
import {IdeasService} from '../../../../services/ideas.service';
import {AuthService} from '../../../../services/auth.service';
import {SignalService} from '../../../../services/signal.service';
import {SymbolSearchService} from '../../../../services/symbol-search.service';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {Router} from '@angular/router';

@Component({
  selector: 'cpt-holding-list',
  template: `
    <div class="dashboard__panel--list">
      <ul [ngBusy]="loading" class="dash-body dash-body--userlist">
        <ng-container *ngIf="holdingListIdeas?.length>0">
          <li *ngFor="let item of holdingListIdeas" class="row no-gutters">
            <div class="col-2 stock__PGR">
              <img class="align-absolute" src="{{ appendPGRImage(item.PGR, item.raw_PGR) }}">
            </div>
            <div (click)="gotoReport(item.symbol)" class="col-3 stock__ticker">
              <p class="ticker">{{ item.symbol }}</p>
            </div>
            <div class="col-1">
              <div (click)="openAlerts();$event.stopPropagation()"
                   *ngIf="getAlertsForItem(item, holdingListAlerts).length>0"
                   class="stock__alert"
                   [ngClass]="getBellColors(item, holdingListAlerts)">
                <i class="fa fa-bell" aria-hidden="true"></i>
              </div>
            </div>
            <div class="col-3 stock__price">
              <p class="data" [ngClass]="{'up-change':item?.Change>0,'down-change':item?.Change<0}">
                {{ item.Last | decimal}}</p>
            </div>
            <div class="col-3 stock__price">
              <p class="data" [ngClass]="{'up-change':item?.Change>0,'down-change':item?.Change<0}">
                (<span *ngIf="item?.Change>0" class="up-change">+</span>{{ item['Percentage '] | decimal }}%)</p>
            </div>
            <div (click)="removeFromList('Holding', item.symbol)" class="button__remove-stock">
              <a><i class="fa fa-times" aria-hidden="true"></i></a>
            </div>
          </li>
        </ng-container>
        <ng-container *ngIf="holdingListIdeas?.length==0">
          <p class="empty-list__text"><u class="search" (click)="openSearch();$event.stopPropagation()">Search</u> for a stock to add to your Holding list</p>
        </ng-container>
      </ul>
    </div>
  `,
  styleUrls: ['./holding-list.component.scss']
})
export class HoldingListComponent implements OnInit {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private uid: string;

  public currentList = 'Holding';
  public holdingListIdeas: Array<Idea>;
  public watchingListIdeas: Array<Idea>;

  public holdingListAlerts: object[];
  public watchingListAlerts: object[];

  public holdingList: IdeaList;
  public watchingList: IdeaList;

  public loading: Subscription;

  constructor(private ideasService: IdeasService,
              private authService: AuthService,
              private signalService: SignalService,
              private router: Router,
              private searchService: SymbolSearchService) {
  }

  ngOnInit() {
    this.updateData();
    this.ideasService.updateAlerts$
      .takeUntil(this.ngUnsubscribe)
      .subscribe(() => this.refreshData());

    setInterval(() => {
      this.refreshData();
    }, 1000 * 60);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public updateData() {
    this.loading = this.refreshData();
  }

  public refreshData() {
    return this.authService.currentUser$
      .map(usr => this.uid = usr['UID'])
      .flatMap(uid => this.ideasService.getIdeasList(uid, 'Bear'))
      .flatMap(res => {
        this.holdingList = res[2]['user_lists'][0];
        this.watchingList = res[2]['user_lists'][1];
        return Observable.combineLatest(
          this.ideasService.getListSymbols(this.holdingList['list_id'].toString(), this.uid),
          this.ideasService.getListSymbols(this.watchingList['list_id'].toString(), this.uid),
          this.signalService.getAllAlerts({
            list_id: this.holdingList['list_id'],
            period: '1',
            uid: this.uid
          }),
          this.signalService.getAllAlerts({
            list_id: this.watchingList['list_id'],
            period: '1',
            uid: this.uid
          })
        )
      })
      .take(1)
      .subscribe(res => {
        this.holdingListIdeas = res[0]['symbols'];
        this.watchingListIdeas = res[1]['symbols'];
        this.holdingListAlerts = res[2]['EarningEstimate'].concat(res[2]['EarningSurprise'], res[2]['PGR']);
        this.watchingListAlerts = res[3]['EarningEstimate'].concat(res[3]['EarningSurprise'], res[3]['PGR']);
        this.holdingListAlerts.filter(this.assignDiffProp);
        this.watchingListAlerts.filter(this.assignDiffProp);
      })
  }

  public appendPGRImage(pgr: number, rawPgr: number) {
    return this.signalService.appendPGRImage(pgr, rawPgr);
  }

  assignDiffProp(x) {
    if (x['Text'] == 'Estimate Revision') {
      return Object.assign(x, {diff: x['ESTPercentageChange'] })
    }
    if (x['Text'] == 'Earnings Surprise') {
      return Object.assign(x, {diff: x['PercentageSurprise'] })
    }
    if (x['Text'] == 'Power Gauge turns Bullish') {
      return Object.assign(x, {diff: 1 })
    }
    if (x['Text'] == 'Power Gauge turns Bearish') {
      return Object.assign(x, {diff: -1 })
    }
  }

  openSearch() {
    this.searchService.setSearchOpen(true);
  }

  removeFromList(list: string, symbol: string) {
    let listId;
    if (list === 'Holding') listId = this.holdingList['list_id'];
    if (list === 'Watching') listId = this.watchingList['list_id'];
    this.loading = this.ideasService.deleteSymbolFromList(listId.toString(), symbol)
      .take(1)
      .map(res => {
        return Observable.combineLatest(
          this.ideasService.getListSymbols(this.holdingList['list_id'].toString(), this.uid),
          this.ideasService.getListSymbols(this.watchingList['list_id'].toString(), this.uid)
        )
      })
      .flatMap(res => res)
      .subscribe(res => {
        this.holdingListIdeas = res[0]['symbols'];
        this.watchingListIdeas = res[1]['symbols'];
      })
  }

  getAlertsForItem(item: Idea, alerts: object[]) {
    return alerts.filter(alert => item.symbol === alert['Symbol']);
  }

  getBellColors(item: Idea, alerts: object[]) {
    return {
      'bell--yellow': this.getAlertsForItem(item, alerts).length > 1,
      'bell--green': this.getAlertsForItem(item, alerts).length == 1 && this.getAlertsForItem(item, alerts)[0]['diff'] > 0,
      'bell--red': this.getAlertsForItem(item, alerts).length == 1 && this.getAlertsForItem(item, alerts)[0]['diff'] < 0
    };
  }

  openAlerts() {
    this.signalService.openAlerts();
  }

  gotoReport(ticker: string) {
    this.router.navigate(['/report', ticker]);
  }

}

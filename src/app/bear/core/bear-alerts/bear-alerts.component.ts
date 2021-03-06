import {AfterViewInit, Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {SignalService} from '../../../services/signal.service';
import {Subscription} from 'rxjs/Subscription';

import {AuthService} from '../../../services/auth.service';
import {IdeasService} from '../../../services/ideas.service';
import {Observable} from 'rxjs/Observable';
import {BaseSettingsMenuComponent} from '../../../shared/components/menus/settings-menu.component';
import {Router} from '@angular/router';

declare let gtag: Function;

@Component({
  selector: 'cpt-bear-alerts',
  template: `
    <button tooltip="Alerts" placement="bottom"  class="quick-link">
      <svg class="align-absolute" width="300px" height="300px" viewBox="0 0 300 300" version="1.1"
           xmlns="http://www.w3.org/2000/svg"
           xmlns:xlink="http://www.w3.org/1999/xlink">
        <defs></defs>
        <g id="icon_alerts" fill="#000000" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <path
            d="M153,283 C153,281.833333 151.833333,280.666667 150,281 C137.166667,280.666667 126.333333,269.833333 126,257 C126.333333,255.166667 125.166667,254 124,254 C122.166667,254 121,255.166667 121,257 C121,272.833333 134.166667,286 150,286 C151.833333,286 153,284.833333 153,283 Z M289,236 C289,247.433036 279.310096,257.142857 268,257 L193,257 C192.769231,280.747768 173.55649,300 150,300 C126.44351,300 107.230769,280.747768 107,257 L32,257 C20.6899038,257.142857 11,247.433036 11,236 C35.7259615,214.787946 64.4615385,177.287946 64,96 C64.4615385,64.2857143 91.0252404,29.1294643 135,23 C134.46274,20.5915179 133.961538,18.4151786 134,16 C133.961538,7.19866071 141.145433,0 150,0 C158.854567,0 166.038462,7.19866071 166,16 C166.038462,18.4151786 165.53726,20.5915179 165,23 C208.97476,29.1294643 235.538462,64.2857143 236,96 C235.538462,177.287946 264.274038,214.787946 289,236 Z"
            id="icon"></path>
        </g>
      </svg>
      <span *ngIf="allItems>0" class="badge badge-danger align-absolute">{{ allItems }}</span>
    </button>
    <div #nav id="notificationSideNav" class="sidenav sidenav--alerts">

      <div class="right-sidebar__header">
        <a href="javascript:void(0)" class="closebtn" (click)="toggleNav(nav, '0', false);$event.stopPropagation()">&times;</a>
        <svg width="300px" height="300px" viewBox="0 0 300 300" version="1.1" xmlns="http://www.w3.org/2000/svg"
             xmlns:xlink="http://www.w3.org/1999/xlink">
          <defs></defs>
          <g id="icon_alerts" fill="#ffffff" stroke="none" stroke-width="1" fill-rule="evenodd">
            <path
              d="M153,283 C153,281.833333 151.833333,280.666667 150,281 C137.166667,280.666667 126.333333,269.833333 126,257 C126.333333,255.166667 125.166667,254 124,254 C122.166667,254 121,255.166667 121,257 C121,272.833333 134.166667,286 150,286 C151.833333,286 153,284.833333 153,283 Z M289,236 C289,247.433036 279.310096,257.142857 268,257 L193,257 C192.769231,280.747768 173.55649,300 150,300 C126.44351,300 107.230769,280.747768 107,257 L32,257 C20.6899038,257.142857 11,247.433036 11,236 C35.7259615,214.787946 64.4615385,177.287946 64,96 C64.4615385,64.2857143 91.0252404,29.1294643 135,23 C134.46274,20.5915179 133.961538,18.4151786 134,16 C133.961538,7.19866071 141.145433,0 150,0 C158.854567,0 166.038462,7.19866071 166,16 C166.038462,18.4151786 165.53726,20.5915179 165,23 C208.97476,29.1294643 235.538462,64.2857143 236,96 C235.538462,177.287946 264.274038,214.787946 289,236 Z"
              id="icon"></path>
          </g>
        </svg>
        <h3>Alerts</h3>
      </div>

      <div class="alerts__container">

        <div class="alerts__section">
          <h4><i class="fa fa-briefcase" aria-hidden="true"></i> &nbsp;HOLDING</h4>

          <ul class="alerts__list container container-fluid">
            <p class="empty-list__text" *ngIf="holdingListAlerts?.length==0">No Alerts.</p>
            <li *ngFor="let alert of this.holdingListAlerts" class="alert__entry row">
              <div class="col-4 alert__stock">
                <p class="ticker">
                  <img class="rating" src="{{ alert['pgr_url'] }}">
                  <span (click)="gotoReport(alert['Symbol'])">{{ alert['Symbol'] }}</span>
                </p>
              </div>
              <div class="col-8 alert__info">
                <ul class="container container-fluid">
                  <li class="row no-gutters">
                    <div class="col-11">
                      <p class="alert__text">{{ alert['Text'] }}</p>
                      <p class="alert__text"
                         *ngIf="alert['Text'] == 'Earnings Surprise'">
                        Est. <b>{{ alert['ConsensusEstimate'] }}</b>
                        <span
                          [ngClass]="{'up-change': +alert['PercentageSurprise']>0, 'down-change': +alert['PercentageSurprise']<0}"> Act. <b>{{ alert['ActualEPS']
                          }}</b></span>
                      </p>
                      <p class="alert__text"
                         *ngIf="alert['Text'] == 'Estimate Revision'">
                        Est. <b>{{ alert['MeanESTPreviousDay'] }}</b>
                        <span
                          [ngClass]="{'up-change': +alert['ESTPercentageChange']>0, 'down-change': +alert['ESTPercentageChange']<0}">➞ <b>{{ alert['MeanESTCurrentDay']
                          }}</b></span>
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>

        <div class="alerts__section">
          <h4><i class="fa fa-binoculars" aria-hidden="true"></i> &nbsp;WATCHING</h4>
          <ul class="alerts__list container container-fluid">
            <p class="empty-list__text" *ngIf="watchingListAlerts?.length==0">No Alerts.</p>
            <li *ngFor="let alert of watchingListAlerts" class="alert__entry row">
              <div class="col-4 alert__stock">
                <p class="ticker">
                  <img class="rating" src="{{ alert['pgr_url'] }}">
                  <span (click)="gotoReport(alert['Symbol'])">{{ alert['Symbol'] }}</span>
                </p>
              </div>
              <div class="col-8 alert__info">
                <ul class="container container-fluid">
                  <li class="row no-gutters">
                    <div class="col-11">
                      <p class="alert__text">{{ alert['Text'] }}</p>
                      <p class="alert__text"
                         *ngIf="alert['Text'] == 'Earnings Surprise'">
                        Est. <b>{{ alert['ConsensusEstimate'] }}</b>
                        <span
                          [ngClass]="{'up-change': +alert['PercentageSurprise']>0, 'down-change': +alert['PercentageSurprise']<0}"> Act. <b>{{ alert['ActualEPS']
                          }}</b></span>
                      </p>
                      <p class="alert__text"
                         *ngIf="alert['Text'] == 'Estimate Revision'">
                        Est. <b>{{ alert['MeanESTPreviousDay'] }}</b>
                        <span
                          [ngClass]="{'up-change': +alert['ESTPercentageChange']>0, 'down-change': +alert['ESTPercentageChange']<0}">➞ <b>{{ alert['MeanESTCurrentDay']
                          }}</b></span>
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>

        <div class="alerts__section">
          <h4><i class="fa fa-lightbulb-o" aria-hidden="true"></i> &nbsp;BEST BEAR IDEAS</h4>
          <ul class="alerts__list container container-fluid">

            <p class="empty-list__text" *ngIf="bearListSignals?.length==0">No Alerts.</p>
            <li *ngFor="let alert of bearListSignals" class="alert__entry row">
              <div class="col-4 alert__stock">
                <p class="ticker">
                  <img class="rating" src="{{ alert['pgr_url'] }}">
                  <span (click)="gotoReport(alert['Symbol'])">{{ alert['Symbol'] }}</span>
                </p>
              </div>
              <div class="col-1 stock__alert down-alert">
                <i class="fa fa-play" aria-hidden="true"></i>
              </div>
              <div class="col-7 alert__info">
                <ul class="container container-fluid">
                  <li class="row no-gutters">
                    <div class="col-11">
                      <p class="down-change">{{ alert['signal_text'] }}</p>
                    </div>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>

      </div>
    </div>
  `,
  styleUrls: ['./bear-alerts.component.scss']
})
export class BearAlertsComponent extends BaseSettingsMenuComponent implements AfterViewInit {
  @ViewChild('nav') nav: ElementRef;

  @HostListener('click', ['$event']) onClick(e?: Event) {
    if (e) e.stopPropagation();
    this.toggleNav(this.nav.nativeElement, '500px', true);
    gtag('event', 'alerts_opened', {'event_category': 'engagement'});
  }

  private uid: string;
  private holdingListId: number;
  private watchingListId: number;
  private bestBearsListId: number;

  public holdingListAlerts: object[];
  public watchingListAlerts: object[];
  public bearListSignals: object[];
  public allItems: number;
  public date: string;
  public loading: Subscription;

  constructor(public el: ElementRef,
              private router: Router,
              public authService: AuthService,
              private signalService: SignalService,
              private ideasService: IdeasService) {
    super(el, authService)
  }

  ngAfterViewInit() {
    this.updateData();
    this.ideasService.updateAlerts$
      .subscribe(() => {
        this.allItems = 0;
        this.updateData();
      });
    this.signalService.alertsOpen$
      .subscribe(() => {
        this.onClick();
      })
  }

  public updateData() {
    this.authService.currentUser$
      .map(usr => this.uid = usr['UID'])
      .filter(x => x != undefined)
      .flatMap(uid => this.ideasService.getIdeasList(uid, 'Bear'))
      .flatMap((res) => {
        this.holdingListId = res[2]['user_lists'][0]['list_id'];
        this.watchingListId = res[2]['user_lists'][1]['list_id'];
        this.bestBearsListId = res[0]['idea_lists'][0]['list_id'];
        return Observable.combineLatest(
          this.signalService.getAllAlerts({
            list_id: this.holdingListId,
            period: '2',
            uid: this.uid
          }),
          this.signalService.getAllAlerts({
            list_id: this.watchingListId,
            period: '2',
            uid: this.uid
          }),
          this.signalService.getSignalDataForList(this.bestBearsListId.toString(), '1', this.uid)
        )
      })
      .take(1)
      .subscribe(res => {
        this.holdingListAlerts = res[0]['EarningEstimate'].concat(res[0]['EarningSurprise'], res[0]['PGR'])
          .filter(this.assignPgrUrl.bind(this));
        this.watchingListAlerts = res[1]['EarningEstimate'].concat(res[1]['EarningSurprise'], res[1]['PGR'])
          .filter(this.assignPgrUrl.bind(this));
        this.bearListSignals = res[2].filter(x => {
          Object.assign(x, {pgr_url: this.signalService.appendPGRImage(x['pgrData'][0]['pgr_rating'], x['pgrData'][0]['raw_pgr_rating"'])});
          if (x['Signals'] === '[000000000100]') {
            return Object.assign(x, {signal_text: 'Rel. Strength Sell'});
          }
          if (x['Signals'] === '[000000010000]') {
            return Object.assign(x, {signal_text: 'Money Flow Sell'});
          }
          if (x['Signals'] === '[000000010100]') {
            return Object.assign(x, {signal_text: 'Rel. Strength & Money Flow Sell'});
          }
        }).filter(this.assignPgrUrl.bind(this));
        this.allItems = this.holdingListAlerts.length + this.watchingListAlerts.length + this.bearListSignals.length;
      })
  }

  assignPgrUrl(x) {
    if (x['Text'] == 'Estimate Revision' || x['Text'] == 'Earnings Surprise') {
      return Object.assign(x, {pgr_url: this.signalService.appendPGRImage(x['pgrRating'], x['rawPgrRating'])});
    }
    return Object.assign(x, {pgr_url: this.signalService.appendPGRImage(x['pgrData'][0]['pgr_rating'], x['pgrData'][0]['raw_pgr_rating']) });
  }

  gotoReport(ticker: string) {
    this.ideasService.selectedStock = ticker;
    this.router.navigate(['/report', ticker]);
  }

}

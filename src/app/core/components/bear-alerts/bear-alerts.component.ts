import {AfterViewInit, Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {SignalService} from '../../services/signal.service';
import {Subscription} from 'rxjs/Subscription';

import * as moment from 'moment';
import {AuthService} from '../../services/auth.service';
import {Subject} from 'rxjs/Subject';
import {IdeasService} from '../../services/ideas.service';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'cpt-bear-alerts',
  template: `
    <a class="quick-link">
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
      <span *ngIf="allItems?.length>0" class="badge badge-danger">{{ allItems?.length }}</span>
    </a>
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
            <span *ngIf="holdingListAlerts?.length==0">No Alerts.</span>
            <li *ngFor="let alert of this.holdingListAlerts" class="alert__entry row">
              <div class="col-4 alert__stock">
                <p class="ticker">
                  <img class="rating" src="./assets/imgs/arc_Bearish.svg">
                  <span>{{ alert['symbol'] }}</span>
                </p>
              </div>
              <div class="col-8 alert__info">
                <ul class="container container-fluid">
                  <li class="row no-gutters">
                    <!--<div class="col-1 alert__icon">-->
                    <!--<img src="./assets/imgs/icon_arrow&#45;&#45;down.svg">-->
                    <!--</div>-->
                    <div class="col-11">
                      <p class="alert__text">{{ alert['alert_text'] }}</p>
                      <p *ngIf="alert['alert_type'] == 'earnings_surprise_alerts'">Q{{ alert['quarter'] }} Est.
                        {{ alert['old_value'].toFixed(2) }} Act. <i class="fa fa-long-arrow-right" aria-hidden="true"></i> {{ alert['new_value'].toFixed(2) }}</p>
                    </div>
                  </li>
                </ul>
              </div>
            </li>

            <!--<li class="alert__entry row">-->
            <!--<div class="col-4 alert__stock">-->
            <!--<p class="ticker">-->
            <!--<img class="rating" src="./assets/imgs/arc_Bullish.svg">-->
            <!--<span>AMZN</span>-->
            <!--</p>-->
            <!--</div>-->
            <!--<div class="col-8 alert__info">-->
            <!--<ul class="container container-fluid">-->
            <!--<li class="row no-gutters">-->
            <!--<div class="col-1 alert__icon">-->
            <!--<img src="./assets/imgs/icon_arrow&#45;&#45;up.svg">-->
            <!--</div>-->
            <!--<div class="col-11">-->
            <!--<p class="alert__text">Bullish Earnings Surprise<br>Q2 Est. <b>$0.30</b> Act. <span-->
            <!--class="down-change"><i class="fa fa-long-arrow-right"-->
            <!--aria-hidden="true"></i> <b>$0.41</b></span></p>-->
            <!--</div>-->
            <!--</li>-->
            <!--</ul>-->
            <!--</div>-->
            <!--</li>-->

            <!--<li class="alert__entry row">-->
            <!--<div class="col-4 alert__stock">-->
            <!--<p class="ticker">-->
            <!--<img class="rating" src="./assets/imgs/arc_VeryBullish.svg">-->
            <!--<span>AAPL</span>-->
            <!--</p>-->
            <!--</div>-->
            <!--<div class="col-8 alert__info">-->
            <!--<ul class="container container-fluid">-->
            <!--<li class="row no-gutters">-->
            <!--<div class="col-1 alert__icon">-->
            <!--<img src="./assets/imgs/icon_arrow&#45;&#45;up.svg">-->
            <!--</div>-->
            <!--<div class="col-11">-->
            <!--<p class="alert__text">Estimate Revision<br>Q2: <b>$0.30</b> <span class="up-change"><i-->
            <!--class="fa fa-long-arrow-right" aria-hidden="true"></i> <b>$0.41</b></span></p>-->
            <!--</div>-->
            <!--</li>-->
            <!--<li class="row no-gutters">-->
            <!--<div class="col-1 alert__icon">-->
            <!--<img src="./assets/imgs/icon_arrow&#45;&#45;down.svg">-->
            <!--</div>-->
            <!--<div class="col-11">-->
            <!--<p class="alert__text">Bearish Earnings Surprise<br>Q2 Est. <b>$0.30</b> Act. <span-->
            <!--class="up-change"><i class="fa fa-long-arrow-right" aria-hidden="true"></i> <b>$0.41</b></span>-->
            <!--</p>-->
            <!--</div>-->
            <!--</li>-->
            <!--</ul>-->
            <!--</div>-->
            <!--</li>-->
          </ul>
        </div>

        <div class="alerts__section">
          <h4><i class="fa fa-binoculars" aria-hidden="true"></i> &nbsp;WATCHING</h4>
          <ul class="alerts__list container container-fluid">
            <span *ngIf="watchingListAlerts?.length==0">No Alerts.</span>
            <li *ngFor="let alert of watchingListAlerts" class="alert__entry row">
              <div class="col-4 alert__stock">
                <p class="ticker">
                  <img class="rating" src="./assets/imgs/arc_Bearish.svg">
                  <span>{{ alert['symbol'] }}</span>
                </p>
              </div>
              <div class="col-8 alert__info">
                <ul class="container container-fluid">
                  <li class="row no-gutters">
                    <!--<div class="col-1 alert__icon">-->
                    <!--<img src="./assets/imgs/icon_arrow&#45;&#45;down.svg">-->
                    <!--</div>-->
                    <div class="col-11">
                      <p class="alert__text">{{ alert['alert_text'] }}</p>
                      <p *ngIf="alert['alert_type'] == 'earnings_surprise_alerts'">Q{{ alert['quarter'] }} Est.
                        {{ alert['old_value'].toFixed(2) }} Act. <i class="fa fa-long-arrow-right" aria-hidden="true"></i> {{ alert['new_value'].toFixed(2) }}</p>
                    </div>
                  </li>
                </ul>
              </div>
            </li>

            <!--<li class="alert__entry row">-->
            <!--<div class="col-4 alert__stock">-->
            <!--<p class="ticker">-->
            <!--<img class="rating" src="./assets/imgs/arc_Bullish.svg">-->
            <!--<span>AMZN</span>-->
            <!--</p>-->
            <!--</div>-->
            <!--<div class="col-8 alert__info">-->
            <!--<ul class="container container-fluid">-->
            <!--<li class="row no-gutters">-->
            <!--<div class="col-1 alert__icon">-->
            <!--<img src="./assets/imgs/icon_arrow&#45;&#45;up.svg">-->
            <!--</div>-->
            <!--<div class="col-11">-->
            <!--<p class="alert__text">Bullish Earnings Surprise<br>Q2 Est. <b>$0.30</b> Act. <span-->
            <!--class="down-change"><i class="fa fa-long-arrow-right"-->
            <!--aria-hidden="true"></i> <b>$0.41</b></span></p>-->
            <!--</div>-->
            <!--</li>-->
            <!--</ul>-->
            <!--</div>-->
            <!--</li>-->

            <!--<li class="alert__entry row">-->
            <!--<div class="col-4 alert__stock">-->
            <!--<p class="ticker">-->
            <!--<img class="rating" src="./assets/imgs/arc_Bullish.svg">-->
            <!--<span>AMZN</span>-->
            <!--</p>-->
            <!--</div>-->
            <!--<div class="col-8 alert__info">-->
            <!--<ul class="container container-fluid">-->
            <!--<li class="row no-gutters">-->
            <!--<div class="col-1 alert__icon">-->
            <!--<img src="./assets/imgs/icon_arrow&#45;&#45;up.svg">-->
            <!--</div>-->
            <!--<div class="col-11">-->
            <!--<p class="alert__text">Bullish Earnings Surprise<br>Q2 Est. <b>$0.30</b> Act. <span-->
            <!--class="down-change"><i class="fa fa-long-arrow-right"-->
            <!--aria-hidden="true"></i> <b>$0.41</b></span></p>-->
            <!--</div>-->
            <!--</li>-->
            <!--</ul>-->
            <!--</div>-->
            <!--</li>-->

            <!--<li class="alert__entry row">-->
            <!--<div class="col-4 alert__stock">-->
            <!--<p class="ticker">-->
            <!--<img class="rating" src="./assets/imgs/arc_Bullish.svg">-->
            <!--<span>AMZN</span>-->
            <!--</p>-->
            <!--</div>-->
            <!--<div class="col-8 alert__info">-->
            <!--<ul class="container container-fluid">-->
            <!--<li class="row no-gutters">-->
            <!--<div class="col-1 alert__icon">-->
            <!--<img src="./assets/imgs/icon_arrow&#45;&#45;up.svg">-->
            <!--</div>-->
            <!--<div class="col-11">-->
            <!--<p class="alert__text">Bullish Earnings Surprise<br>Q2 Est. <b>$0.30</b> Act. <span-->
            <!--class="down-change"><i class="fa fa-long-arrow-right"-->
            <!--aria-hidden="true"></i> <b>$0.41</b></span></p>-->
            <!--</div>-->
            <!--</li>-->
            <!--</ul>-->
            <!--</div>-->
            <!--</li>-->

            <!--<li class="alert__entry row">-->
            <!--<div class="col-4 alert__stock">-->
            <!--<p class="ticker">-->
            <!--<img class="rating" src="./assets/imgs/arc_Bullish.svg">-->
            <!--<span>AMZN</span>-->
            <!--</p>-->
            <!--</div>-->
            <!--<div class="col-8 alert__info">-->
            <!--<ul class="container container-fluid">-->
            <!--<li class="row no-gutters">-->
            <!--<div class="col-1 alert__icon">-->
            <!--<img src="./assets/imgs/icon_arrow&#45;&#45;up.svg">-->
            <!--</div>-->
            <!--<div class="col-11">-->
            <!--<p class="alert__text">Bullish Earnings Surprise<br>Q2 Est. <b>$0.30</b> Act. <span-->
            <!--class="down-change"><i class="fa fa-long-arrow-right"-->
            <!--aria-hidden="true"></i> <b>$0.41</b></span></p>-->
            <!--</div>-->
            <!--</li>-->
            <!--</ul>-->
            <!--</div>-->
            <!--</li>-->

            <!--<li class="alert__entry row">-->
            <!--<div class="col-4 alert__stock">-->
            <!--<p class="ticker">-->
            <!--<img class="rating" src="./assets/imgs/arc_VeryBullish.svg">-->
            <!--<span>AAPL</span>-->
            <!--</p>-->
            <!--</div>-->
            <!--<div class="col-8 alert__info">-->
            <!--<ul class="container container-fluid">-->
            <!--<li class="row no-gutters">-->
            <!--<div class="col-1 alert__icon">-->
            <!--<img src="./assets/imgs/icon_arrow&#45;&#45;up.svg">-->
            <!--</div>-->
            <!--<div class="col-11">-->
            <!--<p class="alert__text">Estimate Revision<br>Q2: <b>$0.30</b> <span class="up-change"><i-->
            <!--class="fa fa-long-arrow-right" aria-hidden="true"></i> <b>$0.41</b></span></p>-->
            <!--</div>-->
            <!--</li>-->
            <!--<li class="row no-gutters">-->
            <!--<div class="col-1 alert__icon">-->
            <!--<img src="./assets/imgs/icon_arrow&#45;&#45;down.svg">-->
            <!--</div>-->
            <!--<div class="col-11">-->
            <!--<p class="alert__text">Bearish Earnings Surprise<br>Q2 Est. <b>$0.30</b> Act. <span-->
            <!--class="up-change"><i class="fa fa-long-arrow-right" aria-hidden="true"></i> <b>$0.41</b></span>-->
            <!--</p>-->
            <!--</div>-->
            <!--</li>-->
            <!--</ul>-->
            <!--</div>-->
            <!--</li>-->
          </ul>
        </div>

        <div class="alerts__section">
          <h4><i class="fa fa-lightbulb-o" aria-hidden="true"></i> &nbsp;BEST BEARS</h4>
          <ul class="alerts__list container container-fluid">

            <li class="alert__entry row">
              <div class="col-4 alert__stock">
                <p class="ticker">
                  <img class="rating" src="./assets/imgs/arc_Bearish.svg">
                  <span>GOOGL</span>
                </p>
              </div>
              <div class="col-8 alert__info">
                <ul class="container container-fluid">
                  <li class="row no-gutters">
                    <div class="col-1 alert__icon">
                      <img src="./assets/imgs/icon_arrow--down.svg">
                    </div>
                    <div class="col-11">
                      <p class="alert__text">Power Gauge Turned Very Bullish</p>
                    </div>
                  </li>
                </ul>
              </div>
            </li>

            <li class="alert__entry row">
              <div class="col-4 alert__stock">
                <p class="ticker">
                  <img class="rating" src="./assets/imgs/arc_VeryBullish.svg">
                  <span>AAPL</span>
                </p>
              </div>
              <div class="col-8 alert__info">
                <ul class="container container-fluid">
                  <li class="row no-gutters">
                    <div class="col-1 alert__icon">
                      <img src="./assets/imgs/icon_arrow--up.svg">
                    </div>
                    <div class="col-11">
                      <p class="alert__text">Estimate Revision<br>Q2: <b>$0.30</b> <span class="up-change"><i
                        class="fa fa-long-arrow-right" aria-hidden="true"></i> <b>$0.41</b></span></p>
                    </div>
                  </li>
                  <li class="row no-gutters">
                    <div class="col-1 alert__icon">
                      <img src="./assets/imgs/icon_arrow--down.svg">
                    </div>
                    <div class="col-11">
                      <p class="alert__text">Bearish Earnings Surprise<br>Q2 Est. <b>$0.30</b> Act. <span
                        class="up-change"><i class="fa fa-long-arrow-right" aria-hidden="true"></i> <b>$0.41</b></span>
                      </p>
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
export class BearAlertsComponent implements AfterViewInit {
  @ViewChild('nav') nav;

  @HostListener('click') onClick() {
    this.toggleNav(this.nav.nativeElement, '500px', true);
  }

  @HostListener('document:click', ['$event']) offClick(e: Event) {
    if (!this.el.nativeElement.contains(e.target)) this.toggleNav(this.nav.nativeElement, '0', false);
  }

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private uid: string;
  private holdingListId: number;
  private watchingListId: number;
  private bestBearsListId: number;

  public holdingListAlerts: object[];
  public watchingListAlerts: object[];
  public allItems = [];

  public alertList: Array<object>;
  public date: string;
  public alertCount: any = {
    downCount: null,
    upCount: null
  };
  public loading: Subscription;

  constructor(private el: ElementRef,
              private signalService: SignalService,
              private authService: AuthService,
              private ideasService: IdeasService) {
  }

  ngAfterViewInit() {
    this.updateData();
    this.ideasService.updateAlerts$
      .takeUntil(this.ngUnsubscribe)
      .subscribe(() => {
        this.allItems = [];
        this.updateData();
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
          this.signalService.getAlertsData({
            components: 'alerts',
            date: moment().format('YYYY-MM-DD'),
            startDate: moment().add(-1, 'day').format('YYYY-MM-DD'),
            endDate: moment().format('YYYY-MM-DD'),
            listId1: this.holdingListId,
          }),
          this.signalService.getAlertsData({
            components: 'alerts',
            date: moment().format('YYYY-MM-DD'),
            startDate: moment().add(-1, 'day').format('YYYY-MM-DD'),
            endDate: moment().format('YYYY-MM-DD'),
            listId1: this.watchingListId,
          }),
          this.signalService.getSignalDataForList(this.bestBearsListId.toString(), '1', this.uid)
        );
      })
      .take(1)
      .subscribe(res => {
        console.log('res', res);
        this.holdingListAlerts = this.parseAlertData(res[0]);
        this.watchingListAlerts = this.parseAlertData(res[1]);
        console.log('alerts:', this.holdingListAlerts, this.watchingListAlerts);
        // this.parseAlertData(res[0]);
      })
  }

  public toggleNav(el: HTMLElement, size: string, darken: boolean): void {
    el.style.width = size;
    if (darken === true) {
      document.getElementById('alerts-darken').style.visibility = 'visible';
    } else if (darken === false) {
      document.getElementById('alerts-darken').style.visibility = 'hidden';
    }
  }

  private parseAlertData(res) {
    this.alertCount.upCount = 0;
    this.alertCount.downCount = 0;
    let alertList = res['alerts'];
    let result = [];

    for (var key in alertList['earnings_surprise_alerts']) {
      for (var obj in alertList['earnings_surprise_alerts'][key]) {
        let jsonObj = {};
        jsonObj['symbol'] = obj;
        jsonObj['alert_type'] = 'earnings_surprise_alerts';
        jsonObj['alert_text'] = 'Earnings Surprise';
        jsonObj['quarter'] = alertList['earnings_surprise_alerts'][key][obj]['quarter'];
        jsonObj['pgr'] = this.calculatePGR(alertList['earnings_surprise_alerts'][key][obj]['data'][3]);
        jsonObj['new_value'] = alertList['earnings_surprise_alerts'][key][obj]['data'][0];
        jsonObj['old_value'] = alertList['earnings_surprise_alerts'][key][obj]['data'][1];
        jsonObj['per_change'] = alertList['earnings_surprise_alerts'][key][obj]['data'][2];
        this.allItems.push(jsonObj);
        result.push(jsonObj);
        if (jsonObj['per_change'] > 0) {
          this.alertCount.upCount++;
        } else if (jsonObj['per_change'] < 0) {
          this.alertCount.downCount++;
        } else {
        }
      }
    }
    for (var key in alertList['estimate_revision_alerts']) {
      for (var obj in alertList['estimate_revision_alerts'][key]) {
        let jsonObj = {};
        jsonObj['symbol'] = obj;
        jsonObj['alert_type'] = 'estimate_revision_alerts';
        jsonObj['alert_text'] = 'Estimate Revision';
        jsonObj['quarter'] = alertList['estimate_revision_alerts'][key][obj]['quarter'];
        jsonObj['pgr'] = this.calculatePGR(alertList['estimate_revision_alerts'][key][obj]['data'][3]);
        jsonObj['new_value'] = alertList['estimate_revision_alerts'][key][obj]['data'][0];
        jsonObj['old_value'] = alertList['estimate_revision_alerts'][key][obj]['data'][1];
        jsonObj['per_change'] = alertList['estimate_revision_alerts'][key][obj]['data'][2];
        this.allItems.push(jsonObj);
        result.push(jsonObj);
        if (jsonObj['per_change'] > 0) {
          this.alertCount.upCount++;
        } else {
          this.alertCount.downCount++;
        }
      }
    }

    if (alertList['pgr_change_alerts']['DataAvailable'] == true) {
      for (var key in alertList['pgr_change_alerts']) {
        if (key != 'DataAvailable') {
          for (var obj in alertList['pgr_change_alerts'][key]) {
            let jsonObj = {};
            jsonObj['symbol'] = obj;
            jsonObj['alert_type'] = 'pgr_change_alerts';
            jsonObj['alert_text'] = 'PGR Revision';
            jsonObj['pgr'] = this.calculatePGR(alertList['pgr_change_alerts'][key][obj]['corrected_pgr']);
            jsonObj['per_change'] = alertList['pgr_change_alerts'][key][obj]['chg_direction'];
            this.allItems.push(jsonObj);
            result.push(jsonObj);
            if (jsonObj['per_change'] > 0) {
              this.alertCount.upCount++;
            } else {
              this.alertCount.downCount++;
            }
          }
        }
      }
    }
    console.log('allItems', this.allItems);
    return result;
  }

  private calculatePGR(pgr) {
    if (pgr >= 0 && pgr < 15) {
      pgr = 1;
    } else if (pgr >= 15 && pgr < 29) {
      pgr = 2;
    } else if (pgr >= 29 && pgr < 59) {
      pgr = 3;
    } else if (pgr >= 59 && pgr < 85) {
      pgr = 4;
    } else if (pgr >= 85) {
      pgr = 5;
    } else {
      pgr = 0;
    }
    return pgr;
  }
}

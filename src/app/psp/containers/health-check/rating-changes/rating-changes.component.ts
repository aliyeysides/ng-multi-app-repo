import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {PGRChanges} from '../../../../shared/models/health-check';
import {Subject} from 'rxjs/Subject';
import {SignalService} from '../../../../services/signal.service';
import {HealthCheckService} from '../../../../services/health-check.service';
import {Router} from '@angular/router';

declare var gtag: Function;

@Component({
  selector: 'cpt-psp-rating-changes',
  template: `
    <div id="HC--Ratings-Changes" class="">

      <div class="row">
        <div class="col-12">
          <div class="divider__long" [ngClass]="{'divider__long--green': portUp, 'divider__long--red': !portUp}"></div>
        </div>
      </div>

      <div class="row section__toggle">
        <div class="col-12 toggle toggle--timespan">
        </div>
      </div>
      
      <div class="row">
        <div class="col-12">
          <h2><span class="hidden-sm-down">Power Gauge</span> Ratings Changes</h2>
        </div>
      </div>

      <div class="row no-gutters section__summary justify-content-center">
        <div class="col-6 col-md-5 col-lg-4 summary--left">
          <p><img src="./assets/imgs/icon_circle-change--green.svg">{{ bullishAlerts?.length }}</p>
        </div>
        <div class="col-6 col-md-5 col-lg-4 summary--right">
          <p><img src="./assets/imgs/icon_circle-change--red.svg">{{ bearishAlerts?.length }}</p>
        </div>
      </div> 

      <div *ngIf="!collapse" class="row">

        <div class="col-12 col-md-6">
          <div class="row" style="min-height:10px;">
            <div class="col-5"></div>
            <div class="col-2 hidden-md-up" style="padding: 0 10px;">
              <span class="icon__separator"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M312 96c0 13.255-10.745 24-24 24s-24-10.745-24-24 10.745-24 24-24 24 10.745 24 24zm224 224c0-13.255-10.745-24-24-24s-24 10.745-24 24 10.745 24 24 24 24-10.745 24-24zm-448 0c0-13.255-10.745-24-24-24s-24 10.745-24 24 10.745 24 24 24 24-10.745 24-24zm41.608-182.392c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24-10.745-24-24-24zm316.784 0c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24-10.745-24-24-24zm-71.337 19.812l-51.011 141.696C340.919 310.64 352 330.024 352 352c0 35.346-28.654 64-64 64s-64-28.654-64-64c0-37.481 32.145-67.19 69.932-63.716l51.013-141.704c2.992-8.312 12.155-12.625 20.475-9.635 8.313 2.993 12.627 12.16 9.635 20.475zM320 352c0-17.645-14.355-32-32-32s-32 14.355-32 32 14.355 32 32 32 32-14.355 32-32zm256-32c0 48.556-12.023 94.3-33.246 134.429A48.018 48.018 0 0 1 500.307 480H75.693a48.02 48.02 0 0 1-42.448-25.571C12.023 414.3 0 368.556 0 320 0 160.942 128.942 32 288 32s288 128.942 288 288zm-32 0c0-141.528-114.677-256-256-256C146.473 64 32 178.677 32 320c0 43.175 10.68 83.819 29.533 119.469A15.983 15.983 0 0 0 75.693 448h424.613a15.983 15.983 0 0 0 14.16-8.531C534.519 401.553 544 360.599 544 320z"/></svg></span></div>
            <div class="col-5"></div>
          </div>
          <h3>Turned Bullish</h3>
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
            <ng-container *ngIf="bullishAlerts.length">
              <li (click)="gotoReport(stock.symbol)" *ngFor="let stock of bullishAlerts" class="row list__entry">
                <div class="col-3 list-entry__pgr">
                  <img class="align-absolute"
                       src="{{ appendPGRImage(stock['corrected_pgr_rating'], stock['raw_pgr_rating']) }}">
                </div>
                <div class="col-3 list-entry__info">
                  <p class="ticker">{{ stock['symbol'] }}</p>
                  <p class="company">{{ stock['company'] }}</p>
                </div>
                <div class="col-3 list-entry__data">
                  <p class="data green">{{ stock['lastPrice'] | decimal }}</p>
                </div>
                <div class="col-3 list-entry__data">
                  <p class="data green">{{ stock['percentChange'] | decimal }}%</p>
                </div>
              </li>
            </ng-container>
            <ng-container *ngIf="!bullishAlerts.length">
              <p class="empty-chart">None.</p>
            </ng-container>
          </ul>
        </div>

        <div class="col-12 col-md-6">
          <div class="row" style="min-height:10px;">
            <div class="col-5"></div>
            <div class="col-2 hidden-md-up" style="padding: 0 10px;">
              <span class="icon__separator"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M312 96c0 13.255-10.745 24-24 24s-24-10.745-24-24 10.745-24 24-24 24 10.745 24 24zm224 224c0-13.255-10.745-24-24-24s-24 10.745-24 24 10.745 24 24 24 24-10.745 24-24zm-448 0c0-13.255-10.745-24-24-24s-24 10.745-24 24 10.745 24 24 24 24-10.745 24-24zm41.608-182.392c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24-10.745-24-24-24zm316.784 0c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24-10.745-24-24-24zm-71.337 19.812l-51.011 141.696C340.919 310.64 352 330.024 352 352c0 35.346-28.654 64-64 64s-64-28.654-64-64c0-37.481 32.145-67.19 69.932-63.716l51.013-141.704c2.992-8.312 12.155-12.625 20.475-9.635 8.313 2.993 12.627 12.16 9.635 20.475zM320 352c0-17.645-14.355-32-32-32s-32 14.355-32 32 14.355 32 32 32 32-14.355 32-32zm256-32c0 48.556-12.023 94.3-33.246 134.429A48.018 48.018 0 0 1 500.307 480H75.693a48.02 48.02 0 0 1-42.448-25.571C12.023 414.3 0 368.556 0 320 0 160.942 128.942 32 288 32s288 128.942 288 288zm-32 0c0-141.528-114.677-256-256-256C146.473 64 32 178.677 32 320c0 43.175 10.68 83.819 29.533 119.469A15.983 15.983 0 0 0 75.693 448h424.613a15.983 15.983 0 0 0 14.16-8.531C534.519 401.553 544 360.599 544 320z"/></svg></span></div>
            <div class="col-5"></div>
          </div>
          <h3>Turned Bearish</h3>
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
            <ng-container *ngIf="bearishAlerts.length">
              <li (click)="gotoReport(stock.symbol)" *ngFor="let stock of bearishAlerts" class="row list__entry">
                <div class="col-3 list-entry__pgr">
                  <img class="align-absolute"
                       src="{{ appendPGRImage(stock['corrected_pgr_rating'], stock['raw_pgr_rating']) }}">
                </div>
                <div class="col-3 list-entry__info">
                  <p class="ticker">{{ stock['symbol'] }}</p>
                  <p class="company">{{ stock['company'] }}</p>
                </div>
                <div class="col-3 list-entry__data">
                  <p class="data green">{{ stock['lastPrice'] | decimal }}</p>
                </div>
                <div class="col-3 list-entry__data">
                  <p class="data green">{{ stock['percentChange'] | decimal }}%</p>
                </div>
              </li>
            </ng-container>
            <ng-container *ngIf="!bearishAlerts.length">
              <p class="empty-chart">None.</p>
            </ng-container>
          </ul>
        </div>
      </div>

      <div class="row">
        <div *ngIf="!collapse" (click)="toggleCollapse()" class="col-12 expand-collapse">
          <img src="./assets/imgs/ux__collapse--circle.svg">
          <p>Collapse</p>
        </div>
        <div *ngIf="collapse" (click)="toggleCollapse()" class="col-12 expand-collapse">
          <img src="./assets/imgs/ux__expand--dots.svg">
          <p>Expand for detail</p>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="divider__long" [ngClass]="{'divider__long--green': portUp, 'divider__long--red': !portUp}"></div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['../health-check.component.scss']
})
export class RatingChangesComponent implements OnInit, OnDestroy {
  private _ngUnsubscribe: Subject<void> = new Subject<void>();
  private _alerts: BehaviorSubject<PGRChanges> = new BehaviorSubject<PGRChanges>({} as PGRChanges);

  @Input('alerts')
  set alerts(val: PGRChanges) {
    this._alerts.next(val);
  }

  get alerts() {
    return this._alerts.getValue();
  }

  bearishAlerts: Array<object> = [];
  bullishAlerts: Array<object> = [];
  collapse: boolean = true;
  portUp: boolean;

  constructor(private signalService: SignalService,
              private healthCheck: HealthCheckService,
              private router: Router) {
  }

  ngOnInit() {
    this._alerts
      .takeUntil(this._ngUnsubscribe)
      .filter(x => x != undefined)
      .subscribe(res => {
        this.parseAlerts(res);
      });

    this.healthCheck.getPortfolioStatus()
      .takeUntil(this._ngUnsubscribe)
      .subscribe(res => this.portUp = res['avgPercentageChange'] > 0);
  }

  ngOnDestroy() {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

  appendPGRImage(pgr, raw_pgr) {
    return this.signalService.appendPGRImage(pgr, raw_pgr);
  }

  toggleCollapse() {
    this.collapse = !this.collapse;
    gtag('event', 'rating_changes_collapse_clicked', {
      'event_category': 'engagement',
      'event_label': this.collapse
    });
  }

  gotoReport(ticker: string) {
    this.router.navigate(['stock-analysis', ticker]);
    gtag('event', 'stock_clicked', {
      'event_category': 'engagement',
      'event_label': ticker
    });
  }

  private parseAlerts(alerts: PGRChanges) {
    const keys = Object.keys(alerts);
    keys.forEach(key1 => {
      if (alerts['DataAvailable'] == true && key1 != 'DataAvailable') {
        Object.keys(alerts[key1]).forEach(key2 => {
          if (key2 == 'SymbolsTurnedBullish') {
            Object.keys(alerts[key1][key2]).forEach(ticker => {
              let obj = alerts[key1][key2][ticker];
              Object.assign(obj, {symbol: ticker});
              this.bullishAlerts.push(obj);
            })
          }
          if (key2 == 'SymbolsTurnedBearish') {
            Object.keys(alerts[key1][key2]).forEach(ticker => {
              let obj = alerts[key1][key2][ticker];
              Object.assign(obj, {symbol: ticker});
              this.bearishAlerts.push(obj);
            })
          }
        });
      }
    });
  }

}

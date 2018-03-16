import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {PGRChanges} from '../../../../shared/models/health-check';
import {Subject} from 'rxjs/Subject';
import {SignalService} from '../../../../services/signal.service';
import {HealthCheckService} from '../../../../services/health-check.service';
import {Router} from '@angular/router';
import {expandHeight} from '../../../../shared/animations/expandHeight';

declare var gtag: Function;

@Component({
  selector: 'cpt-psp-rating-changes',
  template: `
    <div id="HC--Ratings-Changes" class="">

      <div class="panel container">
      
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

        <div [@expandHeight]="collapse" class="row">

          <div class="col-12 col-md-6">
            <span class="icon__separator hidden-md-up">
              <i class="fal fa-tachometer-alt green"></i>
            </span>
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
            <span class="icon__separator hidden-md-up" style="margin-top:15px;">
              <i class="fal fa-tachometer-alt fa-flip-horizontal red"></i>
            </span>
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
          <div *ngIf="collapse!='closed'" (click)="collapse = 'closed'" class="col-12 expand-collapse">
            <i class="far fa-scrubber"></i>
            <p>Collapse</p>
          </div>
          <div *ngIf="collapse!='opened'" (click)="collapse = 'opened'" class="col-12 expand-collapse">
            <i class="far fa-ellipsis-h"></i>
            <p>Expand for detail</p>
          </div>
        </div>

      </div>
    </div>
  `,
  styleUrls: ['../health-check.component.scss'],
  animations: [expandHeight()]
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
  collapse: string = 'closed';
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

  gotoReport(ticker: string) {
    this.router.navigate(['stock-analysis', ticker]);
    gtag('event', 'stock_clicked', {
      'event_category': 'engagement',
      'event_label': ticker
    });
  }

  private parseAlerts(alerts: PGRChanges) {
    this.bearishAlerts = [];
    this.bullishAlerts = [];
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

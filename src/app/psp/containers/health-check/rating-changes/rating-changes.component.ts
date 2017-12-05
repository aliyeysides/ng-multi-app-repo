import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {PGRChanges} from '../../../../shared/models/health-check';
import {Subject} from 'rxjs/Subject';
import {SignalService} from '../../../../services/signal.service';
import {HealthCheckService} from '../../../../services/health-check.service';

@Component({
  selector: 'cpt-psp-rating-changes',
  template: `
    <div id="HC--Ratings-Changes" class="col-12 col-lg-8 col-xl-8 float-lg-right">

      <div class="row">
        <div class="col-12 hidden-md-up">
          <div class="divider__long" [ngClass]="{'divider__long--green': portUp, 'divider__long--red': !portUp}"></div>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <h2>Ratings Changes</h2>
        </div>
      </div>

      <div class="row section__summary">
        <div class="col-6 summary--left">
          <p><img src="./assets/imgs/icon_circle-change--green.svg">{{ bullishAlerts?.length }}</p>
        </div>
        <div class="col-6 summary--right">
          <p><img src="./assets/imgs/icon_circle-change--red.svg">{{ bearishAlerts?.length }}</p>
        </div>
      </div>

      <div *ngIf="!collapse" class="row">
        <div class="col-12 col-md-6">
          <h3><span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M168.5 84.2l148 146.8c4.7 4.7 4.7 12.3 0 17l-19.8 19.8c-4.7 4.7-12.3 4.7-17 0L160 149.3 40.3 267.8c-4.7 4.7-12.3 4.7-17 0L3.5 248c-4.7-4.7-4.7-12.3 0-17l148-146.8c4.7-4.7 12.3-4.7 17 0zm-17 160L3.5 391c-4.7 4.7-4.7 12.3 0 17l19.8 19.8c4.7 4.7 12.3 4.7 17 0L160 309.3l119.7 118.5c4.7 4.7 12.3 4.7 17 0l19.8-19.8c4.7-4.7 4.7-12.3 0-17l-148-146.8c-4.7-4.7-12.3-4.7-17 0z"/></svg></span>Turned Bullish</h3>
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
            <ng-container *ngIf="bullishAlerts.length">
              <li *ngFor="let stock of bullishAlerts" class="row list__entry">
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
                <div class="button__slide">
                  <img src="./assets/imgs/ui_slide.svg">
                </div>
              </li>
            </ng-container>
            <ng-container *ngIf="!bullishAlerts.length">
              <p>None.</p>
            </ng-container>
          </ul>
        </div>

        <div class="col-12 col-md-6">
          <h3><span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M151.5 427.8L3.5 281c-4.7-4.7-4.7-12.3 0-17l19.8-19.8c4.7-4.7 12.3-4.7 17 0L160 362.7l119.7-118.5c4.7-4.7 12.3-4.7 17 0l19.8 19.8c4.7 4.7 4.7 12.3 0 17l-148 146.8c-4.7 4.7-12.3 4.7-17 0zm17-160l148-146.8c4.7-4.7 4.7-12.3 0-17l-19.8-19.8c-4.7-4.7-12.3-4.7-17 0L160 202.7 40.3 84.2c-4.7-4.7-12.3-4.7-17 0L3.5 104c-4.7 4.7-4.7 12.3 0 17l148 146.8c4.7 4.7 12.3 4.7 17 0z"/></svg></span>Turned Bearish</h3>
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
            <ng-container *ngIf="bearishAlerts.length">
              <li *ngFor="let stock of bearishAlerts" class="row list__entry">
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
                <div class="button__slide">
                  <img src="./assets/imgs/ui_slide.svg">
                </div>
              </li>
            </ng-container>
            <ng-container *ngIf="!bearishAlerts.length">
              <p>None.</p>
            </ng-container>
          </ul>
        </div>
      </div>

      <div class="row">
        <div *ngIf="!collapse" (click)="toggleCollapse()" class="col-12 expand-collapse">
          <img src="./assets/imgs/icon_chevron--up.svg">
          <p>COLLAPSE</p>
        </div>
        <div *ngIf="collapse" (click)="toggleCollapse()" class="col-12 expand-collapse">
          <img src="./assets/imgs/icon_chevron--down.svg">
          <p>EXPAND</p>
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
  collapse: boolean = false;
  portUp: boolean;

  constructor(private signalService: SignalService,
              private healthCheck: HealthCheckService) {
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

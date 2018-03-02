import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {
  EarningsAnalystRevisions, EarningsReportSurprises,
  ExpectedEarningsReports
} from '../../../../shared/models/health-check';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subject} from 'rxjs/Subject';
import {SignalService} from '../../../../services/signal.service';
import {HealthCheckService} from '../../../../services/health-check.service';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {expandHeight} from '../../../../shared/animations/expandHeight';

declare var gtag: Function;

interface EarningsReportObj {
  symbol: string,
  curr: number,
  prev: number,
  diff: number,
  pgr: number
}

@Component({
  selector: 'cpt-psp-earnings-report',
  template: `
    <div id="HC--Earnings" class="">

      <div class="panel container">

        <div class="row">
          <div class="col-12">
            <h2>Earnings <span class="hidden-xs-down">Surprises &amp; Revisions</span></h2>
          </div>
        </div>

        <div class="row no-gutters section__summary justify-content-center">
          <div class="col-6 col-md-5 col-lg-4 summary--left">
            <p><img src="./assets/imgs/icon_circle-exclaimation--green.svg">{{ upCount }}</p>
          </div>
          <div class="col-6 col-md-5 col-lg-4 summary--right">
            <p><img src="./assets/imgs/icon_circle-exclaimation--red.svg">{{ downCount }}</p>
          </div>
        </div>

        <div [@expandHeight]="collapse" class="row justify-content-center">

          <div class="col-12 col-sm-8 col-md-6 col-xl-4">
            <div class="row justify-content-center" style="min-height:10px;">
              <div class="col-2 hidden-md-up">
                <span class="icon__separator"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="#ddd"><path
                  d="M400 64h-48V12c0-6.6-5.4-12-12-12h-8c-6.6 0-12 5.4-12 12v52H128V12c0-6.6-5.4-12-12-12h-8c-6.6 0-12 5.4-12 12v52H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48zM48 96h352c8.8 0 16 7.2 16 16v48H32v-48c0-8.8 7.2-16 16-16zm352 384H48c-8.8 0-16-7.2-16-16V192h384v272c0 8.8-7.2 16-16 16zM212.7 224h22.6c6.9 0 12.4 5.8 12 12.7l-6.7 120c-.4 6.4-5.6 11.3-12 11.3h-9.3c-6.4 0-11.6-5-12-11.3l-6.7-120c-.3-6.9 5.2-12.7 12.1-12.7zM252 416c0 15.5-12.5 28-28 28s-28-12.5-28-28 12.5-28 28-28 28 12.5 28 28z"/></svg></span>
              </div>
            </div>
            <h3>Earnings Surprises</h3>
            <ul class="section__chart">
              <li class="row no-gutters col-headers">
                <div class="col-3">
                  <p class="text-left" style="white-space:nowrap;">RATING / TICKER</p>
                </div>
                <div class="col-3">
                  <p>ACT</p>
                </div>
                <div class="col-3">
                  <p>EST</p>
                </div>
                <div class="col-3">
                  <p>DIFF</p>
                </div>
              </li>
              <ng-container *ngIf="allSurprises.length">
                <li (click)="gotoReport(item.symbol)" *ngFor="let item of allSurprises"
                    class="row no-gutters earnings__entry">
                  <div class="col-1 pgr">
                    <img class="align-absolute" src="{{ appendPGRImage(item.pgr, item.raw_pgr) }}">
                  </div>
                  <div class="col-2 ticker">
                    <p>{{ item.symbol }}</p>
                  </div>
                  <div class="col-3 data">
                    <p>{{ item.curr }}</p>
                  </div>
                  <div class="col-3 data">
                    <p>{{ item.prev }}</p>
                  </div>
                  <div class="col-3 data">
                    <p [ngClass]="{'green':item.diff>0,'red':item.diff<0}">{{ item.diff | decimal }}%</p>
                  </div>
                </li>
              </ng-container>
              <ng-container *ngIf="!allSurprises.length">
                <p class="empty-chart">No Surprises.</p>
              </ng-container>
            </ul>
          </div>

          <div class="col-12 col-sm-8 col-md-6 col-xl-4">
            <div class="row justify-content-center" style="min-height:10px;">
              <div class="col-2 hidden-md-up">
                <span class="icon__separator"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="#ddd"><path
                  d="M400 64h-48V12c0-6.6-5.4-12-12-12h-8c-6.6 0-12 5.4-12 12v52H128V12c0-6.6-5.4-12-12-12h-8c-6.6 0-12 5.4-12 12v52H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48zM48 96h352c8.8 0 16 7.2 16 16v48H32v-48c0-8.8 7.2-16 16-16zm352 384H48c-8.8 0-16-7.2-16-16V192h384v272c0 8.8-7.2 16-16 16zM255.7 269.7l34.6 34.6c2.1 2.1 2.1 5.4 0 7.4L159.1 442.9l-35.1 5c-6.9 1-12.9-4.9-11.9-11.9l5-35.1 131.2-131.2c2-2 5.4-2 7.4 0zm75.2 1.4l-19.2 19.2c-2.1 2.1-5.4 2.1-7.4 0l-34.6-34.6c-2.1-2.1-2.1-5.4 0-7.4l19.2-19.2c6.8-6.8 17.9-6.8 24.7 0l17.3 17.3c6.8 6.8 6.8 17.9 0 24.7z"/></svg></span>
              </div>
            </div>
            <h3>Estimate Revisions</h3>
            <ul class="section__chart">
              <li class="row no-gutters col-headers">
                <div class="col-3">
                  <p class="text-left" style="white-space:nowrap;">RATING / TICKER</p>
                </div>
                <div class="col-3">
                  <p>CURR</p>
                </div>
                <div class="col-3">
                  <p>PREV</p>
                </div>
                <div class="col-3">
                  <p>DIFF</p>
                </div>
              </li>
              <ng-container *ngIf="allRevisions.length">
                <li (click)="gotoReport(item.symbol)" *ngFor="let item of allRevisions"
                    class="row no-gutters earnings__entry">
                  <div class="col-1 pgr">
                    <img class="align-absolute" src="{{ appendPGRImage(item.pgr, item.raw_pgr) }}">
                  </div>
                  <div class="col-2 ticker">
                    <p>{{ item.symbol }}</p>
                  </div>
                  <div class="col-3 data">
                    <p>{{ item.curr }}</p>
                  </div>
                  <div class="col-3 data">
                    <p>{{ item.prev }}</p>
                  </div>
                  <div class="col-3 data">
                    <p [ngClass]="{'green':item.diff>0,'red':item.diff<0}">{{ item.diff | decimal }}%</p>
                  </div>
                </li>
              </ng-container>
              <ng-container *ngIf="!allRevisions.length">
                <p class="empty-chart">No Revisions.</p>
              </ng-container>
            </ul>
          </div>

          <div class="col-12 col-sm-10 col-xl-4">
            <cpt-psp-reporting-calendar [data]="expected"></cpt-psp-reporting-calendar>
          </div>
        </div>

        <div class="row">
          <div *ngIf="collapse!='closed'" (click)="collapse = 'closed'" class="col-12 expand-collapse">
            <img src="./assets/imgs/ux__collapse--circle.svg">
            <p>Collapse</p>
          </div>
          <div *ngIf="collapse!='opened'" (click)="collapse = 'opened'" class="col-12 expand-collapse">
            <img src="./assets/imgs/ux__expand--dots.svg">
            <p>Expand for detail</p>
          </div>
        </div>

      </div>
    </div>
  `,
  styleUrls: ['../health-check.component.scss'],
  animations: [expandHeight()]
})
export class EarningsReportComponent implements OnInit, OnDestroy {
  private _ngUnsubsribe: Subject<void> = new Subject<void>();
  private _surprises: BehaviorSubject<EarningsReportSurprises> = new BehaviorSubject<EarningsReportSurprises>({} as EarningsReportSurprises);
  private _revisions: BehaviorSubject<EarningsAnalystRevisions> = new BehaviorSubject<EarningsAnalystRevisions>({} as EarningsAnalystRevisions);

  public allSurprises: object[] = [];
  public allRevisions: object[] = [];

  public upCount: number = 0;
  public downCount: number = 0;
  public collapse: string = 'closed';
  public portUp: boolean;

  @Input('surprises')
  set surprises(val: EarningsReportSurprises) {
    this._surprises.next(val);
  }

  get surprises() {
    return this._surprises.getValue();
  }

  @Input('revisions')
  set revisions(val: EarningsAnalystRevisions) {
    this._revisions.next(val);
  }

  get revisions() {
    return this._revisions.getValue();
  }

  @Input('expected') expected: ExpectedEarningsReports;

  constructor(private signalService: SignalService,
              private healthCheck: HealthCheckService,
              private router: Router) {
  }

  ngOnInit() {
    Observable.zip(this._surprises, this._revisions)
      .takeUntil(this._ngUnsubsribe)
      .filter(x => x[0] != undefined && x[1] != undefined)
      .subscribe(([sups, revs]) => {
        this.upCount = 0;
        this.downCount = 0;
        this.allSurprises = this.earningsReportObjFactory(sups);
        this.allRevisions = this.earningsReportObjFactory(revs);
      });

    this.healthCheck.getPortfolioStatus()
      .takeUntil(this._ngUnsubsribe)
      .subscribe(res => this.portUp = res['avgPercentageChange'] > 0)
  }

  ngOnDestroy() {
    this._ngUnsubsribe.next();
    this._ngUnsubsribe.complete();
  }

  appendPGRUrl(pgr: number) {
    return this.signalService.calculatePGR(pgr)
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

  earningsReportObjFactory(res: EarningsReportSurprises | EarningsAnalystRevisions): Array<EarningsReportObj> {
    let result = [];
    Object.keys(res).forEach(key1 => {
      Object.keys(res[key1]).forEach(key2 => {
        let obj = Object.assign({}, {
          symbol: key2,
          curr: res[key1][key2][0],
          prev: res[key1][key2][1],
          diff: res[key1][key2][2],
          pgr: this.appendPGRUrl(res[key1][key2][3]),
          raw_pgr: this.appendPGRUrl(res[key1][key2][4])
        });
        result.push(obj);
        obj.diff > 0 ? this.upCount++ : this.downCount++;
      });
    });
    return result;
  }

}

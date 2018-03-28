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
            <span class="icon__separator hidden-md-up">
              <i class="fal fa-calendar-exclamation ux-blue"></i>
            </span>
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
            <span class="icon__separator hidden-md-up">
              <i class="fal fa-calendar-edit ux-blue"></i>
            </span>
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

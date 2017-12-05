import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {
  EarningsAnalystRevisions, EarningsReportSurprises,
  ExpectedEarningsReports
} from '../../../../shared/models/health-check';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subject} from 'rxjs/Subject';
import {SignalService} from '../../../../services/signal.service';
import {HealthCheckService} from '../../../../services/health-check.service';

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
    <div id="HC--Earnings" class="col-12 col-lg-8 col-xl-8 float-lg-right">

      <div class="row">
        <div class="col-12">
          <h2>Earnings Reports</h2>
        </div>
      </div>

      <div class="row section__summary">
        <div class="col-6 summary--left">
          <p><img src="./assets/imgs/icon_circle-earnings--green.svg">{{ upCount }}</p>
        </div>
        <div class="col-6 summary--right">
          <p><img src="./assets/imgs/icon_circle-earnings--red.svg">{{ downCount }}</p>
        </div>
      </div>

      <div *ngIf="!collapse" class="row">
        <div class="col-12 col-md-6">
          <h3 class=""><span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M188.6 212.7l6.5 104c.4 6.3 5.6 11.3 12 11.3h33.8c6.3 0 11.6-4.9 12-11.3l6.5-104c.4-6.9-5.1-12.7-12-12.7h-46.8c-6.9 0-12.4 5.8-12 12.7zM264 384c0 22.1-17.9 40-40 40s-40-17.9-40-40 17.9-40 40-40 40 17.9 40 40zM400 64h-48V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H160V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V160h352v298c0 3.3-2.7 6-6 6z"/></svg></span>Earnings Surprises</h3>
          <div class="divider__long"></div>
          <ul class="section__chart">
            <li class="row no-gutters col-headers">
              <div class="col-3">
                <p class="text-left">RATING / TICKER</p>
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
              <li *ngFor="let item of allSurprises" class="row no-gutters earnings__entry">
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
              <p>No Surprises.</p>
            </ng-container>
          </ul>
        </div>

        <div class="col-12 col-md-6">
          <h3 class=""><span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M243.1 234.1l46.8 46.8c2 2 2 5.2 0 7.2L175.4 402.6l-48.2 5.4c-6.4.7-11.9-4.7-11.2-11.2l5.4-48.2 114.5-114.5c2-2 5.2-2 7.2 0zm83-10.8l-25.4-25.4c-7.9-7.9-20.7-7.9-28.6 0l-19.5 19.5c-2 2-2 5.2 0 7.2l46.8 46.8c2 2 5.2 2 7.2 0l19.5-19.5c7.9-7.9 7.9-20.7 0-28.6zM448 112v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h48V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h128V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h48c26.5 0 48 21.5 48 48zm-48 346V160H48v298c0 3.3 2.7 6 6 6h340c3.3 0 6-2.7 6-6z"/></svg></span> Estimate Revisions</h3>
          <div class="divider__long"></div>
          <ul class="section__chart">
            <li class="row no-gutters col-headers">
              <div class="col-3">
                <p class="text-left">RATING / TICKER</p>
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
              <li *ngFor="let item of allRevisions" class="row no-gutters earnings__entry">
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
              <p>No Revisions.</p>
            </ng-container>
          </ul>
        </div>

        <div class="col-12">
          <cpt-psp-reporting-calendar [data]="expected"></cpt-psp-reporting-calendar>
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
export class EarningsReportComponent implements OnInit, OnDestroy {
  private _ngUnsubsribe: Subject<void> = new Subject<void>();
  private _surprises: BehaviorSubject<EarningsReportSurprises> = new BehaviorSubject<EarningsReportSurprises>({} as EarningsReportSurprises);
  private _revisions: BehaviorSubject<EarningsAnalystRevisions> = new BehaviorSubject<EarningsAnalystRevisions>({} as EarningsAnalystRevisions);

  public allSurprises: object[] = [];
  public allRevisions: object[] = [];

  public upCount: number = 0;
  public downCount: number = 0;
  public collapse: boolean = false;
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

  constructor(private signalSerivce: SignalService,
              private healthCheck: HealthCheckService) {
  }

  ngOnInit() {
    this._surprises
      .takeUntil(this._ngUnsubsribe)
      .filter(x => x != undefined)
      .subscribe(res => {
        this.allSurprises = this.earningsReportObjFactory(res);
      });

    this._revisions
      .takeUntil(this._ngUnsubsribe)
      .filter(x => x != undefined)
      .subscribe(res => {
        this.allRevisions = this.earningsReportObjFactory(res);
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
    return this.signalSerivce.calculatePGR(pgr)
  }

  appendPGRImage(pgr, raw_pgr) {
    return this.signalSerivce.appendPGRImage(pgr, raw_pgr);
  }

  toggleCollapse() {
    this.collapse = !this.collapse;
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

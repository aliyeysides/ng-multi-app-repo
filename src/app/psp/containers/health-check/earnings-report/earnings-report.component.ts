import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {EarningsAnalystRevisions, EarningsReportSurprises} from '../../../../shared/models/health-check';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subject} from 'rxjs/Subject';
import {SignalService} from '../../../../services/signal.service';

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

      <div class="row">
        <div class="col-12 col-md-6">
          <h3 class="">Earnings Surprises</h3>
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
                  <p [ngClass]="{'green':item.diff>0,'red':item.diff<0}">{{ item.diff }}%</p>
                </div>
              </li>
            </ng-container>
            <ng-container *ngIf="!allSurprises.length">
              <p>No Surprises.</p>
            </ng-container>
          </ul>
        </div>

        <div class="col-12 col-md-6">
          <h3 class="">Estimate Revisions</h3>
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
                  <img class="align-absolute" src="{{ appendPGRImage(item.pgr) }}">
                </div>
                <div class="col-2 ticker">
                  <p>{{ item.symbol }}</p>
                </div>
                <div class="col-3 data">
                  <p>{{ item.curr }}</p>
                </div>
                <div class="col-3 data">
                  <p>{{ item.prev }}%</p>
                </div>
                <div class="col-3 data">
                  <p [ngClass]="{'green':item.diff>0,'red':item.diff<0}">{{ item.diff }}%</p>
                </div>
              </li>
            </ng-container>
            <ng-container *ngIf="!allRevisions.length">
              <p>No Revisions.</p>
            </ng-container>
          </ul>
        </div>

        <div class="col-12">
          <cpt-psp-reporting-calendar></cpt-psp-reporting-calendar>
        </div>
      </div>

      <div class="row">
        <div class="col-12 expand-collapse">
          <img src="./assets/imgs/icon_chevron--up.svg">
          <p>COLLAPSE</p>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="divider__long divider__long--green"></div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['../health-check.component.scss']
})
export class EarningsReportComponent implements OnInit, OnDestroy {
  private ngUnsubsribe: Subject<void> = new Subject<void>();
  private _surprises: BehaviorSubject<EarningsReportSurprises> = new BehaviorSubject<EarningsReportSurprises>({} as EarningsReportSurprises);
  private _revisions: BehaviorSubject<EarningsAnalystRevisions> = new BehaviorSubject<EarningsAnalystRevisions>({} as EarningsAnalystRevisions);

  public allSurprises: object[] = [];
  public allRevisions: object[] = [];

  public upCount: number = 0;
  public downCount: number = 0;

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

  constructor(private signalSerivce: SignalService) {
  }

  ngOnInit() {
    this._surprises
      .takeUntil(this.ngUnsubsribe)
      .filter(x => x != undefined)
      .subscribe(res => {
        this.allSurprises = this.earningsReportObjFactory(res);
      });

    this._revisions
      .takeUntil(this.ngUnsubsribe)
      .filter(x => x != undefined)
      .subscribe(res => {
        this.allRevisions = this.earningsReportObjFactory(res);
      });
  }

  ngOnDestroy() {
    this.ngUnsubsribe.next();
    this.ngUnsubsribe.complete();
  }

  appendPGRUrl(pgr: number) {
    return this.signalSerivce.calculatePGR(pgr)
  }

  appendPGRImage(pgr, raw_pgr) {
    return this.signalSerivce.appendPGRImage(pgr, raw_pgr);
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

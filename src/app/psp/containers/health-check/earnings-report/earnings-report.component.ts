import {Component, Input, OnInit} from '@angular/core';
import {EarningsAnalystRevisions, EarningsReportSurprises} from '../../../../shared/models/health-check';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subject} from 'rxjs/Subject';
import {SignalService} from '../../../../services/signal.service';

@Component({
  selector: 'cpt-psp-earnings-report',
  template: `
    <div class="col-12 col-lg-8 col-xl-8 section section--earningsreports">

      <div class="row section__header">
        <div class="col-12">
          <h2>Earnings Reports</h2>
        </div>
      </div>

      <div class="row section__summary">
        <div class="col-6 summary--left">
          <p><img src="./assets/imgs/icon_circle-earnings--green.svg">3</p>
        </div>
        <div class="col-6 summary--right">
          <p><img src="./assets/imgs/icon_circle-earnings--red.svg">2</p>
        </div>
      </div>

      <div class="row">
        <div class="col-12 col-md-6 section__contents">
          <h3 class="ux-blue">Earnings Surprises</h3>
          <div class="divider"></div>
          <ul class="section__chart">
            <li class="row no-gutters col-headers">
              <div class="col-3">
                <p>TICKER</p>
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
            <li class="row no-gutters earnings__entry">
              <div class="col-1 pgr">
                <img class="align-middle" src="./assets/imgs/arc_Bullish.svg">
              </div>
              <div class="col-2 ticker">
                <p>PGR</p>
              </div>
              <div class="col-3 data">
                <p>99.40</p>
              </div>
              <div class="col-3 data">
                <p>3.12%</p>
              </div>
              <div class="col-3 data">
                <p class="green">3.12%</p>
              </div>
            </li>
            <li class="row no-gutters earnings__entry">
              <div class="col-1 pgr">
                <img class="align-middle" src="./assets/imgs/arc_VeryBearish.svg">
              </div>
              <div class="col-2 ticker">
                <p class="">KPMG</p>
              </div>
              <div class="col-3 data">
                <p>99.40</p>
              </div>
              <div class="col-3 data">
                <p>3.12%</p>
              </div>
              <div class="col-3 data">
                <p class="green">3.12%</p>
              </div>
            </li>
            <li class="row no-gutters earnings__entry">
              <div class="col-1 pgr">
                <img class="align-middle" src="./assets/imgs/arc_Bearish.svg">
              </div>
              <div class="col-2 ticker">
                <p>SHOP</p>
              </div>
              <div class="col-3 data">
                <p>99.40</p>
              </div>
              <div class="col-3 data">
                <p>3.12%</p>
              </div>
              <div class="col-3 data">
                <p class="green">3.12%</p>
              </div>
            </li>
          </ul>
        </div>

        <div class="col-12 col-md-6 section__contents">
          <h3 class="ux-blue">Estimate Revisions</h3>
          <div class="divider"></div>
          <ul class="section__chart">
            <li class="row no-gutters col-headers">
              <div class="col-3">
                <p>TICKER</p>
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
            <li class="row no-gutters earnings__entry">
              <div class="col-1 pgr">
                <img class="align-middle" src="./assets/imgs/arc_VeryBullish.svg">
              </div>
              <div class="col-2 ticker">
                <p>SHOP</p>
              </div>
              <div class="col-3 data">
                <p>99.40</p>
              </div>
              <div class="col-3 data">
                <p>3.12%</p>
              </div>
              <div class="col-3 data">
                <p class="green">3.12%</p>
              </div>
            </li>
            <li class="row no-gutters earnings__entry">
              <div class="col-1 pgr">
                <img class="align-middle" src="./assets/imgs/arc_VeryBullish.svg">
              </div>
              <div class="col-2 ticker">
                <p class="">SHOP</p>
              </div>
              <div class="col-3 data">
                <p>99.40</p>
              </div>
              <div class="col-3 data">
                <p>3.12%</p>
              </div>
              <div class="col-3 data">
                <p class="green">3.12%</p>
              </div>
            </li>
            <li class="row no-gutters earnings__entry">
              <div class="col-1 pgr">
                <img class="align-middle" src="./assets/imgs/arc_VeryBullish.svg">
              </div>
              <div class="col-2 ticker">
                <p>SHOP</p>
              </div>
              <div class="col-3 data">
                <p>99.40</p>
              </div>
              <div class="col-3 data">
                <p>3.12%</p>
              </div>
              <div class="col-3 data">
                <p class="green">3.12%</p>
              </div>
            </li>
          </ul>
        </div>

        <div class="col-12 section__chart">
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
export class EarningsReportComponent implements OnInit {
  private ngUnsubsribe: Subject<void> = new Subject<void>();
  private _surprises: BehaviorSubject<EarningsReportSurprises> = new BehaviorSubject<EarningsReportSurprises>({} as EarningsReportSurprises);
  private _revisions: BehaviorSubject<EarningsAnalystRevisions> = new BehaviorSubject<EarningsAnalystRevisions>({} as EarningsAnalystRevisions);

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
      .subscribe(res => console.log('surprises', res));

    this._revisions
      .takeUntil(this.ngUnsubsribe)
      .subscribe(res => console.log('revisions', res));
  }

  appendPGRUrl(pgr: number) {
    return this.signalSerivce.calculatePGR(pgr)
  }

}

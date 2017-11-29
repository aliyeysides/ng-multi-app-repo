import {Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {ChaikinCalculations, PortfolioStatus, PrognosisData} from '../../../../shared/models/health-check';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'cpt-psp-portfolio-overview',
  template: `
    <div class="col-12 col-lg-8 col-xl-8 section section--overview">
      <div class="row overview__header">
        <div class="col-12">
          <p>My Stock List 1</p>
        </div>
      </div>

      <div class="row no-gutters overview__summary">
        <div class="col-12">
          <p class="data"><sub>+</sub>3.04<sub>%</sub></p>
        </div>
        <div class="col-12">
          <p>as compared to the <span class="market">S&amp;P 500</span>, currently <span class="market--change">up +0.13%</span></p>
        </div>
      </div>

      <div class="row overview__powerbar">
        <div class="col-12">
          <p class="label">Chaikin Power Bar <a> <i class="fa fa-info-circle" aria-hidden="true"></i></a></p>
        </div>
        <div class="col-12 powerbar clearfix">
          <div class="bullish">
            <p>{{ prognosisData?.BullishSymbolsCount }}</p>
          </div>
          <div class="neutral">
            <p>{{ prognosisData?.NeutralSymbolsCount }}</p>
          </div>
          <div class="bearish">
            <p>{{ prognosisData?.BearishSymbolsCount }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['../health-check.component.scss']
})
export class PortfolioOverviewComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private _data: BehaviorSubject<PrognosisData> = new BehaviorSubject<PrognosisData>({} as PrognosisData);
  private _calc: BehaviorSubject<ChaikinCalculations> = new BehaviorSubject<ChaikinCalculations>({} as ChaikinCalculations);

  @Input('data')
  set data(val: PrognosisData) {
    this._data.next(val);
  }

  get data() {
    return this._data.getValue();
  }

  @Input('calc')
  set calc(val: ChaikinCalculations) {
    this._calc.next(val);
  }

  get calc() {
    return this._calc.getValue();
  }

  prognosisData: PrognosisData;
  calculations: ChaikinCalculations;

  constructor() {
  }

  ngOnInit() {
    this._data
      .takeUntil(this.ngUnsubscribe)
      .subscribe(res => this.prognosisData = res);

    this._calc
      .takeUntil(this.ngUnsubscribe)
      .subscribe(res => this.calculations = res);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}

import {Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {ChaikinCalculations, PortfolioStatus, PrognosisData} from '../../../../shared/models/health-check';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'cpt-psp-portfolio-overview',
  template: `
    <div class="col-12 col-lg-8 col-xl-8 section section--overview">
      <div class="row">
        <div class="col-12">
          <div class="divider__long"></div>
        </div>
      </div>

      <div class="row no-gutters overview__summary">
        <div class="col-12 col-md-5 portfolio">
          <div class="row no-gutters">
            <div class="col-5">
              <p class="list">My Stock list 1</p>
              <p class="label">You</p>
            </div>
            <div class="col-7">
              <p class="data green"><sub>+</sub>3.04<sub>%</sub></p>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-2 vs-divider my-auto">
          <div class="row no-gutters">
            <div class="col-3 hidden-md-up">
            </div>
            <div class="col-2  hidden-md-up">
              <div class="divider__split align-absolute"></div>
            </div>
            <div class="col-2 col-md-12">
              <p class="divider__text">vs</p>
            </div>
            <div class="col-2 hidden-md-up">
              <div class="divider__split align-absolute"></div>
            </div>
            <div class="col-3 hidden-md-up">
            </div>
          </div>
        </div>

        <div class="col-12 col-md-5 market">
          <div class="row no-gutters">
            <div class="col-5">
              <p class="list">S&amp;P 500</p>
              <p class="label">Market</p>
            </div>
            <div class="col-7">
              <p class="data red"><sub>-</sub>1.25<sub>%</sub></p>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="divider__long"></div>
        </div>
      </div>

      <div class="row overview__powerbar">
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
        <div class="col-12">
          <p class="label">Chaikin Power Bar <a><i class="fa fa-info-circle" aria-hidden="true"></i></a></p>
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

import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {PortfolioStatus, PrognosisData} from '../../../../shared/models/health-check';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'cpt-psp-portfolio-overview',
  template: `
    <div class="col-12 col-lg-8 col-xl-8 section section--overview" [ngClass]="{
    'section--overview--green': calculations?.avgPercentageChange > 0,
    'section--overview--red': calculations?.avgPercentageChange < 0}">
      <div class="row overview__header">
        <div class="col-12">
          <p>My Stock List 1</p>
        </div>
      </div>

      <div class="row no-gutters overview__summary">
        <div class="col-12">
          <p class="data"><sub><span
            *ngIf="isPortUp()">+</span></sub>{{ calculations?.avgPercentageChange | number:'.2-2' }}<sub>%</sub></p>
        </div>
        <div class="col-12">
          <p>as compared to the <span class="market">S&amp;P 500</span>, currently
            <span class="market--change"> 
              <span *ngIf="isSPYUp()">up +</span>
              <span *ngIf="!isSPYUp()">down</span>{{ calculations?.SPYPercentageChange | number:'.2-2' }}%
            </span>
          </p>
        </div>
      </div>

      <div class="row overview__powerbar">
        <div class="col-12">
          <p class="label">Chaikin Power Bar <a> <i class="fa fa-info-circle" aria-hidden="true"></i></a></p>
        </div>
        <div class="col-12 powerbar clearfix">
          <div
            [ngClass]="{'bullish--more':prognosisData?.BullishSymbolsCount>prognosisData?.BearishSymbolsCount, 'bullish--less':prognosisData?.BullishSymbolsCount<prognosisData?.BearishSymbolsCount,'bullish--same':prognosisData?.BullishSymbolsCount==prognosisData?.BearishSymbolsCount}">
            <p>{{ prognosisData?.BullishSymbolsCount }}</p>
          </div>
          <div class="neutral">
            <p>{{ prognosisData?.NeutralSymbolsCount }}</p>
          </div>
          <div
            [ngClass]="{'bearish--more':prognosisData?.BearishSymbolsCount>prognosisData?.BullishSymbolsCount, 'bearish--less':prognosisData?.BearishSymbolsCount<prognosisData?.BullishSymbolsCount,'bearish--same':prognosisData?.BearishSymbolsCount==prognosisData?.BullishSymbolsCount}">
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
  private _calc: BehaviorSubject<PortfolioStatus> = new BehaviorSubject<PortfolioStatus>({} as PortfolioStatus);

  @Input('data')
  set data(val: PrognosisData) {
    this._data.next(val);
  }

  get data() {
    return this._data.getValue();
  }

  @Input('calc')
  set calc(val: PortfolioStatus) {
    this._calc.next(val);
  }

  get calc() {
    return this._calc.getValue();
  }

  prognosisData: PrognosisData;
  calculations: PortfolioStatus;

  constructor() {
  }

  ngOnInit() {
    this._data
      .takeUntil(this.ngUnsubscribe)
      .subscribe(res => this.prognosisData = res);

    this._calc
      .takeUntil(this.ngUnsubscribe)
      .subscribe(res => {
        this.calculations = res;
        console.log('calculations', res)
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  isPortUp(): boolean {
    return this.calculations ? this.calculations.avgPercentageChange > 0 : null;
  }

  isSPYUp(): boolean {
    return this.calculations ? this.calculations.SPYPercentageChange > 0 : null;
  }

}

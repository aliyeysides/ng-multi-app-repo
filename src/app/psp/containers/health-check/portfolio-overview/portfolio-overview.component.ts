import {Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {PortfolioStatus} from '../../../../shared/models/health-check';
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
            <p>9</p>
          </div>
          <div class="neutral">
            <p>3</p>
          </div>
          <div class="bearish">
            <p>4</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['../health-check.component.scss']
})
export class PortfolioOverviewComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private _status: BehaviorSubject<PortfolioStatus> = new BehaviorSubject<PortfolioStatus>({} as PortfolioStatus);
  @Input('status')
  set status(val: PortfolioStatus) {
    this._status.next(val);
  }

  get status() {
    return this._status.getValue();
  }

  constructor() {
  }

  ngOnInit() {
    this._status
      .takeUntil(this.ngUnsubscribe)
      .subscribe()
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}

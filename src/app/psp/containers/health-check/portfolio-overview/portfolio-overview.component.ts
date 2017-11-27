import {Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {PortfolioStatus} from '../../../../shared/models/health-check';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'cpt-psp-portfolio-overview',
  template: `
    <div class="col-12 col-md-7 col-lg-8 section section--overview">

      <div class="row no-gutters">
        <div class="col-12">
          <h4>My Stock List</h4>
        </div>
      </div>

      <div class="row no-gutters row--overview">
        <div class="col-12 col-md-4">
          <p class="">Last week, your stocks were&hellip;</p>
        </div>
        <div class="col-12 col-md-4">
          <p class="data green"><sub>up</sub> 3.04<sub>%</sub></p>
        </div>
        <div class="col-12 col-md-4">
          <p>compared to the <span class="blue">S&amp;P 500</span> &mdash; <span class="up-change">up 0.13%</span></p>
        </div>
        <div class="col-12">
          <div class="divider-grey"></div>
        </div>
      </div>

      <div class="row no-gutters row--powerbar">
        <div class="col-12">
          <div class="powerbar">
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
          <p class="label">Chaikin Power Bar &nbsp;<a> &nbsp;<i class="fa fa-info-circle" aria-hidden="true"></i></a>
          </p>
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

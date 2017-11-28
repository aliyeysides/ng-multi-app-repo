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
          <p class="data"><span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="#ffffff"><path d="M4.465 263.536l7.07 7.071c4.686 4.686 12.284 4.686 16.971 0L207 92.113V468c0 6.627 5.373 12 12 12h10c6.627 0 12-5.373 12-12V92.113l178.494 178.493c4.686 4.686 12.284 4.686 16.971 0l7.07-7.071c4.686-4.686 4.686-12.284 0-16.97l-211.05-211.05c-4.686-4.686-12.284-4.686-16.971 0L4.465 246.566c-4.687 4.686-4.687 12.284 0 16.97z"/></svg></span> <sub></sub>3.04<sub>%</sub></p>
        </div>
        <div class="col-12">
          <p>Compared to the <span class="market">S&amp;P 500</span> &ndash;&ndash; Up <span class="market--change">+0.13%</span>.</p>
        </div>
      </div>

      <div class="row overview__powerbar">
        <div class="col-12">
          <p class="label">Chaikin Power Bar</p>
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
        <div class="col-12">
          <p class="label label--learnmore"><a><i class="fa fa-info-circle" aria-hidden="true"></i> What is this? </a></p>
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

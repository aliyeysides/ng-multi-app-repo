import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {ExpectedEarningsReports} from '../../../../../shared/models/health-check';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'cpt-psp-reporting-calendar',
  template: `
    <div class="row no-gutters reporting-calendar">
      <div class="col-12">
        <h3>Reporting This Week</h3>
        <div class="divider__long"></div>
      </div>
      <div class="col-12 col-headers">
        <div class="col-head">
          <p>MON</p>
        </div>
        <div class="col-head">
          <p>TUE</p>
        </div>
        <div class="col-head">
          <p>WED</p>
        </div>
        <div class="col-head">
          <p>THUR</p>
        </div>
        <div class="col-head">
          <p>FRI</p>
        </div>
      </div>
      <div class="col-12 calendar__week">
        <div class="cal-day green">
          <p class="align-absolute green selected"><span class="earnings-count">1</span><i class="fa fa-times"
                                                                                           aria-hidden="true"></i></p>
        </div>
        <div class="cal-day">
        </div>
        <div class="cal-day blue">
          <p class="align-absolute blue">3</p>
        </div>
        <div class="cal-day red">
          <p class="align-absolute red">1</p>
        </div>
        <div class="cal-day">
        </div>
      </div>

      <div class="col-12 calendar__day-expand" id="day--Monday">
        <div class="row">
          <div class="col-5">
            <p class="ticker"><span style="display: inline-block;"><img width="30px;" class=""
                                                                        src="./assets/imgs/arc_VeryBullish.svg"></span>BBB
            </p>
          </div>
          <div class="col-7">
            <p class="earn-date">Thursday, November 30th</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['../../health-check.component.scss']
})
export class ReportingCalendarComponent implements OnInit, OnDestroy {
  private _ngUnsubscribe: Subject<void> = new Subject();
  private _data: BehaviorSubject<ExpectedEarningsReports> = new BehaviorSubject<ExpectedEarningsReports>({} as ExpectedEarningsReports);

  @Input('data')
  set data(val: ExpectedEarningsReports) {
    this._data.next(val);
  }

  get data() {
    return this._data.getValue();
  }

  constructor() {
  }

  ngOnInit() {
    this._data
      .takeUntil(this._ngUnsubscribe)
      .filter(x => x != undefined)
      .subscribe(res => {
        console.log('data in cal', res);
        Object.keys(res['earningsReports'][0]).forEach(date => console.log('date', date));
      });
  }

  ngOnDestroy() {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}

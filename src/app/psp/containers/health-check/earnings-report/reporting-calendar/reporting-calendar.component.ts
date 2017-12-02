import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {ExpectedEarningsReports} from '../../../../../shared/models/health-check';
import {Subject} from 'rxjs/Subject';

import * as moment from 'moment';

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
        <div (click)="toggleDay('monday')" class="cal-day">
          <p class="align-absolute">
            <span class="earnings-count">{{ weeklyData['monday'].length }}</span>
            <!--<i class="fa fa-times" aria-hidden="true"></i>-->
          </p>
        </div>
        <div (click)="toggleDay('tuesday')" class="cal-day">
          <span class="earnings-count">{{ weeklyData['tuesday'].length }}</span>
        </div>
        <div (click)="toggleDay('wednesday')" class="cal-day">
          <span class="earnings-count">{{ weeklyData['wednesday'].length }}</span>
        </div>
        <div (click)="toggleDay('thursday')" class="cal-day">
          <span class="earnings-count">{{ weeklyData['thursday'].length }}</span>
        </div>
        <div (click)="toggleDay('friday')" class="cal-day">
          <span class="earnings-count">{{ weeklyData['friday'].length }}</span>
        </div>
      </div>

      <div class="col-12 calendar__day-expand" id="day--Monday">
        <div *ngFor="let stock of selectedDayData" class="row">
          <div class="col-5">
            <p class="ticker">
              <span style="display: inline-block;">
                <img width="30px;" class="" src="./assets/imgs/arc_VeryBullish.svg">
              </span>BBB
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

  selectedDayData = [];
  weeklyData: object = {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: []
  };

  constructor() {
  }

  ngOnInit() {
    this._data
      .takeUntil(this._ngUnsubscribe)
      .filter(x => x != undefined)
      .subscribe(res => {
        console.log('data in cal', res);
        this.parseExpectedEarningsReports(res);
      });
  }

  ngOnDestroy() {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

  parseExpectedEarningsReports(res: ExpectedEarningsReports) {
    Object.keys(res['earningsReports']).forEach(date => {
      const day = moment(date).day();
      let obj = Object.assign(res['earningsReports'][0][date], {day: day});
      switch (day) {
        case 5:
          this.weeklyData['friday'].push(obj);
          break;
        case 4:
          this.weeklyData['thursday'].push(obj);
          break;
        case 3:
          this.weeklyData['wednesday'].push(obj);
          break;
        case 2:
          this.weeklyData['tuesday'].push(obj);
          break;
        case 1:
          this.weeklyData['monday'].push(obj);
          break;
        default:
          return;
      }
      console.log('weeklyData', this.weeklyData);
    });
  }

  toggleDay(day: string) {
    this.selectedDayData = this.weeklyData[day];
  }

}

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
        <h3><span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path
          d="M148 288h-40c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12zm108-12v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm96 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm-96 96v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm-96 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm192 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm96-260v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h48V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h128V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h48c26.5 0 48 21.5 48 48zm-48 346V160H48v298c0 3.3 2.7 6 6 6h340c3.3 0 6-2.7 6-6z"/></svg></span>
          Reporting This Week
        </h3>
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
            <span *ngIf="selectedDay != 'monday'" class="earnings-count">{{ weeklyData['monday'].length }}</span>
            <i (click)="selectedDay = ''" *ngIf="selectedDay === 'monday'" class="fa fa-times" aria-hidden="true"></i>
          </p>
        </div>
        <div (click)="toggleDay('tuesday')" class="cal-day">
          <p class="align-absolute">
            <span *ngIf="selectedDay != 'tuesday'" class="earnings-count">{{ weeklyData['tuesday'].length }}</span>
            <i (click)="selectedDay = ''" *ngIf="selectedDay === 'tuesday'" class="fa fa-times" aria-hidden="true"></i>
          </p>
        </div>
        <div (click)="toggleDay('wednesday')" class="cal-day">
          <p class="align-absolute">
            <span *ngIf="selectedDay != 'wednesday'" class="earnings-count">{{ weeklyData['wednesday'].length }}</span>
            <i (click)="selectedDay = ''" *ngIf="selectedDay === 'wednesday'" class="fa fa-times"
               aria-hidden="true"></i>
          </p>
        </div>
        <div (click)="toggleDay('thursday')" class="cal-day">
          <p class="align-absolute">
            <span *ngIf="selectedDay != 'thursday'" class="earnings-count">{{ weeklyData['thursday'].length }}</span>
            <i (click)="selectedDay = ''" *ngIf="selectedDay === 'thursday'" class="fa fa-times" aria-hidden="true"></i>
          </p>
        </div>
        <div (click)="toggleDay('friday')" class="cal-day">
          <p class="align-absolute">
            <span *ngIf="selectedDay != 'friday'" class="earnings-count">{{ weeklyData['friday'].length }}</span>
            <i (click)="selectedDay = ''" *ngIf="selectedDay === 'friday'" class="fa fa-times" aria-hidden="true"></i>
          </p>
        </div>
      </div>

      <div class="col-12 calendar__day-expand" id="day--Monday">
        <div class="row">
          <div class="col-5">
            <p class="ticker">
              <span *ngFor="let ticker of selectedDayData['bullishSymbol']" style="display: inline-block;">
                <img width="30px;" class="" src="./assets/imgs/arc_Bullish.svg">
                {{ ticker }}
              </span>
              <span *ngFor="let ticker of selectedDayData['neutralSymbol']" style="display: inline-block;">
                <img width="30px;" class="" src="./assets/imgs/arc_Neutral.svg">
                {{ ticker }}
              </span>
              <span *ngFor="let ticker of selectedDayData['bearishSymbol']" style="display: inline-block;">
                <img width="30px;" class="" src="./assets/imgs/arc_VeryBearish.svg">
                {{ ticker }}
              </span>
            </p>
          </div>
          <div class="col-7">
            <p class="earn-date" *ngIf="selectedDate">{{ moment(selectedDate).format('MMMM Do YYYY') }}</p>
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

  moment = moment;
  selectedDate: string;
  selectedDay: string;
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
        this.parseExpectedEarningsReports(res);
      });
  }

  ngOnDestroy() {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

  parseExpectedEarningsReports(res: ExpectedEarningsReports) {
    Object.keys(res['earningsReports']).forEach(idx => {
      Object.keys(res['earningsReports'][idx]).forEach(date => {
        const day = moment(date).day();
        const obj = Object.assign(res['earningsReports'][idx][date], {
          day: day,
          date: date
        });
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
      });
    });
  }

  toggleDay(day: string) {
    this.selectedDay = day;
    if (this.weeklyData[day].length) {
      this.selectedDate = this.weeklyData[day][0]['date'];
      this.selectedDayData = this.weeklyData[day][0];
      return;
    }
    this.selectedDate = '';
    this.selectedDayData = [];
  }

}

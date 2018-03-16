import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {ExpectedEarningsReports} from '../../../../../shared/models/health-check';
import {Subject} from 'rxjs/Subject';

import * as moment from 'moment';
import {Router} from '@angular/router';

declare var gtag: Function;

@Component({
  selector: 'cpt-psp-reporting-calendar',
  template: `
    <div class="row reporting-calendar">

      <div class="col-12">
        <span class="icon__separator hidden-md-up">
          <i class="fal fa-calendar-alt ux-blue"></i>
        </span>
        <h3>Reporting This Week</h3>
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
        <div (click)="toggleDay('monday')" class="cal-day" [ngClass]="{'blue': calToggleObj['monday'] || getAllReportsCount(weeklyData['monday']) }">
          <p class="align-absolute">
            <span *ngIf="calToggleObj['monday'] != true"
                  class="earnings-count">{{ getAllReportsCount(weeklyData['monday']) }}</span>
            <i (click)="toggleDay('monday');$event.stopPropagation()" *ngIf="calToggleObj['monday']" class="fa fa-times"
               aria-hidden="true"></i>
          </p>
        </div>
        <div (click)="toggleDay('tuesday')" class="cal-day" [ngClass]="{'blue': calToggleObj['tuesday'] || getAllReportsCount(weeklyData['tuesday'])}">
          <p class="align-absolute">
            <span *ngIf="calToggleObj['tuesday'] != true"
                  class="earnings-count">{{ getAllReportsCount(weeklyData['tuesday']) }}</span>
            <i (click)="toggleDay('tuesday');$event.stopPropagation()" *ngIf="calToggleObj['tuesday']"
               class="fa fa-times"
               aria-hidden="true"></i>
          </p>
        </div>
        <div (click)="toggleDay('wednesday')" class="cal-day"
             [ngClass]="{'blue': calToggleObj['wednesday'] || getAllReportsCount(weeklyData['wednesday'])}">
          <p class="align-absolute">
            <span *ngIf="calToggleObj['wednesday'] != true"
                  class="earnings-count">{{ getAllReportsCount(weeklyData['wednesday']) }}</span>
            <i (click)="toggleDay('wednesday');$event.stopPropagation()" *ngIf="calToggleObj['wednesday']"
               class="fa fa-times"
               aria-hidden="true"></i>
          </p>
        </div>
        <div (click)="toggleDay('thursday')" class="cal-day"
             [ngClass]="{'blue': calToggleObj['thursday'] || getAllReportsCount(weeklyData['thursday']) }">
          <p class="align-absolute">
            <span *ngIf="calToggleObj['thursday'] != true"
                  class="earnings-count">{{ getAllReportsCount(weeklyData['thursday']) }}</span>
            <i (click)="toggleDay('thursday');$event.stopPropagation()" *ngIf="calToggleObj['thursday']"
               class="fa fa-times"
               aria-hidden="true"></i>
          </p>
        </div>
        <div (click)="toggleDay('friday')" class="cal-day"
             [ngClass]="{'blue': calToggleObj['friday'] || getAllReportsCount(weeklyData['friday']) }">
          <p class="align-absolute">
            <span *ngIf="calToggleObj['friday'] != true"
                  class="earnings-count">{{ getAllReportsCount(weeklyData['friday']) }}</span>
            <i (click)="toggleDay('friday');$event.stopPropagation()" *ngIf="calToggleObj['friday']" class="fa fa-times"
               aria-hidden="true"></i>
          </p>
        </div>
      </div>

      <div class="col-12 calendar__day-expand">
        <div class="row">
          <div class="col-12">
            <p class="earn-date blue" *ngIf="selectedDate">{{ moment(selectedDate).format('MMMM Do YYYY') }}</p>
          </div>
          <div class="col-12">
            <p class="ticker">
              <span (click)="gotoReport(ticker)" *ngFor="let ticker of selectedDayData['bullishSymbol']">
                <img width="40px" class="" src="./assets/imgs/arc_Bullish.svg">
                {{ ticker }}
              </span>
              <span (click)="gotoReport(ticker)" *ngFor="let ticker of selectedDayData['neturalSymbol']">
                <img width="40px" class="" src="./assets/imgs/arc_Neutral.svg">
                {{ ticker }}
              </span>
              <span (click)="gotoReport(ticker)" *ngFor="let ticker of selectedDayData['bearishSymbol']">
                <img width="40px" class="" src="./assets/imgs/arc_Bearish.svg">
                {{ ticker }}
              </span>
            </p>
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
  calToggleObj: object = {};
  selectedDayData = [];
  weeklyData: object = {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: []
  };

  constructor(private router: Router) {
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

  getAllReportsCount(arr): number {
    if (arr.length) {
      return arr[0]['bullishSymbolCount'] + arr[0]['neturalSymbolCount'] + arr[0]['bearishSymbolCount'];
    }
  }

  toggleDay(day: string) {

    if (this.weeklyData[day].length) {
      this.selectedDate = this.weeklyData[day][0]['date'];
      this.selectedDayData = this.weeklyData[day][0];
    }

    if (!this.calToggleObj[day]) {
      this.calToggleObj = {};
      this.calToggleObj[day] = true;
      return;
    }
    this.calToggleObj[day] = !this.calToggleObj[day];
    this.selectedDay = day;
    this.selectedDayData = [];
    this.selectedDate = '';

    gtag('event', 'calendar_day_toggled', {
      'event_category': 'engagement',
      'event_label': day
    });
  }

  gotoReport(ticker: string) {
    this.router.navigate(['stock-analysis', ticker]);
    gtag('event', 'stock_clicked', {
      'event_category': 'engagement',
      'event_label': ticker
    });
  }

}

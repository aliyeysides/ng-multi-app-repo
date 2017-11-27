import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cpt-psp-reporting-calendar',
  template: `
    <div class="row no-gutters reporting-calendar">
      <div class="col-12 chart__header">
        <h3 class="ux-blue">Reporting This Week</h3>
        <div class="divider__long divider__long--blue"></div>
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
          <p class="align-middle green">1</p>
        </div>
        <div class="cal-day">
        </div>
        <div class="cal-day blue">
          <p class="align-middle blue">3</p>
        </div>
        <div class="cal-day red">
          <p class="align-middle red">1</p>
        </div>
        <div class="cal-day">
        </div>
      </div>
    </div>
  `,
  styleUrls: ['../../health-check.component.scss']
})
export class ReportingCalendarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

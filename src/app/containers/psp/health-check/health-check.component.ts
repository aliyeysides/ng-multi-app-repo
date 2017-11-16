import {Component, OnInit} from '@angular/core';
import {HealthCheckService} from '../../../core/services/health-check.service';
import {AuthService} from '../../../core/services/auth.service';

@Component({
  selector: 'cpt-health-check',
  template: `
    <!-- PANEL CONTENTS -->
    <div class="container page__contents  page__contents--healthcheck">

      <div class="row duration__selector">
        <div class="col-1"></div>
        <div class="col-5 duration__toggle">
          <a>Today</a>
        </div>
        <div class="col-5 duration__toggle selected">
          <a>This Week</a>
        </div>
        <div class="col-1"></div>
      </div>

      <!-- Health Check Intro -->
      <div class="row contents contents--intro">
        <div class="divider-grey"></div>
        <div class="col-12">
          <p>On average, your stocks are</p>
        </div>
        <div class="col-12">
          <p class="data--large up-change"><span>up</span> 3.04%</p>
        </div>
        <div class="col-12">
          <p>compared to the <span class="blue font-weight--semibold">S&amp;P 500</span> &mdash; <span
            class="up-change font-weight--semibold">up 0.13%</span></p>
        </div>
        <div class="divider-grey"></div>
        <div class="col-12 powerBar-container">
          <div class="powerBar">
            <div class="green">
              <p>9</p>
            </div>
            <div class="yellow">
              <p>3</p>
            </div>
            <div class="red">
              <p>4</p>
            </div>
          </div>
          <p class="label">Chaikin Power Bar &nbsp;<a> &nbsp;<i class="fa fa-info-circle"
                                                                aria-hidden="true"></i></a></p>
        </div>
      </div>

      <!-- Health Check Intro -->
      <div class="row contents contents--stockMovements">
        <div class="col-12">
          <h2>This week’s <span>Stock Movements</span></h2>
        </div>
        <div class="col-12 contents__quickview">
          <div class="row no-gutters">
            <div class="col-1"></div>
            <div class="col-5 quickview-data--left">
              <p><img src="assets/imgs/icon_circle-movement--green.svg"> 10</p>
            </div>
            <div class="col-5 quickview-data--right">
              <p><img src="assets/imgs/icon_circle-movement--red.svg"> 4</p>
            </div>
            <div class="col-1"></div>
          </div>
        </div>
        <div class="col-12 chart-actions">
          <div class="row no-gutters">
            <div class="col-8 chart-actions__dropdown">
              <p class="dropdown-text">Top Movers</p>
            </div>
            <div class="col-2 chart-actions__toggle">
              <img class="align-middle" src="assets/imgs/icon_chart--bars.svg">
            </div>
            <div class="col-2 chart-actions__toggle">
              <img class="align-middle" src="assets/imgs/icon_chart--spark.svg">
            </div>
          </div>
        </div>
      </div>
    </div>`,
  styleUrls: ['./health-check.component.scss']
})
export class HealthCheckComponent implements OnInit {

  constructor(private authService: AuthService,
              private healthCheck: HealthCheckService) {
  }

  ngOnInit() {
    this.authService.currentUser$
      .subscribe(usr => console.log('usr', usr));
    // this.healthCheck.getChaikinCalculations();
  }

}

import {Component, OnInit} from '@angular/core';
import {HealthCheckService} from '../../../services/health-check.service';
import {AuthService} from '../../../services/auth.service';

import * as moment from 'moment';
import {PortfolioStatus, StockStatus} from '../../../shared/models/stock-status';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'cpt-health-check',
  template: `
    <!-- PANEL CONTENTS -->
    <div class="container-fluid component component--healthcheck">
      <div class="row contents">

      <!-- HEALTH-CHECK - Intro -->
        <cpt-portfolio-overview [status]="portfolioStatus"></cpt-portfolio-overview>
      <!-- HEALTH-CHECK - Stock Movements -->
        <cpt-stock-movements [stocks]="stocksStatus"></cpt-stock-movements>

      <!-- HEALTH-CHECK - Ratings Changes -->
        <div class="col-12 col-md-7 col-lg-8 section section--ratingschanges">

          <div class="row section__summary">
            <div class="col-12 col-md-6">
              <h2>Ratings Changes</h2>
            </div>
            <div class="col-12 col-md-6">
              <div class="row">
                <div class="col-1"></div>
                <div class="col-5 summary--left">
                  <p><img src="./assets/imgs/icon_circle-change--green.svg"> 2</p>
                </div>
                <div class="col-5 summary--right">
                  <p><img src="./assets/imgs/icon_circle-change--red.svg"> 3</p>
                </div>
                <div class="col-1"></div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-12 col-md-6 section__contents">
              <h3 class="green">Turned Bullish</h3>
              <div class="divider__long divider__long--green"></div>
              <ul class="stock__list">
                <li class="row no-gutters list__entry">
                  <div class="col-2 list-entry__pgr">
                    <img class="align-middle" src="./assets/imgs/arc_VeryBullish.svg">
                  </div>
                  <div class="col-4 list-entry__info">
                    <p class="ticker">SHOP</p>
                    <p class="company">Shopify Inc</p>
                  </div>
                  <div class="col-3 list-entry__data">
                    <p class="data green">99.40</p>
                  </div>
                  <div class="col-3 list-entry__data">
                    <p class="data green">3.12%</p>
                  </div>
                  <div class="button__slide">
                    <img src="./assets/imgs/ui_slide.svg">
                  </div>
                  <div class="col-12 list-entry__overlay green">
                    <div class="row no-gutters overlay__contents">
                      <div class="button__slide">
                        <img src="./assets/imgs/ui_slide.svg">
                      </div>
                      <div class="col-2">
                        <img class="align-middle" src="./assets/imgs/icon_minus.svg">
                      </div>
                      <div class="col-4">
                        <p class="ticker">SHOP</p>
                      </div>
                      <div class="col-2">
                        <img class="align-middle" src="./assets/imgs/icon_arrow-up.svg">
                      </div>
                      <div class="col-4">
                        <p class="data">-2.34%</p>
                      </div>
                    </div>
                  </div>
                </li>
                <li class="row no-gutters list__entry">
                  <div class="col-2 list-entry__pgr">
                    <img class="align-middle" src="./assets/imgs/arc_Bullish.svg">
                  </div>
                  <div class="col-4 list-entry__info">
                    <p class="ticker">JASO</p>
                    <p class="company">Amazon.Com Inc</p>
                  </div>
                  <div class="col-3 list-entry__data">
                    <p class="data green">34.52</p>
                  </div>
                  <div class="col-3 list-entry__data">
                    <p class="data green">1.45%</p>
                  </div>
                  <div class="button__slide">
                    <img src="./assets/imgs/ui_slide.svg">
                  </div>
                </li>
              </ul>
            </div>


            <div class="col-12 col-md-6 section__contents">
              <h3 class="red">Turned Bearish</h3>
              <div class="divider__long divider__long--red"></div>
              <ul class="stock__list">
                <li class="row no-gutters list__entry">
                  <div class="col-2 list-entry__pgr">
                    <img class="align-middle" src="./assets/imgs/arc_VeryBearish.svg">
                  </div>
                  <div class="col-4 list-entry__info">
                    <p class="ticker">YUM</p>
                    <p class="company">Shopify Inc</p>
                  </div>
                  <div class="col-3 list-entry__data">
                    <p class="data red">99.40</p>
                  </div>
                  <div class="col-3 list-entry__data">
                    <p class="data red">3.12%</p>
                  </div>
                  <div class="button__slide">
                    <img src="./assets/imgs/ui_slide.svg">
                  </div>
                </li>
                <li class="row no-gutters list__entry">
                  <div class="col-2 list-entry__pgr">
                    <img class="align-middle" src="./assets/imgs/arc_Bearish.svg">
                  </div>
                  <div class="col-4 list-entry__info">
                    <p class="ticker">MINI</p>
                    <p class="company">Amazon.Com Inc</p>
                  </div>
                  <div class="col-3 list-entry__data">
                    <p class="data red">34.52</p>
                  </div>
                  <div class="col-3 list-entry__data">
                    <p class="data red">1.45%</p>
                  </div>
                  <div class="button__slide">
                    <img src="./assets/imgs/ui_slide.svg">
                  </div>
                </li>
                <li class="row no-gutters list__entry">
                  <div class="col-2 list-entry__pgr">
                    <img class="align-middle" src="./assets/imgs/arc_Bearish.svg">
                  </div>
                  <div class="col-4 list-entry__info">
                    <p class="ticker">TSLA</p>
                    <p class="company">Tesla Motors</p>
                  </div>
                  <div class="col-3 list-entry__data">
                    <p class="data red">34.52</p>
                  </div>
                  <div class="col-3 list-entry__data">
                    <p class="data red">1.45%</p>
                  </div>
                  <div class="button__slide">
                    <img src="./assets/imgs/ui_slide.svg">
                  </div>
                </li>
              </ul>
            </div>

          </div>

          <div class="row">
            <div class="col-12 expand-collapse">
              <img src="./assets/imgs/icon_chevron--up.svg">
              <p>COLLAPSE</p>
            </div>
          </div>
        </div>

      <!-- HEALTH-CHECK - Earnings Reports -->
        <div class="col-12 col-md-7 col-lg-8 section section--earningsreports">

          <div class="row section__header">
            <div class="col-12">
              <h2>Earnings Reports</h2>
            </div>
          </div>

          <div class="row section__summary">
            <div class="col-1"></div>
            <div class="col-5 summary--left">
              <p><img src="./assets/imgs/icon_circle-earnings--green.svg"> 3</p>
            </div>
            <div class="col-5 summary--right">
              <p><img src="./assets/imgs/icon_circle-earnings--red.svg"> 2</p>
            </div>
            <div class="col-1"></div>
          </div>

          <div class="row">
            <div class="col-12 col-md-6 section__contents">
              <h3 class="ux-blue">Earnings Surprises</h3>
              <div class="divider__long divider__long--blue"></div>
              <ul class="col-12 section__chart">
                <li class="row no-gutters col-headers">
                  <div class="col-3">
                    <p>TICKER</p>
                  </div>
                  <div class="col-3">
                    <p>ACT</p>
                  </div>
                  <div class="col-3">
                    <p>EST</p>
                  </div>
                  <div class="col-3">
                    <p>DIFF</p>
                  </div>
                </li>
                <li class="row no-gutters earnings__entry">
                  <div class="col-1 pgr">
                    <img class="align-middle" src="./assets/imgs/arc_Bullish.svg">
                  </div>
                  <div class="col-2 ticker">
                    <p>PGR</p>
                  </div>
                  <div class="col-3 data">
                    <p>99.40</p>
                  </div>
                  <div class="col-3 data">
                    <p>3.12%</p>
                  </div>
                  <div class="col-3 data">
                    <p class="green">3.12%</p>
                  </div>
                </li>
                <li class="row no-gutters earnings__entry">
                  <div class="col-1 pgr">
                    <img class="align-middle" src="./assets/imgs/arc_VeryBearish.svg">
                  </div>
                  <div class="col-2 ticker">
                    <p class="">KPMG</p>
                  </div>
                  <div class="col-3 data">
                    <p>99.40</p>
                  </div>
                  <div class="col-3 data">
                    <p>3.12%</p>
                  </div>
                  <div class="col-3 data">
                    <p class="green">3.12%</p>
                  </div>
                </li>
                <li class="row no-gutters earnings__entry">
                  <div class="col-1 pgr">
                    <img class="align-middle" src="./assets/imgs/arc_Bearish.svg">
                  </div>
                  <div class="col-2 ticker">
                    <p>SHOP</p>
                  </div>
                  <div class="col-3 data">
                    <p>99.40</p>
                  </div>
                  <div class="col-3 data">
                    <p>3.12%</p>
                  </div>
                  <div class="col-3 data">
                    <p class="green">3.12%</p>
                  </div>
                </li>
              </ul>
            </div>

            <div class="col-12 col-md-6 section__contents">
              <h3 class="ux-blue">Estimate Revisions</h3>
              <div class="divider__long divider__long--blue"></div>
              <ul class="col-12 section__chart">
                <li class="row no-gutters col-headers">
                  <div class="col-3">
                    <p>TICKER</p>
                  </div>
                  <div class="col-3">
                    <p>CURR</p>
                  </div>
                  <div class="col-3">
                    <p>PREV</p>
                  </div>
                  <div class="col-3">
                    <p>DIFF</p>
                  </div>
                </li>
                <li class="row no-gutters earnings__entry">
                  <div class="col-1 pgr">
                    <img class="align-middle" src="./assets/imgs/arc_VeryBullish.svg">
                  </div>
                  <div class="col-2 ticker">
                    <p>SHOP</p>
                  </div>
                  <div class="col-3 data">
                    <p>99.40</p>
                  </div>
                  <div class="col-3 data">
                    <p>3.12%</p>
                  </div>
                  <div class="col-3 data">
                    <p class="green">3.12%</p>
                  </div>
                </li>
                <li class="row no-gutters earnings__entry">
                  <div class="col-1 pgr">
                    <img class="align-middle" src="./assets/imgs/arc_VeryBullish.svg">
                  </div>
                  <div class="col-2 ticker">
                    <p class="">SHOP</p>
                  </div>
                  <div class="col-3 data">
                    <p>99.40</p>
                  </div>
                  <div class="col-3 data">
                    <p>3.12%</p>
                  </div>
                  <div class="col-3 data">
                    <p class="green">3.12%</p>
                  </div>
                </li>
                <li class="row no-gutters earnings__entry">
                  <div class="col-1 pgr">
                    <img class="align-middle" src="./assets/imgs/arc_VeryBullish.svg">
                  </div>
                  <div class="col-2 ticker">
                    <p>SHOP</p>
                  </div>
                  <div class="col-3 data">
                    <p>99.40</p>
                  </div>
                  <div class="col-3 data">
                    <p>3.12%</p>
                  </div>
                  <div class="col-3 data">
                    <p class="green">3.12%</p>
                  </div>
                </li>
              </ul>
            </div>

            <div class="col-12 section__chart">

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
            </div>
          </div>

          <div class="row">
            <div class="col-12 expand-collapse">
              <img src="./assets/imgs/icon_chevron--up.svg">
              <p>COLLAPSE</p>
            </div>
          </div>
        </div>

      <!-- HEALTH-CHECK - Power Grid -->
        <div class="col-12 col-md-7 col-lg-8 section section--powergrid">

          <div class="row">
            <div class="col-12">
              <h2>Power Grid</h2>
            </div>
          </div>

          <div class="row">
            <div class="col-12 chart__header">
              <h3 class="green">Strong Industries</h3>
              <div class="divider__long divider__long--green"></div>
            </div>

            <div class="col-12 powerGrid">
              <div class="row col-headers">
                <div class="col-6">
                  <p>Strong Stocks</p>
                </div>
                <div class="col-6">
                </div>
              </div>
              <div class="row grid__row">
                <div class="col-6 grid__quadrant green">
                  <p class="ticker"><a>BMW</a>, <a>AUDI</a></p>
                  <p class="ticker"><a>JASO</a></p>
                </div>
                <div class="col-6 grid__quadrant">
                  <p class="industry green">Automotive</p>
                  <p class="industry green">Energy</p>
                </div>
              </div>
            </div>

            <div class="col-12 powerGrid">
              <div class="row col-headers">
                <div class="col-6">
                  <p>Weak Stocks</p>
                </div>
                <div class="col-6">
                </div>
              </div>
              <div class="row grid__row">
                <div class="col-6 grid__quadrant red">
                  <p class="ticker">DSNY</p>
                </div>
                <div class="col-6 grid__quadrant">
                  <p class="industry green">Entertainment-Media</p>
                </div>
              </div>
            </div>

            <div class="col-12 chart__header">
              <h3 class="red">Weak Industries</h3>
              <div class="divider__long divider__long--red"></div>
            </div>

            <div class="col-12 powerGrid">
              <div class="row col-headers">
                <div class="col-6">
                  <p>Strong Stocks</p>
                </div>
                <div class="col-6">
                </div>
              </div>
              <div class="row grid__row">
                <div class="col-6 grid__quadrant green">
                  <p class="ticker"></p>
                </div>
                <div class="col-6 grid__quadrant">
                </div>
              </div>
            </div>

            <div class="col-12 powerGrid">
              <div class="row col-headers">
                <div class="col-6">
                  <p>Weak Stocks</p>
                </div>
                <div class="col-6">
                </div>
              </div>
              <div class="row grid__row">
                <div class="col-6 grid__quadrant red">
                  <p class="ticker"><a>BMW</a>, <a>AUDI</a>, <a>TSLA</a>, <a>AUDI</a></p>
                  <p class="ticker"><a>JASO</a></p>
                  <p class="ticker"><a>JASO</a></p>
                </div>
                <div class="col-6 grid__quadrant">
                  <p class="industry red">Automotive</p>
                  <p class="industry red">Energy</p>
                  <p class="industry red">Energy</p>
                </div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-12 expand-collapse">
              <img src="./assets/imgs/icon_chevron--up.svg">
              <p>COLLAPSE</p>
            </div>
          </div>
        </div>

      <!-- HEALTH-CHECK - DISCLAIMER -->
        <div  class="col-12 col-md-7 col-lg-8 section section--disclaimer">

          <div class="row">
            <div class="col-12">
              <h4>Disclaimer</h4>
              <p class="disclaimer">Etiam vel nisi laoreet, semper felis sit amet, egestas libero. Ut quis pretium tortor, eget semper lacus. Sed at leo lectus. Donec imperdiet erat eu enim vestibulum, ut interdum odio laoreet. Nam vel tellus vel ligula posuere iaculis. Sed porta imperdiet leo sed posuere. Aenean maximus lacus tortor, nec interdum diam posuere non.</p>
            </div>
          </div>
        </div>

      </div>
    </div>`,
  styleUrls: ['./health-check.component.scss']
})
export class HealthCheckComponent implements OnInit {
  private uid: string;
  private listId: string;

  public portfolioStatus: PortfolioStatus;
  public stocksStatus: Array<StockStatus>;

  constructor(private authService: AuthService,
              private healthCheck: HealthCheckService) {
  }

  ngOnInit() {
    this.authService.currentUser$
      .map(usr => this.uid = usr['UID'])
      .flatMap(uid => this.healthCheck.getAuthorizedLists(uid))
      .map(res => this.listId = res[0]['User Lists'][0]['list_id'] )
      .switchMap(res => {
        const startDate = moment().subtract(1, 'weeks').day(-2).format('YYYY-MM-DD'),
              endDate = moment(startDate).add(7, 'days').format('YYYY-MM-DD');
        return Observable.combineLatest(
          this.healthCheck.getChaikinCalculations(res, startDate, endDate),
          this.healthCheck.getUserPortfolioStockStatus(res, startDate, endDate)
        )
      })
      .subscribe(res => {
        console.log('res', res);
        this.portfolioStatus = res[0][0] as PortfolioStatus;
        this.stocksStatus = res[0][1] as StockStatus[];
      });
  }

}

import {Component, OnInit} from '@angular/core';
import {HealthCheckService} from '../../../core/services/health-check.service';
import {AuthService} from '../../../core/services/auth.service';

@Component({
  selector: 'cpt-health-check',
  template: `
    <!-- PANEL CONTENTS -->
    <div class="container page__contents  page__contents--healthcheck">

      <div class="row no-gutters contents contents--timespan">
        <div class="col-4 timespan__toggle">
          <p>Today</p>
        </div>
        <div class="col-4 timespan__toggle selected">
            <p>This Week</p>
        </div>
        <div class="col-4"></div>
      </div>

    <!-- HEALTH-CHECK - Intro -->
      <div class="row contents contents--intro">
        <div class="col-12 col-md-4">
          <p class="">On average, your stocks are&hellip;</p>
        </div>
        <div class="col-12 col-md-4">
          <p class="data green"><sub>up</sub> 3.04<sub>%</sub></p>
        </div>
        <div class="col-12 col-md-4">
          <p>compared to the <span class="blue">S&amp;P 500</span> &mdash; <span class="up-change">up 0.13%</span></p>
        </div>
        <div class="divider-grey"></div>

        <div class="col-12 section__powerbar">
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
          <p class="label">Chaikin Power Bar &nbsp;<a> &nbsp;<i class="fa fa-info-circle" aria-hidden="true"></i></a></p>
        </div>
        <div class="divider-grey"></div>
      </div>

    <!-- HEALTH-CHECK - Stock Movements -->
      <div class="row contents">
        <div class="col-12">
          <h2>This week’s <span>Stock Movements</span></h2>
        </div>
        <div class="col-12 section__summary">
          <div class="row no-gutters">
            <div class="col-1"></div>
            <div class="col-5 summary--left">
              <p><img src="./assets/imgs/icon_circle-movement--green.svg"> 10</p>
            </div>
            <div class="col-5 summary--right">
              <p><img src="./assets/imgs/icon_circle-movement--red.svg"> 4</p>
            </div>
            <div class="col-1"></div>
          </div>
        </div>

        <div class="col-12 section__movers-actions">
          <div class="row no-gutters">
            <div class="col-6 movers__dropdown">
              <p class="dropdown__text">Top Movers</p>
            </div>
            <div class="col-2">
            </div>
            <div class="col-2 movers-actions__toggle">
              <img class="align-middle" src="./assets/imgs/icon_chart--bars.svg">
            </div>
            <div class="col-2 movers-actions__toggle">
              <img class="align-middle" src="./assets/imgs/icon_chart--spark.svg">
            </div>
          </div>
          <div class="row no-gutters dropdown__container">
            <div class="col-6">
              <ul>
                <li class="selected">→ Top Movers</li>
                <li>All Movers</li>
                <li>Bull Movers</li>
                <li>Bear Movers</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="col-12 section__movers section__movers--percent">
          <ul>
            <li class="row no-gutters list-item__mover">
              <div class="col-4 mover__stock">
                <img src="./assets/imgs/arc_Bearish.svg">
                <p class="ticker">URBN</p>
              </div>
              <div class="col-8 mover__data">
                <div class="mover__bar positive hundredpercent">
                  <p class="data">17.25%</p>
                </div>
              </div>
            </li>
            <li class="row no-gutters list-item__mover">
              <div class="col-4 mover__stock">
                <img src="./assets/imgs/arc_Bullish.svg">
                <p class="ticker">CMCSA</p>
              </div>
              <div class="col-8 mover__data">
                <div class="mover__bar positive seventypercent">
                  <p class="data">13.43%</p>
                </div>
              </div>
            </li>
            <li class="row no-gutters list-item__mover">
              <div class="col-4 mover__stock">
                <img src="./assets/imgs/arc_VeryBullish.svg">
                <p class="ticker">JGW</p>
              </div>
              <div class="col-8 mover__data">
                <div class="mover__bar positive thirtypercent">
                  <p class="data">3.45%</p>
                </div>
              </div>
            </li>
          </ul>
          <div class="divider-grey"></div>
          <ul class="movers__list">
            <li class="row no-gutters list-item__mover">
              <div class="col-4 mover__stock">
                <img src="./assets/imgs/arc_VeryBearish.svg">
                <p class="ticker">YUM</p>
              </div>
              <div class="col-8 mover__data">
                <div class="mover__bar negative thirtypercent">
                  <p class="data">-4.25%</p>
                </div>
              </div>
            </li>
            <li class="row no-gutters list-item__mover">
              <div class="col-4 mover__stock">
                <p class="ticker indice">S&P 500</p>
              </div>
              <div class="col-8 mover__data">
                <div class="mover__bar indice thirtyfivepercent">
                  <p class="data">-5.31%</p>
                </div>
              </div>
            </li>
            <li class="row no-gutters list-item__mover">
              <div class="col-4 mover__stock">
                <img src="./assets/imgs/arc_Bearish.svg">
                <p class="ticker">TSLA</p>
              </div>
              <div class="col-8 mover__data">
                <div class="mover__bar negative fortypercent">
                  <p class="data">-6.73%</p>
                </div>
              </div>
            </li>
            <li class="row no-gutters list-item__mover">
              <div class="col-4 mover__stock">
                <img src="./assets/imgs/arc_Neutral.svg">
                <p class="ticker">ORLY</p>
              </div>
              <div class="col-8 mover__data">
                <div class="mover__bar negative sixtypercent">
                  <p class="data">-9.45%</p>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <div class="col-12 section__movers section__movers--price">
          <ul>
            <li class="row no-gutters list-item__mover">
              <div class="col-4 mover__stock">
                <img src="./assets/imgs/arc_Bullish.svg">
                <p class="ticker">CMCSA</p>
              </div>
              <div class="col-6">
                <div class="mover__spark positive">
                  <div class="open--line"></div>
                </div>
              </div>
              <div class="col-2">
                <p class="data green">13.43%</p>
              </div>
            </li>
            <li class="row no-gutters list-item__mover">
              <div class="col-4 mover__stock">
                <img src="./assets/imgs/arc_Bullish.svg">
                <p class="ticker">CMCSA</p>
              </div>
              <div class="col-6">
                <div class="mover__spark positive">
                  <div class="open--line"></div>
                </div>
              </div>
              <div class="col-2">
                <p class="data green">13.43%</p>
              </div>
            </li>
            <li class="row no-gutters list-item__mover">
              <div class="col-4 mover__stock">
                <img src="./assets/imgs/arc_Bullish.svg">
                <p class="ticker">CMCSA</p>
              </div>
              <div class="col-6">
                <div class="mover__spark positive">
                  <div class="open--line"></div>
                </div>
              </div>
              <div class="col-2">
                <p class="data green">13.43%</p>
              </div>
            </li>
          </ul>
          <div class="divider-grey"></div>
          <ul class="movers__list">
            <li class="row no-gutters list-item__mover">
              <div class="col-4 mover__stock">
                <img src="./assets/imgs/arc_Bullish.svg">
                <p class="ticker">CMCSA</p>
              </div>
              <div class="col-6">
                <div class="mover__spark positive">
                  <div class="open--line"></div>
                </div>
              </div>
              <div class="col-2">
                <p class="data red">13.43%</p>
              </div>
            </li>
            <li class="row no-gutters list-item__mover">
              <div class="col-4 mover__stock">
                <p class="ticker indice">S&P 500</p>
              </div>
              <div class="col-6">
                <div class="mover__spark positive">
                  <div class="open--line"></div>
                </div>
              </div>
              <div class="col-2">
                <p class="data red">-3.43%</p>
              </div>
            </li>
            <li class="row no-gutters list-item__mover">
              <div class="col-4 mover__stock">
                <img src="./assets/imgs/arc_Bearish.svg">
                <p class="ticker">CMCSA</p>
              </div>
              <div class="col-6">
                <div class="mover__spark positive">
                  <div class="open--line"></div>
                </div>
              </div>
              <div class="col-2">
                <p class="data red">-5.43%</p>
              </div>
            </li>
            <li class="row no-gutters list-item__mover">
              <div class="col-4 mover__stock">
                <img src="./assets/imgs/arc_VeryBullish.svg">
                <p class="ticker">CMCSA</p>
              </div>
              <div class="col-6">
                <div class="mover__spark positive">
                  <div class="open--line"></div>
                </div>
              </div>
              <div class="col-2">
                <p class="data red">-7.43%</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

    <!-- HEALTH-CHECK - Ratings Changes -->
      <div class="row contents">
        <div class="col-12">
          <h2>This week’s <span>Ratings Changes</span></h2>
        </div>

        <div class="col-12 section__summary">
          <div class="row no-gutters">
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

        <div class="col-12 section__chart">
          <div class="chart__header">
            <h3 class="green">Turned Bullish</h3>
            <div class="divider__long divider__long--green"></div>
          </div>
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

        <div class="col-12 section__chart">
          <div class="chart__header">
            <h3 class="red">Turned Bearish</h3>
            <div class="divider__long divider__long--red"></div>
          </div>
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

        <div class="col-12 expand-collapse">
          <img src="./assets/imgs/icon_chevron--up.svg">
          <p>COLLAPSE</p>
        </div>
      </div>

    <!-- HEALTH-CHECK - Earnings Reports -->
      <div class="row contents">
        <div class="col-12">
          <h2>This week’s <span>Earnings Reports</span></h2>
        </div>
        <div class="col-12 section__summary">
          <div class="row no-gutters">
            <div class="col-1"></div>
            <div class="col-5 summary--left">
              <p><img src="./assets/imgs/icon_circle-earnings--green.svg"> 3</p>
            </div>
            <div class="col-5 summary--right">
              <p><img src="./assets/imgs/icon_circle-earnings--red.svg"> 2</p>
            </div>
            <div class="col-1"></div>
          </div>
        </div>

        <div class="col-12 section__chart">
          <div class="chart__header">
            <h3>Earnings Surprises</h3>
            <div class="divider__long divider__long--blue"></div>
          </div>
          <ul>
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

        <div class="col-12 section__chart">
          <div class="chart__header">
            <h3>Estimate Revisions</h3>
            <div class="divider__long divider__long--blue"></div>
          </div>
          <ul>
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
          <div class="chart__header">
            <h3>Reporting This Week</h3>
            <div class="divider__long divider__long--blue"></div>
          </div>
          <div class="row no-gutters reporting-calendar">
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


        <div class="col-12 expand-collapse">
          <img src="./assets/imgs/icon_chevron--up.svg">
          <p>COLLAPSE</p>
        </div>
      </div>

    <!-- HEALTH-CHECK - Power Grid -->
      <div class="row contents">
        <div class="col-12">
          <h2>The Chaikin <span>Power Grid</span></h2>
        </div>

        <div class="col-12 section__chart">
          <div class="chart__header">
            <h3 class="green">Strong Industries</h3>
            <div class="divider__long divider__long--green"></div>
          </div>

          <div class="powerGrid">
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

          <div class="powerGrid">
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
        </div>

        <div class="col-12 section__chart">
          <div class="chart__header">
            <h3 class="red">Weak Industries</h3>
            <div class="divider__long divider__long--red"></div>
          </div>

          <div class="powerGrid">
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

          <div class="powerGrid">
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

        <div class="col-12 expand-collapse">
          <img src="./assets/imgs/icon_chevron--up.svg">
          <p>COLLAPSE</p>
        </div>
      </div>

      <div  class="col-12">
        <div class="row section__disclaimer">
          <h4>Disclaimer</h4>
          <p class="disclaimer">Etiam vel nisi laoreet, semper felis sit amet, egestas libero. Ut quis pretium tortor, eget semper lacus. Sed at leo lectus. Donec imperdiet erat eu enim vestibulum, ut interdum odio laoreet. Nam vel tellus vel ligula posuere iaculis. Sed porta imperdiet leo sed posuere. Aenean maximus lacus tortor, nec interdum diam posuere non.</p>
        </div>
      </div>
    </div>`,
  styleUrls: ['./health-check.component.scss']
})
export class HealthCheckComponent implements OnInit {
  private uid: string;

  constructor(private authService: AuthService,
              private healthCheck: HealthCheckService) {
  }

  ngOnInit() {
    this.authService.currentUser$
      .map(usr => this.uid = usr['UID'])
      .flatMap(uid => {
        console.log('uid', uid);
        return this.healthCheck.getAuthorizedLists(uid);
      })
      .take(1)
      .subscribe(res => console.log('res', res));
  }

}

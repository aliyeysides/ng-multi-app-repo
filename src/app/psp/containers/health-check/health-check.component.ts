import {Component, OnInit} from '@angular/core';
import {HealthCheckService} from '../../../services/health-check.service';
import {AuthService} from '../../../services/auth.service';

import * as moment from 'moment';
import {PortfolioStatus, StockStatus} from '../../../shared/models/health-check';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'cpt-health-check',
  template: `
    <!-- PANEL CONTENTS -->
    <div class="container-fluid component component--healthcheck">
      <div class="row contents">

      <!-- HEALTH-CHECK - Intro -->
        <cpt-psp-portfolio-overview [status]="portfolioStatus"></cpt-psp-portfolio-overview>
      <!-- HEALTH-CHECK - Stock Movements -->
        <cpt-psp-stock-movements [stocks]="stocksStatus"></cpt-psp-stock-movements>

      <!-- HEALTH-CHECK - Ratings Changes -->
        <cpt-psp-rating-changes></cpt-psp-rating-changes>

      <!-- HEALTH-CHECK - Earnings Reports -->
        <cpt-psp-earnings-report></cpt-psp-earnings-report>

      <!-- HEALTH-CHECK - Power Grid -->
        <cpt-psp-power-grid></cpt-psp-power-grid>

      <!-- HEALTH-CHECK - DISCLAIMER -->
        <div  class="col-12 col-lg-8 col-xl-8 section section--disclaimer">
          <div class="row">
            <div class="col-12">
              <div class="divider__long divider__long--green"></div>
            </div>
          </div>
        
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
          // this.healthCheck.getChaikinCalculations(res, startDate, endDate),
          // this.healthCheck.getUserPortfolioStockStatus(res, startDate, endDate),
          // this.healthCheck.getPGRWeeklyChangeDAta(res, startDate, endDate),
          // this.healthCheck.getEarningsSurprise(res, startDate, endDate),
          // this.healthCheck.getAnalystRevisions(res, moment().format('YYYY-MM-DD') ),
          // this.healthCheck.getExpectedEarningsReportsWithPGRValues(this.uid, res, startDate, endDate)
          // this.healthCheck.getPHCGridData(res)
        )
      })
      .take(1)
      .subscribe(res => {
        console.log('res', res);
        // this.portfolioStatus = res[0][0] as PortfolioStatus;
        // this.stocksStatus = res[0][1] as StockStatus[];
        // this.pgrChanges = res[0][2]
      });
  }

}

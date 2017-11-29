import {Component, OnInit} from '@angular/core';
import {HealthCheckService} from '../../../services/health-check.service';
import {AuthService} from '../../../services/auth.service';

import * as moment from 'moment';
import {
  ChaikinCalculations, PGRChanges, PortfolioStatus, PrognosisData,
  StockStatus
} from '../../../shared/models/health-check';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'cpt-health-check',
  template: `
    <!-- PANEL CONTENTS -->
    <div class="container-fluid component component--healthcheck">
      <div class="row contents">

      <!-- HEALTH-CHECK - Intro -->
        <cpt-psp-portfolio-overview [calc]="calculations" [data]="prognosisData"></cpt-psp-portfolio-overview>
      <!-- HEALTH-CHECK - Stock Movements -->
        <cpt-psp-stock-movements [stocks]="stocksStatus"></cpt-psp-stock-movements>

      <!-- HEALTH-CHECK - Ratings Changes -->
        <cpt-psp-rating-changes [alerts]="pgrChanges"></cpt-psp-rating-changes>

      <!-- HEALTH-CHECK - Earnings Reports -->
        <cpt-psp-earnings-report></cpt-psp-earnings-report>

      <!-- HEALTH-CHECK - Power Grid -->
        <cpt-psp-power-grid></cpt-psp-power-grid>

      <!-- HEALTH-CHECK - DISCLAIMER -->
        <div  class="col-12 col-lg-8 col-xl-8 section section--disclaimer">

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

  public calculations: ChaikinCalculations;
  public portfolioStatus: PortfolioStatus;
  public stocksStatus: Array<StockStatus>;
  public prognosisData: PrognosisData;
  public pgrChanges: PGRChanges;

  constructor(private authService: AuthService,
              private healthCheck: HealthCheckService) {
  }

  ngOnInit() {
    this.authService.currentUser$
      .map(usr => this.uid = usr['UID'])
      .flatMap(uid => this.healthCheck.getAuthorizedLists(uid))
      .map(res => this.listId = res[0]['User Lists'][0]['list_id'] )
      .switchMap(listId => {
        const startDate = moment().subtract(5, 'weeks').day(-2).format('YYYY-MM-DD'),
              endDate = moment(startDate).add(7, 'days').format('YYYY-MM-DD');
        return Observable.combineLatest(
          this.healthCheck.getChaikinCalculations(listId, startDate, endDate),
          this.healthCheck.getPrognosisData(listId),
          this.healthCheck.getUserPortfolioStockStatus(listId, startDate, endDate),
          this.healthCheck.getPGRWeeklyChangeDAta(listId, startDate, moment().format('YYYY-MM-DD')),
          // this.healthCheck.getEarningsSurprise(listId, startDate, endDate),
          // this.healthCheck.getAnalystRevisions(listId, moment().format('YYYY-MM-DD') ),
          // this.healthCheck.getExpectedEarningsReportsWithPGRValues(this.uid, listId, startDate, endDate)
          // this.healthCheck.getPHCGridData(listId)
        )
      })
      .take(1)
      .subscribe(res => {
        console.log('res', res);
        this.calculations = res[0] as ChaikinCalculations;
        this.prognosisData = res[1] as PrognosisData;
        this.portfolioStatus = res[2][Object.keys(res[2])[0]] as PortfolioStatus;
        this.pgrChanges = res[3] as PGRChanges;
        // this.stocksStatus = res[0][1] as StockStatus[];
      });
  }

}

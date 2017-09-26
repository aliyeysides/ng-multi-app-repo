import {Component, OnDestroy, OnInit} from '@angular/core';
import {MarketsSummaryService} from '../../services/markets-summary.service';
import {Subject} from 'rxjs/Subject';

import * as moment from 'moment';
import {Moment} from 'moment';

export interface MarketData {
  change: number;
  last: number;
  name: string;
  percent_change: number;
  symbol: string;
}

@Component({
  selector: 'cpt-market-summary',
  template: `
    <h3>Markets</h3>
    <p>As of {{currentTime}}</p>
    <p>SPY {{SPY?.change}}%</p>
    <p>DJI {{DJI?.change}}%</p>
    <p>NASD {{QQQ?.change}}%</p>
  `,
  styleUrls: ['./market-summary.component.scss']
})
export class MarketSummaryComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  public SPY: MarketData;
  public DJI: MarketData;
  public QQQ: MarketData;
  private presentDate: Moment;
  public currentTime: string;

  constructor(private marketsSummary: MarketsSummaryService) {
  }

  ngOnInit() {
    this.init();
    setInterval(() => {
      this.initialMarketSectorData();
      this.presentDate = moment(new Date, 'America/New_York');
      this.currentTime = this.presentDate.format('h:mma');
      }, 1000 * 60);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public initialMarketSectorData() {
    this.marketsSummary.initialMarketSectorData({components: 'majorMarketIndices,sectors'})
      .takeUntil(this.ngUnsubscribe)
      .subscribe(res => {
        const indicies = res['market_indices'];
        this.SPY = indicies[0];
        this.DJI = indicies[1];
        this.QQQ = indicies[2];
      });
  }

  private init() {
    this.presentDate = moment(new Date, 'America/New_York');
    this.currentTime = this.presentDate.format('h:mma');
    this.initialMarketSectorData();
  }

}

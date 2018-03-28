import {OnDestroy, OnInit, NgZone} from '@angular/core';
import {MarketsSummaryService} from '../../../services/markets-summary.service';
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

export class BaseMarketSummaryComponent implements OnInit, OnDestroy {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();

  public fadeInDownSPYState: string;
  public fadeInDownDJIState: string;
  public fadeInDownQQQState: string;

  public SPY: MarketData;
  public DJI: MarketData;
  public QQQ: MarketData;

  protected presentDate: Moment;
  public currentTime: string;

  constructor(public marketsSummary: MarketsSummaryService,
              public zone: NgZone) {
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
        if (this.SPY && this.DJI && this.QQQ) {
          if (Object.is(this.SPY.change, indicies[0].change) != true) {
            this.SPY = indicies[0];
            this.triggerSPYAnimation();
          }
          if (Object.is(this.DJI.change, indicies[1].change) != true) {
            this.DJI = indicies[1];
            this.triggerDJIAnimation();
          }
          if (Object.is(this.QQQ.change, indicies[2].change) != true) {
            this.QQQ = indicies[2];
            this.triggerQQQAnimation();
          }
          return;
        }
        this.SPY = indicies[0];
        this.DJI = indicies[1];
        this.QQQ = indicies[2];
      })
  }

  public triggerSPYAnimation() {
    this.fadeInDownSPYState = 'active';
  }

  public triggerDJIAnimation() {
    this.fadeInDownDJIState = 'active';
  }

  public triggerQQQAnimation() {
    this.fadeInDownQQQState = 'active';
  }

  public resetSPY() {
    this.zone.run(() => {
      this.fadeInDownSPYState = 'inactive';
    });
  }

  public resetDJI() {
    this.zone.run(() => {
      this.fadeInDownDJIState = 'inactive';
    });
  }

  public resetQQQ() {
    this.zone.run(() => {
      this.fadeInDownQQQState = 'inactive';
    });
  }

  protected init() {
    this.presentDate = moment(new Date, 'America/New_York');
    this.currentTime = this.presentDate.format('h:mma');
    this.initialMarketSectorData();
  }

}

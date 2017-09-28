import {Component, OnDestroy, OnInit, NgZone} from '@angular/core';
import {MarketsSummaryService} from '../../services/markets-summary.service';
import {Subject} from 'rxjs/Subject';

import * as moment from 'moment';
import {Moment} from 'moment';
import {fadeInDown} from '../../../shared/animations/fadeInDown';

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
    <div class="market-summary__contents">
      <h3>Markets</h3>
      <p class="current-time">As of {{currentTime}}</p>
      <p class="indice">
        SPY&nbsp;
        <span [@fadeInDown]="fadeInDownSPYState" (@fadeInDown.done)="resetSPY()"
              [ngClass]="{'up-change':SPY?.change>0,'down-change':SPY?.change<0}">
          {{SPY?.change}}%
        </span>
      </p>
      <p class="indice">
        DJI&nbsp;
        <span [@fadeInDown]="fadeInDownDJIState" (@fadeInDown.done)="resetDJI()"
              [ngClass]="{'up-change':DJI?.change>0,'down-change':DJI?.change<0}">
          {{DJI?.change}}%
        </span>
      </p>
      <p class="indice">
        QQQ&nbsp;
        <span [@fadeInDown]="fadeInDownQQQState" (@fadeInDown.done)="resetQQQ()"
              [ngClass]="{'up-change':QQQ?.change>0,'down-change':QQQ?.change<0}">
          {{QQQ?.change}}%
        </span>
      </p>
    </div>
  `,
  animations: [fadeInDown()],
  styleUrls: ['./market-summary.component.scss']
})
export class MarketSummaryComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  public fadeInDownSPYState: string;
  public fadeInDownDJIState: string;
  public fadeInDownQQQState: string;

  public SPY: MarketData;
  public DJI: MarketData;
  public QQQ: MarketData;

  private presentDate: Moment;
  public currentTime: string;

  constructor(private marketsSummary: MarketsSummaryService,
              private zone: NgZone) {
  }

  ngOnInit() {
    this.init();
    setInterval(() => {
      this.initialMarketSectorData();
      this.presentDate = moment(new Date, 'America/New_York');
      this.currentTime = this.presentDate.format('h:mma');
    }, 1000 * 60 );
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

  private init() {
    this.presentDate = moment(new Date, 'America/New_York');
    this.currentTime = this.presentDate.format('h:mma');
    this.initialMarketSectorData();
  }

}

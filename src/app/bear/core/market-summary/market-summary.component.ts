import {Component, OnDestroy, OnInit, NgZone} from '@angular/core';
import {MarketsSummaryService} from '../../../services/markets-summary.service';

import * as moment from 'moment';
import {fadeInDown} from '../../../shared/animations/fadeInDown';
import {BaseMarketSummaryComponent} from '../../../shared/components/market-summary';


@Component({
  selector: 'cpt-market-summary',
  template: `
    <div class="market-summary__contents">
      <p class="indice">
        <span>
          <img *ngIf="SPY?.change<0" src="./assets/imgs/icon_arrow--down.svg">
          <img *ngIf="SPY?.change>0" src="./assets/imgs/icon_arrow--up.svg">
          <img *ngIf="SPY?.change==0" src="./assets/imgs/icon_arrow--nochange.svg">
        </span>
        SPY&nbsp;
        <span [@fadeInDown]="fadeInDownSPYState" (@fadeInDown.done)="resetSPY()"
              [ngClass]="{'up-change':SPY?.change>0,'down-change':SPY?.change<0}">
          <span *ngIf="SPY?.change>0" class="up-change">+</span>{{SPY?.percent_change.toFixed(2) }}%
        </span>
      </p>
      <p class="indice">
        <span>
          <img *ngIf="DJI?.change<0" src="./assets/imgs/icon_arrow--down.svg">
          <img *ngIf="DJI?.change>0" src="./assets/imgs/icon_arrow--up.svg">
          <img *ngIf="DJI?.change==0" src="./assets/imgs/icon_arrow--nochange.svg">
        </span>
        DIA&nbsp;
        <span [@fadeInDown]="fadeInDownDJIState" (@fadeInDown.done)="resetDJI()"
              [ngClass]="{'up-change':DJI?.change>0,'down-change':DJI?.change<0}">
          <span *ngIf="DJI?.change>0" class="up-change">+</span>{{DJI?.percent_change.toFixed(2) }}%
        </span>
      </p>
      <p class="indice">
        <span>
          <img *ngIf="QQQ?.change<0" src="./assets/imgs/icon_arrow--down.svg">
          <img *ngIf="QQQ?.change>0" src="./assets/imgs/icon_arrow--up.svg">
          <img *ngIf="QQQ?.change==0" src="./assets/imgs/icon_arrow--nochange.svg">
        </span>
        QQQ&nbsp;
        <span [@fadeInDown]="fadeInDownQQQState" (@fadeInDown.done)="resetQQQ()"
              [ngClass]="{'up-change':QQQ?.change>0,'down-change':QQQ?.change<0}">
          <span *ngIf="QQQ?.change>0" class="up-change">+</span>{{QQQ?.percent_change.toFixed(2) }}%
        </span>
      </p>
      <div class="market-summary__title">
        <p class="current-time"><sup>*</sup>As of {{ currentTime }}</p>
      </div>
    </div>
  `,
  animations: [fadeInDown()],
  styleUrls: ['./market-summary.component.scss']
})
export class BearMarketSummaryComponent extends BaseMarketSummaryComponent implements OnInit, OnDestroy {

  constructor(public marketsSummary: MarketsSummaryService,
              public zone: NgZone) {
    super(marketsSummary, zone);
  }

}

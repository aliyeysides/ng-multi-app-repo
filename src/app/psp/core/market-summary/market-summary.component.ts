import {Component, OnInit, NgZone} from '@angular/core';
import {MarketsSummaryService} from '../../../services/markets-summary.service';
import {BaseMarketSummaryComponent} from '../../../shared/components/market-summary';
import {fadeInDown} from '../../../shared/animations/fadeInDown';

@Component({
  selector: 'cpt-psp-market-summary',
  template: `
    <div class="market-summary__contents">
      <p class="indice">
        <span>
          <i *ngIf="SPY?.change<0" class="fas fa-arrow-down red"></i>
          <i *ngIf="SPY?.change>0" class="fas fa-arrow-up green"></i>
          <i *ngIf="SPY?.change==0" class="fas fa-minus grey"></i>
        </span>
        <b>SPY</b> <span class="hidden-lg-down">(S&amp;P&nbsp;500)</span>
        <span [@fadeInDown]="fadeInDownSPYState" (@fadeInDown.done)="resetSPY()"
              [ngClass]="{'up-change':SPY?.change>0,'down-change':SPY?.change<0}">
          <span class="market-data">
            <span class="last-price">{{ SPY?.last | decimal }}</span>
            <span class="change-price">{{ SPY?.change | decimal }}</span>
            <span class="change-percent">(<span *ngIf="SPY?.change>0" class="up-change">+</span>{{SPY?.percent_change.toFixed(2) }}%)</span>
          </span>
        </span>
      </p>
      <p class="indice">
        <span>
          <i *ngIf="DJI?.change<0" class="fas fa-arrow-down red"></i>
          <i *ngIf="DJI?.change>0" class="fas fa-arrow-up green"></i>
          <i *ngIf="DJI?.change==0" class="fas fa-minus grey"></i>
        </span>
        <b>DIA</b> <span class="hidden-lg-down">(DOW 30)</span>
        <span [@fadeInDown]="fadeInDownDJIState" (@fadeInDown.done)="resetDJI()"
              [ngClass]="{'up-change':DJI?.change>0,'down-change':DJI?.change<0}">
          <span class="market-data">
            <span class="last-price">{{ DJI?.last | decimal }}</span>
            <span class="change-price">{{ DJI?.change | decimal }}</span>
            <span class="change-percent">(<span *ngIf="DJI?.change>0" class="up-change">+</span>{{DJI?.percent_change.toFixed(2) }}%)</span>
          </span>
        </span>
      </p>
      <p class="indice">
        <span>
          <i *ngIf="QQQ?.change<0" class="fas fa-arrow-down red"></i>
          <i *ngIf="QQQ?.change>0" class="fas fa-arrow-up green"></i>
          <i *ngIf="QQQ?.change==0" class="fas fa-minus grey"></i>
        </span>
        <b>QQQ</b> <span class="hidden-lg-down">(NASDAQ)</span>
        <span [@fadeInDown]="fadeInDownQQQState" (@fadeInDown.done)="resetQQQ()"
              [ngClass]="{'up-change':QQQ?.change>0,'down-change':QQQ?.change<0}">
          <span class="market-data">
            <span class="last-price">{{ QQQ?.last | decimal }}</span>
            <span class="change-price">{{ QQQ?.change | decimal }}</span>
            <span class="change-percent">(<span *ngIf="QQQ?.change>0" class="up-change">+</span>{{QQQ?.percent_change.toFixed(2) }}%)</span>
          </span>
        </span>
      </p>
    </div>
  `,
  styleUrls: ['./market-summary.component.scss'],
  animations: [fadeInDown()]
})
export class PspMarketSummaryComponent extends BaseMarketSummaryComponent implements OnInit {

  constructor(public marketsSummary: MarketsSummaryService,
              public zone: NgZone) {
    super(marketsSummary, zone);
  }

}

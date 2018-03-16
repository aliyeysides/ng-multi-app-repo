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
        <b>SPY</b> (S&amp;P&nbsp;500)&nbsp;
        <span [@fadeInDown]="fadeInDownSPYState" (@fadeInDown.done)="resetSPY()"
              [ngClass]="{'up-change':SPY?.change>0,'down-change':SPY?.change<0}">
           <b><span *ngIf="SPY?.change>0" class="up-change">+</span>{{SPY?.percent_change.toFixed(2) }}%</b>
        </span>
      </p>
      <p class="indice">
        <span>
          <i *ngIf="DJI?.change<0" class="fas fa-arrow-down red"></i>
          <i *ngIf="DJI?.change>0" class="fas fa-arrow-up green"></i>
          <i *ngIf="DJI?.change==0" class="fas fa-minus grey"></i>
        </span>
        <b>DIA</b> (DOW 30)&nbsp;
        <span [@fadeInDown]="fadeInDownDJIState" (@fadeInDown.done)="resetDJI()"
              [ngClass]="{'up-change':DJI?.change>0,'down-change':DJI?.change<0}">
          <b><span *ngIf="DJI?.change>0" class="up-change">+</span>{{DJI?.percent_change.toFixed(2) }}%</b>
        </span>
      </p>
      <p class="indice">
        <span>
          <i *ngIf="QQQ?.change<0" class="fas fa-arrow-down red"></i>
          <i *ngIf="QQQ?.change>0" class="fas fa-arrow-up green"></i>
          <i *ngIf="QQQ?.change==0" class="fas fa-minus grey"></i>
        </span>
        <b>QQQ</b> (NASDAQ)&nbsp;
        <span [@fadeInDown]="fadeInDownQQQState" (@fadeInDown.done)="resetQQQ()"
              [ngClass]="{'up-change':QQQ?.change>0,'down-change':QQQ?.change<0}">
          <b><span *ngIf="QQQ?.change>0" class="up-change">+</span>{{QQQ?.percent_change.toFixed(2) }}%</b>
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

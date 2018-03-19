import {Component, Input, OnInit, ElementRef} from '@angular/core';

declare var gtag: Function;

interface SummaryStatus {
  financials: string,
  earnings: string,
  technicals: string,
  experts: string
}

@Component({
  selector: 'cpt-psp-report-anchor-options',
  template: `
        <div class="header__button header__button--anchors">

          <!-- FINANCIALS -->
          <button mat-raised-button matTooltip="Jump to Financials" [matTooltipPosition]="'below'" [matTooltipShowDelay]="500" class="anchor neutral"
               [ngClass]="{'veryBullish': status?.financials=='Very Bullish',
               'bullish': status?.financials=='Bullish',
               'neutral': status?.financials=='Neutral',
               'bearish': status?.financials=='Bearish',
               'veryBearish': status?.financials=='Very Bearish'}"
               (click)="jumpToFragment(viewChildren['financials'], 'Financials');$event.stopPropagation()">
               <i class="far fa-university" aria-hidden="true"></i>
          </button>

          <!-- EARNINGS -->
          <button mat-raised-button matTooltip="Jump to Earnings" [matTooltipPosition]="'below'" [matTooltipShowDelay]="500" class="anchor bullish"
               [ngClass]="{'veryBullish': status?.earnings=='Very Bullish',
               'bullish': status?.earnings=='Bullish',
               'neutral': status?.earnings=='Neutral',
               'bearish': status?.earnings=='Bearish',
               'veryBearish': status?.earnings=='Very Bearish'}"
               (click)="jumpToFragment(viewChildren['earnings'], 'Earnings');$event.stopPropagation()">
               <i class="far fa-money-bill"></i>
          </button>

          <!-- TECHNICALS -->
          <button mat-raised-button matTooltip="Jump to Technicals" [matTooltipPosition]="'below'" [matTooltipShowDelay]="500" class="anchor bearish"
               [ngClass]="{'veryBullish': status?.technicals=='Very Bullish',
               'bullish': status?.technicals=='Bullish',
               'neutral': status?.technicals=='Neutral',
               'bearish': status?.technicals=='Bearish',
               'veryBearish': status?.technicals=='Very Bearish'}"
               (click)="jumpToFragment(viewChildren['technicals'], 'Technicals');$event.stopPropagation()">
               <i class="far fa-chart-pie"></i>
          </button>

          <!-- EXPERTS -->
          <button mat-raised-button matTooltip="Jump to Experts" [matTooltipPosition]="'below'" [matTooltipShowDelay]="500" class="anchor veryBullish"
               [ngClass]="{'veryBullish': status?.experts=='Very Bullish',
               'bullish': status?.experts=='Bullish',
               'neutral': status?.experts=='Neutral',
               'bearish': status?.experts=='Bearish',
               'veryBearish': status?.experts=='Very Bearish'}"
               (click)="jumpToFragment(viewChildren['experts'], 'Experts');$event.stopPropagation()">
               <i class="far fa-users" aria-hidden="true"></i>
          </button>
        </div>
  `,
  styleUrls: ['./stock-report.component.scss']
})
export class AnchorOptionsComponent implements OnInit {
  @Input('status') status: SummaryStatus;
  @Input('viewChildren') viewChildren;

  constructor() {}

  ngOnInit() {
    console.log('status', this.status);
    console.log('viewChildren', this.viewChildren);
  }

  jumpToFragment(viewChild: ElementRef, label: string) {
    viewChild.nativeElement.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
    gtag('event', 'report_fragment_clicked', {
      'event_category': 'engagement',
      'event_label': label
    });
  }
}

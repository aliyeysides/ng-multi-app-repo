import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {SignalService} from '../../../../services/signal.service';

@Component({
  selector: 'cpt-discovery-seed',
  template: `
    <div class="discovery__base-stock container-fluid">
      <div class="row no-gutters">
        <div class="base-stock__logo">
          <img class="align-absolute"
               (error)="stock ? stock.logo_url='assets/imgs/img_NO-LOGO--stock.svg' : null"
               src="{{ stock && stock.logo_url != 'N/A' ? stock?.logo_url : 'assets/imgs/img_NO-LOGO--stock.svg' }}">
          <!--<p class="align-absolute">{{ stock ? stock['name'] : null }}</p>-->
        </div>
        <div class="base-stock__symbol">
          <p class="ticker">
            <img class="" src="{{ appendPGRImage(stock ? stock['PGR'] : null, stock ? stock['raw_PGR'] : null) }}">
            {{ stock ? stock['symbol'] : null }}</p>
          <p class="company-name">{{ stock ? stock['name'] : null }}</p>
          <p class="company-industry">{{ stock ? stock['industry'] : null }}</p>
        </div>
        <div class="base-stock__price">
          <p class="last-price" [ngClass]="{'up-change' : stock?.Change > 0, 'down-change' : stock?.Change < 0 }">
            {{ stock ? stock['Last'].toFixed(2) : null }}</p>
          <p class="change" [ngClass]="{'up-change' : stock?.Change > 0, 'down-change' : stock?.Change < 0 }">
            <span *ngIf="stock?.Change>0" class="up-change">+</span>{{ stock ? stock['Change'].toFixed(2) : null }}</p>
          <p class="percentage" [ngClass]="{'up-change' : stock?.Change > 0, 'down-change' : stock?.Change < 0 }">
            (<span *ngIf="stock?.Change>0" class="up-change">+</span>{{ stock ? stock['Percentage'].toFixed(2) : null }}%)</p>
        </div>
        <div class="base-stock__PGR">
          <p class="PGR__text"
             [ngClass]="{'veryBullish':stock?.PGR==5,'bullish':stock?.PGR==4,'neutral':stock?.PGR==3,'bearish':stock?.PGR==2,'veryBearish':stock?.PGR==1}">
            <span>Power Gauge:</span> {{ appendPGRText(stock ? stock['PGR'] : null, stock ? stock['raw_PGR'] : null) }}</p>
          <ul *ngIf="stock" class="pgr__sliders">
            <li>
              <div class="sliderBar-container">
                <div class="sliderProgress">
                  <div [ngClass]="appendSliderClass(stock['pgr_factors_rating']['financial'])"></div>
                  <div class="sliderBar"
                       [ngClass]="appendSliderBarClass(stock['pgr_factors_rating']['financial'])"
                       role="progressbar" aria-valuemin="0" aria-valuemax="100">
                  </div>
                </div>
                <div class="pgr__label">
                  <p>Financials</p>
                </div>
              </div>
            </li>
            <li>
              <div class="sliderBar-container">
                <div class="sliderProgress">
                  <div [ngClass]="appendSliderClass(stock['pgr_factors_rating']['earning'])"></div>
                  <div class="sliderBar"
                       [ngClass]="appendSliderBarClass(stock['pgr_factors_rating']['earning'])"
                       role="progressbar" aria-valuemin="0" aria-valuemax="100">
                  </div>
                </div>
                <div class="pgr__label">
                  <p>Earnings</p>
                </div>
              </div>
            </li>
            <li>
              <div class="sliderBar-container">
                <div class="sliderProgress">
                  <div [ngClass]="appendSliderClass(stock['pgr_factors_rating']['technical'])"></div>
                  <div class="sliderBar"
                       [ngClass]="appendSliderBarClass(stock['pgr_factors_rating']['technical'])"
                       role="progressbar" aria-valuemin="0" aria-valuemax="100">
                  </div>
                </div>
                <div class="pgr__label">
                  <p>Technicals</p>
                </div>
              </div>
            </li>
            <li>
              <div class="sliderBar-container">
                <div class="sliderProgress">
                  <div [ngClass]="appendSliderClass(stock['pgr_factors_rating']['expert'])"></div>
                  <div class="sliderBar"
                       [ngClass]="appendSliderBarClass(stock['pgr_factors_rating']['expert'])"
                       role="progressbar" aria-valuemin="0" aria-valuemax="100">
                  </div>
                </div>
                <div class="pgr__label">
                  <p>Experts</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="base-stock__factors">
          <ul>
            <ng-container *ngFor="let factor of stock ? stock['significant_factors'] : null ">
              <li *ngIf="factor != ''">{{ factor }}</li>
            </ng-container>
          </ul>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['../discovery.component.scss']
})
export class DiscoverySeedComponent implements AfterViewInit, OnDestroy {

  @Output('addToListClicked') public addToListClicked = new EventEmitter<object>();
  @Output('viewStockReportClicked') public viewStockReportClicked = new EventEmitter();

  @Input('metaInfo') stock;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private signalService: SignalService) {
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public appendPGRImage(pgr: number, rawPgr: number) {
    return this.signalService.appendPGRImage(pgr, rawPgr);
  }

  public appendPGRText(pgr: number, rawPgr: number) {
    return this.signalService.appendPGRText(pgr, rawPgr);
  }

  public appendSliderClass(pgr) {
    return this.signalService.appendSliderClass(pgr);
  }

  public appendSliderBarClass(pgr) {
    return this.signalService.appendSliderBarClass(pgr);
  }

}

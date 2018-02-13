import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {PreviousBearsModalComponent} from './modals/previous-modal.component';
import {WeeklyCommentaryModalComponent} from './modals/commentary-modal.component';
import {WordpressService} from '../../../../services/wordpress.service';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {IdeasService} from '../../../../services/ideas.service';
import {Idea} from '../../../../shared/models/idea';
import {Subscription} from 'rxjs/Subscription';
import {SignalService} from '../../../../services/signal.service';
import {Router} from '@angular/router';

declare let gtag: Function;

@Component({
  selector: 'cpt-bear-of-the-week',
  template: `
    <div class="dashboard__panel dashboard__panel--bearpick" [ngBusy]="loading">
      <div class="dash-head">
        <h4>Bear of the Week</h4>
        <a (click)="openPreviousModal()" class="dash-head__button">
          <i class="fa fa-calendar" aria-hidden="true"></i>
          <span>&nbsp;Previous</span>
        </a>
      </div>
      <div class="dash-body dash-body--bearpick">
        <div class="container bearpick__container">
          <div class="row no-gutters">
            <div class="col-7 col-xl-7">
              <div class="ticker-info">
                <p (click)="gotoReport(stockDataMeta?.symbol)" class="ticker">
                  <span><img class="rating" src="{{ pgrImgUrl }}"></span>
                  {{ stockDataMeta?.symbol }}
                </p>
                <p class=" company-name">{{ stockDataMeta?.name }}</p>
              </div>
              <div class="price-data">
                <p class="data price"
                   [ngClass]="{'down-change': stockDataMeta?.Change<0,'up-change':stockDataMeta?.Change>0}">
                  {{ stockDataMeta?.Last | decimal }}</p>
                <p class="data change"
                   [ngClass]="{'down-change': stockDataMeta?.Change<0,'up-change':stockDataMeta?.Change>0}">
                  <span>{{ stockDataMeta?.Change | decimal }}</span>
                  <span>(<span
                    *ngIf="stockDataMeta?.Change>0">+</span>{{ stockDataMeta ? (stockDataMeta['Percentage '] | decimal) : null
                    }}%)</span></p>
              </div>
              <div (click)="openCommentaryModal()" class="link__see-more">
                <a class="">See Commentary <i class="fa fa-long-arrow-right" aria-hidden="true"></i></a>
              </div>
            </div>
            <div class="quick-view__pgr col-5 col-xl-5">
              <p class="pgr__title">Power Gauge Rating:</p>
              <p class="pgr__text"
                 [ngClass]="{'veryBearish':pgrText=='Very Bearish','bearish':pgrText=='Bearish','neutral':pgrText=='Neutral','bullish':pgrText=='Bullish','veryBullish':pgrText=='Very Bullish'}">
                {{ pgrText }}</p>
              <ul class="pgr__sliders row">
                <li class="col-12">
                  <div class="sliderBar-container">
                    <div class="sliderProgress">
                      <div [ngClass]="appendSliderClass(stockDataPGR?.Financials)"></div>
                      <div [ngClass]="appendSliderBarClass(stockDataPGR?.Financials)" class="sliderBar"
                           role="progressbar"
                           aria-valuemin="0" aria-valuemax="100">
                      </div>
                    </div>
                    <div class="pgr__label">
                      <p>Financials</p>
                    </div>
                  </div>
                </li>
                <li class="col-12">
                  <div class="sliderBar-container">
                    <div class="sliderProgress">
                      <div [ngClass]="appendSliderClass(stockDataPGR?.Earnings)"></div>
                      <div [ngClass]="appendSliderBarClass(stockDataPGR?.Earnings)" class="sliderBar" role="progressbar"
                           aria-valuemin="0" aria-valuemax="100">
                      </div>
                    </div>
                    <div class="pgr__label">
                      <p>Earnings</p>
                    </div>
                  </div>
                </li>
                <li class="col-12">
                  <div class="sliderBar-container">
                    <div class="sliderProgress">
                      <div [ngClass]="appendSliderClass(stockDataPGR?.Technicals)"></div>
                      <div [ngClass]="appendSliderBarClass(stockDataPGR?.Technicals)" class="sliderBar"
                           role="progressbar"
                           aria-valuemin="0" aria-valuemax="100">
                      </div>
                    </div>
                    <div class="pgr__label">
                      <p>Technicals</p>
                    </div>
                  </div>
                </li>
                <li class="col-12">
                  <div class="sliderBar-container">
                    <div class="sliderProgress">
                      <div [ngClass]="appendSliderClass(stockDataPGR?.Experts)"></div>
                      <div [ngClass]="appendSliderBarClass(stockDataPGR?.Experts)" class="sliderBar" role="progressbar"
                           aria-valuemin="0" aria-valuemax="100">
                      </div>
                    </div>
                    <div class="pgr__label">
                      <p>Experts</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./bear-of-the-week.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BearOfTheWeekComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  public bearModalRef: BsModalRef;
  public post: object;
  public ticker: string;
  public stockDataMeta: Idea;
  public stockDataPGR?: number;
  public pgrText: string;
  public pgrImgUrl: string;
  public loading: Subscription;
  public config = {
    animated: true,
    keyboard: true,
    backdrop: false,
    ignoreBackdropClick: false,
    class: 'modal-dialog--fullscreen',
  };
  public config2 = {
    animated: true,
    keyboard: true,
    backdrop: false,
    ignoreBackdropClick: false,
    class: 'modal-dialog--popup',
  };

  constructor(public modalService: BsModalService,
              private ideasService: IdeasService,
              private router: Router,
              private wordpressService: WordpressService,
              private signalService: SignalService) {
  }

  ngOnInit() {
    this.loading = this.refreshData();

    setInterval(() => {
      this.refreshData()
    }, 1000 * 60);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public refreshData() {
    return this.wordpressService.getWordPressJson('48', 1)
      .take(1)
      .filter(x => x !== undefined)
      .flatMap(res => Observable.of(res['0']['48'][0]))
      .map(post => {
        this.post = post;
        this.wordpressService.assignWordPressDateProperties([post]);
        return this.wordpressService.getInsightPostTicker(post);
      })
      .flatMap(ticker => {
        this.ticker = ticker.trim();
        return this.ideasService.getStockCardData(this.ticker);
      })
      .subscribe(data => {
        this.stockDataMeta = data['meta-info'];
        this.stockDataPGR = data['pgr'];
        this.pgrText = this.appendPGRText(this.stockDataPGR['Corrected PGR Value'], this.stockDataPGR['PGR Value']);
        this.pgrImgUrl = this.appendPGRImage(this.stockDataPGR['Corrected PGR Value'], this.stockDataPGR['PGR Value']);
      })
  }

  public openPreviousModal() {
    this.bearModalRef = this.modalService.show(PreviousBearsModalComponent, this.config2);
  }

  public openCommentaryModal() {
    this.bearModalRef = this.modalService.show(WeeklyCommentaryModalComponent, this.config);
    this.bearModalRef.content.commentary = this.wordpressService.getInsightPostBody(this.post);
    this.bearModalRef.content.date = this.post['post_date_formatted'];
    gtag('event', 'bear_of_the_week__commentary_opened', {
      'event_category': 'engagement',
      'event_label': this.ticker
    });
  }

  public appendPGRImage(pgr: number, rawPgr: number) {
    return this.signalService.appendPGRImage(pgr, rawPgr);
  }

  public appendSliderClass(pgr: number) {
    return this.signalService.appendSliderClass(pgr);
  }

  public appendSliderBarClass(pgr: number) {
    return this.signalService.appendSliderBarClass(pgr);
  }

  public appendPGRText(pgr: number, rawPgr: number) {
    return this.signalService.appendPGRText(pgr, rawPgr);
  }

  public gotoReport(ticker: string) {
    this.ideasService.selectedStock = ticker;
    this.router.navigate(['/report', ticker]);
  }
}

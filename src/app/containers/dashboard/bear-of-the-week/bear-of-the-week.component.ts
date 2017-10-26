import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {PreviousBearsModalComponent} from './modals/previous-modal.component';
import {WeeklyCommentaryModalComponent} from './modals/commentary-modal.component';
import {WordpressService} from '../../../core/services/wordpress.service';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {IdeasService} from '../../../core/services/ideas.service';
import {Idea} from '../../../shared/models/idea';
import {Subscription} from 'rxjs/Subscription';
import {SignalService} from '../../../core/services/signal.service';

@Component({
  selector: 'cpt-bear-of-the-week',
  template: `
    <div class="insights__container insights__container--small" [ngBusy]="loading">
      <div class="post-head post-head--pick">
        <h4>Bear of the Week</h4>
        <div class="divider-h"></div>
        <p class="header__post-date">{{ post ? post['post_date_formatted'] : null }}</p>
        <a (click)="openPreviousModal()" class="post-head__button">
          <i class="fa fa-calendar" aria-hidden="true"></i>
          <span>&nbsp;Previous</span>
        </a>
      </div>
      <div class="post-body post-body--bearpick">
        <div class="container">
          <div class="row no-gutters">
            <div class="col-6">
              <p class="ticker">
                <img class="rating" src="{{ appendPGRImage(stockDataPGR) }}">
                <span [innerHTML]="ticker"></span>
              </p>
            </div>
            <div class="col-6 price-data">
              <p class="data data--change"
                 [ngClass]="{'down-change':stockDataMeta?.Change<0, 'up-change':stockDataMeta?.Change>0}">
                ({{ stockDataMeta?.Change.toFixed(2) }}%)</p>
              <p class="data" [ngClass]="{'down-change':stockDataMeta?.Change<0, 'up-change':stockDataMeta?.Change>0}">
                {{ stockDataMeta?.Last.toFixed(2) }}</p>
            </div>
          </div>
          <div class="row">
            <div class="col-6">
              <p class="company-name">{{ stockDataMeta?.name }}</p>
            </div>
            <div class="col-6">
              <p class="industry-name">{{ stockDataMeta?.industry_name }}</p>
            </div>
          </div>
          <div (click)="openCommentaryModal()" class="row">
            <div class="link__see-more col-sm-12">
              <a class="">See Commentary <i class="fa fa-long-arrow-right" aria-hidden="true"></i></a>
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
  public stockDataPGR: number;
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
        this.stockDataPGR = data['pgr']['PGR Value'];
      })
  }

  public openPreviousModal() {
    this.bearModalRef = this.modalService.show(PreviousBearsModalComponent, this.config2);
  }

  public openCommentaryModal() {
    this.bearModalRef = this.modalService.show(WeeklyCommentaryModalComponent, this.config);
    this.bearModalRef.content.commentary = this.wordpressService.getInsightPostBody(this.post);
    this.bearModalRef.content.date = this.post['post_date_formatted'];
  }

  public appendPGRImage(pgr: number, rawPgr: number) {
    return this.signalService.appendPGRImage(pgr, rawPgr);
  }
}

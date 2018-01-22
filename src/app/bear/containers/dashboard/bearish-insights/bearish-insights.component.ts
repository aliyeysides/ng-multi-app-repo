import {Component, OnDestroy, OnInit} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {PreviousInsightsModalComponent} from './modals/previous-modal.component';
import {InsightsCommentaryModalComponent} from './modals/commentary-modal.component';
import {WordpressService} from '../../../../services/wordpress.service';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';

declare let gtag: Function;

@Component({
  selector: 'cpt-bearish-insights',
  template: `
    <div class="insights__container">
      <div class="post-head">
        <h2>Mastering The Bear</h2>
        <div class="divider-h"></div>
        <p class="header__post-date">{{ post ? post['post_date_formatted'] : null }}</p>
        <a (click)="openPreviousModal()" class="post-head__button">
          <i class="fa fa-calendar" aria-hidden="true"></i>
          <span>&nbsp;Previous</span>
        </a>
      </div>
      <div class="post-body post-body--insights" [ngBusy]="loading">
        <div [innerHtml]="commentary"></div>
      </div>
      <div (click)="openCommentaryModal()" class="link__read-all">
        <a>Read the full commentary &nbsp;<i class="fa fa-long-arrow-right" aria-hidden="true"></i></a>
      </div>
    </div>
  `,
  styleUrls: ['./bearish-insights.component.scss']
})
export class BearishInsightsComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  public loading: Subscription;
  public insightsModalRef: BsModalRef;
  public title: string;
  public post: object;
  public commentary: string;
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
              private wordpressService: WordpressService) {
  }

  ngOnInit() {
    this.loading = this.wordpressService.getWordPressJson('47', 1)
      .takeUntil(this.ngUnsubscribe)
      .filter(x => x !== undefined)
      .flatMap(res => Observable.of(res['0']['47'][0]))
      .subscribe(post => {
        this.post = post;
        this.title = post['post_title'];
        this.commentary = this.wordpressService.getInsightPostBody(this.post);
        this.wordpressService.assignWordPressDateProperties([post]);
      })
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public openPreviousModal() {
    this.insightsModalRef = this.modalService.show(PreviousInsightsModalComponent, this.config2);
  }

  public openCommentaryModal() {
    this.insightsModalRef = this.modalService.show(InsightsCommentaryModalComponent, this.config);
    this.insightsModalRef.content.title = this.title;
    this.insightsModalRef.content.commentary = this.commentary;
    this.insightsModalRef.content.date = this.post['post_date_formatted'];
    gtag('event', 'insight_opened', {
      'event_category': 'engagement',
      'event_label': this.title
    });
  }

}


import {Component, OnDestroy, OnInit} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {Subscription} from 'rxjs/Subscription';
import {WordpressService} from '../../../../../core/services/wordpress.service';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {InsightsCommentaryModalComponent} from './commentary-modal.component';

declare let gtag: Function;

@Component({
  selector: 'cpt-bear-previous-insights-modal',
  template: `
    <div class="insights__container insights__container--large insights__container--modal">
      <div class="post-head post-head--insights">
        <h2 class="modal-title pull-left">{{ title }}</h2>
        <button type="button" class="post-head__button" aria-label="Close" (click)="bsModalRef.hide()">
          <a class="">
            <i class="fa fa-times-circle" aria-hidden="true"></i>
            <span>&nbsp;Close</span>
          </a>
        </button>
      </div>
      <div class="post-body">
        <ul [ngBusy]="loading">
          <li (click)="openCommentaryModal(post)" *ngFor="let post of posts">
            <p class="header__post-date">
              <i class="fa fa-calendar-o" aria-hidden="true"></i>
              &nbsp; {{ post['post_date_formatted'] }}
            </p>
            <h5>{{ post['post_title'] }}</h5>
          </li>
        </ul>
      </div>
    </div>
  `,
  styleUrls: ['./previous-modal.component.scss']
})
export class PreviousInsightsModalComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  public title: string;
  public posts: any[] = [];
  public loading: Subscription;
  public insightsModalRef: BsModalRef;
  public config = {
    animated: true,
    keyboard: true,
    backdrop: false,
    ignoreBackdropClick: false,
    class: 'modal-dialog--fullscreen',
  };

  constructor(public bsModalRef: BsModalRef,
              private modalService: BsModalService,
              private wordpressService: WordpressService) {
  }

  ngOnInit() {
    this.title = 'Previous Commentary';
    this.loading = this.wordpressService.getWordPressJson('47', 7)
      .takeUntil(this.ngUnsubscribe)
      .filter(x => x !== undefined)
      .flatMap(res => Observable.of(res['0']['47']))
      .subscribe(posts => {
        this.wordpressService.assignWordPressDateProperties(posts);
        this.posts = posts;
      })
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public openCommentaryModal(post: object) {
    this.insightsModalRef = this.modalService.show(InsightsCommentaryModalComponent, this.config);
    this.insightsModalRef.content.title = post['post_title'];
    this.insightsModalRef.content.commentary = this.wordpressService.getInsightPostBody(post);
    this.insightsModalRef.content.date = post['post_date_formatted'];
    gtag('event', 'insight_opened', {
      'event_category': 'engagement',
      'event_label': post['post_title']
    });
  }
}

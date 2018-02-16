import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {WordpressService} from '../../../services/wordpress.service';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';

declare var gtag: Function;
import * as moment from 'moment';

@Component({
  selector: 'cpt-market-beat',
  template: `
    <!-- PANEL CONTENTS -->
    <div [ngBusy]="loading" class="container-fluid article__container">
      <div class="article__masthead">
        <div class="row no-gutters justify-content-center masthead__head">
          <div class="col-12 col-sm-6 col-xl-5 masthead__logo">
            <img src="http://www.chaikinanalytics.com/images/logo__bearish-insights.png" alt="BearishInsights">
          </div>
          <div class="col-12 col-sm-6 col-xl-5 masthead__date">
            <!--<p>{{ shortDate }}</p>-->
            <div class="section--date-select">
              <div class="btn-group" dropdown [autoClose]="true">
                  <button dropdownToggle type="button" class="btn btn-primary dropdown-toggle">
                    {{ selectedInsight ? moment(selectedInsight['post_date']).format('MMMM Do, YYYY') : null }}
                  </button>
                <ul *dropdownMenu class="dropdown-menu" role="menu">
                    <li (click)="selectInsight(post)" *ngFor="let post of posts" role="menuitem"><a
                      class="dropdown-item">{{ moment(post['post_date']).format('MMMM Do, YYYY') }}</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="row justify-content-center masthead__body">
          <div class="col-12 col-xl-10 headline">
            <h1>{{ title }}</h1>
          </div>
          <div class="col-12 col-xl-10 author">
            <!--<p class="">Weekly commentary by {{ post?.author ? post['author'] : 'John Schlitz' }}</p>-->
          </div>
        </div>
      </div>
      <div class="article__body">
        <div class="row no-gutters justify-content-center">
          <div class="col-12 col-xl-10 featured__article">
            <div class="article__wrapper">
              <div class="article" [innerHTML]="commentary"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./commentary.scss']
})
export class CommentaryComponent implements OnInit, OnDestroy {
  private _ngUnsubscribe: Subject<void> = new Subject<void>();

  loadCount: number = 4;
  posts: object[];
  selectedInsight: object;
  commentary: string;
  opened: boolean = false;
  loading: Subscription;
  title: string;
  shortDate: string;
  moment = moment;


  constructor(private wp: WordpressService,
              private el: ElementRef) { }

  ngOnInit() {
    this.loading = this.wp.getWordPressJson('47', this.loadCount)
      .takeUntil(this._ngUnsubscribe)
      .subscribe(posts => {
        this.posts = posts[0]['47'];
        this.selectInsight(this.posts[0]);
      })
  }

  ngOnDestroy() {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

  selectInsight(post: object) {
    this.selectedInsight = post;
    this.opened = false;
    this.commentary = this.wp.getInsightPostBody(post);
    this.title = post['post_title'];
    this.shortDate = moment(post['post_date']).format('MMMM Do, YYYY');
    this.wp.assignAuthorProp([post]);
    gtag('event', 'insight_clicked', {
      'event_category': 'engagement',
      'event_label': post['post_title']
    });
  }

  toggleReadMore() {
    this.opened = !this.opened;
    gtag('event', 'read_more_toggle', {
      'event_category': 'engagement',
      'event_label': this.selectedInsight['post_title']
    });
  }

  jumpToTop() {
    this.el.nativeElement.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
  }

}

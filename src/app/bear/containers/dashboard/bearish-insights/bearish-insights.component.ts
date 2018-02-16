import {Component, OnDestroy, OnInit} from '@angular/core';
import {WordpressService} from '../../../../services/wordpress.service';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import {Router} from '@angular/router';

declare let gtag: Function;
import * as moment from 'moment';

@Component({
  selector: 'cpt-bearish-insights',
  template: `
    <div class="insights__container">
      <div class="post-head row no-gutters">
        <div class="col-12 col-sm-6 post-head__logo">
          <img src="http://www.chaikinanalytics.com/images/logo__bearish-insights.png" alt="BearishInsights">
        </div>
        <div class="col-12 col-sm-6 post-head__date">
          <p class="">{{ shortDate }}</p>
        </div>
      </div>
      <div class="row no-gutters post-body post-body--insights">
        <div class="col-12 headline">
          <h1>{{ title }}</h1>
        </div>
        <!--<p class="post-author">Weekly commentary by {{ post?.author ? post['author'] : 'John Schlitz' }}</p>-->
      </div>
      <div (click)="openCommentaryModal()" class="row no-gutters link__read-all">
        <a>Read the Weekly Newsletter &nbsp;<i class="fa fa-long-arrow-right" aria-hidden="true"></i></a>
      </div>
    </div>
  `,
  styleUrls: ['./bearish-insights.component.scss']
})
export class BearishInsightsComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  public loading: Subscription;
  public title: string;
  public shortDate: string;
  public post: object;
  public commentary: string;

  constructor(private router: Router,
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
        this.shortDate = moment(this.post['post_date']).format('MMMM Do, YYYY');
        this.wordpressService.assignAuthorProp([post]);
        this.commentary = this.wordpressService.getInsightPostBody(this.post);
        this.wordpressService.assignWordPressDateProperties([post]);
      })
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public openCommentaryModal() {
    this.router.navigate(['commentary']);
    gtag('event', 'insight_opened', {
      'event_category': 'engagement',
      'event_label': this.title
    });
  }

}


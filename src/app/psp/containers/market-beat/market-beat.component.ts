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
    <div [ngBusy]="loading" class="container-fluid component component--marketbeat">
      <div class="panel">
        <div class="article__masthead">
          <div class="row no-gutters justify-content-center masthead__head">
            <div class="col-12 col-md-6 masthead__logo">
              <img class="float-md-left" src="http://www.chaikinanalytics.com/images/logo__market-insights.png">
            </div>
            <div class="col-12 col-md-6 masthead__date">
              <div class="section--date-select">
                <div class="btn-group float-md-right" dropdown [autoClose]="true">
                  
                  <button class="btn btn-primary dropdown-toggle" mat-icon-button [matMenuTriggerFor]="appMenu">
                    {{ selectedInsight ? moment(selectedInsight['post_date']).format('MMMM Do, YYYY') : null }}
                  </button>
      
                  <mat-menu #appMenu="matMenu">
                    <button mat-menu-item class="label">Previous Insights</button>
                    <button mat-menu-item (click)="selectInsight(post)" *ngFor="let post of posts" role="menuitem">
                      <a class="dropdown-item">{{ moment(post['post_date']).format('MMMM Do, YYYY') }}</a>
                    </button>
                  </mat-menu>
                  
                </div>
              </div>
            </div>
          </div>
          <div class="row no-gutters justify-content-center masthead__body">
            <div class="col-12 col-xl-10 headline">
              <h1>{{ title }}</h1>
            </div>
            <div class="col-12 author">
              <p>Weekly Commentary By Marc Chaikin</p>
            </div>
            <div *ngIf="!opened" (click)="toggleReadMore()" class="expand-collapse">
              <i class="far fa-ellipsis-h"></i>
              <p class="article__read-more">READ FULL ARTICLE</p>
            </div>
            <div *ngIf="opened" (click)="toggleReadMore()"
             class="expand-collapse">
              <i class="far fa-scrubber"></i>
              <p class="article__read-more">COLLAPSE ARTICLE</p>
            </div>
          </div>
        </div>
        <div class="container">
          <div class="row">
  	      	<div class="col-12 section--article featured--article">
  	      		<div class="article__body" [class.opened]="opened">
  	      			<div class="article" [innerHTML]="commentary"></div>
  	      		</div>
  	      	</div>
          </div>
        </div>
      </div>

      <div id="anchor__top" class="fixed-button" (click)="jumpToTop()">
        <button mat-icon-button><i class="fal fa-chevron-double-up"></i></button>
      </div>

    </div>
  `,
  styleUrls: ['./market-beat.component.scss']
})
export class MarketBeatComponent implements OnInit, OnDestroy {
  private _ngUnsubscribe: Subject<void> = new Subject<void>();

  loadCount: number = 4;
  title: string;
  posts: object[];
  selectedInsight: object;
  commentary: string;
  opened: boolean = false;
  loading: Subscription;
  moment = moment;

  constructor(private wp: WordpressService,
              private el: ElementRef) { }

  ngOnInit() {
    this.loading = this.wp.getWordPressJson('2', this.loadCount)
      .takeUntil(this._ngUnsubscribe)
      .subscribe(posts => {
        this.posts = posts[0]['2'];
        this.selectInsight(this.posts[0]);
        console.log('post', this.selectedInsight);
      })
  }

  ngOnDestroy() {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

  selectInsight(post: object) {
    this.selectedInsight = post;
    this.title = post['post_title'];
    this.opened = false;
    this.commentary = this.wp.getInsightPostBody(post);
    gtag('event', 'insight_clicked', {
      'event_category': 'engagement',
      'event_label': post['post_title'].slice(26)
    });
  }

  toggleReadMore() {
    this.opened = !this.opened;
    gtag('event', 'read_more_toggle', {
      'event_category': 'engagement',
      'event_label': this.selectedInsight['post_title'].slice(26)
    });
  }

  jumpToTop() {
    this.el.nativeElement.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
  }

}

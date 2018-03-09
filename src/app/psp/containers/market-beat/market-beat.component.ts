import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {WordpressService} from '../../../services/wordpress.service';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';

declare var gtag: Function;

@Component({
  selector: 'cpt-market-beat',
  template: `
    <!-- PANEL CONTENTS -->
    <div [ngBusy]="loading" class="container-fluid component component--marketbeat">
      <div class="panel container article__masthead">
        <div class="row justify-content-center masthead__head">
          <div class="col-12 col-md-6 masthead__logo">
            <img class="float-md-left" src="http://www.chaikinanalytics.com/images/logo__market-insights.png">
          </div>
          <div class="col-12 col-md-6 author">
            <p>Weekly Commentary By Marc Chaikin</p>
          </div>
          <div class="col-12 masthead__date">
            <div class="section--date-select">
              <div class="btn-group" dropdown [autoClose]="true">
                  <button dropdownToggle type="button" class="btn btn-primary dropdown-toggle">
                    <!-- {{ selectedInsight ? selectedInsight['post_title'].slice(26) : null }} -->
                    January 31, 2018
                  </button>
                <ul *dropdownMenu class="dropdown-menu" role="menu">
                    <li (click)="selectInsight(post)" *ngFor="let post of posts" role="menuitem"><a
                      class="dropdown-item">{{ post['post_title'].slice(26) }}</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="row no-gutters justify-content-center masthead__body">
          <div class="col-12 col-xl-10 headline">
            <h1>Overbought Conditions, Narrowing Breadth and Rising VIX Levels Trigger Sharpest Sell-Off Since Last Fall</h1>
          </div>
        </div>
        <div class="container article__body">
          <div class="row">
  	      	<div class="col-12 section--article featured--article">
  	      		<div class="article__body" [class.opened]="opened">
  	      			<div class="article" [innerHTML]="commentary"></div>
  	      		</div>
              <div *ngIf="!opened" (click)="toggleReadMore()"
               class="expand-collapse">
                <img src="./assets/imgs/ux__expand--dots.svg">
                <p class="article__read-more">READ FULL ARTICLE</p>
              </div>
              <div *ngIf="opened" (click)="toggleReadMore()"
               class="expand-collapse">
                <img src="./assets/imgs/ux__collapse--circle.svg">
                <p class="article__read-more">COLLAPSE ARTICLE</p>
              </div>
  	      	</div>
          </div>
        </div>
      </div>

<!--       <div class="anchor__top" *ngIf="opened" (click)="jumpToTop()">
        <p>Top</p>
      </div> -->
      
      <!-- <div class="article__masthead">
        <div class="row justify-content-center masthead__head">
          <div class="col-12 col-md-6 masthead__logo">
            <img class="float-md-left" src="http://www.chaikinanalytics.com/images/logo__market-insights.png">
          </div>
          <div class="col-12 col-md-6 author">
            <p>Weekly Commentary By Marc Chaikin</p>
          </div>
          <div class="col-12 masthead__date">
            <div class="section--date-select">
              <div class="btn-group" dropdown [autoClose]="true">
                  <button dropdownToggle type="button" class="btn btn-primary dropdown-toggle">
                    <!-- {{ selectedInsight ? selectedInsight['post_title'].slice(26) : null }}
                    January 31, 2018
                  </button>
                <ul *dropdownMenu class="dropdown-menu" role="menu">
                    <li (click)="selectInsight(post)" *ngFor="let post of posts" role="menuitem"><a
                      class="dropdown-item">{{ post['post_title'].slice(26) }}</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="row no-gutters justify-content-center masthead__body">
          <div class="col-12 col-xl-10 headline">
            <h1>Overbought Conditions, Narrowing Breadth and Rising VIX Levels Trigger Sharpest Sell-Off Since Last Fall</h1>
          </div>
        </div>
      </div>
      <div class="container article__body panel">
        <div class="row">
          <div class="col-12 section--article featured--article">
            <div class="article__body" [class.opened]="opened">
              <div class="article" [innerHTML]="commentary"></div>
            </div>
            <div *ngIf="!opened" (click)="toggleReadMore()"
             class="expand-collapse">
              <img src="./assets/imgs/ux__expand--dots.svg">
              <p class="article__read-more">READ FULL ARTICLE</p>
            </div>
            <div *ngIf="opened" (click)="toggleReadMore()"
             class="expand-collapse">
              <img src="./assets/imgs/ux__collapse--circle.svg">
              <p class="article__read-more">COLLAPSE ARTICLE</p>
            </div>
          </div>
        </div>
      </div>

      <div class="anchor__top" *ngIf="opened" (click)="jumpToTop()">
        <p>Top</p>
      </div>-->

    </div>
  `,
  styleUrls: ['./market-beat.component.scss']
})
export class MarketBeatComponent implements OnInit, OnDestroy {
  private _ngUnsubscribe: Subject<void> = new Subject<void>();

  loadCount: number = 4;
  posts: object[];
  selectedInsight: object;
  commentary: string;
  opened: boolean = false;
  loading: Subscription;

  constructor(private wp: WordpressService,
              private el: ElementRef) { }

  ngOnInit() {
    this.loading = this.wp.getWordPressJson('2', this.loadCount)
      .takeUntil(this._ngUnsubscribe)
      .subscribe(posts => {
        this.posts = posts[0]['2'];
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

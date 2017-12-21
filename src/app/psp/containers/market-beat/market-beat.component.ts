import {Component, OnDestroy, OnInit} from '@angular/core';
import {WordpressService} from '../../../services/wordpress.service';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'cpt-market-beat',
  template: `
    <!-- PANEL CONTENTS -->
    <div class="container-fluid component component--marketbeat">
	    <div class="row">
	      	<div class="col-12 section--masthead masthead--featured">
	      		<h2>Market Insights</h2>
	      	</div>
	    </div>
	    <div class="row">
	      	<div class="col-12 section--date-select">
	      	</div>
        <div class="btn-group col-12 section--date-select" dropdown [autoClose]="true">
          <button dropdownToggle type="button" class="btn btn-primary dropdown-toggle">
            <h3>Sun, Oct 3, 2017</h3>
            <div class="divider__long divider__long--blue"></div>
          </button>
          <ul *dropdownMenu class="dropdown-menu" role="menu">
            <li (click)="selectList(list)" *ngFor="let post of posts" role="menuitem"><a
              class="dropdown-item">{{ post['post_title'] }}</a></li>
          </ul>
        </div>
	      	<div class="col-12 section--article featured--article">
	      		<p class="article__headline">Tech Stocks Explode Again Based on Strong Earnings Reports as Nasdaq 100 Leads Market to New Highs</p>
	      		<p class="article__author"><sub>BY</sub> Marc Chaikin</p>
	      		<div class="divider__medium"></div>
	      		<div class="article__preview">
	      			<p class="paragraph">The S&P 500 Index closed on Friday at 2,581.07 up 0.23% on the week and made another new all-time high. The real excitement, however, was in the Nasdaq 100 Index where strong earnings reports from Amazon, Alphabet, Intel and Microsoft propelled the Nasdaq Index to a high volume advance to new all-highs. New highs in the major averages were confirmed by advance/decline data and Chaikin Money Flow, but the rally is once again</p>
	      		</div>
	      		<a class="article__read-more">READ FULL ARTICLE</a>
	      	</div>
	    </div>
	    <div class="row">
	      	<div class="col-12 section--masthead masthead--education">
	      		<h2>Education &amp; News</h2>
	      	</div>
	    </div>
	    <div class="row">
	      	<div class="col-12">
	      		<h3>Market News</h3>
	      		<div class="divider__long"></div>
	      	</div>
	    </div>
	    <div class="row">
	    	<ul class="col-12">
	    		<li class="row no-gutters educational__entry">
			      	<div class="col-4 article__thumbnail" id="education--article__1">
			      	</div>
			      	<div class="col-8 section--article education--article">
			      		<p class="article__headline">Stocks Surge, Then Retreat, as Tech Sags</p>
			      		<a class="article__read-more">READ FULL ARTICLE</a>
			      	</div>
			    </li>
			    <li class="row no-gutters educational__entry">
			      	<div class="col-4 article__thumbnail" id="education--article__2">
			      	</div>
			      	<div class="col-8 section--article education--article">
			      		<p class="article__headline">Upside Target of SPX 2650 is Reached as Rally Broadens Out</p>
			      		<a class="article__read-more">READ FULL ARTICLE</a>
			      	</div>
			    </li>
			</ul>
	    </div>
	    <div class="row">
	      	<div class="col-12 section--date-select">
	      		<h3>Investing Tips</h3>
	      		<div class="divider__long"></div>
	      	</div>
	    </div>
	    <div class="row">
	    	<ul class="col-12">
	    		<li class="row no-gutters educational__entry">
			      	<div class="col-4 article__thumbnail" id="education--article__1">
			      	</div>
			      	<div class="col-8 section--article education--article">
			      		<p class="article__headline">Stocks Surge, Then Retreat, as Tech Sags</p>
			      		<a class="article__read-more">READ FULL ARTICLE</a>
			      	</div>
			    </li>
			</ul>
	    </div>
	    <div class="row">
	      	<div class="col-12">
	      		<h3>Using Chaikin</h3>
	      		<div class="divider__long"></div>
	      	</div>
	    </div>
	    <div class="row">
	    	<ul class="col-12">
	    		<li class="row no-gutters educational__entry">
			      	<div class="col-4 article__thumbnail" id="education--article__1">
			      	</div>
			      	<div class="col-8 section--article education--article">
			      		<p class="article__headline">Stocks Surge, Then Retreat, as Tech Sags</p>
			      		<a class="article__read-more">READ FULL ARTICLE</a>
			      	</div>
			    </li>
			</ul>
	    </div>
    </div>
  `,
  styleUrls: ['./market-beat.component.scss']
})
export class MarketBeatComponent implements OnInit, OnDestroy {
  private _ngUnsubscribe: Subject<void> = new Subject<void>();

  loadCount: number = 14;
  posts: object[];

  constructor(private wp: WordpressService) { }

  ngOnInit() {
    this.wp.getWordPressJson('2', this.loadCount)
      .takeUntil(this._ngUnsubscribe)
      .subscribe(posts => {
        this.posts = posts[0]['2'];
        console.log('posts', this.posts);
      })
  }

  ngOnDestroy() {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}

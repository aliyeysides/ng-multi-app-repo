import { Component, OnInit } from '@angular/core';

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
	      		<h3>Sun, Oct 3, 2017</h3>
	      		<div class="divider__long divider__long--blue"></div>
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
	      		<h2>Trading Tools</h2>
	      	</div>
	    </div>
	    <div class="row">
	      	<div class="col-12 section--date-select">
	      		<h3>Topic Number One</h3>
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
	      		<h3>Topic Number two</h3>
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
export class MarketBeatComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

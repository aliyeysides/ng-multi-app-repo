import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cpt-bearish-insights',
  template: `
    <div class="insights__container insights__container--large">
      <div class="post-head post-head--insights">
        <h2>Bearish Insights</h2>
        <div class="divider-h"></div>
        <p class="header__post-date">September 27th, 2017</p>
        <a class="post-head__button">
          <i class="fa fa-calendar" aria-hidden="true"></i>
          <span>&nbsp;Previous</span>
        </a>
      </div>
      <div class="post-body post-body--insights">
        <h5>The Dow Jones Industrials Make a Series of All-Time Highs, but the Nasdaq and the S&amp;P&nbsp;500 Indices Lag</h5>
        <h6>Key Points</h6>
        <ul>
            <li>&bull;&nbsp; Stocks hold steady as Fed confirms balance sheet unwind</li>
            <li>&bull;&nbsp; Dollar jumps the most this year as Fed sees another 2017 hike</li>
            <li>&bull;&nbsp; Yields advance +3 bps to new one-month highs</li>
            <li>&bull;&nbsp; Oil closes above $50 after inventories fail to trigger selling</li>
            <li>&bull;&nbsp; SPX, DJIA & IWC hit records. DJTA & IWM less than 1% away</li>
        </ul>
        <h6>Groups: Drugs (Rank: Strong) / Amgen – AMGN (PGR: Very Bullish)</h6>
        <p>AMGN triggered a Momentum Breakout alert yesterday. The stock traded to new record highs recently after breaking out of a 6-month ascending triangle. AMGN became overbought above the upper band, which has stalled the advance. The ensuing backing & filling, however, has been constructive, with price building a potential Bull-Flag formation. Money-Flow, Relative Strength and the PGR have all remained positive during the pullback. Look to buy AMGN when the OBOS oscillator reaches oversold territory and then turns up, provided, of course, that the Chaikin Credentials hold positive. The 1-2 month price objective is 195-200.</p>
      </div>
    </div>
  `,
  styleUrls: ['./bearish-insights.component.scss']
})
export class BearishInsightsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

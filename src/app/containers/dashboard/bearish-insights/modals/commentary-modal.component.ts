import {Component, OnInit} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {PreviousInsightsModalComponent} from './previous-modal.component';

@Component({
  selector: 'cpt-bear-commentary-insights-modal',
  template: `
    <div class="insights__container insights__container--large insights__container--modal"> 
      <div class="post-head post-head--insights">
        <h2 class="">{{title}}</h2>
        <div class="divider-h"></div>
        <p class="header__post-date">September 27th, 2017</p>
        <button type="button" class="post-head__button" aria-label="Close" (click)="bsModalRef.hide()">
          <a class="">
            <i class="fa fa-times-circle" aria-hidden="true"></i>
            <span>&nbsp;Close</span>
          </a>
        </button>
        <a (click)="openPreviousModal()" class="post-head__button">
          <i class="fa fa-calendar" aria-hidden="true"></i>
          <span>&nbsp;Previous</span>
        </a>
      </div>
      <div class="post-body">
        <div class="post-body post-body--insights">
          <h5>The Dow Jones Industrials Make a Series of All-Time Highs, but the Nasdaq and the S&amp;P&nbsp;500 Indices
            Lag</h5>
          <h6>Key Points</h6>
          <ul>
            <li>&bull;&nbsp; Stocks hold steady as Fed confirms balance sheet unwind</li>
            <li>&bull;&nbsp; Dollar jumps the most this year as Fed sees another 2017 hike</li>
            <li>&bull;&nbsp; Yields advance +3 bps to new one-month highs</li>
            <li>&bull;&nbsp; Oil closes above $50 after inventories fail to trigger selling</li>
            <li>&bull;&nbsp; SPX, DJIA & IWC hit records. DJTA & IWM less than 1% away</li>
          </ul>
          <h6>Groups: Drugs (Rank: Strong) / Amgen – AMGN (PGR: Very Bullish)</h6>
          <p>AMGN triggered a Momentum Breakout alert yesterday. The stock traded to new record highs recently after
            breaking out of a 6-month ascending triangle. AMGN became overbought above the upper band, which has stalled
            the advance.</p>
          <p>The ensuing backing & filling, however, has been constructive, with price building a potential Bull-Flag
            formation. Money-Flow, Relative Strength and the PGR have all remained positive during the pullback. Look to
            buy AMGN when the OBOS oscillator reaches oversold territory and then turns up, provided, of course, that the
            Chaikin Credentials hold positive. The 1-2 month price objective is 195-200.</p>
          <p>AMGN triggered a Momentum Breakout alert yesterday. The stock traded to new record highs recently after
            breaking out of a 6-month ascending triangle. AMGN became overbought above the upper band, which has stalled
            the advance.</p>
          <img class="img-full" src="../../assets/imgs/screen-insights-100217-1.png">
          <p>AMGN triggered a Momentum Breakout alert yesterday. The stock traded to new record highs recently after
            breaking out of a 6-month ascending triangle. AMGN became overbought above the upper band, which has stalled
            the advance.</p>
          <p>The ensuing backing & filling, however, has been constructive, with price building a potential Bull-Flag
            formation. Money-Flow, Relative Strength and the PGR have all remained positive during the pullback. Look to
            buy AMGN when the OBOS oscillator reaches oversold territory and then turns up, provided, of course, that the
            Chaikin Credentials hold positive. The 1-2 month price objective is 195-200.</p>
          <p>AMGN triggered a Momentum Breakout alert yesterday. The stock traded to new record highs recently after
            breaking out of a 6-month ascending triangle. AMGN became overbought above the upper band, which has stalled
            the advance.</p>
          <h6>Groups: Drugs (Rank: Strong) / Amgen – AMGN (PGR: Very Bullish)</h6>
          <p>AMGN triggered a Momentum Breakout alert yesterday. The stock traded to new record highs recently after
            breaking out of a 6-month ascending triangle. AMGN became overbought above the upper band, which has stalled
            the advance.</p>
          <p>The ensuing backing & filling, however, has been constructive, with price building a potential Bull-Flag
            formation. Money-Flow, Relative Strength and the PGR have all remained positive during the pullback. Look to
            buy AMGN when the OBOS oscillator reaches oversold territory and then turns up, provided, of course, that the
            Chaikin Credentials hold positive. The 1-2 month price objective is 195-200.</p>
          <p>AMGN triggered a Momentum Breakout alert yesterday. The stock traded to new record highs recently after
            breaking out of a 6-month ascending triangle. AMGN became overbought above the upper band, which has stalled
            the advance.</p>
          <img class="img-full" src="../../assets/imgs/screen-insights-100217-2.png">
          <p>AMGN triggered a Momentum Breakout alert yesterday. The stock traded to new record highs recently after
            breaking out of a 6-month ascending triangle. AMGN became overbought above the upper band, which has stalled
            the advance.</p>
          <p>The ensuing backing & filling, however, has been constructive, with price building a potential Bull-Flag
            formation. Money-Flow, Relative Strength and the PGR have all remained positive during the pullback. Look to
            buy AMGN when the OBOS oscillator reaches oversold territory and then turns up, provided, of course, that the
            Chaikin Credentials hold positive. The 1-2 month price objective is 195-200.</p>
          <h6>Small-caps were also boosted yesterday by a much stronger than expected</h6>
          <p>ISM Manufacturing report, although most analysts attributed a fair portion of the increase to the hurricanes. Nevertheless, investors have been viewing the glass as half-full for about 5 weeks now and yesterday was no exception.</p>
          <h6>Sector Performance</h6>
          <p>While 8 of 11 SPX sectors gained ground yesterday, Healthcare (+0.7%) and Financials (+0.8%) made up two-thirds of the SPX’s +0.39% gain. Healthcare was led by Pharma (REGN, AGN, MYL, GILD etc.), while the move in Financials was across-the-board (i.e. Diversified Financials, Insurance and Banks all gained about +0.8%). </p>
        </div>
        <div class="post-footer">
          <button type="button" class="btn btn-default" (click)="bsModalRef.hide()">Close</button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./commentary-modal.component.scss']
})
export class InsightsCommentaryModalComponent implements OnInit {
  public title: string;
  public list: any[] = [];
  public insightsModalRef: BsModalRef;
  public config = {
    animated: true,
    keyboard: true,
    backdrop: false,
    ignoreBackdropClick: false,
  };

  constructor(public bsModalRef: BsModalRef,
              private modalService: BsModalService) {
  }

  ngOnInit() {
    this.title = 'Mastering The Bear';
  }

  public openPreviousModal() {
    this.insightsModalRef = this.modalService.show(PreviousInsightsModalComponent, this.config);
  }
}

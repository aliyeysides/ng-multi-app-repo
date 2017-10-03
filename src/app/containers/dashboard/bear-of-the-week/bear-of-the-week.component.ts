import { Component, OnInit } from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {PreviousBearsModalComponent} from './modals/previous-modal.component';
import {WeeklyCommentaryModalComponent} from './modals/commentary-modal.component';
import {WordpressService} from '../../../core/services/wordpress.service';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {IdeasService} from '../../../core/services/ideas.service';

@Component({
  selector: 'cpt-bear-of-the-week',
  template: `
    <div class="insights__container insights__container--small">
      <div class="post-head">
        <h4>Bear of the Week</h4>
        <div class="divider-h"></div>
        <p class="header__post-date">Sept 27</p>
        <a (click)="openPreviousModal()" class="post-head__button">
          <i class="fa fa-calendar" aria-hidden="true"></i>
           <span>&nbsp;Previous</span>
        </a>
      </div>
      <div class="post-body post-body--bearpick">
        <div class="container">
          <div class="row">
            <div class="col-sm-6">
              <img class="rating" src="assets/imgs/arc_VeryBearish.svg">
              <p class="ticker" [innerHTML]="ticker"></p>
            </div>
            <div class="col-sm-6">
              <p class="data data--change down-change">-1.40%</p>
              <p class="data down-change">$336.19</p>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-6">
              <p class="company-name">Telsa Motors, Inc.</p>
            </div>
            <div class="col-sm-6">
              <p class="industry-name">Autos-Tires-Trucks</p>
            </div>
          </div>
          <div (click)="openCommentaryModal()" class="row">
            <div class="link__see-more col-sm-12">
              <a class="">See Commentary <i class="fa fa-long-arrow-right" aria-hidden="true"></i></a>
            </div>
          </div>
        </div> 
      </div>
    </div>
  `,
  styleUrls: ['./bear-of-the-week.component.scss']
})
export class BearOfTheWeekComponent implements OnInit {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public bearModalRef: BsModalRef;
  public post: object;
  public ticker: string;
  public stockData: object;
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
              private ideasService: IdeasService,
              private wordpressSerivce: WordpressService) {
  }

  ngOnInit() {
    this.wordpressSerivce.getWordPressJson('48', 1)
      .takeUntil(this.ngUnsubscribe)
      .filter(x => x !== undefined)
      .flatMap(res => Observable.of(res['0']['48'][0]) )
      .map(post => {
        this.post = post;
        return this.wordpressSerivce.getInsightPostTicker(post);
      })
      .flatMap(ticker => {
        this.ticker = ticker.trim();
        return this.ideasService.getStockCardData(this.ticker);
      })
      .subscribe(data => {
        console.log('data', data);
        this.stockData = data;
        console.log('stockData', this.stockData);
      });
  }

  public openPreviousModal() {
    this.bearModalRef = this.modalService.show(PreviousBearsModalComponent, this.config2);
  }

  public openCommentaryModal() {
    this.bearModalRef = this.modalService.show(WeeklyCommentaryModalComponent, this.config);
    this.bearModalRef.content.commentary = this.wordpressSerivce.getInsightPostBody(this.post);
  }
}

import {Component, OnDestroy, OnInit} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {WordpressService} from '../../../../../services/wordpress.service';
import {Subject} from 'rxjs/Subject';
import {IdeasService} from '../../../../../services/ideas.service';
import {SignalService} from '../../../../../services/signal.service';
import {WeeklyCommentaryModalComponent} from './commentary-modal.component';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';

declare let gtag: Function;

@Component({
  selector: 'cpt-bear-weekly-previous-modal',
  template: `
    <div class="container-fluid modal-content--bearpick">
      <div class="row no-gutters modal-head modal-head--bearpick">
        <div class="col-9">
          <h2 class="modal-title">{{ title }}</h2>
        </div>
        <div class="col-3">
          <button type="button" class="modal-head__button" aria-label="Close" (click)="bsModalRef.hide()">
            <a class="">
              <i class="fa fa-times-circle" aria-hidden="true"></i>
              <span>&nbsp;Close</span>
            </a>
          </button>
        </div>
      </div>
      <div class="modal-body">
        <ul class="container" [ngBusy]="loading">
          <li class="row" *ngFor="let post of posts">
            <ng-container *ngIf="post['data']">
              <div class="col-6">
                <img class="rating" src="{{ appendPGRImage(post['data']['pgr']['Corrected PGR Value'], post['data']['pgr']['PGR Value']) }}">
                <p class="ticker">{{ post.ticker }}</p>
              </div>
              <div class="col-6">
                <p class="company">{{ post['data']['meta-info'].name }}</p>
              </div> 
              <div class="col-6">
                <p class="pick-date">{{ post['post_date_formatted'] }}</p>
              </div>
              <div class="col-6">
                <p class="industry">{{ post['data']['meta-info'].industry_name }}</p>
              </div>
              <div class="col-12">
                <a (click)="openCommentaryModal(post)">Commentary &nbsp;<i class="fa fa-long-arrow-right" aria-hidden="true"></i></a>
              </div>
            </ng-container>
          </li>
        </ul>
      </div>
    </div>
  `
})
export class PreviousBearsModalComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  public bearModalRef: BsModalRef;
  public title: string;
  public posts = [];
  public loading: Subscription;
  public config = {
    animated: true,
    keyboard: true,
    backdrop: false,
    ignoreBackdropClick: false,
    class: 'modal-dialog--fullscreen',
  };

  constructor(public bsModalRef: BsModalRef,
              private modalService: BsModalService,
              private wordpressService: WordpressService,
              private ideasService: IdeasService,
              private signalService: SignalService) {
  }

  ngOnInit() {
    this.title = 'Previous Picks';
    this.loading = this.wordpressService.getWordPressJson('48', 7)
      .takeUntil(this.ngUnsubscribe)
      .filter(x => x !== undefined)
      .map(items => Observable.from(items['0']['48']))
      .flatMap(post => post)
      .map(post => {
        Object.assign(post, {ticker: this.wordpressService.getInsightPostTicker(post)});
        this.wordpressService.assignWordPressDateProperties([post]);
        return post;
      })
      .do(post => this.ideasService.getStockCardData(post['ticker']).subscribe(x => {
        Object.assign(post, {data: x})
      }))
      .toArray()
      .subscribe(posts => {
        this.posts = posts;
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public appendPGRImage(pgr: number, rawPgr: number) {
    return this.signalService.appendPGRImage(pgr, rawPgr);
  }

  public openCommentaryModal(post) {
    this.bearModalRef = this.modalService.show(WeeklyCommentaryModalComponent, this.config);
    this.bearModalRef.content.commentary = this.wordpressService.getInsightPostBody(post);
    gtag('event', 'bear_of_the_week_opened', {
      'event_category': 'engagement',
      'event_label': post['ticker']
    });
  }
}

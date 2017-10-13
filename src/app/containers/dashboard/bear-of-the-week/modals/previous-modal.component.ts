import {Component, OnDestroy, OnInit} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {WordpressService} from '../../../../core/services/wordpress.service';
import {Subject} from 'rxjs/Subject';
import {IdeasService} from '../../../../core/services/ideas.service';
import {SignalService} from '../../../../core/services/signal.service';
import {WeeklyCommentaryModalComponent} from './commentary-modal.component';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'cpt-bear-weekly-previous-modal',
  template: `
    <div class="insights__container insights__container--large insights__container--modal">
      <div class="post-head post-head--bearpick">
        <h2 class="modal-title pull-left">{{ title }}</h2>
        <button type="button" class="post-head__button" aria-label="Close" (click)="bsModalRef.hide()">
          <a class="">
            <i class="fa fa-times-circle" aria-hidden="true"></i>
            <span>&nbsp;Close</span>
          </a>
        </button>
      </div>
      <div class="post-body post-body--previous-pick">
        <ul [ngBusy]="loading">
          <li *ngFor="let post of posts">
            <ng-container *ngIf="post['data']">
              <img class="rating" src="{{ appendPGRImage(post['data']['pgr']['PGR Value']) }}">
              <p class="ticker">{{ post.ticker }}</p>
              <p class="company">{{ post['data']['meta-info'].name }}</p>
              <p class="industry">{{ post['data']['meta-info'].industry_name }}</p>
              <p class="pick-date">{{ post['post_date_formatted'] }}</p>
              <a (click)="openCommentaryModal(post)">Commentary</a>
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

  public appendPGRImage(pgr: number) {
    return this.signalService.appendPGRImage(pgr);
  }

  public openCommentaryModal(post) {
    this.bearModalRef = this.modalService.show(WeeklyCommentaryModalComponent, this.config);
    this.bearModalRef.content.commentary = this.wordpressService.getInsightPostBody(post);
  }
}

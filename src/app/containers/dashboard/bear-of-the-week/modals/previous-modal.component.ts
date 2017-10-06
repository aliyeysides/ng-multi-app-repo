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
        <h2 class="modal-title pull-left">{{title}}</h2>
        <button type="button" class="post-head__button" aria-label="Close" (click)="bsModalRef.hide()">
          <a class="">
            <i class="fa fa-times-circle" aria-hidden="true"></i>
            <span>&nbsp;Close</span>
          </a>
        </button>
      </div>
      <div [ngBusy]="loading" class="post-body">
        <ul>
          <li *ngFor="let post of posts">
            <img class="rating" src="{{ appendPGRImage(item?.pgr) }}">
            {{ post.ticker }}
            {{ post.name }}
            {{ post.industry_name }}
            {{ post['post_date_formatted'] }}
            <a (click)="openCommentaryModal(post)">Commentary</a>
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
      // .map(items => items['0']['48'])
      .do(res => console.log('res1', res))
      .map(post => Object.assign(post, this.ideasService.getStockCardData(post['ticker'])))
      .do(res => console.log('res2', res))
      .subscribe(posts => {
        console.log('posts in sub:', posts);
        this.wordpressService.assignWordPressDateProperties(posts);
        this.wordpressService.assignWordPressPostTickers(posts);
        this.posts = posts;
        console.log('posts done:', posts);
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public appendPGRImage(pgr: number) {
    return this.signalService.appendPGRImage(pgr);
  }

  // public openCommentaryModal(post) {
  //   this.bearModalRef = this.modalService.show(WeeklyCommentaryModalComponent, this.config);
  //   this.bearModalRef.content.commentary = this.wordpressService.getInsightPostBody(this.previousPosts[post]);
  // }
}

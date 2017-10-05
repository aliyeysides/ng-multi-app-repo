import {Component, OnInit} from '@angular/core';
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
          <li *ngFor="let item of previousBears; let i = index">
            <img class="rating" src="{{ appendPGRImage(item?.pgr) }}">
            {{ item?.Symbol }}
            {{ item?.name }}
            {{ item?.industry_name }}
            <a (click)="openCommentaryModal(i)">Commentary</a>
          </li>
        </ul>
      </div>
    </div>
  `
})
export class PreviousBearsModalComponent implements OnInit {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public bearModalRef: BsModalRef;
  public title: string;
  public previousPosts = [];
  public previousBears = [];
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
      .flatMap(items => items['0']['48'])
      .flatMap(post => {
        console.log('post', post);
        return Observable.zip(
          Observable.of(post),
          this.wordpressService.getInsightPostTicker(post)
        )
      })
      .map((post, ticker) => {
        console.log('post', post, 'ticker', ticker);
        return post;
        // this.ideasService.getStockCardData(ticker.trim())
      })
      .subscribe(data => {
        console.log('data', data);
        const post = Object.assign({}, data['meta-info'], { pgr: data['pgr']['PGR Value'] });
        this.previousBears.push(post);
        console.log('previousPosts', this.previousPosts);
        console.log('previousBears', this.previousBears);
      })
  }

  public appendPGRImage(pgr: number) {
    return this.signalService.appendPGRImage(pgr);
  }

  public openCommentaryModal(indx) {
    this.bearModalRef = this.modalService.show(WeeklyCommentaryModalComponent, this.config);
    this.bearModalRef.content.commentary = this.wordpressService.getInsightPostBody(this.previousPosts[indx]);
  }
}

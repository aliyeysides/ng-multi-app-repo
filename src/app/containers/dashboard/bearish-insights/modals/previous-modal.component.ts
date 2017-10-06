import {Component, OnDestroy, OnInit} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';
import {Subscription} from 'rxjs/Subscription';
import {WordpressService} from '../../../../core/services/wordpress.service';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'cpt-bear-previous-insights-modal',
  template: `

    <div class="insights__container insights__container--large insights__container--modal">
      <div class="post-head post-head--insights">
        <h2 class="modal-title pull-left">{{title}}</h2>
        <button type="button" class="post-head__button" aria-label="Close" (click)="bsModalRef.hide()">
          <a class="">
            <i class="fa fa-times-circle" aria-hidden="true"></i>
            <span>&nbsp;Close</span>
          </a>
        </button>
      </div>
      <div class="post-body">
        <!--<ul *ngIf="list.length">
          <li *ngFor="let item of list">{{item}}</li>
        </ul>-->
        <ul>
          <li>
            <p class="header__post-date"><i class="fa fa-calendar-o" aria-hidden="true"></i>&nbsp; September 27th, 2017</p>
            <h5>The Dow Jones Industrials Make a Series of All-Time Highs, but the Nasdaq and the S&amp;P&nbsp;500 Indices Lag</h5>
          </li>
          <li>
            <p class="header__post-date"><i class="fa fa-calendar-o" aria-hidden="true"></i>&nbsp; September 27th, 2017</p>
            <h5>The Dow Jones Industrials Make a Series of All-Time Highs, but the Nasdaq and the S&amp;P&nbsp;500 Indices Lag</h5>
          </li>
          <li>
            <p class="header__post-date"><i class="fa fa-calendar-o" aria-hidden="true"></i>&nbsp; September 27th, 2017</p>
            <h5>The Dow Jones Industrials Make a Series of All-Time Highs, but the Nasdaq and the S&amp;P&nbsp;500 Indices Lag</h5>
          </li>
          <li>
            <p class="header__post-date"><i class="fa fa-calendar-o" aria-hidden="true"></i>&nbsp; September 27th, 2017</p>
            <h5>The Dow Jones Industrials Make a Series of All-Time Highs, but the Nasdaq and the S&amp;P&nbsp;500 Indices Lag</h5>
          </li>
          <li>
            <p class="header__post-date"><i class="fa fa-calendar-o" aria-hidden="true"></i>&nbsp; September 27th, 2017</p>
            <h5>The Dow Jones Industrials Make a Series of All-Time Highs, but the Nasdaq and the S&amp;P&nbsp;500 Indices Lag</h5>
          </li>
          <li>
            <p class="header__post-date"><i class="fa fa-calendar-o" aria-hidden="true"></i>&nbsp; September 27th, 2017</p>
            <h5>The Dow Jones Industrials Make a Series of All-Time Highs, but the Nasdaq and the S&amp;P&nbsp;500 Indices Lag</h5>
          </li>
        </ul>
      </div>
    </div>
  `,
  styleUrls: ['./previous-modal.component.scss']
})
export class PreviousInsightsModalComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  public title: string;
  public list: any[] = [];
  public loading: Subscription;

  constructor(public bsModalRef: BsModalRef,
              private wordpressService: WordpressService) {
  }

  ngOnInit() {
    this.title = 'Previous Articles';
    this.loading = this.wordpressService.getWordPressJson('47', 7)
      .takeUntil(this.ngUnsubscribe)
      .filter(x => x !== undefined)
      .flatMap(res => Observable.of(res['0']['47']))
      .map(posts => {
        console.log('posts', posts);
        return posts;
      })
      .subscribe()
      // .map(post => console.log('post', post));
      // .subscribe(post => {
      //   this.post = post;
      //   this.commentary = this.wordpressService.getInsightPostBody(this.post);
      //   this.wordpressService.assignWordPressDateProperties([post]);
      // })
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}

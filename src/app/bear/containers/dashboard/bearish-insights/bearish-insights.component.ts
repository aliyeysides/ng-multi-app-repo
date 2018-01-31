import {Component, OnDestroy, OnInit} from '@angular/core';
import {WordpressService} from '../../../../services/wordpress.service';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import {Router} from '@angular/router';

declare let gtag: Function;

@Component({
  selector: 'cpt-bearish-insights',
  template: `
    <div class="insights__container">
      <div class="post-head row no-gutters">
        <div class="col-12 col-sm-6 post-head__logo">
          <img src="./assets/imgs/logo__bearish-insights.png">
        </div>
<!--         <div class="col-6 post-head__date">
          <p class="">{{ post ? post['post_date_formatted'] : null }}</p>
        </div> -->
        <div class="col-12 col-sm-6 post-head__date">
          <p class="">January 31, 2018</p>
        </div>
      </div>
<!--       <div class="row post-body post-body--insights" [ngBusy]="loading">
        <div [innerHtml]="commentary"></div>
      </div> -->
      <div class="row no-gutters post-body post-body--insights">
        <div class="col-12 headline">
          <h1>Overbought Conditions, Narrowing Breadth and Rising VIX Levels Trigger Sharpest Sell-Off Since Last Fall</h1>
        </div>
        <p class="post-author">By John Schlitz</p>
      </div>
      <div (click)="openCommentaryModal()" class="row no-gutters link__read-all">
        <a>Read the Weekly Newsletter &nbsp;<i class="fa fa-long-arrow-right" aria-hidden="true"></i></a>
      </div>
    </div>
  `,
  styleUrls: ['./bearish-insights.component.scss']
})
export class BearishInsightsComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  public loading: Subscription;
  public title: string;
  public post: object;
  public commentary: string;
  public config = {
    animated: true,
    keyboard: true,
    backdrop: false,
    ignoreBackdropClick: false,
    class: 'modal-dialog--fullscreen',
  };

  constructor(private router: Router,
              private wordpressService: WordpressService) {
  }

  ngOnInit() {
    this.loading = this.wordpressService.getWordPressJson('47', 1)
      .takeUntil(this.ngUnsubscribe)
      .filter(x => x !== undefined)
      .flatMap(res => Observable.of(res['0']['47'][0]))
      .subscribe(post => {
        this.post = post;
        this.title = post['post_title'];
        this.commentary = this.wordpressService.getInsightPostBody(this.post);
        this.wordpressService.assignWordPressDateProperties([post]);
      })
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public openCommentaryModal() {
    this.router.navigate(['commentary']);
    gtag('event', 'insight_opened', {
      'event_category': 'engagement',
      'event_label': this.title
    });
  }

}


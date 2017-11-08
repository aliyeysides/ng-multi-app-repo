import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {IdeasService} from '../../../../core/services/ideas.service';
import {AuthService} from '../../../../core/services/auth.service';
import {Subject} from 'rxjs/Subject';
import {Idea, IdeaList} from '../../../../shared/models/idea';
import {SignalService} from '../../../../core/services/signal.service';
import {Subscription} from 'rxjs/Subscription';

declare let gtag: Function;

@Component({
  selector: 'cpt-best-bear-ideas',
  template: `
    <div class="insights__container insights__container--list">
      <div class="post-head">
        <div class="clearfix">
          <h4>Best Bear Ideas</h4>
          <a (click)="viewBearList()" class="post-head__button">
            <i class="fa fa-external-link-square" aria-hidden="true"></i>
            <span>&nbsp;View List</span>
          </a>
        </div>
        <div class="col-header__container row no-gutters">
          <div class="col-header col-2">Rating</div>
          <div class="col-header col-header--ticker col-3">Ticker</div>
          <div class="col-header col-1"></div>
          <div class="col-header col-3">Last Price</div>
          <div class="col-header col-3">% Chg</div>
        </div>
      </div>
      <ul [ngBusy]="loading" class="post-body post-body--bearlist">
        <li *ngFor="let stock of bestBearIdeas" class="row no-gutters">
          <div class="col-2 stock__PGR">
            <img class="align-absolute" src="{{ appendPGRImage(stock?.PGR, stock?.raw_PGR) }}">
          </div>
          <div class="col-3 stock__ticker">
            <p class="ticker">{{ stock?.symbol }}</p>
          </div>
          <div class="col-1 stock__alert"
               [ngClass]="{'down-alert':stock?.Change<0,'up-alert':stock?.Change>0,'flat-alert':stock?.Change===0}">
            <!--<i class="fa fa-play" aria-hidden="true"></i>-->
          </div>
          <div class="col-3 stock__price">
            <p class="data" [ngClass]="{'up-change':stock?.Change>0,'down-change':stock?.Change<0}">{{ stock?.Last | decimal
              }}</p>
          </div>
          <div class="col-3 stock__price">
            <p class="data" [ngClass]="{'up-change':stock?.Change>0,'down-change':stock?.Change<0}">
              (<span *ngIf="stock?.Change>0" class="up-change">+</span>{{ stock['Percentage '] | decimal
              }}%)</p>
          </div>
        </li>
      </ul>
    </div>
  `,
  styleUrls: ['./best-bear-ideas.component.scss']
})
export class BestBearIdeasComponent implements OnInit {
  private uid: string;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  public bestBearIdeaList: IdeaList;
  public bestBearIdeas: Array<Idea>;
  public loading: Subscription;

  constructor(private router: Router,
              private authService: AuthService,
              private signalService: SignalService,
              private ideasService: IdeasService) {
  }

  ngOnInit() {
    this.loading = this.refreshData();

    setInterval(() => {
      this.refreshData()
    }, 1000 * 60);
  }

  refreshData() {
    return this.authService.currentUser$
      .map(usr => this.uid = usr['UID'])
      .takeUntil(this.ngUnsubscribe)
      .flatMap(uid => this.ideasService.getIdeasList(uid, 'Bear'))
      .flatMap(res => {
        this.bestBearIdeaList = res[0]['idea_lists'].filter(list => list.name === 'Best Bear Ideas')[0];
        return this.ideasService.getListSymbols(this.bestBearIdeaList['list_id'].toString(), this.uid)
      })
      .take(1)
      .subscribe(res => {
        this.bestBearIdeas = res['symbols'];
      });
  }

  viewBearList() {
    this.ideasService.setSelectedList(this.bestBearIdeaList);
    gtag('event', 'list_clicked', {
      'event_category': 'engagement',
      'event_label': 'Best Bear Ideas'
    });
    this.router.navigate(['/ideas']);
  }

  public appendPGRImage(pgr: number, rawPgr: number) {
    return this.signalService.appendPGRImage(pgr, rawPgr);
  }

}

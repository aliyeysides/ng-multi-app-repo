import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {IdeasService} from '../../../../services/ideas.service';
import {AuthService} from '../../../../services/auth.service';
import {Subject} from 'rxjs/Subject';
import {Idea, IdeaList} from '../../../../shared/models/idea';
import {SignalService} from '../../../../services/signal.service';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';

declare let gtag: Function;

@Component({
  selector: 'cpt-best-bear-ideas',
  template: `
    <div class="dashboard__panel dashboard__panel--list">
      <div class="dash-head">
        <div class="row no-gutters">
          <div class="col-8">
            <h4>Best Bear Ideas</h4>
          </div>
          <div class="col-4">
            <a (click)="viewBearList()" class="dash-head__button">
            <i class="fa fa-external-link-square" aria-hidden="true"></i>
            <span>&nbsp;View List</span>
            </a>
          </div>
        </div>
        <div class="col-header__container row no-gutters">
          <div class="col-header col-2">Rating</div>
          <div class="col-header col-header--ticker col-3">Ticker</div>
          <div class="col-header col-1"></div>
          <div class="col-header col-3">Last Price</div>
          <div class="col-header col-3">% Chg</div>
        </div>
      </div>
      <ul [ngBusy]="loading" class="dash-body dash-body--bearlist">
        <li *ngFor="let stock of bestBearIdeas" class="row no-gutters">
          <div class="col-2 stock__PGR">
            <img class="align-absolute" src="{{ appendPGRImage(stock?.PGR, stock?.raw_PGR) }}">
          </div>
          <div class="col-3 stock__ticker">
            <p class="ticker">{{ stock?.symbol }}</p>
          </div>
          <div (click)="openAlerts();$event.stopPropagation()" class="col-1 stock__alert down-alert">
            <i *ngIf="getAlertsForItem(stock, bestBearIdeasAlerts).length>0" class="fa fa-play" aria-hidden="true"></i>
          </div>
          <div class="col-3 stock__price">
            <p class="data" [ngClass]="{'up-change':stock?.Change>0,'down-change':stock?.Change<0}">
              {{ stock?.Last | decimal
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
  public bestBearIdeasAlerts: object[];
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
        return Observable.combineLatest(
          this.ideasService.getListSymbols(this.bestBearIdeaList['list_id'].toString(), this.uid),
          this.signalService.getSignalDataForList(this.bestBearIdeaList['list_id'].toString(), '1', this.uid));
      })
      .take(1)
      .subscribe(res => {
        this.bestBearIdeas = res[0]['symbols'];
        this.bestBearIdeasAlerts = res[1];
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

  getAlertsForItem(item: Idea, alerts: object[]) {
    return alerts.filter(x => {
      if (x['Symbol'] == item['symbol']) {
        if (x['Signals'] === '[000000000100]') {
          return Object.assign(x, {signal_text: 'Rel. Strength Sell'});
        }
        if (x['Signals'] === '[000000010000]') {
          return Object.assign(x, {signal_text: 'Money Flow Sell'});
        }
      }
    });
  }

  openAlerts() {
    this.signalService.openAlerts();
  }

}

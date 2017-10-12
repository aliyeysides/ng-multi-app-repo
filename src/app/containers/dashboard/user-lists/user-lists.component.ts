import {Component, EventEmitter, OnDestroy, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {AuthService} from '../../../core/services/auth.service';
import {Subject} from 'rxjs/Subject';
import {IdeasService} from '../../../core/services/ideas.service';
import {Idea, IdeaList} from '../../../shared/models/idea';
import {Observable} from 'rxjs/Observable';
import {SignalService} from '../../../core/services/signal.service';
import {BearSearchComponent} from '../../../core/components/bear-search/bear-search.component';
import {SymbolSearchService} from '../../../core/services/symbol-search.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'cpt-user-lists',
  template: `
    <div class="insights__container insights__container--list">
      <div class="post-head post-head--userlist">
        <div class="clearfix">
          <h4><a (click)="currentList = 'Holding'" [ngClass]="{'active': currentList === 'Holding'}">Holding</a> <span
            class="divider-toggle">|</span>
            <a (click)="currentList = 'Watching'" [ngClass]="{'active': currentList === 'Watching'}">Watching</a></h4>
          <a (click)="viewList()" class="post-head__button">
            <i class="fa fa-external-link-square" aria-hidden="true"></i>
            <span class="show">&nbsp;View List</span>
            <span class="hide">&nbsp;View</span>
          </a>
          <a (click)="openSearch();$event.stopPropagation()" class="post-head__button add_stock__button">
            <i class="fa fa-plus-circle" aria-hidden="true"></i>
            <span class="show">&nbsp;Add Stock</span>
            <span class="hide">&nbsp;Add</span>
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
      <ul [ngBusy]="loading" *ngIf="currentList === 'Holding'" class="post-body post-body--userlist">
        <li *ngFor="let item of holdingListIdeas" class="row no-gutters">
          <div class="col-2 stock__PGR">
            <img class="align-absolute" src="{{ appendPGRImage(item.PGR) }}">
          </div>
          <div class="col-3 stock__ticker">
            <p class="ticker">{{ item.symbol }}</p>
          </div>
          <div class="col-1 stock__alert">
            <i class="fa fa-bell" aria-hidden="true"></i>
          </div>
          <div class="col-3 stock__price">
            <p class="data" [ngClass]="{'up-change':item?.Change>0,'down-change':item?.Change<0}">{{ item.Last }}</p>
          </div>
          <div class="col-3 stock__price">
            <p class="data" [ngClass]="{'up-change':item?.Change>0,'down-change':item?.Change<0}">{{ item.Change }}%</p>
          </div>
          <div class="button__remove-stock">
            <!--<i class="fa fa-times" aria-hidden="true"></i>-->
          </div>
        </li>
      </ul>
      <ul *ngIf="currentList === 'Watching'" class="post-body post-body--userlist">
        <li *ngFor="let item of watchingListIdeas" class="row no-gutters">
          <div class="col-2 stock__PGR">
            <img class="align-absolute" src="{{ appendPGRImage(item.PGR) }}">
          </div>
          <div class="col-3 stock__ticker">
            <p class="ticker">{{ item.symbol }}</p>
          </div>
          <div class="col-1 stock__alert">
            <i class="fa fa-bell" aria-hidden="true"></i>
          </div>
          <div class="col-3 stock__price">
            <p class="data" [ngClass]="{'up-change':item?.Change>0,'down-change':item?.Change<0}">{{ item.Last }}</p>
          </div>
          <div class="col-3 stock__price">
            <p class="data" [ngClass]="{'up-change':item?.Change>0,'down-change':item?.Change<0}">{{ item.Change }}%</p>
          </div>
        </li>
      </ul>
    </div>
  `,
  styleUrls: ['./user-lists.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserListsComponent implements OnInit, OnDestroy {
  @Output('addStockClicked') addStockClicked: EventEmitter<null> = new EventEmitter<null>();

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private uid: string;

  public currentList = 'Holding';
  public holdingListIdeas: Array<Idea>;
  public watchingListIdeas: Array<Idea>;

  public holdingList: IdeaList;
  public watchingList: IdeaList;

  public loading: Subscription;

  constructor(private router: Router,
              private ideasService: IdeasService,
              private authService: AuthService,
              private signalService: SignalService,
              private searchService: SymbolSearchService) {
  }

  ngOnInit() {
    this.loading = this.authService.currentUser$
      .takeUntil(this.ngUnsubscribe)
      .map(usr => this.uid = usr['UID'])
      .flatMap(uid => this.ideasService.getIdeasList(uid, 'Bear'))
      .map(res => {
        this.holdingList = res[2]['user_lists'][0];
        this.watchingList = res[2]['user_lists'][1];
        return Observable.combineLatest(
          this.ideasService.getListSymbols(this.holdingList['list_id'].toString(), this.uid),
          this.ideasService.getListSymbols(this.watchingList['list_id'].toString(), this.uid)
        )
      })
      .flatMap(res => res)
      .take(1)
      .subscribe(res => {
        this.holdingListIdeas = res[0]['symbols'];
        this.watchingListIdeas = res[1]['symbols'];
      })
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public appendPGRImage(pgr: number) {
    return this.signalService.appendPGRImage(pgr);
  }

  openSearch() {
    this.searchService.setSearchOpen(true);
  }

  viewList() {
    if (this.currentList === 'Holding') {
      this.ideasService.setSelectedList(this.holdingList);
    } else if (this.currentList === 'Watching') {
      this.ideasService.setSelectedList(this.watchingList);
    }
    this.router.navigate(['/ideas']);
  }

}

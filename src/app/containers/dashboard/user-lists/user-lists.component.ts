import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../../core/services/auth.service';
import {Subject} from 'rxjs/Subject';
import {IdeasService} from '../../../core/services/ideas.service';
import {IdeaList} from '../../../shared/models/idea';
import {Observable} from 'rxjs/Observable';
import {SignalService} from '../../../core/services/signal.service';
import {BearSearchComponent} from '../../../core/components/bear-search/bear-search.component';

@Component({
  selector: 'cpt-user-lists',
  template: `
    <div class="insights__container insights__container--list">
      <div class="post-head post-head--userlist">
        <div class="clearfix">
          <h4><a (click)="currentList = 'Holding'" [ngClass]="{'active': currentList === 'Holding'}">Holding</a> <span class="divider-toggle">|</span> 
            <a (click)="currentList = 'Watching'" [ngClass]="{'active': currentList === 'Watching'}">Watching</a></h4>
          <a class="post-head__button">
            <i class="fa fa-external-link-square" aria-hidden="true"></i>
            <span>&nbsp;View List</span>
          </a>
          <a (click)="openSearch()" class="post-head__button">
            <i class="fa fa-plus-circle" aria-hidden="true"></i>
            <span>&nbsp;Add Stock</span>
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
      <ul *ngIf="currentList === 'Holding'" class="post-body post-body--userlist">
        <li *ngFor="let item of holdingList" class="row no-gutters">
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
            <p class="data">$ {{ item.Last }}</p>
          </div>
          <div class="col-3 stock__price">
            <p class="data">{{ item.Change }}%</p>
          </div>
        </li>
      </ul>
      <ul *ngIf="currentList === 'Watching'" class="post-body post-body--userlist">
        <li *ngFor="let item of watchingList" class="row no-gutters">
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
            <p class="data">$ {{ item.Last }}</p>
          </div>
          <div class="col-3 stock__price">
            <p class="data">{{ item.Change }}%</p>
          </div>
        </li>
      </ul>
    </div>
  `,
  styleUrls: ['./user-lists.component.scss']
})
export class UserListsComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private uid: string;
  private holdingId: string;
  private watchingId: string;

  public searchRef: BearSearchComponent;
  public currentList = 'Holding';
  public holdingList: IdeaList;
  public watchingList: IdeaList;

  constructor(private authService: AuthService,
              private ideasService: IdeasService,
              private signalService: SignalService) {
  }

  ngOnInit() {
    this.authService.currentUser$
      .takeUntil(this.ngUnsubscribe)
      .map(usr => this.uid = usr['UID'])
      .flatMap(uid => this.ideasService.getIdeasList(uid))
      .map(res => {
        this.holdingId = res[2]['user_lists'][0]['list_id'];
        this.watchingId = res[2]['user_lists'][1]['list_id'];
        return Observable.combineLatest(
          this.ideasService.getListSymbols(this.holdingId, this.uid),
          this.ideasService.getListSymbols(this.watchingId, this.uid)
        )
      })
      .flatMap(res => res)
      .subscribe(res => {
        console.log('res', res);
        this.holdingList = res[0]['symbols'];
        this.watchingList = res[1]['symbols'];
      })
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public appendPGRImage(pgr: number) {
    return this.signalService.appendPGRImage(pgr);
  }

  public openSearch() {
  }

}

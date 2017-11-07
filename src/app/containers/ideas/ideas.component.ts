import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {IdeasService} from '../../core/services/ideas.service';
import {Subscription} from 'rxjs/Subscription';
import {AuthService} from '../../core/services/auth.service';
import {ListViewComponent} from './list-view/list-view.component';
import {NotificationsService} from 'angular2-notifications/dist';
import {Observable} from 'rxjs/Observable';
import {IdeaList} from '../../shared/models/idea';
import {SymbolSearchService} from '../../core/services/symbol-search.service';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'cpt-ideas',
  template: `
    <div class="ideas__container" [ngBusy]="loading">
      <div class="body__top">
        <cpt-idea-lists [lists]="allLists"></cpt-idea-lists>
      </div>
      <div class="body__bottom">
        <cpt-list-view [symbolListLoading]="symbolListLoading" #list (addToListClicked)="addToList($event)"
                       (removeFromListClicked)="removeFromList($event)"></cpt-list-view>
      </div>
    </div>
  `,
  styleUrls: ['./ideas.component.scss']
})
export class IdeasComponent implements OnInit, OnDestroy {
  @ViewChild('list') list: ListViewComponent;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private uid: string;
  public allLists: object[];
  private defaultList: IdeaList;

  public loading: Subscription;
  public symbolListLoading: Subscription;

  public holdingListId: string;
  public watchingListId: string;

  constructor(private ideasService: IdeasService,
              private symbolService: SymbolSearchService,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.updateData();
    this.symbolService.addStock$
      .takeUntil(this.ngUnsubscribe).subscribe(res => this.list.refreshList());
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  updateData() {
    this.loading = this.authService.currentUser$
      .map(usr => this.uid = usr['UID'])
      .flatMap(uid => this.ideasService.getIdeasList(uid, 'Bear'))
      .filter(x => x !== undefined)
      .take(1)
      .map(res => {
        this.holdingListId = res[2]['user_lists'][0]['list_id'];
        this.watchingListId = res[2]['user_lists'][1]['list_id'];
        this.allLists = res[2]['user_lists'].concat(res[0]['idea_lists']).concat(res[1]['theme_lists']);
        this.defaultList = res[0]['idea_lists'].filter(x => x['name'] == "Best Bear Ideas")[0];
      })
      .flatMap(() => this.ideasService.selectedList)
      .take(1)
      .subscribe(list =>  {
        if (list['name'] == 'default') this.ideasService.setSelectedList(this.defaultList)
      });

  }

  addToList(params: object) {
    let listId;
    if (params['list'] === 'Holding') listId = this.holdingListId;
    if (params['list'] === 'Watching') listId = this.watchingListId;
    this.symbolListLoading = this.ideasService.addStockIntoList(listId.toString(), params['symbol'])
      .take(1)
      .subscribe(res => this.list.refreshList());
  }

  removeFromList(params: object) {
    let listId;
    if (params['list'] === 'Holding') listId = this.holdingListId;
    if (params['list'] === 'Watching') listId = this.watchingListId;
    this.symbolListLoading = this.ideasService.deleteSymbolFromList(listId.toString(), params['symbol'])
      .take(1)
      .subscribe(res => this.list.refreshList());
  }

}

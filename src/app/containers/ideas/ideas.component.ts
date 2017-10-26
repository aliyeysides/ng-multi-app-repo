import {Component, OnInit, ViewChild} from '@angular/core';
import {IdeasService} from '../../core/services/ideas.service';
import {Subscription} from 'rxjs/Subscription';
import {AuthService} from '../../core/services/auth.service';
import {ListViewComponent} from './list-view/list-view.component';
import {NotificationsService} from 'angular2-notifications/dist';
import {Observable} from 'rxjs/Observable';

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
export class IdeasComponent implements OnInit {
  @ViewChild('list') list: ListViewComponent;

  private uid: string;
  public allLists: object[];

  public loading: Subscription;
  public symbolListLoading: Subscription;

  public holdingListId: string;
  public watchingListId: string;

  constructor(private ideasService: IdeasService,
              private toast: NotificationsService,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.updateData();
  }

  updateData() {
    this.loading = this.authService.currentUser$
      .map(usr => this.uid = usr['UID'])
      .flatMap(uid => this.ideasService.getIdeasList(uid, 'Bear'))
      .filter(x => x !== undefined)
      .take(1)
      .subscribe(res => {
        this.holdingListId = res[2]['user_lists'][0]['list_id'];
        this.watchingListId = res[2]['user_lists'][1]['list_id'];
        this.allLists = res[2]['user_lists'].concat(res[0]['idea_lists']).concat(res[1]['theme_lists']);
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

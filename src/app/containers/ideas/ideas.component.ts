import {Component, OnInit} from '@angular/core';
import {IdeasService} from '../../core/services/ideas.service';
import {Subject} from 'rxjs/Subject';
import {IdeaList} from '../../shared/models/idea';
import {AuthService} from '../../core/services/auth.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'cpt-ideas',
  template: `
    <div class="ideas__container" [ngBusy]="loading">
      <div class="body__top">
        <cpt-idea-lists [lists]="allLists" (listSelected)="listSelected($event)"></cpt-idea-lists>
      </div>
      <div class="body__bottom">
        <cpt-list-view [uid]="uid" [currentList]="selectedList"></cpt-list-view>
      </div>
    </div>
  `,
  styleUrls: ['./ideas.component.scss']
})
export class IdeasComponent implements OnInit {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public allLists: object[];
  public uid: string;
  public selectedList: IdeaList;
  public loading: Subscription;

  constructor(private ideasService: IdeasService,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.loading = this.authService.currentUser$
      .takeUntil(this.ngUnsubscribe)
      .map(usr => this.uid = usr['UID'])
      .flatMap(uid => this.ideasService.getIdeasList(uid, 'Bear'))
      .filter(x => x !== undefined)
      .subscribe(res => {
        this.allLists = res[2]['user_lists'].concat(res[0]['idea_lists']).concat(res[1]['theme_lists']);
        this.loading.unsubscribe();
      });
  }

  public listSelected(list: IdeaList) {
    this.selectedList = list;
  }

}

import {Component, OnDestroy, OnInit} from '@angular/core';
import {IdeasService} from '../../core/services/ideas.service';
import {Subject} from 'rxjs/Subject';
import {IdeaList} from '../../shared/models/idea';
import {AuthService} from '../../core/services/auth.service';
import {Subscription} from 'rxjs/Subscription';
import {ActivatedRoute} from '@angular/router';

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
  public allLists: object[];
  public uid: string;
  public selectedList: IdeaList;
  public loading: Subscription;

  constructor(private ideasService: IdeasService,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.loading = this.authService.currentUser$
      .map(usr => this.uid = usr['UID'])
      .flatMap(uid => this.ideasService.getIdeasList(uid, 'Bear'))
      .filter(x => x !== undefined)
      .take(1)
      .subscribe(res => {
        this.allLists = res[2]['user_lists'].concat(res[0]['idea_lists']).concat(res[1]['theme_lists']);
      });
  }

  public listSelected(list: IdeaList) {
    this.selectedList = list;
  }

}

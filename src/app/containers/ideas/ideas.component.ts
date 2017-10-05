import {Component, OnInit} from '@angular/core';
import {IdeasService} from '../../core/services/ideas.service';
import {Subject} from 'rxjs/Subject';
import {IdeaList} from '../../shared/models/idea';
import {AuthService} from '../../core/services/auth.service';

@Component({
  selector: 'cpt-ideas',
  template: `
    <div class="ideas">
      <cpt-idea-lists [lists]="allLists" (listSelected)="listSelected($event)"></cpt-idea-lists>
      <cpt-list-view [uid]="uid" [currentList]="selectedList"></cpt-list-view>
    </div>
  `,
  styleUrls: ['./ideas.component.scss']
})
export class IdeasComponent implements OnInit {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public allLists: object[];
  public uid: string;
  public selectedList: IdeaList;

  constructor(private ideasService: IdeasService,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.currentUser$
      .takeUntil(this.ngUnsubscribe)
      .map(usr => this.uid = usr['UID'])
      .flatMap(uid => this.ideasService.getIdeasList(uid))
      .subscribe(res => {
        this.allLists = Object.assign([], res[0]['idea_lists'], res[1]['theme_lists'], res[2]['user_lists']);
      });
  }

  public listSelected(list: IdeaList) {
    this.selectedList = list;
  }

}

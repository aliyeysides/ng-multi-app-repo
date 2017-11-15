import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {IdeasService} from '../../../core/services/ideas.service';
import {IdeaList} from '../../../shared/models/idea';
import {Subscription} from 'rxjs/Subscription';
import {AuthService} from '../../../core/services/auth.service';

@Component({
  selector: 'cpt-dashboard',
  template: `
    <div class="container-fluid dashboard">
      <div class="row">
        <div class="col-md-6 col-lg-7 col-xl-8">
          <cpt-bearish-insights></cpt-bearish-insights>
          <div class="bear-lists__dashboard">
            <cpt-idea-lists [lists]="allLists" (listSelected)="listSelected($event)"></cpt-idea-lists>
          </div>
        </div>
        <div class="col-md-6 col-lg-5 col-xl-4">
          <cpt-bear-of-the-week></cpt-bear-of-the-week>
          <cpt-user-lists></cpt-user-lists>
          <cpt-best-bear-ideas></cpt-best-bear-ideas>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  public allLists: object[];
  public selectedList: IdeaList;
  public loading: Subscription;

  constructor(private ideasService: IdeasService,
              private authService: AuthService) { }

  ngOnInit() {
    this.loading = this.authService.currentUser$
      .map(usr => usr['UID'])
      .flatMap(uid => this.ideasService.getIdeasList(uid, 'Bear'))
      .filter(x => x !== undefined)
      .take(1)
      .subscribe(res => {
        this.allLists = res[0]['idea_lists'].concat(res[1]['theme_lists']);
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public listSelected(list: IdeaList) {
    this.selectedList = list;
  }

}
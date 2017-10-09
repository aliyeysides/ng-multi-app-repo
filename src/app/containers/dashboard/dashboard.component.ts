import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../core/services/auth.service';
import {Subject} from 'rxjs/Subject';
import {IdeasService} from '../../core/services/ideas.service';
import {IdeaList} from '../../shared/models/idea';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'cpt-dashboard',
  template: `
    <div class="container-fluid dashboard">
      <div class="row">
        <div class="col-md-6 col-lg-7 col-xl-8">
          <cpt-bearish-insights></cpt-bearish-insights>
          <cpt-idea-lists [lists]="allLists" (listSelected)="listSelected($event)"></cpt-idea-lists>
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

  constructor(private authService: AuthService,
              private ideasService: IdeasService) { }

  ngOnInit() {
    this.loading = this.authService.currentUser$
      .takeUntil(this.ngUnsubscribe)
      .map(usr => usr['UID'])
      .flatMap(uid => this.ideasService.getIdeasList(uid, 'Bear'))
      .filter(x => x !== undefined)
      .subscribe(res => {
        this.allLists = res[2]['user_lists'].concat(res[0]['idea_lists']).concat(res[1]['theme_lists']);
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

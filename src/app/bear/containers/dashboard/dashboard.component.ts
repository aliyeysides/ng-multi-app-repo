import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {IdeasService} from '../../../services/ideas.service';
import {IdeaList} from '../../../shared/models/idea';
import {Subscription} from 'rxjs/Subscription';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'cpt-dashboard',
  template: `
    <div class="container-fluid dashboard">
      <div class="row bearish-insights__container">

        <div class="col-12">
          <div class="row" style="height: 100%;">
            <div class="col-12 col-md-7 col-lg-8">
              <cpt-bearish-insights></cpt-bearish-insights>
            </div>
            <div class="col-12 col-md-5 col-lg-4">
              <cpt-bear-of-the-week></cpt-bear-of-the-week>
            </div>
          </div>
        </div>
      </div>

      <div class="row bearish-ideas__container">

        <div class="col-12 col-md-5 col-lg-4">
          <cpt-best-bear-ideas></cpt-best-bear-ideas>
        </div>

        <div class="col-12 col-md-7 col-lg-8 dashboard__panel" id="bearish-ideas__list">
          <cpt-idea-lists [lists]="allLists" (selectList)="selectList($event)"></cpt-idea-lists>
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

  public selectList(list: IdeaList) {
    this.selectedList = list;
  }

}

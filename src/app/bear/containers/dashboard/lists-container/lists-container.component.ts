import {Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {BestBearIdeasComponent} from '../best-bear-ideas/best-bear-ideas.component';
import {HoldingListComponent} from '../holding-list/holding-list.component';
import {WatchingListComponent} from '../watching-list/watching-list.component';
import {Router} from '@angular/router';
import {AuthService} from '../../../../services/auth.service';
import {IdeaList} from '../../../../shared/models/idea';
import {IdeasService} from '../../../../services/ideas.service';

declare var gtag: Function;

@Component({
  selector: 'cpt-lists-container',
  template: `
    <div class="dashboard__panel dashboard__panel--list">
      <div class="dash-head">
        <div class="row no-gutters">
          <div (click)="viewList(allItems[itemIndex].name)" class="col-7">
            <h4><a>{{ allItems[itemIndex].name }}</a></h4>
          </div>
          <div class="col-5">
            <div class="dash-head__toggle">
              <button (click)="leftClickPage()" class="dash-head__chevron"><a><i
                class="fa fa-chevron-left"></i></a></button>
              <ul class="dash-head__pagination">
                <li [ngClass]="{'active': currentListComponent == 'Best Bear Ideas'}"
                    (click)="loadBestBearIdeasComponent()">
                  <button tooltip="Best Bears" placement="bottom"><i class="fa fa-circle"></i></button>
                </li>
                <li [ngClass]="{'active': currentListComponent == 'Holding'}" (click)="loadHoldingComponent()">
                  <button tooltip="Holding" placement="bottom"><i
                    class="fa fa-circle"></i></button>
                </li>
                <li [ngClass]="{'active': currentListComponent == 'Watching'}" (click)="loadWatchingComponent()">
                  <button tooltip="Watching" placement="bottom"><i
                    class="fa fa-circle"></i></button>
                </li>
              </ul>
              <button (click)="rightClickPage()" class="dash-head__chevron"><i
                class="fa fa-chevron-right"></i></button>
            </div>
          </div>
        </div>
        <div class="col-header__container row no-gutters">
          <div class="col-header col-2">Rating</div>
          <div class="col-header col-header--ticker col-3">Ticker</div>
          <div class="col-header col-1"></div>
          <div class="col-header col-3">Last Price</div>
          <div class="col-header col-3">% Chg</div>
        </div>
      </div>
      <ng-template #container></ng-template>
    </div>
  `,
  entryComponents: [BestBearIdeasComponent, HoldingListComponent, WatchingListComponent],
  styleUrls: ['./lists-container.component.scss']
})
export class ListsContainerComponent implements OnInit {
  @ViewChild('container', {read: ViewContainerRef}) container: ViewContainerRef;

  currentListComponent: string;
  itemIndex: number = 0;
  holdingList: IdeaList;
  watchingList: IdeaList;
  bestBearIdeaList: IdeaList;
  allItems = [
    {
      name: 'Best Bear Ideas',
      cmp: BestBearIdeasComponent
    },
    {
      name: 'Holding',
      cmp: HoldingListComponent
    },
    {
      name: 'Watching',
      cmp: WatchingListComponent
    }
  ];

  constructor(private resolver: ComponentFactoryResolver,
              private router: Router,
              private ideasService: IdeasService,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.loadBestBearIdeasComponent();
    this.authService.currentUser$
      .flatMap(uid => this.ideasService.getIdeasList(uid['UID'], 'Bear'))
      .subscribe(res => {
        this.holdingList = res[2]['user_lists'][0];
        this.watchingList = res[2]['user_lists'][1];
        this.bestBearIdeaList = res[0]['idea_lists'].filter(list => list.name === 'Best Bear Ideas')[0];
      });
  }

  loadComponent(cmp) {
    this.container.clear();
    const factory = this.resolver.resolveComponentFactory(cmp);
    this.container.createComponent(factory);
  }

  loadBestBearIdeasComponent() {
    this.loadComponent(BestBearIdeasComponent);
    this.currentListComponent = 'Best Bear Ideas';
    this.itemIndex = 0;
  }

  loadHoldingComponent() {
    this.loadComponent(HoldingListComponent);
    this.currentListComponent = 'Holding';
    this.itemIndex = 1;
  }

  loadWatchingComponent() {
    this.loadComponent(WatchingListComponent);
    this.currentListComponent = 'Watching';
    this.itemIndex = 2;
  }

  leftClickPage() {
    this.currentListComponent = this.allItems[this.itemIndex - 1].name;
    this.itemIndex != 0 ? this.loadComponent(this.allItems[this.itemIndex - 1].cmp) : null;
    this.itemIndex > 0 ? this.itemIndex -= 1 : null;
  }

  rightClickPage() {
    this.currentListComponent = this.allItems[this.itemIndex + 1].name;
    this.itemIndex != 2 ? this.loadComponent(this.allItems[this.itemIndex + 1].cmp) : null;
    this.itemIndex < 2 ? this.itemIndex += 1 : null;
  }

  viewList(list: string) {
    if (list === 'Holding') {
      this.ideasService.setSelectedList(this.holdingList);
    }
    if (list === 'Watching') {
      this.ideasService.setSelectedList(this.watchingList);
    }
    if (list === 'Best Bear Ideas') {
      this.ideasService.setSelectedList(this.bestBearIdeaList);
    }
    gtag('event', 'list_clicked', {
      'event_category': 'engagement',
      'event_label': list
    });
    this.router.navigate(['/ideas']);
  }
}

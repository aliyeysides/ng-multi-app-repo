import {Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {BestBearIdeasComponent} from '../best-bear-ideas/best-bear-ideas.component';

@Component({
  selector: 'cpt-lists-container',
  template: `
    <div class="dashboard__panel dashboard__panel--list">
      <div class="dash-head">
        <div class="row no-gutters">
          <div class="col-7">
            <h4><a>List title goes here</a></h4>
          </div>
          <div class="col-5">
            <div class="dash-head__toggle">
              <div class="dash-head__chevron"><a><i class="fa fa-chevron-left"></i></a></div>
              <ul class="dash-head__pagination">
                <li class="" (click)="loadBestBearIdeasComponent()"><a><i class="fa fa-circle"></i></a></li>
                <li class="" (click)="loadHoldingComponent()"><a><i class="fa fa-circle"></i></a></li>
                <li class="" (click)="loadWatchingComponent()"><a><i class="fa fa-circle"></i></a></li>
              </ul>
              <div class="dash-head__chevron"><i class="fa fa-chevron-right"></i></div>
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
  entryComponents: [BestBearIdeasComponent],
  styleUrls: ['./lists-container.component.scss']
})
export class ListsContainerComponent implements OnInit {
  @ViewChild('container', {read: ViewContainerRef}) container: ViewContainerRef;

  currentListComponent;

  constructor(private resolver: ComponentFactoryResolver) { }

  ngOnInit() {
  }

  loadBestBearIdeasComponent() {
    this.container.clear();
    const factory = this.resolver.resolveComponentFactory(BestBearIdeasComponent);
    this.container.createComponent(factory);
  }

  loadHoldingComponent() {
    this.container.clear();
    const factory = this.resolver.resolveComponentFactory(BestBearIdeasComponent);
    this.container.createComponent(factory);
  }

  loadWatchingComponent() {
    this.container.clear();
    const factory = this.resolver.resolveComponentFactory(BestBearIdeasComponent);
    this.container.createComponent(factory);
  }
}

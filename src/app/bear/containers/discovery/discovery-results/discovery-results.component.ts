import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subject} from 'rxjs/Subject';
import {SignalService} from '../../../../services/signal.service';

@Component({
  selector: 'cpt-discovery-results',
  template: `
    <div class="discovery-results__container container-fluid">
      <div *ngFor="let list of lists" class="discovery-results__slider row no-gutters">
          <div *ngIf="endIndex[list['list_key']] != list['stocks'].length && list['stocks'].length > 5"
               (click)="scrollRight(list['list_key'])" class="slider__scroll slider__scroll--right">
            <img class="align-absolute" src="./assets/imgs/scroll-r.svg">
          </div>
          <div *ngIf="startIndex[list['list_key']] && startIndex[list['list_key']] != 0"
               (click)="scrollLeft(list['list_key'])" class="slider__scroll slider__scroll--left">
            <img class="align-absolute" src="./assets/imgs/scroll-l.svg">
          </div>
          <div class="discovery-slider__label">
            <p>{{ list.list_name }}</p>
          </div>
          <ul class="discovery-slider__tiles">
            <li *ngFor="let stock of ( list['stocks'].slice(startIndex[list.list_key], endIndex[list.list_key] || 5) )"
                class="tile__wrapper">
              <cpt-discovery-card (addToListClicked)="addToList($event)"
                                  (viewDiscoveryClicked)="viewDiscovery(list['list_key'], $event)"
                                  [stock]="stock"></cpt-discovery-card>
            </li>
          </ul>
      </div>
    </div>
  `,
  styleUrls: ['../discovery.component.scss']
})
export class DiscoveryResultsComponent implements AfterViewInit, OnDestroy {

  @Output('viewDiscoveryClicked') public viewDiscoveryClicked = new EventEmitter<string>();
  @Output('addToListClicked') public addToListClicked = new EventEmitter<object>();

  @Input('results')
  set results(val: object[]) {
    this._results.next(val);
  }

  get results() {
    return this._results.getValue();
  }

  private _results: BehaviorSubject<object[]> = new BehaviorSubject<object[]>([]);

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public lists: object[];
  public startIndex: object = {};
  public endIndex: object = {};

  constructor() {
  }

  ngAfterViewInit() {
    this._results
      .takeUntil(this.ngUnsubscribe)
      .filter(x => x != undefined)
      .map(res => {
        return res.filter(x => x['is_active'] == true);
      }).subscribe(res => this.lists = res)
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  addToList(params: object) {
    this.addToListClicked.emit(params);
  }

  viewDiscovery(list_key, val) {
    this.viewDiscoveryClicked.emit(val);
    this.startIndex[list_key] = 0;
    this.endIndex[list_key] = 5;
  }

  initIndexValues(list_key: string) {
    if (!this.startIndex[list_key] && !this.endIndex[list_key]) {
      this.startIndex[list_key] = 0;
      this.endIndex[list_key] = 5;
    }
  }

  scrollRight(list_key: string) {
    this.initIndexValues(list_key);
    this.startIndex[list_key] += 1;
    this.endIndex[list_key] += 1;
  }

  scrollLeft(list_key: string) {
    this.initIndexValues(list_key);
    this.startIndex[list_key] -= 1;
    this.endIndex[list_key] -= 1;
  }

}

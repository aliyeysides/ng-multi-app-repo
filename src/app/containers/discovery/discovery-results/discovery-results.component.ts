import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subject} from 'rxjs/Subject';
import {SignalService} from '../../../core/services/signal.service';

@Component({
  selector: 'cpt-discovery-results',
  template: `
    <div class="discovery-results__container container-fluid">
      <div *ngFor="let list of lists" class="discovery-results__slider row no-gutters">
        <div *ngIf="endIndex[list['list_key']] != list['stocks'].length" (click)="scrollRight(list['list_key'])" class="slider__scroll slider__scroll--right">
          <img class="align-absolute" src="./assets/imgs/scroll-r.svg">
        </div>
        <div *ngIf="startIndex[list['list_key']] && startIndex[list['list_key']] != 0" (click)="scrollLeft(list['list_key'])" class="slider__scroll slider__scroll--left">
          <img class="align-absolute" src="./assets/imgs/scroll-l.svg">
        </div>
        <div class="discovery-slider__label">
          <p>{{ list.list_name }}</p>
        </div>
        <ul class="discovery-slider__tiles">
          <li *ngFor="let stock of ( list['stocks'].slice(startIndex[list.list_key], endIndex[list.list_key] || 5) )" class="tile__wrapper">
            <cpt-discovery-card [stock]="stock"></cpt-discovery-card>
          </li>
        </ul>
      </div>
    </div>
  `,
  styleUrls: ['../discovery.component.scss']
})
export class DiscoveryResultsComponent implements AfterViewInit, OnDestroy {

  private _results: BehaviorSubject<object[]> = new BehaviorSubject<object[]>([]);
  @Input('results')
  set results(val: object[]) {
    this._results.next(val);
  }

  get results() {
    return this._results.getValue();
  }

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public lists: object[];
  public startIndex: object = {};
  public endIndex: object = {};

  constructor() {
  }

  ngAfterViewInit() {
    this._results
      .takeUntil(this.ngUnsubscribe)
      .subscribe(res => {
        this.lists = res;
      })
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
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
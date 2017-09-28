import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subject} from 'rxjs/Subject';
import {SignalService} from '../../../core/services/signal.service';

@Component({
  selector: 'cpt-discovery-results',
  template: `
    <div class="discovery-results__container container-fluid">

      <!-- ROW: SLIDER  -->
      <div *ngFor="let list of lists" class="discovery-results__slider row no-gutters">
        <div class="slider__scroll slider__scroll--right">
          <img class="align-absolute" src="assets/imgs/scroll-r.svg">
        </div>
        <div class="slider__scroll slider__scroll--left">
          <img class="align-absolute" src="assets/imgs/scroll-l.svg">
        </div>
        <div class="discovery-slider__label">
          <p>{{ list.list_name }}</p>
        </div>
        <ul class="discovery-slider__tiles">
          <li *ngFor="let stock of list['stocks']" class="tile__wrapper">
            <cpt-discovery-card [stock]="stock"></cpt-discovery-card>
          </li>
        </ul>
      </div>
      <!-- END: SLIDER  -->

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

}

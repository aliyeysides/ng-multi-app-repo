import {Component, Input, OnInit} from '@angular/core';
import {PHCGridData} from '../../../../shared/models/health-check';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'cpt-psp-power-grid',
  template: `
    <div class="col-12 col-lg-8 col-xl-8 float-lg-left">

      <div class="row">
        <div class="col-12">
          <h2>Power Grid</h2>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="divider__long"></div>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <h3>Strong Industries</h3>
        </div>

        <div class="col-12 powerGrid">
          <div class="row col-headers">
            <div class="col-6">
              <p>STRONG STOCKS</p>
            </div>
            <div class="col-6">
            </div>
          </div>
          <div class="row grid__row">
            <div class="col-6 grid__quadrant green">
              <p class="ticker"><a>BMW</a>, <a>AUDI</a></p>
              <p class="ticker"><a>JASO</a></p>
            </div>
            <div class="col-6 grid__quadrant">
              <p class="industry green">Automotive</p>
              <p class="industry green">Energy</p>
            </div>
          </div>
        </div>

        <div class="col-12 powerGrid">
          <div class="row col-headers">
            <div class="col-6">
              <p>WEAK STOCKS</p>
            </div>
            <div class="col-6">
            </div>
          </div>
          <div class="row grid__row">
            <div class="col-6 grid__quadrant red">
              <p class="ticker">DSNY</p>
            </div>
            <div class="col-6 grid__quadrant">
              <p class="industry green">Entertainment-Media</p>
            </div>
          </div>
        </div>

        <div class="col-12">
          <div class="divider__long"></div>
        </div>

        <div class="col-12">
          <h3>Weak Industries</h3>
        </div>

        <div class="col-12 powerGrid">
          <div class="row col-headers">
            <div class="col-6">
              <p>STRONG GROUPS</p>
            </div>
            <div class="col-6">
            </div>
          </div>
          <div class="row grid__row">
            <div class="col-6 grid__quadrant green">
              <p class="ticker"></p>
            </div>
            <div class="col-6 grid__quadrant">
            </div>
          </div>
        </div>

        <div class="col-12 powerGrid">
          <div class="row col-headers">
            <div class="col-6">
              <p>WEAK GROUPS</p>
            </div>
            <div class="col-6">
            </div>
          </div>
          <div class="row grid__row">
            <div class="col-6 grid__quadrant red">
              <p class="ticker"><a>BMW</a>, <a>AUDI</a>, <a>TSLA</a>, <a>AUDI</a></p>
              <p class="ticker"><a>JASO</a></p>
              <p class="ticker"><a>JASO</a></p>
            </div>
            <div class="col-6 grid__quadrant">
              <p class="industry red">Automotive</p>
              <p class="industry red">Energy</p>
              <p class="industry red">Energy</p>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-12 expand-collapse">
          <img src="./assets/imgs/icon_chevron--up.svg">
          <p>COLLAPSE</p>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['../health-check.component.scss']
})
export class PowerGridComponent implements OnInit {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private _data: BehaviorSubject<PHCGridData> = new BehaviorSubject<PHCGridData>({} as PHCGridData);
  @Input('data')
  set data(val: PHCGridData) {
    this._data.next(val);
  }

  get data() {
    return this._data.getValue();
  }

  constructor() {
  }

  ngOnInit() {
    this._data
      .takeUntil(this.ngUnsubscribe)
      .subscribe(res => console.log('grid data', res));
  }

}

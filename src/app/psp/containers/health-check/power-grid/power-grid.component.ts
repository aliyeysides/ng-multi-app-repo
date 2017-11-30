import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {PHCIndustryData, PHCGridData} from '../../../../shared/models/health-check';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'cpt-psp-power-grid',
  template: `
    <div class="col-12 col-lg-8 col-xl-8 float-lg-right">

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
          <div *ngFor="let industry of strongIndustries" class="row grid__row">
            <div *ngIf="isStrongStock(industry.SymbolPGRMappings).length>0" class="col-6 grid__quadrant green">
              <p class="ticker">
                <a *ngFor="let stock of isStrongStock(industry.SymbolPGRMappings);let last = last">
                  {{ objectKeys(stock)[0] }}
                  <span *ngIf="industry.SymbolPGRMappings.length>1 && !last">, </span>
                </a>
              </p>
            </div>
            <div *ngIf="isStrongStock(industry.SymbolPGRMappings).length>0" class="col-6 grid__quadrant">
              <p class="industry green">{{ industry.IndustryName }}</p>
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
export class PowerGridComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private _data: BehaviorSubject<PHCGridData> = new BehaviorSubject<PHCGridData>({} as PHCGridData);
  @Input('data')
  set data(val: PHCGridData) {
    this._data.next(val);
  }

  get data() {
    return this._data.getValue();
  }

  allIndustries: Array<PHCIndustryData>;
  strongIndustries: Array<PHCIndustryData>;
  weakIndustries: Array<PHCIndustryData>;

  objectKeys = Object.keys;
  objectValues = Object.values;

  constructor() {
  }

  ngOnInit() {
    this._data
      .takeUntil(this.ngUnsubscribe)
      .filter(x => x != undefined)
      .subscribe(res => {
        this.allIndustries = res['Industries'];
        this.strongIndustries = this.allIndustries.filter(x => x['IndustryScore'] > 0);
        this.weakIndustries = this.allIndustries.filter(x => x['IndustryScore'] < 0);
        console.log('strong', this.strongIndustries, 'weak', this.weakIndustries);
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  isStrongStock(arr: Array<object>): Array<object> {
    return arr.filter(x => Object.values(x)[0] > 50);
  }

}

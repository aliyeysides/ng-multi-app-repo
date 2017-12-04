import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {PHCIndustryData, PHCGridData} from '../../../../shared/models/health-check';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subject} from 'rxjs/Subject';
import {HealthCheckService} from '../../../../services/health-check.service';

@Component({
  selector: 'cpt-psp-power-grid',
  template: `
    <div id="HC--PowerGrid" class="col-12 col-lg-8 col-xl-8 float-lg-right">

      <div class="row">
        <div class="col-12">
          <h2>Power Grid</h2>
        </div>
      </div>

      <div *ngIf="!collapse" class="container">

        <div class="row">
          <div class="col-12">
            <h3>Strong Industries</h3>
            <div class="divider__long"></div>
          </div>

          <div class="col-12 col-md-6 powerGrid">
            <div class="row col-headers">
              <div class="col-6">
                <h4>STRONG STOCKS</h4>
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

          <div class="col-12 col-md-6 powerGrid">
            <div class="row col-headers">
              <div class="col-6">
                <h4>WEAK STOCKS</h4>
              </div>
              <div class="col-6">
              </div>
            </div>
            <div *ngFor="let industry of strongIndustries" class="row grid__row">
              <div *ngIf="isWeakStock(industry.SymbolPGRMappings).length>0" class="col-6 grid__quadrant red">
                <p class="ticker">
                  <a *ngFor="let stock of isWeakStock(industry.SymbolPGRMappings);let last = last">
                    {{ objectKeys(stock)[0] }}
                    <span *ngIf="industry.SymbolPGRMappings.length>1 && !last">, </span>
                  </a>
                </p>
              </div>
              <div *ngIf="isWeakStock(industry.SymbolPGRMappings).length>0" class="col-6 grid__quadrant">
                <p class="industry green">{{ industry.IndustryName }}</p>
              </div>
            </div>
          </div>

          <div class="col-12">
            <div class="divider__long"></div>
          </div>

          <div class="col-12">
            <h3>Weak Industries</h3>
          </div>

          <div class="col-12 col-md-6 powerGrid">
            <div class="row col-headers">
              <div class="col-6">
                <p>STRONG GROUPS</p>
              </div>
              <div class="col-6">
              </div>
            </div>
            <div *ngFor="let industry of weakIndustries" class="row grid__row">
              <div *ngIf="isStrongStock(industry.SymbolPGRMappings).length>0" class="col-6 grid__quadrant red">
                <p class="ticker">
                  <a *ngFor="let stock of isStrongStock(industry.SymbolPGRMappings);let last = last">
                    {{ objectKeys(stock)[0] }}
                    <span *ngIf="industry.SymbolPGRMappings.length>1 && !last">, </span>
                  </a>
                </p>
              </div>
              <div *ngIf="isStrongStock(industry.SymbolPGRMappings).length>0" class="col-6 grid__quadrant">
                <p class="industry red">{{ industry.IndustryName }}</p>
              </div>
            </div>
          </div>

          <div class="col-12 col-md-6 powerGrid">
            <div class="row col-headers">
              <div class="col-6">
                <p>WEAK GROUPS</p>
              </div>
              <div class="col-6">
              </div>
            </div>
            <div *ngFor="let industry of weakIndustries" class="row grid__row">
              <div *ngIf="isWeakStock(industry.SymbolPGRMappings).length>0" class="col-6 grid__quadrant red">
                <p class="ticker">
                  <a *ngFor="let stock of isWeakStock(industry.SymbolPGRMappings);let last = last">
                    {{ objectKeys(stock)[0] }}
                    <span *ngIf="industry.SymbolPGRMappings.length>1 && !last">, </span>
                  </a>
                </p>
              </div>
              <div *ngIf="isWeakStock(industry.SymbolPGRMappings).length>0" class="col-6 grid__quadrant">
                <p class="industry red">{{ industry.IndustryName }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div *ngIf="!collapse" (click)="toggleCollapse()" class="col-12 expand-collapse">
          <img src="./assets/imgs/icon_chevron--up.svg">
          <p>COLLAPSE</p>
        </div>
        <div *ngIf="collapse" (click)="toggleCollapse()" class="col-12 expand-collapse">
          <img src="./assets/imgs/icon_chevron--down.svg">
          <p>EXPAND</p>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['../health-check.component.scss']
})
export class PowerGridComponent implements OnInit, OnDestroy {
  private _ngUnsubscribe: Subject<void> = new Subject<void>();
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
  portUp: boolean;
  collapse: boolean = false;

  objectKeys = Object.keys;

  constructor(private healthCheck: HealthCheckService) {
  }

  ngOnInit() {
    this._data
      .takeUntil(this._ngUnsubscribe)
      .filter(x => x != undefined)
      .subscribe(res => {
        this.allIndustries = res['Industries'];
        this.strongIndustries = this.allIndustries.filter(x => x['IndustryScore'] > 0);
        this.weakIndustries = this.allIndustries.filter(x => x['IndustryScore'] < 0);
      });

    this.healthCheck.getPortfolioStatus()
      .takeUntil(this._ngUnsubscribe)
      .subscribe(res => this.portUp = res['avgPercentageChange'] > 0);
  }

  ngOnDestroy() {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

  isStrongStock(arr: Array<object>): Array<object> {
    return arr.filter(x => Object.values(x)[0] > 50);
  }

  isWeakStock(arr: Array<object>): Array<object> {
    return arr.filter(x => Object.values(x)[0] < 50);
  }

  toggleCollapse() {
    this.collapse = !this.collapse;
  }

}

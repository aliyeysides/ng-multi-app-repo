import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {PHCIndustryData, PHCGridData} from '../../../../shared/models/health-check';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subject} from 'rxjs/Subject';
import {HealthCheckService} from '../../../../services/health-check.service';
import {Router} from '@angular/router';
import {expandHeight} from '../../../../shared/animations/expandHeight';

declare var gtag: Function;

@Component({
  selector: 'cpt-psp-power-grid',
  template: `
    <div id="HC--PowerGrid" class="">
      <div class="panel container">

        <div class="row justify-content-center">
          <div class="col-12 col-xl-10" style="margin-bottom: 20px;">
            <h2><span class="hidden-xs-down">Chaikin</span> Power Grid</h2>
            <p class="paragraph">Holding strong stocks in strong Industry Groups can help improve your investment results.
              In the following display, Industry Groups containing your stocks are ordered to show the 7 strongest to 7 weakest Industry Groups.</p>
            <p class="caption"><b>Note:</b> Neutral stocks are not displayed.
            </p>
          </div>
        </div>

        <div [@expandHeight]="collapse" class="container-fluid">

          <div class="row">
            <div class="col-12 powergrid__container hidden-xs-down">
              <div class="vertical__label">
                <p>Weak Industries <span> | </span> Strong Industries
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
              </div>
              <table class="powergrid__table">
                <tr>
                  <th>Weak Stocks</th>
                  <th>Strong Stocks</th>
                  <th></th>
                </tr>
                <ng-container *ngFor="let row of rows;let index = index">
                  <ng-container *ngIf="strongIndustries">
                    <tr class="powergrid__row" id="industry-{{ index + 1 }}">
                      <td class="bear">
                        <p (click)="gotoReport(stock)" *ngFor="let stock of strongIndustries[index]?.SymbolPGRMappings"
                           class="ticker">
                          <span *ngIf="stock[objectKeys(stock)[0]] < 50">{{ objectKeys(stock)[0] }}</span>
                        </p>
                      </td>
                      <td class="bull">
                        <p (click)="gotoReport(stock)" *ngFor="let stock of strongIndustries[index]?.SymbolPGRMappings"
                           class="ticker">
                          <span *ngIf="stock[objectKeys(stock)[0]] > 50">{{ objectKeys(stock)[0] }}</span>
                        </p>
                      </td>
                      <td class="industry industry--strong">
                        <p class="industry-text">
                          <span *ngIf="strongIndustries[index]">{{ strongIndustries[index]?.IndustryName }}</span>
                        </p>
                      </td>
                    </tr>
                  </ng-container>
                </ng-container>

                <ng-container *ngFor="let row of neutralRows;let index = index">
                  <ng-container *ngIf="neutralIndustries">
                    <tr class="powergrid__row" id="industry-8">
                      <td class="bear">
                        <p (click)="gotoReport(stock)" *ngFor="let stock of neutralIndustries[index]?.SymbolPGRMappings"
                           class="ticker">
                          <span *ngIf="stock[objectKeys(stock)[0]] < 50">{{ objectKeys(stock)[0] }}</span>
                        </p>
                      </td>
                      <td class="bull">
                        <p (click)="gotoReport(stock)" *ngFor="let stock of neutralIndustries[index]?.SymbolPGRMappings"
                           class="ticker">
                          <span *ngIf="stock[objectKeys(stock)[0]] > 50">{{ objectKeys(stock)[0] }}</span>
                        </p>
                      </td>
                      <td class="industry industry--neutral">
                        <p class="industry-text">
                          <span *ngIf="neutralIndustries[index]">{{ neutralIndustries[index]?.IndustryName }}</span>
                        </p>
                      </td>
                    </tr>
                  </ng-container>
                </ng-container>

                <ng-container *ngFor="let row of rows;let index = index">
                  <ng-container *ngIf="weakIndustries">
                    <tr class="powergrid__row" id="industry-{{ index + 10 }}">
                      <td class="bear">
                        <p (click)="gotoReport(stock)" *ngFor="let stock of weakIndustries[index]?.SymbolPGRMappings"
                           class="ticker">
                          <span *ngIf="stock[objectKeys(stock)[0]] < 50">{{ objectKeys(stock)[0] }}</span>
                        </p>
                      </td>
                      <td class="bull">
                        <p (click)="gotoReport(stock)" *ngFor="let stock of weakIndustries[index]?.SymbolPGRMappings"
                           class="ticker">
                          <span *ngIf="stock[objectKeys(stock)[0]] > 50">{{ objectKeys(stock)[0] }}</span>
                        </p>
                      </td>
                      <td class="industry industry--weak">
                        <p class="industry-text">
                          <span *ngIf="weakIndustries[index]">{{ weakIndustries[index]?.IndustryName }}</span>
                        </p>
                      </td>
                    </tr>
                  </ng-container>
                </ng-container>

              </table>
            </div>

            <div class="col-12 hidden-sm-up">
              <span class="icon__separator">
                <i class="fal fa-industry-alt green"></i>
              </span>
              <h3>Strong Industries</h3>
            </div>

            <div class="col-12 hidden-sm-up powerGrid">
              <div class="row col-headers">
                <div class="col-6">
                  <h4>STRONG STOCKS</h4>
                </div>
                <div class="col-6">
                </div>
              </div>
              <div *ngFor="let industry of strongIndustries" class="row grid__row">
                <div *ngIf="getStrongStock(industry.SymbolPGRMappings).length>0" class="col-6 grid__quadrant green">
                  <p class="ticker">
                    <a (click)="gotoReport(stock)"
                       *ngFor="let stock of getStrongStock(industry.SymbolPGRMappings);let last = last">
                      {{ objectKeys(stock)[0] }}
                      <span *ngIf="industry.SymbolPGRMappings.length>1 && !last">, </span>
                    </a>
                  </p>
                </div>
                <div *ngIf="getStrongStock(industry.SymbolPGRMappings).length>0" class="col-6">
                  <p class="industry green">{{ industry.IndustryName }}</p>
                </div>
              </div>
              <p *ngIf="getIndustryStockCount(strongIndustries, getStrongStock)==0">None.</p>
            </div>

            <div class="col-12 hidden-sm-up powerGrid">
              <div class="row col-headers">
                <div class="col-6">
                  <h4>WEAK STOCKS</h4>
                </div>
                <div class="col-6">
                </div>
              </div>
              <div *ngFor="let industry of strongIndustries" class="row grid__row">
                <div *ngIf="getWeakStock(industry.SymbolPGRMappings).length>0" class="col-6 grid__quadrant red">
                  <p class="ticker">
                    <a (click)="gotoReport(stock)"
                       *ngFor="let stock of getWeakStock(industry.SymbolPGRMappings);let last = last">
                      {{ objectKeys(stock)[0] }}
                      <span *ngIf="industry.SymbolPGRMappings.length>1 && !last">, </span>
                    </a>
                  </p>
                </div>
                <div *ngIf="getWeakStock(industry.SymbolPGRMappings).length>0" class="col-6">
                  <p class="industry green">{{ industry.IndustryName }}</p>
                </div>
              </div>
              <p *ngIf="getIndustryStockCount(strongIndustries, getWeakStock)==0">None.</p>
            </div>

            <div class="col-12 hidden-sm-up" style="margin-top:40px;">
              <span class="icon__separator">
                <i class="fal fa-industry red"></i>
              </span>
              <h3>Weak Industries</h3>
            </div>

            <div class="col-12 hidden-sm-up powerGrid">
              <div class="row col-headers">
                <div class="col-6">
                  <h4>STRONG STOCKS</h4>
                </div>
                <div class="col-6">
                </div>
              </div>
              <div *ngFor="let industry of weakIndustries" class="row grid__row">
                <div *ngIf="getStrongStock(industry.SymbolPGRMappings).length>0" class="col-6 grid__quadrant green">
                  <p class="ticker">
                    <a (click)="gotoReport(stock)"
                       *ngFor="let stock of getStrongStock(industry.SymbolPGRMappings);let last = last">
                      {{ objectKeys(stock)[0] }}
                      <span *ngIf="industry.SymbolPGRMappings.length>1 && !last">, </span>
                    </a>
                  </p>
                </div>
                <div *ngIf="getStrongStock(industry.SymbolPGRMappings).length>0" class="col-6">
                  <p class="industry red">{{ industry.IndustryName }}</p>
                </div>
              </div>
              <!--<div *ngIf="getIndustryStockCount(weakIndustries, getStrongStock)==0" class="row grid__row">-->
              <p *ngIf="getIndustryStockCount(weakIndustries, getStrongStock)==0">None.</p>
            </div>

            <div class="col-12 hidden-sm-up powerGrid">
              <div class="row col-headers">
                <div class="col-6">
                  <h4 style="margin-top: 10px;">WEAK STOCKS</h4>
                </div>
                <div class="col-6">
                </div>
              </div>
              <div *ngFor="let industry of weakIndustries" class="row grid__row">
                <div *ngIf="getWeakStock(industry.SymbolPGRMappings).length>0" class="col-6 grid__quadrant red">
                  <p class="ticker">
                    <a (click)="gotoReport(stock)"
                       *ngFor="let stock of getWeakStock(industry.SymbolPGRMappings);let last = last">
                      {{ objectKeys(stock)[0] }}
                      <span *ngIf="industry.SymbolPGRMappings.length>1 && !last">, </span>
                    </a>
                  </p>
                </div>
                <div *ngIf="getWeakStock(industry.SymbolPGRMappings).length>0" class="col-6">
                  <p class="industry red">{{ industry.IndustryName }}</p>
                </div>
              </div>
              <!--<div *ngIf="getIndustryStockCount(weakIndustries, getWeakStock)==0" class="row grid__row">-->
                <!--<div class="powergrid__empty col-6">-->
                  <!--<p class="none">None</p>-->
                <!--</div>-->
              <!--&lt;!&ndash;</div>&ndash;&gt;-->
              <p *ngIf="getIndustryStockCount(weakIndustries, getWeakStock)==0">None.</p>
            </div>

          </div>
        </div>
        <div class="row">
          <div *ngIf="collapse!='closed'" (click)="collapse = 'closed'" class="col-12 expand-collapse">
            <i class="far fa-scrubber"></i>
            <p>Collapse</p>
          </div>
          <div *ngIf="collapse!='opened'" (click)="collapse = 'opened'" class="col-12 expand-collapse">
            <i class="far fa-ellipsis-h"></i>
            <p>Expand for detail</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['../health-check.component.scss'],
  animations: [expandHeight()]
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
  neutralIndustries: Array<PHCIndustryData> = [];
  weakIndustries: Array<PHCIndustryData>;
  portUp: boolean;
  collapse: string = 'opened';
  rows: Array<number> = new Array(7);
  neutralRows: Array<number> = new Array(2);
  objectKeys = Object.keys;

  constructor(private healthCheck: HealthCheckService,
              private router: Router) {
  }

  ngOnInit() {
    this._data
      .takeUntil(this._ngUnsubscribe)
      .filter(x => x != undefined)
      .subscribe(res => {
        this.allIndustries = res['Industries'];
        this.strongIndustries = this.allIndustries.filter(x => x['IndustryScore'] > 0.04);
        this.neutralIndustries = this.allIndustries.filter(x => x['IndustryScore'] <= 0.04 && x['IndustryScore'] >= -0.04);
        this.neutralIndustries.splice(1, this.neutralIndustries.length - 2);
        this.weakIndustries = this.allIndustries.filter(x => x['IndustryScore'] < -0.04);

        console.log('testty1', this.getIndustryStockCount(this.strongIndustries, this.getStrongStock));
        console.log('testty2', this.getIndustryStockCount(this.strongIndustries, this.getWeakStock));
        console.log('testty3', this.getIndustryStockCount(this.weakIndustries, this.getStrongStock));
        console.log('testty4', this.getIndustryStockCount(this.weakIndustries, this.getWeakStock));
      });

    this.healthCheck.getPortfolioStatus()
      .takeUntil(this._ngUnsubscribe)
      .subscribe(res => this.portUp = res['avgPercentageChange'] > 0);
  }

  ngOnDestroy() {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

  getStrongStock(arr: Array<object>): Array<object> {
    return arr.filter(x => Object.values(x)[0] > 50);
  }

  getWeakStock(arr: Array<object>): Array<object> {
    return arr.filter(x => Object.values(x)[0] < 50);
  }

  getIndustryStockCount(industries: Array<object>, fn: Function): number {
    if (industries) {
      let result;
      if (industries.length == 0) return 0;
      industries.forEach(ind => {
        result = fn(ind['SymbolPGRMappings']).length;
      });
      return result;
    }
  }

  gotoReport(ticker: string) {
    this.router.navigate(['stock-analysis', Object.keys(ticker)[0]]);
    gtag('event', 'stock_clicked', {
      'event_category': 'engagement',
      'event_label': ticker
    });
  }

}

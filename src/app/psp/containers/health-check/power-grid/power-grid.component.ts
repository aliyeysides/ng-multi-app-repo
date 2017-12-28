import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {PHCIndustryData, PHCGridData} from '../../../../shared/models/health-check';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subject} from 'rxjs/Subject';
import {HealthCheckService} from '../../../../services/health-check.service';
import {Router} from '@angular/router';

@Component({
  selector: 'cpt-psp-power-grid',
  template: `
    <div id="HC--PowerGrid" class="col-12 col-lg-8 col-xl-8 float-lg-right">

      <div class="row justify-content-center">
        <div class="col-12 col-xl-10">
          <h2>Power Grid</h2>
          <p class="paragraph">Holding strong stocks in strong Industry Groups can help improve your investment results.
            In the following display, Industry Groups containing your stocks are ordered to show the 8 strongest to 8
            weakest Industry Groups.</p>
          <p class="paragraph"><span>Note: <i>This grid shows the top 5 bullish and bottom 5 bearish stocks in each industry. Neutral stocks are not displayed.</i></span>
          </p>
        </div>
      </div>

      <div *ngIf="!collapse" class="container">

        <div class="row">
          <div class="col-12 powergrid__container hidden-sm-down">
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


              <tr class="powergrid__row" id="industry-8">
                <td class="bear">
                  <ng-container *ngIf="neutralIndustries?.length">
                  <p (click)="gotoReport(stock)"
                     *ngFor="let stock of neutralIndustries?.slice(0,1)[0].SymbolPGRMappings" class="ticker">
                    <span *ngIf="stock[objectKeys(stock)[0]] > 50">{{ objectKeys(stock)[0] }}</span>
                  </p>
                  </ng-container>
                </td>
                <td class="bull">
                  <ng-container *ngIf="neutralIndustries?.length">
                  <p (click)="gotoReport(stock)"
                     *ngFor="let stock of neutralIndustries?.slice(0,1)[0].SymbolPGRMappings" class="ticker">
                    <span *ngIf="stock[objectKeys(stock)[0]] < 50">{{ objectKeys(stock)[0] }}</span>
                  </p>
                  </ng-container>
                </td>
                <td class="industry industry--neutral">
                  <ng-container *ngIf="neutralIndustries?.length">
                  <p class="industry-text">
                    <span>{{ neutralIndustries ? neutralIndustries[0].IndustryName : null }}</span>
                  </p>
                  </ng-container>
                </td>
              </tr>
              <tr class="powergrid__row" id="industry-9">
                <td class="bear">
                  <ng-container *ngIf="neutralIndustries?.length">
                    <p (click)="gotoReport(stock)"
                       *ngFor="let stock of neutralIndustries?.slice(-1)[0].SymbolPGRMappings" class="ticker">
                      <span *ngIf="stock[objectKeys(stock)[0]] < 50">{{ objectKeys(stock)[0] }}</span>
                    </p>
                  </ng-container>
                </td>
                <td class="bull">
                  <ng-container *ngIf="neutralIndustries?.length">
                    <p (click)="gotoReport(stock)"
                       *ngFor="let stock of neutralIndustries?.slice(-1)[0].SymbolPGRMappings" class="ticker">
                      <span *ngIf="stock[objectKeys(stock)[0]] > 50">{{ objectKeys(stock)[0] }}</span>
                    </p>
                  </ng-container>
                </td>
                <td class="industry industry--neutral">
                  <ng-container *ngIf="neutralIndustries?.length">
                    <p class="industry-text">
                      <span>{{ neutralIndustries ? neutralIndustries[neutralIndustries.length - 1].IndustryName : null
                        }}</span>
                    </p>
                  </ng-container>
                </td>
              </tr>

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
                    <td class="industry industry--strong">
                      <p class="industry-text">
                        <span *ngIf="weakIndustries[index]">{{ weakIndustries[index]?.IndustryName }}</span>
                      </p>
                    </td>
                  </tr>
                </ng-container>
              </ng-container>

            </table>
          </div>

          <div class="col-12 hidden-md-up">
            <div class="row">
              <div class="col-5"></div>
              <div class="col-2" style="padding:0 10px;">
                <span class="icon__separator"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path
                  d="M404 384h-40c-6.627 0-12-5.373-12-12v-40c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v40c0 6.627-5.373 12-12 12zm-116-12v-40c0-6.627-5.373-12-12-12h-40c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h40c6.627 0 12-5.373 12-12zm-128 0v-40c0-6.627-5.373-12-12-12h-40c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h40c6.627 0 12-5.373 12-12zm352-188v272c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24V56c0-13.255 10.745-24 24-24h80c13.255 0 24 10.745 24 24v185.167l157.267-78.633C301.052 154.641 320 165.993 320 184v57.167l157.267-78.633C493.052 154.641 512 165.993 512 184zM96 280V64H32v384h448V196.944l-180.422 90.211C294.268 289.81 288 285.949 288 280v-83.056l-180.422 90.211C102.269 289.811 96 285.947 96 280z"/></svg></span>
              </div>
              <div class="col-5"></div>
            </div>
            <h3>Strong Industries</h3>
          </div>

          <div class="col-12 hidden-md-up powerGrid">
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
                  <a (click)="gotoReport(stock)"
                     *ngFor="let stock of isStrongStock(industry.SymbolPGRMappings);let last = last">
                    {{ objectKeys(stock)[0] }}
                    <span *ngIf="industry.SymbolPGRMappings.length>1 && !last">, </span>
                  </a>
                </p>
              </div>
              <div *ngIf="isStrongStock(industry.SymbolPGRMappings).length>0" class="col-6">
                <p class="industry green">{{ industry.IndustryName }}</p>
              </div>
            </div>
          </div>

          <div class="col-12 hidden-md-up powerGrid">
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
                  <a (click)="gotoReport(stock)"
                     *ngFor="let stock of isWeakStock(industry.SymbolPGRMappings);let last = last">
                    {{ objectKeys(stock)[0] }}
                    <span *ngIf="industry.SymbolPGRMappings.length>1 && !last">, </span>
                  </a>
                </p>
              </div>
              <div *ngIf="isWeakStock(industry.SymbolPGRMappings).length>0" class="col-6">
                <p class="industry green">{{ industry.IndustryName }}</p>
              </div>
            </div>
          </div>

          <div class="col-12 hidden-md-up">
            <div class="row" style="margin-top:40px;">
              <div class="col-5"></div>
              <div class="col-2" style="padding:0 10px;">
                <span class="icon__separator"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path
                  d="M477.267 162.534L320 241.167V184c0-18.007-18.948-29.359-34.733-21.466L128 241.167V56c0-13.255-10.745-24-24-24H24C10.745 32 0 42.745 0 56v400c0 13.255 10.745 24 24 24h464c13.255 0 24-10.745 24-24V184c0-18.007-18.948-29.359-34.733-21.466zM107.578 287.155L288 196.944V280c0 5.949 6.268 9.81 11.578 7.155L480 196.944V448H32V64h64v216c0 5.947 6.269 9.811 11.578 7.155z"/></svg></span>
              </div>
              <div class="col-5"></div>
            </div>
            <h3>Weak Industries</h3>
          </div>

          <div class="col-12 hidden-md-up powerGrid">
            <div class="row col-headers">
              <div class="col-6">
                <h4>STRONG STOCKS</h4>
              </div>
              <div class="col-6">
              </div>
            </div>
            <div *ngFor="let industry of weakIndustries" class="row grid__row">
              <div *ngIf="isStrongStock(industry.SymbolPGRMappings).length>0" class="col-6 grid__quadrant green">
                <p class="ticker">
                  <a (click)="gotoReport(stock)"
                     *ngFor="let stock of isStrongStock(industry.SymbolPGRMappings);let last = last">
                    {{ objectKeys(stock)[0] }}
                    <span *ngIf="industry.SymbolPGRMappings.length>1 && !last">, </span>
                  </a>
                </p>
              </div>
              <div *ngIf="isStrongStock(industry.SymbolPGRMappings).length>0" class="col-6">
                <p class="industry red">{{ industry.IndustryName }}</p>
              </div>
            </div>
          </div>

          <div class="col-12 hidden-md-up powerGrid">
            <div class="row col-headers">
              <div class="col-6">
                <h4>WEAK STOCKS</h4>
              </div>
              <div class="col-6">
              </div>
            </div>
            <div *ngFor="let industry of weakIndustries" class="row grid__row">
              <div *ngIf="isWeakStock(industry.SymbolPGRMappings).length>0" class="col-6 grid__quadrant red">
                <p class="ticker">
                  <a (click)="gotoReport(stock)"
                     *ngFor="let stock of isWeakStock(industry.SymbolPGRMappings);let last = last">
                    {{ objectKeys(stock)[0] }}
                    <span *ngIf="industry.SymbolPGRMappings.length>1 && !last">, </span>
                  </a>
                </p>
              </div>
              <div *ngIf="isWeakStock(industry.SymbolPGRMappings).length>0" class="col-6">
                <p class="industry red">{{ industry.IndustryName }}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
      <div class="row">
        <div *ngIf="!collapse" (click)="toggleCollapse()" class="col-12 expand-collapse">
          <img src="./assets/imgs/ux__collapse--circle.svg">
          <p>Collapse</p>
        </div>
        <div *ngIf="collapse" (click)="toggleCollapse()" class="col-12 expand-collapse">
          <img src="./assets/imgs/ux__expand--circle.svg">
          <p>Expand for detail</p>
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
  neutralIndustries: Array<PHCIndustryData>;
  weakIndustries: Array<PHCIndustryData>;
  portUp: boolean;
  collapse: boolean = false;
  rows: Array<number> = new Array(7);
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
        this.strongIndustries = this.allIndustries.filter(x => x['IndustryScore'] > 0.4);
        this.neutralIndustries = this.allIndustries.filter(x => x['IndustryScore'] <= 0.4 && x['IndustryScore'] >= -0.4);
        this.weakIndustries = this.allIndustries.filter(x => x['IndustryScore'] < -0.4);
        console.log('industries', 'strong:', this.strongIndustries, 'neutral:', this.neutralIndustries, 'weak:', this.weakIndustries, 'all:', this.allIndustries);
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

  gotoReport(ticker: string) {
    this.router.navigate(['my-stocks', Object.keys(ticker)[0]]);
  }

}
